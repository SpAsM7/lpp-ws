import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { newAccountSchema } from "@/lib/schemas/account"
import type { Database } from "@/types/database"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const json = await request.json()

    // Validate request body
    const validatedData = newAccountSchema.parse(json)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Insert new account
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .insert({
        ...validatedData,
        created_by: user.id,
        updated_by: user.id,
        status: "pending_review" // New accounts require compliance review
      })
      .select()
      .single()

    if (accountError) {
      console.error("Error creating account:", accountError)
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      )
    }

    // Create activity log entry
    const { error: activityError } = await supabase
      .from("activities")
      .insert({
        account_id: account.id,
        activity_type: "account_created",
        description: "New account created",
        created_by: user.id
      })

    if (activityError) {
      console.error("Error creating activity log:", activityError)
      // Don't fail the request if activity log fails
    }

    return NextResponse.json(account)
  } catch (error) {
    console.error("Error in account creation:", error)
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  }
}
