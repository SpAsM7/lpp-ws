import { useQuery } from '@tanstack/react-query';
import { getDocumentsForUser } from '@/lib/actions/documents/get-documents-for-user';
import type { Document, DocumentListOptions } from '../types';

export const DOCUMENTS_QUERY_KEY = ['documents'] as const;

/**
 * Hook to fetch and manage document list data
 */
export function useDocumentList(supabaseId: string, options?: DocumentListOptions) {
  return useQuery({
    queryKey: [...DOCUMENTS_QUERY_KEY, supabaseId, options],
    queryFn: () => getDocumentsForUser(supabaseId, options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    select: (response) => response.data,
    enabled: !!supabaseId,
  });
} 