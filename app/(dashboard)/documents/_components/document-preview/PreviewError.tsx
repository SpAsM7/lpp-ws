import { FileX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PreviewErrorProps {
  message: string;
}

export function PreviewError({ message }: PreviewErrorProps) {
  return (
    <Alert variant="destructive" className="mt-4">
      <FileX className="h-4 w-4" />
      <AlertTitle>Preview Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
} 