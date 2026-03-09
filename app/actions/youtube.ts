/**
 * YouTube server actions
 * 
 * This module provides Next.js server actions for fetching YouTube data.
 * Server actions allow client components to fetch data from the server
 * without creating API routes.
 * 
 * @module actions/youtube
 */

'use server';

import { RateLimitHandler } from '@/lib/api/rate-limit';
import { YouTubeClient } from '@/lib/youtube/client';
import { YouTubeService } from '@/lib/youtube/service';
import { getYouTubeConfig } from '@/lib/youtube/config';
import type {
  FetchChannelResult,
  FetchVideosResult,
  QuotaInfo,
} from '@/lib/youtube/types';

/**
 * Create and configure YouTube service instance
 * 
 * Initializes the YouTube service with client, rate limit handler, and
 * configuration. This is a helper function to avoid duplicating service
 * initialization logic across multiple server actions.
 * 
 * @param locale - Optional locale code for API localization (e.g., 'en', 'pt')
 * @returns Configured YouTube service instance
 */
function createYouTubeService(locale?: string): YouTubeService {
  // Get configuration from environment variables
  const config = getYouTubeConfig();

  // Create YouTube API client
  const client = new YouTubeClient({
    apiKey: config.apiKey,
    revalidate: config.revalidate,
    locale,
  });

  // Create rate limit handler
  const rateLimitHandler = new RateLimitHandler({
    headerNames: {
      limit: 'x-ratelimit-limit',
      remaining: 'x-ratelimit-remaining',
      reset: 'x-ratelimit-reset',
      used: 'x-ratelimit-used',
    },
  });

  // Create and return service
  return new YouTubeService(client, rateLimitHandler, config);
}

/**
 * Get YouTube channel metrics
 * 
 * Fetches channel statistics for all configured channel IDs. Returns
 * channel data including subscriber count, view count, video count,
 * and channel metadata.
 * 
 * This server action can be called from client components to fetch
 * YouTube data without exposing API keys or implementation details.
 * 
 * @param locale - Optional locale code for API localization (e.g., 'en', 'pt')
 * @returns Result object with channel data, source, quota info, and optional error
 * 
 * @example
 * ```typescript
 * // In a client component
 * import { getYouTubeChannels } from '@/app/actions/youtube';
 * 
 * const result = await getYouTubeChannels('pt');
 * 
 * if (result.source === 'api') {
 *   console.log('Channels:', result.data);
 * } else if (result.source === 'error') {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function getYouTubeChannels(locale?: string): Promise<FetchChannelResult> {
  try {
    const service = createYouTubeService(locale);
    return await service.getChannelMetrics();
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in getYouTubeChannels:', error);
    return {
      source: 'error',
      error: {
        type: 'network',
        message: 'An unexpected error occurred while fetching YouTube channels.',
      },
    };
  }
}

/**
 * Get recent YouTube videos
 * 
 * Fetches recent videos from the first configured channel. Returns
 * video data including title, thumbnail, view count, and video URL.
 * 
 * This server action can be called from client components to fetch
 * YouTube video data without exposing API keys or implementation details.
 * 
 * @param maxResults - Maximum number of videos to fetch (default: 5)
 * @param locale - Optional locale code for API localization (e.g., 'en', 'pt')
 * @returns Result object with video data, source, quota info, and optional error
 * 
 * @example
 * ```typescript
 * // In a client component
 * import { getYouTubeVideos } from '@/app/actions/youtube';
 * 
 * const result = await getYouTubeVideos(5, 'pt');
 * 
 * if (result.source === 'api') {
 *   console.log('Videos:', result.data);
 * } else if (result.source === 'error') {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export async function getYouTubeVideos(
  maxResults: number = 5,
  locale?: string
): Promise<FetchVideosResult> {
  try {
    const service = createYouTubeService(locale);
    return await service.getRecentVideos(maxResults);
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error in getYouTubeVideos:', error);
    return {
      source: 'error',
      error: {
        type: 'network',
        message: 'An unexpected error occurred while fetching YouTube videos.',
      },
    };
  }
}

/**
 * Get YouTube API quota status
 * 
 * Returns the current rate limit information including whether requests
 * can be made, remaining quota, and reset time. This allows client
 * components to check quota status before attempting to fetch data.
 * 
 * This server action can be called from client components to check
 * quota status without exposing implementation details.
 * 
 * @returns Quota information object
 * 
 * @example
 * ```typescript
 * // In a client component
 * import { getYouTubeQuotaStatus } from '@/app/actions/youtube';
 * 
 * const quotaInfo = await getYouTubeQuotaStatus();
 * 
 * if (quotaInfo.canMakeRequest) {
 *   console.log(`${quotaInfo.remaining} requests remaining`);
 * } else {
 *   console.log(`Rate limited. Retry in ${quotaInfo.retryAfter} seconds`);
 * }
 * ```
 */
export async function getYouTubeQuotaStatus(): Promise<QuotaInfo> {
  try {
    const service = createYouTubeService();
    return service.getQuotaStatus();
  } catch (error) {
    // Handle unexpected errors - return safe default
    console.error('Unexpected error in getYouTubeQuotaStatus:', error);
    return {
      canMakeRequest: false,
      remaining: 0,
      resetAt: new Date(Date.now() + 86400000), // 24 hours from now
      retryAfter: 86400, // 24 hours in seconds
    };
  }
}
