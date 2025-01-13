'use server';

import { getDocumentsForUser } from '@/lib/domains/documents/services/document-service';
import type { Document, DocumentListOptions } from '@/lib/domains/documents/types';

/**
 * Server action to get documents of a specific type
 */
export async function getDocumentsByType(
  type: string,
  supabaseId: string,
  options?: DocumentListOptions
) {
  // Use the getDocumentsForUser service with type filter
  return getDocumentsForUser(supabaseId, {
    ...options,
    type,
  });
} 