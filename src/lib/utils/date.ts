import { format, parseISO } from 'date-fns';

/**
 * Formats a date string into a human-readable format
 */
export function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  try {
    return format(parseISO(date), 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
} 