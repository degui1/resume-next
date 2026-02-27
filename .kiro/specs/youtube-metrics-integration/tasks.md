# Implementation Plan: YouTube Metrics Integration

## Overview

This implementation plan creates a YouTube Data API v3 integration following the established GitHub integration pattern. The implementation will be done incrementally, building from core types and configuration through API client, service layer, error handling, and finally server actions. Each step validates functionality before moving forward.

## Tasks

- [ ] 1. Set up project structure and core types
  - Create `lib/youtube/` directory structure
  - Define TypeScript interfaces for YouTube API responses (YouTubeApiChannel, YouTubeApiVideo, YouTubeApiSearchResponse)
  - Define application types (YouTubeChannel extension, Video extension)
  - Define configuration types (YouTubeConfig, YouTubeClientConfig, YouTubeServiceConfig)
  - Define error types (YouTubeError) and quota types (QuotaInfo, YouTubeQuotaInfo)
  - Create `lib/youtube/types.ts` with all type definitions
  - Create `lib/youtube/index.ts` for public API exports
  - _Requirements: 9.1, 9.2, 9.3, 9.5_

- [ ] 2. Implement configuration module
  - [ ] 2.1 Create configuration loader
    - Implement `getYouTubeConfig()` to read from environment variables (YOUTUBE_API_KEY, YOUTUBE_CHANNEL_IDS, YOUTUBE_REVALIDATE)
    - Implement `validateConfig()` to validate and normalize configuration
    - Implement `isConfigured()` to check if YouTube integration is enabled
    - Parse comma-separated channel IDs into array
    - Create `lib/youtube/config.ts`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ]* 2.2 Write property test for channel ID list parsing
    - **Property 6: Channel ID List Parsing**
    - **Validates: Requirements 4.5**
    - Test that any comma-separated string produces array of trimmed, non-empty channel IDs

- [ ] 3. Implement error handling utilities
  - [ ] 3.1 Create error handling module
    - Implement `YouTubeError` class with statusCode, quotaInfo, and error type flags
    - Implement `handleYouTubeError()` to convert unknown errors to YouTubeError
    - Implement `isQuotaError()` to detect quota exceeded errors
    - Implement `isNotFoundError()` to detect 404 errors
    - Implement `isAuthError()` to detect authentication errors
    - Create `lib/youtube/errors.ts`
    - _Requirements: 1.4, 2.2, 7.1, 7.2, 7.4_
  
  - [ ]* 3.2 Write property test for error handling
    - **Property 4: Error Handling Produces Descriptive Messages**
    - **Validates: Requirements 1.4, 10.4**
    - Test that any YouTube API error response produces YouTubeError with descriptive message and correct classification

- [ ] 4. Implement number formatters
  - [ ] 4.1 Create formatting utilities
    - Implement `formatNumber()` to format numbers with K/M/B suffixes
    - Implement `formatSubscribers()` for subscriber count formatting
    - Implement `formatViews()` for view count formatting
    - Support locale parameter for internationalization
    - Create `lib/youtube/formatters.ts`
    - _Requirements: 5.5, 8.4, 8.5_
  
  - [ ]* 4.2 Write property test for number formatting
    - **Property 7: Number Formatting with Suffixes**
    - **Validates: Requirements 5.5**
    - Test that any positive integer produces string with appropriate suffix and at most one decimal place
  
  - [ ]* 4.3 Write property test for locale-aware formatting
    - **Property 9: Locale-Aware Number Formatting**
    - **Validates: Requirements 8.4, 8.5**
    - Test that any number and valid locale produces locale-appropriate formatting

- [ ] 5. Implement data transformers
  - [ ] 5.1 Create transformation functions
    - Implement `transformChannel()` to convert YouTubeApiChannel to YouTubeChannel
    - Implement `transformVideos()` to convert YouTubeApiVideo[] to Video[]
    - Implement `transformChannels()` for multiple channels
    - Extract all required fields (id, name, handle, subscribers, url, viewCount, videoCount, thumbnailUrl)
    - Use formatters for subscriber and view counts
    - Create `lib/youtube/transformer.ts`
    - _Requirements: 1.2, 1.3, 5.1, 5.2, 5.3, 5.4, 6.2, 6.4, 6.5, 10.2, 10.3_
  
  - [ ]* 5.2 Write property test for channel data completeness
    - **Property 1: Channel Data Completeness**
    - **Validates: Requirements 1.2, 5.1, 5.2, 5.3, 5.4, 10.2, 10.3**
    - Test that any valid YouTube API channel response produces YouTubeChannel with all required fields
  
  - [ ]* 5.3 Write property test for video data completeness
    - **Property 2: Video Data Completeness**
    - **Validates: Requirements 6.2, 6.4, 6.5**
    - Test that any valid YouTube API video response produces Video with all required fields
  
  - [ ]* 5.4 Write property test for data transformation round-trip
    - **Property 12: Data Transformation Round-Trip**
    - **Validates: Requirements 1.3, 10.5**
    - Test that serializing YouTubeChannel to API format then parsing back produces equivalent object

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement rate limit handler
  - [ ] 7.1 Create quota tracking module
    - Implement `RateLimitHandler` class with quota state management
    - Implement `checkQuota()` to determine if requests can be made
    - Implement `updateFromApi()` to update quota state from API responses
    - Implement `recordUsage()` to track quota consumption
    - Calculate time until quota reset
    - Create `lib/youtube/rate-limit.ts`
    - _Requirements: 2.1, 2.3_
  
  - [ ]* 7.2 Write unit tests for rate limit handler
    - Test quota checking logic
    - Test quota state updates
    - Test usage recording
    - Test reset time calculations

- [ ] 8. Implement YouTube API client
  - [ ] 8.1 Create low-level API client
    - Implement `YouTubeClient` class with configuration
    - Implement `fetchChannel()` to fetch channel statistics from YouTube Data API v3
    - Implement `fetchChannelVideos()` to fetch recent videos (search + video details)
    - Implement `getQuotaInfo()` to extract quota information from responses
    - Use Next.js fetch with revalidate option (default 3600 seconds)
    - Include API key in all requests
    - Parse JSON responses into typed objects
    - Handle HTTP errors and convert to YouTubeError
    - Limit video results to maxResults parameter
    - Create `lib/youtube/client.ts`
    - _Requirements: 1.1, 1.2, 1.5, 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 6.3, 10.1_
  
  - [ ]* 8.2 Write property test for API key authentication
    - **Property 3: API Key Authentication**
    - **Validates: Requirements 1.5**
    - Test that any API request includes API key in query parameters
  
  - [ ]* 8.3 Write property test for video result limiting
    - **Property 8: Video Result Limiting**
    - **Validates: Requirements 6.3**
    - Test that fetching videos from channel with N > 5 videos returns exactly 5 videos
  
  - [ ]* 8.4 Write property test for API response validation
    - **Property 10: API Response Type Validation**
    - **Validates: Requirements 9.4**
    - Test that invalid API responses are rejected with descriptive error
  
  - [ ]* 8.5 Write property test for JSON parsing
    - **Property 11: JSON Parsing Correctness**
    - **Validates: Requirements 10.1**
    - Test that any valid YouTube API JSON response produces typed object that can be transformed

- [ ] 9. Implement YouTube service layer
  - [ ] 9.1 Create high-level service orchestration
    - Implement `YouTubeService` class with client and rate limit handler
    - Implement `getChannelMetrics()` with fallback chain (API → cache → mock)
    - Implement `getRecentVideos()` with fallback chain
    - Implement `getQuotaStatus()` to expose quota information
    - Check quota limits before making requests
    - Handle quota exceeded errors by returning cached data
    - Handle authentication errors by falling back to mock data
    - Handle not found errors by logging warning and using mock data
    - Apply channel ID filters from configuration
    - Transform API responses using transformer functions
    - Return result objects with data, source, quotaInfo, and error fields
    - Create `lib/youtube/service.ts`
    - _Requirements: 2.1, 2.2, 2.4, 4.3, 4.4, 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 9.2 Write property test for system resilience
    - **Property 5: System Resilience with Fallback Data**
    - **Validates: Requirements 2.4, 7.3, 7.5**
    - Test that any API failure returns fallback data without throwing unhandled exceptions
  
  - [ ]* 9.3 Write unit tests for service layer
    - Test fallback chain execution
    - Test quota exceeded handling
    - Test authentication error handling
    - Test not found error handling
    - Test multiple channel ID handling
    - Test mock data fallback when not configured

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement server actions
  - [ ] 11.1 Create Next.js server actions
    - Create `getYouTubeChannels()` server action to fetch channel metrics
    - Create `getYouTubeVideos()` server action to fetch recent videos
    - Create `getYouTubeQuotaStatus()` server action to get quota status
    - Initialize YouTubeService with configuration
    - Handle errors and return appropriate result objects
    - Add 'use server' directive
    - Create `app/actions/youtube.ts`
    - _Requirements: 1.1, 6.1_
  
  - [ ]* 11.2 Write integration tests for server actions
    - Test server actions return correct data structure
    - Test error handling in server actions
    - Test fallback behavior through server actions

- [ ] 12. Update existing components to use YouTube integration
  - [ ] 12.1 Update YouTubeChannelInfo component
    - Import server actions from `app/actions/youtube`
    - Call `getYouTubeChannels()` to fetch channel data
    - Display channel statistics (subscribers, views, videos)
    - Display channel name and handle
    - Format numbers using locale-aware formatting
    - Handle loading and error states
    - Display fallback message when using mock data
    - Update `components/home/YouTubeChannelInfo.tsx`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 12.2 Write component tests for YouTubeChannelInfo
    - Test component renders channel data correctly
    - Test component handles loading state
    - Test component handles error state
    - Test component displays fallback message

- [ ] 13. Add internationalization support
  - [ ] 13.1 Add translation keys for YouTube labels
    - Add English translations for YouTube-related labels (subscribers, views, videos, channel)
    - Add Portuguese translations for YouTube-related labels
    - Add error message translations (quota exceeded, auth failed, not found)
    - Update i18n files in appropriate locations
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ]* 13.2 Test internationalization
    - Test English translations display correctly
    - Test Portuguese translations display correctly
    - Test error messages use translated text

- [ ] 14. Add environment variable documentation
  - Update `.env.example` or documentation with YouTube environment variables
  - Document YOUTUBE_API_KEY configuration
  - Document YOUTUBE_CHANNEL_IDS configuration (comma-separated)
  - Document YOUTUBE_REVALIDATE configuration (optional)
  - Provide example values
  - _Requirements: 4.1, 4.2, 4.5_

- [ ] 15. Final checkpoint - Ensure all tests pass
  - Run all tests to ensure complete integration works
  - Verify YouTube data displays correctly in the UI
  - Verify fallback behavior works when API is unavailable
  - Verify quota exceeded handling works correctly
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation follows the established GitHub integration pattern in `lib/github/`
- Property-based tests use `fast-check` library with minimum 100 iterations
- All tests are tagged with property numbers for traceability
- Checkpoints ensure incremental validation throughout implementation
- The fallback chain (API → cache → mock) ensures the portfolio remains functional
- Next.js fetch caching is leveraged for automatic cache management
