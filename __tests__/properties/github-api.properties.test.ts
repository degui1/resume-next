/**
 * Property-Based Tests for GitHub API
 * Feature: github-integration
 * 
 * These tests validate correctness properties for GitHub API integration
 * using property-based testing with fast-check.
 */

import fc from 'fast-check';
import { GitHubApiRepository } from '@/lib/github/types';
import { getGitHubConfig } from '@/lib/github/config';
import { GitHubClient } from '@/lib/github/client';

/**
 * Type guard to validate if an object matches GitHubApiRepository structure
 */
function isValidGitHubApiRepository(obj: unknown): obj is GitHubApiRepository {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const repo = obj as Record<string, unknown>;

  // Check required fields with correct types
  if (typeof repo.id !== 'number' || repo.id < 0 || !Number.isInteger(repo.id)) return false;
  if (typeof repo.name !== 'string' || repo.name.trim().length === 0) return false;
  if (repo.description !== null && typeof repo.description !== 'string') return false;
  if (typeof repo.stargazers_count !== 'number' || repo.stargazers_count < 0) return false;
  if (typeof repo.forks_count !== 'number' || repo.forks_count < 0) return false;
  if (repo.language !== null && typeof repo.language !== 'string') return false;
  if (typeof repo.html_url !== 'string' || repo.html_url.trim().length === 0) return false;
  if (typeof repo.updated_at !== 'string' || repo.updated_at.trim().length === 0) return false;
  if (typeof repo.private !== 'boolean') return false;

  // Optional topics field
  if (repo.topics !== undefined) {
    if (!Array.isArray(repo.topics)) return false;
    if (!repo.topics.every(topic => typeof topic === 'string')) return false;
  }

  return true;
}

/**
 * Validates API response and rejects invalid responses
 */
function validateApiResponse(response: unknown): GitHubApiRepository {
  if (!isValidGitHubApiRepository(response)) {
    throw new Error('Invalid API response: does not match expected GitHubApiRepository structure');
  }
  return response;
}

describe('GitHub API Properties', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 1: GitHub API Communication
   * Validates: Requirements 1.1
   * 
   * For any valid GitHub username and authentication token, when the GitHub API client
   * fetches repository data, it should receive a valid response structure from the
   * GitHub REST API v3.
   */
  describe('Property 1: GitHub API Communication', () => {
    // Feature: github-integration, Property 1: GitHub API Communication

    // Arbitrary for valid GitHub usernames (alphanumeric, hyphens, max 39 chars)
    const arbGitHubUsername = fc.string({ minLength: 1, maxLength: 39 })
      .filter(s => /^[a-zA-Z0-9-]+$/.test(s) && !s.startsWith('-') && !s.endsWith('-'));

    // Arbitrary for valid GitHub tokens (ghp_ prefix followed by alphanumeric)
    const arbGitHubToken = fc.string({ minLength: 20, maxLength: 100 })
      .map(s => `ghp_${s.replace(/[^a-zA-Z0-9]/g, 'A')}`);

    it('should communicate with GitHub API and receive valid response structure', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.option(arbGitHubToken, { nil: undefined }),
          async (username, token) => {
            // Mock fetch to simulate GitHub API response
            const mockResponse = {
              id: 123456,
              name: 'test-repo',
              description: 'Test repository',
              stargazers_count: 42,
              forks_count: 10,
              language: 'TypeScript',
              html_url: 'https://github.com/test/test-repo',
              updated_at: '2024-01-01T00:00:00Z',
              private: false,
            };

            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [mockResponse],
              headers: new Headers({
                'X-RateLimit-Limit': '5000',
                'X-RateLimit-Remaining': '4999',
                'X-RateLimit-Reset': '1640000000',
                'X-RateLimit-Used': '1',
              }),
            });

            // Create client with username and optional token
            const client = new GitHubClient({ username, token });

            // Fetch repositories
            const repos = await client.fetchRepositories();

            // Verify we received a valid response structure
            expect(Array.isArray(repos)).toBe(true);
            expect(repos.length).toBeGreaterThan(0);

            // Verify the response matches GitHubApiRepository structure
            const repo = repos[0];
            expect(isValidGitHubApiRepository(repo)).toBe(true);

            // Verify fetch was called with correct URL and headers
            expect(global.fetch).toHaveBeenCalledWith(
              expect.stringContaining('/users/'),
              expect.objectContaining({
                headers: expect.objectContaining({
                  Accept: 'application/vnd.github.v3+json',
                }),
              })
            );

            // If token is provided, verify Authorization header
            if (token) {
              const calls = (global.fetch as jest.Mock).mock.calls;
              const lastCall = calls[calls.length - 1];
              expect(lastCall).toBeDefined();
              expect(lastCall[1]).toBeDefined();
              const headers = lastCall[1].headers;
              expect(headers).toBeDefined();
              
              // Verify Authorization header exists and has Bearer format
              // Headers are passed as a plain object, not a Headers instance
              const authHeader = headers['Authorization'] || headers.Authorization;
              expect(authHeader).toBeDefined();
              expect(authHeader).toMatch(/^Bearer ghp_/);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include authentication header when token is provided', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbGitHubToken,
          async (username, token) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [],
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username, token });

            await client.fetchRepositories();

            // Verify Authorization header is included
            const calls = (global.fetch as jest.Mock).mock.calls;
            expect(calls.length).toBeGreaterThan(0);
            const lastCall = calls[calls.length - 1];
            expect(lastCall).toBeDefined();
            expect(lastCall[1]).toBeDefined();
            const headers = lastCall[1].headers;
            expect(headers).toBeDefined();
            // Verify Authorization header exists and has Bearer format
            expect(headers.Authorization).toBeDefined();
            expect(headers.Authorization).toMatch(/^Bearer ghp_/);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not include authentication header when token is not provided', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          async (username) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [],
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username });

            await client.fetchRepositories();

            // Verify Authorization header is not included
            const callArgs = (global.fetch as jest.Mock).mock.calls[0];
            const headers = callArgs[1].headers;
            expect(headers.Authorization).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use correct GitHub API v3 endpoint', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          async (username) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [],
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username });

            await client.fetchRepositories();

            // Verify correct API endpoint is used
            expect(global.fetch).toHaveBeenCalledWith(
              expect.stringContaining('https://api.github.com/users/'),
              expect.any(Object)
            );

            // Verify Accept header for API v3
            expect(global.fetch).toHaveBeenCalledWith(
              expect.any(String),
              expect.objectContaining({
                headers: expect.objectContaining({
                  Accept: 'application/vnd.github.v3+json',
                }),
              })
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should pass revalidation option to Next.js fetch', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.integer({ min: 60, max: 86400 }), // 1 minute to 1 day
          async (username, revalidate) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [],
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username, revalidate });

            await client.fetchRepositories();

            // Verify revalidation option is passed to fetch
            expect(global.fetch).toHaveBeenCalledWith(
              expect.any(String),
              expect.objectContaining({
                next: { revalidate },
              })
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 2: Complete Repository Data Retrieval
   * Validates: Requirements 1.2
   * 
   * For any repository fetched from the GitHub API, the response should contain all
   * required fields: name, description, stars, forks, primary language, and URL.
   */
  describe('Property 2: Complete Repository Data Retrieval', () => {
    // Feature: github-integration, Property 2: Complete Repository Data Retrieval

    // Arbitrary for valid GitHub usernames
    const arbGitHubUsername = fc.string({ minLength: 1, maxLength: 39 })
      .filter(s => /^[a-zA-Z0-9-]+$/.test(s) && !s.startsWith('-') && !s.endsWith('-'));

    // Arbitrary for repository names
    const arbRepositoryName = fc.string({ minLength: 1, maxLength: 100 })
      .filter(s => /^[a-zA-Z0-9._-]+$/.test(s));

    // Arbitrary for complete GitHubApiRepository
    const arbCompleteRepository = fc.record({
      id: fc.nat(),
      name: arbRepositoryName,
      description: fc.option(fc.string({ maxLength: 500 }), { nil: null }),
      stargazers_count: fc.nat({ max: 1000000 }),
      forks_count: fc.nat({ max: 100000 }),
      language: fc.option(
        fc.constantFrom('TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java'),
        { nil: null }
      ),
      html_url: fc.webUrl(),
      updated_at: fc.integer({ min: 946684800000, max: 1924905600000 })
        .map(ts => new Date(ts).toISOString()),
      private: fc.boolean(),
    });

    it('should retrieve all required fields from repository data', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbCompleteRepository,
          async (username, mockRepo) => {
            // Mock fetch to return complete repository data
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => mockRepo,
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username });

            const repo = await client.fetchRepository(mockRepo.name);

            // Verify all required fields are present
            expect(repo).toHaveProperty('name');
            expect(repo).toHaveProperty('description');
            expect(repo).toHaveProperty('stargazers_count');
            expect(repo).toHaveProperty('forks_count');
            expect(repo).toHaveProperty('language');
            expect(repo).toHaveProperty('html_url');

            // Verify field values match the mock data
            expect(repo.name).toBe(mockRepo.name);
            expect(repo.description).toBe(mockRepo.description);
            expect(repo.stargazers_count).toBe(mockRepo.stargazers_count);
            expect(repo.forks_count).toBe(mockRepo.forks_count);
            expect(repo.language).toBe(mockRepo.language);
            expect(repo.html_url).toBe(mockRepo.html_url);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle repositories with null description', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbCompleteRepository,
          async (username, mockRepo) => {
            // Force null description
            const repoWithNullDescription = { ...mockRepo, description: null };

            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => repoWithNullDescription,
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username });

            const repo = await client.fetchRepository(mockRepo.name);

            // Verify description is null and other fields are present
            expect(repo.description).toBeNull();
            expect(repo.name).toBe(mockRepo.name);
            expect(repo.stargazers_count).toBe(mockRepo.stargazers_count);
            expect(repo.forks_count).toBe(mockRepo.forks_count);
            expect(repo.html_url).toBe(mockRepo.html_url);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle repositories with null language', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbCompleteRepository,
          async (username, mockRepo) => {
            // Force null language
            const repoWithNullLanguage = { ...mockRepo, language: null };

            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => repoWithNullLanguage,
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username });

            const repo = await client.fetchRepository(mockRepo.name);

            // Verify language is null and other fields are present
            expect(repo.language).toBeNull();
            expect(repo.name).toBe(mockRepo.name);
            expect(repo.description).toBe(mockRepo.description);
            expect(repo.stargazers_count).toBe(mockRepo.stargazers_count);
            expect(repo.forks_count).toBe(mockRepo.forks_count);
            expect(repo.html_url).toBe(mockRepo.html_url);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should retrieve complete data for multiple repositories', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbCompleteRepository, { minLength: 1, maxLength: 10 }),
          async (username, mockRepos) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => mockRepos,
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username });

            const repos = await client.fetchRepositories();

            // Verify all repositories have complete data
            expect(repos.length).toBe(mockRepos.length);

            repos.forEach((repo, index) => {
              const mockRepo = mockRepos[index];
              
              // Verify all required fields are present
              expect(repo.name).toBe(mockRepo.name);
              expect(repo.description).toBe(mockRepo.description);
              expect(repo.stargazers_count).toBe(mockRepo.stargazers_count);
              expect(repo.forks_count).toBe(mockRepo.forks_count);
              expect(repo.language).toBe(mockRepo.language);
              expect(repo.html_url).toBe(mockRepo.html_url);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve exact values for stars and forks counts', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.nat({ max: 1000000 }), // stars
          fc.nat({ max: 100000 }), // forks
          async (username, stars, forks) => {
            const mockRepo = {
              id: 1,
              name: 'test-repo',
              description: 'Test',
              stargazers_count: stars,
              forks_count: forks,
              language: 'TypeScript',
              html_url: 'https://github.com/test/repo',
              updated_at: '2024-01-01T00:00:00Z',
              private: false,
            };

            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => mockRepo,
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username });

            const repo = await client.fetchRepository('test-repo');

            // Verify exact counts are preserved
            expect(repo.stargazers_count).toBe(stars);
            expect(repo.forks_count).toBe(forks);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 8: Authentication Header Inclusion
   * Validates: Requirements 1.5
   * 
   * For any API request made by the GitHub client, when a token is configured, the request
   * should include proper authentication headers in the format "Authorization: Bearer {token}".
   */
  describe('Property 8: Authentication Header Inclusion', () => {
    // Feature: github-integration, Property 8: Authentication Header Inclusion

    // Arbitrary for valid GitHub usernames
    const arbGitHubUsername = fc.string({ minLength: 1, maxLength: 39 })
      .filter(s => /^[a-zA-Z0-9-]+$/.test(s) && !s.startsWith('-') && !s.endsWith('-'));

    // Arbitrary for valid GitHub tokens
    const arbGitHubToken = fc.string({ minLength: 20, maxLength: 100 })
      .map(s => `ghp_${s.replace(/[^a-zA-Z0-9]/g, 'A')}`);

    // Arbitrary for repository names
    const arbRepositoryName = fc.string({ minLength: 1, maxLength: 100 })
      .filter(s => /^[a-zA-Z0-9._-]+$/.test(s));

    it('should include Bearer token in Authorization header when token is provided', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbGitHubToken,
          async (username, token) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [],
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username, token });

            await client.fetchRepositories();

            // Verify Authorization header is present with Bearer token format
            const calls = (global.fetch as jest.Mock).mock.calls;
            const lastCall = calls[calls.length - 1];
            const headers = lastCall[1].headers;
            expect(headers.Authorization).toBe(`Bearer ${token}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include authentication header for fetchRepository requests', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbGitHubToken,
          arbRepositoryName,
          async (username, token, repoName) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => ({
                id: 1,
                name: repoName,
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

            
            const client = new GitHubClient({ username, token });

            await client.fetchRepository(repoName);

            // Verify Authorization header is present
            const calls = (global.fetch as jest.Mock).mock.calls;
            const lastCall = calls[calls.length - 1];
            const headers = lastCall[1].headers;
            expect(headers.Authorization).toBe(`Bearer ${token}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include authentication header for getRateLimit requests', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbGitHubToken,
          async (username, token) => {
            global.fetch = jest.fn().mockResolvedValue({
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

            
            const client = new GitHubClient({ username, token });

            await client.getRateLimit();

            // Verify Authorization header is present
            const calls = (global.fetch as jest.Mock).mock.calls;
            const lastCall = calls[calls.length - 1];
            const headers = lastCall[1].headers;
            expect(headers.Authorization).toBe(`Bearer ${token}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not include Authorization header when token is not provided', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          async (username) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [],
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username });

            await client.fetchRepositories();

            // Verify Authorization header is not present
            const callArgs = (global.fetch as jest.Mock).mock.calls[0];
            const headers = callArgs[1].headers;
            expect(headers.Authorization).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not include Authorization header when token is undefined', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          async (username) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [],
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username, token: undefined });

            await client.fetchRepositories();

            // Verify Authorization header is not present
            const callArgs = (global.fetch as jest.Mock).mock.calls[0];
            const headers = callArgs[1].headers;
            expect(headers.Authorization).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use exact token value without modification', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbGitHubToken,
          async (username, token) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [],
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username, token });

            await client.fetchRepositories();

            // Verify token is used exactly as provided (not trimmed, modified, etc.)
            const callArgs = (global.fetch as jest.Mock).mock.calls[0];
            const authHeader = callArgs[1].headers.Authorization;
            expect(authHeader).toBe(`Bearer ${token}`);
            expect(authHeader).toContain(token);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include authentication header for all API requests when token is configured', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbGitHubToken,
          arbRepositoryName,
          async (username, token, repoName) => {
            // Mock responses for different endpoints
            global.fetch = jest.fn()
              .mockResolvedValueOnce({
                ok: true,
                json: async () => [],
                headers: new Headers(),
              })
              .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                  id: 1,
                  name: repoName,
                  description: 'Test',
                  stargazers_count: 0,
                  forks_count: 0,
                  language: null,
                  html_url: 'https://github.com/test/repo',
                  updated_at: '2024-01-01T00:00:00Z',
                  private: false,
                }),
                headers: new Headers(),
              })
              .mockResolvedValueOnce({
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

            
            const client = new GitHubClient({ username, token });

            // Make multiple API requests
            await client.fetchRepositories();
            await client.fetchRepository(repoName);
            await client.getRateLimit();

            // Verify all requests include Authorization header
            const calls = (global.fetch as jest.Mock).mock.calls;
            expect(calls.length).toBe(3);

            calls.forEach(call => {
              const headers = call[1].headers;
              expect(headers.Authorization).toBe(`Bearer ${token}`);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always include Accept header for GitHub API v3', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.option(arbGitHubToken, { nil: undefined }),
          async (username, token) => {
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => [],
              headers: new Headers(),
            });

            
            const client = new GitHubClient({ username, token });

            await client.fetchRepositories();

            // Verify Accept header is always present
            expect(global.fetch).toHaveBeenCalledWith(
              expect.any(String),
              expect.objectContaining({
                headers: expect.objectContaining({
                  Accept: 'application/vnd.github.v3+json',
                }),
              })
            );
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 17: API Response Type Validation
   * Validates: Requirements 8.5
   * 
   * For any response received from the GitHub API, before processing, the system should
   * validate that the response structure matches the expected TypeScript types and reject
   * invalid responses.
   */
  describe('Property 17: API Response Type Validation', () => {
    // Arbitrary for valid GitHubApiRepository
    const arbValidGitHubApiRepository = fc.record({
      id: fc.nat(),
      name: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      description: fc.option(fc.string({ maxLength: 500 }), { nil: null }),
      stargazers_count: fc.nat({ max: 1000000 }),
      forks_count: fc.nat({ max: 100000 }),
      language: fc.option(
        fc.constantFrom('TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++'),
        { nil: null }
      ),
      html_url: fc.webUrl(),
      updated_at: fc.integer({ min: 946684800000, max: 1924905600000 }).map(ts => new Date(ts).toISOString()),
      private: fc.boolean(),
      topics: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 20 }),
        { nil: undefined }
      ),
    });

    it('should accept valid API responses matching GitHubApiRepository structure', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          (validResponse) => {
            // Valid responses should be accepted without throwing
            expect(() => validateApiResponse(validResponse)).not.toThrow();
            
            // Validation should return the same object
            const result = validateApiResponse(validResponse);
            expect(result).toEqual(validResponse);
            
            // Type guard should return true
            expect(isValidGitHubApiRepository(validResponse)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject responses with missing required fields', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          fc.constantFrom(
            'id', 'name', 'stargazers_count', 'forks_count', 
            'html_url', 'updated_at', 'private'
          ),
          (validResponse, fieldToRemove) => {
            // Create invalid response by removing a required field
            const invalidResponse = { ...validResponse };
            delete (invalidResponse as any)[fieldToRemove];
            
            // Invalid responses should be rejected
            expect(() => validateApiResponse(invalidResponse)).toThrow();
            expect(isValidGitHubApiRepository(invalidResponse)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject responses with wrong types for required fields', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          (validResponse) => {
            // Test various type violations
            const typeViolations = [
              { ...validResponse, id: 'not-a-number' },
              { ...validResponse, name: 123 },
              { ...validResponse, stargazers_count: '100' },
              { ...validResponse, forks_count: '50' },
              { ...validResponse, html_url: 12345 },
              { ...validResponse, updated_at: new Date() },
              { ...validResponse, private: 'true' },
            ];

            typeViolations.forEach(invalidResponse => {
              expect(() => validateApiResponse(invalidResponse)).toThrow();
              expect(isValidGitHubApiRepository(invalidResponse)).toBe(false);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject responses with invalid description type', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          (validResponse) => {
            // description must be string or null, not other types
            const invalidResponses = [
              { ...validResponse, description: 123 },
              { ...validResponse, description: true },
              { ...validResponse, description: [] },
              { ...validResponse, description: {} },
            ];

            invalidResponses.forEach(invalidResponse => {
              expect(() => validateApiResponse(invalidResponse)).toThrow();
              expect(isValidGitHubApiRepository(invalidResponse)).toBe(false);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject responses with invalid language type', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          (validResponse) => {
            // language must be string or null, not other types
            const invalidResponses = [
              { ...validResponse, language: 123 },
              { ...validResponse, language: true },
              { ...validResponse, language: [] },
              { ...validResponse, language: {} },
            ];

            invalidResponses.forEach(invalidResponse => {
              expect(() => validateApiResponse(invalidResponse)).toThrow();
              expect(isValidGitHubApiRepository(invalidResponse)).toBe(false);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept responses with null description', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          (validResponse) => {
            const responseWithNullDescription = { ...validResponse, description: null };
            
            expect(() => validateApiResponse(responseWithNullDescription)).not.toThrow();
            expect(isValidGitHubApiRepository(responseWithNullDescription)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept responses with null language', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          (validResponse) => {
            const responseWithNullLanguage = { ...validResponse, language: null };
            
            expect(() => validateApiResponse(responseWithNullLanguage)).not.toThrow();
            expect(isValidGitHubApiRepository(responseWithNullLanguage)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept responses with optional topics field', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          (validResponse) => {
            // With topics array
            const responseWithTopics = { 
              ...validResponse, 
              topics: ['javascript', 'typescript', 'react'] 
            };
            expect(() => validateApiResponse(responseWithTopics)).not.toThrow();
            expect(isValidGitHubApiRepository(responseWithTopics)).toBe(true);

            // Without topics field
            const responseWithoutTopics = { ...validResponse };
            delete (responseWithoutTopics as any).topics;
            expect(() => validateApiResponse(responseWithoutTopics)).not.toThrow();
            expect(isValidGitHubApiRepository(responseWithoutTopics)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject responses with invalid topics type', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          (validResponse) => {
            // topics must be array of strings if present
            const invalidResponses = [
              { ...validResponse, topics: 'not-an-array' },
              { ...validResponse, topics: 123 },
              { ...validResponse, topics: [1, 2, 3] },
              { ...validResponse, topics: ['valid', 123, 'mixed'] },
            ];

            invalidResponses.forEach(invalidResponse => {
              expect(() => validateApiResponse(invalidResponse)).toThrow();
              expect(isValidGitHubApiRepository(invalidResponse)).toBe(false);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject non-object responses', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.boolean(),
            fc.constant(null),
            fc.constant(undefined),
            fc.array(fc.anything())
          ),
          (invalidResponse) => {
            expect(() => validateApiResponse(invalidResponse)).toThrow();
            expect(isValidGitHubApiRepository(invalidResponse)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject responses with negative counts', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          fc.integer({ max: -1 }),
          (validResponse, negativeNumber) => {
            // Counts should be non-negative
            const invalidResponses = [
              { ...validResponse, id: negativeNumber },
              { ...validResponse, stargazers_count: negativeNumber },
              { ...validResponse, forks_count: negativeNumber },
            ];

            invalidResponses.forEach(invalidResponse => {
              expect(() => validateApiResponse(invalidResponse)).toThrow();
              expect(isValidGitHubApiRepository(invalidResponse)).toBe(false);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject responses with empty required string fields', () => {
      fc.assert(
        fc.property(
          arbValidGitHubApiRepository,
          (validResponse) => {
            // Required string fields should not be empty
            const invalidResponses = [
              { ...validResponse, name: '' },
              { ...validResponse, html_url: '' },
              { ...validResponse, updated_at: '' },
            ];

            invalidResponses.forEach(invalidResponse => {
              expect(() => validateApiResponse(invalidResponse)).toThrow();
              expect(isValidGitHubApiRepository(invalidResponse)).toBe(false);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate before processing to prevent runtime errors', () => {
      fc.assert(
        fc.property(
          fc.anything(),
          (randomResponse) => {
            // Validation should happen before any processing
            // If validation passes, we can safely access properties
            if (isValidGitHubApiRepository(randomResponse)) {
              // These operations should be safe after validation
              expect(typeof randomResponse.id).toBe('number');
              expect(typeof randomResponse.name).toBe('string');
              expect(typeof randomResponse.stargazers_count).toBe('number');
              expect(typeof randomResponse.forks_count).toBe('number');
              expect(typeof randomResponse.html_url).toBe('string');
              expect(typeof randomResponse.updated_at).toBe('string');
              expect(typeof randomResponse.private).toBe('boolean');
              
              // Nullable fields
              expect(
                randomResponse.description === null || 
                typeof randomResponse.description === 'string'
              ).toBe(true);
              expect(
                randomResponse.language === null || 
                typeof randomResponse.language === 'string'
              ).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

  /**
   * Property 11: Environment Variable Configuration Loading
   * Validates: Requirements 4.1, 4.4
   * 
   * For any valid GitHub username or token set in environment variables, the configuration
   * system should correctly read and make these values available through getGitHubConfig().
   */
  describe('Property 11: Environment Variable Configuration Loading', () => {
    // Feature: github-integration, Property 11: Environment Variable Configuration Loading
    
    // Store original environment variables
    const originalEnv = { ...process.env };

    afterEach(() => {
      // Restore original environment variables after each test
      process.env = { ...originalEnv };
    });

    // Arbitrary for valid GitHub usernames (alphanumeric, hyphens, max 39 chars)
    const arbGitHubUsername = fc.string({ minLength: 1, maxLength: 39 })
      .filter(s => /^[a-zA-Z0-9-]+$/.test(s) && !s.startsWith('-') && !s.endsWith('-'));

    // Arbitrary for valid GitHub tokens (ghp_ prefix followed by alphanumeric)
    const arbGitHubToken = fc.string({ minLength: 20, maxLength: 100 })
      .map(s => `ghp_${s.replace(/[^a-zA-Z0-9]/g, 'A')}`);

    it('should read GitHub username from GITHUB_USERNAME environment variable', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          (username) => {
            // Set environment variable
            process.env.GITHUB_USERNAME = username;

            // Get configuration
            const config = getGitHubConfig();

            // Verify username is correctly read
            expect(config.username).toBe(username);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should read GitHub token from GITHUB_TOKEN environment variable', () => {
      fc.assert(
        fc.property(
          arbGitHubToken,
          (token) => {
            // Set environment variable
            process.env.GITHUB_TOKEN = token;

            // Get configuration
            const config = getGitHubConfig();

            // Verify token is correctly read
            expect(config.token).toBe(token);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should read both username and token when both are set', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbGitHubToken,
          (username, token) => {
            // Set both environment variables
            process.env.GITHUB_USERNAME = username;
            process.env.GITHUB_TOKEN = token;

            // Get configuration
            const config = getGitHubConfig();

            // Verify both values are correctly read
            expect(config.username).toBe(username);
            expect(config.token).toBe(token);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty string for username when GITHUB_USERNAME is not set', () => {
      fc.assert(
        fc.property(
          fc.constant(undefined),
          () => {
            // Ensure GITHUB_USERNAME is not set
            delete process.env.GITHUB_USERNAME;

            // Get configuration
            const config = getGitHubConfig();

            // Verify username is empty string
            expect(config.username).toBe('');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return undefined for token when GITHUB_TOKEN is not set', () => {
      fc.assert(
        fc.property(
          fc.constant(undefined),
          () => {
            // Ensure GITHUB_TOKEN is not set
            delete process.env.GITHUB_TOKEN;

            // Get configuration
            const config = getGitHubConfig();

            // Verify token is undefined
            expect(config.token).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty string values for environment variables', () => {
      fc.assert(
        fc.property(
          fc.constant(''),
          () => {
            // Set empty string values
            process.env.GITHUB_USERNAME = '';
            process.env.GITHUB_TOKEN = '';

            // Get configuration
            const config = getGitHubConfig();

            // Verify empty string is preserved for username
            expect(config.username).toBe('');
            // Empty string for token should be preserved (not converted to undefined)
            expect(config.token).toBe('');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve whitespace in environment variable values', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (username, token) => {
            // Add whitespace to values
            const usernameWithSpace = ` ${username} `;
            const tokenWithSpace = ` ${token} `;

            // Set environment variables with whitespace
            process.env.GITHUB_USERNAME = usernameWithSpace;
            process.env.GITHUB_TOKEN = tokenWithSpace;

            // Get configuration
            const config = getGitHubConfig();

            // Verify whitespace is preserved (not trimmed)
            expect(config.username).toBe(usernameWithSpace);
            expect(config.token).toBe(tokenWithSpace);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle special characters in environment variable values', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (username, token) => {
            // Set environment variables with special characters
            process.env.GITHUB_USERNAME = username;
            process.env.GITHUB_TOKEN = token;

            // Get configuration
            const config = getGitHubConfig();

            // Verify values are read exactly as set
            expect(config.username).toBe(username);
            expect(config.token).toBe(token);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain configuration consistency across multiple reads', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbGitHubToken,
          (username, token) => {
            // Set environment variables
            process.env.GITHUB_USERNAME = username;
            process.env.GITHUB_TOKEN = token;

            // Get configuration multiple times
            const config1 = getGitHubConfig();
            const config2 = getGitHubConfig();
            const config3 = getGitHubConfig();

            // Verify all reads return the same values
            expect(config1.username).toBe(username);
            expect(config2.username).toBe(username);
            expect(config3.username).toBe(username);
            expect(config1.token).toBe(token);
            expect(config2.token).toBe(token);
            expect(config3.token).toBe(token);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reflect environment variable changes between reads', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbGitHubUsername,
          arbGitHubToken,
          arbGitHubToken,
          (username1, username2, token1, token2) => {
            // Ensure we have different values
            fc.pre(username1 !== username2 || token1 !== token2);

            // Set initial environment variables
            process.env.GITHUB_USERNAME = username1;
            process.env.GITHUB_TOKEN = token1;

            // Get initial configuration
            const config1 = getGitHubConfig();
            expect(config1.username).toBe(username1);
            expect(config1.token).toBe(token1);

            // Change environment variables
            process.env.GITHUB_USERNAME = username2;
            process.env.GITHUB_TOKEN = token2;

            // Get updated configuration
            const config2 = getGitHubConfig();
            expect(config2.username).toBe(username2);
            expect(config2.token).toBe(token2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

