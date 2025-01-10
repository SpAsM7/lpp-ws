"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/features/ui/utils/styles"
import { Icons } from "@/components/ui/icons"
import { signUpSchema, type SignUpInput } from "@/types/auth"
import { useToast } from "@/components/ui/use-toast"
import { createSignUpAction } from "@/lib/actions/auth/create-signup"
import { AUTH_ERRORS } from "@/lib/errors/auth"

const SIGNUP_MESSAGES = {
  success: {
    title: "Check your email",
    description: "Please check your email to verify your account."
  }
} as const

interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true)

    try {
      const result = await createSignUpAction(data)

      if (!result.success) {
        setError("root", { 
          type: "manual",
          message: result.error || AUTH_ERRORS.INVALID_REQUEST.message
        })
        return
      }

      toast({
        title: SIGNUP_MESSAGES.success.title,
        description: SIGNUP_MESSAGES.success.description,
        variant: "success",
      })

      router.push('/auth/login')
    } catch (error) {
      console.error("Error signing up:", error)
      setError("root", { 
        type: "manual",
        message: error instanceof Error ? error.message : AUTH_ERRORS.UNKNOWN.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={cn("grid gap-6", className)} {...props}>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4">
          {errors.root?.message && (
            <Alert variant="destructive">
              {errors.root.message}
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Icons.mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                disabled={isLoading}
                {...register("email")}
                className={cn(
                  "pl-10",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  errors.email ? "border-destructive" : ""
                )}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Icons.key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                {...register("password")}
                className={cn(
                  "pl-10",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  errors.password ? "border-destructive" : ""
                )}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Icons.key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                {...register("confirmPassword")}
                className={cn(
                  "pl-10",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  errors.confirmPassword ? "border-destructive" : ""
                )}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button 
            disabled={isLoading}
            className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Create Account
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary underline hover:text-primary/90 transition-colors"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}
