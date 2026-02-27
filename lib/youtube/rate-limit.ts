/**
 * YouTube API Rate Limit Handling
 * 
 * This module provides YouTube-specific rate limit configuration
 * using the shared rate limit utilities from @/lib/api/rate-limit.
 * 
 * YouTube API uses a quota system where different operations consume
 * different amounts of quota units. The API returns quota information
 * in custom headers.
 */

import { RateLimitHandler } from '@/lib/api/rate-limit';

/**
 * YouTube API Rate Limit Handler
 * 
 * Configured to work with YouTube API's quota system headers.
 * 
 * YouTube API Header Mapping:
 * - Quota limit: Not typically provided in headers (set via API Console)
 * - Quota remaining: Custom header or calculated from API response
 * - Quota reset: Typically resets daily at midnight Pacific Time
 * - Quota used: Calculated from operation costs
 * 
 * Note: YouTube API quota information is often retrieved from the API response
 * body rather than headers. Use `updateFromApi()` method for explicit quota data.
 * 
 * @example Basic usage with headers
 * ```typescript
 * const response = await fetch('https://www.googleapis.com/youtube/v3/channels?...');
 * youtubeRateLimitHandler.updateFromHeaders(response.headers);
 * 
 * const info = youtubeRateLimitHandler.checkLimit();
 * if (!info.canMakeRequest) {
 *   console.log(`Quota exceeded. Resets at ${info.resetAt}`);
 * }
 * ```
 * 
 * @example Usage with explicit quota data
 * ```typescript
 * // YouTube API doesn't always provide quota in headers
 * // You may need to track quota usage manually or via API response
 * youtubeRateLimitHandler.updateFromApi({
 *   limit: 10000,        // Daily quota limit
 *   remaining: 7500,     // Remaining quota units
 *   reset: Date.now() / 1000 + 86400, // Reset timestamp (24 hours)
 *   used: 2500          // Used quota units
 * });
 * ```
 * 
 * @example Checking quota before making requests
 * ```typescript
 * const info = youtubeRateLimitHandler.checkLimit();
 * if (info.canMakeRequest) {
 *   // Make API request
 *   const data = await fetchYouTubeData();
 *   // Update quota after request (subtract operation cost)
 *   const state = youtubeRateLimitHandler.getState();
 *   if (state) {
 *     youtubeRateLimitHandler.updateFromApi({
 *       ...state,
 *       remaining: state.remaining - operationCost,
 *       used: state.used + operationCost,
 *       reset: state.reset.getTime() / 1000
 *     });
 *   }
 * } else {
 *   console.log('Quota exhausted, using cached data');
 * }
 * ```
 */
export const youtubeRateLimitHandler = new RateLimitHandler({
  headerNames: {
    limit: 'x-quota-limit',
    remaining: 'x-quota-remaining',
    reset: 'x-quota-reset',
    used: 'x-quota-used',
  },
});

/**
 * YouTube API Operation Costs
 * 
 * Different YouTube API operations consume different amounts of quota.
 * Use these constants to track quota usage accurately.
 * 
 * Common operation costs:
 * - Read operations (list, search): 1-100 units
 * - Write operations (insert, update, delete): 50-1600 units
 * - Video upload: 1600 units
 * 
 * @see https://developers.google.com/youtube/v3/getting-started#quota
 */
export const YOUTUBE_OPERATION_COSTS = {
  // Read operations
  CHANNELS_LIST: 1,
  VIDEOS_LIST: 1,
  PLAYLISTS_LIST: 1,
  SEARCH_LIST: 100,
  
  // Write operations
  VIDEOS_INSERT: 1600,
  VIDEOS_UPDATE: 50,
  VIDEOS_DELETE: 50,
  PLAYLISTS_INSERT: 50,
  PLAYLISTS_UPDATE: 50,
  PLAYLISTS_DELETE: 50,
} as const;
