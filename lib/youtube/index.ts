/**
 * YouTube API Integration
 * 
 * This module provides YouTube-specific utilities for error handling,
 * rate limiting, and configuration management using shared API utilities.
 * 
 * @example Error handling
 * ```typescript
 * import { handleYouTubeError, YOUTUBE_ERROR_MESSAGES } from '@/lib/youtube';
 * 
 * try {
 *   const response = await fetch('https://www.googleapis.com/youtube/v3/...');
 *   if (!response.ok) throw await response.json();
 * } catch (error) {
 *   throw handleYouTubeError(error);
 * }
 * ```
 * 
 * @example Rate limiting
 * ```typescript
 * import { youtubeRateLimitHandler, YOUTUBE_OPERATION_COSTS } from '@/lib/youtube';
 * 
 * const info = youtubeRateLimitHandler.checkLimit();
 * if (info.canMakeRequest) {
 *   const data = await fetchYouTubeData();
 *   // Update quota after request
 *   const state = youtubeRateLimitHandler.getState();
 *   if (state) {
 *     youtubeRateLimitHandler.updateFromApi({
 *       ...state,
 *       remaining: state.remaining - YOUTUBE_OPERATION_COSTS.CHANNELS_LIST,
 *       used: state.used + YOUTUBE_OPERATION_COSTS.CHANNELS_LIST,
 *       reset: state.reset.getTime() / 1000
 *     });
 *   }
 * }
 * ```
 * 
 * @example Configuration
 * ```typescript
 * import { getYouTubeConfig, isYouTubeConfigured } from '@/lib/youtube';
 * 
 * const config = getYouTubeConfig();
 * if (isYouTubeConfigured(config)) {
 *   // Make API requests
 * } else {
 *   // Use mock data
 * }
 * ```
 */

// Error handling
export { handleYouTubeError, YOUTUBE_ERROR_MESSAGES } from './errors';

// Rate limiting
export { youtubeRateLimitHandler, YOUTUBE_OPERATION_COSTS } from './rate-limit';

// Configuration
export {
  getYouTubeConfig,
  validateYouTubeConfig,
  isYouTubeConfigured,
  type YouTubeConfig,
} from './config';

// Re-export shared utilities for convenience
export {
  isRateLimitError,
  isNotFoundError,
  isAuthenticationError,
  type ApiError,
  type RateLimitError,
} from '@/lib/api/errors';

export {
  formatLargeNumber,
  formatDate,
  formatNumber,
} from '@/lib/api/formatters';

export type {
  RateLimitInfo,
  RateLimitState,
} from '@/lib/api/rate-limit';
