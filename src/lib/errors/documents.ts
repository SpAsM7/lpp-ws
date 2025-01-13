export const DocumentErrorMessages = {
  FETCH_ERROR: 'Failed to fetch documents',
  NOT_FOUND: 'Document not found',
  ACCESS_DENIED: 'You do not have access to this document',
  INVALID_ATTACHMENT: 'Document attachment is invalid or missing',
  SEARCH_ERROR: 'Failed to search documents',
  PREVIEW_ERROR: 'Failed to preview document',
  DOWNLOAD_ERROR: 'Failed to download document',
  FILTER_ERROR: 'Failed to filter documents',
} as const;

export type DocumentErrorCode = keyof typeof DocumentErrorMessages;

export type DocumentError = {
  code: DocumentErrorCode;
  details?: unknown;
};

export function getDocumentErrorMessage(error: DocumentError): string {
  return DocumentErrorMessages[error.code] || 'An unknown error occurred';
} 