'use server';

import { getAttachmentUrl as getUrl } from '@/lib/domains/documents/services/get-attachment-url';
import type { DocumentActionResponse } from '@/lib/domains/documents/types';

/**
 * Server action to get a document's attachment URL
 */
export async function getAttachmentUrl(
  documentId: string,
  supabaseId: string
): Promise<DocumentActionResponse<string>> {
  try {
    return await getUrl(documentId, supabaseId);
  } catch (error) {
    console.error('Server Action Error - getAttachmentUrl:', error);
    return {
      success: false,
      message: 'Failed to retrieve document URL',
      error: {
        code: 'FETCH_ERROR',
        details: error
      }
    };
  }
} 