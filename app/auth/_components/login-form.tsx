"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"

import { Alert } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/features/ui/utils/styles"
import { Icons } from "@/components/ui/icons"
import { loginSchema, magicLinkSchema, type LoginInput, type MagicLinkInput } from "@/lib/supabase/auth/validations"
import { useToast } from "@/lib/features/notifications/use-toast"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const {
    register: registerMagicLink,
    handleSubmit: handleMagicLinkSubmit,
    formState: { errors: magicLinkErrors },
  } = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
  })

  const onPasswordSubmit = async (data: LoginInput) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to sign in")
      }

      toast({
        title: "Success",
        description: "You have been signed in successfully.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onMagicLinkSubmit = async (data: MagicLinkInput) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to send magic link")
      }

      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error sending magic link:", error)
      toast({
        title: "Error",
        description: "Failed to send magic link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Tabs defaultValue="password" className="space-y-6">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
        </TabsList>
        <div className="min-h-[280px]">
          <TabsContent value="password">
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} noValidate>
              <div className="grid gap-4">
                {passwordErrors.root?.message && (
                  <Alert variant="destructive">
                    {passwordErrors.root.message}
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
                      {...registerPassword("email")}
                      className={cn(
                        "pl-10",
                        passwordErrors.email ? "border-destructive" : ""
                      )}
                    />
                  </div>
                  {passwordErrors.email && (
                    <p className="text-sm text-destructive">
                      {passwordErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/reset-password"
                      className="text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Icons.key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...registerPassword("password")}
                      className={cn(
                        "pl-10",
                        passwordErrors.password ? "border-destructive" : ""
                      )}
                    />
                  </div>
                  {passwordErrors.password && (
                    <p className="text-sm text-destructive">
                      {passwordErrors.password.message}
                    </p>
                  )}
                </div>
                <Button disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="magic-link">
            <form onSubmit={handleMagicLinkSubmit(onMagicLinkSubmit)} noValidate>
              <div className="grid gap-4">
                {magicLinkErrors.root?.message && (
                  <Alert variant="destructive">
                    {magicLinkErrors.root.message}
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
                      {...registerMagicLink("email")}
                      className={cn(
                        "pl-10",
                        magicLinkErrors.email ? "border-destructive" : ""
                      )}
                    />
                  </div>
                  {magicLinkErrors.email && (
                    <p className="text-sm text-destructive">
                      {magicLinkErrors.email.message}
                    </p>
                  )}
                </div>
                <Button disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Send Magic Link
                </Button>
              </div>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
