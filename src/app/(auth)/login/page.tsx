"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    // Handle hash fragment from magic link
    if (typeof window !== "undefined" && window.location.hash) {
      console.log("Found hash fragment, processing authentication...")
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get("access_token")
      const refreshToken = hashParams.get("refresh_token")
      
      if (accessToken && refreshToken) {
        const supabase = createClient()
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        }).then(({ error }) => {
          if (error) {
            console.error("Error setting session:", error)
            return
          }
          console.log("Session set successfully")
          router.replace("/home")
        })
      }
    }
  }, [router])

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to sign in to your account
        </p>
      </div>
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      <LoginForm />
    </>
  )
}
