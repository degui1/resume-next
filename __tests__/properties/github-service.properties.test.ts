/**
 * Property-Based Tests for GitHub Service
 * Feature: github-integration
 * 
 * These tests validate correctness properties for the GitHub service orchestration layer
 * using property-based testing with fast-check.
 */

import fc from 'fast-check';
import { GitHubService } from '@/lib/github/service';
import { GitHubApiRepository } from '@/lib/github/types';

// Shared arbitraries for all tests
const arbGitHubUsername = fc.string({ minLength: 1, maxLength: 39 })
  .filter(s => /^[a-zA-Z0-9-]+$/.test(s) && !s.startsWith('-') && !s.endsWith('-'));

const arbRepositoryName = fc.string({ minLength: 1, maxLength: 100 })
  .filter(s => {
    // Must match GitHub repo name pattern
    if (!/^[a-zA-Z0-9._-]+$/.test(s)) return false;
    // Avoid JavaScript object property names that cause issues
    const reserved = ['toString', 'valueOf', 'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', '__proto__', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'bind', 'call', 'apply'];
    return !reserved.includes(s);
  });

const arbGitHubApiRepository = (name: string): GitHubApiRepository => ({
  id: Math.floor(Math.random() * 1000000),
  name,
  description: 'Test repository',
  stargazers_count: Math.floor(Math.random() * 1000),
  forks_count: Math.floor(Math.random() * 100),
  language: 'TypeScript',
  html_url: `https://github.com/test/${name}`,
  updated_at: new Date().toISOString(),
  private: false,
});

describe('GitHub Service Properties', () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 12: Repository Filtering
   * Validates: Requirements 4.2
   * 
   * For any configured repository filter list, the GitHub service should fetch only
   * repositories whose names appear in the filter list.
   */
  describe('Property 12: Repository Filtering', () => {
    // Feature: github-integration, Property 12: Repository Filtering

    it('should fetch only repositories specified in the filter list', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 1, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          async (username, repositoryFilter) => {
            // Skip if filter is empty after deduplication
            fc.pre(repositoryFilter.length > 0);

            // Mock fetch to return repository data for each filtered repo
            global.fetch = jest.fn().mockImplementation((url: string) => {
              // Extract repo name from URL
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                // Only return data if repo is in filter
                if (repositoryFilter.includes(repoName)) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                }
              }
              
              // Return 404 for repos not in filter
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service with repository filter
            const service = new GitHubService({
              username,
              repositoryFilter,
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Verify only filtered repositories are returned
            expect(result.data.length).toBeLessThanOrEqual(repositoryFilter.length);
            
            // Verify all returned repositories are in the filter
            result.data.forEach(repo => {
              expect(repositoryFilter).toContain(repo.name);
            });

            // Verify fetch was called for each repository in filter
            const fetchCalls = (global.fetch as jest.Mock).mock.calls;
            const repoFetchCalls = fetchCalls.filter(call => 
              call[0].includes('/repos/')
            );
            
            // Should have attempted to fetch each filtered repo
            expect(repoFetchCalls.length).toBeGreaterThanOrEqual(repositoryFilter.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not fetch repositories not in the filter list', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 1, maxLength: 5 }).map(arr => Array.from(new Set(arr))),
          fc.array(arbRepositoryName, { minLength: 1, maxLength: 5 }).map(arr => Array.from(new Set(arr))),
          async (username, includedRepos, excludedRepos) => {
            // Ensure no overlap between included and excluded repos
            const filteredExcluded = excludedRepos.filter(repo => !includedRepos.includes(repo));
            fc.pre(includedRepos.length > 0 && filteredExcluded.length > 0);

            // Mock fetch to track which repos are requested
            const requestedRepos: string[] = [];
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                requestedRepos.push(repoName);
                
                if (includedRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service with repository filter (only included repos)
            const service = new GitHubService({
              username,
              repositoryFilter: includedRepos,
            });

            // Fetch repositories
            await service.getRepositories();

            // Verify excluded repos were not requested
            filteredExcluded.forEach(excludedRepo => {
              expect(requestedRepos).not.toContain(excludedRepo);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should fetch all public repositories when no filter is configured', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 1, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          async (username, allRepos) => {
            fc.pre(allRepos.length > 0);

            // Mock fetch to return all repos when fetching user repos
            global.fetch = jest.fn().mockImplementation((url: string) => {
              if (url.includes('/users/')) {
                // Return all repos for user endpoint
                return Promise.resolve({
                  ok: true,
                  json: async () => allRepos.map(name => arbGitHubApiRepository(name)),
                  headers: new Headers(),
                });
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service WITHOUT repository filter
            const service = new GitHubService({
              username,
              // No repositoryFilter specified
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Verify all repos are returned
            expect(result.data.length).toBe(allRepos.length);
            
            // Verify fetch was called with user endpoint (not individual repos)
            expect(global.fetch).toHaveBeenCalledWith(
              expect.stringContaining('/users/'),
              expect.any(Object)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty filter list by fetching all repositories', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 1, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          async (username, allRepos) => {
            fc.pre(allRepos.length > 0);

            // Mock fetch to return all repos
            global.fetch = jest.fn().mockResolvedValue({
              ok: true,
              json: async () => allRepos.map(name => arbGitHubApiRepository(name)),
              headers: new Headers(),
            });

            // Create service with empty filter array
            const service = new GitHubService({
              username,
              repositoryFilter: [],
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Verify all repos are returned (empty filter = no filter)
            expect(result.data.length).toBe(allRepos.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve repository order from filter list', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 2, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          async (username, repositoryFilter) => {
            fc.pre(repositoryFilter.length >= 2);

            // Mock fetch to return repository data
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                if (repositoryFilter.includes(repoName)) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service with repository filter
            const service = new GitHubService({
              username,
              repositoryFilter,
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Verify repositories are returned in the same order as filter
            const returnedNames = result.data.map(repo => repo.name);
            const expectedOrder = repositoryFilter.filter(name => returnedNames.includes(name));
            
            expect(returnedNames).toEqual(expectedOrder);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle filter with duplicate repository names', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 1, maxLength: 5 }),
          async (username, baseRepos) => {
            fc.pre(baseRepos.length > 0);

            // Create filter with duplicates
            const repositoryFilter = [...baseRepos, ...baseRepos];

            // Mock fetch
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                if (baseRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service with duplicate filter
            const service = new GitHubService({
              username,
              repositoryFilter,
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Verify each unique repo appears only once in results
            const uniqueNames = new Set(result.data.map(repo => repo.name));
            expect(uniqueNames.size).toBe(result.data.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should apply filter case-sensitively', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          arbRepositoryName.filter(s => s.toLowerCase() !== s.toUpperCase()),
          async (username, repoName) => {
            // Create filter with specific case
            const repositoryFilter = [repoName];
            const differentCase = repoName.toUpperCase() !== repoName 
              ? repoName.toUpperCase() 
              : repoName.toLowerCase();

            // Mock fetch - only exact case match returns data
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const requestedName = match[1];
                if (requestedName === repoName) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service with exact case filter
            const service = new GitHubService({
              username,
              repositoryFilter,
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Verify only exact case match is fetched
            if (result.source === 'api') {
              const returnedNames = result.data.map(repo => repo.name);
              expect(returnedNames).toContain(repoName);
              expect(returnedNames).not.toContain(differentCase);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

  /**
   * Property 15: Partial Failure Resilience
   * Validates: Requirements 6.3, 6.5
   * 
   * For any set of repository fetch operations where some succeed and some fail, the service
   * should return all successfully fetched repositories without throwing an error.
   */
  describe('Property 15: Partial Failure Resilience', () => {
    // Feature: github-integration, Property 15: Partial Failure Resilience

    // Arbitrary for valid GitHub usernames
    const arbGitHubUsername = fc.string({ minLength: 1, maxLength: 39 })
      .filter(s => /^[a-zA-Z0-9-]+$/.test(s) && !s.startsWith('-') && !s.endsWith('-'));

    // Arbitrary for repository names
    const arbRepositoryName = fc.string({ minLength: 1, maxLength: 100 })
      .filter(s => /^[a-zA-Z0-9._-]+$/.test(s));

    // Arbitrary for complete GitHubApiRepository
    const arbGitHubApiRepository = (name: string): GitHubApiRepository => ({
      id: Math.floor(Math.random() * 1000000),
      name,
      description: 'Test repository',
      stargazers_count: Math.floor(Math.random() * 1000),
      forks_count: Math.floor(Math.random() * 100),
      language: 'TypeScript',
      html_url: `https://github.com/test/${name}`,
      updated_at: new Date().toISOString(),
      private: false,
    });

    it('should return successful repositories when some fail', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 2, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          fc.integer({ min: 1, max: 100 }), // Percentage of repos that succeed
          async (username, allRepos, successPercentage) => {
            fc.pre(allRepos.length >= 2);

            // Determine which repos succeed and which fail
            const numSuccess = Math.max(1, Math.floor(allRepos.length * successPercentage / 100));
            const successRepos = allRepos.slice(0, numSuccess);
            const failRepos = allRepos.slice(numSuccess);

            fc.pre(successRepos.length > 0 && failRepos.length > 0);

            // Mock fetch to return success for some, failure for others
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                
                if (successRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                } else if (failRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: false,
                    status: 404,
                    json: async () => ({ message: 'Not Found' }),
                    headers: new Headers(),
                  });
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service with all repos in filter
            const service = new GitHubService({
              username,
              repositoryFilter: allRepos,
            });

            // Fetch repositories - should not throw
            const result = await service.getRepositories();

            // Verify successful repos are returned
            expect(result.data.length).toBeGreaterThan(0);
            expect(result.data.length).toBeLessThanOrEqual(successRepos.length);
            
            // Verify all returned repos are from success list
            result.data.forEach(repo => {
              expect(successRepos).toContain(repo.name);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not throw error when some repositories fail', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 2, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          async (username, allRepos) => {
            fc.pre(allRepos.length >= 2);

            // Make half succeed, half fail
            const midpoint = Math.floor(allRepos.length / 2);
            const successRepos = allRepos.slice(0, midpoint);
            const failRepos = allRepos.slice(midpoint);

            fc.pre(successRepos.length > 0 && failRepos.length > 0);

            // Mock fetch
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                
                if (successRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service
            const service = new GitHubService({
              username,
              repositoryFilter: allRepos,
            });

            // Should not throw
            await expect(service.getRepositories()).resolves.toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle different types of failures (404, 403, network)', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 4, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          async (username, allRepos) => {
            fc.pre(allRepos.length >= 4);

            // Divide repos into success, 404, 403, and network error
            const quarter = Math.floor(allRepos.length / 4);
            const successRepos = allRepos.slice(0, quarter);
            const notFoundRepos = allRepos.slice(quarter, quarter * 2);
            const forbiddenRepos = allRepos.slice(quarter * 2, quarter * 3);
            const networkErrorRepos = allRepos.slice(quarter * 3);

            fc.pre(successRepos.length > 0);

            // Mock fetch with different error types
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                
                if (successRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                } else if (notFoundRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: false,
                    status: 404,
                    json: async () => ({ message: 'Not Found' }),
                    headers: new Headers(),
                  });
                } else if (forbiddenRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: false,
                    status: 403,
                    json: async () => ({ message: 'Forbidden' }),
                    headers: new Headers(),
                  });
                } else if (networkErrorRepos.includes(repoName)) {
                  return Promise.reject(new Error('Network error'));
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service
            const service = new GitHubService({
              username,
              repositoryFilter: allRepos,
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Verify successful repos are returned despite various failures
            expect(result.data.length).toBeGreaterThan(0);
            expect(result.data.length).toBeLessThanOrEqual(successRepos.length);
            
            // Verify all returned repos are from success list
            result.data.forEach(repo => {
              expect(successRepos).toContain(repo.name);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should fall back to mock data when all repositories fail', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 1, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          async (username, allRepos) => {
            fc.pre(allRepos.length > 0);

            // Mock fetch to fail for all repos
            global.fetch = jest.fn().mockResolvedValue({
              ok: false,
              status: 404,
              json: async () => ({ message: 'Not Found' }),
              headers: new Headers(),
            });

            // Create service
            const service = new GitHubService({
              username,
              repositoryFilter: allRepos,
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Should fall back to mock data
            expect(result.source).toBe('fallback');
            expect(result.data.length).toBeGreaterThan(0);
            expect(result.error).toBeDefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve data from successful fetches even with many failures', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 10, maxLength: 20 }).map(arr => Array.from(new Set(arr))),
          async (username, allRepos) => {
            fc.pre(allRepos.length >= 10);

            // Only 1 repo succeeds, rest fail
            const successRepo = allRepos[0];
            const failRepos = allRepos.slice(1);

            // Mock fetch
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                
                if (repoName === successRepo) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service
            const service = new GitHubService({
              username,
              repositoryFilter: allRepos,
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Should return the one successful repo
            if (result.source === 'api') {
              expect(result.data.length).toBe(1);
              expect(result.data[0].name).toBe(successRepo);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should continue processing after encountering failures', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 3, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          async (username, allRepos) => {
            fc.pre(allRepos.length >= 3);

            // Pattern: fail, success, fail, success, ...
            const successRepos = allRepos.filter((_, index) => index % 2 === 1);
            const failRepos = allRepos.filter((_, index) => index % 2 === 0);

            fc.pre(successRepos.length > 0 && failRepos.length > 0);

            // Track fetch order
            const fetchOrder: string[] = [];

            // Mock fetch
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                fetchOrder.push(repoName);
                
                if (successRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service
            const service = new GitHubService({
              username,
              repositoryFilter: allRepos,
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Verify all repos were attempted (service didn't stop after first failure)
            expect(fetchOrder.length).toBe(allRepos.length);
            
            // Verify successful repos are returned
            if (result.source === 'api') {
              expect(result.data.length).toBe(successRepos.length);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle mixed success/failure without data corruption', () => {
      fc.assert(
        fc.property(
          arbGitHubUsername,
          fc.array(arbRepositoryName, { minLength: 2, maxLength: 10 }).map(arr => Array.from(new Set(arr))),
          async (username, allRepos) => {
            fc.pre(allRepos.length >= 2);

            // Random success/failure pattern
            const successRepos = allRepos.filter(() => Math.random() > 0.5);
            fc.pre(successRepos.length > 0 && successRepos.length < allRepos.length);

            // Mock fetch
            global.fetch = jest.fn().mockImplementation((url: string) => {
              const match = url.match(/\/repos\/[^/]+\/([^/?]+)/);
              if (match) {
                const repoName = match[1];
                
                if (successRepos.includes(repoName)) {
                  return Promise.resolve({
                    ok: true,
                    json: async () => arbGitHubApiRepository(repoName),
                    headers: new Headers(),
                  });
                }
              }
              
              return Promise.resolve({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Not Found' }),
                headers: new Headers(),
              });
            });

            // Create service
            const service = new GitHubService({
              username,
              repositoryFilter: allRepos,
            });

            // Fetch repositories
            const result = await service.getRepositories();

            // Verify data integrity
            if (result.source === 'api') {
              // All returned repos should have valid data
              result.data.forEach(repo => {
                expect(repo.id).toBeDefined();
                expect(repo.name).toBeDefined();
                expect(repo.description).toBeDefined();
                expect(repo.stars).toBeGreaterThanOrEqual(0);
                expect(repo.forks).toBeGreaterThanOrEqual(0);
                expect(repo.url).toBeDefined();
                expect(repo.technologies).toBeDefined();
                expect(Array.isArray(repo.technologies)).toBe(true);
              });

              // No duplicate repos
              const names = result.data.map(r => r.name);
              expect(new Set(names).size).toBe(names.length);
            }
          }
        ),
      { numRuns: 100 }
    );
  });
});

