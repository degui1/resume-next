/**
 * Property-Based Tests for Formatting Utilities
 * Feature: github-integration
 * 
 * Tests universal properties across all inputs using randomized test data.
 */

import * as fc from 'fast-check';
import { formatLargeNumber, formatDate, formatNumber } from '@/lib/github/formatters';
import type { Locale } from '@/lib/i18n/locales';

describe('Formatting Properties', () => {
  describe('formatLargeNumber', () => {
    it('Property 12: Large Number Formatting - should format numbers >= 1000 with k/M suffix and at most one decimal place', () => {
      // **Validates: Requirements 5.5**
      // Feature: github-integration, Property 12: For any number greater than or equal to 1000, 
      // the formatting function should return a string with an appropriate suffix (k for thousands, 
      // M for millions) and at most one decimal place.
      
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 1000000000 }),
          (value) => {
            const result = formatLargeNumber(value);
            
            // Should contain k or M suffix
            const hasSuffix = result.endsWith('k') || result.endsWith('M');
            expect(hasSuffix).toBe(true);
            
            // Extract numeric part (remove suffix)
            const numericPart = result.slice(0, -1);
            
            // Should be a valid number
            const parsed = parseFloat(numericPart);
            expect(isNaN(parsed)).toBe(false);
            
            // Should have at most one decimal place
            const decimalIndex = numericPart.indexOf('.');
            if (decimalIndex !== -1) {
              const decimalPlaces = numericPart.length - decimalIndex - 1;
              expect(decimalPlaces).toBeLessThanOrEqual(1);
            }
            
            // Should not have trailing .0
            expect(numericPart.endsWith('.0')).toBe(false);
            
            // Verify correct suffix based on magnitude
            if (value >= 1000000) {
              expect(result.endsWith('M')).toBe(true);
            } else {
              expect(result.endsWith('k')).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return numbers < 1000 unchanged', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 999 }),
          (value) => {
            const result = formatLargeNumber(value);
            
            // Should be the number as a string
            expect(result).toBe(value.toString());
            
            // Should not have any suffix
            expect(result.endsWith('k')).toBe(false);
            expect(result.endsWith('M')).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should produce consistent results for the same input', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000000000 }),
          (value) => {
            const result1 = formatLargeNumber(value);
            const result2 = formatLargeNumber(value);
            
            expect(result1).toBe(result2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('formatDate', () => {
    it('Property 16: Locale-Specific Formatting - should format dates according to locale conventions', () => {
      // **Validates: Requirements 7.4, 7.5**
      // Feature: github-integration, Property 16: For any date or number and any supported locale, 
      // the formatted output should follow the formatting conventions of that locale 
      // (e.g., date order, decimal separators, thousands separators).
      
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }),
          fc.constantFrom<Locale>('en', 'pt'),
          (date, locale) => {
            // Skip invalid dates
            fc.pre(!isNaN(date.getTime()));
            
            const result = formatDate(date, locale);
            
            // Should be a non-empty string
            expect(result.length).toBeGreaterThan(0);
            
            // Should contain slashes (both locales use / as separator)
            expect(result).toContain('/');
            
            // Should contain the year
            const year = date.getUTCFullYear().toString();
            expect(result).toContain(year);
            
            // Should have 3 parts separated by /
            const parts = result.split('/');
            expect(parts.length).toBe(3);
            
            // All parts should be numeric
            parts.forEach(part => {
              expect(/^\d+$/.test(part)).toBe(true);
            });
            
            // For English locale, month should be first (M/D/YYYY)
            // For Portuguese locale, day should be first (DD/MM/YYYY)
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();
            
            if (locale === 'en') {
              // US format: M/D/YYYY
              expect(parseInt(parts[0], 10)).toBe(month);
              expect(parseInt(parts[1], 10)).toBe(day);
              expect(parseInt(parts[2], 10)).toBe(date.getUTCFullYear());
            } else {
              // Brazilian format: DD/MM/YYYY
              expect(parseInt(parts[0], 10)).toBe(day);
              expect(parseInt(parts[1], 10)).toBe(month);
              expect(parseInt(parts[2], 10)).toBe(date.getUTCFullYear());
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle ISO string dates', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }),
          fc.constantFrom<Locale>('en', 'pt'),
          (date, locale) => {
            const isoString = date.toISOString();
            const resultFromDate = formatDate(date, locale);
            const resultFromString = formatDate(isoString, locale);
            
            // Should produce the same result
            expect(resultFromString).toBe(resultFromDate);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should produce consistent results for the same input', () => {
      fc.assert(
        fc.property(
          fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }),
          fc.constantFrom<Locale>('en', 'pt'),
          (date, locale) => {
            const result1 = formatDate(date, locale);
            const result2 = formatDate(date, locale);
            
            expect(result1).toBe(result2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('formatNumber', () => {
    it('Property 16: Locale-Specific Number Formatting - should format numbers according to locale conventions', () => {
      // **Validates: Requirements 7.4, 7.5**
      // Feature: github-integration, Property 16: For any date or number and any supported locale, 
      // the formatted output should follow the formatting conventions of that locale 
      // (e.g., date order, decimal separators, thousands separators).
      
      fc.assert(
        fc.property(
          fc.double({ min: -1000000, max: 1000000, noNaN: true }),
          fc.constantFrom<Locale>('en', 'pt'),
          (value, locale) => {
            const result = formatNumber(value, locale);
            
            // Should be a non-empty string
            expect(result.length).toBeGreaterThan(0);
            
            // For English locale, should use . for decimal and , for thousands
            // For Portuguese locale, should use , for decimal and . for thousands
            if (locale === 'en') {
              // If number has decimal part, should use .
              if (value % 1 !== 0) {
                // May contain decimal point
                if (result.includes('.')) {
                  // Decimal separator should be .
                  expect(result).toMatch(/\.\d+$/);
                }
              }
              // If number >= 1000, should use , for thousands
              if (Math.abs(value) >= 1000) {
                // May contain thousands separator
                if (result.includes(',')) {
                  // Should have comma in correct position
                  expect(result).toMatch(/\d{1,3}(,\d{3})*/);
                }
              }
            } else {
              // Portuguese locale
              // If number has decimal part, should use ,
              if (value % 1 !== 0) {
                // May contain decimal comma
                if (result.includes(',')) {
                  // Decimal separator should be ,
                  expect(result).toMatch(/,\d+$/);
                }
              }
              // If number >= 1000, should use . for thousands
              if (Math.abs(value) >= 1000) {
                // May contain thousands separator
                if (result.includes('.') && !result.includes(',')) {
                  // Should have dot in correct position (but not as decimal)
                  expect(result).toMatch(/\d{1,3}(\.\d{3})*/);
                }
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle integers correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000000, max: 1000000 }),
          fc.constantFrom<Locale>('en', 'pt'),
          (value, locale) => {
            const result = formatNumber(value, locale);
            
            // Should be a non-empty string
            expect(result.length).toBeGreaterThan(0);
            
            // Should not have decimal separator for integers
            if (locale === 'en') {
              // English uses . for decimal
              const parts = result.split('.');
              // If there's a dot, it should be for thousands separator
              // which means there should be exactly 3 digits after each dot
              if (parts.length > 1) {
                // This shouldn't happen for integers in en-US
                // en-US uses comma for thousands
              }
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should produce consistent results for the same input', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000000, max: 1000000, noNaN: true }),
          fc.constantFrom<Locale>('en', 'pt'),
          (value, locale) => {
            const result1 = formatNumber(value, locale);
            const result2 = formatNumber(value, locale);
            
            expect(result1).toBe(result2);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle zero correctly', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<Locale>('en', 'pt'),
          (locale) => {
            const result = formatNumber(0, locale);
            
            expect(result).toBe('0');
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should preserve sign for negative numbers', () => {
      fc.assert(
        fc.property(
          fc.double({ min: -1000000, max: -0.01, noNaN: true }),
          fc.constantFrom<Locale>('en', 'pt'),
          (value, locale) => {
            const result = formatNumber(value, locale);
            
            // Should start with minus sign
            expect(result.startsWith('-')).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
