import { RateLimitInfo } from './types';

/**
 * User-facing error messages for different error types
 */
export const ERROR_MESSAGES = {
  RATE_LIMIT: 'GitHub API rate limit reached. Showing cached data.',
  NETWORK: 'Unable to fetch GitHub data. Showing cached data.',
  AUTHENTICATION: 'GitHub authentication failed. Check your token.',
  NOT_FOUND: 'Repository not found.',
  VALIDATION: 'Invalid data received from GitHub.',
  GENERIC: 'An error occurred while fetching GitHub data.',
} as const;

/**
 * Base GitHub Error Class
 * All GitHub-related errors extend from this base class
 */
export class GitHubError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public rateLimit?: RateLimitInfo
  ) {
    super(message);
    this.name = 'GitHubError';
    Object.setPrototypeOf(this, GitHubError.prototype);
  }
}

/**
 * Network Error
 * Thrown when network-related issues occur (connection failures, timeouts, DNS issues)
 */
export class NetworkError extends GitHubError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NETWORK_ERROR', statusCode);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Authentication Error
 * Thrown when authentication fails (invalid token, insufficient permissions)
 */
export class AuthenticationError extends GitHubError {
  constructor(message: string, statusCode?: number) {
    super(message, 'AUTHENTICATION_ERROR', statusCode);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Rate Limit Error
 * Thrown when GitHub API rate limit is exceeded
 */
export class RateLimitError extends GitHubError {
  constructor(message: string, rateLimit?: RateLimitInfo, statusCode?: number) {
    super(message, 'RATE_LIMIT_ERROR', statusCode, rateLimit);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Not Found Error
 * Thrown when a repository or user is not found (404)
 */
export class NotFoundError extends GitHubError {
  constructor(message: string, statusCode?: number) {
    super(message, 'NOT_FOUND_ERROR', statusCode);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Validation Error
 * Thrown when configuration is invalid or API responses are malformed
 */
export class ValidationError extends GitHubError {
  constructor(message: string, statusCode?: number) {
    super(message, 'VALIDATION_ERROR', statusCode);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Handle GitHub Error
 * Classifies and wraps errors into appropriate GitHubError types
 * 
 * @param error - The error to handle (can be any type)
 * @param rateLimit - Optional rate limit information to attach to the error
 * @returns A properly classified GitHubError instance
 */
export function handleGitHubError(
  error: unknown,
  rateLimit?: RateLimitInfo
): GitHubError {
  // If already a GitHubError, return as-is
  if (error instanceof GitHubError) {
    return error;
  }

  // Handle fetch/network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new NetworkError(
      ERROR_MESSAGES.NETWORK,
      undefined
    );
  }

  // Handle Response objects with status codes
  if (error && typeof error === 'object' && 'status' in error) {
    const statusCode = (error as { status: number }).status;
    const message = 'message' in error && typeof (error as { message: unknown }).message === 'string'
      ? (error as { message: string }).message
      : ERROR_MESSAGES.GENERIC;

    switch (statusCode) {
      case 401:
      case 403:
        // Check if it's a rate limit error (403 can be rate limit or auth)
        if (message.toLowerCase().includes('rate limit')) {
          return new RateLimitError(
            ERROR_MESSAGES.RATE_LIMIT,
            rateLimit,
            statusCode
          );
        }
        return new AuthenticationError(
          ERROR_MESSAGES.AUTHENTICATION,
          statusCode
        );
      
      case 404:
        return new NotFoundError(
          ERROR_MESSAGES.NOT_FOUND,
          statusCode
        );
      
      case 429:
        return new RateLimitError(
          ERROR_MESSAGES.RATE_LIMIT,
          rateLimit,
          statusCode
        );
      
      case 500:
      case 502:
      case 503:
      case 504:
        return new NetworkError(
          ERROR_MESSAGES.NETWORK,
          statusCode
        );
      
      default:
        return new GitHubError(
          message,
          'UNKNOWN_ERROR',
          statusCode,
          rateLimit
        );
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return new GitHubError(
      error.message,
      'UNKNOWN_ERROR',
      undefined,
      rateLimit
    );
  }

  // Handle unknown error types
  return new GitHubError(
    ERROR_MESSAGES.GENERIC,
    'UNKNOWN_ERROR',
    undefined,
    rateLimit
  );
}

/**
 * Check if error is a Rate Limit Error
 * 
 * @param error - The error to check
 * @returns True if the error is a RateLimitError
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

/**
 * Check if error is a Not Found Error
 * 
 * @param error - The error to check
 * @returns True if the error is a NotFoundError
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

/**
 * Check if error is an Authentication Error
 * 
 * @param error - The error to check
 * @returns True if the error is an AuthenticationError
 */
export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}
