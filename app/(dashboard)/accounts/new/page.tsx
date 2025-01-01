import { Suspense } from "react"
import { WizardProvider } from "@/lib/domains/accounts/contexts/account-wizard"
import { AccountWizard } from "@/lib/features/wizards/AccountWizard"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { preloadAccountTypes } from "@/lib/domains/accounts/services/accounts"

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
