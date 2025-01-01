import { Suspense } from "react"
import { LoginForm } from "../_components/login-form"
import { AuthLoading } from "@/components/loading/auth-loading"

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Log In
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose your preferred way to sign in
        </p>
      </div>
      <Suspense fallback={<AuthLoading />}>
        <LoginForm className="mt-8" />
      </Suspense>
    </>
  )
}
