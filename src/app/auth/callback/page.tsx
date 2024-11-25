"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code")
      const type = searchParams.get("type")
      console.log("Callback page loaded with code:", code?.slice(0, 10) + "...")
      console.log("Type:", type)

      if (!code) {
        console.log("No code found, redirecting to login")
        router.replace("/auth/login?error=No authorization code found")
        return
      }

      try {
        console.log("Processing authentication callback")
        const response = await fetch(`/api/auth/callback?code=${code}&type=${type || ''}`)
        const data = await response.json()
        
        if (!response.ok) {
          console.error("Authentication error:", data.error)
          router.replace(`/auth/login?error=${encodeURIComponent(data.error)}`)
          return
        }
        
        // If this is a recovery flow, redirect to update password
        if (data.type === "recovery") {
          console.log("Recovery flow detected, redirecting to update password")
          router.replace("/auth/update-password")
          return
        }
        
        console.log("Authentication successful, redirecting to home")
        router.replace("/")
      } catch (error) {
        console.error("Error in callback:", error)
        router.replace("/auth/login?error=Failed to process authentication")
      }
    }

    processCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
