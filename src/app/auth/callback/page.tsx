"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AuthLoading } from "@/components/auth/auth-loading"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      console.log("Callback page loaded with code:", code)

      if (!code) {
        console.log("No code found, redirecting to login")
        router.replace("/login?error=No authorization code found")
        return
      }

      try {
        console.log("Making API call to /api/auth/callback")
        const response = await fetch(`/api/auth/callback?code=${code}`)
        const data = await response.json()
        console.log("API response:", data)
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to authenticate")
        }
        
        console.log("Authentication successful, redirecting to home")
        router.replace("/home")
      } catch (error) {
        console.error("Error in callback:", error)
        router.replace("/login?error=Failed to sign in")
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthLoading />
    </div>
  )
}
