import {
  createErrorHandler,
  RateLimitError,
  AuthenticationError,
  ErrorMessages,
} from '@/lib/api/errors';

describe('Error Handler - 403 Classification', () => {
  const messages: ErrorMessages = {
    RATE_LIMIT: 'Rate limit exceeded',
    NETWORK: 'Network error',
    AUTHENTICATION: 'Authentication failed',
    NOT_FOUND: 'Not found',
    VALIDATION: 'Validation error',
    GENERIC: 'Generic error',
  };

  const handleError = createErrorHandler({ messages });

  describe('403 with rate limit message', () => {
    it('should classify 403 with "rate limit" in message as RateLimitError', () => {
      const error = {
        status: 403,
        message: 'API rate limit exceeded for user',
      };

      const result = handleError(error);

      expect(result).toBeInstanceOf(RateLimitError);
      expect(result.statusCode).toBe(403);
      expect(result.message).toBe('Rate limit exceeded');
    });

    it('should classify 403 with "Rate Limit" (case insensitive) as RateLimitError', () => {
      const error = {
        status: 403,
        message: 'You have exceeded the Rate Limit',
      };

      const result = handleError(error);

      expect(result).toBeInstanceOf(RateLimitError);
      expect(result.statusCode).toBe(403);
    });

    it('should classify 403 with rate limit in body.message as RateLimitError', () => {
      const error = {
        status: 403,
        body: {
          message: 'API rate limit exceeded',
        },
      };

      const result = handleError(error);

      expect(result).toBeInstanceOf(RateLimitError);
      expect(result.statusCode).toBe(403);
    });
  });

  describe('403 without rate limit message', () => {
    it('should classify 403 with "Bad credentials" as AuthenticationError', () => {
      const error = {
        status: 403,
        message: 'Bad credentials',
      };

      const result = handleError(error);

      expect(result).toBeInstanceOf(AuthenticationError);
      expect(result.statusCode).toBe(403);
      expect(result.message).toBe('Authentication failed');
    });

    it('should classify 403 with "Forbidden" as AuthenticationError', () => {
      const error = {
        status: 403,
        message: 'Forbidden',
      };

      const result = handleError(error);

      expect(result).toBeInstanceOf(AuthenticationError);
      expect(result.statusCode).toBe(403);
    });

    it('should classify 403 without message as AuthenticationError', () => {
      const error = {
        status: 403,
      };

      const result = handleError(error);

      expect(result).toBeInstanceOf(AuthenticationError);
      expect(result.statusCode).toBe(403);
    });
  });

  describe('other status codes', () => {
    it('should classify 401 as AuthenticationError', () => {
      const error = {
        status: 401,
        message: 'Unauthorized',
      };

      const result = handleError(error);

      expect(result).toBeInstanceOf(AuthenticationError);
      expect(result.statusCode).toBe(401);
    });

    it('should classify 429 as RateLimitError', () => {
      const error = {
        status: 429,
        message: 'Too many requests',
      };

      const result = handleError(error);

      expect(result).toBeInstanceOf(RateLimitError);
      expect(result.statusCode).toBe(429);
    });
  });
});
