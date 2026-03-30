import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { successResponse, errorResponse } from '../shared/utils/response';

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const USERS_TABLE = process.env.USERS_TABLE!;

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

    if (method === 'GET') {
      return await getPreferences(userId);
    } else if (method === 'PUT') {
      return await updatePreferences(userId, event);
    }

    return errorResponse('Not found', 404);
  } catch (error: any) {
    console.error('Notification handler error:', error);
    return errorResponse(error.message || 'Internal server error');
  }
}

async function getPreferences(userId: string): Promise<APIGatewayProxyResult> {
  const result = await dynamoClient.send(new GetCommand({
    TableName: USERS_TABLE,
    Key: { userId },
  }));

  if (!result.Item) {
    return errorResponse('User not found', 404);
  }

  return successResponse({
    notificationsEnabled: result.Item.notificationsEnabled ?? true,
  });
}

async function updatePreferences(userId: string, event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { notificationsEnabled } = body;

  if (typeof notificationsEnabled !== 'boolean') {
    return errorResponse('notificationsEnabled must be a boolean', 400);
  }

  await dynamoClient.send(new UpdateCommand({
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: 'SET notificationsEnabled = :enabled',
    ExpressionAttributeValues: {
      ':enabled': notificationsEnabled,
    },
  }));

  return successResponse({ message: 'Preferences updated successfully' });
}
