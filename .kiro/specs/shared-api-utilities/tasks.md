# Implementation Plan: Shared API Utilities Refactoring

## Overview

This plan guides the refactoring of common utilities from the GitHub integration into a shared location at `lib/api/`. The refactoring will extract error handling, formatting, rate limiting, and configuration management utilities into generic, reusable modules. The GitHub integration will be migrated to use these shared utilities while maintaining backward compatibility, and the YouTube integration will be enabled to use them as well.

## Tasks

- [x] 1. Create shared utilities directory structure
  - Create `lib/api/` directory
  - Create placeholder files: `errors.ts`, `formatters.ts`, `rate-limit.ts`, `config.ts`, `types.ts`, `index.ts`
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 2. Implement shared error handling utilities
  - [x] 2.1 Create base error classes and specialized error types
    - Implement `ApiError<T>` base class with generic metadata support
    - Implement `NetworkError`, `AuthenticationError`, `RateLimitError`, `NotFoundError`, `ValidationError` classes
    - Define `ErrorMessages` and `ErrorHandlerConfig` interfaces
    - _Requirements: 1.1, 1.2, 8.2_
  
  - [x] 2.2 Implement error handler factory and type guards
    - Implement `createErrorHandler` function with configurable error messages
    - Implement error classification logic based on HTTP status codes
    - Implement type guard functions: `isRateLimitError`, `isNotFoundError`, `isAuthenticationError`
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 9.1, 9.2_
  
  - [ ]* 2.3 Write property test for error classification
    - **Property 1: Error Classification by Status Code**
    - **Validates: Requirements 1.3**
  
  - [ ]* 2.4 Write property test for type guard correctness
    - **Property 2: Type Guard Correctness**
    - **Validates: Requirements 1.4**
  
  - [ ]* 2.5 Write unit tests for error handling
    - Test each error type creation with various parameters
    - Test error handler with different status codes (401, 403, 404, 429, 500)
    - Test type guards with correct and incorrect error types
    - Test custom error messages configuration
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Implement shared formatting utilities
  - [x] 3.1 Move formatting functions to shared location
    - Copy `formatLargeNumber`, `formatDate`, `formatNumber` from `lib/github/formatters.ts` to `lib/api/formatters.ts`
    - Add JSDoc comments with usage examples
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 9.1, 9.3_
  
  - [ ]* 3.2 Write property test for date formatting locale consistency
    - **Property 3: Date Formatting Locale Consistency**
    - **Validates: Requirements 2.2**
  
  - [ ]* 3.3 Write property test for number formatting locale consistency
    - **Property 4: Number Formatting Locale Consistency**
    - **Validates: Requirements 2.3**
  
  - [ ]* 3.4 Write property test for large number formatting rules
    - **Property 5: Large Number Formatting Rules**
    - **Validates: Requirements 2.5, 2.6, 2.7**
  
  - [ ]* 3.5 Write unit tests for formatting utilities
    - Test `formatLargeNumber` with specific values (0, 999, 1000, 1500, 999999, 1000000, 5300000)
    - Test `formatDate` with specific dates and both locales ('en', 'pt')
    - Test `formatDate` with invalid date strings
    - Test `formatNumber` with specific numbers and both locales
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 2.7_

- [-] 4. Implement shared rate limit handling utilities
  - [x] 4.1 Create rate limit handler with configurable headers
    - Implement `RateLimitHandler` class with configurable header names
    - Define `RateLimitState`, `RateLimitInfo`, `RateLimitConfig`, `RateLimitData` interfaces
    - Implement `updateFromHeaders` method with configurable header extraction
    - Implement `updateFromApi` method for explicit rate limit data
    - Implement `checkLimit` method with quota and time-based logic
    - Implement `getState` method to return current state
    - Add JSDoc comments with usage examples for GitHub and YouTube
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.8, 8.3, 9.1, 9.4_
  
  - [ ]* 4.2 Write property test for rate limit state updates
    - **Property 6: Rate Limit State Updates**
    - **Validates: Requirements 3.2, 3.3**
  
  - [ ]* 4.3 Write property test for rate limit request permission
    - **Property 7: Rate Limit Request Permission**
    - **Validates: Requirements 3.4**
  
  - [ ]* 4.4 Write property test for configurable header name extraction
    - **Property 8: Configurable Header Name Extraction**
    - **Validates: Requirements 3.8**
  
  - [ ]* 4.5 Write unit tests for rate limit handler
    - Test `updateFromHeaders` with GitHub-style headers
    - Test `updateFromHeaders` with YouTube-style headers (different header names)
    - Test `updateFromApi` with explicit data
    - Test `checkLimit` with various states (quota available, quota exhausted, time passed)
    - Test `getState` before and after updates
    - Test edge cases: zero remaining, negative values, past reset time
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 5. Implement shared configuration management utilities
  - [x] 5.1 Create configuration reader factory and validators
    - Implement `createConfigReader` factory function with generic type support
    - Define `ConfigMapping`, `ConfigReader`, `ConfigReaderOptions` interfaces
    - Implement utility validators: `parseNumber`, `parseStringArray`, `parseBoolean`
    - Implement configuration validation and normalization logic
    - Implement `isConfigured` check for required fields
    - Add JSDoc comments with usage examples for GitHub and YouTube
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 8.1, 9.1, 9.4, 9.5, 9.6_
  
  - [ ]* 5.2 Write property test for configuration validation and normalization
    - **Property 9: Configuration Validation and Normalization**
    - **Validates: Requirements 4.2, 4.5, 4.6**
  
  - [ ]* 5.3 Write property test for configuration presence check
    - **Property 10: Configuration Presence Check**
    - **Validates: Requirements 4.3**
  
  - [ ]* 5.4 Write unit tests for configuration utilities
    - Test `createConfigReader` with different mappings
    - Test reading configuration from environment variables
    - Test `validateConfig` with valid and invalid inputs
    - Test `validateConfig` with numeric values (valid, invalid, missing)
    - Test `validateConfig` with array values (comma-separated, empty, missing)
    - Test `isConfigured` with complete and incomplete configurations
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 6. Create shared types and public exports
  - [x] 6.1 Create shared types module
    - Re-export types from `errors.ts`, `formatters.ts`, `rate-limit.ts`, `config.ts`
    - _Requirements: 7.6, 8.1, 8.2, 8.3, 8.4_
  
  - [x] 6.2 Create public exports index
    - Export all public functions, classes, and types from `lib/api/index.ts`
    - Organize exports by category (error handling, formatting, rate limiting, configuration)
    - _Requirements: 7.7_

- [x] 7. Checkpoint - Ensure shared utilities are complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Migrate GitHub integration to use shared utilities
  - [x] 8.1 Update GitHub error handling to use shared utilities
    - Import error classes from `@/lib/api/errors`
    - Create GitHub-specific error messages configuration
    - Create `handleGitHubError` using `createErrorHandler`
    - Update all error handling code in `lib/github/` to use shared error classes
    - Remove `lib/github/errors.ts` file
    - _Requirements: 5.1, 10.3_
  
  - [x] 8.2 Update GitHub formatting to use shared utilities
    - Import formatting functions from `@/lib/api/formatters`
    - Update all formatting code in `lib/github/` to use shared formatters
    - Remove `lib/github/formatters.ts` file
    - _Requirements: 5.2, 10.4_
  
  - [x] 8.3 Update GitHub rate limiting to use shared utilities
    - Import `RateLimitHandler` from `@/lib/api/rate-limit`
    - Configure handler with GitHub-specific header names
    - Update all rate limiting code in `lib/github/` to use shared handler
    - Remove `lib/github/rate-limit.ts` file
    - _Requirements: 5.3_
  
  - [x] 8.4 Update GitHub configuration to use shared utilities
    - Import configuration utilities from `@/lib/api/config`
    - Create GitHub configuration reader using `createConfigReader`
    - Update all configuration code in `lib/github/` to use shared utilities
    - Remove `lib/github/config.ts` file
    - _Requirements: 5.4_
  
  - [x] 8.5 Update GitHub public exports
    - Update `lib/github/index.ts` to export from new locations
    - Ensure all exported types remain unchanged
    - _Requirements: 5.5, 10.1, 10.2_
  
  - [ ]* 8.6 Run backward compatibility tests
    - Run all existing GitHub integration tests
    - Verify all tests pass without modification
    - Verify error messages remain unchanged
    - Verify formatting behavior remains unchanged
    - Verify rate limiting behavior remains unchanged
    - _Requirements: 5.6, 5.7, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 9. Checkpoint - Ensure GitHub migration is complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Enable YouTube integration to use shared utilities
  - [x] 10.1 Create YouTube-specific error configuration
    - Create YouTube error messages configuration
    - Create `handleYouTubeError` using `createErrorHandler`
    - Document YouTube-specific error handling patterns
    - _Requirements: 6.1, 6.6_
  
  - [x] 10.2 Create YouTube-specific rate limit configuration
    - Configure `RateLimitHandler` with YouTube-specific header names
    - Document YouTube rate limit header mapping
    - _Requirements: 6.3, 6.7_
  
  - [x] 10.3 Create YouTube-specific configuration reader
    - Create YouTube configuration reader using `createConfigReader`
    - Define YouTube configuration type and environment variable mappings
    - Document YouTube configuration options
    - _Requirements: 6.4_
  
  - [ ]* 10.4 Write integration tests for YouTube utilities
    - Test YouTube error handling with shared utilities
    - Test YouTube rate limiting with shared utilities
    - Test YouTube configuration with shared utilities
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The refactoring maintains backward compatibility with the GitHub integration
- All existing GitHub integration tests must pass without modification
