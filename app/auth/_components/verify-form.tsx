"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/features/ui/utils/styles"
import { Icons } from "@/components/ui/icons"
import { useToast } from "@/components/ui/use-toast"
import { verifyEmailAction } from "@/lib/actions/auth/verify-email"
import { AUTH_ERRORS } from "@/lib/errors/auth"

const VERIFY_MESSAGES = {
  signup: "Your email has been verified. You can now log in.",
  invite: "Your account has been verified. You can now log in.",
  recovery: "Your email has been verified. You can now reset your password.",
} as const

const EXPIRED_MESSAGES = {
  signup: "Your verification link has expired. Please sign up again.",
  invite: "Your verification link has expired. Please sign up again.",
  recovery: "Your password reset link has expired. Please request a new one.",
} as const

interface VerifyFormProps extends React.HTMLAttributes<HTMLDivElement> {
  token: string
  type: "signup" | "invite" | "recovery"
}

export function VerifyForm({ className, token, type, ...props }: VerifyFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await verifyEmailAction({ token, type })

      if (!result.success) {
        // Special case: If token is expired/invalid, redirect to signup
        if (result.error?.includes("token")) {
          toast({
            title: "Invalid or Expired Link",
            description: EXPIRED_MESSAGES[type],
            variant: "destructive",
          })
          router.push(type === "recovery" ? '/auth/reset-password' : '/auth/signup')
          return
        }

        setError(result.error || AUTH_ERRORS.INVALID_REQUEST.message)
        return
      }

      toast({
        title: "Success",
        description: VERIFY_MESSAGES[type],
        variant: "success",
      })

      // Redirect based on verification type
      router.push(type === "recovery" ? '/auth/update-password' : '/auth/login')
    } catch (error) {
      console.error("Error verifying email:", error)
      setError(error instanceof Error ? error.message : AUTH_ERRORS.INVALID_REQUEST.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={cn("grid gap-6", className)} {...props}>
        <div className="grid gap-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-4">
        {error && (
          <Alert variant="destructive">
            {error}
          </Alert>
        )}
        <Button 
          onClick={onSubmit} 
          disabled={isLoading}
          className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Verify Email
        </Button>
      </div>
    </div>
  )
}
