import { getAirtableClient } from '@/lib/airtable/client';
import { filesTable } from '@/lib/airtable/schemas';
import type { FilesFields } from '@/types/airtable-types';
import type { DocumentActionResponse } from '../types';
import { validateRecordAccess } from '@/lib/airtable/utils/validate-access';
import { transformAttachment } from '@/lib/airtable/utils/transforms';

/**
 * Get the attachment URL for a document
 */
export async function getAttachmentUrl(
  documentId: string,
  supabaseId: string
): Promise<DocumentActionResponse<string>> {
  try {
    // Get the cached client instance
    const airtable = getAirtableClient();

    // Query the document
    const records = await airtable.scan<FilesFields>(filesTable, {
      filterByFormula: `RECORD_ID() = '${documentId}'`,
      maxRecords: 1,
      view: 'Grid view',
      fields: [
        'file_title',
        'file_name',
        'description',
        'portco',
        'account',
        'investment',
        'document',
        'type',
        'status',
        'access',
        'user_id',
        'date'
      ]
    });

    if (!records.length) {
      return {
        success: false,
        message: 'Document not found',
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          details: 'Document not found'
        }
      };
    }

    // Validate access using centralized utility
    const hasAccess = validateRecordAccess(records[0], supabaseId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Access denied',
        error: {
          code: 'ACCESS_DENIED',
          details: 'User does not have access to this document'
        }
      };
    }

    const attachment = transformAttachment(records[0].document || null);
    if (!attachment?.[0]?.url) {
      return {
        success: false,
        message: 'Document has no attachment',
        error: {
          code: 'DOCUMENT_NOT_FOUND',
          details: 'Document has no attachment URL'
        }
      };
    }

    return {
      success: true,
      message: 'Document URL retrieved successfully',
      data: attachment[0].url
    };

  } catch (error) {
    console.error('Error in getAttachmentUrl:', error);
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