import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthLoading } from "@/components/loading/auth-loading"

export default function ResetPasswordPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we will send you a reset link
        </p>
      </div>
      <Suspense fallback={<AuthLoading />}>
        <ResetPasswordForm className="mt-8" />
      </Suspense>
    </>
  )
}
