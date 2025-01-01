"use client"

import { ErrorBoundary } from "@/components/layout/error-boundary"

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorBoundary error={error}>{null}</ErrorBoundary>
}
