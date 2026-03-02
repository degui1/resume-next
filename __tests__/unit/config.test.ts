/**
 * Unit tests for configuration management utilities
 * 
 * Tests the createConfigReader factory function and utility validators
 */

import {
  createConfigReader,
  parseNumber,
  parseStringArray,
  parseBoolean,
  type ConfigMapping,
  type ConfigReaderOptions,
} from '@/lib/api/config';

describe('Configuration Utilities', () => {
  describe('parseNumber', () => {
    it('should parse valid numeric strings', () => {
      expect(parseNumber('42', 0)).toBe(42);
      expect(parseNumber('3600', 0)).toBe(3600);
    });

    it('should return default for invalid values', () => {
      expect(parseNumber('invalid', 100)).toBe(100);
      expect(parseNumber(undefined, 100)).toBe(100);
      expect(parseNumber(null, 100)).toBe(100);
    });

    it('should handle numeric values directly', () => {
      expect(parseNumber(42, 0)).toBe(42);
      expect(parseNumber(NaN, 100)).toBe(100);
    });
  });

  describe('parseStringArray', () => {
    it('should parse comma-separated strings', () => {
      expect(parseStringArray('a,b,c')).toEqual(['a', 'b', 'c']);
      expect(parseStringArray('repo1, repo2, repo3')).toEqual(['repo1', 'repo2', 'repo3']);
    });

    it('should trim whitespace', () => {
      expect(parseStringArray('  a  ,  b  ,  c  ')).toEqual(['a', 'b', 'c']);
    });

    it('should return undefined for empty or invalid values', () => {
      expect(parseStringArray('')).toBeUndefined();
      expect(parseStringArray('  ,  , ')).toBeUndefined();
      expect(parseStringArray(undefined)).toBeUndefined();
      expect(parseStringArray(123)).toBeUndefined();
    });
  });

  describe('parseBoolean', () => {
    it('should parse boolean strings', () => {
      expect(parseBoolean('true', false)).toBe(true);
      expect(parseBoolean('false', true)).toBe(false);
      expect(parseBoolean('1', false)).toBe(true);
      expect(parseBoolean('0', true)).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(parseBoolean('TRUE', false)).toBe(true);
      expect(parseBoolean('False', true)).toBe(false);
    });

    it('should return default for invalid values', () => {
      expect(parseBoolean('invalid', true)).toBe(true);
      expect(parseBoolean(undefined, false)).toBe(false);
    });

    it('should handle boolean values directly', () => {
      expect(parseBoolean(true, false)).toBe(true);
      expect(parseBoolean(false, true)).toBe(false);
    });
  });

  describe('createConfigReader', () => {
    type TestConfig = {
      username: string;
      token?: string;
      revalidate: number;
      repositories?: string[];
      enabled: boolean;
    }

    const testOptions: ConfigReaderOptions<TestConfig> = {
      mapping: {
        username: 'TEST_USERNAME',
        token: 'TEST_TOKEN',
        revalidate: 'TEST_REVALIDATE',
        repositories: 'TEST_REPOSITORIES',
        enabled: 'TEST_ENABLED',
      },
      defaults: {
        username: '',
        revalidate: 3600,
        enabled: true,
      },
      validators: {
        revalidate: (value) => parseNumber(value, 3600),
        repositories: (value) => parseStringArray(value),
        enabled: (value) => parseBoolean(value, true),
      },
      requiredFields: ['username'],
    };

    it('should create a config reader with read, validate, and isConfigured methods', () => {
      const reader = createConfigReader(testOptions);
      
      expect(reader).toHaveProperty('read');
      expect(reader).toHaveProperty('validate');
      expect(reader).toHaveProperty('isConfigured');
      expect(typeof reader.read).toBe('function');
      expect(typeof reader.validate).toBe('function');
      expect(typeof reader.isConfigured).toBe('function');
    });

    it('should validate partial configuration with defaults', () => {
      const reader = createConfigReader(testOptions);
      
      const config = reader.validate({ username: 'testuser' });
      
      expect(config.username).toBe('testuser');
      expect(config.revalidate).toBe(3600);
      expect(config.enabled).toBe(true);
    });

    it('should apply validators during validation', () => {
      const reader = createConfigReader(testOptions);
      
      const config = reader.validate({
        username: 'testuser',
        revalidate: 'invalid' as any,
      });
      
      expect(config.revalidate).toBe(3600); // Should use default due to invalid value
    });

    it('should check if configuration is complete', () => {
      const reader = createConfigReader<TestConfig>(testOptions);
      
      const completeConfig: TestConfig = {
        username: 'testuser',
        revalidate: 3600,
        enabled: true,
      };
      
      const incompleteConfig: TestConfig = {
        username: '',
        revalidate: 3600,
        enabled: true,
      };
      
      expect(reader.isConfigured(completeConfig)).toBe(true);
      expect(reader.isConfigured(incompleteConfig)).toBe(false);
    });

    it('should read configuration from environment variables', () => {
      // Set up environment variables
      process.env.TEST_USERNAME = 'envuser';
      process.env.TEST_TOKEN = 'secret-token';
      process.env.TEST_REVALIDATE = '7200';
      process.env.TEST_REPOSITORIES = 'repo1,repo2';
      process.env.TEST_ENABLED = 'false';
      
      const reader = createConfigReader(testOptions);
      const config = reader.read();
      
      expect(config.username).toBe('envuser');
      expect(config.token).toBe('secret-token');
      expect(config.revalidate).toBe(7200);
      expect(config.repositories).toEqual(['repo1', 'repo2']);
      expect(config.enabled).toBe(false);
      
      // Clean up
      delete process.env.TEST_USERNAME;
      delete process.env.TEST_TOKEN;
      delete process.env.TEST_REVALIDATE;
      delete process.env.TEST_REPOSITORIES;
      delete process.env.TEST_ENABLED;
    });
  });
});
