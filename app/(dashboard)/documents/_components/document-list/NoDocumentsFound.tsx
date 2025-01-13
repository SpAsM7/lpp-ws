import { FileX2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface NoDocumentsFoundProps {
  message?: string;
  description?: string;
}

export function NoDocumentsFound({
  message = 'No documents found',
  description = 'There are no documents matching your criteria.',
}: NoDocumentsFoundProps) {
  return (
    <Alert className="my-8">
      <FileX2 className="h-4 w-4" />
      <AlertTitle>{message}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
} 