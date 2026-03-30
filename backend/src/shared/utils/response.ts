import { ApiResponse } from '../../types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json',
};

export function successResponse<T>(data: T, statusCode: number = 200): ApiResponse {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
  };
}

export function errorResponse(message: string, statusCode: number = 500, details?: any): ApiResponse {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      error: message,
      details,
    }),
  };
}

export function validationErrorResponse(errors: Record<string, string>): ApiResponse {
  return errorResponse('Validation failed', 400, errors);
}
