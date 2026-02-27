// GitHub API Response Types

// Import shared rate limit types
import type { RateLimitState, RateLimitInfo } from '@/lib/api/rate-limit';

/**
 * GitHub API Repository Response
 * Represents the structure returned by GitHub REST API v3 for repository data
 */
export interface GitHubApiRepository {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  private: boolean;
  topics?: string[];
}

/**
 * GitHub API Rate Limit Information
 * Represents rate limit data from GitHub API headers or rate limit endpoint
 */
export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  used: number;
}

/**
 * GitHub API Rate Limit Response
 * Full response structure from the /rate_limit endpoint
 */
export interface GitHubApiRateLimitResponse {
  resources: {
    core: GitHubRateLimit;
    search: GitHubRateLimit;
    graphql: GitHubRateLimit;
  };
  rate: GitHubRateLimit;
}

/**
 * GitHub API Error Response
 * Standard error structure returned by GitHub API
 */
export interface GitHubApiError {
  message: string;
  documentation_url: string;
  status?: string;
}

// Configuration Types

/**
 * GitHub Client Configuration
 * Configuration options for the GitHub API client
 */
export interface GitHubClientConfig {
  token?: string;
  username: string | undefined;
  baseUrl?: string;
  revalidate?: number; // Next.js revalidation time in seconds
}

/**
 * GitHub Service Configuration
 * Configuration options for the high-level GitHub service
 */
export interface GitHubServiceConfig {
  username: string | undefined;
  token?: string;
  revalidate?: number; // Next.js revalidation time in seconds (default: 3600)
  repositoryFilter?: string[];
}

/**
 * GitHub Configuration
 * Complete configuration for GitHub integration
 */
export interface GitHubConfig {
  username: string | undefined;
  token: string | undefined;
  revalidate: number; // Next.js revalidation time in seconds
  repositoryFilter?: string[];
  fallbackToMock: boolean;
  [key: string]: unknown; // Index signature for compatibility with shared config utilities
}

// Service Response Types

// Re-export shared rate limit types for convenience
export type { RateLimitState, RateLimitInfo } from '@/lib/api/rate-limit';

/**
 * Fetch Repositories Result
 * Result structure returned by the GitHub service when fetching repositories
 */
export interface FetchRepositoriesResult {
  data: GitHubProject[];
  source: 'api' | 'cache' | 'fallback';
  rateLimit?: RateLimitInfo;
  error?: string;
}

/**
 * GitHub Fetch Options
 * Options for fetching repositories from GitHub API
 */
export interface GitHubFetchOptions {
  visibility?: 'public' | 'private' | 'all';
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  per_page?: number;
}

// Extended Application Types

/**
 * GitHub Project
 * Extended application type for GitHub repository data
 * Extends the base GitHubProject interface with additional fields
 */
export interface GitHubProject {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number; // Added for GitHub integration
  url: string;
  technologies: string[];
  language: string | null; // Added for GitHub integration
  updatedAt: string; // Added for GitHub integration - ISO 8601 format
}
