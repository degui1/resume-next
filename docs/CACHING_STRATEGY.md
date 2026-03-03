# API Caching Strategy

## Overview

Both GitHub and YouTube APIs use Next.js built-in caching with `stale-while-revalidate` behavior. This provides optimal user experience by showing cached data when APIs fail.

## Caching Behavior

### Next.js Fetch Cache

Both APIs use Next.js `fetch` with `revalidate` option:

```typescript
fetch(url, {
  next: { revalidate: 3600 } // Cache for 1 hour
})
```

This implements `stale-while-revalidate`:
1. **Fresh data** (within revalidate time): Served from cache instantly
2. **Stale data** (after revalidate time): Served from cache, revalidated in background
3. **No cache**: Fetches from API

### Error Handling with Cache

When API errors occur:

1. **Try API request first**
2. **If error occurs**:
   - Next.js automatically serves stale cache if available
   - If no cache exists, return error to user
3. **Cache is updated** only on successful responses

## Implementation

### Current Behavior

**GitHub API**:
- ✅ Uses Next.js cache (`revalidate: 3600`)
- ✅ Returns empty array + error on failure
- ⚠️ Doesn't explicitly handle stale cache fallback

**YouTube API**:
- ✅ Uses Next.js cache (`revalidate: 3600`)
- ✅ Returns error on failure
- ⚠️ Doesn't explicitly handle stale cache fallback

### Recommended Approach

**Option 1: Trust Next.js Cache (Current)**
- Let Next.js handle cache automatically
- On error, Next.js serves stale cache if available
- Simple, leverages platform features
- **Limitation**: Can't distinguish between fresh/stale data

**Option 2: Explicit Cache Management**
- Manually implement cache layer
- Explicitly fall back to cache on errors
- Can track cache age and source
- **Limitation**: More complex, duplicates Next.js functionality

**Decision: Use Option 1** - Trust Next.js caching

## User Experience

### Scenario 1: API Available
- User sees fresh data
- Source: `'api'`
- No error message

### Scenario 2: API Error + Cache Available
- User sees cached data (may be stale)
- Source: `'api'` (Next.js serves from cache transparently)
- No error message
- Data continues to work

### Scenario 3: API Error + No Cache
- User sees error message
- Source: `'error'`
- Clear error explanation
- Graceful degradation

## Configuration

### Revalidation Time

Default: 3600 seconds (1 hour)

```env
# .env
GITHUB_REVALIDATE=3600
YOUTUBE_REVALIDATE=3600
```

**Considerations**:
- **Shorter time** (300s): More fresh data, more API calls
- **Longer time** (7200s): Less API calls, more stale data
- **Balance**: 3600s (1 hour) is a good default

### Cache Behavior

Next.js cache behavior:
- **Development**: Cache disabled by default
- **Production**: Full caching enabled
- **Force refresh**: Use `cache: 'no-store'` or `revalidate: 0`

## Testing Cache Behavior

### Test Stale Cache

1. Make successful API request (populates cache)
2. Simulate API error (disconnect network, invalid key)
3. Make another request
4. **Expected**: Stale cache is served, no error shown

### Test No Cache

1. Clear Next.js cache (`rm -rf .next/cache`)
2. Simulate API error
3. Make request
4. **Expected**: Error message shown

### Test Fresh Data

1. Make request with valid API
2. **Expected**: Fresh data from API

## Monitoring

### Cache Hits vs Misses

In development mode, source badges show:
- `API`: Fresh data from API
- `CACHE`: Data from Next.js cache (not distinguishable in current implementation)
- `FALLBACK`: Error occurred, no data available

### Error Tracking

Errors are logged but don't break the UI:
- API errors logged to console
- User sees cached data or error UI
- Application continues to function

## Best Practices

1. **Set appropriate revalidate times** based on data freshness needs
2. **Trust Next.js caching** - don't duplicate cache logic
3. **Handle errors gracefully** - show cached data when possible
4. **Monitor API usage** - track rate limits and errors
5. **Test cache scenarios** - ensure stale cache works as expected

## Future Improvements

Potential enhancements:
1. **Cache age indicator**: Show when data was last updated
2. **Manual refresh**: Allow users to force refresh
3. **Cache warming**: Pre-populate cache on build
4. **Offline support**: Service worker for offline access
