/**
 * Rate Limit Handler for GitHub API
 * 
 * Monitors and manages GitHub API rate limits to ensure graceful handling
 * when quota is exceeded.
 */

export interface RateLimitState {
  limit: number;
  remaining: number;
  reset: Date;
  used: number;
}

export interface RateLimitInfo {
  canMakeRequest: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number; // Seconds until reset
}

export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  used: number;
}

/**
 * Handles GitHub API rate limit tracking and validation
 */
export class RateLimitHandler {
  private state: RateLimitState | null = null;

  /**
   * Update rate limit state from HTTP response headers
   * 
   * @param headers - Response headers from GitHub API
   */
  updateFromHeaders(headers: Headers): void {
    const limit = headers.get('x-ratelimit-limit');
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');
    const used = headers.get('x-ratelimit-used');

    if (limit && remaining && reset) {
      this.state = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: new Date(parseInt(reset, 10) * 1000),
        used: used ? parseInt(used, 10) : 0,
      };
    }
  }

  /**
   * Update rate limit state from explicit API response
   * 
   * @param rateLimit - Rate limit data from GitHub API
   */
  updateFromApi(rateLimit: GitHubRateLimit): void {
    this.state = {
      limit: rateLimit.limit,
      remaining: rateLimit.remaining,
      reset: new Date(rateLimit.reset * 1000),
      used: rateLimit.used,
    };
  }

  /**
   * Check if API requests can be made based on current rate limit
   * 
   * @returns Information about whether requests can be made and rate limit status
   */
  checkLimit(): RateLimitInfo {
    if (!this.state) {
      // No rate limit information available yet, allow request
      return {
        canMakeRequest: true,
        remaining: -1,
        resetAt: new Date(Date.now() + 3600000), // Default to 1 hour from now
      };
    }

    const now = Date.now();
    const resetTime = this.state.reset.getTime();
    const canMakeRequest = this.state.remaining > 0 || now >= resetTime;
    
    let retryAfter: number | undefined;
    if (!canMakeRequest) {
      retryAfter = Math.ceil((resetTime - now) / 1000);
    }

    return {
      canMakeRequest,
      remaining: this.state.remaining,
      resetAt: this.state.reset,
      retryAfter,
    };
  }

  /**
   * Get current rate limit state
   * 
   * @returns Current rate limit state or null if not yet initialized
   */
  getState(): RateLimitState | null {
    return this.state;
  }
}
