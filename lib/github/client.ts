/**
 * GitHub API Client
 * 
 * Handles authenticated HTTP requests to GitHub REST API v3 with Next.js caching.
 * Implements rate limit tracking, error handling, and automatic cache revalidation.
 */

import {
  GitHubClientConfig,
  GitHubApiRepository,
  GitHubRateLimit,
  GitHubFetchOptions,
} from './types';
import { handleGitHubError } from './error-handler';

/**
 * Default base URL for GitHub REST API v3
 */
const DEFAULT_BASE_URL = 'https://api.github.com';

/**
 * GitHub API Client
 * 
 * Provides methods to interact with GitHub REST API v3 with built-in:
 * - Authentication via Bearer token
 * - Next.js automatic caching with revalidation
 * - Rate limit tracking from response headers
 * - Error handling and conversion to GitHubError types
 */
export class GitHubClient {
  private config: Required<Omit<GitHubClientConfig, 'token'>> & { token?: string };

  /**
   * Create a new GitHub API client
   * 
   * @param config - Client configuration
   * @param config.username - GitHub username for API requests
   * @param config.token - Optional GitHub personal access token for authentication
   * @param config.baseUrl - Optional base URL (defaults to https://api.github.com)
   * @param config.revalidate - Optional revalidation time in seconds (defaults to 3600)
   */
  constructor(config: GitHubClientConfig) {
    this.config = {
      username: config.username,
      token: config.token,
      baseUrl: config.baseUrl || DEFAULT_BASE_URL,
      revalidate: config.revalidate ?? 3600,
    };
  }

  /**
   * Fetch all repositories for the configured user
   * 
   * Makes an authenticated request to GitHub API to fetch repositories.
   * Uses Next.js fetch caching with automatic revalidation.
   * 
   * @param options - Optional fetch options
   * @param options.visibility - Repository visibility filter ('public', 'private', 'all')
   * @param options.sort - Sort order ('created', 'updated', 'pushed', 'full_name')
   * @param options.per_page - Number of results per page (max 100)
   * @returns Promise resolving to array of repository data
   * @throws {GitHubError} If the request fails or returns an error
   */
  async fetchRepositories(
    options: GitHubFetchOptions = {}
  ): Promise<GitHubApiRepository[]> {
    const { visibility = 'public', sort = 'updated', per_page = 100 } = options;

    // Build query parameters
    const params = new URLSearchParams({
      visibility,
      sort,
      per_page: per_page.toString(),
    });

    const url = `${this.config.baseUrl}/users/${this.config.username}/repos?${params}`;

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        next: { revalidate: this.config.revalidate },
      });

      // Parse rate limit from headers before checking status
      const rateLimit = this.parseRateLimitFromHeaders(response.headers);

      if (!response.ok) {
        throw await this.handleErrorResponse(response, rateLimit);
      }

      const data = await response.json();
      return data as GitHubApiRepository[];
    } catch (error) {
      throw handleGitHubError(error);
    }
  }

  /**
   * Fetch a single repository by name
   * 
   * Makes an authenticated request to GitHub API to fetch a specific repository.
   * Uses Next.js fetch caching with automatic revalidation.
   * 
   * @param repoName - Name of the repository to fetch
   * @returns Promise resolving to repository data
   * @throws {GitHubError} If the request fails or repository is not found
   */
  async fetchRepository(repoName: string): Promise<GitHubApiRepository> {
    const url = `${this.config.baseUrl}/repos/${this.config.username}/${repoName}`;

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        next: { revalidate: this.config.revalidate },
      });

      // Parse rate limit from headers before checking status
      const rateLimit = this.parseRateLimitFromHeaders(response.headers);

      if (!response.ok) {
        throw await this.handleErrorResponse(response, rateLimit);
      }

      const data = await response.json();
      return data as GitHubApiRepository;
    } catch (error) {
      throw handleGitHubError(error);
    }
  }

  /**
   * Get current rate limit status
   * 
   * Fetches rate limit information from GitHub API.
   * This endpoint is not cached as it provides real-time rate limit data.
   * 
   * @returns Promise resolving to rate limit information
   * @throws {GitHubError} If the request fails
   */
  async getRateLimit(): Promise<GitHubRateLimit> {
    const url = `${this.config.baseUrl}/rate_limit`;

    try {
      const response = await fetch(url, {
        headers: this.getHeaders(),
        cache: 'no-store', // Don't cache rate limit requests
      });

      if (!response.ok) {
        const rateLimit = this.parseRateLimitFromHeaders(response.headers);
        throw await this.handleErrorResponse(response, rateLimit);
      }

      const data = await response.json();
      // Return the core rate limit (most relevant for REST API)
      return data.resources.core as GitHubRateLimit;
    } catch (error) {
      throw handleGitHubError(error);
    }
  }

  /**
   * Get request headers with authentication if token is configured
   * 
   * @returns Headers object with Accept and optional Authorization headers
   * @private
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    // Add authentication header if token is provided
    if (this.config.token) {
      headers.Authorization = `Bearer ${this.config.token}`;
    }

    return headers;
  }

  /**
   * Parse rate limit information from response headers
   * 
   * Extracts rate limit data from GitHub API response headers:
   * - X-RateLimit-Limit: Maximum number of requests per hour
   * - X-RateLimit-Remaining: Number of requests remaining
   * - X-RateLimit-Reset: Unix timestamp when rate limit resets
   * - X-RateLimit-Used: Number of requests used
   * 
   * @param headers - Response headers from GitHub API
   * @returns Rate limit information or undefined if headers are missing
   * @private
   */
  private parseRateLimitFromHeaders(
    headers: Headers
  ): GitHubRateLimit | undefined {
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');
    const used = headers.get('X-RateLimit-Used');

    // Return undefined if any required header is missing
    if (!limit || !remaining || !reset || !used) {
      return undefined;
    }

    return {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
      used: parseInt(used, 10),
    };
  }

  /**
   * Handle error response from GitHub API
   * 
   * Converts HTTP error responses into appropriate error objects
   * with status code and rate limit information.
   * 
   * @param response - Failed response from GitHub API
   * @param rateLimit - Optional rate limit information from headers
   * @returns Promise resolving to an error object
   * @private
   */
  private async handleErrorResponse(
    response: Response,
    rateLimit?: GitHubRateLimit
  ): Promise<{ status: number; message: string; rateLimit?: GitHubRateLimit }> {
    let message = `GitHub API error: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      // If JSON parsing fails, use default message
    }

    return {
      status: response.status,
      message,
      rateLimit,
    };
  }
}
