import type { FilesFields } from '@/types/airtable-types';
import type { Document, DocumentWithRelations } from '../types';
import { documentSchema, documentWithRelationsSchema } from '../types';
import { transformAttachment, transformLink } from '@/lib/airtable/utils/transforms';

/**
 * Transforms an Airtable document record into our domain Document type
 */
export function transformAirtableDocument(
  record: FilesFields,
  options: { includeRelations?: boolean } = {}
): Document | DocumentWithRelations {
  const attachment = transformAttachment(record.document || null);
  
  const baseDocument = {
    id: record.id,
    title: record.file_title || null,
    fileName: record.file_name || null,
    type: record.type || null,
    status: record.status || null,
    date: record.date || null,
    documentUrl: attachment?.[0]?.url || null,
  };

  if (options.includeRelations) {
    const documentWithRelations = {
      ...baseDocument,
      portco: transformLink(record.portco || null)?.[0] || null,
      account: transformLink(record.account || null)?.[0] || null,
      investment: transformLink(record.investment || null)?.[0] || null,
    };

    // Validate with the relations schema
    return documentWithRelationsSchema.parse(documentWithRelations);
  }

  // Validate with the base schema
  return documentSchema.parse(baseDocument);
}

/**
 * Transforms multiple Airtable records into domain Document types
 */
export function transformAirtableDocuments(
  records: FilesFields[],
  options: { includeRelations?: boolean } = {}
): Document[] {
  return records.map(record => transformAirtableDocument(record, options) as Document);
} 