import { useQuery } from '@tanstack/react-query';
import { searchDocuments } from '@/lib/actions/documents/search-documents';
import type { Document, DocumentListOptions, DocumentSearchParams } from '../types';

export const DOCUMENT_SEARCH_KEY = ['documents', 'search'] as const;

/**
 * Hook to search documents with filters
 */
export function useDocumentSearch(
  query: string,
  supabaseId: string,
  options?: DocumentListOptions
) {
  return useQuery({
    queryKey: [...DOCUMENT_SEARCH_KEY, query, supabaseId, options],
    queryFn: () => searchDocuments(query, supabaseId, options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    select: (response) => response.data,
    enabled: !!supabaseId && !!query,
  });
} 