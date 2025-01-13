'use client';

import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DocumentPreviewSkeleton } from './DocumentPreviewSkeleton';
import { PreviewError } from './PreviewError';
import type { Document } from '@/lib/domains/documents/types';
import { formatDate } from '@/lib/utils/date';

interface DocumentPreviewProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (document: Document) => void;
}

export function DocumentPreview({
  document,
  isOpen,
  onClose,
  onDownload,
}: DocumentPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Failed to load document preview');
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{document.title}</DialogTitle>
              <div className="text-sm text-muted-foreground mt-1">
                {document.type} • {formatDate(document.date)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDownload(document)}
                title="Download document"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                title="Close preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="relative flex-1 mt-4">
          {isLoading && <DocumentPreviewSkeleton />}
          {error ? (
            <PreviewError message={error} />
          ) : (
            <iframe
              src={document.documentUrl}
              className="w-full h-full border rounded-lg"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 