"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Icons } from "@/components/ui/icons"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AuthLoading() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4 max-w-md w-full mx-auto">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <a href="/login" className="text-sm text-primary hover:underline">
          Return to login
        </a>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <Icons.spinner className="h-12 w-12 animate-spin text-primary" />
      <h2 className="text-lg font-semibold text-foreground">
        Verifying your login...
      </h2>
      <p className="text-sm text-muted-foreground">
        Please wait while we securely sign you in
      </p>
    </div>
  )
}
