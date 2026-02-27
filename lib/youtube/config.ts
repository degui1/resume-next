/**
 * YouTube API Configuration Management
 * 
 * This module provides YouTube-specific configuration management
 * using the shared configuration utilities from @/lib/api/config.
 */

import { createConfigReader, parseNumber, parseStringArray, parseBoolean } from '@/lib/api/config';

/**
 * YouTube API Configuration
 * 
 * Configuration options for the YouTube API integration.
 * 
 * @property apiKey - YouTube Data API v3 key (required)
 * @property channelId - Default YouTube channel ID to fetch data from (optional)
 * @property revalidate - Cache revalidation time in seconds (default: 3600)
 * @property maxResults - Maximum number of results to fetch per request (default: 10)
 * @property fallbackToMock - Whether to use mock data when API is unavailable (default: true)
 * @property videoFilter - Array of video IDs to filter/include (optional)
 */
export interface YouTubeConfig extends Record<string, unknown> {
  apiKey: string;
  channelId?: string;
  revalidate: number;
  maxResults: number;
  fallbackToMock: boolean;
  videoFilter?: string[];
}

/**
 * YouTube configuration reader
 * 
 * Reads and validates YouTube API configuration from environment variables.
 * 
 * Environment Variables:
 * - YOUTUBE_API_KEY: YouTube Data API v3 key (required)
 * - YOUTUBE_CHANNEL_ID: Default channel ID (optional)
 * - YOUTUBE_REVALIDATE: Cache revalidation time in seconds (default: 3600)
 * - YOUTUBE_MAX_RESULTS: Maximum results per request (default: 10)
 * - YOUTUBE_FALLBACK_TO_MOCK: Use mock data on failure (default: true)
 * - YOUTUBE_VIDEOS: Comma-separated list of video IDs to filter (optional)
 * 
 * @example
 * ```typescript
 * const config = getYouTubeConfig();
 * console.log(config.apiKey); // From YOUTUBE_API_KEY env var
 * console.log(config.revalidate); // 3600 (default) or from YOUTUBE_REVALIDATE
 * ```
 */
const youtubeConfigReader = createConfigReader<YouTubeConfig>({
  mapping: {
    apiKey: 'YOUTUBE_API_KEY',
    channelId: 'YOUTUBE_CHANNEL_ID',
    revalidate: 'YOUTUBE_REVALIDATE',
    maxResults: 'YOUTUBE_MAX_RESULTS',
    fallbackToMock: 'YOUTUBE_FALLBACK_TO_MOCK',
    videoFilter: 'YOUTUBE_VIDEOS',
  },
  defaults: {
    revalidate: 3600,
    maxResults: 10,
    fallbackToMock: true,
  },
  validators: {
    revalidate: (value) => parseNumber(value, 3600),
    maxResults: (value) => parseNumber(value, 10),
    fallbackToMock: (value) => parseBoolean(value, true),
    videoFilter: (value) => parseStringArray(value),
  },
  requiredFields: ['apiKey'],
});

/**
 * Get YouTube API configuration
 * 
 * Reads YouTube configuration from environment variables and applies
 * validation and default values.
 * 
 * @returns YouTube configuration object
 * 
 * @example
 * ```typescript
 * const config = getYouTubeConfig();
 * if (isYouTubeConfigured(config)) {
 *   // API key is present, can make API requests
 *   const data = await fetchYouTubeData(config);
 * } else {
 *   // API key missing, use mock data
 *   const data = getMockYouTubeData();
 * }
 * ```
 */
export const getYouTubeConfig = (): YouTubeConfig => {
  return youtubeConfigReader.read();
};

/**
 * Validate YouTube configuration
 * 
 * Validates a partial configuration object and returns a complete
 * configuration with defaults applied.
 * 
 * @param config - Partial configuration to validate
 * @returns Complete validated configuration
 * 
 * @example
 * ```typescript
 * const userConfig = { apiKey: 'abc123', maxResults: 25 };
 * const validConfig = validateYouTubeConfig(userConfig);
 * console.log(validConfig.revalidate); // 3600 (default applied)
 * console.log(validConfig.maxResults); // 25 (user value preserved)
 * ```
 */
export const validateYouTubeConfig = (config: Partial<YouTubeConfig>): YouTubeConfig => {
  return youtubeConfigReader.validate(config);
};

/**
 * Check if YouTube is configured
 * 
 * Checks if the required YouTube API configuration (API key) is present.
 * 
 * @param config - Configuration to check
 * @returns true if API key is present and valid
 * 
 * @example
 * ```typescript
 * const config = getYouTubeConfig();
 * if (isYouTubeConfigured(config)) {
 *   console.log('YouTube API is configured');
 * } else {
 *   console.log('YouTube API key is missing');
 * }
 * ```
 */
export const isYouTubeConfigured = (config: YouTubeConfig): boolean => {
  return youtubeConfigReader.isConfigured(config);
};
