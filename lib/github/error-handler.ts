/**
 * GitHub-specific error handling configuration
 * 
 * This module configures the shared error handler with GitHub-specific
 * error messages and metadata extraction.
 */

import {
  createErrorHandler,
  ErrorMessages,
  ApiError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  isRateLimitError,
  isNotFoundError,
  isAuthenticationError,
} from '@/lib/api/errors';
import { RateLimitInfo } from './types';

/**
 * User-facing error messages for different error types
 */
export const ERROR_MESSAGES: ErrorMessages = {
  RATE_LIMIT: 'GitHub API rate limit reached. Showing cached data.',
  NETWORK: 'Unable to fetch GitHub data. Showing cached data.',
  AUTHENTICATION: 'GitHub authentication failed. Check your token.',
  NOT_FOUND: 'Repository not found.',
  VALIDATION: 'Invalid data received from GitHub.',
  GENERIC: 'An error occurred while fetching GitHub data.',
} as const;

/**
 * GitHub-specific error handler
 * 
 * Handles errors from GitHub API requests and converts them into
 * appropriate error types with GitHub-specific error messages.
 * 
 * @param error - The error to handle (can be any type)
 * @param metadata - Optional rate limit information to attach to the error
 * @returns A properly classified ApiError instance with GitHub context
 */
export const handleGitHubError = createErrorHandler<RateLimitInfo>({
  messages: ERROR_MESSAGES,
  extractMetadata: (error) => {
    // Extract rate limit info from error if available
    if (error && typeof error === 'object' && 'rateLimit' in error) {
      return error.rateLimit as RateLimitInfo;
    }
    return undefined;
  },
});

// Re-export error classes for backward compatibility
export {
  ApiError as GitHubError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  isRateLimitError,
  isNotFoundError,
  isAuthenticationError,
};
