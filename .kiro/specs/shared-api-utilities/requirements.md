# Requirements Document

## Introduction

This document specifies requirements for refactoring common utilities from the GitHub integration into a shared location. The goal is to eliminate code duplication and enable reuse across multiple API integrations (GitHub, YouTube, and future integrations). Common patterns for error handling, formatting, rate limiting, and configuration will be extracted into generic, reusable utilities.

## Glossary

- **API_Integration**: A module that connects to an external API service (e.g., GitHub, YouTube)
- **Shared_Utilities**: Generic, reusable utility modules located in lib/api/ that can be used by any API_Integration
- **Error_Handler**: A utility that classifies, wraps, and manages errors from API requests
- **Rate_Limit_Handler**: A utility that tracks and manages API rate limits
- **Formatter**: A utility that formats data for display (numbers, dates, etc.)
- **Config_Manager**: A utility that reads, validates, and manages configuration from environment variables
- **Integration_Specific_Code**: Code unique to a particular API (client, service, transformer, types)

## Requirements

### Requirement 1: Extract Error Handling Utilities

**User Story:** As a developer, I want generic error handling utilities, so that I can handle errors consistently across all API integrations.

#### Acceptance Criteria

1. THE Shared_Utilities SHALL provide a base ApiError class with code, statusCode, and optional metadata properties
2. THE Shared_Utilities SHALL provide NetworkError, AuthenticationError, RateLimitError, NotFoundError, and ValidationError classes that extend ApiError
3. THE Shared_Utilities SHALL provide a handleApiError function that classifies errors by HTTP status code
4. THE Shared_Utilities SHALL provide type guard functions isRateLimitError, isNotFoundError, and isAuthenticationError
5. WHEN an API_Integration provides service-specific error messages, THE Error_Handler SHALL accept them as configuration
6. FOR ALL error types, the error classification logic SHALL be independent of any specific API service

### Requirement 2: Extract Formatting Utilities

**User Story:** As a developer, I want generic formatting utilities, so that I can format data consistently across all integrations.

#### Acceptance Criteria

1. THE Shared_Utilities SHALL provide a formatLargeNumber function that formats numbers with k/M suffixes
2. THE Shared_Utilities SHALL provide a formatDate function that formats dates according to locale
3. THE Shared_Utilities SHALL provide a formatNumber function that formats numbers according to locale conventions
4. FOR ALL formatting functions, the implementation SHALL be independent of any specific API service
5. WHEN formatLargeNumber receives a number less than 1000, THE Formatter SHALL return the number as a string without suffix
6. WHEN formatLargeNumber receives a number greater than or equal to 1000000, THE Formatter SHALL return the number with M suffix and at most one decimal place
7. WHEN formatLargeNumber receives a number between 1000 and 999999, THE Formatter SHALL return the number with k suffix and at most one decimal place

### Requirement 3: Extract Rate Limit Handling Utilities

**User Story:** As a developer, I want generic rate limit handling utilities, so that I can manage API quotas consistently across all integrations.

#### Acceptance Criteria

1. THE Shared_Utilities SHALL provide a RateLimitHandler class that tracks rate limit state
2. THE Shared_Utilities SHALL provide updateFromHeaders method that extracts rate limit data from HTTP response headers
3. THE Shared_Utilities SHALL provide updateFromApi method that accepts explicit rate limit data
4. THE Shared_Utilities SHALL provide checkLimit method that returns whether requests can be made
5. THE Shared_Utilities SHALL provide getState method that returns current rate limit information
6. WHEN checkLimit is called and remaining quota is zero, THE Rate_Limit_Handler SHALL return canMakeRequest as false
7. WHEN checkLimit is called and reset time has passed, THE Rate_Limit_Handler SHALL return canMakeRequest as true
8. WHEN updateFromHeaders is called, THE Rate_Limit_Handler SHALL accept configurable header names for different API services

### Requirement 4: Extract Configuration Management Utilities

**User Story:** As a developer, I want generic configuration utilities, so that I can manage environment variables consistently across all integrations.

#### Acceptance Criteria

1. THE Shared_Utilities SHALL provide a createConfigReader function that accepts environment variable mappings
2. THE Shared_Utilities SHALL provide a validateConfig function that validates and normalizes configuration values
3. THE Shared_Utilities SHALL provide an isConfigured function that checks if required configuration is present
4. WHEN createConfigReader is called with environment variable names, THE Config_Manager SHALL return a function that reads those variables
5. WHEN validateConfig receives invalid numeric values, THE Config_Manager SHALL apply default values
6. WHEN validateConfig receives comma-separated string values, THE Config_Manager SHALL parse them into arrays
7. FOR ALL configuration utilities, the implementation SHALL be independent of any specific API service

### Requirement 5: Migrate GitHub Integration to Shared Utilities

**User Story:** As a developer, I want the GitHub integration to use shared utilities, so that the codebase is DRY and maintainable.

#### Acceptance Criteria

1. THE GitHub_Integration SHALL import error classes from Shared_Utilities
2. THE GitHub_Integration SHALL import formatting functions from Shared_Utilities
3. THE GitHub_Integration SHALL import RateLimitHandler from Shared_Utilities
4. THE GitHub_Integration SHALL import configuration utilities from Shared_Utilities
5. THE GitHub_Integration SHALL only contain Integration_Specific_Code in lib/github/ directory
6. WHEN migration is complete, THE GitHub_Integration SHALL maintain identical external behavior
7. WHEN migration is complete, THE GitHub_Integration SHALL pass all existing tests

### Requirement 6: Enable YouTube Integration to Use Shared Utilities

**User Story:** As a developer, I want the YouTube integration to use shared utilities, so that I can avoid duplicating code.

#### Acceptance Criteria

1. THE YouTube_Integration SHALL be able to import error classes from Shared_Utilities
2. THE YouTube_Integration SHALL be able to import formatting functions from Shared_Utilities
3. THE YouTube_Integration SHALL be able to import RateLimitHandler from Shared_Utilities
4. THE YouTube_Integration SHALL be able to import configuration utilities from Shared_Utilities
5. THE YouTube_Integration SHALL only contain Integration_Specific_Code in lib/youtube/ directory
6. WHEN YouTube_Integration uses Shared_Utilities, THE system SHALL support YouTube-specific error messages
7. WHEN YouTube_Integration uses Shared_Utilities, THE system SHALL support YouTube-specific rate limit headers

### Requirement 7: Organize Shared Utilities Directory Structure

**User Story:** As a developer, I want a clear directory structure for shared utilities, so that I can easily find and import them.

#### Acceptance Criteria

1. THE system SHALL create a lib/api/ directory for Shared_Utilities
2. THE lib/api/ directory SHALL contain errors.ts for error handling utilities
3. THE lib/api/ directory SHALL contain formatters.ts for formatting utilities
4. THE lib/api/ directory SHALL contain rate-limit.ts for rate limiting utilities
5. THE lib/api/ directory SHALL contain config.ts for configuration utilities
6. THE lib/api/ directory SHALL contain types.ts for shared type definitions
7. THE lib/api/ directory SHALL contain index.ts that exports all public utilities

### Requirement 8: Maintain Type Safety

**User Story:** As a developer, I want type-safe utilities, so that I can catch errors at compile time.

#### Acceptance Criteria

1. THE Shared_Utilities SHALL export TypeScript interfaces for all configuration types
2. THE Shared_Utilities SHALL export TypeScript interfaces for all error types
3. THE Shared_Utilities SHALL export TypeScript interfaces for rate limit state
4. THE Shared_Utilities SHALL use generic types where appropriate to support different API services
5. WHEN an API_Integration imports Shared_Utilities, THE TypeScript compiler SHALL enforce type constraints
6. FOR ALL utility functions, parameter types and return types SHALL be explicitly defined

### Requirement 9: Document Shared Utilities

**User Story:** As a developer, I want well-documented utilities, so that I can understand how to use them correctly.

#### Acceptance Criteria

1. THE Shared_Utilities SHALL include JSDoc comments for all exported functions
2. THE Shared_Utilities SHALL include JSDoc comments for all exported classes
3. THE Shared_Utilities SHALL include usage examples in JSDoc comments
4. THE Shared_Utilities SHALL include parameter descriptions in JSDoc comments
5. THE Shared_Utilities SHALL include return value descriptions in JSDoc comments
6. WHEN a utility accepts configuration, THE documentation SHALL explain all configuration options

### Requirement 10: Preserve Backward Compatibility

**User Story:** As a developer, I want the refactoring to be non-breaking, so that existing code continues to work.

#### Acceptance Criteria

1. WHEN GitHub integration is migrated, THE external API SHALL remain unchanged
2. WHEN GitHub integration is migrated, THE exported types SHALL remain unchanged
3. WHEN GitHub integration is migrated, THE error messages SHALL remain unchanged
4. WHEN GitHub integration is migrated, THE formatting behavior SHALL remain unchanged
5. THE system SHALL maintain all existing GitHub integration functionality
6. THE system SHALL pass all existing tests without modification
