'use client';

import { Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Document } from '@/lib/domains/documents/types';
import { formatDate } from '@/lib/utils/date';

interface DocumentListItemProps {
  document: Document;
  onPreview: (document: Document) => void;
  onDownload: (document: Document) => void;
}

export function DocumentListItem({
  document,
  onPreview,
  onDownload,
}: DocumentListItemProps) {
  return (
    <TableRow>
      <TableCell>{document.title}</TableCell>
      <TableCell>{document.type}</TableCell>
      <TableCell>{formatDate(document.date)}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPreview(document)}
            title="Preview document"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload(document)}
            title="Download document"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
} 