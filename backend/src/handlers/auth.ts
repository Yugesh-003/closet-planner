import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand, AuthFlowType } from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { successResponse, errorResponse } from '../shared/utils/response';
import { v4 as uuidv4 } from 'uuid';

const cognitoClient = new CognitoIdentityProviderClient({});
const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const USER_POOL_ID = process.env.USER_POOL_ID!;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID!;
const USERS_TABLE = process.env.USERS_TABLE!;

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  try {
    const path = event.path;
    const method = event.httpMethod;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
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

    if (path.includes('/signup') && method === 'POST') {
      return await handleSignup(event);
    } else if (path.includes('/login') && method === 'POST') {
      return await handleLogin(event);
    }

    return errorResponse('Not found', 404);
  } catch (error: any) {
    console.error('Auth handler error:', error);
    return errorResponse(error.message || 'Internal server error');
  }
}

async function handleSignup(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return errorResponse('Email, password, and name are required', 400);
  }

  try {
    // Sign up with Cognito
    const signUpCommand = new SignUpCommand({
      ClientId: USER_POOL_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    });

    const signUpResult = await cognitoClient.send(signUpCommand);
    const userId = signUpResult.UserSub!;

    // Create user record in DynamoDB
    await dynamoClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        userId,
        email,
        name,
        notificationsEnabled: true,
        createdAt: new Date().toISOString(),
      },
    }));

    return successResponse({
      message: 'User created successfully',
      userId,
      email,
      name,
    }, 201);
  } catch (error: any) {
    console.error('Signup error:', error);
    return errorResponse(error.message || 'Signup failed', 400);
  }
}

async function handleLogin(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || '{}');
  const { email, password } = body;

  if (!email || !password) {
    return errorResponse('Email and password are required', 400);
  }

  try {
    const authCommand = new InitiateAuthCommand({
      ClientId: USER_POOL_CLIENT_ID,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const authResult = await cognitoClient.send(authCommand);

    return successResponse({
      accessToken: authResult.AuthenticationResult?.AccessToken,
      idToken: authResult.AuthenticationResult?.IdToken,
      refreshToken: authResult.AuthenticationResult?.RefreshToken,
      expiresIn: authResult.AuthenticationResult?.ExpiresIn,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse('Invalid credentials', 401);
  }
}
