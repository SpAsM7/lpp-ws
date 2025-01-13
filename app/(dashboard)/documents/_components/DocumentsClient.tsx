'use client';

import { useState } from 'react';
import { DocumentSearch } from './document-search/DocumentSearch';
import { DocumentsTable } from './documents-table';
import { DocumentPreview } from './document-preview/DocumentPreview';
import { useDocumentSearch } from '@/lib/domains/documents/hooks/use-document-search';
import { getAttachmentUrl } from '@/lib/actions/documents/get-attachment-url';
import type { Document, DocumentSearchParams } from '@/lib/domains/documents/types';

interface DocumentsClientProps {
  userId: string;
  initialDocuments: Document[];
}

export function DocumentsClient({ userId, initialDocuments }: DocumentsClientProps) {
  const [searchParams, setSearchParams] = useState<DocumentSearchParams>({
    query: '',
    filters: {
      type: [],
      dateRange: {
        start: '',
        end: '',
      },
    },
  });
  const [previewDocument, setPreviewDocument] = useState<Document>();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: documents, isLoading } = useDocumentSearch(
    searchParams.query,
    userId,
    {
      type: searchParams.filters?.type?.[0],
      startDate: searchParams.filters?.dateRange?.start,
      endDate: searchParams.filters?.dateRange?.end,
    }
  );

  const handleTypeChange = (type: string | undefined) => {
    setSearchParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        type: type ? [type] : [],
      },
    }));
  };

  const handleDateChange = (dates: { startDate?: Date; endDate?: Date }) => {
    setSearchParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        dateRange: {
          start: dates.startDate?.toISOString() || '',
          end: dates.endDate?.toISOString() || '',
        },
      },
    }));
  };

  const handleDownload = async (document: Document) => {
    const result = await getAttachmentUrl(document.id, userId);
    if (result.success && result.data) {
      window.open(result.data, '_blank');
    }
  };

  const handlePreview = (document: Document) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Documents</h1>
      <DocumentSearch
        searchParams={searchParams}
        onTypeChange={handleTypeChange}
        onDateChange={handleDateChange}
      />
      <DocumentsTable 
        userId={userId} 
        documents={documents || initialDocuments} 
        isLoading={isLoading}
        onPreview={handlePreview}
        onDownload={handleDownload}
      />
      {previewDocument && (
        <DocumentPreview
          document={previewDocument}
          isOpen={isPreviewOpen}
          onClose={() => {
            setPreviewDocument(undefined);
            setIsPreviewOpen(false);
          }}
          onDownload={() => handleDownload(previewDocument)}
        />
      )}
    </div>
  );
} 