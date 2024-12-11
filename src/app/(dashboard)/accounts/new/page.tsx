import { Suspense } from "react"
import { WizardProvider } from "@/lib/contexts/account-wizard"
import { AccountWizard } from "@/components/accounts/new-account/AccountWizard"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { preloadAccountTypes } from "@/lib/services/accounts"

// Preload data
preloadAccountTypes()

function LoadingState() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </Card>
  )
}

export default function NewAccountPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Open New Account</h1>
        <p className="text-zinc-500">Complete the form below to open a new investment account</p>
      </div>

      <WizardProvider>
        <Suspense fallback={<LoadingState />}>
          <AccountWizard />
        </Suspense>
      </WizardProvider>
    </div>
  )
}

// Add server-side error logging
export function generateMetadata() {
  try {
    return {
      title: "Open New Account | LP Portal",
      description: "Create a new investment account"
    }
  } catch (error) {
    // Log error to error reporting service
    console.error("Error generating metadata:", error)
    return {
      title: "Open New Account | LP Portal",
      description: "Create a new investment account"
    }
  }
}
