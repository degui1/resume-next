/**
 * Next.js API route error handling utilities
 * 
 * This module provides utilities for handling errors in Next.js API routes
 * and server actions, integrating with the shared error handling utilities.
 */

import { NextResponse } from 'next/server'
import {
  ApiError,
  isRateLimitError,
  isNotFoundError,
  isAuthenticationError,
  NetworkError,
  ValidationError,
} from './errors'

/**
 * Error response structure for API routes
 */
export interface ErrorResponse {
  error: string
  code: string
  statusCode: number
  metadata?: unknown
  timestamp: string
}

/**
 * Converts an ApiError to a Next.js Response
 * 
 * @param error - The error to convert
 * @returns NextResponse with appropriate status code and error details
 * 
 * @example
 * ```typescript
 * try {
 *   // API logic
 * } catch (error) {
 *   const apiError = handleGitHubError(error);
 *   return handleApiRouteError(apiError);
 * }
 * ```
 */
export function handleApiRouteError(error: unknown): NextResponse<ErrorResponse> {
  // Handle ApiError instances
  if (error instanceof ApiError) {
    const statusCode = error.statusCode ?? 500
    
    return NextResponse.json<ErrorResponse>(
      {
        error: error.message,
        code: error.code,
        statusCode,
        metadata: error.metadata,
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    )
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return NextResponse.json<ErrorResponse>(
      {
        error: error.message,
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }

  // Handle unknown error types
  return NextResponse.json<ErrorResponse>(
    {
      error: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  )
}

/**
 * Wraps an async API route handler with error handling
 * 
 * @param handler - The API route handler function
 * @returns Wrapped handler with automatic error handling
 * 
 * @example
 * ```typescript
 * export const GET = withErrorHandling(async (request) => {
 *   const data = await fetchData();
 *   return NextResponse.json(data);
 * });
 * ```
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args)
    } catch (error) {
      return handleApiRouteError(error)
    }
  }) as T
}

/**
 * Creates a standardized error response for server actions
 * 
 * @param error - The error to convert
 * @returns Serializable error object for server actions
 * 
 * @example
 * ```typescript
 * 'use server'
 * 
 * export async function myAction() {
 *   try {
 *     // Action logic
 *     return { success: true, data };
 *   } catch (error) {
 *     return handleServerActionError(error);
 *   }
 * }
 * ```
 */
export function handleServerActionError(error: unknown): {
  success: false
  error: string
  code: string
  statusCode?: number
} {
  if (error instanceof ApiError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: 'INTERNAL_ERROR',
    }
  }

  return {
    success: false,
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  }
}

/**
 * Determines if an error should be retried
 * 
 * @param error - The error to check
 * @returns True if the error is retryable (network errors, rate limits after cooldown)
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof NetworkError) {
    return true
  }

  if (isRateLimitError(error)) {
    // Rate limit errors are retryable after cooldown
    return true
  }

  // Authentication, validation, and not found errors are not retryable
  if (
    isAuthenticationError(error) ||
    isNotFoundError(error) ||
    error instanceof ValidationError
  ) {
    return false
  }

  return false
}

/**
 * Gets a user-friendly error message for display
 * 
 * @param error - The error to get a message for
 * @returns User-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}
