# YouTube API Integration

This module provides YouTube-specific utilities for integrating with the YouTube Data API v3, built on top of the shared API utilities in `@/lib/api`.

## Features

- **Error Handling**: YouTube-specific error messages and error classification
- **Rate Limiting**: Quota tracking with YouTube's quota system
- **Configuration**: Environment variable management for YouTube API settings
- **Type Safety**: Full TypeScript support with type definitions

## Setup

### 1. Environment Variables

Create a `.env.local` file with your YouTube API configuration:

```env
# Required
YOUTUBE_API_KEY=your_youtube_api_key_here

# Optional
YOUTUBE_CHANNEL_ID=your_default_channel_id
YOUTUBE_REVALIDATE=3600
YOUTUBE_MAX_RESULTS=10
YOUTUBE_FALLBACK_TO_MOCK=true
YOUTUBE_VIDEOS=video_id_1,video_id_2,video_id_3
```

### 2. Get a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key to your `.env.local` file

## Usage

### Basic Configuration

```typescript
import { getYouTubeConfig, isYouTubeConfigured } from '@/lib/youtube';

const config = getYouTubeConfig();

if (isYouTubeConfigured(config)) {
  console.log('YouTube API is ready');
  console.log('API Key:', config.apiKey);
  console.log('Max Results:', config.maxResults);
} else {
  console.log('YouTube API key is missing');
}
```

### Error Handling

```typescript
import { handleYouTubeError, isRateLimitError, isAuthenticationError } from '@/lib/youtube';

async function fetchYouTubeData() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw handleYouTubeError(error);
    }
    
    return await response.json();
  } catch (error) {
    const apiError = handleYouTubeError(error);
    
    if (isRateLimitError(apiError)) {
      console.log('Quota exceeded:', apiError.message);
      // Use cached data or show error to user
    } else if (isAuthenticationError(apiError)) {
      console.log('Invalid API key:', apiError.message);
      // Prompt user to check API key
    } else {
      console.log('Error:', apiError.message);
    }
    
    throw apiError;
  }
}
```

### Rate Limiting

YouTube API uses a quota system where different operations consume different amounts of quota units.

```typescript
import { 
  youtubeRateLimitHandler, 
  YOUTUBE_OPERATION_COSTS,
  type RateLimitInfo 
} from '@/lib/youtube';

async function fetchWithQuotaTracking() {
  // Check if we have quota available
  const info: RateLimitInfo = youtubeRateLimitHandler.checkLimit();
  
  if (!info.canMakeRequest) {
    console.log(`Quota exhausted. Resets at ${info.resetAt}`);
    console.log(`Retry after ${info.retryAfter} seconds`);
    return null;
  }
  
  // Make API request
  const response = await fetch('https://www.googleapis.com/youtube/v3/channels?...');
  const data = await response.json();
  
  // Update quota after request
  const state = youtubeRateLimitHandler.getState();
  if (state) {
    const operationCost = YOUTUBE_OPERATION_COSTS.CHANNELS_LIST; // 1 unit
    
    youtubeRateLimitHandler.updateFromApi({
      limit: state.limit,
      remaining: state.remaining - operationCost,
      used: state.used + operationCost,
      reset: state.reset.getTime() / 1000,
    });
  }
  
  return data;
}
```

### Complete Example

```typescript
import {
  getYouTubeConfig,
  isYouTubeConfigured,
  handleYouTubeError,
  youtubeRateLimitHandler,
  YOUTUBE_OPERATION_COSTS,
  isRateLimitError,
  formatLargeNumber,
  formatDate,
} from '@/lib/youtube';

export async function getChannelInfo(channelId: string) {
  const config = getYouTubeConfig();
  
  if (!isYouTubeConfigured(config)) {
    throw new Error('YouTube API is not configured');
  }
  
  // Check quota
  const quotaInfo = youtubeRateLimitHandler.checkLimit();
  if (!quotaInfo.canMakeRequest) {
    console.log('Using cached data due to quota limits');
    return getCachedChannelInfo(channelId);
  }
  
  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/channels');
    url.searchParams.set('part', 'snippet,statistics');
    url.searchParams.set('id', channelId);
    url.searchParams.set('key', config.apiKey);
    
    const response = await fetch(url.toString(), {
      next: { revalidate: config.revalidate },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw handleYouTubeError(error);
    }
    
    const data = await response.json();
    
    // Update quota
    const state = youtubeRateLimitHandler.getState();
    if (state) {
      youtubeRateLimitHandler.updateFromApi({
        ...state,
        remaining: state.remaining - YOUTUBE_OPERATION_COSTS.CHANNELS_LIST,
        used: state.used + YOUTUBE_OPERATION_COSTS.CHANNELS_LIST,
        reset: state.reset.getTime() / 1000,
      });
    }
    
    // Format data
    const channel = data.items[0];
    return {
      title: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: formatLargeNumber(parseInt(channel.statistics.subscriberCount)),
      videoCount: formatLargeNumber(parseInt(channel.statistics.videoCount)),
      publishedAt: formatDate(channel.snippet.publishedAt, 'en'),
    };
  } catch (error) {
    const apiError = handleYouTubeError(error);
    
    if (isRateLimitError(apiError)) {
      console.log('Quota exceeded, using cached data');
      return getCachedChannelInfo(channelId);
    }
    
    throw apiError;
  }
}
```

## YouTube API Quota Costs

Different operations consume different amounts of quota:

| Operation | Cost | Description |
|-----------|------|-------------|
| `channels.list` | 1 | Fetch channel information |
| `videos.list` | 1 | Fetch video information |
| `playlists.list` | 1 | Fetch playlist information |
| `search.list` | 100 | Search for videos/channels |
| `videos.insert` | 1600 | Upload a video |
| `videos.update` | 50 | Update video metadata |
| `videos.delete` | 50 | Delete a video |

Default daily quota: 10,000 units

## API Reference

### Configuration

- `getYouTubeConfig()`: Get YouTube configuration from environment variables
- `validateYouTubeConfig(config)`: Validate and normalize configuration
- `isYouTubeConfigured(config)`: Check if API key is present

### Error Handling

- `handleYouTubeError(error)`: Convert errors to typed ApiError instances
- `YOUTUBE_ERROR_MESSAGES`: YouTube-specific error messages
- `isRateLimitError(error)`: Check if error is a rate limit error
- `isAuthenticationError(error)`: Check if error is an authentication error
- `isNotFoundError(error)`: Check if error is a not found error

### Rate Limiting

- `youtubeRateLimitHandler`: Rate limit handler instance
- `YOUTUBE_OPERATION_COSTS`: Quota costs for different operations

### Formatting

- `formatLargeNumber(value)`: Format numbers with k/M suffixes
- `formatDate(date, locale)`: Format dates according to locale
- `formatNumber(value, locale)`: Format numbers according to locale

## Resources

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [YouTube API Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [Google Cloud Console](https://console.cloud.google.com/)
