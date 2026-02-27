'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global error boundary caught:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4 text-center">
            <h1 className="text-4xl font-bold">Something went wrong!</h1>
            <p className="text-gray-600">
              A critical error occurred. Please refresh the page.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-400">Error ID: {error.digest}</p>
            )}
            <button
              onClick={reset}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
