# Implementation Plan: GitHub Integration

## Overview

This implementation plan breaks down the GitHub integration feature into discrete coding tasks. The approach follows a layered architecture: first establishing core infrastructure (types, configuration, error handling), then building the API client using Next.js native caching, followed by the service orchestration layer, and finally integrating with the Next.js application. Each task builds incrementally on previous work, with property-based tests placed strategically to catch errors early.

## Tasks

- [x] 1. Set up project structure and core types
  - Create directory structure: `lib/github/` for all GitHub-related modules
  - Define TypeScript interfaces for GitHub API responses in `lib/github/types.ts`
  - Extend the existing `GitHubProject` interface to include `forks`, `language`, and `updatedAt` fields
  - Define types for rate limit state and configuration
  - Enable TypeScript strict mode for the GitHub module
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 1.1 Write property test for API response type validation
  - **Property 17: API Response Type Validation**
  - **Validates: Requirements 8.5**

- [x] 2. Implement configuration management
  - [x] 2.1 Create configuration module (`lib/github/config.ts`)
    - Implement `getGitHubConfig()` to read from environment variables
    - Implement `validateConfig()` to validate configuration values
    - Define default values for revalidation time and fallback behavior
    - Support reading comma-separated repository filter from `GITHUB_REPOSITORIES` env var
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 2.2 Write property test for environment variable configuration loading
    - **Property 11: Environment Variable Configuration Loading**
    - **Validates: Requirements 4.1, 4.4**

  - [x] 2.3 Write unit tests for configuration module
    - Test missing username falls back to mock data
    - Test repository filter parsing from comma-separated string
    - Test default values when optional config is missing
    - _Requirements: 4.5_

- [x] 3. Implement error handling system
  - [x] 3.1 Create error classes and handler (`lib/github/errors.ts`)
    - Define `GitHubError` base class with code, statusCode, and rateLimit fields
    - Define specialized error classes: `NetworkError`, `AuthenticationError`, `RateLimitError`, `NotFoundError`, `ValidationError`
    - Implement `handleGitHubError()` to classify and wrap errors
    - Implement error type checking functions: `isRateLimitError()`, `isNotFoundError()`, `isAuthenticationError()`
    - Define user-facing error messages for each error type
    - _Requirements: 1.4, 6.1, 6.2, 6.4_

  - [x] 3.2 Write property test for error handling and logging
    - **Property 4: Error Handling and Logging**
    - **Validates: Requirements 1.4**

  - [x] 3.3 Write unit tests for error handler
    - Test 404 errors are classified as NotFoundError
    - Test 403 errors for private repos are handled gracefully
    - Test error messages don't expose sensitive token information
    - _Requirements: 6.1, 6.2_

- [x] 4. Implement rate limit handler
  - [x] 4.1 Create rate limit handler (`lib/github/rate-limit.ts`)
    - Implement `RateLimitHandler` class with state management
    - Implement `updateFromHeaders()` to parse rate limit from response headers
    - Implement `updateFromApi()` to update from explicit rate limit API response
    - Implement `checkLimit()` to determine if requests can be made
    - Implement `getState()` to retrieve current rate limit information
    - _Requirements: 2.1, 2.3, 2.4_

  - [ ]* 4.2 Write property test for rate limit quota checking
    - **Property 5: Rate Limit Quota Checking**
    - **Validates: Requirements 2.1**

  - [ ]* 4.3 Write property test for rate limit information storage
    - **Property 6: Rate Limit Information Storage**
    - **Validates: Requirements 2.3**

  - [ ]* 4.4 Write property test for rate limit metadata in responses
    - **Property 7: Rate Limit Metadata in Responses**
    - **Validates: Requirements 2.4**

  - [ ]* 4.5 Write unit tests for rate limit handler
    - Test rate limit exceeded returns canMakeRequest: false
    - Test reset time calculation
    - Test retryAfter calculation when rate limited
    - _Requirements: 2.1, 2.4_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement GitHub API client
  - [x] 6.1 Create GitHub API client (`lib/github/client.ts`)
    - Implement `GitHubClient` class with configuration
    - Implement `fetchRepositories()` using fetch with `next: { revalidate }` option for automatic caching
    - Implement `fetchRepository()` to fetch a single repository by name with caching
    - Implement `getRateLimit()` to fetch current rate limit status
    - Add authentication headers when token is provided
    - Parse rate limit information from response headers
    - Handle HTTP errors and convert to GitHubError types
    - Use revalidation time from configuration for cache control
    - _Requirements: 1.1, 1.2, 1.5, 3.1, 3.2_

  - [x] 6.2 Write property test for GitHub API communication
    - **Property 1: GitHub API Communication**
    - **Validates: Requirements 1.1**

  - [x] 6.3 Write property test for complete repository data retrieval
    - **Property 2: Complete Repository Data Retrieval**
    - **Validates: Requirements 1.2**

  - [x] 6.4 Write property test for authentication header inclusion
    - **Property 8: Authentication Header Inclusion**
    - **Validates: Requirements 1.5**

  - [x] 6.5 Write unit tests for GitHub API client
    - Test fetch with no token (unauthenticated requests)
    - Test fetch with invalid token returns AuthenticationError
    - Test pagination handling for users with many repositories
    - Test repository not found (404) handling
    - Test revalidation option is passed to fetch
    - _Requirements: 1.4, 1.5, 3.2, 6.1_

- [x] 7. Implement data transformer
  - [x] 7.1 Create data transformer (`lib/github/transformer.ts`)
    - Implement `transformRepository()` to convert GitHubApiRepository to GitHubProject
    - Implement `transformRepositories()` to batch transform repositories
    - Implement `extractTechnologies()` to derive technologies array from language and topics
    - Handle null values for description and language fields
    - Format updatedAt timestamp to ISO 8601 string
    - _Requirements: 1.3, 5.1, 5.2, 5.3, 5.4_

  - [x] 7.2 Write property test for API response transformation
    - **Property 3: API Response Transformation**
    - **Validates: Requirements 1.3**

  - [x] 7.3 Write unit tests for data transformer
    - Test transformation with null description
    - Test transformation with null language
    - Test technologies extraction from language field
    - _Requirements: 1.3_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement GitHub service orchestration layer
  - [x] 9.1 Create GitHub service (`lib/github/service.ts`)
    - Implement `GitHubService` class that coordinates client and rate limit handler
    - Implement `getRepositories()` with fallback chain: API (with Next.js cache) → mock data
    - Check rate limit before making API requests
    - Apply repository filter if configured
    - Return result with source indicator (api/cache/fallback) and rate limit info
    - Implement `getRateLimitStatus()` to expose current rate limit state
    - Handle partial failures when fetching multiple repositories
    - Rely on Next.js automatic caching via fetch revalidation
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.4, 2.5, 3.3, 4.2, 6.3, 6.5_

  - [-]* 9.2 Write property test for repository filtering
    - **Property 12: Repository Filtering**
    - **Validates: Requirements 4.2**

  - [-]* 9.3 Write property test for partial failure resilience
    - **Property 15: Partial Failure Resilience**
    - **Validates: Requirements 6.3, 6.5**

  - [ ]* 9.4 Write unit tests for GitHub service
    - Test rate limit exceeded returns error message
    - Test all repositories fail to load shows error message
    - Test some repositories fail but others succeed
    - Test fallback to mock data when username not configured
    - _Requirements: 2.2, 2.5, 4.5, 6.3, 6.4, 6.5_

- [x] 10. Implement formatting utilities
  - [x] 10.1 Create formatting utilities (`lib/github/formatters.ts`)
    - Implement `formatLargeNumber()` to format numbers with k/M suffixes
    - Implement `formatDate()` to format dates according to locale
    - Implement `formatNumber()` to format numbers according to locale
    - Support both English and Portuguese locales
    - _Requirements: 5.5, 7.4, 7.5_

  - [ ]* 10.2 Write property test for large number formatting
    - **Property 14: Large Number Formatting**
    - **Validates: Requirements 5.5**

  - [ ]* 10.3 Write property test for locale-specific formatting
    - **Property 16: Locale-Specific Formatting**
    - **Validates: Requirements 7.4, 7.5**

  - [ ]* 10.4 Write unit tests for formatting utilities
    - Test numbers less than 1000 are not formatted with suffix
    - Test 1000 formats as "1k"
    - Test 1500 formats as "1.5k"
    - Test 1000000 formats as "1M"
    - Test date formatting for en and pt locales
    - _Requirements: 5.5, 7.4, 7.5_

- [x] 11. Add internationalization support
  - [x] 11.1 Update i18n translation files
    - Add GitHub-related labels to `messages/en.json`: "stars", "forks", "language", "lastUpdated", "viewOnGitHub"
    - Add GitHub-related labels to `messages/pt.json` with Portuguese translations
    - Add error message translations for all GitHub error types
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 11.2 Write property test for internationalization label translation
    - **Property 9: Internationalization Label Translation**
    - **Validates: Requirements 7.1**

  - [ ]* 11.3 Write property test for error message translation
    - **Property 10: Error Message Translation**
    - **Validates: Requirements 7.3**

  - [ ]* 11.4 Write unit tests for i18n integration
    - Test all required labels exist in both en and pt translation files
    - Test error messages exist in both locales
    - _Requirements: 7.2, 7.3_

- [x] 12. Integrate with Next.js application
  - [x] 12.1 Create server action for fetching GitHub data
    - Create `app/actions/github.ts` with server action `getGitHubProjects()`
    - Initialize GitHubService with configuration from environment variables
    - Call service.getRepositories() and return result
    - Handle errors and return appropriate error responses
    - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.4_

  - [x] 12.2 Update projects page to use GitHub data
    - Modify the projects page component to call the GitHub server action
    - Replace mock data with real GitHub data when available
    - Display loading state while fetching data
    - Display error message if all repositories fail to load
    - Show data source indicator (API/cache/fallback) in development mode
    - _Requirements: 1.3, 6.4_

  - [x] 12.3 Update project card component to display new fields
    - Add display for fork count with icon
    - Add display for primary language with icon/badge
    - Add display for last updated timestamp
    - Use formatting utilities for numbers and dates
    - Use i18n translations for all labels
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.4, 7.5_

  - [ ]* 12.4 Write property test for repository data display completeness
    - **Property 13: Repository Data Display Completeness**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

  - [ ]* 12.5 Write unit tests for Next.js integration
    - Test server action with valid configuration
    - Test server action with missing configuration falls back to mock
    - Test page component renders loading state
    - Test page component renders error message when all repos fail
    - Test project card displays all required fields
    - _Requirements: 4.5, 6.4_

- [x] 13. Add environment variable configuration
  - [x] 13.1 Update environment configuration files
    - Add GitHub environment variables to `.env.example`: `GITHUB_USERNAME`, `GITHUB_TOKEN`, `GITHUB_REVALIDATE`, `GITHUB_REPOSITORIES`
    - Add documentation comments explaining each variable
    - Document that `GITHUB_REVALIDATE` is in seconds (e.g., 3600 for 1 hour)
    - Update `.env.local` with placeholder values (if it exists)
    - _Requirements: 4.1, 4.2, 4.4_

  - [x] 13.2 Update project documentation
    - Add GitHub integration setup instructions to README
    - Document how to obtain a GitHub personal access token
    - Document environment variable configuration
    - Document repository filtering feature
    - Explain Next.js caching behavior and revalidation
    - _Requirements: 4.1, 4.2, 4.4_

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Run all unit tests and property-based tests
  - Verify TypeScript compilation with no errors
  - Test the application manually with real GitHub data
  - Test fallback behavior with invalid/missing configuration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples, edge cases, and integration points
- The implementation follows a bottom-up approach: infrastructure → API client → service → UI integration
- All code uses TypeScript with strict mode enabled
- Caching is handled automatically by Next.js using the fetch API with revalidation
- The feature gracefully degrades to mock data if GitHub integration is not configured
