import { Suspense } from "react"
import { VerifyForm } from "../_components/verify-form"
import { AuthLoading } from "@/components/loading/auth-loading"

export default function VerifyPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Verify Email
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the verification code sent to your email
        </p>
      </div>
      <Suspense fallback={<AuthLoading />}>
        <VerifyForm className="mt-8" />
      </Suspense>
    </>
  )
}
