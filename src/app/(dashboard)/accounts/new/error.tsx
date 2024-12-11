"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log to error reporting service
    console.error("Account page error:", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      digest: error?.digest,
    })
  }, [error])

  const handleReset = () => {
    try {
      reset()
    } catch (e) {
      // If reset fails, refresh the page
      router.refresh()
    }
  }

  return (
    <div className="container mx-auto p-6 min-h-[400px] flex flex-col items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <Icons.warning className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-muted-foreground">
            {error?.message || "An error occurred while loading the account page."}
          </p>
          {process.env.NODE_ENV === "development" && error?.stack && (
            <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-950 p-4 text-left text-xs text-white">
              {error.stack}
            </pre>
          )}
          <Button 
            onClick={handleReset}
            className="mt-4"
          >
            Try again
          </Button>
        </div>
      </Card>
    </div>
  )
}
