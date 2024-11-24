import { Suspense } from "react"
import { SignUpForm } from "@/components/auth/signup-form"
import { AuthLoading } from "@/components/loading/auth-loading"

export default function SignUpPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <Suspense fallback={<AuthLoading />}>
        <SignUpForm className="mt-8" />
      </Suspense>
    </>
  )
}
