/**
 * GitHub Configuration Module
 * 
 * Manages configuration for GitHub API integration, including:
 * - Reading configuration from environment variables
 * - Validating configuration values
 * - Providing default values
 * - Parsing repository filters
 */

import { GitHubConfig } from './types';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  revalidate: 3600, // 1 hour in seconds (Next.js revalidation)
  fallbackToMock: true,
  baseUrl: 'https://api.github.com'
} as const;

/**
 * Environment variable names for GitHub configuration
 */
const ENV_VARS = {
  USERNAME: 'GITHUB_USERNAME',
  TOKEN: 'GITHUB_TOKEN',
  REVALIDATE: 'GITHUB_REVALIDATE',
  REPOSITORIES: 'GITHUB_REPOSITORIES'
} as const;

/**
 * Get GitHub configuration from environment variables
 * 
 * Reads configuration values from environment variables and returns
 * a complete GitHubConfig object with defaults applied.
 * 
 * Environment Variables:
 * - GITHUB_USERNAME: GitHub username (required for API mode)
 * - GITHUB_TOKEN: GitHub personal access token (optional)
 * - GITHUB_REVALIDATE: Revalidation time in seconds (default: 3600)
 * - GITHUB_REPOSITORIES: Comma-separated list of repository names (optional)
 * 
 * @returns {GitHubConfig} Complete configuration object with defaults
 * 
 * @example
 * // With all environment variables set
 * const config = getGitHubConfig();
 * // { username: 'octocat', token: 'ghp_...', revalidate: 3600, repositoryFilter: ['repo1', 'repo2'], fallbackToMock: true }
 * 
 * @example
 * // With minimal configuration
 * const config = getGitHubConfig();
 * // { username: '', token: undefined, revalidate: 3600, repositoryFilter: undefined, fallbackToMock: true }
 */
export function getGitHubConfig(): GitHubConfig {
  const username = process.env[ENV_VARS.USERNAME] || '';
  const token = process.env[ENV_VARS.TOKEN];
  const revalidateStr = process.env[ENV_VARS.REVALIDATE];
  const repositoriesStr = process.env[ENV_VARS.REPOSITORIES];

  // Parse revalidation time from string to number
  const revalidate = revalidateStr 
    ? parseInt(revalidateStr, 10) 
    : DEFAULT_CONFIG.revalidate;

  // Parse repository filter from comma-separated string
  const repositoryFilter = repositoriesStr
    ? repositoriesStr.split(',').map(repo => repo.trim()).filter(repo => repo.length > 0)
    : undefined;

  return {
    username,
    token,
    revalidate: isNaN(revalidate) ? DEFAULT_CONFIG.revalidate : revalidate,
    repositoryFilter,
    fallbackToMock: DEFAULT_CONFIG.fallbackToMock
  };
}

/**
 * Validate and normalize GitHub configuration
 * 
 * Takes a partial configuration object and returns a complete, validated
 * GitHubConfig with defaults applied. This function ensures all required
 * fields are present and values are valid.
 * 
 * Validation Rules:
 * - username: Can be empty string (will trigger fallback to mock data)
 * - token: Optional, can be undefined
 * - revalidate: Must be a positive number, defaults to 3600
 * - repositoryFilter: Optional array of repository names
 * - fallbackToMock: Always true (default behavior)
 * 
 * @param {Partial<GitHubConfig>} config - Partial configuration to validate
 * @returns {GitHubConfig} Complete, validated configuration object
 * 
 * @example
 * const config = validateConfig({ username: 'octocat' });
 * // { username: 'octocat', token: undefined, revalidate: 3600, repositoryFilter: undefined, fallbackToMock: true }
 * 
 * @example
 * const config = validateConfig({ username: 'octocat', revalidate: -100 });
 * // { username: 'octocat', token: undefined, revalidate: 3600, repositoryFilter: undefined, fallbackToMock: true }
 */
export function validateConfig(config: Partial<GitHubConfig>): GitHubConfig {
  // Validate and normalize revalidate time
  let revalidate = config.revalidate ?? DEFAULT_CONFIG.revalidate;
  if (typeof revalidate !== 'number' || isNaN(revalidate) || revalidate <= 0) {
    revalidate = DEFAULT_CONFIG.revalidate;
  }

  // Validate and normalize repository filter
  let repositoryFilter = config.repositoryFilter;
  if (repositoryFilter !== undefined) {
    // Ensure it's an array and filter out empty strings
    if (!Array.isArray(repositoryFilter)) {
      repositoryFilter = undefined;
    } else {
      repositoryFilter = repositoryFilter
        .filter(repo => typeof repo === 'string' && repo.trim().length > 0)
        .map(repo => repo.trim());
      
      // If array is empty after filtering, set to undefined
      if (repositoryFilter.length === 0) {
        repositoryFilter = undefined;
      }
    }
  }

  return {
    username: config.username || '',
    token: config.token,
    revalidate,
    repositoryFilter,
    fallbackToMock: config.fallbackToMock ?? DEFAULT_CONFIG.fallbackToMock
  };
}

/**
 * Check if GitHub integration is configured
 * 
 * Returns true if a GitHub username is configured, indicating that
 * the system should attempt to fetch real GitHub data.
 * 
 * @param {GitHubConfig} config - Configuration to check
 * @returns {boolean} True if username is configured
 * 
 * @example
 * const config = getGitHubConfig();
 * if (isConfigured(config)) {
 *   // Fetch from GitHub API
 * } else {
 *   // Fall back to mock data
 * }
 */
export function isConfigured(config: GitHubConfig): boolean {
  return config.username.length > 0;
}
