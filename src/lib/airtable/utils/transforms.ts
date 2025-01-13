import { z } from 'zod';

// Types
export type AirtableAttachment = {
  url: string;
  filename: string;
};

/**
 * Transform attachment field from string[] to AirtableAttachment[]
 * Handles both single attachments and arrays
 */
export function transformAttachment(value: string[] | null): AirtableAttachment[] | null {
  if (!value) return null;
  return value.map(url => ({
    url,
    filename: url.split('/').pop() || ''
  }));
}

/**
 * Transform rollup field to ensure consistent array handling
 * Handles both single values and arrays from Airtable
 */
export function transformRollup(value: unknown): string[] | null {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  return [String(value)];
}

/**
 * Transform linked record field to array of IDs
 * Handles both single links and arrays
 */
export function transformLink(value: string | string[] | null): string[] | null {
  if (!value) return null;
  return Array.isArray(value) ? value : [value];
}

// Zod schemas for runtime validation
export const AttachmentSchema = z.object({
  url: z.string(),
  filename: z.string()
}).array().nullable();

export const RollupSchema = z.array(z.string()).nullable();

export const LinkSchema = z.array(z.string()).nullable(); 