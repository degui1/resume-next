# Next.js Error Handling Integration

This guide explains how to use the shared API error handling utilities with Next.js error boundaries, API routes, and server actions.

## Overview

The shared API utilities integrate seamlessly with Next.js built-in error handling:

- **Error Boundaries** (`error.tsx`, `global-error.tsx`) - Catch and display errors in UI
- **API Routes** - Handle errors in REST endpoints
- **Server Actions** - Handle errors in server-side functions
- **Not Found Pages** (`not-found.tsx`) - Handle 404 errors

## Error Boundaries

### Route-Level Error Boundary

Located at `app/[lang]/error.tsx`, this catches errors in route segments:

```typescript
'use client'

import { isRateLimitError, isNotFoundError } from '@/lib/api/errors'

export default function Error({ error, reset }: ErrorProps) {
  // Automatically detects error type and shows appropriate message
  if (isRateLimitError(error)) {
    return <div>Rate limit exceeded. Please wait...</div>
  }
  
  return <div>Something went wrong! <button onClick={reset}>Try again</button></div>
}
```

### Global Error Boundary

Located at `app/global-error.tsx`, this catches critical errors in the root layout.

### Not Found Page

Located at `app/[lang]/not-found.tsx`, this handles 404 errors.

## API Routes

### Using `withErrorHandling` Wrapper

The easiest way to handle errors in API routes:

```typescript
import { withErrorHandling } from '@/lib/api/next-error-handler'
import { createErrorHandler } from '@/lib/api/errors'

const handleError = createErrorHandler({
  messages: {
    RATE_LIMIT: 'API rate limit exceeded',
    NETWORK: 'Network error occurred',
    AUTHENTICATION: 'Authentication failed',
    NOT_FOUND: 'Resource not found',
    VALIDATION: 'Invalid request',
    GENERIC: 'An error occurred',
  }
})

export const GET = withErrorHandling(async (request) => {
  try {
    const data = await fetchData()
    return NextResponse.json(data)
  } catch (error) {
    // Convert to ApiError
    const apiError = handleError(error)
    throw apiError // withErrorHandling will catch and format
  }
})
```

### Manual Error Handling

For more control:

```typescript
import { handleApiRouteError } from '@/lib/api/next-error-handler'
import { RateLimitError } from '@/lib/api/errors'

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData()
    return NextResponse.json(data)
  } catch (error) {
    // Manually handle specific errors
    if (isRateLimitError(error)) {
      // Custom rate limit handling
      return NextResponse.json(
        { error: 'Rate limited', retryAfter: 60 },
        { status: 429 }
      )
    }
    
    // Use shared handler for other errors
    return handleApiRouteError(error)
  }
}
```

### Error Response Format

API routes return standardized error responses:

```json
{
  "error": "GitHub API rate limit reached",
  "code": "RATE_LIMIT_ERROR",
  "statusCode": 429,
  "metadata": {
    "remaining": 0,
    "resetAt": "2024-01-01T12:00:00Z"
  },
  "timestamp": "2024-01-01T11:30:00Z"
}
```

## Server Actions

### Using `handleServerActionError`

For server actions that return result objects:

```typescript
'use server'

import { handleServerActionError } from '@/lib/api/next-error-handler'
import { createErrorHandler } from '@/lib/api/errors'

const handleError = createErrorHandler({
  messages: { /* ... */ }
})

export async function myAction(formData: FormData) {
  try {
    const result = await processData(formData)
    return { success: true, data: result }
  } catch (error) {
    // Convert to standardized error response
    return handleServerActionError(handleError(error))
  }
}
```

### Client-Side Usage

```typescript
'use client'

import { myAction } from '@/app/actions/my-action'

function MyComponent() {
  async function handleSubmit(formData: FormData) {
    const result = await myAction(formData)
    
    if (!result.success) {
      // Handle error
      console.error(result.error, result.code)
      return
    }
    
    // Handle success
    console.log(result.data)
  }
  
  return <form action={handleSubmit}>...</form>
}
```

## Utility Functions

### `isRetryableError(error)`

Determines if an error should be retried:

```typescript
import { isRetryableError } from '@/lib/api/next-error-handler'

try {
  await fetchData()
} catch (error) {
  if (isRetryableError(error)) {
    // Retry logic
    await retry(() => fetchData())
  } else {
    // Don't retry
    throw error
  }
}
```

### `getUserFriendlyMessage(error)`

Gets a user-friendly error message:

```typescript
import { getUserFriendlyMessage } from '@/lib/api/next-error-handler'

try {
  await fetchData()
} catch (error) {
  const message = getUserFriendlyMessage(error)
  toast.error(message) // Show to user
}
```

## Error Types and Status Codes

| Error Type | Status Code | Retryable | Use Case |
|------------|-------------|-----------|----------|
| `NetworkError` | 500-599 | Yes | Server errors, connectivity issues |
| `RateLimitError` | 429 | Yes (after cooldown) | API quota exceeded |
| `AuthenticationError` | 401, 403 | No | Invalid credentials |
| `NotFoundError` | 404 | No | Resource doesn't exist |
| `ValidationError` | 422, 400-499 | No | Invalid input data |

## Best Practices

1. **Use type guards** to check error types before handling
2. **Provide context** in error messages for debugging
3. **Log errors** to monitoring services in production
4. **Show user-friendly messages** in UI, technical details in logs
5. **Handle rate limits gracefully** with retry logic
6. **Don't expose sensitive information** in error messages
7. **Use error boundaries** to prevent full page crashes
8. **Test error scenarios** to ensure proper handling

## Example: Complete Integration

```typescript
// app/api/data/route.ts
import { withErrorHandling } from '@/lib/api/next-error-handler'
import { createErrorHandler, RateLimitError } from '@/lib/api/errors'

const handleError = createErrorHandler({
  messages: {
    RATE_LIMIT: 'Too many requests. Please try again later.',
    NETWORK: 'Service temporarily unavailable.',
    AUTHENTICATION: 'Invalid API key.',
    NOT_FOUND: 'Data not found.',
    VALIDATION: 'Invalid request parameters.',
    GENERIC: 'An unexpected error occurred.',
  },
  extractMetadata: (error) => {
    // Extract rate limit info if available
    if (error && typeof error === 'object' && 'rateLimit' in error) {
      return error.rateLimit
    }
  }
})

export const GET = withErrorHandling(async (request) => {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    throw new ValidationError('Missing required parameter: id', 400)
  }
  
  try {
    const data = await fetchData(id)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    throw handleError(error)
  }
})
```

## Testing Error Handling

```typescript
// __tests__/api/data.test.ts
import { GET } from '@/app/api/data/route'
import { RateLimitError } from '@/lib/api/errors'

describe('GET /api/data', () => {
  it('handles rate limit errors', async () => {
    // Mock rate limit error
    jest.spyOn(global, 'fetch').mockRejectedValue(
      new RateLimitError('Rate limited', 429)
    )
    
    const request = new Request('http://localhost/api/data?id=123')
    const response = await GET(request)
    
    expect(response.status).toBe(429)
    const data = await response.json()
    expect(data.code).toBe('RATE_LIMIT_ERROR')
  })
})
```
