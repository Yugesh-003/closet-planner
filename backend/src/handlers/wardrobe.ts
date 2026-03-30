import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { successResponse, errorResponse } from '../shared/utils/response';
import { v4 as uuidv4 } from 'uuid';

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
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

    // Extract userId from Cognito authorizer
    const userId = event.requestContext.authorizer?.claims?.sub;
    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const method = event.httpMethod;
    const pathParameters = event.pathParameters;

    if (method === 'GET') {
      return await getItems(userId);
    } else if (method === 'POST') {
      return await addItem(userId, event);
    } else if (method === 'PUT' && pathParameters?.itemId) {
      return await updateItem(userId, pathParameters.itemId, event);
    } else if (method === 'DELETE' && pathParameters?.itemId) {
      return await deleteItem(userId, pathParameters.itemId);
    }

    return errorResponse('Not found', 404);
  } catch (error: any) {
    console.error('Wardrobe handler error:', error);
    return errorResponse(error.message || 'Internal server error');
  }
}

async function getItems(userId: string): Promise<APIGatewayProxyResult> {
  const result = await dynamoClient.send(new QueryCommand({
    TableName: WARDROBE_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  }));

  return successResponse({ items: result.Items || [] });
}

async function addItem(userId: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { name, type, category, color, fabric, occasion, comfort, weatherSuitability, imageUrl } = body;

  if (!name || !type || !category || !color) {
    return errorResponse('Name, type, category, and color are required', 400);
  }

  const item = {
    userId,
    itemId: uuidv4(),
    name,
    type,
    category,
    color,
    fabric: fabric || '',
    occasion: occasion || [],
    comfort: comfort || 'medium',
    weatherSuitability: weatherSuitability || [],
    lastWorn: null,
    timesWorn: 0,
    imageUrl: imageUrl || null,
    createdAt: new Date().toISOString(),
  };

  await dynamoClient.send(new PutCommand({
    TableName: WARDROBE_TABLE,
    Item: item,
  }));

  return successResponse(item, 201);
}

async function updateItem(userId: string, itemId: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  
  const updateExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};
  const expressionAttributeNames: Record<string, string> = {};

  const updatableFields = ['name', 'type', 'category', 'color', 'fabric', 'occasion', 'comfort', 'weatherSuitability', 'imageUrl'];
  
  updatableFields.forEach(field => {
    if (body[field] !== undefined) {
      updateExpressions.push(`#${field} = :${field}`);
      expressionAttributeValues[`:${field}`] = body[field];
      expressionAttributeNames[`#${field}`] = field;
    }
  });

  if (updateExpressions.length === 0) {
    return errorResponse('No fields to update', 400);
  }

  await dynamoClient.send(new UpdateCommand({
    TableName: WARDROBE_TABLE,
    Key: { userId, itemId },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: expressionAttributeNames,
  }));

  return successResponse({ message: 'Item updated successfully' });
}

async function deleteItem(userId: string, itemId: string): Promise<APIGatewayProxyResult> {
  await dynamoClient.send(new DeleteCommand({
    TableName: WARDROBE_TABLE,
    Key: { userId, itemId },
  }));

  return successResponse({ message: 'Item deleted successfully' });
}
