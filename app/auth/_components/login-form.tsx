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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/features/ui/utils/styles"
import { Icons } from "@/components/ui/icons"
import { loginSchema, magicLinkSchema, type LoginInput, type MagicLinkInput } from "@/types/auth"
import { useToast } from "@/components/ui/use-toast"
import { createLoginAction } from "@/lib/actions/auth/create-login"
import { createMagicLinkAction } from "@/lib/actions/auth/create-magic-link"
import { AUTH_ERRORS } from "@/lib/errors/auth"

const LOGIN_MESSAGES = {
  magicLink: {
    title: "Check your email",
    description: "We've sent you a magic link to sign in."
  }
} as const

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    setError: setPasswordError,
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
      const result = await createLoginAction(data)

      if (!result.success) {
        setPasswordError("root", { 
          type: "manual",
          message: result.error || AUTH_ERRORS.INVALID_CREDENTIALS.message
        })
        return
      }

      // Redirect will be handled by the server action
      router.refresh()
    } catch (error) {
      console.error("Error signing in:", error)
      setPasswordError("root", { 
        type: "manual",
        message: error instanceof Error ? error.message : AUTH_ERRORS.UNKNOWN.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onMagicLinkSubmit = async (data: MagicLinkInput) => {
    setIsLoading(true)

    try {
      const result = await createMagicLinkAction(data)

      if (!result.success) {
        toast({
          title: "Authentication Error",
          description: result.error || AUTH_ERRORS.INVALID_REQUEST.message,
          variant: "destructive",
        })
        return
      }

      toast({
        title: LOGIN_MESSAGES.magicLink.title,
        description: LOGIN_MESSAGES.magicLink.description,
        variant: "success",
      })
    } catch (error) {
      console.error("Error sending magic link:", error)
      toast({
        title: "Authentication Error",
        description: error instanceof Error ? error.message : AUTH_ERRORS.INVALID_REQUEST.message,
        variant: "destructive",
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
        </div>
      </div>
    )
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
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
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
                    {process.env.NEXT_PUBLIC_FEATURE_FORGOT_PASSWORD === 'true' && (
                      <Link
                        href="/auth/reset-password"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Forgot password?
                      </Link>
                    )}
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
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
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
                <Button 
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
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
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
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
                <Button 
                  disabled={isLoading}
                  className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
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
