import { Suspense } from "react"
import { UpdatePasswordForm } from "../_components/update-password-form"
import { AuthLoading } from "@/components/loading/auth-loading"

export default function UpdatePasswordPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Update Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>
      <Suspense fallback={<AuthLoading />}>
        <UpdatePasswordForm className="mt-8" />
      </Suspense>
    </>
  )
}
