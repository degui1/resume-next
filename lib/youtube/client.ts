/**
 * YouTube Data API v3 client
 * 
 * This module provides a low-level HTTP client for interacting with the
 * YouTube Data API v3. It handles authentication, request construction,
 * response parsing, and error classification using shared error utilities.
 * 
 * @module youtube/client
 */

import { createErrorHandler } from '@/lib/api/errors';
import type {
  YouTubeClientConfig,
  YouTubeApiChannel,
  YouTubeApiVideo,
  YouTubeApiSearchResponse,
} from './types';

/**
 * YouTube Data API v3 client
 * 
 * Handles authenticated HTTP requests to YouTube Data API v3 endpoints.
 * Uses Next.js fetch with automatic caching and revalidation.
 * 
 * @example
 * ```typescript
 * const client = new YouTubeClient({
 *   apiKey: 'AIza...',
 *   revalidate: 3600
 * });
 * 
 * const channel = await client.fetchChannel('UCxxx');
 * const videos = await client.fetchChannelVideos('UCxxx', 5);
 * ```
 */
export class YouTubeClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly revalidate: number;
  private readonly locale?: string;
  private readonly handleError: ReturnType<typeof createErrorHandler>;

  /**
   * Create a new YouTube API client
   * 
   * @param config - Client configuration including API key and optional settings
   */
  constructor(config: YouTubeClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://www.googleapis.com/youtube/v3';
    this.revalidate = config.revalidate ?? 3600;
    this.locale = config.locale;

    // Create error handler with YouTube-specific messages
    this.handleError = createErrorHandler({
      messages: {
        RATE_LIMIT: 'YouTube API quota limit reached',
        NETWORK: 'Unable to connect to YouTube API',
        AUTHENTICATION: 'YouTube API authentication failed',
        NOT_FOUND: 'YouTube resource not found',
        VALIDATION: 'Invalid response from YouTube API',
        GENERIC: 'An error occurred while fetching YouTube data',
      },
    });
  }

  /**
   * Fetch channel statistics and metadata
   * 
   * Retrieves channel information including name, handle, subscriber count,
   * view count, video count, and thumbnails from the YouTube Data API v3.
   * 
   * @param channelId - YouTube channel ID (e.g., 'UCxxx')
   * @returns Channel data from YouTube API
   * @throws {AuthenticationError} If API key is invalid
   * @throws {RateLimitError} If quota is exceeded
   * @throws {NotFoundError} If channel is not found
   * @throws {NetworkError} If network request fails
   * 
   * @example
   * ```typescript
   * const channel = await client.fetchChannel('UCxxx');
   * console.log(channel.snippet.title); // Channel name
   * console.log(channel.statistics.subscriberCount); // Subscriber count
   * ```
   */
  async fetchChannel(channelId: string): Promise<YouTubeApiChannel> {
    const url = new URL(`${this.baseUrl}/channels`);
    url.searchParams.set('part', 'snippet,statistics');
    url.searchParams.set('id', channelId);
    url.searchParams.set('key', this.apiKey);
    
    // Add localization parameter if locale is provided
    if (this.locale) {
      url.searchParams.set('hl', this.locale);
    }

    try {
      const response = await fetch(url.toString(), {
        next: { revalidate: this.revalidate },
      });

      if (!response.ok) {
        throw this.handleError(response);
      }

      const data = await response.json();

      // Validate response structure
      if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        throw this.handleError(
          new Response(JSON.stringify({ message: 'Channel not found' }), { status: 404 })
        );
      }

      return data.items[0] as YouTubeApiChannel;
    } catch (error) {
      // Re-throw if already classified by handleError
      if (error instanceof Error && error.name.includes('Error')) {
        throw error;
      }
      // Handle network errors and other exceptions
      throw this.handleError(error);
    }
  }

  /**
   * Fetch recent videos from a channel
   * 
   * Retrieves the most recent videos from a channel using a two-step process:
   * 1. Search for video IDs using the search endpoint
   * 2. Fetch video details and statistics using the videos endpoint
   * 
   * @param channelId - YouTube channel ID (e.g., 'UCxxx')
   * @param maxResults - Maximum number of videos to fetch (default: 5)
   * @returns Array of video data from YouTube API
   * @throws {AuthenticationError} If API key is invalid
   * @throws {RateLimitError} If quota is exceeded
   * @throws {NotFoundError} If channel is not found
   * @throws {NetworkError} If network request fails
   * 
   * @example
   * ```typescript
   * const videos = await client.fetchChannelVideos('UCxxx', 5);
   * videos.forEach(video => {
   *   console.log(video.snippet.title);
   *   console.log(video.statistics.viewCount);
   * });
   * ```
   */
  async fetchChannelVideos(
    channelId: string,
    maxResults: number = 5
  ): Promise<YouTubeApiVideo[]> {
    // Step 1: Search for video IDs
    const searchUrl = new URL(`${this.baseUrl}/search`);
    searchUrl.searchParams.set('part', 'snippet');
    searchUrl.searchParams.set('channelId', channelId);
    searchUrl.searchParams.set('order', 'date');
    searchUrl.searchParams.set('type', 'video');
    searchUrl.searchParams.set('maxResults', maxResults.toString());
    searchUrl.searchParams.set('key', this.apiKey);
    
    // Add localization parameter if locale is provided
    if (this.locale) {
      searchUrl.searchParams.set('hl', this.locale);
    }

    try {
      const searchResponse = await fetch(searchUrl.toString(), {
        next: { revalidate: this.revalidate },
      });

      if (!searchResponse.ok) {
        throw this.handleError(searchResponse);
      }

      const searchData: YouTubeApiSearchResponse = await searchResponse.json();

      // If no videos found, return empty array
      if (!searchData.items || searchData.items.length === 0) {
        return [];
      }

      // Extract video IDs
      const videoIds = searchData.items.map((item) => item.id.videoId);

      // Step 2: Fetch video details and statistics
      const videosUrl = new URL(`${this.baseUrl}/videos`);
      videosUrl.searchParams.set('part', 'snippet,statistics');
      videosUrl.searchParams.set('id', videoIds.join(','));
      videosUrl.searchParams.set('key', this.apiKey);
      
      // Add localization parameter if locale is provided
      if (this.locale) {
        videosUrl.searchParams.set('hl', this.locale);
      }

      const videosResponse = await fetch(videosUrl.toString(), {
        next: { revalidate: this.revalidate },
      });

      if (!videosResponse.ok) {
        throw this.handleError(videosResponse);
      }

      const videosData = await videosResponse.json();

      // Validate response structure
      if (!videosData.items || !Array.isArray(videosData.items)) {
        return [];
      }

      return videosData.items as YouTubeApiVideo[];
    } catch (error) {
      // Re-throw if already classified by handleError
      if (error instanceof Error && error.name.includes('Error')) {
        throw error;
      }
      // Handle network errors and other exceptions
      throw this.handleError(error);
    }
  }
}
