/**
 * Unit Tests for Formatting Utilities
 * Feature: github-integration
 * 
 * Tests specific examples and edge cases for number and date formatting.
 */

import { formatLargeNumber, formatNumber } from '@/lib/api/formatters';

describe('Formatting Utilities', () => {
  describe('formatLargeNumber', () => {
    it('should return numbers less than 1000 as-is', () => {
      // Requirement 5.5 - Numbers below threshold
      expect(formatLargeNumber(0)).toBe('0');
      expect(formatLargeNumber(1)).toBe('1');
      expect(formatLargeNumber(42)).toBe('42');
      expect(formatLargeNumber(999)).toBe('999');
    });

    it('should format thousands with k suffix', () => {
      // Requirement 5.5 - Thousands formatting
      expect(formatLargeNumber(1000)).toBe('1k');
      expect(formatLargeNumber(1500)).toBe('1.5k');
      expect(formatLargeNumber(1234)).toBe('1.2k');
      expect(formatLargeNumber(5300)).toBe('5.3k');
      expect(formatLargeNumber(9999)).toBe('10k');
    });

    it('should format millions with M suffix', () => {
      // Requirement 5.5 - Millions formatting
      expect(formatLargeNumber(1000000)).toBe('1M');
      expect(formatLargeNumber(1500000)).toBe('1.5M');
      expect(formatLargeNumber(5300000)).toBe('5.3M');
      expect(formatLargeNumber(12340000)).toBe('12.3M');
      expect(formatLargeNumber(999999999)).toBe('1000M');
    });

    it('should format with at most one decimal place', () => {
      // Requirement 5.5 - Decimal place limit
      expect(formatLargeNumber(1234)).toBe('1.2k'); // 1.234k rounded to 1.2k
      expect(formatLargeNumber(1567)).toBe('1.6k'); // 1.567k rounded to 1.6k
      expect(formatLargeNumber(1999)).toBe('2k'); // 1.999k rounded to 2k
    });

    it('should remove trailing .0 from formatted numbers', () => {
      // Requirement 5.5 - Clean formatting
      expect(formatLargeNumber(1000)).toBe('1k'); // Not "1.0k"
      expect(formatLargeNumber(2000)).toBe('2k'); // Not "2.0k"
      expect(formatLargeNumber(1000000)).toBe('1M'); // Not "1.0M"
      expect(formatLargeNumber(5000000)).toBe('5M'); // Not "5.0M"
    });

    it('should handle edge cases at boundaries', () => {
      // Requirement 5.5 - Boundary values
      expect(formatLargeNumber(999)).toBe('999'); // Just below 1k
      expect(formatLargeNumber(1000)).toBe('1k'); // Exactly 1k
      expect(formatLargeNumber(999999)).toBe('1000k'); // Just below 1M
      expect(formatLargeNumber(1000000)).toBe('1M'); // Exactly 1M
    });

    it('should handle very large numbers', () => {
      // Requirement 5.5 - Large numbers
      expect(formatLargeNumber(10000000)).toBe('10M');
      expect(formatLargeNumber(100000000)).toBe('100M');
      expect(formatLargeNumber(1000000000)).toBe('1000M');
    });
  });

  describe('formatNumber', () => {
    it('should format integers in English locale', () => {
      // Requirement 7.5 - English number formatting
      expect(formatNumber(1234, 'en')).toBe('1,234');
      expect(formatNumber(1234567, 'en')).toBe('1,234,567');
      expect(formatNumber(999, 'en')).toBe('999');
    });

    it('should format integers in Portuguese locale', () => {
      // Requirement 7.5 - Portuguese number formatting
      expect(formatNumber(1234, 'pt')).toBe('1.234');
      expect(formatNumber(1234567, 'pt')).toBe('1.234.567');
      expect(formatNumber(999, 'pt')).toBe('999');
    });

    it('should format decimals in English locale', () => {
      // Requirement 7.5 - English decimal formatting
      expect(formatNumber(1234.56, 'en')).toBe('1,234.56');
      expect(formatNumber(0.99, 'en')).toBe('0.99');
      expect(formatNumber(1000000.123, 'en')).toBe('1,000,000.123');
    });

    it('should format decimals in Portuguese locale', () => {
      // Requirement 7.5 - Portuguese decimal formatting
      expect(formatNumber(1234.56, 'pt')).toBe('1.234,56');
      expect(formatNumber(0.99, 'pt')).toBe('0,99');
      expect(formatNumber(1000000.123, 'pt')).toBe('1.000.000,123');
    });

    it('should handle zero', () => {
      // Requirement 7.5 - Zero handling
      expect(formatNumber(0, 'en')).toBe('0');
      expect(formatNumber(0, 'pt')).toBe('0');
    });

    it('should handle negative numbers', () => {
      // Requirement 7.5 - Negative numbers
      expect(formatNumber(-1234, 'en')).toBe('-1,234');
      expect(formatNumber(-1234, 'pt')).toBe('-1.234');
      expect(formatNumber(-1234.56, 'en')).toBe('-1,234.56');
      expect(formatNumber(-1234.56, 'pt')).toBe('-1.234,56');
    });

    it('should handle very large numbers', () => {
      // Requirement 7.5 - Large numbers
      expect(formatNumber(1000000000, 'en')).toBe('1,000,000,000');
      expect(formatNumber(1000000000, 'pt')).toBe('1.000.000.000');
    });

    it('should handle numbers with many decimal places', () => {
      // Requirement 7.5 - Multiple decimal places
      expect(formatNumber(123.456789, 'en')).toBe('123.457');
      expect(formatNumber(123.456789, 'pt')).toBe('123,457');
    });
  });
});
