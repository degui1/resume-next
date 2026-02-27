'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { 
  isRateLimitError, 
  isNotFoundError, 
  isAuthenticationError,
  ApiError 
} from '@/lib/api/errors'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Error boundary caught:', error)
  }, [error])

  // Determine error type and customize message
  let title = 'Something went wrong!'
  let description = 'An unexpected error occurred. Please try again.'
  let showRetry = true

  if (isRateLimitError(error)) {
    title = 'Rate Limit Exceeded'
    description = error.message || 'Too many requests. Please wait a moment before trying again.'
    showRetry = true
  } else if (isNotFoundError(error)) {
    title = 'Not Found'
    description = error.message || 'The requested resource could not be found.'
    showRetry = false
  } else if (isAuthenticationError(error)) {
    title = 'Authentication Error'
    description = error.message || 'Authentication failed. Please check your credentials.'
    showRetry = false
  } else if (error instanceof ApiError) {
    title = 'API Error'
    description = error.message
    showRetry = true
  }

  return (
    <div className="flex min-h-[400px] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm">{description}</p>
            {error.digest && (
              <p className="text-xs opacity-70">Error ID: {error.digest}</p>
            )}
          </div>
        </Alert>
        
        {showRetry && (
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
