/**
 * Property-Based Tests for Data Transformation
 * Feature: github-integration
 * 
 * These tests validate correctness properties for GitHub API response transformation
 * using property-based testing with fast-check.
 */

import fc from 'fast-check';
import { GitHubApiRepository, GitHubProject } from '@/lib/github/types';
import { 
  transformRepository, 
  transformRepositories, 
  extractTechnologies 
} from '@/lib/github/transformer';

describe('Transformation Properties', () => {
  /**
   * Property 3: API Response Transformation
   * **Validates: Requirements 1.3**
   * 
   * For any valid GitHub API repository response, transforming it to the GitHubProject type
   * should produce a valid GitHubProject object with all required fields properly mapped.
   */
  describe('Property 3: API Response Transformation', () => {
    // Feature: github-integration, Property 3: API Response Transformation

    // Arbitrary for repository names
    const arbRepositoryName = fc.string({ minLength: 1, maxLength: 100 })
      .filter(s => /^[a-zA-Z0-9._-]+$/.test(s));

    // Arbitrary for complete GitHubApiRepository
    const arbGitHubApiRepository = fc.record({
      id: fc.nat(),
      name: arbRepositoryName,
      description: fc.option(fc.string({ maxLength: 500 }), { nil: null }),
      stargazers_count: fc.nat({ max: 1000000 }),
      forks_count: fc.nat({ max: 100000 }),
      language: fc.option(
        fc.constantFrom('TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Java', 'C++'),
        { nil: null }
      ),
      html_url: fc.webUrl(),
      updated_at: fc.integer({ min: 946684800000, max: 1924905600000 })
        .map(ts => new Date(ts).toISOString()),
      private: fc.boolean(),
      topics: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 20 }),
        { nil: undefined }
      ),
    });

    it('should transform API repository to GitHubProject with all required fields', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const result = transformRepository(apiRepo);

            // Verify all required fields are present
            expect(result).toHaveProperty('id');
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('description');
            expect(result).toHaveProperty('stars');
            expect(result).toHaveProperty('forks');
            expect(result).toHaveProperty('url');
            expect(result).toHaveProperty('technologies');
            expect(result).toHaveProperty('language');
            expect(result).toHaveProperty('updatedAt');

            // Verify field types
            expect(typeof result.id).toBe('string');
            expect(typeof result.name).toBe('string');
            expect(typeof result.description).toBe('string');
            expect(typeof result.stars).toBe('number');
            expect(typeof result.forks).toBe('number');
            expect(typeof result.url).toBe('string');
            expect(Array.isArray(result.technologies)).toBe(true);
            expect(result.language === null || typeof result.language === 'string').toBe(true);
            expect(typeof result.updatedAt).toBe('string');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly map API field names to GitHubProject field names', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const result = transformRepository(apiRepo);

            // Verify field mappings
            expect(result.id).toBe(apiRepo.id.toString());
            expect(result.name).toBe(apiRepo.name);
            expect(result.stars).toBe(apiRepo.stargazers_count);
            expect(result.forks).toBe(apiRepo.forks_count);
            expect(result.url).toBe(apiRepo.html_url);
            expect(result.language).toBe(apiRepo.language);
            expect(result.updatedAt).toBe(apiRepo.updated_at);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should convert null description to empty string', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const repoWithNullDescription = { ...apiRepo, description: null };
            const result = transformRepository(repoWithNullDescription);

            // Null description should become empty string
            expect(result.description).toBe('');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve non-null description', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.string({ minLength: 1, maxLength: 500 }),
          (apiRepo, description) => {
            const repoWithDescription = { ...apiRepo, description };
            const result = transformRepository(repoWithDescription);

            // Non-null description should be preserved
            expect(result.description).toBe(description);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve null language', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const repoWithNullLanguage = { ...apiRepo, language: null };
            const result = transformRepository(repoWithNullLanguage);

            // Null language should remain null
            expect(result.language).toBeNull();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve non-null language', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.constantFrom('TypeScript', 'JavaScript', 'Python', 'Go', 'Rust'),
          (apiRepo, language) => {
            const repoWithLanguage = { ...apiRepo, language };
            const result = transformRepository(repoWithLanguage);

            // Non-null language should be preserved
            expect(result.language).toBe(language);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve ISO 8601 timestamp format', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const result = transformRepository(apiRepo);

            // Timestamp should be preserved in ISO 8601 format
            expect(result.updatedAt).toBe(apiRepo.updated_at);
            
            // Verify it's a valid ISO 8601 string
            expect(() => new Date(result.updatedAt)).not.toThrow();
            expect(new Date(result.updatedAt).toISOString()).toBe(result.updatedAt);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should convert numeric id to string', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const result = transformRepository(apiRepo);

            // ID should be converted to string
            expect(typeof result.id).toBe('string');
            expect(result.id).toBe(apiRepo.id.toString());
            expect(parseInt(result.id, 10)).toBe(apiRepo.id);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should extract technologies array', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const result = transformRepository(apiRepo);

            // Technologies should be an array
            expect(Array.isArray(result.technologies)).toBe(true);
            
            // All technologies should be strings
            result.technologies.forEach(tech => {
              expect(typeof tech).toBe('string');
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include language in technologies when language is not null', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.constantFrom('TypeScript', 'JavaScript', 'Python', 'Go', 'Rust'),
          (apiRepo, language) => {
            const repoWithLanguage = { ...apiRepo, language };
            const result = transformRepository(repoWithLanguage);

            // Technologies should include the language
            expect(result.technologies).toContain(language);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not include language in technologies when language is null', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const repoWithNullLanguage = { ...apiRepo, language: null, topics: undefined };
            const result = transformRepository(repoWithNullLanguage);

            // Technologies should be empty when language is null and no topics
            expect(result.technologies).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include topics in technologies when topics are present', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
          (apiRepo, topics) => {
            const repoWithTopics = { ...apiRepo, topics };
            const result = transformRepository(repoWithTopics);

            // Technologies should include all topics
            topics.forEach(topic => {
              expect(result.technologies).toContain(topic);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve exact star and fork counts', () => {
      fc.assert(
        fc.property(
          fc.nat({ max: 1000000 }),
          fc.nat({ max: 100000 }),
          (stars, forks) => {
            const apiRepo: GitHubApiRepository = {
              id: 1,
              name: 'test-repo',
              description: 'Test',
              stargazers_count: stars,
              forks_count: forks,
              language: 'TypeScript',
              html_url: 'https://github.com/test/repo',
              updated_at: '2024-01-01T00:00:00Z',
              private: false,
            };

            const result = transformRepository(apiRepo);

            // Counts should be preserved exactly
            expect(result.stars).toBe(stars);
            expect(result.forks).toBe(forks);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle repositories with both language and topics', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.constantFrom('TypeScript', 'JavaScript', 'Python'),
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
          (apiRepo, language, topics) => {
            const repoWithBoth = { ...apiRepo, language, topics };
            const result = transformRepository(repoWithBoth);

            // Technologies should include both language and topics
            expect(result.technologies).toContain(language);
            topics.forEach(topic => {
              expect(result.technologies).toContain(topic);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should remove duplicate technologies', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.constantFrom('TypeScript', 'JavaScript', 'Python'),
          (apiRepo, language) => {
            // Create topics that include the language (duplicate)
            const topics = [language, 'react', 'nodejs', language];
            const repoWithDuplicates = { ...apiRepo, language, topics };
            const result = transformRepository(repoWithDuplicates);

            // Technologies should not have duplicates
            const uniqueTechnologies = Array.from(new Set(result.technologies));
            expect(result.technologies.length).toBe(uniqueTechnologies.length);
            
            // Language should appear only once
            const languageCount = result.technologies.filter(t => t === language).length;
            expect(languageCount).toBe(1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should transform multiple repositories correctly', () => {
      fc.assert(
        fc.property(
          fc.array(arbGitHubApiRepository, { minLength: 1, maxLength: 10 }),
          (apiRepos) => {
            const results = transformRepositories(apiRepos);

            // Should return same number of results
            expect(results.length).toBe(apiRepos.length);

            // Each result should be correctly transformed
            results.forEach((result, index) => {
              const apiRepo = apiRepos[index];
              expect(result.id).toBe(apiRepo.id.toString());
              expect(result.name).toBe(apiRepo.name);
              expect(result.stars).toBe(apiRepo.stargazers_count);
              expect(result.forks).toBe(apiRepo.forks_count);
              expect(result.url).toBe(apiRepo.html_url);
              expect(result.language).toBe(apiRepo.language);
              expect(result.updatedAt).toBe(apiRepo.updated_at);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty array of repositories', () => {
      fc.assert(
        fc.property(
          fc.constant([]),
          (emptyArray) => {
            const results = transformRepositories(emptyArray);

            // Should return empty array
            expect(results).toEqual([]);
            expect(results.length).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain order when transforming multiple repositories', () => {
      fc.assert(
        fc.property(
          fc.array(arbGitHubApiRepository, { minLength: 2, maxLength: 10 }),
          (apiRepos) => {
            const results = transformRepositories(apiRepos);

            // Order should be preserved
            results.forEach((result, index) => {
              expect(result.name).toBe(apiRepos[index].name);
              expect(result.id).toBe(apiRepos[index].id.toString());
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle repositories with zero stars and forks', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const repoWithZeroCounts = {
              ...apiRepo,
              stargazers_count: 0,
              forks_count: 0,
            };
            const result = transformRepository(repoWithZeroCounts);

            // Zero counts should be preserved
            expect(result.stars).toBe(0);
            expect(result.forks).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle repositories with very large star and fork counts', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.nat({ max: 999999 }),
          fc.nat({ max: 999999 }),
          (apiRepo, stars, forks) => {
            const repoWithLargeCounts = {
              ...apiRepo,
              stargazers_count: stars,
              forks_count: forks,
            };
            const result = transformRepository(repoWithLargeCounts);

            // Large counts should be preserved exactly
            expect(result.stars).toBe(stars);
            expect(result.forks).toBe(forks);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should produce valid GitHubProject objects', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const result = transformRepository(apiRepo);

            // Verify the result is a valid GitHubProject
            const isValidGitHubProject = (obj: unknown): obj is GitHubProject => {
              if (typeof obj !== 'object' || obj === null) return false;
              const project = obj as Record<string, unknown>;
              
              return (
                typeof project.id === 'string' &&
                typeof project.name === 'string' &&
                typeof project.description === 'string' &&
                typeof project.stars === 'number' &&
                typeof project.forks === 'number' &&
                typeof project.url === 'string' &&
                Array.isArray(project.technologies) &&
                (project.language === null || typeof project.language === 'string') &&
                typeof project.updatedAt === 'string'
              );
            };

            expect(isValidGitHubProject(result)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Technology Extraction Properties
   * Tests for the extractTechnologies helper function
   */
  describe('Technology Extraction', () => {
    const arbGitHubApiRepository = fc.record({
      id: fc.nat(),
      name: fc.string({ minLength: 1, maxLength: 100 }),
      description: fc.option(fc.string({ maxLength: 500 }), { nil: null }),
      stargazers_count: fc.nat({ max: 1000000 }),
      forks_count: fc.nat({ max: 100000 }),
      language: fc.option(
        fc.constantFrom('TypeScript', 'JavaScript', 'Python', 'Go', 'Rust'),
        { nil: null }
      ),
      html_url: fc.webUrl(),
      updated_at: fc.integer({ min: 946684800000, max: 1924905600000 })
        .map(ts => new Date(ts).toISOString()),
      private: fc.boolean(),
      topics: fc.option(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 20 }),
        { nil: undefined }
      ),
    });

    it('should return array of unique technologies', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const technologies = extractTechnologies(apiRepo);

            // Should be an array
            expect(Array.isArray(technologies)).toBe(true);

            // Should not have duplicates
            const uniqueTechnologies = Array.from(new Set(technologies));
            expect(technologies.length).toBe(uniqueTechnologies.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include language when present', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.constantFrom('TypeScript', 'JavaScript', 'Python'),
          (apiRepo, language) => {
            const repoWithLanguage = { ...apiRepo, language };
            const technologies = extractTechnologies(repoWithLanguage);

            expect(technologies).toContain(language);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not include language when null', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          (apiRepo) => {
            const repoWithNullLanguage = { ...apiRepo, language: null, topics: undefined };
            const technologies = extractTechnologies(repoWithNullLanguage);

            expect(technologies).toEqual([]);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include all topics when present', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 10 }),
          (apiRepo, topics) => {
            const repoWithTopics = { ...apiRepo, language: null, topics };
            const technologies = extractTechnologies(repoWithTopics);

            topics.forEach(topic => {
              expect(technologies).toContain(topic);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle both language and topics', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.constantFrom('TypeScript', 'JavaScript', 'Python'),
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
          (apiRepo, language, topics) => {
            const repoWithBoth = { ...apiRepo, language, topics };
            const technologies = extractTechnologies(repoWithBoth);

            expect(technologies).toContain(language);
            topics.forEach(topic => {
              expect(technologies).toContain(topic);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should remove duplicates between language and topics', () => {
      fc.assert(
        fc.property(
          arbGitHubApiRepository,
          fc.constantFrom('TypeScript', 'JavaScript', 'Python'),
          (apiRepo, language) => {
            const topics = [language, 'react', language, 'nodejs'];
            const repoWithDuplicates = { ...apiRepo, language, topics };
            const technologies = extractTechnologies(repoWithDuplicates);

            // Should not have duplicates
            const uniqueTechnologies = Array.from(new Set(technologies));
            expect(technologies.length).toBe(uniqueTechnologies.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
