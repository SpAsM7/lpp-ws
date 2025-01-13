'use server';

import { getDocumentsByCompany as getByCompany } from '@/lib/domains/documents/services/document-service';
import type { Document, DocumentListOptions } from '@/lib/domains/documents/types';

/**
 * Server action to get documents for a specific company
 */
export async function getDocumentsByCompany(
  companyId: string,
  supabaseId: string,
  options?: DocumentListOptions
) {
  return getByCompany(companyId, supabaseId, options);
} 