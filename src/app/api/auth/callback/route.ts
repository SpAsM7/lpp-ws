import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  console.log("API route hit: /api/auth/callback")
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  console.log("Received code:", code?.slice(0, 10) + "...")

  if (!code) {
    console.log("No code provided")
    return NextResponse.json(
      { error: "No authorization code found" },
      { status: 400 }
    )
  }

  try {
    console.log("Creating Supabase client")
    const supabase = await createClient()
    console.log("Exchanging code for session")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log("Exchange result:", error ? "Error" : "Success", error?.message || "")
    
    if (error) {
      console.error("Auth error:", error.message)
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      )
    }

    console.log("Session created successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in callback route:", error)
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 }
    )
  }
}
