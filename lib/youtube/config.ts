/**
 * YouTube integration configuration management
 * 
 * This module provides configuration loading and validation for the YouTube
 * Data API v3 integration. It uses shared configuration utilities from lib/api/config
 * to read environment variables and validate configuration values.
 * 
 * @module youtube/config
 */

import {
  createConfigReader,
  parseNumber,
  parseStringArray,
  parseBoolean,
  type ConfigReader,
} from '@/lib/api/config';
import type { YouTubeConfig } from './types';

/**
 * YouTube configuration reader instance
 * 
 * Reads configuration from environment variables:
 * - YOUTUBE_API_KEY: YouTube Data API v3 key (required)
 * - YOUTUBE_CHANNEL_IDS: Comma-separated list of channel IDs (required)
 * - YOUTUBE_REVALIDATE: Cache revalidation time in seconds (default: 3600)
 */
const youtubeConfigReader: ConfigReader<YouTubeConfig> = createConfigReader<YouTubeConfig>({
  mapping: {
    apiKey: 'YOUTUBE_API_KEY',
    channelIds: 'YOUTUBE_CHANNEL_IDS',
    revalidate: 'YOUTUBE_REVALIDATE',
    fallbackToMock: 'YOUTUBE_FALLBACK_TO_MOCK',
  },
  defaults: {
    apiKey: '',
    channelIds: [],
    revalidate: 3600,
    fallbackToMock: true,
  },
  validators: {
    revalidate: (value) => parseNumber(value, 3600),
    channelIds: (value) => parseStringArray(value) || [],
    fallbackToMock: (value) => parseBoolean(value, true),
  },
  requiredFields: ['apiKey', 'channelIds'],
});

/**
 * Get YouTube configuration from environment variables
 * 
 * Reads and validates YouTube configuration including API key, channel IDs,
 * and cache revalidation time. Channel IDs are parsed from a comma-separated
 * string and trimmed of whitespace.
 * 
 * @returns Complete YouTube configuration object
 * 
 * @example
 * const config = getYouTubeConfig();
 * // {
 * //   apiKey: 'AIza...',
 * //   channelIds: ['UCxxx', 'UCyyy'],
 * //   revalidate: 3600,
 * //   fallbackToMock: true
 * // }
 */
export function getYouTubeConfig(): YouTubeConfig {
  return youtubeConfigReader.read();
}

/**
 * Validate and normalize a partial YouTube configuration
 * 
 * Applies default values and validators to a partial configuration object.
 * Useful for testing or when configuration comes from sources other than
 * environment variables.
 * 
 * @param config - Partial configuration to validate
 * @returns Complete, validated configuration object
 * 
 * @example
 * const config = validateYouTubeConfig({
 *   apiKey: 'AIza...',
 *   channelIds: ['UCxxx']
 * });
 * // Returns config with defaults applied for revalidate and fallbackToMock
 */
export function validateYouTubeConfig(config: Partial<YouTubeConfig>): YouTubeConfig {
  return youtubeConfigReader.validate(config);
}

/**
 * Check if YouTube integration is properly configured
 * 
 * Verifies that all required configuration fields (apiKey and channelIds)
 * are present and valid. Returns false if any required field is missing,
 * empty, or invalid.
 * 
 * @param config - Configuration to check
 * @returns True if all required fields are present and valid
 * 
 * @example
 * const config = getYouTubeConfig();
 * if (isYouTubeConfigured(config)) {
 *   // Safe to use YouTube API
 * } else {
 *   // Display error state
 * }
 */
export function isYouTubeConfigured(config: YouTubeConfig): boolean {
  return youtubeConfigReader.isConfigured(config);
}
