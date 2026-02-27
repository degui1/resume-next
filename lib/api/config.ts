/**
 * Shared configuration management utilities for API integrations
 * 
 * This module provides generic utilities for reading, validating, and managing
 * configuration from environment variables. It uses a factory pattern to create
 * service-specific configuration readers that can be customized with:
 * - Environment variable mappings
 * - Default values
 * - Custom validators
 * - Required field definitions
 * 
 * @module config
 */

/**
 * Maps configuration keys to environment variable names
 * 
 * @example
 * const mapping: ConfigMapping = {
 *   username: 'GITHUB_USERNAME',
 *   token: 'GITHUB_TOKEN',
 *   revalidate: 'GITHUB_REVALIDATE'
 * };
 */
export interface ConfigMapping {
  [key: string]: string;
}

/**
 * Configuration reader interface
 * 
 * Provides methods for reading, validating, and checking configuration.
 * 
 * @template T - The configuration type
 */
export interface ConfigReader<T> {
  /**
   * Read configuration from environment variables
   * 
   * @returns Complete configuration object with defaults applied
   */
  read(): T;

  /**
   * Validate and normalize a partial configuration object
   * 
   * @param config - Partial configuration to validate
   * @returns Complete, validated configuration object
   */
  validate(config: Partial<T>): T;

  /**
   * Check if required configuration fields are present
   * 
   * @param config - Configuration to check
   * @returns True if all required fields are present and valid
   */
  isConfigured(config: T): boolean;
}

/**
 * Options for creating a configuration reader
 * 
 * @template T - The configuration type
 */
export interface ConfigReaderOptions<T> {
  /**
   * Maps configuration keys to environment variable names
   */
  mapping: ConfigMapping;

  /**
   * Default values for configuration fields
   */
  defaults: Partial<T>;

  /**
   * Custom validators for specific fields
   * Each validator receives the raw value and returns the validated/normalized value
   */
  validators?: {
    [K in keyof T]?: (value: unknown) => T[K];
  };

  /**
   * List of required field names
   * The isConfigured method will check that these fields have valid values
   */
  requiredFields?: (keyof T)[];
}

/**
 * Parse a numeric value from environment variable or other source
 * 
 * Converts string values to numbers and validates that the result is a valid number.
 * Returns the default value if parsing fails or the value is invalid.
 * 
 * @param value - Value to parse (typically from environment variable)
 * @param defaultValue - Default value to use if parsing fails
 * @returns Parsed number or default value
 * 
 * @example
 * const revalidate = parseNumber(process.env.REVALIDATE, 3600);
 * // If REVALIDATE="7200", returns 7200
 * // If REVALIDATE="invalid", returns 3600
 * // If REVALIDATE is undefined, returns 3600
 */
export function parseNumber(value: unknown, defaultValue: number): number {
  if (typeof value === 'number') {
    return isNaN(value) ? defaultValue : value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  
  return defaultValue;
}

/**
 * Parse a comma-separated string into an array
 * 
 * Splits the string by commas, trims whitespace from each element,
 * and filters out empty strings. Returns undefined if the input is not a string
 * or if the resulting array is empty.
 * 
 * @param value - Value to parse (typically from environment variable)
 * @returns Array of strings or undefined
 * 
 * @example
 * const repos = parseStringArray('repo1, repo2, repo3');
 * // Returns ['repo1', 'repo2', 'repo3']
 * 
 * @example
 * const empty = parseStringArray('  ,  , ');
 * // Returns undefined (all empty after trimming)
 * 
 * @example
 * const invalid = parseStringArray(123);
 * // Returns undefined (not a string)
 */
export function parseStringArray(value: unknown): string[] | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  
  const array = value
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
  
  return array.length > 0 ? array : undefined;
}

/**
 * Parse a boolean value from environment variable or other source
 * 
 * Converts string values like 'true', 'false', '1', '0' to boolean.
 * Returns the default value if the input is not a recognized boolean value.
 * 
 * @param value - Value to parse (typically from environment variable)
 * @param defaultValue - Default value to use if parsing fails
 * @returns Parsed boolean or default value
 * 
 * @example
 * const enabled = parseBoolean(process.env.ENABLED, false);
 * // If ENABLED="true" or "1", returns true
 * // If ENABLED="false" or "0", returns false
 * // If ENABLED is undefined or invalid, returns false
 */
export function parseBoolean(value: unknown, defaultValue: boolean): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === '1') {
      return true;
    }
    if (lower === 'false' || lower === '0') {
      return false;
    }
  }
  
  return defaultValue;
}

/**
 * Create a configuration reader for a specific service
 * 
 * Factory function that creates a ConfigReader instance with service-specific
 * configuration. The reader can read from environment variables, validate
 * configuration objects, and check if required fields are present.
 * 
 * @template T - The configuration type
 * @param options - Configuration reader options
 * @returns ConfigReader instance
 * 
 * @example
 * // GitHub configuration reader
 * interface GitHubConfig {
 *   username: string;
 *   token?: string;
 *   revalidate: number;
 *   repositoryFilter?: string[];
 *   fallbackToMock: boolean;
 * }
 * 
 * const githubConfigReader = createConfigReader<GitHubConfig>({
 *   mapping: {
 *     username: 'GITHUB_USERNAME',
 *     token: 'GITHUB_TOKEN',
 *     revalidate: 'GITHUB_REVALIDATE',
 *     repositoryFilter: 'GITHUB_REPOSITORIES'
 *   },
 *   defaults: {
 *     revalidate: 3600,
 *     fallbackToMock: true
 *   },
 *   validators: {
 *     revalidate: (value) => parseNumber(value, 3600),
 *     repositoryFilter: (value) => parseStringArray(value)
 *   },
 *   requiredFields: ['username']
 * });
 * 
 * // Read configuration from environment
 * const config = githubConfigReader.read();
 * 
 * // Validate partial configuration
 * const validated = githubConfigReader.validate({ username: 'octocat' });
 * 
 * // Check if configured
 * if (githubConfigReader.isConfigured(config)) {
 *   // Use real API
 * }
 * 
 * @example
 * // YouTube configuration reader
 * interface YouTubeConfig {
 *   apiKey: string;
 *   channelId?: string;
 *   revalidate: number;
 *   maxResults: number;
 *   fallbackToMock: boolean;
 * }
 * 
 * const youtubeConfigReader = createConfigReader<YouTubeConfig>({
 *   mapping: {
 *     apiKey: 'YOUTUBE_API_KEY',
 *     channelId: 'YOUTUBE_CHANNEL_ID',
 *     revalidate: 'YOUTUBE_REVALIDATE',
 *     maxResults: 'YOUTUBE_MAX_RESULTS'
 *   },
 *   defaults: {
 *     revalidate: 3600,
 *     maxResults: 10,
 *     fallbackToMock: true
 *   },
 *   validators: {
 *     revalidate: (value) => parseNumber(value, 3600),
 *     maxResults: (value) => parseNumber(value, 10)
 *   },
 *   requiredFields: ['apiKey']
 * });
 * 
 * const config = youtubeConfigReader.read();
 */
export function createConfigReader<T extends Record<string, unknown>>(
  options: ConfigReaderOptions<T>
): ConfigReader<T> {
  const { mapping, defaults, validators, requiredFields = [] } = options;

  /**
   * Read configuration from environment variables
   */
  function read(): T {
    const config: Record<string, unknown> = { ...defaults };

    // Read values from environment variables
    for (const [key, envVar] of Object.entries(mapping)) {
      const value = process.env[envVar];
      
      // Always try to apply validator if available, otherwise use raw value
      if (validators && key in validators) {
        const validator = validators[key as keyof T];
        if (validator) {
          config[key] = validator(value);
        }
      } else if (value !== undefined) {
        // Store raw value if no validator
        config[key] = value;
      }
    }

    // Return as-is since we already applied validators during read
    return { ...defaults, ...config } as T;
  }

  /**
   * Validate and normalize a partial configuration object
   */
  function validate(config: Partial<T>): T {
    const validated: Record<string, unknown> = { ...defaults, ...config };

    // Apply validators to all fields that have them
    if (validators) {
      for (const key of Object.keys(validators) as (keyof T)[]) {
        const validator = validators[key];
        if (validator) {
          const value = validated[key as string];
          validated[key as string] = validator(value);
        }
      }
    }

    return validated as T;
  }

  /**
   * Check if required configuration fields are present
   */
  function isConfigured(config: T): boolean {
    for (const field of requiredFields) {
      const value = config[field];
      
      // Check if value is present and not empty
      if (value === undefined || value === null) {
        return false;
      }
      
      // For strings, check if non-empty
      if (typeof value === 'string' && value.trim().length === 0) {
        return false;
      }
      
      // For arrays, check if non-empty
      if (Array.isArray(value) && value.length === 0) {
        return false;
      }
    }
    
    return true;
  }

  return {
    read,
    validate,
    isConfigured
  };
}
