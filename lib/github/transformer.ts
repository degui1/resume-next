/**
 * Data Transformer
 * 
 * Converts GitHub API responses to application types.
 * Handles null values, extracts technologies, and formats timestamps.
 */

import { GitHubApiRepository, GitHubProject } from './types';

/**
 * Transform a single GitHub API repository to GitHubProject type
 * 
 * Converts GitHub API response format to the application's GitHubProject type:
 * - Maps API field names to application field names
 * - Handles null values for description and language
 * - Formats updatedAt timestamp to ISO 8601 string
 * - Extracts technologies array from language and topics
 * 
 * @param apiRepo - GitHub API repository response
 * @returns Transformed GitHubProject object
 */
export function transformRepository(apiRepo: GitHubApiRepository): GitHubProject {
  return {
    id: apiRepo.id.toString(),
    name: apiRepo.name,
    description: apiRepo.description || '',
    stars: apiRepo.stargazers_count,
    forks: apiRepo.forks_count,
    url: apiRepo.html_url,
    technologies: extractTechnologies(apiRepo),
    language: apiRepo.language,
    updatedAt: apiRepo.updated_at,
  };
}

/**
 * Transform multiple GitHub API repositories to GitHubProject array
 * 
 * Batch transforms an array of GitHub API repository responses.
 * 
 * @param apiRepos - Array of GitHub API repository responses
 * @returns Array of transformed GitHubProject objects
 */
export function transformRepositories(
  apiRepos: GitHubApiRepository[]
): GitHubProject[] {
  return apiRepos.map(transformRepository);
}

/**
 * Extract technologies array from repository data
 * 
 * Derives a technologies array from:
 * - Primary language field (if not null)
 * - Topics array (if present)
 * 
 * Removes duplicates and returns unique technologies.
 * 
 * @param repo - GitHub API repository response
 * @returns Array of unique technology strings
 */
export function extractTechnologies(repo: GitHubApiRepository): string[] {
  const technologies: string[] = [];

  // Add primary language if present
  if (repo.language) {
    technologies.push(repo.language);
  }

  // Add topics if present
  if (repo.topics && Array.isArray(repo.topics)) {
    technologies.push(...repo.topics);
  }

  // Remove duplicates and return
  return Array.from(new Set(technologies));
}
