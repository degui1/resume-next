/**
 * GitHub Configuration Module
 * 
 * Manages configuration for GitHub API integration using shared configuration utilities.
 * Provides GitHub-specific configuration reader with environment variable mappings.
 */

import { createConfigReader, parseNumber, parseStringArray } from '@/lib/api/config';
import { GitHubConfig } from './types';

/**
 * GitHub configuration reader using shared utilities
 */
const githubConfigReader = createConfigReader<GitHubConfig & Record<string, unknown>>({
  mapping: {
    username: 'GITHUB_USERNAME',
    token: 'GITHUB_TOKEN',
    revalidate: 'GITHUB_REVALIDATE',
    repositoryFilter: 'GITHUB_REPOSITORIES'
  },
  defaults: {
    username: '',
    revalidate: 3600,
    fallbackToMock: true
  },
  validators: {
    revalidate: (value) => {
      const parsed = parseNumber(value, 3600);
      // Ensure positive number
      return parsed > 0 ? parsed : 3600;
    },
    repositoryFilter: (value) => {
      // If it's already an array, validate and clean it
      if (Array.isArray(value)) {
        const cleaned = value
          .filter(repo => typeof repo === 'string' && repo.trim().length > 0)
          .map(repo => repo.trim());
        return cleaned.length > 0 ? cleaned : undefined;
      }
      // If it's a string, try to parse it
      if (typeof value === 'string') {
        const parsed = parseStringArray(value);
        // Return empty array if parsing resulted in no items (for backward compatibility with getGitHubConfig)
        return parsed ?? [];
      }
      // For any other type, return undefined
      return undefined;
    }
  },
  requiredFields: ['username']
});

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
  return githubConfigReader.read();
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
  return githubConfigReader.validate(config);
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
  return githubConfigReader.isConfigured(config);
}

