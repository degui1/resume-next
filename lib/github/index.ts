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

// Export client and service classes
export { GitHubClient } from './client';
export { GitHubService } from './service';

// Export transformer functions
export {
  transformRepository,
  transformRepositories,
  extractTechnologies,
} from './transformer';

// Export configuration functions
export { getGitHubConfig, validateConfig, isConfigured } from './config';

// Export formatting utilities (re-exported from shared utilities)
export { formatLargeNumber, formatDate, formatNumber } from '@/lib/api/formatters';

// Export error handling utilities (re-exported from error-handler)
export {
  handleGitHubError,
  ERROR_MESSAGES,
  GitHubError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  isRateLimitError,
  isNotFoundError,
  isAuthenticationError,
} from './error-handler';
