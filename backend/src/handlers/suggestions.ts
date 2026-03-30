import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { successResponse, errorResponse } from '../shared/utils/response';
import { WardrobeItem, Outfit, OutfitSuggestion } from '../types';
import axios from 'axios';

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const WARDROBE_TABLE = process.env.WARDROBE_TABLE!;
const OUTFITS_TABLE = process.env.OUTFITS_TABLE!;
const EVENTS_TABLE = process.env.EVENTS_TABLE!;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

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

    const queryParams = event.queryStringParameters || {};
    const date = queryParams.date || new Date().toISOString().split('T')[0];
    const eventId = queryParams.eventId;

    const suggestions = await generateSuggestions(userId, date, eventId);
    return successResponse({ suggestions });
  } catch (error: any) {
    console.error('Suggestions handler error:', error);
    return errorResponse(error.message || 'Internal server error');
  }
}

async function generateSuggestions(userId: string, date: string, eventId?: string): Promise<OutfitSuggestion[]> {
  // Get wardrobe items
  const wardrobeResult = await dynamoClient.send(new QueryCommand({
    TableName: WARDROBE_TABLE,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
  }));
  const items = (wardrobeResult.Items || []) as WardrobeItem[];

  // Get recent outfits (last 5 days)
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const outfitsResult = await dynamoClient.send(new QueryCommand({
    TableName: OUTFITS_TABLE,
    KeyConditionExpression: 'userId = :userId AND #date >= :fiveDaysAgo',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':fiveDaysAgo': fiveDaysAgo,
    },
    ExpressionAttributeNames: { '#date': 'date' },
  }));
  const recentOutfits = (outfitsResult.Items || []) as Outfit[];

  // Get recently worn item IDs
  const recentlyWornIds = new Set(recentOutfits.flatMap(o => o.itemIds));

  // Get event type if eventId provided
  let eventType: string | undefined;
  if (eventId) {
    const eventResult = await dynamoClient.send(new GetCommand({
      TableName: EVENTS_TABLE,
      Key: { userId, eventId },
    }));
    eventType = eventResult.Item?.type;
  }

  // Get weather (simplified - would call actual API)
  const weather = await getWeather(date);

  // Filter items
  let availableItems = items.filter(item => !recentlyWornIds.has(item.itemId));

  // Filter by weather
  if (weather && availableItems.length > 0) {
    const weatherFiltered = availableItems.filter(item => 
      item.weatherSuitability.length === 0 || item.weatherSuitability.includes(weather)
    );
    if (weatherFiltered.length > 0) {
      availableItems = weatherFiltered;
    }
  }

  // Filter by occasion if event type provided
  if (eventType && availableItems.length > 0) {
    const occasionFiltered = availableItems.filter(item =>
      item.occasion.length === 0 || item.occasion.includes(eventType)
    );
    if (occasionFiltered.length > 0) {
      availableItems = occasionFiltered;
    }
  }

  // Generate combinations
  const suggestions: OutfitSuggestion[] = [];
  const tops = availableItems.filter(i => i.type === 'top');
  const bottoms = availableItems.filter(i => i.type === 'bottom');
  const dresses = availableItems.filter(i => ['dress', 'saree'].includes(i.type));

  // Add dress/saree suggestions
  for (const dress of dresses.slice(0, 2)) {
    suggestions.push({
      items: [dress],
      reasoning: [
        `Complete outfit: ${dress.name}`,
        weather ? `Suitable for ${weather} weather` : '',
        eventType ? `Appropriate for ${eventType} event` : '',
      ].filter(Boolean),
      score: 90,
    });
  }

  // Add top + bottom combinations
  for (let i = 0; i < Math.min(tops.length, 2); i++) {
    for (let j = 0; j < Math.min(bottoms.length, 1); j++) {
      if (suggestions.length < 3) {
        suggestions.push({
          items: [tops[i], bottoms[j]],
          reasoning: [
            `${tops[i].name} with ${bottoms[j].name}`,
            weather ? `Suitable for ${weather} weather` : '',
            eventType ? `Appropriate for ${eventType} event` : '',
          ].filter(Boolean),
          score: 85,
        });
      }
    }
  }

  return suggestions.slice(0, 3);
}

async function getWeather(date: string): Promise<string> {
  // Simplified weather - in production, call OpenWeatherMap API
  // For MVP, return a default value
  return 'hot'; // Could be 'hot', 'cold', 'rain'
}
