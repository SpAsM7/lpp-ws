'use server';

import { getDocumentById as getDocument } from '@/lib/domains/documents/services/document-service';
import type { DocumentWithRelations } from '@/lib/domains/documents/types';

/**
 * Server action to get a single document by ID
 */
export async function getDocumentById(
  documentId: string,
  supabaseId: string
) {
  return getDocument(documentId, supabaseId);
} 