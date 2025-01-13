import type { BaseFields } from '@/types/airtable-types';

/**
 * Validates if a user has access to an Airtable record based on their Supabase ID
 * This is the security boundary for all Airtable record access
 * @param record - Any Airtable record that includes user_id field
 * @param supabaseId - The user's Supabase UUID
 */
export function validateRecordAccess<T extends BaseFields & { user_id?: string | null }>(
  record: T,
  supabaseId: string
): boolean {
  if (!record.user_id) return false;
  
  // Check if the user's ID exists in the comma-separated list
  const userIds = record.user_id.split(',').map(id => id.trim());
  return userIds.includes(supabaseId);
}

/**
 * Filters an array of Airtable records to only those the user has access to
 * @param records - Array of Airtable records that include user_id field
 * @param supabaseId - The user's Supabase UUID
 */
export function filterRecordsByAccess<T extends BaseFields & { user_id?: string | null }>(
  records: T[],
  supabaseId: string
): T[] {
  return records.filter(record => validateRecordAccess(record, supabaseId));
} 