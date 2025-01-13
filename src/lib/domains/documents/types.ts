import { z } from 'zod';
import type { FilesFields } from '@/types/airtable-types';

// Zod schema for document validation
export const documentSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  fileName: z.string().nullable(),
  type: z.array(z.string()).nullable(),
  status: z.string().nullable(),
  date: z.string().nullable(),
  documentUrl: z.string().nullable(),
});

export const documentWithRelationsSchema = documentSchema.extend({
  portco: z.string().nullable(),
  account: z.string().nullable(),
  investment: z.string().nullable(),
});

// Base document interface that matches normalized data structure
export type Document = z.infer<typeof documentSchema>;

// Extended interface that includes relations
export type DocumentWithRelations = z.infer<typeof documentWithRelationsSchema>;

// Document error codes
export const DocumentErrorCode = {
  FETCH_ERROR: 'FETCH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DOCUMENT_NOT_FOUND: 'DOCUMENT_NOT_FOUND',
  ACCESS_DENIED: 'ACCESS_DENIED',
  TRANSFORM_ERROR: 'TRANSFORM_ERROR',
  INVALID_ATTACHMENT: 'INVALID_ATTACHMENT',
} as const;

export type DocumentErrorCode = typeof DocumentErrorCode[keyof typeof DocumentErrorCode];

// Type for document action responses
export type DocumentActionResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: DocumentErrorCode;
    details?: unknown;
  };
};

// Options for document list queries
export interface DocumentListOptions {
  page?: number;
  limit?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

// Options for document transformations
export interface DocumentTransformOptions {
  includeRelations?: boolean;
}

// Search parameters for documents
export interface DocumentSearchParams {
  query: string;
  filters: {
    type: string[];
    dateRange: {
      start: string;
      end: string;
    };
  };
} 