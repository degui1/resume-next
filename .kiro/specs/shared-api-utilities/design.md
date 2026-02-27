# Design Document: Shared API Utilities

## Overview

This design document specifies the technical approach for refactoring common utilities from the GitHub integration into a shared location at `lib/api/`. The refactoring will extract error handling, formatting, rate limiting, and configuration management utilities into generic, reusable modules that can be used by multiple API integrations (GitHub, YouTube, and future integrations).

The primary goals are:
- Eliminate code duplication across API integrations
- Provide type-safe, generic utilities that work with any API service
- Maintain backward compatibility with the existing GitHub integration
- Enable the YouTube integration to reuse common patterns
- Establish a clear separation between shared utilities and integration-specific code

The refactoring will move four files from `lib/github/` to `lib/api/`:
- `errors.ts` → Generic error handling with configurable error messages
- `formatters.ts` → Locale-aware formatting utilities (no changes needed)
- `rate-limit.ts` → Generic rate limit tracking with configurable header names
- `config.ts` → Generic configuration management with customizable environment variable mappings

The GitHub integration will be updated to import from the new shared location, and all existing functionality will be preserved. The YouTube integration will then be able to import and use these same utilities with YouTube-specific configuration.

## Architecture

### Directory Structure

```
lib/
├── api/                          # Shared API utilities
│   ├── errors.ts                 # Generic error handling
│   ├── formatters.ts             # Formatting utilities
│   ├── rate-limit.ts             # Rate limit tracking
│   ├── config.ts                 # Configuration management
│   ├── types.ts                  # Shared type definitions
│   └── index.ts                  # Public exports
├── github/                       # GitHub-specific code
│   ├── client.ts                 # GitHub API client
│   ├── service.ts                # GitHub service layer
│   ├── transformer.ts            # GitHub data transformation
│   ├── types.ts                  # GitHub-specific types
│   └── index.ts                  # GitHub public exports
└── youtube/                      # YouTube-specific code (future)
    ├── client.ts                 # YouTube API client
    ├── service.ts                # YouTube service layer
    ├── transformer.ts            # YouTube data transformation
    ├── types.ts                  # YouTube-specific types
    └── index.ts                  # YouTube public exports
```

### Layered Architecture

The system follows a layered architecture with clear separation of concerns:

**Layer 1: Shared Utilities (`lib/api/`)**
- Generic, reusable utilities
- No dependencies on specific API services
- Configurable through parameters and type parameters
- Used by all API integrations

**Layer 2: Integration-Specific Code (`lib/github/`, `lib/youtube/`)**
- API client implementations
- Service layer orchestration
- Data transformation logic
- Integration-specific types
- Imports and configures shared utilities

**Layer 3: Application Layer**
- Components and pages
- Imports from integration-specific modules
- No direct access to shared utilities

### Dependency Flow

```
Application Layer
       ↓
Integration Layer (GitHub, YouTube)
       ↓
Shared Utilities Layer (lib/api/)
```

This unidirectional dependency flow ensures:
- Shared utilities remain generic and reusable
- Integration-specific code can customize shared utilities
- Application code has a stable API through integration modules

## Components and Interfaces

### Error Handling Module (`lib/api/errors.ts`)

The error handling module provides a base error class and specialized error types for common API error scenarios. It uses TypeScript generics to support custom metadata types.

**Key Design Decisions:**
- Generic `ApiError<T>` base class accepts optional metadata type parameter
- Error messages are provided as configuration, not hardcoded
- Error classification logic is based on HTTP status codes (universal across APIs)
- Type guard functions enable type-safe error handling

**Core Types:**

```typescript
// Generic API error with optional metadata
export class ApiError<T = unknown> extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public metadata?: T
  ) { }
}

// Specialized error types
export class NetworkError extends ApiError { }
export class AuthenticationError extends ApiError { }
export class RateLimitError<T = unknown> extends ApiError<T> { }
export class NotFoundError extends ApiError { }
export class ValidationError extends ApiError { }

// Error message configuration
export interface ErrorMessages {
  RATE_LIMIT: string;
  NETWORK: string;
  AUTHENTICATION: string;
  NOT_FOUND: string;
  VALIDATION: string;
  GENERIC: string;
}

// Error handler configuration
export interface ErrorHandlerConfig<T = unknown> {
  messages: ErrorMessages;
  extractMetadata?: (error: unknown) => T | undefined;
}
```

**Public API:**

```typescript
// Create a configured error handler
export function createErrorHandler<T = unknown>(
  config: ErrorHandlerConfig<T>
): (error: unknown, metadata?: T) => ApiError<T>

// Type guards
export function isRateLimitError(error: unknown): error is RateLimitError
export function isNotFoundError(error: unknown): error is NotFoundError
export function isAuthenticationError(error: unknown): error is AuthenticationError
```

**Usage Example (GitHub):**

```typescript
import { createErrorHandler, ErrorMessages } from '@/lib/api/errors';
import { RateLimitInfo } from './types';

const GITHUB_ERROR_MESSAGES: ErrorMessages = {
  RATE_LIMIT: 'GitHub API rate limit reached. Showing cached data.',
  NETWORK: 'Unable to fetch GitHub data. Showing cached data.',
  AUTHENTICATION: 'GitHub authentication failed. Check your token.',
  NOT_FOUND: 'Repository not found.',
  VALIDATION: 'Invalid data received from GitHub.',
  GENERIC: 'An error occurred while fetching GitHub data.',
};

export const handleGitHubError = createErrorHandler<RateLimitInfo>({
  messages: GITHUB_ERROR_MESSAGES,
  extractMetadata: (error) => {
    // Extract rate limit info from error if available
    if (error && typeof error === 'object' && 'rateLimit' in error) {
      return error.rateLimit as RateLimitInfo;
    }
    return undefined;
  }
});
```

### Formatting Module (`lib/api/formatters.ts`)

The formatting module provides locale-aware formatting utilities. These functions are already generic and require no changes during the refactoring.

**Core Functions:**

```typescript
// Format large numbers with k/M suffixes
export function formatLargeNumber(value: number): string

// Format dates according to locale
export function formatDate(date: Date | string, locale: Locale): string

// Format numbers according to locale
export function formatNumber(value: number, locale: Locale): string
```

These functions will be moved as-is from `lib/github/formatters.ts` to `lib/api/formatters.ts`.

### Rate Limit Module (`lib/api/rate-limit.ts`)

The rate limit module tracks API quota usage and provides information about whether requests can be made. It uses configurable header names to support different API services.

**Key Design Decisions:**
- Generic `RateLimitHandler` class works with any API
- Header names are configurable (different APIs use different header names)
- Supports both header-based and explicit API response updates
- Provides both boolean check and detailed state information

**Core Types:**

```typescript
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
  retryAfter?: number;
}

export interface RateLimitConfig {
  headerNames: {
    limit: string;
    remaining: string;
    reset: string;
    used: string;
  };
}

export interface RateLimitData {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  used: number;
}
```

**Public API:**

```typescript
export class RateLimitHandler {
  constructor(config?: RateLimitConfig);
  
  updateFromHeaders(headers: Headers): void;
  updateFromApi(data: RateLimitData): void;
  checkLimit(): RateLimitInfo;
  getState(): RateLimitState | null;
}
```

**Usage Example (GitHub):**

```typescript
import { RateLimitHandler } from '@/lib/api/rate-limit';

const rateLimitHandler = new RateLimitHandler({
  headerNames: {
    limit: 'x-ratelimit-limit',
    remaining: 'x-ratelimit-remaining',
    reset: 'x-ratelimit-reset',
    used: 'x-ratelimit-used'
  }
});

// After API request
rateLimitHandler.updateFromHeaders(response.headers);
const info = rateLimitHandler.checkLimit();
if (!info.canMakeRequest) {
  console.log(`Rate limit exceeded. Retry after ${info.retryAfter} seconds`);
}
```

**Usage Example (YouTube):**

```typescript
import { RateLimitHandler } from '@/lib/api/rate-limit';

const rateLimitHandler = new RateLimitHandler({
  headerNames: {
    limit: 'x-quota-limit',
    remaining: 'x-quota-remaining',
    reset: 'x-quota-reset',
    used: 'x-quota-used'
  }
});
```

### Configuration Module (`lib/api/config.ts`)

The configuration module provides utilities for reading, validating, and managing configuration from environment variables. It uses a factory pattern to create service-specific configuration readers.

**Key Design Decisions:**
- Factory function creates configured readers for specific services
- Environment variable names are provided as configuration
- Validation logic is generic and reusable
- Type-safe through TypeScript generics

**Core Types:**

```typescript
export interface ConfigMapping {
  [key: string]: string; // Maps config key to environment variable name
}

export interface ConfigReader<T> {
  read(): T;
  validate(config: Partial<T>): T;
  isConfigured(config: T): boolean;
}

export interface ConfigReaderOptions<T> {
  mapping: ConfigMapping;
  defaults: Partial<T>;
  validators?: {
    [K in keyof T]?: (value: unknown) => T[K];
  };
  requiredFields?: (keyof T)[];
}
```

**Public API:**

```typescript
// Create a configured reader for a specific service
export function createConfigReader<T>(
  options: ConfigReaderOptions<T>
): ConfigReader<T>

// Utility validators
export function parseNumber(value: unknown, defaultValue: number): number
export function parseStringArray(value: unknown): string[] | undefined
export function parseBoolean(value: unknown, defaultValue: boolean): boolean
```

**Usage Example (GitHub):**

```typescript
import { createConfigReader, parseNumber, parseStringArray } from '@/lib/api/config';
import { GitHubConfig } from './types';

const githubConfigReader = createConfigReader<GitHubConfig>({
  mapping: {
    username: 'GITHUB_USERNAME',
    token: 'GITHUB_TOKEN',
    revalidate: 'GITHUB_REVALIDATE',
    repositoryFilter: 'GITHUB_REPOSITORIES'
  },
  defaults: {
    revalidate: 3600,
    fallbackToMock: true
  },
  validators: {
    revalidate: (value) => parseNumber(value, 3600),
    repositoryFilter: (value) => parseStringArray(value)
  },
  requiredFields: ['username']
});

export const getGitHubConfig = () => githubConfigReader.read();
export const validateConfig = (config: Partial<GitHubConfig>) => 
  githubConfigReader.validate(config);
export const isConfigured = (config: GitHubConfig) => 
  githubConfigReader.isConfigured(config);
```

### Shared Types Module (`lib/api/types.ts`)

The shared types module defines common type definitions used across multiple utilities.

**Core Types:**

```typescript
// Re-export from rate-limit module
export type { RateLimitState, RateLimitInfo, RateLimitConfig, RateLimitData } from './rate-limit';

// Re-export from errors module
export type { ErrorMessages, ErrorHandlerConfig } from './errors';

// Re-export from config module
export type { ConfigMapping, ConfigReader, ConfigReaderOptions } from './config';
```

### Public Exports Module (`lib/api/index.ts`)

The index module provides a clean public API for the shared utilities.

```typescript
// Error handling
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

// Formatting
export {
  formatLargeNumber,
  formatDate,
  formatNumber
} from './formatters';

// Rate limiting
export {
  RateLimitHandler
} from './rate-limit';

// Configuration
export {
  createConfigReader,
  parseNumber,
  parseStringArray,
  parseBoolean
} from './config';

// Types
export type {
  ErrorMessages,
  ErrorHandlerConfig,
  RateLimitState,
  RateLimitInfo,
  RateLimitConfig,
  RateLimitData,
  ConfigMapping,
  ConfigReader,
  ConfigReaderOptions
} from './types';
```

## Data Models

### Error Data Model

```typescript
// Base error structure
ApiError<T> {
  name: string;           // Error class name
  message: string;        // User-facing error message
  code: string;           // Machine-readable error code
  statusCode?: number;    // HTTP status code
  metadata?: T;           // Service-specific metadata
  stack?: string;         // Stack trace (inherited from Error)
}

// Example: GitHub error with rate limit metadata
ApiError<RateLimitInfo> {
  name: "RateLimitError";
  message: "GitHub API rate limit reached. Showing cached data.";
  code: "RATE_LIMIT_ERROR";
  statusCode: 429;
  metadata: {
    canMakeRequest: false;
    remaining: 0;
    resetAt: Date;
    retryAfter: 3600;
  };
}
```

### Rate Limit Data Model

```typescript
// Internal state
RateLimitState {
  limit: number;          // Total quota
  remaining: number;      // Remaining quota
  reset: Date;            // Reset time
  used: number;           // Used quota
}

// Public information
RateLimitInfo {
  canMakeRequest: boolean;  // Whether requests can be made
  remaining: number;        // Remaining quota
  resetAt: Date;            // When quota resets
  retryAfter?: number;      // Seconds until reset (if blocked)
}

// API response data
RateLimitData {
  limit: number;
  remaining: number;
  reset: number;          // Unix timestamp
  used: number;
}
```

### Configuration Data Model

```typescript
// Generic configuration structure
Config {
  [key: string]: string | number | boolean | string[] | undefined;
}

// Example: GitHub configuration
GitHubConfig {
  username: string;
  token?: string;
  revalidate: number;
  repositoryFilter?: string[];
  fallbackToMock: boolean;
}

// Example: YouTube configuration
YouTubeConfig {
  apiKey: string;
  channelId?: string;
  revalidate: number;
  maxResults: number;
  fallbackToMock: boolean;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Error Classification by Status Code

*For any* HTTP error with a status code, the error handler should classify it into the correct error type based on standard HTTP status code ranges: 401/403 → AuthenticationError or RateLimitError, 404 → NotFoundError, 429 → RateLimitError, 5xx → NetworkError.

**Validates: Requirements 1.3**

### Property 2: Type Guard Correctness

*For any* error instance, the type guard functions (isRateLimitError, isNotFoundError, isAuthenticationError) should return true if and only if the error is an instance of the corresponding error class.

**Validates: Requirements 1.4**

### Property 3: Date Formatting Locale Consistency

*For any* valid date and locale, formatDate should produce output that matches the locale's conventions (MM/DD/YYYY for 'en', DD/MM/YYYY for 'pt'), and parsing the formatted string should yield a date equivalent to the original.

**Validates: Requirements 2.2**

### Property 4: Number Formatting Locale Consistency

*For any* number and locale, formatNumber should produce output that uses the correct decimal separator and thousands separator for that locale (comma for thousands and period for decimal in 'en', period for thousands and comma for decimal in 'pt').

**Validates: Requirements 2.3**

### Property 5: Large Number Formatting Rules

*For any* number, formatLargeNumber should: return the number as a string without suffix if less than 1000, return the number with 'k' suffix and at most one decimal place if between 1000 and 999999, and return the number with 'M' suffix and at most one decimal place if greater than or equal to 1000000.

**Validates: Requirements 2.5, 2.6, 2.7**

### Property 6: Rate Limit State Updates

*For any* valid rate limit data (whether from headers or API response), after updating the RateLimitHandler, the internal state should reflect the provided values for limit, remaining, reset, and used.

**Validates: Requirements 3.2, 3.3**

### Property 7: Rate Limit Request Permission

*For any* rate limit state, checkLimit should return canMakeRequest as false when remaining quota is zero and current time is before reset time, and should return canMakeRequest as true when remaining quota is greater than zero or current time is at or after reset time.

**Validates: Requirements 3.4**

### Property 8: Configurable Header Name Extraction

*For any* valid header name configuration and corresponding HTTP headers, updateFromHeaders should correctly extract rate limit values from the headers using the configured header names.

**Validates: Requirements 3.8**

### Property 9: Configuration Validation and Normalization

*For any* partial configuration object, validateConfig should return a complete configuration with: invalid numeric values replaced by defaults, comma-separated string values parsed into arrays, and all required fields present.

**Validates: Requirements 4.2, 4.5, 4.6**

### Property 10: Configuration Presence Check

*For any* configuration object, isConfigured should return true if and only if all required fields are present and have valid non-empty values.

**Validates: Requirements 4.3**

## Error Handling

### Error Handling Strategy

The shared utilities themselves provide error handling capabilities but also need to handle their own internal errors gracefully.

**Error Categories:**

1. **Invalid Input Errors**
   - Invalid date strings in formatDate
   - Invalid numeric values in configuration
   - Malformed headers in rate limit extraction
   - Unknown error types in error handler

2. **Configuration Errors**
   - Missing required environment variables
   - Invalid environment variable values
   - Type mismatches in configuration

3. **State Errors**
   - Accessing rate limit state before initialization
   - Invalid rate limit data (negative values, invalid timestamps)

**Error Handling Approaches:**

**Formatting Functions:**
- Invalid dates: Return "Invalid Date" string
- Invalid numbers: Return "0" or empty string
- Invalid locale: Fall back to 'en' locale

**Rate Limit Handler:**
- Missing headers: Skip update, maintain previous state
- Invalid header values: Skip update, log warning
- Uninitialized state: Return permissive default (allow requests)
- Invalid timestamps: Use current time + 1 hour as default

**Configuration Reader:**
- Missing required variables: Return empty string or undefined
- Invalid numeric values: Apply default values
- Invalid array values: Return undefined or empty array
- Type mismatches: Coerce to expected type or use default

**Error Handler:**
- Unknown error types: Wrap in generic ApiError
- Missing status codes: Create error without status code
- Invalid metadata: Omit metadata from error

### Error Propagation

The shared utilities follow these principles for error propagation:

1. **Graceful Degradation**: Functions should not throw errors for invalid input; instead, they should return safe default values
2. **Explicit Error Types**: When errors must be thrown, use specific error classes (ValidationError, etc.)
3. **Error Context**: Include relevant context in error messages (what failed, why it failed)
4. **No Silent Failures**: Log warnings for recoverable errors, throw for unrecoverable errors

### Error Recovery

**Formatting Functions:**
- No recovery needed; return safe defaults

**Rate Limit Handler:**
- Recovery: Allow requests when state is unknown
- Rationale: Better to make requests and potentially hit rate limit than to block all requests

**Configuration Reader:**
- Recovery: Use default values for invalid configuration
- Rationale: Allow system to start with sensible defaults

**Error Handler:**
- Recovery: Wrap unknown errors in generic ApiError
- Rationale: Ensure all errors have consistent structure

## Testing Strategy

### Dual Testing Approach

The shared API utilities will be tested using both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests:**
- Specific examples demonstrating correct behavior
- Edge cases (empty strings, zero values, boundary conditions)
- Error conditions (invalid inputs, missing configuration)
- Integration between utilities
- Backward compatibility with GitHub integration

**Property-Based Tests:**
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Minimum 100 iterations per property test
- Each test references its design document property

### Property-Based Testing Configuration

**Testing Library:** fast-check (TypeScript/JavaScript property-based testing library)

**Test Configuration:**
- Minimum iterations: 100 per property test
- Seed: Random (for reproducibility, seed can be fixed when debugging)
- Shrinking: Enabled (to find minimal failing examples)
- Timeout: 5000ms per test

**Property Test Tagging:**
Each property-based test must include a comment tag referencing the design document:
```typescript
// Feature: shared-api-utilities, Property 1: Error Classification by Status Code
```

### Test Organization

```
lib/api/
├── __tests__/
│   ├── errors.test.ts              # Unit tests for error handling
│   ├── errors.property.test.ts     # Property tests for error handling
│   ├── formatters.test.ts          # Unit tests for formatters
│   ├── formatters.property.test.ts # Property tests for formatters
│   ├── rate-limit.test.ts          # Unit tests for rate limiting
│   ├── rate-limit.property.test.ts # Property tests for rate limiting
│   ├── config.test.ts              # Unit tests for configuration
│   ├── config.property.test.ts     # Property tests for configuration
│   └── integration.test.ts         # Integration tests
```

### Unit Test Coverage

**Error Handling Module:**
- Creating each error type with various parameters
- Error handler with different status codes (401, 403, 404, 429, 500, etc.)
- Error handler with different error types (TypeError, Error, Response, unknown)
- Type guards with correct and incorrect error types
- Custom error messages configuration
- Metadata extraction

**Formatting Module:**
- formatLargeNumber with specific values (0, 999, 1000, 1500, 999999, 1000000, 5300000)
- formatDate with specific dates and both locales
- formatDate with invalid date strings
- formatNumber with specific numbers and both locales

**Rate Limit Module:**
- updateFromHeaders with GitHub-style headers
- updateFromHeaders with YouTube-style headers (different header names)
- updateFromApi with explicit data
- checkLimit with various states (quota available, quota exhausted, time passed)
- getState before and after updates
- Edge cases: zero remaining, negative values, past reset time

**Configuration Module:**
- createConfigReader with different mappings
- Reading configuration from environment variables
- validateConfig with valid and invalid inputs
- validateConfig with numeric values (valid, invalid, missing)
- validateConfig with array values (comma-separated, empty, missing)
- isConfigured with complete and incomplete configurations

### Property-Based Test Coverage

**Property 1: Error Classification by Status Code**
- Generate random status codes (100-599)
- Generate random error objects with status codes
- Verify classification matches expected error type
- Tag: `Feature: shared-api-utilities, Property 1: Error Classification by Status Code`

**Property 2: Type Guard Correctness**
- Generate random error instances (all types)
- Verify type guards return correct boolean values
- Verify type guards provide correct type narrowing
- Tag: `Feature: shared-api-utilities, Property 2: Type Guard Correctness`

**Property 3: Date Formatting Locale Consistency**
- Generate random valid dates
- Test with both 'en' and 'pt' locales
- Verify format matches locale conventions
- Tag: `Feature: shared-api-utilities, Property 3: Date Formatting Locale Consistency`

**Property 4: Number Formatting Locale Consistency**
- Generate random numbers (integers, decimals, large, small)
- Test with both 'en' and 'pt' locales
- Verify separators match locale conventions
- Tag: `Feature: shared-api-utilities, Property 4: Number Formatting Locale Consistency`

**Property 5: Large Number Formatting Rules**
- Generate random numbers across all ranges (0-999, 1000-999999, 1000000+)
- Verify suffix rules (none, k, M)
- Verify decimal place rules (at most one decimal)
- Tag: `Feature: shared-api-utilities, Property 5: Large Number Formatting Rules`

**Property 6: Rate Limit State Updates**
- Generate random rate limit data
- Update handler and verify state matches
- Test both header-based and API-based updates
- Tag: `Feature: shared-api-utilities, Property 6: Rate Limit State Updates`

**Property 7: Rate Limit Request Permission**
- Generate random rate limit states
- Generate random current times
- Verify canMakeRequest logic is correct
- Tag: `Feature: shared-api-utilities, Property 7: Rate Limit Request Permission`

**Property 8: Configurable Header Name Extraction**
- Generate random header name configurations
- Generate random header values
- Verify extraction works with custom header names
- Tag: `Feature: shared-api-utilities, Property 8: Configurable Header Name Extraction`

**Property 9: Configuration Validation and Normalization**
- Generate random partial configurations
- Verify validation applies defaults correctly
- Verify array parsing works correctly
- Tag: `Feature: shared-api-utilities, Property 9: Configuration Validation and Normalization`

**Property 10: Configuration Presence Check**
- Generate random configurations (complete and incomplete)
- Verify isConfigured returns correct boolean
- Tag: `Feature: shared-api-utilities, Property 10: Configuration Presence Check`

### Integration Testing

**GitHub Integration Compatibility:**
- Import shared utilities in GitHub integration
- Run all existing GitHub integration tests
- Verify all tests pass without modification
- Verify error messages remain unchanged
- Verify formatting behavior remains unchanged
- Verify rate limiting behavior remains unchanged

**YouTube Integration Enablement:**
- Create YouTube-specific error messages
- Configure rate limit handler with YouTube headers
- Create YouTube configuration reader
- Verify utilities work with YouTube-specific configuration

### Backward Compatibility Testing

**API Surface Compatibility:**
- Verify GitHub integration exports remain unchanged
- Verify function signatures remain unchanged
- Verify type definitions remain unchanged
- Verify error message constants remain unchanged

**Behavioral Compatibility:**
- Run existing GitHub integration tests
- Compare error handling behavior before and after refactoring
- Compare formatting output before and after refactoring
- Compare rate limiting behavior before and after refactoring

### Test Execution

**Local Development:**
```bash
# Run all tests
npm test

# Run unit tests only
npm test -- --testPathPattern="\.test\.ts$"

# Run property tests only
npm test -- --testPathPattern="\.property\.test\.ts$"

# Run tests for specific module
npm test -- errors
npm test -- formatters
npm test -- rate-limit
npm test -- config

# Run with coverage
npm test -- --coverage
```

**Continuous Integration:**
- Run all tests on every pull request
- Require 100% pass rate
- Require minimum 90% code coverage
- Run type checking (tsc --noEmit)
- Run linting (eslint)

### Success Criteria

The refactoring is considered successful when:
1. All new unit tests pass (100%)
2. All new property-based tests pass (100%)
3. All existing GitHub integration tests pass without modification (100%)
4. Code coverage is at least 90%
5. No TypeScript compilation errors
6. No linting errors
7. GitHub integration behavior is identical to pre-refactoring behavior
8. YouTube integration can successfully use shared utilities

