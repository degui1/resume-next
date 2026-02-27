/**
 * Unit Tests for Data Transformer
 * Feature: github-integration
 * 
 * Tests specific examples and edge cases for GitHub API response transformation.
 */

import { GitHubApiRepository } from '@/lib/github/types';
import {
  transformRepository,
  transformRepositories,
  extractTechnologies,
} from '@/lib/github/transformer';

describe('Data Transformer', () => {
  describe('transformRepository', () => {
    it('should transform repository with null description', () => {
      // Requirement 1.3 - Test null description handling
      const apiRepo: GitHubApiRepository = {
        id: 123,
        name: 'test-repo',
        description: null,
        stargazers_count: 42,
        forks_count: 10,
        language: 'TypeScript',
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

      const result = transformRepository(apiRepo);

      expect(result.description).toBe('');
      expect(result.id).toBe('123');
      expect(result.name).toBe('test-repo');
      expect(result.stars).toBe(42);
      expect(result.forks).toBe(10);
      expect(result.language).toBe('TypeScript');
      expect(result.url).toBe('https://github.com/testuser/test-repo');
      expect(result.updatedAt).toBe('2024-01-01T00:00:00Z');
    });

    it('should transform repository with null language', () => {
      // Requirement 1.3 - Test null language handling
      const apiRepo: GitHubApiRepository = {
        id: 456,
        name: 'markdown-repo',
        description: 'A repository with only markdown files',
        stargazers_count: 5,
        forks_count: 2,
        language: null,
        html_url: 'https://github.com/testuser/markdown-repo',
        updated_at: '2024-02-15T10:30:00Z',
        private: false,
      };

      const result = transformRepository(apiRepo);

      expect(result.language).toBeNull();
      expect(result.description).toBe('A repository with only markdown files');
      expect(result.id).toBe('456');
      expect(result.name).toBe('markdown-repo');
      expect(result.stars).toBe(5);
      expect(result.forks).toBe(2);
      expect(result.url).toBe('https://github.com/testuser/markdown-repo');
      expect(result.updatedAt).toBe('2024-02-15T10:30:00Z');
    });

    it('should transform repository with both null description and null language', () => {
      // Requirement 1.3 - Test multiple null fields
      const apiRepo: GitHubApiRepository = {
        id: 789,
        name: 'empty-repo',
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        html_url: 'https://github.com/testuser/empty-repo',
        updated_at: '2024-03-20T15:45:00Z',
        private: false,
      };

      const result = transformRepository(apiRepo);

      expect(result.description).toBe('');
      expect(result.language).toBeNull();
      expect(result.id).toBe('789');
      expect(result.name).toBe('empty-repo');
      expect(result.stars).toBe(0);
      expect(result.forks).toBe(0);
      expect(result.url).toBe('https://github.com/testuser/empty-repo');
      expect(result.updatedAt).toBe('2024-03-20T15:45:00Z');
    });

    it('should preserve ISO 8601 timestamp format', () => {
      // Requirement 1.3 - Test timestamp format preservation
      const apiRepo: GitHubApiRepository = {
        id: 999,
        name: 'timestamp-test',
        description: 'Testing timestamp',
        stargazers_count: 1,
        forks_count: 0,
        language: 'JavaScript',
        html_url: 'https://github.com/testuser/timestamp-test',
        updated_at: '2024-12-25T23:59:59.999Z',
        private: false,
      };

      const result = transformRepository(apiRepo);

      expect(result.updatedAt).toBe('2024-12-25T23:59:59.999Z');
      // Verify it's a valid ISO 8601 string
      expect(() => new Date(result.updatedAt)).not.toThrow();
      expect(new Date(result.updatedAt).toISOString()).toBe(result.updatedAt);
    });

    it('should convert numeric id to string', () => {
      // Requirement 1.3 - Test id conversion
      const apiRepo: GitHubApiRepository = {
        id: 987654321,
        name: 'large-id-repo',
        description: 'Repository with large ID',
        stargazers_count: 100,
        forks_count: 50,
        language: 'Python',
        html_url: 'https://github.com/testuser/large-id-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

      const result = transformRepository(apiRepo);

      expect(result.id).toBe('987654321');
      expect(typeof result.id).toBe('string');
      expect(parseInt(result.id, 10)).toBe(987654321);
    });

    it('should handle repository with zero stars and forks', () => {
      // Requirement 1.3 - Test zero counts
      const apiRepo: GitHubApiRepository = {
        id: 111,
        name: 'new-repo',
        description: 'Brand new repository',
        stargazers_count: 0,
        forks_count: 0,
        language: 'Go',
        html_url: 'https://github.com/testuser/new-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

      const result = transformRepository(apiRepo);

      expect(result.stars).toBe(0);
      expect(result.forks).toBe(0);
    });

    it('should handle repository with very large star and fork counts', () => {
      // Requirement 1.3 - Test large counts
      const apiRepo: GitHubApiRepository = {
        id: 222,
        name: 'popular-repo',
        description: 'Very popular repository',
        stargazers_count: 999999,
        forks_count: 888888,
        language: 'Rust',
        html_url: 'https://github.com/testuser/popular-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

      const result = transformRepository(apiRepo);

      expect(result.stars).toBe(999999);
      expect(result.forks).toBe(888888);
    });

    it('should include all required fields in transformed object', () => {
      // Requirement 1.3 - Test all required fields
      const apiRepo: GitHubApiRepository = {
        id: 333,
        name: 'complete-repo',
        description: 'Complete repository',
        stargazers_count: 50,
        forks_count: 25,
        language: 'Java',
        html_url: 'https://github.com/testuser/complete-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

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
    });
  });

  describe('transformRepositories', () => {
    it('should transform multiple repositories', () => {
      // Requirement 1.3 - Test batch transformation
      const apiRepos: GitHubApiRepository[] = [
        {
          id: 1,
          name: 'repo-1',
          description: 'First repository',
          stargazers_count: 10,
          forks_count: 5,
          language: 'TypeScript',
          html_url: 'https://github.com/testuser/repo-1',
          updated_at: '2024-01-01T00:00:00Z',
          private: false,
        },
        {
          id: 2,
          name: 'repo-2',
          description: 'Second repository',
          stargazers_count: 20,
          forks_count: 10,
          language: 'JavaScript',
          html_url: 'https://github.com/testuser/repo-2',
          updated_at: '2024-01-02T00:00:00Z',
          private: false,
        },
        {
          id: 3,
          name: 'repo-3',
          description: null,
          stargazers_count: 30,
          forks_count: 15,
          language: null,
          html_url: 'https://github.com/testuser/repo-3',
          updated_at: '2024-01-03T00:00:00Z',
          private: false,
        },
      ];

      const results = transformRepositories(apiRepos);

      expect(results.length).toBe(3);
      expect(results[0].id).toBe('1');
      expect(results[0].name).toBe('repo-1');
      expect(results[1].id).toBe('2');
      expect(results[1].name).toBe('repo-2');
      expect(results[2].id).toBe('3');
      expect(results[2].name).toBe('repo-3');
      expect(results[2].description).toBe('');
      expect(results[2].language).toBeNull();
    });

    it('should handle empty array', () => {
      // Requirement 1.3 - Test empty array
      const results = transformRepositories([]);

      expect(results).toEqual([]);
      expect(results.length).toBe(0);
    });

    it('should maintain order of repositories', () => {
      // Requirement 1.3 - Test order preservation
      const apiRepos: GitHubApiRepository[] = [
        {
          id: 100,
          name: 'alpha',
          description: 'Alpha',
          stargazers_count: 1,
          forks_count: 1,
          language: 'TypeScript',
          html_url: 'https://github.com/testuser/alpha',
          updated_at: '2024-01-01T00:00:00Z',
          private: false,
        },
        {
          id: 200,
          name: 'beta',
          description: 'Beta',
          stargazers_count: 2,
          forks_count: 2,
          language: 'JavaScript',
          html_url: 'https://github.com/testuser/beta',
          updated_at: '2024-01-02T00:00:00Z',
          private: false,
        },
        {
          id: 300,
          name: 'gamma',
          description: 'Gamma',
          stargazers_count: 3,
          forks_count: 3,
          language: 'Python',
          html_url: 'https://github.com/testuser/gamma',
          updated_at: '2024-01-03T00:00:00Z',
          private: false,
        },
      ];

      const results = transformRepositories(apiRepos);

      expect(results[0].name).toBe('alpha');
      expect(results[1].name).toBe('beta');
      expect(results[2].name).toBe('gamma');
    });
  });

  describe('extractTechnologies', () => {
    it('should extract technologies from language field', () => {
      // Requirement 1.3 - Test language extraction
      const apiRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test',
        stargazers_count: 10,
        forks_count: 5,
        language: 'TypeScript',
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

      const technologies = extractTechnologies(apiRepo);

      expect(technologies).toContain('TypeScript');
      expect(technologies.length).toBe(1);
    });

    it('should return empty array when language is null and no topics', () => {
      // Requirement 1.3 - Test null language
      const apiRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test',
        stargazers_count: 10,
        forks_count: 5,
        language: null,
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
      };

      const technologies = extractTechnologies(apiRepo);

      expect(technologies).toEqual([]);
    });

    it('should extract technologies from topics', () => {
      // Requirement 1.3 - Test topics extraction
      const apiRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test',
        stargazers_count: 10,
        forks_count: 5,
        language: null,
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
        topics: ['react', 'nodejs', 'typescript'],
      };

      const technologies = extractTechnologies(apiRepo);

      expect(technologies).toContain('react');
      expect(technologies).toContain('nodejs');
      expect(technologies).toContain('typescript');
      expect(technologies.length).toBe(3);
    });

    it('should combine language and topics', () => {
      // Requirement 1.3 - Test combined extraction
      const apiRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test',
        stargazers_count: 10,
        forks_count: 5,
        language: 'TypeScript',
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
        topics: ['react', 'nodejs', 'web'],
      };

      const technologies = extractTechnologies(apiRepo);

      expect(technologies).toContain('TypeScript');
      expect(technologies).toContain('react');
      expect(technologies).toContain('nodejs');
      expect(technologies).toContain('web');
      expect(technologies.length).toBe(4);
    });

    it('should remove duplicate technologies', () => {
      // Requirement 1.3 - Test duplicate removal
      const apiRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test',
        stargazers_count: 10,
        forks_count: 5,
        language: 'TypeScript',
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
        topics: ['TypeScript', 'react', 'TypeScript', 'nodejs'],
      };

      const technologies = extractTechnologies(apiRepo);

      expect(technologies).toContain('TypeScript');
      expect(technologies).toContain('react');
      expect(technologies).toContain('nodejs');
      // TypeScript should appear only once
      const typeScriptCount = technologies.filter(t => t === 'TypeScript').length;
      expect(typeScriptCount).toBe(1);
      expect(technologies.length).toBe(3);
    });

    it('should handle empty topics array', () => {
      // Requirement 1.3 - Test empty topics
      const apiRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test',
        stargazers_count: 10,
        forks_count: 5,
        language: 'JavaScript',
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
        topics: [],
      };

      const technologies = extractTechnologies(apiRepo);

      expect(technologies).toContain('JavaScript');
      expect(technologies.length).toBe(1);
    });

    it('should handle undefined topics', () => {
      // Requirement 1.3 - Test undefined topics
      const apiRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test',
        stargazers_count: 10,
        forks_count: 5,
        language: 'Python',
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
        topics: undefined,
      };

      const technologies = extractTechnologies(apiRepo);

      expect(technologies).toContain('Python');
      expect(technologies.length).toBe(1);
    });

    it('should return unique technologies', () => {
      // Requirement 1.3 - Test uniqueness
      const apiRepo: GitHubApiRepository = {
        id: 1,
        name: 'test-repo',
        description: 'Test',
        stargazers_count: 10,
        forks_count: 5,
        language: 'Go',
        html_url: 'https://github.com/testuser/test-repo',
        updated_at: '2024-01-01T00:00:00Z',
        private: false,
        topics: ['docker', 'kubernetes', 'docker', 'Go'],
      };

      const technologies = extractTechnologies(apiRepo);

      // Should have unique values only
      const uniqueTechnologies = Array.from(new Set(technologies));
      expect(technologies.length).toBe(uniqueTechnologies.length);
      expect(technologies).toContain('Go');
      expect(technologies).toContain('docker');
      expect(technologies).toContain('kubernetes');
      expect(technologies.length).toBe(3);
    });
  });
});
