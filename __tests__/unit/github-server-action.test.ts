/**
 * Unit Tests for GitHub Server Action
 * Feature: github-integration
 * 
 * Tests the server action for fetching GitHub data.
 */

import { getGitHubProjects } from '@/app/actions/github';
import { GitHubService } from '@/lib/github/service';
import { getGitHubConfig } from '@/lib/github/config';

// Mock the dependencies
jest.mock('@/lib/github/service');
jest.mock('@/lib/github/config');

describe('GitHub Server Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGitHubProjects', () => {
    it('should initialize service with config from environment variables', async () => {
      // Requirement 4.1, 4.4 - Read configuration from environment variables
      const mockConfig = {
        username: 'testuser',
        token: 'test-token',
        revalidate: 3600,
        repositoryFilter: ['repo1', 'repo2'],
        fallbackToMock: true,
      };

      const mockResult = {
        data: [],
        source: 'api' as const,
      };

      (getGitHubConfig as jest.Mock).mockReturnValue(mockConfig);
      (GitHubService as jest.Mock).mockImplementation(() => ({
        getRepositories: jest.fn().mockResolvedValue(mockResult),
      }));

      await getGitHubProjects();

      // Verify config was loaded
      expect(getGitHubConfig).toHaveBeenCalledTimes(1);

      // Verify service was initialized with correct config
      expect(GitHubService).toHaveBeenCalledWith({
        username: mockConfig.username,
        token: mockConfig.token,
        revalidate: mockConfig.revalidate,
        repositoryFilter: mockConfig.repositoryFilter,
      });
    });

    it('should call service.getRepositories() and return result', async () => {
      // Requirement 1.1, 1.2, 1.3 - Fetch repository data
      const mockConfig = {
        username: 'testuser',
        token: 'test-token',
        revalidate: 3600,
        fallbackToMock: true,
      };

      const mockResult = {
        data: [
          {
            id: '1',
            name: 'test-repo',
            description: 'Test repository',
            stars: 100,
            forks: 20,
            url: 'https://github.com/testuser/test-repo',
            technologies: ['TypeScript'],
            language: 'TypeScript',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        source: 'api' as const,
        rateLimit: {
          canMakeRequest: true,
          remaining: 5000,
          resetAt: new Date('2024-01-01T01:00:00Z'),
        },
      };

      const mockGetRepositories = jest.fn().mockResolvedValue(mockResult);

      (getGitHubConfig as jest.Mock).mockReturnValue(mockConfig);
      (GitHubService as jest.Mock).mockImplementation(() => ({
        getRepositories: mockGetRepositories,
      }));

      const result = await getGitHubProjects();

      // Verify service method was called
      expect(mockGetRepositories).toHaveBeenCalledTimes(1);

      // Verify result is returned correctly
      expect(result).toEqual(mockResult);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('test-repo');
      expect(result.source).toBe('api');
      expect(result.rateLimit).toBeDefined();
    });

    it('should return error response when service throws error', async () => {
      // Requirement 1.4 - Handle errors and return error responses
      const mockConfig = {
        username: 'testuser',
        token: 'test-token',
        revalidate: 3600,
        fallbackToMock: true,
      };

      const mockError = new Error('Network error');

      (getGitHubConfig as jest.Mock).mockReturnValue(mockConfig);
      (GitHubService as jest.Mock).mockImplementation(() => ({
        getRepositories: jest.fn().mockRejectedValue(mockError),
      }));

      const result = await getGitHubProjects();

      // Verify error is handled gracefully
      expect(result.data).toEqual([]);
      expect(result.source).toBe('fallback');
      expect(result.error).toContain('Failed to fetch GitHub projects');
      expect(result.error).toContain('Network error');
    });

    it('should handle service returning error in result', async () => {
      // Requirement 1.4 - Handle API errors
      const mockConfig = {
        username: 'testuser',
        token: 'test-token',
        revalidate: 3600,
        fallbackToMock: true,
      };

      const mockResult = {
        data: [],
        source: 'fallback' as const,
        error: 'Rate limit exceeded',
        rateLimit: {
          canMakeRequest: false,
          remaining: 0,
          resetAt: new Date('2024-01-01T01:00:00Z'),
          retryAfter: 3600,
        },
      };

      (getGitHubConfig as jest.Mock).mockReturnValue(mockConfig);
      (GitHubService as jest.Mock).mockImplementation(() => ({
        getRepositories: jest.fn().mockResolvedValue(mockResult),
      }));

      const result = await getGitHubProjects();

      // Verify error result is returned correctly
      expect(result.data).toEqual([]);
      expect(result.source).toBe('fallback');
      expect(result.error).toBe('Rate limit exceeded');
      expect(result.rateLimit).toBeDefined();
      expect(result.rateLimit?.canMakeRequest).toBe(false);
    });

    it('should pass repository filter to service', async () => {
      // Requirement 4.2 - Repository filtering
      const mockConfig = {
        username: 'testuser',
        token: 'test-token',
        revalidate: 3600,
        repositoryFilter: ['repo1', 'repo2', 'repo3'],
        fallbackToMock: true,
      };

      const mockResult = {
        data: [],
        source: 'api' as const,
      };

      (getGitHubConfig as jest.Mock).mockReturnValue(mockConfig);
      (GitHubService as jest.Mock).mockImplementation(() => ({
        getRepositories: jest.fn().mockResolvedValue(mockResult),
      }));

      await getGitHubProjects();

      // Verify repository filter was passed to service
      expect(GitHubService).toHaveBeenCalledWith(
        expect.objectContaining({
          repositoryFilter: ['repo1', 'repo2', 'repo3'],
        })
      );
    });

    it('should pass revalidate time to service', async () => {
      // Requirement 3.2 - Revalidation time configuration
      const mockConfig = {
        username: 'testuser',
        token: 'test-token',
        revalidate: 7200, // 2 hours
        fallbackToMock: true,
      };

      const mockResult = {
        data: [],
        source: 'api' as const,
      };

      (getGitHubConfig as jest.Mock).mockReturnValue(mockConfig);
      (GitHubService as jest.Mock).mockImplementation(() => ({
        getRepositories: jest.fn().mockResolvedValue(mockResult),
      }));

      await getGitHubProjects();

      // Verify revalidate time was passed to service
      expect(GitHubService).toHaveBeenCalledWith(
        expect.objectContaining({
          revalidate: 7200,
        })
      );
    });

    it('should handle missing username configuration', async () => {
      // Requirement 4.5 - Fall back to mock data when username not configured
      const mockConfig = {
        username: '',
        token: undefined,
        revalidate: 3600,
        fallbackToMock: true,
      };

      const mockResult = {
        data: [],
        source: 'fallback' as const,
        error: 'GitHub username not configured',
      };

      (getGitHubConfig as jest.Mock).mockReturnValue(mockConfig);
      (GitHubService as jest.Mock).mockImplementation(() => ({
        getRepositories: jest.fn().mockResolvedValue(mockResult),
      }));

      const result = await getGitHubProjects();

      // Verify fallback behavior
      expect(result.source).toBe('fallback');
      expect(result.error).toContain('not configured');
    });

    it('should include rate limit information in response', async () => {
      // Requirement 2.4 - Include rate limit status in response metadata
      const mockConfig = {
        username: 'testuser',
        token: 'test-token',
        revalidate: 3600,
        fallbackToMock: true,
      };

      const mockRateLimit = {
        canMakeRequest: true,
        remaining: 4999,
        resetAt: new Date('2024-01-01T01:00:00Z'),
        retryAfter: undefined,
      };

      const mockResult = {
        data: [],
        source: 'api' as const,
        rateLimit: mockRateLimit,
      };

      (getGitHubConfig as jest.Mock).mockReturnValue(mockConfig);
      (GitHubService as jest.Mock).mockImplementation(() => ({
        getRepositories: jest.fn().mockResolvedValue(mockResult),
      }));

      const result = await getGitHubProjects();

      // Verify rate limit info is included
      expect(result.rateLimit).toBeDefined();
      expect(result.rateLimit?.canMakeRequest).toBe(true);
      expect(result.rateLimit?.remaining).toBe(4999);
      expect(result.rateLimit?.resetAt).toEqual(mockRateLimit.resetAt);
    });
  });
});
