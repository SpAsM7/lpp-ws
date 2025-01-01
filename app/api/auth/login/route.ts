import { createRouteHandlerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = loginSchema.parse(json)

    const supabase = await createRouteHandlerClient()

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    })

    if (signInError) {
      return NextResponse.json(
        { error: "Invalid login credentials" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
    })
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
