'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getDocumentErrorMessage } from '@/lib/errors/documents';
import type { DocumentError } from '@/lib/errors/documents';

export default function DocumentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string } & { error?: DocumentError };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Documents page error:', error);
  }, [error]);

  const errorMessage = error.error
    ? getDocumentErrorMessage(error.error)
    : error.message || 'Something went wrong';

  return (
    <div className="container mx-auto p-4">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
      <div className="mt-4">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
} 