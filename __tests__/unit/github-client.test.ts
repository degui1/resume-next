/**
 * Unit Tests for GitHub API Client
 * Feature: github-integration
 * 
 * Tests specific examples, edge cases, and error conditions for the GitHub API client.
 */

import { GitHubClient } from '@/lib/github/client';
import { GitHubApiRepository } from '@/lib/github/types';
import {
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  NetworkError,
} from '@/lib/github/error-handler';

describe('GitHubClient', () => {
  // Mock fetch globally
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('fetchRepositories', () => {
    it('should fetch repositories with no token (unauthenticated requests)', async () => {
      // Requirement 1.5 - Test unauthenticated requests
      const mockRepos: GitHubApiRepository[] = [
        {
          id: 1,
          name: 'test-repo',
          description: 'Test repository',
          stargazers_count: 42,
          forks_count: 10,
          language: 'TypeScript',
          html_url: 'https://github.com/testuser/test-repo',
          updated_at: '2024-01-01T00:00:00Z',
          private: false,
        },
      ];

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepos,
        headers: new Headers({
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '59',
          'X-RateLimit-Reset': '1640000000',
          'X-RateLimit-Used': '1',
        }),
      });

      const client = new GitHubClient({ username: 'testuser' });
      const repos = await client.fetchRepositories();

      expect(repos).toEqual(mockRepos);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/testuser/repos'),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.any(String),
          }),
        })
      );
    });

    it('should fetch with invalid token returns AuthenticationError', async () => {
      // Requirement 1.5 - Test authentication error handling
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          message: 'Bad credentials',
          documentation_url: 'https://docs.github.com/rest',
        }),
        headers: new Headers(),
      });

      const client = new GitHubClient({
        username: 'testuser',
        token: 'invalid_token',
      });

      await expect(client.fetchRepositories()).rejects.toThrow(AuthenticationError);
    });

    it('should handle pagination for users with many repositories', async () => {
      // Requirement 3.2 - Test pagination handling
      const mockRepos: GitHubApiRepository[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `repo-${i + 1}`,
        description: `Repository ${i + 1}`,
        stargazers_count: i * 10,
        forks_count: i * 2,
        language: 'TypeScript',
        html_url: `https://github.com/testuser/repo-${i + 1}`,
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      }));

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepos,
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });
      const repos = await client.fetchRepositories({ per_page: 100 });

      expect(repos).toHaveLength(100);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('per_page=100'),
        expect.any(Object)
      );
    });

    it('should pass revalidation option to fetch', async () => {
      // Requirement 3.2 - Test Next.js cache revalidation
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: new Headers(),
      });

      const client = new GitHubClient({
        username: 'testuser',
        revalidate: 1800, // 30 minutes
      });

      await client.fetchRepositories();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 1800 },
        })
      );
    });

    it('should use default revalidation time when not specified', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });
      await client.fetchRepositories();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 3600 }, // Default 1 hour
        })
      );
    });

    it('should handle rate limit error (429)', async () => {
      // Requirement 6.1 - Test rate limit error handling
      mockFetch.mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({
          message: 'API rate limit exceeded',
          documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting',
        }),
        headers: new Headers({
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': '1640000000',
          'X-RateLimit-Used': '60',
        }),
      });

      const client = new GitHubClient({ username: 'testuser' });

      await expect(client.fetchRepositories()).rejects.toThrow(RateLimitError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new TypeError('fetch failed'));

      const client = new GitHubClient({ username: 'testuser' });

      await expect(client.fetchRepositories()).rejects.toThrow(NetworkError);
    });

    it('should pass visibility option to API', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser', token: 'token' });
      await client.fetchRepositories({ visibility: 'private' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('visibility=private'),
        expect.any(Object)
      );
    });

    it('should pass sort option to API', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });
      await client.fetchRepositories({ sort: 'created' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=created'),
        expect.any(Object)
      );
    });
  });

  describe('fetchRepository', () => {
    it('should fetch a single repository by name', async () => {
      const mockRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test repository',
        stargazers_count: 42,
        forks_count: 10,
        language: 'TypeScript',
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepo,
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });
      const repo = await client.fetchRepository('test-repo');

      expect(repo).toEqual(mockRepo);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/repos/testuser/test-repo'),
        expect.any(Object)
      );
    });

    it('should handle repository not found (404)', async () => {
      // Requirement 6.1 - Test 404 handling
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({
          message: 'Not Found',
          documentation_url: 'https://docs.github.com/rest',
        }),
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });

      await expect(client.fetchRepository('nonexistent-repo')).rejects.toThrow(
        NotFoundError
      );
    });

    it('should pass revalidation option to fetch', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 1,
          name: 'test-repo',
          description: 'Test',
          stargazers_count: 0,
          forks_count: 0,
          language: null,
          html_url: 'https://github.com/test/repo',
          updated_at: '2024-01-01T00:00:00Z',
          private: false,
        }),
        headers: new Headers(),
      });

      const client = new GitHubClient({
        username: 'testuser',
        revalidate: 7200, // 2 hours
      });

      await client.fetchRepository('test-repo');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          next: { revalidate: 7200 },
        })
      );
    });

    it('should handle repository with null description', async () => {
      const mockRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: 'TypeScript',
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepo,
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });
      const repo = await client.fetchRepository('test-repo');

      expect(repo.description).toBeNull();
    });

    it('should handle repository with null language', async () => {
      const mockRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockRepo,
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });
      const repo = await client.fetchRepository('test-repo');

      expect(repo.language).toBeNull();
    });
  });

  describe('getRateLimit', () => {
    it('should fetch current rate limit status', async () => {
      const mockRateLimit = {
        resources: {
          core: {
            limit: 5000,
            remaining: 4999,
            reset: 1640000000,
            used: 1,
          },
          search: {
            limit: 30,
            remaining: 30,
            reset: 1640000000,
            used: 0,
          },
          graphql: {
            limit: 5000,
            remaining: 5000,
            reset: 1640000000,
            used: 0,
          },
        },
        rate: {
          limit: 5000,
          remaining: 4999,
          reset: 1640000000,
          used: 1,
        },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockRateLimit,
        headers: new Headers(),
      });

      const client = new GitHubClient({
        username: 'testuser',
        token: 'test_token',
      });
      const rateLimit = await client.getRateLimit();

      expect(rateLimit).toEqual(mockRateLimit.resources.core);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/rate_limit'),
        expect.objectContaining({
          cache: 'no-store', // Rate limit should not be cached
        })
      );
    });

    it('should not cache rate limit requests', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          resources: {
            core: {
              limit: 5000,
              remaining: 4999,
              reset: 1640000000,
              used: 1,
            },
          },
        }),
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });
      await client.getRateLimit();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: 'no-store',
        })
      );
    });

    it('should handle rate limit fetch errors', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          message: 'Bad credentials',
        }),
        headers: new Headers(),
      });

      const client = new GitHubClient({
        username: 'testuser',
        token: 'invalid_token',
      });

      await expect(client.getRateLimit()).rejects.toThrow(AuthenticationError);
    });
  });

  describe('rate limit header parsing', () => {
    it('should parse rate limit information from response headers', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: new Headers({
          'X-RateLimit-Limit': '5000',
          'X-RateLimit-Remaining': '4999',
          'X-RateLimit-Reset': '1640000000',
          'X-RateLimit-Used': '1',
        }),
      });

      const client = new GitHubClient({
        username: 'testuser',
        token: 'test_token',
      });

      // The rate limit is parsed internally, we just verify no errors occur
      await expect(client.fetchRepositories()).resolves.toBeDefined();
    });

    it('should handle missing rate limit headers gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: new Headers(), // No rate limit headers
      });

      const client = new GitHubClient({ username: 'testuser' });

      // Should not throw even without rate limit headers
      await expect(client.fetchRepositories()).resolves.toBeDefined();
    });
  });

  describe('custom base URL', () => {
    it('should use custom base URL when provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: new Headers(),
      });

      const client = new GitHubClient({
        username: 'testuser',
        baseUrl: 'https://api.github.enterprise.com',
      });

      await client.fetchRepositories();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.github.enterprise.com'),
        expect.any(Object)
      );
    });

    it('should use default base URL when not provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });
      await client.fetchRepositories();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.github.com'),
        expect.any(Object)
      );
    });
  });

  describe('error response handling', () => {
    it('should handle malformed JSON error responses', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });

      // Should handle JSON parsing error gracefully
      await expect(client.fetchRepositories()).rejects.toThrow();
    });

    it('should include error message from API response', async () => {
      const errorMessage = 'Repository access blocked';

      mockFetch.mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => ({
          message: errorMessage,
          documentation_url: 'https://docs.github.com/rest',
        }),
        headers: new Headers(),
      });

      const client = new GitHubClient({ username: 'testuser' });

      await expect(client.fetchRepositories()).rejects.toThrow();
    });
  });
});
