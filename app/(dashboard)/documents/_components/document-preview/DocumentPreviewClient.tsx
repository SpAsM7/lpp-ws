'use client';

import { DocumentPreview } from './DocumentPreview';
import { getAttachmentUrl } from '@/lib/actions/documents/get-attachment-url';
import type { Document } from '@/lib/domains/documents/types';

interface DocumentPreviewClientProps {
  document: Document;
  userId: string;
}

export function DocumentPreviewClient({ document, userId }: DocumentPreviewClientProps) {
  const handleDownload = async () => {
    const result = await getAttachmentUrl(document.id, userId);
    if (result.success && result.data) {
      window.open(result.data, '_blank');
    }
  };

  return (
    <DocumentPreview
      document={document}
      isOpen={true}
      onClose={() => window.history.back()}
      onDownload={handleDownload}
    />
  );
} 