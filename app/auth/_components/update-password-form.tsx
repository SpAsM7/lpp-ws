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
import { updatePasswordSchema, type UpdatePasswordInput } from "@/types/auth"
import { useToast } from "@/components/ui/use-toast"
import { updatePasswordAction } from "@/lib/actions/auth/update-password"

interface UpdatePasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UpdatePasswordForm({ className, ...props }: UpdatePasswordFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
  })

  const onSubmit = async (data: UpdatePasswordInput) => {
    setIsLoading(true)

    try {
      const result = await updatePasswordAction(data)

      if (!result.success) {
        if (result.error?.includes("session")) {
          toast({
            title: "Session Expired",
            description: "Your password reset link has expired. Please request a new one.",
            variant: "destructive",
          })
          router.push('/auth/reset-password')
          return
        }

        setError("root", { 
          type: "manual",
          message: result.error
        })
        return
      }

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
        variant: "success",
      })

      router.push('/auth/login')
    } catch (error) {
      console.error("Error updating password:", error)
      setError("root", { 
        type: "manual",
        message: error instanceof Error ? error.message : "Failed to update password"
      })
    } finally {
      setIsLoading(false)
    }
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
            <Label htmlFor="password">New Password</Label>
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
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Update Password
          </Button>
        </div>
      </form>
    </div>
  )
}
