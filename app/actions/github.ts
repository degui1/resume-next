/**
 * GitHub Server Actions
 * 
 * Server actions for fetching GitHub data in Next.js Server Components.
 * These actions run on the server and can be called from client or server components.
 */

'use server';

import { GitHubService } from '@/lib/github/service';
import { getGitHubConfig } from '@/lib/github/config';
import { FetchRepositoriesResult } from '@/lib/github/types';
import { handleServerActionError } from '@/lib/api/next-error-handler';

/**
 * Get GitHub projects using the GitHub service
 * 
 * Server action that initializes the GitHub service with configuration
 * from environment variables and fetches repository data.
 * 
 * This action:
 * 1. Reads configuration from environment variables via getGitHubConfig()
 * 2. Initializes GitHubService with the configuration
 * 3. Calls service.getRepositories() to fetch data
 * 4. Returns the complete result including data, source, rate limit info, and errors
 * 
 * The service handles:
 * - Automatic fallback to mock data if configuration is missing
 * - Rate limit checking before making requests
 * - Repository filtering if configured
 * - Partial failure handling
 * - Next.js automatic caching
 * 
 * @returns Promise resolving to fetch result with data, source, rate limit, and error info
 * 
 * @example
 * // In a Server Component
 * const result = await getGitHubProjects();
 * if (result.error) {
 *   console.warn('GitHub fetch error:', result.error);
 * }
 * const projects = result.data;
 * 
 * @example
 * // In a Client Component
 * 'use client';
 * import { getGitHubProjects } from '@/app/actions/github';
 * 
 * function MyComponent() {
 *   const [projects, setProjects] = useState([]);
 *   
 *   useEffect(() => {
 *     getGitHubProjects().then(result => setProjects(result.data));
 *   }, []);
 *   
 *   return <div>{projects.map(p => <div key={p.id}>{p.name}</div>)}</div>;
 * }
 */
export async function getGitHubProjects(): Promise<FetchRepositoriesResult> {
  try {
    // Get configuration from environment variables
    const config = getGitHubConfig();
    
    // Initialize GitHub service with configuration
    const service = new GitHubService({
      username: config.username,
      token: config.token,
      revalidate: config.revalidate,
      repositoryFilter: config.repositoryFilter,
    });
    
    // Fetch repositories using the service
    // The service handles all error cases and returns appropriate responses
    const result = await service.getRepositories();
    
    return result;
  } catch (error) {
    // Handle any unexpected errors that weren't caught by the service
    // This is a safety net for unexpected exceptions
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return {
      data: [],
      source: 'fallback',
      error: `Failed to fetch GitHub projects: ${errorMessage}`,
    };
  }
}
