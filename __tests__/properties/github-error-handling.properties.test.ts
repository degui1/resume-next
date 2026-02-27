/**
 * Property-Based Tests for GitHub Error Handling
 * Feature: github-integration
 * 
 * These tests validate error handling and logging properties
 * using property-based testing with fast-check.
 */

import fc from 'fast-check';
import {
  handleGitHubError,
  GitHubError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  ERROR_MESSAGES,
} from '@/lib/github/error-handler';
import { RateLimitInfo } from '@/lib/github/types';

describe('GitHub Error Handling Properties', () => {
  /**
   * Property 4: Error Handling and Logging
   * Validates: Requirements 1.4
   * 
   * **Validates: Requirements 1.4**
   * 
   * For any error response from the GitHub API, the error handler should log the error
   * and return a descriptive error message that includes the error type and context.
   */
  describe('Property 4: Error Handling and Logging', () => {
    // Feature: github-integration, Property 4: Error Handling and Logging

    // Arbitrary for HTTP status codes
    const arbStatusCode = fc.oneof(
      fc.constantFrom(401, 403, 404, 429, 500, 502, 503, 504),
      fc.integer({ min: 400, max: 599 })
    );

    // Arbitrary for error messages
    const arbErrorMessage = fc.string({ minLength: 1, maxLength: 200 });

    // Arbitrary for RateLimitInfo
    const arbRateLimitInfo = fc.record({
      limit: fc.integer({ min: 0, max: 5000 }),
      remaining: fc.integer({ min: 0, max: 5000 }),
      reset: fc.integer({ min: Math.floor(Date.now() / 1000), max: Math.floor(Date.now() / 1000) + 3600 }),
    });

    // Arbitrary for error types
    const arbErrorType = fc.constantFrom(
      'network',
      'authentication',
      'rate_limit',
      'not_found',
      'validation',
      'generic'
    );

    it('should always return a GitHubError instance for any error input', () => {
      fc.assert(
        fc.property(
          fc.anything(),
          (error) => {
            const result = handleGitHubError(error);
            
            // Result should always be a GitHubError instance
            expect(result).toBeInstanceOf(GitHubError);
            
            // Result should have required properties
            expect(result).toHaveProperty('message');
            expect(result).toHaveProperty('code');
            expect(typeof result.message).toBe('string');
            expect(typeof result.code).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return descriptive error messages that include error type', () => {
      fc.assert(
        fc.property(
          arbStatusCode,
          arbErrorMessage,
          (statusCode, message) => {
            const error = { status: statusCode, message };
            const result = handleGitHubError(error);
            
            // Error message should be descriptive and non-empty
            expect(result.message).toBeTruthy();
            expect(result.message.length).toBeGreaterThan(0);
            
            // Error should have a code that indicates the error type
            expect(result.code).toBeTruthy();
            expect(result.code.length).toBeGreaterThan(0);
            expect(result.code).toMatch(/_ERROR$/);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should classify 401/403 status codes as AuthenticationError', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(401, 403),
          arbErrorMessage,
          (statusCode, message) => {
            // Create error without rate limit indication
            const error = { status: statusCode, message: message.replace(/rate limit/gi, '') };
            const result = handleGitHubError(error);
            
            // Should be classified as AuthenticationError
            expect(result).toBeInstanceOf(AuthenticationError);
            expect(result.code).toBe('AUTHENTICATION_ERROR');
            expect(result.statusCode).toBe(statusCode);
            expect(result.message).toBe(ERROR_MESSAGES.AUTHENTICATION);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should classify 404 status code as NotFoundError', () => {
      fc.assert(
        fc.property(
          arbErrorMessage,
          (message) => {
            const error = { status: 404, message };
            const result = handleGitHubError(error);
            
            // Should be classified as NotFoundError
            expect(result).toBeInstanceOf(NotFoundError);
            expect(result.code).toBe('NOT_FOUND_ERROR');
            expect(result.statusCode).toBe(404);
            expect(result.message).toBe(ERROR_MESSAGES.NOT_FOUND);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should classify 429 status code as RateLimitError', () => {
      fc.assert(
        fc.property(
          arbErrorMessage,
          fc.option(arbRateLimitInfo, { nil: undefined }),
          (message, rateLimit) => {
            const error = { status: 429, message };
            const result = handleGitHubError(error, rateLimit);
            
            // Should be classified as RateLimitError
            expect(result).toBeInstanceOf(RateLimitError);
            expect(result.code).toBe('RATE_LIMIT_ERROR');
            expect(result.statusCode).toBe(429);
            expect(result.message).toBe(ERROR_MESSAGES.RATE_LIMIT);
            
            // Should include rate limit info if provided
            if (rateLimit) {
              expect(result.rateLimit).toEqual(rateLimit);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should classify 403 with "rate limit" message as RateLimitError', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'rate limit exceeded',
            'Rate Limit Exceeded',
            'API rate limit reached',
            'You have exceeded the rate limit'
          ),
          fc.option(arbRateLimitInfo, { nil: undefined }),
          (message, rateLimit) => {
            const error = { status: 403, message };
            const result = handleGitHubError(error, rateLimit);
            
            // Should be classified as RateLimitError, not AuthenticationError
            expect(result).toBeInstanceOf(RateLimitError);
            expect(result.code).toBe('RATE_LIMIT_ERROR');
            expect(result.statusCode).toBe(403);
            expect(result.message).toBe(ERROR_MESSAGES.RATE_LIMIT);
            
            // Should include rate limit info if provided
            if (rateLimit) {
              expect(result.rateLimit).toEqual(rateLimit);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should classify 5xx status codes as NetworkError', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(500, 502, 503, 504),
          arbErrorMessage,
          (statusCode, message) => {
            const error = { status: statusCode, message };
            const result = handleGitHubError(error);
            
            // Should be classified as NetworkError
            expect(result).toBeInstanceOf(NetworkError);
            expect(result.code).toBe('NETWORK_ERROR');
            expect(result.statusCode).toBe(statusCode);
            expect(result.message).toBe(ERROR_MESSAGES.NETWORK);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle TypeError with "fetch" in message as NetworkError', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(
            'fetch failed',
            'Failed to fetch',
            'fetch error occurred',
            'Network fetch timeout'
          ),
          (message) => {
            const error = new TypeError(message);
            const result = handleGitHubError(error);
            
            // Should be classified as NetworkError
            expect(result).toBeInstanceOf(NetworkError);
            expect(result.code).toBe('NETWORK_ERROR');
            expect(result.message).toBe(ERROR_MESSAGES.NETWORK);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve existing GitHubError instances', () => {
      fc.assert(
        fc.property(
          arbErrorMessage,
          arbStatusCode,
          fc.option(arbRateLimitInfo, { nil: undefined }),
          (message, statusCode, rateLimit) => {
            // Create various GitHubError instances
            const errors = [
              new GitHubError(message, 'TEST_ERROR', statusCode, rateLimit),
              new NetworkError(message, statusCode),
              new AuthenticationError(message, statusCode),
              new RateLimitError(message, rateLimit, statusCode),
              new NotFoundError(message, statusCode),
              new ValidationError(message, statusCode),
            ];

            errors.forEach(error => {
              const result = handleGitHubError(error);
              
              // Should return the same instance
              expect(result).toBe(error);
              expect(result.message).toBe(error.message);
              expect(result.code).toBe(error.code);
              expect(result.statusCode).toBe(error.statusCode);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle standard Error objects with generic error', () => {
      fc.assert(
        fc.property(
          arbErrorMessage,
          fc.option(arbRateLimitInfo, { nil: undefined }),
          (message, rateLimit) => {
            const error = new Error(message);
            const result = handleGitHubError(error, rateLimit);
            
            // Should be wrapped as generic GitHubError
            expect(result).toBeInstanceOf(GitHubError);
            expect(result.code).toBe('UNKNOWN_ERROR');
            expect(result.message).toBe(message);
            
            // Should include rate limit info if provided
            if (rateLimit) {
              expect(result.rateLimit).toEqual(rateLimit);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle unknown error types with generic error message', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string(),
            fc.integer(),
            fc.boolean(),
            fc.constant(null),
            fc.object()
          ),
          (error) => {
            const result = handleGitHubError(error);
            
            // Should return a generic GitHubError
            expect(result).toBeInstanceOf(GitHubError);
            expect(result.code).toBe('UNKNOWN_ERROR');
            expect(result.message).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include context information in error properties', () => {
      fc.assert(
        fc.property(
          arbStatusCode,
          arbErrorMessage,
          fc.option(arbRateLimitInfo, { nil: undefined }),
          (statusCode, message, rateLimit) => {
            const error = { status: statusCode, message };
            const result = handleGitHubError(error, rateLimit);
            
            // Error should include context via properties
            expect(result.statusCode).toBe(statusCode);
            
            // Rate limit info should be included only for RateLimitError or generic GitHubError
            if (rateLimit && (result instanceof RateLimitError || result.code === 'UNKNOWN_ERROR')) {
              expect(result.rateLimit).toEqual(rateLimit);
            }
            
            // Error code provides type context
            expect(result.code).toBeTruthy();
            expect(typeof result.code).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use predefined error messages for known error types', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(401, 403, 404, 429, 500, 502, 503, 504),
          arbErrorMessage,
          (statusCode, message) => {
            // Only test known status codes that map to predefined messages
            const error = { status: statusCode, message: message.replace(/rate limit/gi, '') };
            const result = handleGitHubError(error);
            
            // Error message should be one of the predefined messages for known status codes
            const predefinedMessages = Object.values(ERROR_MESSAGES);
            expect(predefinedMessages).toContain(result.message);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain error type hierarchy', () => {
      fc.assert(
        fc.property(
          arbStatusCode,
          arbErrorMessage,
          (statusCode, message) => {
            const error = { status: statusCode, message };
            const result = handleGitHubError(error);
            
            // All error types should extend GitHubError
            expect(result).toBeInstanceOf(GitHubError);
            
            // Specific error types should also be instances of their class
            if (result instanceof NetworkError) {
              expect(result.code).toBe('NETWORK_ERROR');
            } else if (result instanceof AuthenticationError) {
              expect(result.code).toBe('AUTHENTICATION_ERROR');
            } else if (result instanceof RateLimitError) {
              expect(result.code).toBe('RATE_LIMIT_ERROR');
            } else if (result instanceof NotFoundError) {
              expect(result.code).toBe('NOT_FOUND_ERROR');
            } else if (result instanceof ValidationError) {
              expect(result.code).toBe('VALIDATION_ERROR');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle errors with missing message property', () => {
      fc.assert(
        fc.property(
          arbStatusCode,
          (statusCode) => {
            const error = { status: statusCode };
            const result = handleGitHubError(error);
            
            // Should still return a valid GitHubError with predefined message
            expect(result).toBeInstanceOf(GitHubError);
            expect(result.message).toBeTruthy();
            expect(result.statusCode).toBe(statusCode);
            
            // Message should be one of the predefined messages
            const predefinedMessages = Object.values(ERROR_MESSAGES);
            expect(predefinedMessages).toContain(result.message);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle rate limit info attachment for any error type', () => {
      fc.assert(
        fc.property(
          fc.anything(),
          arbRateLimitInfo,
          (error, rateLimit) => {
            const result = handleGitHubError(error, rateLimit);
            
            // Rate limit info should be attached if provided
            // (though it's most relevant for RateLimitError)
            if (result instanceof RateLimitError) {
              expect(result.rateLimit).toEqual(rateLimit);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should provide error classification that enables appropriate handling', () => {
      fc.assert(
        fc.property(
          arbStatusCode,
          arbErrorMessage,
          (statusCode, message) => {
            const error = { status: statusCode, message };
            const result = handleGitHubError(error);
            
            // Error classification should be deterministic based on status code
            if (statusCode === 404) {
              expect(result).toBeInstanceOf(NotFoundError);
            } else if (statusCode === 429) {
              expect(result).toBeInstanceOf(RateLimitError);
            } else if ([500, 502, 503, 504].includes(statusCode)) {
              expect(result).toBeInstanceOf(NetworkError);
            } else if ([401, 403].includes(statusCode) && !message.toLowerCase().includes('rate limit')) {
              expect(result).toBeInstanceOf(AuthenticationError);
            }
            
            // All errors should have consistent structure for handling
            expect(result.code).toBeTruthy();
            expect(result.message).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
