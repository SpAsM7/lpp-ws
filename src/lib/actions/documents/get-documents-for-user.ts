'use server';

import { getDocumentsForUser as getDocuments } from '@/lib/domains/documents/services/document-service';
import type { Document, DocumentListOptions, DocumentActionResponse } from '@/lib/domains/documents/types';

/**
 * Server action to get documents for a user
 */
export async function getDocumentsForUser(
  supabaseId: string,
  options?: DocumentListOptions
): Promise<DocumentActionResponse<Document[]>> {
  try {
    return await getDocuments(supabaseId, options);
  } catch (error) {
    console.error('Server Action Error - getDocumentsForUser:', error);
    return {
      success: false,
      message: 'Failed to retrieve documents',
      error: {
        code: 'FETCH_ERROR',
        details: error
      }
    };
  }
} 