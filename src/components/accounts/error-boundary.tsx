"use client";

import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function AccountsErrorBoundary({
  error,
  reset,
}: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Account error:", error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-2xl mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          We encountered an error while loading this page. This could be due to a temporary issue or network problem.
        </p>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={reset}
            className="gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/"}
          >
            Return home
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="font-mono text-sm text-muted-foreground">
              {error.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
