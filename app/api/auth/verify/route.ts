import { createRouteHandlerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const verifySchema = z.object({
  token: z.string(),
  type: z.enum(["signup", "recovery", "invite"]),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = verifySchema.parse(json)

    const supabase = await createRouteHandlerClient()

    if (body.type === "signup") {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: body.token,
        type: "signup",
      })

      if (error) {
        return NextResponse.json(
          { error: "Invalid or expired verification link" },
          { status: 400 }
        )
      }
    }

    if (body.type === "recovery") {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: body.token,
        type: "recovery",
      })

      if (error) {
        return NextResponse.json(
          { error: "Invalid or expired recovery link" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
