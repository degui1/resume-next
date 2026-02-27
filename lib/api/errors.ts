/**
 * Shared error handling utilities for API integrations
 * 
 * This module provides:
 * - Base ApiError class with generic metadata support
 * - Specialized error types (NetworkError, AuthenticationError, RateLimitError, NotFoundError, ValidationError)
 * - Error handler factory with configurable error messages
 * - Type guard functions for error type checking
 */

/**
 * Configuration for error messages used by the error handler
 */
export interface ErrorMessages {
  RATE_LIMIT: string;
  NETWORK: string;
  AUTHENTICATION: string;
  NOT_FOUND: string;
  VALIDATION: string;
  GENERIC: string;
}

/**
 * Configuration for the error handler factory
 * @template T - Type of metadata to attach to errors
 */
export interface ErrorHandlerConfig<T = unknown> {
  messages: ErrorMessages;
  extractMetadata?: (error: unknown) => T | undefined;
}

/**
 * Base API error class with generic metadata support
 * @template T - Type of metadata to attach to the error
 */
export class ApiError<T = unknown> extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public metadata?: T
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Network error - indicates connectivity or server issues
 */
export class NetworkError extends ApiError {
  constructor(message: string, statusCode?: number, metadata?: unknown) {
    super(message, 'NETWORK_ERROR', statusCode, metadata);
  }
}

/**
 * Authentication error - indicates invalid or missing credentials
 */
export class AuthenticationError extends ApiError {
  constructor(message: string, statusCode?: number, metadata?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', statusCode, metadata);
  }
}

/**
 * Rate limit error - indicates API quota has been exceeded
 * @template T - Type of rate limit metadata
 */
export class RateLimitError<T = unknown> extends ApiError<T> {
  public rateLimit?: T;

  constructor(message: string, statusCode?: number, metadata?: T) {
    super(message, 'RATE_LIMIT_ERROR', statusCode, metadata);
    this.rateLimit = metadata;
  }
}

/**
 * Not found error - indicates requested resource does not exist
 */
export class NotFoundError extends ApiError {
  constructor(message: string, statusCode?: number, metadata?: unknown) {
    super(message, 'NOT_FOUND_ERROR', statusCode, metadata);
  }
}

/**
 * Validation error - indicates invalid data received from API
 */
export class ValidationError extends ApiError {
  constructor(message: string, statusCode?: number, metadata?: unknown) {
    super(message, 'VALIDATION_ERROR', statusCode, metadata);
  }
}


/**
 * Type guard to check if an error is a RateLimitError
 * @param error - The error to check
 * @returns True if the error is a RateLimitError
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

/**
 * Type guard to check if an error is a NotFoundError
 * @param error - The error to check
 * @returns True if the error is a NotFoundError
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

/**
 * Type guard to check if an error is an AuthenticationError
 * @param error - The error to check
 * @returns True if the error is an AuthenticationError
 */
export function isAuthenticationError(error: unknown): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

/**
 * Creates a configured error handler function for a specific API service
 * 
 * @template T - Type of metadata to attach to errors
 * @param config - Configuration including error messages and optional metadata extractor
 * @returns A function that handles errors and returns appropriate ApiError instances
 * 
 * @example
 * ```typescript
 * const handleGitHubError = createErrorHandler<RateLimitInfo>({
 *   messages: {
 *     RATE_LIMIT: 'GitHub API rate limit reached. Showing cached data.',
 *     NETWORK: 'Unable to fetch GitHub data. Showing cached data.',
 *     AUTHENTICATION: 'GitHub authentication failed. Check your token.',
 *     NOT_FOUND: 'Repository not found.',
 *     VALIDATION: 'Invalid data received from GitHub.',
 *     GENERIC: 'An error occurred while fetching GitHub data.',
 *   },
 *   extractMetadata: (error) => {
 *     if (error && typeof error === 'object' && 'rateLimit' in error) {
 *       return error.rateLimit as RateLimitInfo;
 *     }
 *     return undefined;
 *   }
 * });
 * ```
 */
export function createErrorHandler<T = unknown>(
  config: ErrorHandlerConfig<T>
): (error: unknown, metadata?: T) => ApiError<T> {
  return (error: unknown, metadata?: T): ApiError<T> => {
    // Extract metadata if extractor is provided
    const extractedMetadata = config.extractMetadata?.(error) ?? metadata;

    // Handle ApiError instances (already classified) - check this FIRST
    if (error instanceof ApiError) {
      return error as ApiError<T>;
    }

    // Handle Response objects (fetch API)
    if (error instanceof Response) {
      const statusCode = error.status;
      return classifyErrorByStatus(statusCode, config.messages, extractedMetadata, error);
    }

    // Handle objects with status property
    if (error && typeof error === 'object' && 'status' in error) {
      const statusCode = typeof error.status === 'number' ? error.status : undefined;
      if (statusCode !== undefined) {
        return classifyErrorByStatus(statusCode, config.messages, extractedMetadata, error);
      }
    }

    // Handle objects with statusCode property
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const statusCode = typeof error.statusCode === 'number' ? error.statusCode : undefined;
      if (statusCode !== undefined) {
        return classifyErrorByStatus(statusCode, config.messages, extractedMetadata, error);
      }
    }

    // Handle generic errors
    if (error instanceof Error) {
      return new NetworkError(
        config.messages.NETWORK,
        undefined,
        extractedMetadata
      ) as ApiError<T>;
    }

    // Handle unknown error types
    return new ApiError<T>(
      config.messages.GENERIC,
      'UNKNOWN_ERROR',
      undefined,
      extractedMetadata
    );
  };
}

/**
 * Extracts error message from various error object formats
 * @param error - The error object to extract message from
 * @returns The error message string or null if not found
 */
function extractErrorMessage(error: unknown): string | null {
  if (error && typeof error === 'object') {
    // Check for direct message property
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    // Check for message in body property
    if ('body' in error && typeof error.body === 'object' && error.body) {
      const body = error.body as Record<string, unknown>;
      if ('message' in body && typeof body.message === 'string') {
        return body.message;
      }
    }
  }
  return null;
}

/**
 * Classifies an error based on HTTP status code
 * @param statusCode - HTTP status code
 * @param messages - Error messages configuration
 * @param metadata - Optional metadata to attach to the error
 * @returns Appropriate ApiError subclass based on status code
 */
function classifyErrorByStatus<T>(
  statusCode: number,
  messages: ErrorMessages,
  metadata?: T,
  error?: unknown
): ApiError<T> {
  // 401 Unauthorized - Authentication error
  if (statusCode === 401) {
    return new AuthenticationError(
      messages.AUTHENTICATION,
      statusCode,
      metadata
    ) as ApiError<T>;
  }

  // 403 Forbidden - Could be authentication or rate limit
  if (statusCode === 403) {
    const errorMessage = extractErrorMessage(error);
    
    if (errorMessage && /rate limit/i.test(errorMessage)) {
      return new RateLimitError<T>(
        messages.RATE_LIMIT,
        statusCode,
        metadata
      );
    }
    
    return new AuthenticationError(
      messages.AUTHENTICATION,
      statusCode,
      metadata
    ) as ApiError<T>;
  }

  // 404 Not Found
  if (statusCode === 404) {
    return new NotFoundError(
      messages.NOT_FOUND,
      statusCode,
      metadata
    ) as ApiError<T>;
  }

  // 429 Too Many Requests - Rate limit
  if (statusCode === 429) {
    return new RateLimitError<T>(
      messages.RATE_LIMIT,
      statusCode,
      metadata
    );
  }

  // 422 Unprocessable Entity - Validation error
  if (statusCode === 422) {
    return new ValidationError(
      messages.VALIDATION,
      statusCode,
      metadata
    ) as ApiError<T>;
  }

  // 5xx Server errors - Network error
  if (statusCode >= 500 && statusCode < 600) {
    return new NetworkError(
      messages.NETWORK,
      statusCode,
      metadata
    ) as ApiError<T>;
  }

  // 4xx Client errors (other than handled above) - Validation error
  if (statusCode >= 400 && statusCode < 500) {
    return new ValidationError(
      messages.VALIDATION,
      statusCode,
      metadata
    ) as ApiError<T>;
  }

  // Other status codes - Generic error
  return new ApiError<T>(
    messages.GENERIC,
    'UNKNOWN_ERROR',
    statusCode,
    metadata
  );
}
