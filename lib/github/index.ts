/**
 * GitHub Integration Module
 * 
 * This module provides GitHub API integration for fetching repository data.
 * It includes API client, rate limiting, caching, and error handling.
 */

// Export all types
export type {
  GitHubApiRepository,
  GitHubRateLimit,
  GitHubApiRateLimitResponse,
  GitHubApiError,
  GitHubClientConfig,
  GitHubServiceConfig,
  GitHubConfig,
  RateLimitState,
  RateLimitInfo,
  FetchRepositoriesResult,
  GitHubFetchOptions,
  GitHubProject,
} from './types';

// Export configuration functions
export { getGitHubConfig, validateConfig, isConfigured } from './config';

// Export formatting utilities
export { formatLargeNumber, formatDate, formatNumber } from './formatters';
