'use server';

import { getDocumentsByAccount as getByAccount } from '@/lib/domains/documents/services/document-service';
import type { Document, DocumentListOptions } from '@/lib/domains/documents/types';

/**
 * Server action to get documents for a specific account
 */
export async function getDocumentsByAccount(
  accountId: string,
  supabaseId: string,
  options?: DocumentListOptions
) {
  return getByAccount(accountId, supabaseId, options);
} 