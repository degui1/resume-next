# Home Components

This directory contains components for the home page, including wrapper components for external API integrations.

## API Integration Pattern (Server-Safe)

For components that fetch data from external APIs (YouTube, GitHub, etc.), we follow this server-safe pattern that works with Next.js App Router and React Server Components.

### Structure

```
ComponentNameSection.tsx (wrapper - Server Component)
├── Suspense (handles async loading with streaming)
│   └── ComponentContent (async Server Component with try-catch)
│       ├── Fetches data from server action
│       ├── Handles errors gracefully
│       └── Returns error UI or success UI
└── ComponentName (presentational component)
```

### Key Principles

1. **Server Components by default** - No 'use client' directive needed
2. **Try-catch for error handling** - Instead of ErrorBoundary (which is client-only)
3. **Suspense for streaming** - Works natively with async Server Components
4. **Graceful degradation** - Show error UI without crashing the page

### Example: GitHubProjectsSection

```tsx
import { Suspense } from 'react';
import { getDataAction } from '@/app/actions/data';

// Loading fallback (Server Component)
function LoadingFallback() {
  return <div>Loading...</div>;
}

// Error fallback (Server Component)
function ErrorFallback({ error }: { error: string }) {
  return <div>Error: {error}</div>;
}

// Async content component that fetches data (Server Component)
async function ContentComponent({ props }) {
  try {
    const result = await getDataAction();
    
    // Handle API errors gracefully
    if (result.error && result.data.length === 0) {
      return <ErrorFallback error={result.error} />;
    }
    
    return <PresentationalComponent data={result.data} />;
  } catch (error) {
    // Catch unexpected errors
    const message = error instanceof Error ? error.message : 'Unknown error';
    return <ErrorFallback error={message} />;
  }
}

// Wrapper component (Server Component)
export function SectionWrapper({ props }) {
  return (
    <section>
      <Suspense fallback={<LoadingFallback />}>
        <ContentComponent props={props} />
      </Suspense>
    </section>
  );
}
```

### Benefits

1. **Server-Side Rendering**: All components are Server Components by default
2. **Streaming**: Suspense enables progressive rendering
3. **Error Isolation**: Errors in one section don't crash the entire page
4. **No Client JavaScript**: Loading and error states don't require client-side JS
5. **Better Performance**: Smaller client bundle, faster initial load
6. **SEO Friendly**: Content is rendered on the server

### Components Using This Pattern

- `YouTubeSection.tsx` - Wraps YouTube video grid and channel info
- `GitHubProjectsSection.tsx` - Wraps GitHub projects display

### When to Use

Use this pattern when:
- Component fetches data from external APIs
- API failures shouldn't break the entire page
- You want automatic loading states with streaming
- You need graceful error handling
- Component can be a Server Component (no client interactivity needed)

### When NOT to Use

Don't use this pattern for:
- Static content that doesn't require API calls
- Components that need client-side interactivity (use 'use client' + ErrorBoundary)
- Simple presentational components
- Components that only receive props from parent

### ErrorBoundary vs Try-Catch

- **ErrorBoundary**: Use for client components ('use client') that need runtime error catching
- **Try-Catch**: Use for Server Components to handle async errors gracefully

Server Components cannot use ErrorBoundary because it's a client-only feature. Instead, use try-catch blocks to handle errors in async Server Components.
