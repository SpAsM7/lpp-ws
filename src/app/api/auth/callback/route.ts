import { createRouteHandlerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  console.log("API route hit: /api/auth/callback")
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")
  console.log("Received code:", code?.slice(0, 10) + "...")
  console.log("Type:", type)

  if (!code) {
    console.log("No code provided")
    return NextResponse.json(
      { error: "No authorization code found" },
      { status: 400 }
    )
  }

  try {
    console.log("Creating Supabase client")
    const supabase = await createRouteHandlerClient()
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

    // For password reset flow, return success with type
    if (type === "recovery") {
      console.log("Recovery flow detected")
      return NextResponse.json({ 
        success: true,
        type: "recovery"
      })
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
