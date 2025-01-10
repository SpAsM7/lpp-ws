"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/features/ui/utils/styles"
import { Icons } from "@/components/ui/icons"
import { resetRequestSchema, type ResetRequestInput } from "@/types/auth"
import { useToast } from "@/components/ui/use-toast"
import { createResetRequestAction } from "@/lib/actions/auth/create-reset-request"

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetRequestInput>({
    resolver: zodResolver(resetRequestSchema),
  })

  const onSubmit = async (data: ResetRequestInput) => {
    setIsLoading(true)

    try {
      const result = await createResetRequestAction(data)

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
        variant: "success",
      })

      router.push('/auth/login')
    } catch (error) {
      console.error("Error requesting password reset:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reset link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-4">
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
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Reset Link
          </Button>
        </div>
      </form>
    </div>
  )
}
