/**
 * Shared rate limit handling utilities for API integrations
 * 
 * This module provides generic rate limit tracking that works with any API service.
 * It supports both header-based and explicit API response updates with configurable
 * header names to accommodate different API conventions.
 * 
 * @example GitHub usage
 * ```typescript
 * const rateLimitHandler = new RateLimitHandler({
 *   headerNames: {
 *     limit: 'x-ratelimit-limit',
 *     remaining: 'x-ratelimit-remaining',
 *     reset: 'x-ratelimit-reset',
 *     used: 'x-ratelimit-used'
 *   }
 * });
 * 
 * // After API request
 * rateLimitHandler.updateFromHeaders(response.headers);
 * const info = rateLimitHandler.checkLimit();
 * if (!info.canMakeRequest) {
 *   console.log(`Rate limit exceeded. Retry after ${info.retryAfter} seconds`);
 * }
 * ```
 * 
 * @example YouTube usage
 * ```typescript
 * const rateLimitHandler = new RateLimitHandler({
 *   headerNames: {
 *     limit: 'x-quota-limit',
 *     remaining: 'x-quota-remaining',
 *     reset: 'x-quota-reset',
 *     used: 'x-quota-used'
 *   }
 * });
 * ```
 */

/**
 * Internal rate limit state
 */
export interface RateLimitState {
  /** Total quota limit */
  limit: number;
  /** Remaining quota */
  remaining: number;
  /** When the quota resets */
  reset: Date;
  /** Used quota */
  used: number;
}

/**
 * Public rate limit information
 */
export interface RateLimitInfo {
  /** Whether requests can be made */
  canMakeRequest: boolean;
  /** Remaining quota */
  remaining: number;
  /** When quota resets */
  resetAt: Date;
  /** Seconds until reset (only present if blocked) */
  retryAfter?: number;
}

/**
 * Configuration for rate limit handler with customizable header names
 */
export interface RateLimitConfig {
  /** Header name mappings for different API services */
  headerNames: {
    /** Header name for total limit */
    limit: string;
    /** Header name for remaining quota */
    remaining: string;
    /** Header name for reset time */
    reset: string;
    /** Header name for used quota */
    used: string;
  };
}

/**
 * Explicit rate limit data from API responses
 */
export interface RateLimitData {
  /** Total quota limit */
  limit: number;
  /** Remaining quota */
  remaining: number;
  /** Reset time as Unix timestamp */
  reset: number;
  /** Used quota */
  used: number;
}

/**
 * Default configuration using GitHub-style header names
 */
const DEFAULT_CONFIG: RateLimitConfig = {
  headerNames: {
    limit: 'x-ratelimit-limit',
    remaining: 'x-ratelimit-remaining',
    reset: 'x-ratelimit-reset',
    used: 'x-ratelimit-used'
  }
};

/**
 * Generic rate limit handler that tracks API quota usage
 * 
 * Supports both header-based and explicit API response updates with
 * configurable header names to work with different API services.
 * 
 * @example
 * ```typescript
 * const handler = new RateLimitHandler();
 * handler.updateFromHeaders(response.headers);
 * 
 * const info = handler.checkLimit();
 * if (info.canMakeRequest) {
 *   // Make API request
 * } else {
 *   console.log(`Wait ${info.retryAfter} seconds`);
 * }
 * ```
 */
export class RateLimitHandler {
  private state: RateLimitState | null = null;
  private config: RateLimitConfig;

  /**
   * Create a new rate limit handler
   * 
   * @param config - Optional configuration with custom header names
   */
  constructor(config?: RateLimitConfig) {
    this.config = config || DEFAULT_CONFIG;
  }

  /**
   * Update rate limit state from HTTP response headers
   * 
   * Extracts rate limit information using the configured header names.
   * If headers are missing or invalid, the update is skipped.
   * 
   * @param headers - HTTP response headers
   * 
   * @example
   * ```typescript
   * const response = await fetch(url);
   * handler.updateFromHeaders(response.headers);
   * ```
   */
  updateFromHeaders(headers: Headers): void {
    const { headerNames } = this.config;

    const limitStr = headers.get(headerNames.limit);
    const remainingStr = headers.get(headerNames.remaining);
    const resetStr = headers.get(headerNames.reset);
    const usedStr = headers.get(headerNames.used);

    // Skip update if essential headers are missing
    if (!limitStr || !remainingStr || !resetStr) {
      return;
    }

    const limit = parseInt(limitStr, 10);
    const remaining = parseInt(remainingStr, 10);
    const resetTimestamp = parseInt(resetStr, 10);
    const used = usedStr ? parseInt(usedStr, 10) : limit - remaining;

    // Skip update if values are invalid
    if (isNaN(limit) || isNaN(remaining) || isNaN(resetTimestamp)) {
      return;
    }

    this.state = {
      limit,
      remaining,
      reset: new Date(resetTimestamp * 1000),
      used
    };
  }

  /**
   * Update rate limit state from explicit API response data
   * 
   * Use this when the API provides rate limit information in the response
   * body rather than headers.
   * 
   * @param data - Rate limit data from API response
   * 
   * @example
   * ```typescript
   * const response = await fetch(url);
   * const json = await response.json();
   * handler.updateFromApi(json.rateLimit);
   * ```
   */
  updateFromApi(data: RateLimitData): void {
    this.state = {
      limit: data.limit,
      remaining: data.remaining,
      reset: new Date(data.reset * 1000),
      used: data.used
    };
  }

  /**
   * Check if requests can be made based on current rate limit state
   * 
   * Returns information about whether requests are allowed and when
   * the quota will reset. If no state is available, assumes requests
   * are allowed (permissive default).
   * 
   * @returns Rate limit information including permission status
   * 
   * @example
   * ```typescript
   * const info = handler.checkLimit();
   * if (!info.canMakeRequest) {
   *   console.log(`Rate limited. Retry in ${info.retryAfter} seconds`);
   * }
   * ```
   */
  checkLimit(): RateLimitInfo {
    // If no state, allow requests (permissive default)
    if (!this.state) {
      return {
        canMakeRequest: true,
        remaining: Infinity,
        resetAt: new Date(Date.now() + 3600000) // 1 hour from now
      };
    }

    const now = new Date();
    const resetTime = this.state.reset;

    // If reset time has passed, allow requests
    if (now >= resetTime) {
      return {
        canMakeRequest: true,
        remaining: this.state.limit,
        resetAt: resetTime
      };
    }

    // If quota remaining, allow requests
    if (this.state.remaining > 0) {
      return {
        canMakeRequest: true,
        remaining: this.state.remaining,
        resetAt: resetTime
      };
    }

    // Quota exhausted and reset time not reached
    const retryAfter = Math.ceil((resetTime.getTime() - now.getTime()) / 1000);
    return {
      canMakeRequest: false,
      remaining: 0,
      resetAt: resetTime,
      retryAfter
    };
  }

  /**
   * Get current rate limit state
   * 
   * Returns the internal state or null if no rate limit data has been
   * received yet.
   * 
   * @returns Current rate limit state or null
   * 
   * @example
   * ```typescript
   * const state = handler.getState();
   * if (state) {
   *   console.log(`${state.remaining}/${state.limit} requests remaining`);
   * }
   * ```
   */
  getState(): RateLimitState | null {
    return this.state;
  }
}
