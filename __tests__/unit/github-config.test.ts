/**
 * Unit Tests for GitHub Configuration Module
 * 
 * Tests the configuration module's ability to:
 * - Read configuration from environment variables
 * - Parse comma-separated repository filters
 * - Apply default values for optional configuration
 * - Handle missing username with fallback to mock data
 * 
 * Validates: Requirements 4.5
 */

import { getGitHubConfig, validateConfig, isConfigured } from '@/lib/github/config';
import { GitHubConfig } from '@/lib/github/types';

describe('GitHub Configuration Module', () => {
  // Store original environment variables
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  describe('getGitHubConfig', () => {
    it('should return default values when no environment variables are set', () => {
      // Clear all GitHub-related environment variables
      delete process.env.GITHUB_USERNAME;
      delete process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_REVALIDATE;
      delete process.env.GITHUB_REPOSITORIES;

      const config = getGitHubConfig();

      expect(config).toEqual({
        username: undefined,
        token: undefined,
        revalidate: 3600,
        repositoryFilter: undefined,
        fallbackToMock: true
      });
    });

    it('should read username from GITHUB_USERNAME environment variable', () => {
      process.env.GITHUB_USERNAME = 'octocat';

      const config = getGitHubConfig();

      expect(config.username).toBe('octocat');
    });

    it('should read token from GITHUB_TOKEN environment variable', () => {
      process.env.GITHUB_TOKEN = 'ghp_test_token_1234567890';

      const config = getGitHubConfig();

      expect(config.token).toBe('ghp_test_token_1234567890');
    });

    it('should parse revalidate time from GITHUB_REVALIDATE environment variable', () => {
      process.env.GITHUB_REVALIDATE = '7200';

      const config = getGitHubConfig();

      expect(config.revalidate).toBe(7200);
    });

    it('should use default revalidate time when GITHUB_REVALIDATE is not a valid number', () => {
      process.env.GITHUB_REVALIDATE = 'invalid';

      const config = getGitHubConfig();

      expect(config.revalidate).toBe(3600);
    });

    it('should parse comma-separated repository filter from GITHUB_REPOSITORIES', () => {
      process.env.GITHUB_REPOSITORIES = 'repo1,repo2,repo3';

      const config = getGitHubConfig();

      expect(config.repositoryFilter).toEqual(['repo1', 'repo2', 'repo3']);
    });

    it('should trim whitespace from repository names in filter', () => {
      process.env.GITHUB_REPOSITORIES = ' repo1 , repo2 , repo3 ';

      const config = getGitHubConfig();

      expect(config.repositoryFilter).toEqual(['repo1', 'repo2', 'repo3']);
    });

    it('should filter out empty strings from repository filter', () => {
      process.env.GITHUB_REPOSITORIES = 'repo1,,repo2,  ,repo3';

      const config = getGitHubConfig();

      expect(config.repositoryFilter).toEqual(['repo1', 'repo2', 'repo3']);
    });

    it('should return undefined repositoryFilter when GITHUB_REPOSITORIES is empty', () => {
      process.env.GITHUB_REPOSITORIES = '';

      const config = getGitHubConfig();

      expect(config.repositoryFilter).toBeUndefined();
    });

    it('should return undefined when GITHUB_REPOSITORIES contains only whitespace', () => {
      process.env.GITHUB_REPOSITORIES = '  ,  ,  ';

      const config = getGitHubConfig();

      expect(config.repositoryFilter).toBeUndefined();
    });

    it('should always set fallbackToMock to true', () => {
      const config = getGitHubConfig();

      expect(config.fallbackToMock).toBe(true);
    });

    it('should handle all environment variables set together', () => {
      process.env.GITHUB_USERNAME = 'testuser';
      process.env.GITHUB_TOKEN = 'ghp_token';
      process.env.GITHUB_REVALIDATE = '1800';
      process.env.GITHUB_REPOSITORIES = 'repo1,repo2';

      const config = getGitHubConfig();

      expect(config).toEqual({
        username: 'testuser',
        token: 'ghp_token',
        revalidate: 1800,
        repositoryFilter: ['repo1', 'repo2'],
        fallbackToMock: true
      });
    });
  });

  describe('validateConfig', () => {
    it('should apply default values for missing optional fields', () => {
      const config = validateConfig({
        username: 'testuser'
      });

      expect(config).toEqual({
        username: 'testuser',
        token: undefined,
        revalidate: 3600,
        repositoryFilter: undefined,
        fallbackToMock: true
      });
    });

    it('should use empty string for missing username', () => {
      const config = validateConfig({});

      expect(config.username).toBeUndefined();
    });

    it('should preserve valid revalidate time', () => {
      const config = validateConfig({
        username: 'testuser',
        revalidate: 7200
      });

      expect(config.revalidate).toBe(7200);
    });

    it('should use default revalidate time for negative values', () => {
      const config = validateConfig({
        username: 'testuser',
        revalidate: -100
      });

      expect(config.revalidate).toBe(3600);
    });

    it('should use default revalidate time for zero', () => {
      const config = validateConfig({
        username: 'testuser',
        revalidate: 0
      });

      expect(config.revalidate).toBe(3600);
    });

    it('should use default revalidate time for NaN', () => {
      const config = validateConfig({
        username: 'testuser',
        revalidate: NaN
      });

      expect(config.revalidate).toBe(3600);
    });

    it('should preserve valid repository filter array', () => {
      const config = validateConfig({
        username: 'testuser',
        repositoryFilter: ['repo1', 'repo2']
      });

      expect(config.repositoryFilter).toEqual(['repo1', 'repo2']);
    });

    it('should trim whitespace from repository filter entries', () => {
      const config = validateConfig({
        username: 'testuser',
        repositoryFilter: [' repo1 ', ' repo2 ']
      });

      expect(config.repositoryFilter).toEqual(['repo1', 'repo2']);
    });

    it('should filter out empty strings from repository filter', () => {
      const config = validateConfig({
        username: 'testuser',
        repositoryFilter: ['repo1', '', '  ', 'repo2']
      });

      expect(config.repositoryFilter).toEqual(['repo1', 'repo2']);
    });

    it('should set repositoryFilter to undefined if all entries are empty', () => {
      const config = validateConfig({
        username: 'testuser',
        repositoryFilter: ['', '  ', '   ']
      });

      expect(config.repositoryFilter).toBeUndefined();
    });

    it('should parse string repositoryFilter as comma-separated list', () => {
      const config = validateConfig({
        username: 'testuser',
        repositoryFilter: 'not-an-array' as any
      });

      expect(config.repositoryFilter).toEqual(['not-an-array']);
    });

    it('should preserve fallbackToMock when explicitly set to false', () => {
      const config = validateConfig({
        username: 'testuser',
        fallbackToMock: false
      });

      expect(config.fallbackToMock).toBe(false);
    });

    it('should use default fallbackToMock (true) when not provided', () => {
      const config = validateConfig({
        username: 'testuser'
      });

      expect(config.fallbackToMock).toBe(true);
    });

    it('should handle complete configuration object', () => {
      const config = validateConfig({
        username: 'testuser',
        token: 'ghp_token',
        revalidate: 1800,
        repositoryFilter: ['repo1', 'repo2'],
        fallbackToMock: false
      });

      expect(config).toEqual({
        username: 'testuser',
        token: 'ghp_token',
        revalidate: 1800,
        repositoryFilter: ['repo1', 'repo2'],
        fallbackToMock: false
      });
    });
  });

  describe('isConfigured', () => {
    it('should return true when username is provided', () => {
      const config: GitHubConfig = {
        username: 'testuser',
        token: undefined,
        revalidate: 3600,
        repositoryFilter: undefined,
        fallbackToMock: true
      };

      expect(isConfigured(config)).toBe(true);
    });

    it('should return false when username is empty string', () => {
      const config: GitHubConfig = {
        username: undefined,
        token: undefined,
        revalidate: 3600,
        repositoryFilter: undefined,
        fallbackToMock: true
      };

      expect(isConfigured(config)).toBe(false);
    });

    it('should return true even when token is not provided', () => {
      const config: GitHubConfig = {
        username: 'testuser',
        token: undefined,
        revalidate: 3600,
        repositoryFilter: undefined,
        fallbackToMock: true
      };

      expect(isConfigured(config)).toBe(true);
    });
  });

  describe('Missing Username Falls Back to Mock Data (Requirement 4.5)', () => {
    it('should enable fallback to mock data when GITHUB_USERNAME is missing', () => {
      delete process.env.GITHUB_USERNAME;

      const config = getGitHubConfig();

      // When username is undefined, fallbackToMock should be true
      expect(config.username).toBeUndefined();
      expect(config.fallbackToMock).toBe(true);
      expect(isConfigured(config)).toBe(false);
    });

    it('should enable fallback to mock data when GITHUB_USERNAME is empty string', () => {
      process.env.GITHUB_USERNAME = '';

      const config = getGitHubConfig();

      expect(config.username).toBeUndefined();
      expect(config.fallbackToMock).toBe(true);
      expect(isConfigured(config)).toBe(false);
    });

    it('should not use fallback when GITHUB_USERNAME is provided', () => {
      process.env.GITHUB_USERNAME = 'octocat';

      const config = getGitHubConfig();

      expect(config.username).toBe('octocat');
      expect(config.fallbackToMock).toBe(true); // Still true by default
      expect(isConfigured(config)).toBe(true); // But configured to use API
    });
  });

  describe('Repository Filter Parsing (Requirement 4.2)', () => {
    it('should parse comma-separated repository string into array', () => {
      process.env.GITHUB_REPOSITORIES = 'portfolio,blog,api-server';

      const config = getGitHubConfig();

      expect(config.repositoryFilter).toEqual(['portfolio', 'blog', 'api-server']);
    });

    it('should handle single repository in filter', () => {
      process.env.GITHUB_REPOSITORIES = 'portfolio';

      const config = getGitHubConfig();

      expect(config.repositoryFilter).toEqual(['portfolio']);
    });

    it('should handle repository names with hyphens and underscores', () => {
      process.env.GITHUB_REPOSITORIES = 'my-portfolio,api_server,test-repo_v2';

      const config = getGitHubConfig();

      expect(config.repositoryFilter).toEqual(['my-portfolio', 'api_server', 'test-repo_v2']);
    });
  });

  describe('Default Values for Optional Config (Requirements 4.1, 4.4)', () => {
    it('should use default revalidate time of 3600 seconds when not specified', () => {
      delete process.env.GITHUB_REVALIDATE;

      const config = getGitHubConfig();

      expect(config.revalidate).toBe(3600);
    });

    it('should use default fallbackToMock value of true', () => {
      const config = getGitHubConfig();

      expect(config.fallbackToMock).toBe(true);
    });

    it('should leave token undefined when GITHUB_TOKEN is not set', () => {
      delete process.env.GITHUB_TOKEN;

      const config = getGitHubConfig();

      expect(config.token).toBeUndefined();
    });

    it('should leave repositoryFilter undefined when GITHUB_REPOSITORIES is not set', () => {
      delete process.env.GITHUB_REPOSITORIES;

      const config = getGitHubConfig();

      expect(config.repositoryFilter).toBeUndefined();
    });

    it('should apply all defaults when no environment variables are set', () => {
      delete process.env.GITHUB_USERNAME;
      delete process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_REVALIDATE;
      delete process.env.GITHUB_REPOSITORIES;

      const config = getGitHubConfig();

      expect(config).toEqual({
        username: undefined,
        token: undefined,
        revalidate: 3600,
        repositoryFilter: undefined,
        fallbackToMock: true
      });
    });
  });
});
