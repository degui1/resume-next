# Requirements Document

## Introduction

This feature integrates the YouTube Data API v3 to fetch and display real-time channel statistics and metrics for the portfolio website. The integration will retrieve channel information including subscriber counts, video statistics, and channel metadata to showcase YouTube content creation activities. The implementation will leverage shared API utilities from lib/api/ for error handling, formatting, rate limiting, and configuration management, with YouTube-specific code isolated in lib/youtube/.

## Glossary

- **YouTube_API_Client**: The service responsible for making HTTP requests to the YouTube Data API v3
- **Channel_Metrics**: Statistics about a YouTube channel including subscriber count, view count, and video count
- **Portfolio_System**: The Next.js portfolio website application
- **Rate_Limit_Handler**: Shared utility from lib/api/ that monitors and manages API quota limits
- **Error_Handler**: Shared utility from lib/api/ that processes and formats API errors for user display
- **Formatter**: Shared utility from lib/api/ that formats numbers and dates for display
- **Config_Manager**: Shared utility from lib/api/ that reads and validates environment variables
- **Metrics_Cache**: Next.js cache storage for YouTube API responses
- **YouTube_Integration**: Integration-specific code in lib/youtube/ including client, service, transformer, and types
- **Shared_Utilities**: Generic, reusable utility modules located in lib/api/ used by YouTube_Integration

## Requirements

### Requirement 1: Fetch YouTube Channel Metrics

**User Story:** As a portfolio owner, I want to fetch my YouTube channel metrics from the YouTube Data API, so that my portfolio displays accurate and up-to-date channel statistics.

#### Acceptance Criteria

1. THE YouTube_API_Client SHALL fetch channel data from the YouTube Data API v3
2. WHEN a channel fetch is requested, THE YouTube_API_Client SHALL retrieve channel name, handle, subscriber count, view count, and video count
3. WHEN the YouTube API returns channel data, THE YouTube_Integration SHALL transform it into the YouTubeChannel type format
4. IF the YouTube API returns an HTTP error, THEN THE YouTube_Integration SHALL use handleApiError from Shared_Utilities to classify the error
5. WHEN handleApiError classifies an error, THE YouTube_Integration SHALL throw the appropriate error type (NetworkError, AuthenticationError, RateLimitError, NotFoundError, or ValidationError)
6. THE YouTube_API_Client SHALL include the API key in all API requests

### Requirement 2: Handle API Quota Limits

**User Story:** As a portfolio owner, I want the system to handle YouTube API quota limits gracefully, so that my portfolio remains functional even when quota limits are reached.

#### Acceptance Criteria

1. THE YouTube_Integration SHALL use Rate_Limit_Handler from Shared_Utilities to track quota state
2. WHEN an API request fails with a quota exceeded error, THE YouTube_Integration SHALL throw a RateLimitError from Shared_Utilities
3. WHEN a RateLimitError is caught, THE YouTube_Integration SHALL return cached data from Next.js cache when available
4. IF quota is exceeded and no cache exists, THEN THE Portfolio_System SHALL display an error state indicating quota limit reached
5. THE Rate_Limit_Handler SHALL log quota exceeded events for monitoring
6. THE YouTube_API_Client SHALL use efficient API calls to minimize quota consumption

### Requirement 3: Cache YouTube Metrics

**User Story:** As a portfolio owner, I want YouTube metrics to be cached, so that my portfolio loads quickly and reduces API quota usage.

#### Acceptance Criteria

1. WHEN channel metrics are fetched, THE YouTube_API_Client SHALL use Next.js fetch with the revalidate option
2. THE YouTube_API_Client SHALL set a revalidate time of 3600 seconds (1 hour) for channel metrics
3. WHEN cached data exists and is not expired, THE Portfolio_System SHALL return cached data without making an API request
4. WHEN cached data is expired, THE Portfolio_System SHALL fetch fresh data from the YouTube API and update the cache
5. THE Portfolio_System SHALL leverage Next.js automatic cache management for all YouTube API requests

### Requirement 4: Configure YouTube Integration

**User Story:** As a portfolio owner, I want to configure which YouTube channel to display, so that I can control what metrics appear on my portfolio.

#### Acceptance Criteria

1. THE YouTube_Integration SHALL use Config_Manager from Shared_Utilities to read configuration
2. THE Config_Manager SHALL read YouTube channel ID from environment variables
3. THE Config_Manager SHALL read YouTube API key from environment variables
4. IF the YouTube channel ID is not configured, THEN THE Portfolio_System SHALL display an error state indicating missing configuration
5. IF the YouTube API key is not configured, THEN THE Portfolio_System SHALL display an error state indicating missing configuration
6. THE Config_Manager SHALL support configuration of multiple channel IDs as a comma-separated list
7. THE Config_Manager SHALL validate and normalize all configuration values

### Requirement 5: Display Channel Statistics

**User Story:** As a portfolio visitor, I want to see YouTube channel statistics, so that I can understand the reach and engagement of the content creator.

#### Acceptance Criteria

1. WHEN channel data is displayed, THE Portfolio_System SHALL show subscriber count
2. WHEN channel data is displayed, THE Portfolio_System SHALL show total view count
3. WHEN channel data is displayed, THE Portfolio_System SHALL show total video count
4. WHEN channel data is displayed, THE Portfolio_System SHALL show channel name and handle
5. THE YouTube_Integration SHALL use formatLargeNumber from Shared_Utilities to format subscriber, view, and video counts
6. WHEN formatLargeNumber receives a number less than 1000, THE Formatter SHALL return the number as a string without suffix
7. WHEN formatLargeNumber receives a number greater than or equal to 1000000, THE Formatter SHALL return the number with M suffix and at most one decimal place
8. WHEN formatLargeNumber receives a number between 1000 and 999999, THE Formatter SHALL return the number with k suffix and at most one decimal place

### Requirement 6: Fetch Recent Video Metrics

**User Story:** As a portfolio owner, I want to display metrics from my recent videos, so that visitors can see my latest content performance.

#### Acceptance Criteria

1. WHEN video metrics are requested, THE YouTube_API_Client SHALL fetch the most recent videos from the channel
2. THE YouTube_API_Client SHALL retrieve video title, thumbnail URL, view count, and video URL for each video
3. THE Portfolio_System SHALL display up to 5 most recent videos
4. WHEN video data is displayed, THE Portfolio_System SHALL show view count for each video
5. THE Portfolio_System SHALL transform video data into the Video type format

### Requirement 7: Handle Missing or Invalid Channels

**User Story:** As a portfolio owner, I want the system to handle missing or invalid channel IDs gracefully, so that my portfolio doesn't break when channels are unavailable.

#### Acceptance Criteria

1. THE YouTube_Integration SHALL use error classes from Shared_Utilities (NotFoundError, AuthenticationError, ValidationError)
2. IF a specified channel ID is not found, THEN THE YouTube_Integration SHALL throw a NotFoundError
3. IF the API key is invalid, THEN THE YouTube_Integration SHALL throw an AuthenticationError
4. WHEN NotFoundError is caught, THE Portfolio_System SHALL display an error state indicating channel not found
5. WHEN AuthenticationError is caught, THE Portfolio_System SHALL display an error state indicating authentication failure
6. WHEN API calls fail, THE Portfolio_System SHALL display cached data if available
7. IF all data sources fail, THEN THE Portfolio_System SHALL display an error state with appropriate message

### Requirement 8: Support Internationalization

**User Story:** As a portfolio visitor, I want to see YouTube metrics labels in my preferred language, so that the content is accessible in multiple languages.

#### Acceptance Criteria

1. WHEN displaying channel statistics, THE Portfolio_System SHALL use translated labels from i18n files
2. THE Portfolio_System SHALL support English and Portuguese translations for all YouTube-related labels
3. WHEN displaying error messages, THE Portfolio_System SHALL use translated error messages
4. THE Portfolio_System SHALL format numbers according to the selected locale
5. THE Portfolio_System SHALL format subscriber counts with locale-appropriate number formatting

### Requirement 9: Maintain Type Safety

**User Story:** As a developer, I want TypeScript types for all YouTube data structures, so that the codebase remains type-safe and maintainable.

#### Acceptance Criteria

1. THE Portfolio_System SHALL define TypeScript interfaces for all YouTube API response types
2. THE Portfolio_System SHALL define TypeScript types for configuration options
3. THE YouTube_API_Client SHALL use typed functions with explicit return types
4. THE Portfolio_System SHALL validate API responses match expected types before processing
5. THE Portfolio_System SHALL extend existing YouTubeChannel and Video interfaces as needed

### Requirement 10: Parse YouTube API Responses

**User Story:** As a developer, I want to reliably parse YouTube API responses, so that the application correctly processes channel and video data.

#### Acceptance Criteria

1. WHEN a YouTube API response is received, THE YouTube_API_Client SHALL parse the JSON response into typed objects
2. THE YouTube_API_Client SHALL extract subscriber count from the statistics object in the API response
3. THE YouTube_API_Client SHALL extract view count and video count from the statistics object
4. IF the API response is malformed, THEN THE Error_Handler SHALL log the error and return a descriptive error message
5. FOR ALL valid API responses, parsing the response then formatting it for display then parsing again SHALL produce equivalent data (round-trip property)

### Requirement 11: Use Shared API Utilities

**User Story:** As a developer, I want the YouTube integration to use shared utilities, so that the codebase is DRY and maintainable.

#### Acceptance Criteria

1. THE YouTube_Integration SHALL import error classes (ApiError, NetworkError, AuthenticationError, RateLimitError, NotFoundError, ValidationError) from Shared_Utilities
2. THE YouTube_Integration SHALL import formatting functions (formatLargeNumber, formatDate, formatNumber) from Shared_Utilities
3. THE YouTube_Integration SHALL import RateLimitHandler from Shared_Utilities
4. THE YouTube_Integration SHALL import configuration utilities (createConfigReader, validateConfig, isConfigured) from Shared_Utilities
5. THE YouTube_Integration SHALL only contain integration-specific code in lib/youtube/ directory
6. THE YouTube_Integration SHALL use handleApiError from Shared_Utilities to classify HTTP errors
7. THE YouTube_Integration SHALL use type guard functions (isRateLimitError, isNotFoundError, isAuthenticationError) from Shared_Utilities

### Requirement 12: Organize YouTube Integration Directory Structure

**User Story:** As a developer, I want a clear directory structure for the YouTube integration, so that I can easily find and maintain integration-specific code.

#### Acceptance Criteria

1. THE system SHALL create a lib/youtube/ directory for YouTube_Integration code
2. THE lib/youtube/ directory SHALL contain client.ts for YouTube API HTTP client
3. THE lib/youtube/ directory SHALL contain service.ts for business logic and orchestration
4. THE lib/youtube/ directory SHALL contain transformer.ts for transforming API responses to application types
5. THE lib/youtube/ directory SHALL contain types.ts for YouTube-specific type definitions
6. THE lib/youtube/ directory SHALL contain index.ts that exports public functions
7. THE YouTube_Integration SHALL import all shared utilities from lib/api/

### Requirement 13: Handle YouTube-Specific Rate Limits

**User Story:** As a developer, I want to track YouTube API quota usage, so that I can monitor and manage API consumption.

#### Acceptance Criteria

1. THE YouTube_Integration SHALL configure Rate_Limit_Handler with YouTube-specific quota limits
2. THE YouTube_Integration SHALL update Rate_Limit_Handler after each API request
3. WHEN YouTube API returns quota information in response headers, THE Rate_Limit_Handler SHALL extract it using updateFromHeaders
4. WHEN YouTube API returns quota errors, THE Rate_Limit_Handler SHALL update state using updateFromApi
5. THE YouTube_Integration SHALL call checkLimit before making API requests
6. WHEN checkLimit returns canMakeRequest as false, THE YouTube_Integration SHALL return cached data without making a request
7. THE YouTube_Integration SHALL provide YouTube-specific header names to Rate_Limit_Handler configuration

### Requirement 14: Display Error States

**User Story:** As a portfolio visitor, I want to see clear error messages when YouTube data cannot be loaded, so that I understand why content is unavailable.

#### Acceptance Criteria

1. WHEN YouTube data cannot be loaded, THE Portfolio_System SHALL display an error state component
2. THE error state component SHALL display a descriptive message based on the error type
3. WHEN configuration is missing, THE error state SHALL display "YouTube integration not configured"
4. WHEN quota is exceeded and no cache exists, THE error state SHALL display "YouTube API quota limit reached. Please try again later."
5. WHEN authentication fails, THE error state SHALL display "Unable to authenticate with YouTube API"
6. WHEN a channel is not found, THE error state SHALL display "YouTube channel not found"
7. WHEN a network error occurs and no cache exists, THE error state SHALL display "Unable to load YouTube data. Please try again later."
8. THE error state component SHALL be visually consistent with the portfolio design
