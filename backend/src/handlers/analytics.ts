import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { successResponse, errorResponse } from '../shared/utils/response';
import { WardrobeItem, Outfit } from '../types';

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const WARDROBE_TABLE = process.env.WARDROBE_TABLE!;
const OUTFITS_TABLE = process.env.OUTFITS_TABLE!;

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

    const analytics = await calculateAnalytics(userId);
    return successResponse(analytics);
  } catch (error: any) {
    console.error('Analytics handler error:', error);
    return errorResponse(error.message || 'Internal server error');
  }
}

async function calculateAnalytics(userId: string) {
  // Get all wardrobe items
  const wardrobeResult = await dynamoClient.send(new QueryCommand({
    TableName: WARDROBE_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  }));
  const items = (wardrobeResult.Items || []) as WardrobeItem[];

  // Get all outfits
  const outfitsResult = await dynamoClient.send(new QueryCommand({
    TableName: OUTFITS_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  }));
  const outfits = (outfitsResult.Items || []) as Outfit[];

  // Calculate most worn items
  const mostWornItems = items
    .filter(item => item.timesWorn > 0)
    .sort((a, b) => b.timesWorn - a.timesWorn)
    .slice(0, 5);

  // Calculate least worn items
  const leastWornItems = items
    .filter(item => item.timesWorn > 0)
    .sort((a, b) => a.timesWorn - b.timesWorn)
    .slice(0, 5);

  // Calculate outfit frequency by month
  const outfitFrequency: Record<string, number> = {};
  outfits.forEach(outfit => {
    const month = outfit.date.substring(0, 7); // YYYY-MM
    outfitFrequency[month] = (outfitFrequency[month] || 0) + 1;
  });

  return {
    mostWornItems,
    leastWornItems,
    outfitFrequency,
    totalItems: items.length,
    totalOutfits: outfits.length,
  };
}
