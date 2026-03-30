import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { successResponse, errorResponse } from '../shared/utils/response';

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const OUTFITS_TABLE = process.env.OUTFITS_TABLE!;
const WARDROBE_TABLE = process.env.WARDROBE_TABLE!;

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        },
        body: '',
      };
    }

    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const method = event.httpMethod;
    const pathParameters = event.pathParameters;

    if (method === 'GET') {
      return await getOutfits(userId, event);
    } else if (method === 'POST') {
      return await logOutfit(userId, event);
    } else if (method === 'PUT' && pathParameters?.date) {
      return await updateOutfit(userId, pathParameters.date, event);
    } else if (method === 'DELETE' && pathParameters?.date) {
      return await deleteOutfit(userId, pathParameters.date);
    }

    return errorResponse('Not found', 404);
  } catch (error: any) {
    console.error('Outfit handler error:', error);
    return errorResponse(error.message || 'Internal server error');
  }
}

async function getOutfits(userId: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const queryParams = event.queryStringParameters || {};
  const startDate = queryParams.startDate;
  const endDate = queryParams.endDate;

  let keyConditionExpression = 'userId = :userId';
  const expressionAttributeValues: Record<string, any> = {
    ':userId': userId,
  };

  if (startDate && endDate) {
    keyConditionExpression += ' AND #date BETWEEN :startDate AND :endDate';
    expressionAttributeValues[':startDate'] = startDate;
    expressionAttributeValues[':endDate'] = endDate;
  }

  const result = await dynamoClient.send(new QueryCommand({
    TableName: OUTFITS_TABLE,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: startDate && endDate ? { '#date': 'date' } : undefined,
  }));

  return successResponse({ outfits: result.Items || [] });
}

async function logOutfit(userId: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { date, itemIds, eventType } = body;

  if (!date || !itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return errorResponse('Date and itemIds array are required', 400);
  }

  const outfit = {
    userId,
    date,
    itemIds,
    eventType: eventType || null,
    createdAt: new Date().toISOString(),
  };

  // Save outfit
  await dynamoClient.send(new PutCommand({
    TableName: OUTFITS_TABLE,
    Item: outfit,
  }));

  // Update usage tracking for wardrobe items
  await updateUsageTracking(userId, itemIds, date);

  return successResponse(outfit, 201);
}

async function updateOutfit(userId: string, date: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { itemIds } = body;

  if (!itemIds || !Array.isArray(itemIds)) {
    return errorResponse('itemIds array is required', 400);
  }

  await dynamoClient.send(new UpdateCommand({
    TableName: OUTFITS_TABLE,
    Key: { userId, date },
    UpdateExpression: 'SET itemIds = :itemIds',
    ExpressionAttributeValues: {
      ':itemIds': itemIds,
    },
  }));

  // Update usage tracking
  await updateUsageTracking(userId, itemIds, date);

  return successResponse({ message: 'Outfit updated successfully' });
}

async function deleteOutfit(userId: string, date: string): Promise<APIGatewayProxyResult> {
  await dynamoClient.send(new DeleteCommand({
    TableName: OUTFITS_TABLE,
    Key: { userId, date },
  }));

  return successResponse({ message: 'Outfit deleted successfully' });
}

async function updateUsageTracking(userId: string, itemIds: string[], date: string): Promise<void> {
  // Update lastWorn and increment timesWorn for each item
  for (const itemId of itemIds) {
    try {
      await dynamoClient.send(new UpdateCommand({
        TableName: WARDROBE_TABLE,
        Key: { userId, itemId },
        UpdateExpression: 'SET lastWorn = :date, timesWorn = if_not_exists(timesWorn, :zero) + :one',
        ExpressionAttributeValues: {
          ':date': date,
          ':zero': 0,
          ':one': 1,
        },
      }));
    } catch (error) {
      console.error(`Failed to update usage for item ${itemId}:`, error);
    }
  }
}
