/**
 * GitHub Service Orchestration Layer
 * 
 * High-level service that coordinates GitHub API client and rate limit handler.
 * Implements fallback chain: API (with Next.js cache) → mock data
 * Handles partial failures and repository filtering.
 */

import { GitHubClient } from './client';
import { RateLimitHandler } from '@/lib/api/rate-limit';
import { transformRepositories } from './transformer';
import { handleGitHubError, isRateLimitError, isNotFoundError } from './error-handler';
import { githubProjects } from '@/lib/data/mockData';
import {
  GitHubServiceConfig,
  FetchRepositoriesResult,
  RateLimitInfo,
  GitHubProject,
} from './types';

/**
 * GitHub Service
 * 
 * Orchestrates GitHub API client and rate limit handler to provide
 * a high-level interface for fetching repository data with:
 * - Automatic fallback to mock data
 * - Rate limit checking before requests
 * - Repository filtering
 * - Partial failure handling
 * - Next.js automatic caching
 */
export class GitHubService {
  private client: GitHubClient;
  private rateLimitHandler: RateLimitHandler;
  private config: GitHubServiceConfig;

  /**
   * Create a new GitHub service
   * 
   * @param config - Service configuration
   * @param config.username - GitHub username for API requests
   * @param config.token - Optional GitHub personal access token
   * @param config.revalidate - Optional revalidation time in seconds (default: 3600)
   * @param config.repositoryFilter - Optional array of repository names to fetch
   */
  constructor(config: GitHubServiceConfig) {
    this.config = config;
    this.client = new GitHubClient({
      username: config.username,
      token: config.token,
      revalidate: config.revalidate ?? 3600,
    });
    this.rateLimitHandler = new RateLimitHandler();
  }

  /**
   * Get repositories with fallback chain
   * 
   * Implements the following fallback chain:
   * 1. Check rate limit before making request
   * 2. Fetch from GitHub API (with Next.js automatic caching)
   * 3. If rate limit exceeded or error, fall back to mock data
   * 
   * Handles partial failures when fetching multiple repositories:
   * - If some repositories fail but others succeed, returns successful ones
   * - If all repositories fail, falls back to mock data
   * 
   * Applies repository filter if configured:
   * - If filter is set, fetches only specified repositories
   * - If no filter, fetches all public repositories
   * 
   * @returns Promise resolving to fetch result with data, source, and rate limit info
   */
  async getRepositories(): Promise<FetchRepositoriesResult> {
    // If username not configured, fall back to mock data immediately
    if (!this.config.username) {
      return {
        data: githubProjects,
        source: 'fallback',
        error: 'GitHub username not configured',
      };
    }

    // Check rate limit before making request
    const rateLimitInfo = this.rateLimitHandler.checkLimit();
    
    // If rate limit exceeded, fall back to mock data
    if (!rateLimitInfo.canMakeRequest) {
      return {
        data: githubProjects,
        source: 'fallback',
        rateLimit: rateLimitInfo,
        error: 'Rate limit exceeded',
      };
    }

    try {
      let repositories: GitHubProject[];
      
      // If repository filter is configured, fetch specific repositories
      if (this.config.repositoryFilter && this.config.repositoryFilter.length > 0) {
        repositories = await this.fetchFilteredRepositories();
      } else {
        // Fetch all public repositories
        const apiRepos = await this.client.fetchRepositories();
        repositories = transformRepositories(apiRepos);
      }

      // Update rate limit from API response
      try {
        const rateLimit = await this.client.getRateLimit();
        this.rateLimitHandler.updateFromApi(rateLimit);
      } catch {
        // Ignore rate limit fetch errors, continue with repository data
      }

      // Return successful result
      // Note: Next.js automatically handles caching, so we can't distinguish
      // between 'api' and 'cache' sources. We'll always report 'api' for successful fetches.
      return {
        data: repositories,
        source: 'api',
        rateLimit: this.rateLimitHandler.checkLimit(),
      };
    } catch (error) {
      // Handle errors and fall back to mock data
      const githubError = handleGitHubError(error);
      
      // Update rate limit if available in error metadata
      if (githubError.metadata) {
        this.rateLimitHandler.updateFromApi({
          limit: githubError.metadata.remaining,
          remaining: githubError.metadata.remaining,
          reset: Math.floor(githubError.metadata.resetAt.getTime() / 1000),
          used: 0,
        });
      }

      // Fall back to mock data
      return {
        data: githubProjects,
        source: 'fallback',
        rateLimit: this.rateLimitHandler.checkLimit(),
        error: githubError.message,
      };
    }
  }

  /**
   * Fetch filtered repositories with partial failure handling
   * 
   * Fetches only repositories specified in the repository filter.
   * Handles partial failures gracefully:
   * - If some repositories fail (404, 403), continues with others
   * - If all repositories fail, throws error to trigger fallback
   * - Deduplicates repository names to avoid fetching the same repo multiple times
   * 
   * @returns Promise resolving to array of successfully fetched repositories
   * @throws {Error} If all repositories fail to fetch
   * @private
   */
  private async fetchFilteredRepositories(): Promise<GitHubProject[]> {
    // Deduplicate repository filter to avoid fetching the same repo multiple times
    const filter = Array.from(new Set(this.config.repositoryFilter!));
    const results: GitHubProject[] = [];
    const errors: Array<{ repo: string; error: unknown }> = [];

    // Fetch each repository individually
    for (const repoName of filter) {
      try {
        const apiRepo = await this.client.fetchRepository(repoName);
        const transformed = transformRepositories([apiRepo]);
        results.push(...transformed);
      } catch (error) {
        // Log error but continue with other repositories
        errors.push({ repo: repoName, error });
        
        // If it's a not found or authentication error, continue
        // These are expected for private/missing repositories
        if (isNotFoundError(error) || handleGitHubError(error).statusCode === 403) {
          console.warn(`Repository ${repoName} not found or not accessible`);
          continue;
        }
        
        // For other errors (network, rate limit), continue but track
        console.warn(`Failed to fetch repository ${repoName}:`, error);
      }
    }

    // If all repositories failed, throw error to trigger fallback
    if (results.length === 0 && errors.length > 0) {
      throw new Error('All repositories failed to load');
    }

    return results;
  }

  /**
   * Get current rate limit status
   * 
   * Returns the current rate limit state without making an API request.
   * Useful for checking rate limit status before making requests.
   * 
   * @returns Current rate limit information
   */
  getRateLimitStatus(): RateLimitInfo {
    return this.rateLimitHandler.checkLimit();
  }
}
