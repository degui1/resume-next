/**
 * GitHub API Route
 * 
 * Example API route demonstrating error handling with shared utilities
 */

import { NextRequest, NextResponse } from 'next/server'
import { GitHubService } from '@/lib/github/service'
import { getGitHubConfig } from '@/lib/github/config'
import { withErrorHandling } from '@/lib/api/next-error-handler'

/**
 * GET /api/github
 * 
 * Fetches GitHub repositories with automatic error handling
 */
export const GET = withErrorHandling(async (request: NextRequest) => {
  // Get configuration
  const config = getGitHubConfig()
  
  // Initialize service
  const service = new GitHubService({
    username: config.username,
    token: config.token,
    revalidate: config.revalidate,
    repositoryFilter: config.repositoryFilter,
  })
  
  // Fetch repositories
  const result = await service.getRepositories()
  
  // Return response with appropriate status
  if (result.error) {
    // Service returned an error but still provided data (fallback)
    return NextResponse.json(result, { status: 207 }) // Multi-Status
  }
  
  return NextResponse.json(result)
})
