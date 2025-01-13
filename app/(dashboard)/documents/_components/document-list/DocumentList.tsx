'use client';

import { useEffect, useState } from 'react';
import { useDocumentList } from '@/lib/domains/documents/hooks/use-document-list';
import { getAttachmentUrl } from '@/lib/domains/documents/services/get-attachment-url';
import { NoDocumentsFound } from './NoDocumentsFound';
import { DocumentListSkeleton } from './DocumentListSkeleton';
import { DocumentPreview } from '../document-preview/DocumentPreview';
import type { Document } from '@/lib/domains/documents/types';

export function DocumentList() {
  const [userId, setUserId] = useState<string>();
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  
  // Get current user ID from session
  useEffect(() => {
    const getUserId = async () => {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUserId();
  }, []);

  const { data: documents, isLoading } = useDocumentList(userId || '', {});

  const handlePreview = (document: Document) => {
    setPreviewDocument(document);
  };

  const handleDownload = async (document: Document) => {
    if (!userId) return;
    const result = await getAttachmentUrl(document.id, userId);
    if (result.success && result.data) {
      window.open(result.data, '_blank');
    }
  };

  if (isLoading) {
    return <DocumentListSkeleton />;
  }

  if (!documents?.length) {
    return (
      <NoDocumentsFound 
        message="No documents found"
        description="There are no documents available"
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {documents.map((document) => (
          <div key={document.id} className="flex justify-between items-center p-4 border rounded">
            <div>
              <h3 className="font-medium">{document.title}</h3>
              <p className="text-sm text-gray-500">{document.type}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handlePreview(document)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50"
              >
                Preview
              </button>
              <button
                onClick={() => handleDownload(document)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {previewDocument && (
        <DocumentPreview
          document={previewDocument}
          isOpen={true}
          onClose={() => setPreviewDocument(null)}
          onDownload={handleDownload}
        />
      )}
    </>
  );
} 