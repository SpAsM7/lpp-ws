'use server';

import { getDocumentsForUser } from '@/lib/domains/documents/services/document-service';
import type { Document, DocumentListOptions, DocumentActionResponse } from '@/lib/domains/documents/types';

/**
 * Server action to search documents
 */
export async function searchDocuments(
  query: string,
  supabaseId: string,
  options?: DocumentListOptions
): Promise<DocumentActionResponse<Document[]>> {
  try {
    // Use the getDocumentsForUser service with search query
    return await getDocumentsForUser(supabaseId, {
      ...options,
      searchQuery: query,
    });
  } catch (error) {
    console.error('Server Action Error - searchDocuments:', error);
    return {
      success: false,
      message: 'Failed to search documents',
      error: {
        code: 'FETCH_ERROR',
        details: error
      }
    };
  }
} 