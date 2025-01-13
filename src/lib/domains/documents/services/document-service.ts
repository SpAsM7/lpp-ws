import { getAirtableClient } from '@/lib/airtable/client';
import { filesTable } from '@/lib/airtable/schemas';
import type { FilesFields } from '@/types/airtable-types';
import type { Document, DocumentWithRelations, DocumentListOptions, DocumentActionResponse } from '../types';
import { transformAirtableDocument, transformAirtableDocuments } from './document-transform';
import { filterRecordsByAccess, validateRecordAccess } from '@/lib/airtable/utils/validate-access';
import { Table } from 'airtable-ts';

/**
 * Get documents for a specific user
 */
export async function getDocumentsForUser(
  supabaseId: string,
  options: DocumentListOptions = {}
): Promise<DocumentActionResponse<Document[]>> {
  try {
    const { page = 1, limit = 20, type, startDate, endDate, searchQuery } = options;

    // Build filter formula for non-access filters
    let filterFormula = '1=1'; // Always true base condition

    // Add type filter if specified
    if (type) {
      filterFormula = `AND(${filterFormula}, FIND('${type}', ARRAYJOIN({type}, ',')) > 0)`;
    }

    // Add date range filter if specified
    if (startDate && endDate) {
      filterFormula = `AND(${filterFormula}, IS_AFTER({date}, '${startDate}'), IS_BEFORE({date}, '${endDate}'))`;
    }

    // Add search query filter if specified
    if (searchQuery) {
      filterFormula = `AND(${filterFormula}, OR(
        FIND('${searchQuery.toLowerCase()}', LOWER({file_title})) > 0,
        FIND('${searchQuery.toLowerCase()}', LOWER({file_name})) > 0
      ))`;
    }

    // Get the cached client instance
    const airtable = getAirtableClient();

    // Query documents with pagination
    const records = await airtable.scan<FilesFields>(filesTable, {
      filterByFormula: filterFormula,
      maxRecords: limit,
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

    // Filter records by user access using the centralized utility
    const accessibleRecords = filterRecordsByAccess(records, supabaseId);

    // Log the number of records found
    console.log('Total records:', records.length);
    console.log('Accessible records:', accessibleRecords.length);

    return {
      success: true,
      message: 'Documents retrieved successfully',
      data: transformAirtableDocuments(accessibleRecords)
    };

  } catch (error) {
    console.error('Error in getDocumentsForUser:', error);
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

/**
 * Get a single document by ID
 */
export async function getDocumentById(
  documentId: string,
  supabaseId: string
): Promise<DocumentActionResponse<DocumentWithRelations>> {
  try {
    // Get the cached client instance
    const airtable = getAirtableClient();

    // Query the document by ID
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
          details: `Document with ID ${documentId} not found`
        }
      };
    }

    // Check if user has access to this document using the centralized utility
    const hasAccess = validateRecordAccess(records[0], supabaseId);
    if (!hasAccess) {
      return {
        success: false,
        message: 'Access denied',
        error: {
          code: 'ACCESS_DENIED',
          details: `User does not have access to document ${documentId}`
        }
      };
    }

    return {
      success: true,
      message: 'Document retrieved successfully',
      data: transformAirtableDocument(records[0], { includeRelations: true }) as DocumentWithRelations
    };

  } catch (error) {
    console.error('Error in getDocumentById:', error);
    return {
      success: false,
      message: 'Failed to retrieve document',
      error: {
        code: 'FETCH_ERROR',
        details: error
      }
    };
  }
}

/**
 * Get documents by company ID
 */
export async function getDocumentsByCompany(
  companyId: string,
  supabaseId: string,
  options: DocumentListOptions = {}
): Promise<DocumentActionResponse<Document[]>> {
  try {
    const { page = 1, limit = 20 } = options;

    // Get the cached client instance
    const airtable = getAirtableClient();

    // Query documents for this company
    const records = await airtable.scan<FilesFields>(filesTable, {
      filterByFormula: `{portco} = '${companyId}'`,
      maxRecords: limit,
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

    // Filter records by user access using the centralized utility
    const accessibleRecords = filterRecordsByAccess(records, supabaseId);

    return {
      success: true,
      message: 'Documents retrieved successfully',
      data: transformAirtableDocuments(accessibleRecords)
    };

  } catch (error) {
    console.error('Error in getDocumentsByCompany:', error);
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

/**
 * Get documents by account ID
 */
export async function getDocumentsByAccount(
  accountId: string,
  supabaseId: string,
  options: DocumentListOptions = {}
): Promise<DocumentActionResponse<Document[]>> {
  try {
    const { page = 1, limit = 20 } = options;

    // Get the cached client instance
    const airtable = getAirtableClient();

    // Query documents for this account
    const records = await airtable.scan<FilesFields>(filesTable, {
      filterByFormula: `{account} = '${accountId}'`,
      maxRecords: limit,
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

    // Filter records by user access using the centralized utility
    const accessibleRecords = filterRecordsByAccess(records, supabaseId);

    return {
      success: true,
      message: 'Documents retrieved successfully',
      data: transformAirtableDocuments(accessibleRecords)
    };

  } catch (error) {
    console.error('Error in getDocumentsByAccount:', error);
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