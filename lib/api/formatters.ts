import { format, parseISO, isValid } from 'date-fns';
import type { Locale } from '@/lib/i18n/locales';

/**
 * Format large numbers with k/M suffixes
 * Numbers >= 1000 are formatted with appropriate suffix and at most one decimal place
 * 
 * @param value - The number to format
 * @returns Formatted string with suffix (e.g., "1.2k", "5.3M")
 * 
 * @example
 * formatLargeNumber(999) // "999"
 * formatLargeNumber(1000) // "1k"
 * formatLargeNumber(1234) // "1.2k"
 * formatLargeNumber(1000000) // "1M"
 * formatLargeNumber(5300000) // "5.3M"
 */
export function formatLargeNumber(value: number): string {
  if (value < 1000) {
    return value.toString();
  }
  
  if (value >= 1000000) {
    const millions = value / 1000000;
    // Round to one decimal place
    const rounded = Math.round(millions * 10) / 10;
    // Format with at most one decimal place, removing trailing zeros
    const formatted = rounded.toFixed(1);
    return formatted.endsWith('.0') 
      ? `${Math.round(millions)}M` 
      : `${formatted}M`;
  }
  
  const thousands = value / 1000;
  // Round to one decimal place
  const rounded = Math.round(thousands * 10) / 10;
  // Format with at most one decimal place, removing trailing zeros
  const formatted = rounded.toFixed(1);
  return formatted.endsWith('.0') 
    ? `${Math.round(thousands)}k` 
    : `${formatted}k`;
}

/**
 * Format dates according to locale conventions using date-fns
 * 
 * @param date - The date to format (Date object or ISO string)
 * @param locale - The locale to use for formatting ('en' or 'pt')
 * @returns Formatted date string according to locale
 * 
 * @example
 * formatDate(new Date('2024-01-15'), 'en') // "1/15/2024" (US format)
 * formatDate(new Date('2024-01-15'), 'pt') // "15/01/2024" (Brazilian format)
 */
export function formatDate(date: Date | string, locale: Locale): string {
  let dateObj: Date;
  
  // Parse string dates
  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }
  
  // Check for invalid date
  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }
  
  // Format based on locale
  // US format: M/d/yyyy (e.g., 1/15/2024)
  // Brazilian format: dd/MM/yyyy (e.g., 15/01/2024)
  const formatString = locale === 'pt' ? 'dd/MM/yyyy' : 'M/d/yyyy';
  
  return format(dateObj, formatString);
}

/**
 * Format numbers according to locale conventions
 * Handles decimal separators and thousands separators based on locale
 * 
 * @param value - The number to format
 * @param locale - The locale to use for formatting ('en' or 'pt')
 * @returns Formatted number string according to locale
 * 
 * @example
 * formatNumber(1234.56, 'en') // "1,234.56" (US format)
 * formatNumber(1234.56, 'pt') // "1.234,56" (Brazilian format)
 */
export function formatNumber(value: number, locale: Locale): string {
  // Use Intl.NumberFormat for locale-specific number formatting
  const formatter = new Intl.NumberFormat(locale === 'pt' ? 'pt-BR' : 'en-US');
  
  return formatter.format(value);
}
