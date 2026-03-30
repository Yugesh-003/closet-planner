import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { successResponse, errorResponse } from '../shared/utils/response';
import { v4 as uuidv4 } from 'uuid';

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const EVENTS_TABLE = process.env.EVENTS_TABLE!;

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
      return await getEvents(userId);
    } else if (method === 'POST') {
      return await createEvent(userId, event);
    } else if (method === 'PUT' && pathParameters?.eventId) {
      return await updateEvent(userId, pathParameters.eventId, event);
    } else if (method === 'DELETE' && pathParameters?.eventId) {
      return await deleteEvent(userId, pathParameters.eventId);
    }

    return errorResponse('Not found', 404);
  } catch (error: any) {
    console.error('Events handler error:', error);
    return errorResponse(error.message || 'Internal server error');
  }
}

async function getEvents(userId: string): Promise<APIGatewayProxyResult> {
  const result = await dynamoClient.send(new QueryCommand({
    TableName: EVENTS_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  }));

  return successResponse({ events: result.Items || [] });
}

async function createEvent(userId: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { title, date, type } = body;

  if (!title || !date || !type) {
    return errorResponse('Title, date, and type are required', 400);
  }

  const newEvent = {
    userId,
    eventId: uuidv4(),
    title,
    date,
    type,
    createdAt: new Date().toISOString(),
  };

  await dynamoClient.send(new PutCommand({
    TableName: EVENTS_TABLE,
    Item: newEvent,
  }));

  return successResponse(newEvent, 201);
}

async function updateEvent(userId: string, eventId: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  
  const updateExpressions: string[] = [];
  const expressionAttributeValues: Record<string, any> = {};

  if (body.title) {
    updateExpressions.push('title = :title');
    expressionAttributeValues[':title'] = body.title;
  }
  if (body.date) {
    updateExpressions.push('#date = :date');
    expressionAttributeValues[':date'] = body.date;
  }
  if (body.type) {
    updateExpressions.push('#type = :type');
    expressionAttributeValues[':type'] = body.type;
  }

  if (updateExpressions.length === 0) {
    return errorResponse('No fields to update', 400);
  }

  await dynamoClient.send(new UpdateCommand({
    TableName: EVENTS_TABLE,
    Key: { userId, eventId },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ExpressionAttributeNames: { '#date': 'date', '#type': 'type' },
  }));

  return successResponse({ message: 'Event updated successfully' });
}

async function deleteEvent(userId: string, eventId: string): Promise<APIGatewayProxyResult> {
  await dynamoClient.send(new DeleteCommand({
    TableName: EVENTS_TABLE,
    Key: { userId, eventId },
  }));

  return successResponse({ message: 'Event deleted successfully' });
}
