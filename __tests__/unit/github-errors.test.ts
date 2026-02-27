import {
  GitHubError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  handleGitHubError,
  isRateLimitError,
  isNotFoundError,
  isAuthenticationError,
  ERROR_MESSAGES,
} from '@/lib/github/errors';
import { RateLimitInfo } from '@/lib/github/types';

describe('GitHub Error Handler', () => {
  describe('handleGitHubError', () => {
    describe('404 errors classification', () => {
      it('should classify 404 errors as NotFoundError', () => {
        const error = {
          status: 404,
          message: 'Not Found',
        };

        const result = handleGitHubError(error);

        expect(result).toBeInstanceOf(NotFoundError);
        expect(result.statusCode).toBe(404);
        expect(result.code).toBe('NOT_FOUND_ERROR');
        expect(result.message).toBe(ERROR_MESSAGES.NOT_FOUND);
      });

      it('should use isNotFoundError type guard correctly', () => {
        const error = {
          status: 404,
          message: 'Repository not found',
        };

        const result = handleGitHubError(error);

        expect(isNotFoundError(result)).toBe(true);
        expect(isRateLimitError(result)).toBe(false);
        expect(isAuthenticationError(result)).toBe(false);
      });
    });

    describe('403 errors for private repos', () => {
      it('should classify 403 errors as AuthenticationError', () => {
        const error = {
          status: 403,
          message: 'Resource not accessible by integration',
        };

        const result = handleGitHubError(error);

        expect(result).toBeInstanceOf(AuthenticationError);
        expect(result.statusCode).toBe(403);
        expect(result.code).toBe('AUTHENTICATION_ERROR');
        expect(result.message).toBe(ERROR_MESSAGES.AUTHENTICATION);
      });

      it('should handle 403 errors for private repositories gracefully', () => {
        const error = {
          status: 403,
          message: 'Repository access blocked',
        };

        const result = handleGitHubError(error);

        expect(result).toBeInstanceOf(AuthenticationError);
        expect(result.message).toBe(ERROR_MESSAGES.AUTHENTICATION);
        // Verify the error uses generic message, not the API's specific message
        expect(result.message).not.toContain('blocked');
        expect(result.message).not.toContain('Repository access');
      });

      it('should distinguish 403 rate limit errors from auth errors', () => {
        const rateLimitError = {
          status: 403,
          message: 'API rate limit exceeded',
        };

        const result = handleGitHubError(rateLimitError);

        expect(result).toBeInstanceOf(RateLimitError);
        expect(result.statusCode).toBe(403);
        expect(result.message).toBe(ERROR_MESSAGES.RATE_LIMIT);
      });
    });

    describe('sensitive token information protection', () => {
      it('should not expose token in error messages', () => {
        const token = 'ghp_1234567890abcdefghijklmnopqrstuvwxyz';
        const error = {
          status: 401,
          message: `Bad credentials for token ${token}`,
        };

        const result = handleGitHubError(error);

        expect(result.message).toBe(ERROR_MESSAGES.AUTHENTICATION);
        expect(result.message).not.toContain(token);
        expect(result.message).not.toContain('ghp_');
        expect(result.message).not.toContain('credentials');
      });

      it('should not expose token in 403 error messages', () => {
        const token = 'ghp_secrettoken123456789';
        const error = {
          status: 403,
          message: `Token ${token} does not have required permissions`,
        };

        const result = handleGitHubError(error);

        expect(result.message).toBe(ERROR_MESSAGES.AUTHENTICATION);
        expect(result.message).not.toContain(token);
        expect(result.message).not.toContain('ghp_');
        expect(result.message).not.toContain('permissions');
      });

      it('should sanitize error messages from API responses', () => {
        const sensitiveError = {
          status: 401,
          message: 'Authentication failed with token ghp_abc123xyz',
        };

        const result = handleGitHubError(sensitiveError);

        // Should use generic message instead of exposing API message
        expect(result.message).toBe(ERROR_MESSAGES.AUTHENTICATION);
        expect(result.message).not.toContain('ghp_');
        expect(result.message).not.toContain('abc123');
      });
    });

    describe('other error types', () => {
      it('should classify 401 errors as AuthenticationError', () => {
        const error = {
          status: 401,
          message: 'Bad credentials',
        };

        const result = handleGitHubError(error);

        expect(result).toBeInstanceOf(AuthenticationError);
        expect(result.statusCode).toBe(401);
      });

      it('should classify 429 errors as RateLimitError', () => {
        const rateLimit: RateLimitInfo = {
          canMakeRequest: false,
          remaining: 0,
          resetAt: new Date(),
        };

        const error = {
          status: 429,
          message: 'Rate limit exceeded',
        };

        const result = handleGitHubError(error, rateLimit);

        expect(result).toBeInstanceOf(RateLimitError);
        expect(result.statusCode).toBe(429);
        expect(result.rateLimit).toBe(rateLimit);
      });

      it('should classify 500 errors as NetworkError', () => {
        const error = {
          status: 500,
          message: 'Internal Server Error',
        };

        const result = handleGitHubError(error);

        expect(result).toBeInstanceOf(NetworkError);
        expect(result.statusCode).toBe(500);
      });

      it('should handle fetch errors as NetworkError', () => {
        const error = new TypeError('fetch failed');

        const result = handleGitHubError(error);

        expect(result).toBeInstanceOf(NetworkError);
        expect(result.message).toBe(ERROR_MESSAGES.NETWORK);
      });

      it('should return existing GitHubError unchanged', () => {
        const originalError = new NotFoundError('Test error', 404);

        const result = handleGitHubError(originalError);

        expect(result).toBe(originalError);
      });

      it('should handle unknown errors gracefully', () => {
        const error = 'some string error';

        const result = handleGitHubError(error);

        expect(result).toBeInstanceOf(GitHubError);
        expect(result.message).toBe(ERROR_MESSAGES.GENERIC);
      });
    });
  });

  describe('Error type guards', () => {
    it('should correctly identify RateLimitError', () => {
      const error = new RateLimitError('Rate limit exceeded');

      expect(isRateLimitError(error)).toBe(true);
      expect(isNotFoundError(error)).toBe(false);
      expect(isAuthenticationError(error)).toBe(false);
    });

    it('should correctly identify NotFoundError', () => {
      const error = new NotFoundError('Not found', 404);

      expect(isNotFoundError(error)).toBe(true);
      expect(isRateLimitError(error)).toBe(false);
      expect(isAuthenticationError(error)).toBe(false);
    });

    it('should correctly identify AuthenticationError', () => {
      const error = new AuthenticationError('Auth failed', 401);

      expect(isAuthenticationError(error)).toBe(true);
      expect(isRateLimitError(error)).toBe(false);
      expect(isNotFoundError(error)).toBe(false);
    });

    it('should return false for non-error values', () => {
      expect(isRateLimitError(null)).toBe(false);
      expect(isNotFoundError(undefined)).toBe(false);
      expect(isAuthenticationError('string')).toBe(false);
    });
  });

  describe('Error classes', () => {
    it('should create NotFoundError with correct properties', () => {
      const error = new NotFoundError('Repository not found', 404);

      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe('Repository not found');
      expect(error.code).toBe('NOT_FOUND_ERROR');
      expect(error.statusCode).toBe(404);
    });

    it('should create AuthenticationError with correct properties', () => {
      const error = new AuthenticationError('Auth failed', 403);

      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('Auth failed');
      expect(error.code).toBe('AUTHENTICATION_ERROR');
      expect(error.statusCode).toBe(403);
    });

    it('should create RateLimitError with rate limit info', () => {
      const rateLimit: RateLimitInfo = {
        canMakeRequest: false,
        remaining: 0,
        resetAt: new Date('2024-01-01T00:00:00Z'),
      };

      const error = new RateLimitError('Rate limit exceeded', rateLimit, 429);

      expect(error.name).toBe('RateLimitError');
      expect(error.code).toBe('RATE_LIMIT_ERROR');
      expect(error.rateLimit).toBe(rateLimit);
      expect(error.statusCode).toBe(429);
    });
  });
});
