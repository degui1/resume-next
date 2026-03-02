# Implementation Plan: YouTube Metrics Integration

## Overview

This implementation plan creates a YouTube Data API v3 integration that leverages shared API utilities from lib/api/ (error handling, formatting, rate limiting, configuration). The YouTube-specific code is isolated in lib/youtube/ and focuses on API client, service orchestration, and data transformation. The implementation includes an error state component for graceful error handling without mock data fallback.

## Tasks

- [x] 1. Set up YouTube-specific project structure and types
  - Create `lib/youtube/` directory structure
  - Define TypeScript interfaces for YouTube API responses (YouTubeApiChannel, YouTubeApiVideo, YouTubeApiSearchResponse)
  - Define YouTube-specific configuration types (YouTubeConfig, YouTubeClientConfig)
  - Create `lib/youtube/types.ts` with YouTube-specific type definitions
  - Create `lib/youtube/index.ts` for public API exports
  - _Requirements: 9.1, 9.2, 9.5, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [-] 2. Implement YouTube configuration module
  - [x] 2.1 Create YouTube configuration loader using shared utilities
    - Import createConfigReader, validateConfig, isConfigured from lib/api/config
    - Implement `getYouTubeConfig()` to read YOUTUBE_API_KEY, YOUTUBE_CHANNEL_IDS, YOUTUBE_REVALIDATE
    - Parse comma-separated channel IDs into array with trimming
    - Validate and normalize configuration values
    - Create `lib/youtube/config.ts`
    - _Requirements: 4.1, 4.2, 4.3, 4.6, 4.7, 11.1, 11.2_
  
  - [ ]* 2.2 Write property test for channel ID list parsing
    - **Property 4: Channel ID List Parsing**
    - **Validates: Requirements 4.6**
    - Test that any comma-separated string produces array of trimmed, non-empty channel IDs

- [x] 3. Implement data transformers
  - [x] 3.1 Create transformation functions using shared formatters
    - Import formatLargeNumber from lib/api/formatters
    - Implement `transformChannel()` to convert YouTubeApiChannel to YouTubeChannel
    - Implement `transformVideos()` to convert YouTubeApiVideo[] to Video[]
    - Implement `transformChannels()` for multiple channels
    - Extract all required fields (id, name, handle, subscribers, url, viewCount, videoCount, thumbnailUrl)
    - Use formatLargeNumber for subscriber, view, and video counts
    - Create `lib/youtube/transformer.ts`
    - _Requirements: 1.2, 1.3, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 6.2, 6.4, 6.5, 10.2, 10.3, 11.3_
  
  - [ ]* 3.2 Write property test for channel data completeness
    - **Property 1: Channel Data Completeness**
    - **Validates: Requirements 1.2, 5.1, 5.2, 5.3, 5.4**
    - Test that any valid YouTube API channel response produces YouTubeChannel with all required fields
  
  - [ ]* 3.3 Write property test for video data completeness
    - **Property 2: Video Data Completeness**
    - **Validates: Requirements 6.2, 6.4, 6.5**
    - Test that any valid YouTube API video response produces Video with all required fields
  
  - [ ]* 3.4 Write property test for number formatting with suffixes
    - **Property 3: Number Formatting with Suffixes**
    - **Validates: Requirements 5.6, 5.7, 5.8**
    - Test that formatLargeNumber produces correct K/M/B suffixes with at most one decimal place
  
  - [ ]* 3.5 Write property test for data transformation round-trip
    - **Property 5: Data Transformation Round-Trip**
    - **Validates: Requirements 1.3, 10.5**
    - Test that serializing YouTubeChannel to API format then parsing back produces equivalent object

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement YouTube API client
  - [x] 5.1 Create low-level API client with shared error handling
    - Import handleApiError, NetworkError, AuthenticationError, RateLimitError, NotFoundError from lib/api/errors
    - Implement `YouTubeClient` class with configuration
    - Implement `fetchChannel()` to fetch channel statistics from YouTube Data API v3
    - Implement `fetchChannelVideos()` to fetch recent videos (search + video details)
    - Use Next.js fetch with revalidate option (default 3600 seconds)
    - Include API key in all requests
    - Parse JSON responses into typed objects
    - Use handleApiError to classify HTTP errors into appropriate error types
    - Throw NetworkError, AuthenticationError, RateLimitError, or NotFoundError based on classification
    - Create `lib/youtube/client.ts`
    - _Requirements: 1.1, 1.2, 1.4, 1.5, 1.6, 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 6.3, 10.1, 11.6, 11.7, 12.2, 12.7_

- [x] 6. Implement YouTube service layer
  - [x] 6.1 Create high-level service orchestration with shared utilities
    - Import RateLimitHandler from lib/api/rate-limit
    - Import error type guards (isRateLimitError, isNotFoundError, isAuthenticationError) from lib/api/errors
    - Implement `YouTubeService` class with client, rate limit handler, and config
    - Implement `getChannelMetrics()` with error handling and cache fallback
    - Implement `getRecentVideos()` with error handling and cache fallback
    - Implement `getQuotaStatus()` to expose quota information
    - Check rate limits before making requests using RateLimitHandler.checkLimit()
    - Update rate limit state after requests using RateLimitHandler.updateFromApi()
    - Handle RateLimitError by returning cached data or error result
    - Handle AuthenticationError by returning error result
    - Handle NotFoundError by returning error result
    - Handle NetworkError by returning cached data or error result
    - Return result objects with data, source ('api' | 'cache' | 'error'), quotaInfo, and error fields
    - Transform API responses using transformer functions
    - Create `lib/youtube/service.ts`
    - _Requirements: 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 4.4, 4.5, 7.1, 7.2, 7.3, 7.4, 7.6, 7.7, 11.1, 11.4, 11.5, 11.7, 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

- [x] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement error state component
  - [x] 8.1 Create YouTubeErrorState component
    - Create React component that accepts errorType and message props
    - Support error types: 'quota', 'auth', 'not_found', 'network', 'config'
    - Display appropriate error message based on error type
    - Use portfolio design system for consistent styling
    - Include clear, user-friendly messaging
    - Create `components/youtube/YouTubeErrorState.tsx`
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8_
  
  - [ ]* 8.2 Write component tests for error state
    - Test error state renders with quota error
    - Test error state renders with auth error
    - Test error state renders with not_found error
    - Test error state renders with network error
    - Test error state renders with config error
    - Test error messages are user-friendly and descriptive

- [x] 9. Implement server actions
  - [x] 9.1 Create Next.js server actions
    - Create `getYouTubeChannels()` server action to fetch channel metrics
    - Create `getYouTubeVideos()` server action to fetch recent videos
    - Create `getYouTubeQuotaStatus()` server action to get quota status
    - Initialize YouTubeService with configuration and shared utilities
    - Handle errors and return appropriate result objects
    - Add 'use server' directive
    - Create `app/actions/youtube.ts`
    - _Requirements: 1.1, 6.1_

- [x] 10. Update existing components to use YouTube integration
  - [x] 10.1 Update YouTubeChannelInfo component
    - Import server actions from `app/actions/youtube`
    - Import YouTubeErrorState component
    - Call `getYouTubeChannels()` to fetch channel data
    - Display channel statistics (subscribers, views, videos) when data available
    - Display channel name and handle
    - Handle loading state
    - Display YouTubeErrorState component when error occurs
    - Pass error type and message to error state component
    - Update `components/home/YouTubeChannelInfo.tsx`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 14.1, 14.2_
  
  - [ ]* 10.2 Write component tests for YouTubeChannelInfo
    - Test component renders channel data correctly
    - Test component handles loading state
    - Test component displays error state for quota error
    - Test component displays error state for auth error
    - Test component displays error state for network error
    - Test component displays error state for config error
    - Test number formatting displays correctly (subscribers, views, videos)

- [x] 11. Add internationalization support
  - [x] 11.1 Add translation keys for YouTube labels and errors
    - Add English translations for YouTube-related labels (subscribers, views, videos, channel)
    - Add Portuguese translations for YouTube-related labels
    - Add English error message translations (quota exceeded, auth failed, not found, network error, config missing)
    - Add Portuguese error message translations
    - Update i18n files in appropriate locations
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ]* 11.2 Test internationalization
    - Test English translations display correctly
    - Test Portuguese translations display correctly
    - Test error messages use translated text in both languages

- [x] 12. Add environment variable documentation
  - Update `.env.example` or documentation with YouTube environment variables
  - Document YOUTUBE_API_KEY configuration
  - Document YOUTUBE_CHANNEL_IDS configuration (comma-separated)
  - Document YOUTUBE_REVALIDATE configuration (optional, default 3600)
  - Provide example values
  - _Requirements: 4.1, 4.2, 4.6_

- [x] 13. Write E2E tests for API integration and infrastructure
  - [ ]* 13.1 Write E2E test for successful channel data fetch
    - Mock YouTube API at network level
    - Test full flow: API request → caching → data display
    - Verify channel data displays correctly in UI
    - _Requirements: 1.1, 1.2, 3.1, 3.2, 3.3, 3.4_
  
  - [ ]* 13.2 Write E2E test for quota exceeded with cache
    - Mock quota exceeded response
    - Verify cached data is displayed
    - Verify no error state is shown when cache available
    - _Requirements: 2.2, 2.3_
  
  - [ ]* 13.3 Write E2E test for quota exceeded without cache
    - Mock quota exceeded response with no cache
    - Verify error state component displays quota error message
    - _Requirements: 2.4, 14.4_
  
  - [ ]* 13.4 Write E2E test for authentication error
    - Mock authentication failure response
    - Verify error state component displays auth error message
    - _Requirements: 7.4, 14.5_
  
  - [ ]* 13.5 Write E2E test for channel not found
    - Mock 404 response
    - Verify error state component displays not found message
    - _Requirements: 7.2, 7.3, 14.6_
  
  - [ ]* 13.6 Write E2E test for network error with cache
    - Mock network failure with cache available
    - Verify cached data is displayed
    - _Requirements: 7.6_
  
  - [ ]* 13.7 Write E2E test for network error without cache
    - Mock network failure with no cache
    - Verify error state component displays network error message
    - _Requirements: 7.7, 14.7_
  
  - [ ]* 13.8 Write E2E test for missing configuration
    - Test with missing YOUTUBE_API_KEY
    - Test with missing YOUTUBE_CHANNEL_IDS
    - Verify error state component displays config error message
    - _Requirements: 4.4, 4.5, 14.3_
  
  - [ ]* 13.9 Write E2E test for cache behavior
    - Test cache hits return cached data without API request
    - Test cache expiration triggers fresh API request
    - Test cache revalidation after 1 hour
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 13.10 Write E2E test for rate limiting
    - Test RateLimitHandler tracks quota state
    - Test checkLimit prevents requests when quota exceeded
    - Test updateFromApi updates quota state correctly
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [ ]* 13.11 Write E2E test for multiple channel IDs
    - Test configuration with multiple comma-separated channel IDs
    - Verify all channels are fetched and displayed
    - _Requirements: 4.6_

- [x] 14. Final checkpoint - Ensure all tests pass
  - Run all tests to ensure complete integration works
  - Verify YouTube data displays correctly in the UI
  - Verify error state component displays for all error types
  - Verify cache behavior works correctly
  - Verify rate limiting works correctly
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Shared utilities from lib/api/ are assumed to exist (from shared-api-utilities spec)
- YouTube-specific code is isolated in lib/youtube/ directory
- No mock data fallback - error state component displays when data unavailable
- Testing strategy: E2E for API/infrastructure, component tests for UI, property-based for transformation
- Property-based tests use `fast-check` library with minimum 100 iterations
- E2E tests use network-level mocking (Playwright or Cypress)
- Next.js fetch caching is leveraged for automatic cache management
- Checkpoints ensure incremental validation throughout implementation
