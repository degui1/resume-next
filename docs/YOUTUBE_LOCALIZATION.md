# YouTube API Localization

This document explains how YouTube API localization works in the application.

## Overview

The YouTube Data API v3 supports localization through the `hl` (language) parameter. When provided, YouTube will return localized metadata for videos and channels where available.

## How It Works

### 1. API Client Configuration

The `YouTubeClient` accepts an optional `locale` parameter in its configuration:

```typescript
const client = new YouTubeClient({
  apiKey: 'YOUR_API_KEY',
  revalidate: 3600,
  locale: 'pt' // Optional: 'en', 'pt', 'es', etc.
});
```

### 2. API Requests

When a locale is provided, the client adds the `hl` parameter to all YouTube API requests:

- Channel requests: `/channels?hl=pt`
- Video search: `/search?hl=pt`
- Video details: `/videos?hl=pt`

### 3. Server Actions

The server actions accept an optional locale parameter:

```typescript
// Fetch videos in Portuguese
const videos = await getYouTubeVideos(5, 'pt');

// Fetch channels in English
const channels = await getYouTubeChannels('en');
```

### 4. Component Integration

The locale is automatically passed from the page to components:

```typescript
// In app/[lang]/page.tsx
<YouTubeSection 
  contentTopics={contentTopics} 
  dict={dict} 
  locale={lang} // 'en' or 'pt'
/>
```

## Supported Locales

The YouTube API supports many language codes including:

- `en` - English
- `pt` - Portuguese
- `es` - Spanish
- `fr` - French
- `de` - German
- `ja` - Japanese
- And many more...

## What Gets Localized

When available, YouTube will return localized versions of:

- Video titles
- Video descriptions
- Channel names
- Channel descriptions

**Note:** Not all content has localized versions. If a localized version is not available, YouTube returns the original content.

## Implementation Details

### Files Modified

1. `lib/youtube/types.ts` - Added `locale` to `YouTubeClientConfig`
2. `lib/youtube/client.ts` - Added locale support to API requests
3. `app/actions/youtube.ts` - Added locale parameter to server actions
4. `components/home/YouTubeSection.tsx` - Pass locale to API calls
5. `components/home/YouTubeChannelInfo.tsx` - Pass locale to API calls
6. `app/[lang]/page.tsx` - Pass current language to YouTube components

## Testing

To test localization:

1. Switch between English (`/en`) and Portuguese (`/pt`) routes
2. Observe that video titles and descriptions may change based on available localizations
3. Check the Network tab to verify the `hl` parameter is being sent

## Limitations

- Localization depends on content creators providing translations
- Not all videos/channels have localized metadata
- The API returns the original content if no localization is available
