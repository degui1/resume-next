# API Error Handling Strategy

This document describes how external API errors are handled in the application.

## Philosophy

When external APIs (GitHub, YouTube) fail, we leverage Next.js built-in caching to provide the best user experience:

1. **Try API first** - Always attempt to fetch fresh data
2. **Fall back to cache** - Next.js automatically serves stale cache if API fails
3. **Show error only if no cache** - Error UI only appears when no cached data exists

This approach:
- **Maximizes availability** - Users see data even when APIs are down
- **Leverages platform features** - Uses Next.js caching automatically
- **Graceful degradation** - Stale data is better than no data
- **Clear error states** - When no cache exists, show helpful error messages

## Caching Behavior

Both APIs use Next.js `fetch` with `revalidate`:

```typescript
fetch(url, {
  next: { revalidate: 3600 } // Cache for 1 hour
})
```

### How It Works

1. **First request**: Fetches from API, caches response
2. **Subsequent requests (within 1 hour)**: Serves from cache
3. **After 1 hour**: Serves stale cache, revalidates in background
4. **On API error**: Next.js automatically serves stale cache if available

### User Experience

| Scenario | What User Sees | Source |
|----------|---------------|--------|
| API available | Fresh data | `'api'` |
| API error + cache exists | Cached data (may be stale) | `'api'` (transparent) |
| API error + no cache | Error message | `'error'` |

## Implementation Pattern

### Server Components (YouTube, GitHub)

Both YouTube and GitHub integrations follow this pattern:

```tsx
// Wrapper component with Suspense
export function DataSection() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <DataContent />
    </Suspense>
  );
}

// Async content component with error handling
async function DataContent() {
  try {
    const result = await getDataAction();
    
    // Handle API errors (only shown if no cache)
    if (result.error && result.data.length === 0) {
      return <ErrorUI message={result.error} />;
    }
    
    return <SuccessUI data={result.data} />;
  } catch (error) {
    return <ErrorUI message={error.message} />;
  }
}
```

### Service Layer

Services return a consistent result structure:

```typescript
interface FetchResult {
  data: T[];
  source: 'api' | 'cache' | 'fallback';
  error?: string;
  rateLimit?: RateLimitInfo;
}
```

When errors occur:
- `data` is an empty array `[]` (or cached data if Next.js serves from cache)
- `source` is `'fallback'` for errors, `'api'` for success or cache
- `error` contains a descriptive message

**Note**: We can't distinguish between fresh API data and cached data because Next.js handles caching transparently.

### Error Display

Each API integration has its own error component:

- `GitHubErrorState` - For GitHub API errors
- `YouTubeErrorState` - For YouTube API errors

These components:
- Automatically detect error type from message
- Show appropriate icons and colors
- Provide clear, actionable error messages
- **Only shown when no cached data is available**

## Error Types

### GitHub Errors

- **Configuration Missing**: `GITHUB_USERNAME` not set
- **Rate Limit**: API quota exceeded (cache served if available)
- **Authentication**: Invalid or missing token
- **Not Found**: Repository doesn't exist or is private
- **Network**: Connection or server errors (cache served if available)

### YouTube Errors

- **Configuration Missing**: `YOUTUBE_API_KEY` or `YOUTUBE_CHANNEL_IDS` not set
- **Quota Exceeded**: Daily API quota reached (cache served if available)
- **Authentication**: Invalid API key
- **Not Found**: Channel doesn't exist
- **Network**: Connection or server errors (cache served if available)

## Development vs Production

### Development Mode

- Source badges show where data came from (API, cache, fallback)
- Detailed error messages in console
- Cache may be disabled for faster development
- Error states are clearly visible

### Production Mode

- Source badges are hidden
- User-friendly error messages
- Full caching enabled
- Errors logged to monitoring service (if configured)
- Users see cached data when APIs fail

## Testing Error States

### Test with Cache (Stale Data Fallback)

1. Make successful request (populates cache)
2. Simulate API error:
   ```bash
   # Temporarily break API key
   GITHUB_USERNAME=invalid-user
   YOUTUBE_API_KEY=invalid-key
   ```
3. Refresh page
4. **Expected**: Cached data still shows, no error

### Test without Cache (Error UI)

1. Clear Next.js cache:
   ```bash
   rm -rf .next/cache
   ```
2. Use invalid configuration:
   ```bash
   GITHUB_USERNAME=
   YOUTUBE_API_KEY=
   ```
3. Start app and visit page
4. **Expected**: Error UI shows

### Test Fresh Data

1. Use valid configuration
2. Clear cache
3. **Expected**: Fresh data from API

## Best Practices

1. **Trust Next.js caching** - Don't duplicate cache logic
2. **Set appropriate revalidate times** - Balance freshness vs API usage
3. **Show cached data when possible** - Stale data is better than errors
4. **Handle errors gracefully** - Never let errors crash the page
5. **Provide clear error messages** - Help users understand what went wrong
6. **Log errors** - Track issues for debugging and monitoring
7. **Test cache scenarios** - Ensure stale cache works as expected

## Cache Configuration

Default revalidation time: 3600 seconds (1 hour)

```env
# .env
GITHUB_REVALIDATE=3600
YOUTUBE_REVALIDATE=3600
```

**Considerations**:
- **Shorter time** (300s): More fresh data, more API calls, higher quota usage
- **Longer time** (7200s): Less API calls, more stale data, lower quota usage
- **Balance**: 3600s (1 hour) provides good freshness with reasonable API usage

## Migration Notes

### Previous Behavior

- GitHub: Fell back to mock data on errors
- YouTube: Returned errors immediately

### Current Behavior

- Both: Return empty data + error message
- Next.js: Automatically serves stale cache on errors
- Users: See cached data or error, never mock data

### Why This Is Better

1. **No misleading data** - Cached data is real, just potentially stale
2. **Better availability** - Site works even when APIs are down
3. **Consistent behavior** - Both APIs work the same way
4. **Platform-native** - Leverages Next.js features
5. **Simpler code** - No manual cache management needed
