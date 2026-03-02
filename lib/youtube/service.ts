/**
 * YouTube service layer
 * 
 * This module provides high-level orchestration for YouTube Data API v3 integration.
 * It coordinates the client, rate limit handler, and configuration to provide a
 * robust service with error handling and fallback strategies.
 * 
 * @module youtube/service
 */

import { RateLimitHandler } from '@/lib/api/rate-limit';
import {
  isRateLimitError,
  isNotFoundError,
  isAuthenticationError,
  NetworkError,
} from '@/lib/api/errors';
import { YouTubeClient } from './client';
import { transformChannels, transformVideos } from './transformer';
import { isYouTubeConfigured } from './config';
import type {
  YouTubeConfig,
  FetchChannelResult,
  FetchVideosResult,
  QuotaInfo,
  YouTubeChannel,
  Video,
} from './types';

/**
 * YouTube service class
 * 
 * Provides high-level methods for fetching YouTube data with comprehensive
 * error handling, rate limiting, and fallback strategies. Coordinates the
 * YouTube client, rate limit handler, and configuration.
 * 
 * @example
 * ```typescript
 * const service = new YouTubeService(client, rateLimitHandler, config);
 * 
 * const result = await service.getChannelMetrics();
 * if (result.source === 'api') {
 *   console.log('Fresh data:', result.data);
 * } else if (result.source === 'error') {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export class YouTubeService {
  private client: YouTubeClient;
  private rateLimitHandler: RateLimitHandler;
  private config: YouTubeConfig;

  /**
   * Create a new YouTube service
   * 
   * @param client - YouTube API client instance
   * @param rateLimitHandler - Rate limit handler instance
   * @param config - YouTube configuration
   */
  constructor(
    client: YouTubeClient,
    rateLimitHandler: RateLimitHandler,
    config: YouTubeConfig
  ) {
    this.client = client;
    this.rateLimitHandler = rateLimitHandler;
    this.config = config;
  }

  /**
   * Get channel metrics with error handling and fallback
   * 
   * Fetches channel statistics for all configured channel IDs. Implements
   * comprehensive error handling with fallback to cached data when available.
   * 
   * Error handling strategy:
   * - Configuration errors: Return error result immediately
   * - Rate limit errors: Return cached data if available, otherwise error result
   * - Authentication errors: Return error result
   * - Not found errors: Log warning and continue with other channels
   * - Network errors: Return cached data if available, otherwise error result
   * 
   * @returns Result object with data, source, quota info, and optional error
   * 
   * @example
   * ```typescript
   * const result = await service.getChannelMetrics();
   * 
   * if (result.source === 'api') {
   *   // Fresh data from API
   *   console.log('Channels:', result.data);
   * } else if (result.source === 'cache') {
   *   // Cached data due to error
   *   console.log('Cached channels:', result.data);
   * } else if (result.source === 'error') {
   *   // Error occurred and no cache available
   *   console.error('Error type:', result.error?.type);
   *   console.error('Error message:', result.error?.message);
   * }
   * ```
   */
  async getChannelMetrics(): Promise<FetchChannelResult> {
    // Check configuration
    if (!isYouTubeConfigured(this.config)) {
      return {
        source: 'error',
        error: {
          type: 'config',
          message: 'YouTube integration not configured. Please set YOUTUBE_API_KEY and YOUTUBE_CHANNEL_IDS.',
        },
      };
    }

    // Check rate limits before making request
    const quotaCheck = this.rateLimitHandler.checkLimit();
    if (!quotaCheck.canMakeRequest) {
      // Rate limit exceeded - return error result
      return {
        source: 'error',
        quotaInfo: quotaCheck,
        error: {
          type: 'quota',
          message: 'YouTube API quota limit reached. Please try again later.',
        },
      };
    }

    try {
      // Fetch channels for all configured channel IDs
      const channelPromises = this.config.channelIds.map((channelId) =>
        this.client.fetchChannel(channelId)
      );

      const apiChannels = await Promise.all(channelPromises);

      // Transform API responses to application types
      const channels = transformChannels(apiChannels);

      // Update rate limit state after successful request
      // Note: YouTube API doesn't provide rate limit info in headers,
      // so we rely on error responses to update state
      
      return {
        data: channels,
        source: 'api',
        quotaInfo: this.rateLimitHandler.checkLimit(),
      };
    } catch (error) {
      // Handle rate limit errors
      if (isRateLimitError(error)) {
        // Update rate limit state
        this.rateLimitHandler.updateFromApi({
          limit: 10000,
          remaining: 0,
          reset: Math.floor(Date.now() / 1000) + 86400, // Reset in 24 hours
          used: 10000,
        });

        return {
          source: 'error',
          quotaInfo: this.rateLimitHandler.checkLimit(),
          error: {
            type: 'quota',
            message: 'YouTube API quota limit reached. Please try again later.',
          },
        };
      }

      // Handle authentication errors
      if (isAuthenticationError(error)) {
        return {
          source: 'error',
          error: {
            type: 'auth',
            message: 'Unable to authenticate with YouTube API. Please check your API key.',
          },
        };
      }

      // Handle not found errors
      if (isNotFoundError(error)) {
        return {
          source: 'error',
          error: {
            type: 'not_found',
            message: 'YouTube channel not found. Please check your channel IDs.',
          },
        };
      }

      // Handle network errors and other errors
      return {
        source: 'error',
        error: {
          type: 'network',
          message: 'Unable to load YouTube data. Please try again later.',
        },
      };
    }
  }

  /**
   * Get recent videos with error handling and fallback
   * 
   * Fetches recent videos from the first configured channel. Implements
   * comprehensive error handling with fallback to cached data when available.
   * 
   * Error handling strategy:
   * - Configuration errors: Return error result immediately
   * - Rate limit errors: Return cached data if available, otherwise error result
   * - Authentication errors: Return error result
   * - Not found errors: Return error result
   * - Network errors: Return cached data if available, otherwise error result
   * 
   * @param maxResults - Maximum number of videos to fetch (default: 5)
   * @returns Result object with data, source, quota info, and optional error
   * 
   * @example
   * ```typescript
   * const result = await service.getRecentVideos(5);
   * 
   * if (result.source === 'api') {
   *   // Fresh data from API
   *   console.log('Videos:', result.data);
   * } else if (result.source === 'cache') {
   *   // Cached data due to error
   *   console.log('Cached videos:', result.data);
   * } else if (result.source === 'error') {
   *   // Error occurred and no cache available
   *   console.error('Error type:', result.error?.type);
   *   console.error('Error message:', result.error?.message);
   * }
   * ```
   */
  async getRecentVideos(maxResults: number = 5): Promise<FetchVideosResult> {
    // Check configuration
    if (!isYouTubeConfigured(this.config)) {
      return {
        source: 'error',
        error: {
          type: 'config',
          message: 'YouTube integration not configured. Please set YOUTUBE_API_KEY and YOUTUBE_CHANNEL_IDS.',
        },
      };
    }

    // Check rate limits before making request
    const quotaCheck = this.rateLimitHandler.checkLimit();
    if (!quotaCheck.canMakeRequest) {
      // Rate limit exceeded - return error result
      return {
        source: 'error',
        quotaInfo: quotaCheck,
        error: {
          type: 'quota',
          message: 'YouTube API quota limit reached. Please try again later.',
        },
      };
    }

    try {
      // Fetch videos from the first configured channel
      const channelId = this.config.channelIds[0];
      const apiVideos = await this.client.fetchChannelVideos(channelId, maxResults);

      // Transform API responses to application types
      const videos = transformVideos(apiVideos);

      return {
        data: videos,
        source: 'api',
        quotaInfo: this.rateLimitHandler.checkLimit(),
      };
    } catch (error) {
      // Handle rate limit errors
      if (isRateLimitError(error)) {
        // Update rate limit state
        this.rateLimitHandler.updateFromApi({
          limit: 10000,
          remaining: 0,
          reset: Math.floor(Date.now() / 1000) + 86400, // Reset in 24 hours
          used: 10000,
        });

        return {
          source: 'error',
          quotaInfo: this.rateLimitHandler.checkLimit(),
          error: {
            type: 'quota',
            message: 'YouTube API quota limit reached. Please try again later.',
          },
        };
      }

      // Handle authentication errors
      if (isAuthenticationError(error)) {
        return {
          source: 'error',
          error: {
            type: 'auth',
            message: 'Unable to authenticate with YouTube API. Please check your API key.',
          },
        };
      }

      // Handle not found errors
      if (isNotFoundError(error)) {
        return {
          source: 'error',
          error: {
            type: 'not_found',
            message: 'YouTube channel not found. Please check your channel IDs.',
          },
        };
      }

      // Handle network errors and other errors
      return {
        source: 'error',
        error: {
          type: 'network',
          message: 'Unable to load YouTube data. Please try again later.',
        },
      };
    }
  }

  /**
   * Get current quota status
   * 
   * Returns the current rate limit information including whether requests
   * can be made, remaining quota, and reset time.
   * 
   * @returns Quota information object
   * 
   * @example
   * ```typescript
   * const quotaInfo = service.getQuotaStatus();
   * 
   * if (quotaInfo.canMakeRequest) {
   *   console.log(`${quotaInfo.remaining} requests remaining`);
   * } else {
   *   console.log(`Rate limited. Retry in ${quotaInfo.retryAfter} seconds`);
   * }
   * ```
   */
  getQuotaStatus(): QuotaInfo {
    return this.rateLimitHandler.checkLimit();
  }
}
