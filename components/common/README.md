# Common Components

## ErrorBoundary

A reusable React error boundary component that catches JavaScript errors anywhere in the child component tree and displays a fallback UI.

**IMPORTANT**: ErrorBoundary only works with Client Components ('use client'). For Server Components, use try-catch blocks instead.

### Basic Usage (Client Components Only)

```tsx
'use client';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function MyClientComponent() {
  return (
    <ErrorBoundary>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}
```

### With Custom Fallback

```tsx
'use client';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { YouTubeErrorState } from '@/components/youtube/YouTubeErrorState';

function MyClientComponent() {
  return (
    <ErrorBoundary 
      fallback={
        <YouTubeErrorState 
          errorType="network"
          message="Failed to load YouTube content"
        />
      }
    >
      <YouTubeContent />
    </ErrorBoundary>
  );
}
```

### With Error Logging

```tsx
'use client';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function MyClientComponent() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Send to error tracking service
    console.error('Error caught:', error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <ComponentThatMightError />
    </ErrorBoundary>
  );
}
```

### Props

- `children`: ReactNode - The components to wrap with error boundary
- `fallback?`: ReactNode - Custom fallback UI to display when an error occurs (optional)
- `onError?`: (error: Error, errorInfo: React.ErrorInfo) => void - Callback function called when an error is caught (optional)

### When to Use

Use ErrorBoundary for CLIENT COMPONENTS ('use client') to:
- Wrap components that make client-side API calls
- Protect critical sections of your UI from crashing the entire app
- Provide graceful error handling for third-party components
- Isolate errors to specific features or sections

### When NOT to Use

DO NOT use ErrorBoundary for:
- **Server Components** - Use try-catch blocks instead
- Event handlers (use try-catch instead)
- Asynchronous code in client components (use try-catch or .catch())

### Server Components vs Client Components

**Server Components (default in Next.js App Router):**
```tsx
// No 'use client' directive
async function MyServerComponent() {
  try {
    const data = await fetchData();
    return <div>{data}</div>;
  } catch (error) {
    return <ErrorUI error={error.message} />;
  }
}
```

**Client Components:**
```tsx
'use client';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function MyClientComponent() {
  return (
    <ErrorBoundary>
      <InteractiveComponent />
    </ErrorBoundary>
  );
}
```

### Notes

- Error boundaries only catch errors in:
  - Rendering
  - Lifecycle methods
  - Constructors of the whole tree below them

- Error boundaries do NOT catch errors in:
  - Event handlers (use try-catch instead)
  - Asynchronous code (use try-catch or .catch())
  - Server-side rendering (use try-catch in Server Components)
  - Errors thrown in the error boundary itself
