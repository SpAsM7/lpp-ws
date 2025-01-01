import { createRouteHandlerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const type = requestUrl.searchParams.get("type")

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code found" },
      { status: 400 }
    )
  }

  try {
    const supabase = await createRouteHandlerClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.json(
        { error: error.message || "Authentication failed" },
        { status: 401 }
      )
    }

    // For password reset flow, return success with type
    if (type === "recovery") {
      return NextResponse.json({ 
        success: true,
        type: "recovery"
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sign in" },
      { status: 500 }
    )
  }
}
