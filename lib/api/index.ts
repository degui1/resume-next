/**
 * Shared API Utilities
 * 
 * This module provides generic, reusable utilities for API integrations including:
 * - Error handling with configurable error messages
 * - Formatting utilities for numbers and dates
 * - Rate limit tracking with configurable headers
 * - Configuration management with environment variable mapping
 * 
 * These utilities are designed to work with any API service (GitHub, YouTube, etc.)
 * through configuration and type parameters.
 * 
 * @module api
 */

// ============================================================================
// Error Handling
// ============================================================================

export {
  ApiError,
  NetworkError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  createErrorHandler,
  isRateLimitError,
  isNotFoundError,
  isAuthenticationError
} from './errors';

// ============================================================================
// Formatting
// ============================================================================

export {
  formatLargeNumber,
  formatDate,
  formatNumber
} from './formatters';

// ============================================================================
// Rate Limiting
// ============================================================================

export {
  RateLimitHandler
} from './rate-limit';

// ============================================================================
// Configuration
// ============================================================================

export {
  createConfigReader,
  parseNumber,
  parseStringArray,
  parseBoolean
} from './config';

// ============================================================================
// Types
// ============================================================================

export type {
  ErrorMessages,
  ErrorHandlerConfig
} from './errors';

export type {
  RateLimitState,
  RateLimitInfo,
  RateLimitConfig,
  RateLimitData
} from './rate-limit';

export type {
  ConfigMapping,
  ConfigReader,
  ConfigReaderOptions
} from './config';
