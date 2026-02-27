/**
 * YouTube API Error Handling
 * 
 * This module provides YouTube-specific error handling configuration
 * using the shared error handling utilities from @/lib/api/errors.
 */

import { createErrorHandler, ErrorMessages } from '@/lib/api/errors';

/**
 * YouTube-specific error messages
 * 
 * These messages are tailored to YouTube API error scenarios and provide
 * user-friendly feedback when API requests fail.
 */
export const YOUTUBE_ERROR_MESSAGES: ErrorMessages = {
  RATE_LIMIT: 'YouTube API quota exceeded. Showing cached data.',
  NETWORK: 'Unable to fetch YouTube data. Showing cached data.',
  AUTHENTICATION: 'YouTube API authentication failed. Check your API key.',
  NOT_FOUND: 'YouTube channel or video not found.',
  VALIDATION: 'Invalid data received from YouTube API.',
  GENERIC: 'An error occurred while fetching YouTube data.',
};

/**
 * YouTube API error handler
 * 
 * Handles errors from YouTube API requests by classifying them into
 * appropriate error types based on HTTP status codes and providing
 * YouTube-specific error messages.
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await fetch('https://www.googleapis.com/youtube/v3/...');
 *   if (!response.ok) {
 *     throw await response.json();
 *   }
 * } catch (error) {
 *   throw handleYouTubeError(error);
 * }
 * ```
 * 
 * @example Error handling with type guards
 * ```typescript
 * try {
 *   const data = await fetchYouTubeData();
 * } catch (error) {
 *   const apiError = handleYouTubeError(error);
 *   if (isRateLimitError(apiError)) {
 *     console.log('Quota exceeded, retry after:', apiError.metadata?.retryAfter);
 *   } else if (isAuthenticationError(apiError)) {
 *     console.log('Invalid API key');
 *   }
 * }
 * ```
 */
export const handleYouTubeError = createErrorHandler({
  messages: YOUTUBE_ERROR_MESSAGES,
});
