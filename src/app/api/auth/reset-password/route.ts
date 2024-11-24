import { createRouteHandlerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { z } from "zod"

const resetPasswordSchema = z.object({
  email: z.string().email(),
})

const updatePasswordSchema = z.object({
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = resetPasswordSchema.parse(json)

    const supabase = await createRouteHandlerClient()

    const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      return NextResponse.json(
        { error: "Error sending reset password email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Reset password email sent",
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

export async function PUT(request: Request) {
  try {
    const json = await request.json()
    const body = updatePasswordSchema.parse(json)

    const supabase = await createRouteHandlerClient()

    const { error } = await supabase.auth.updateUser({
      password: body.password,
    })

    if (error) {
      return NextResponse.json(
        { error: "Error updating password" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Password updated successfully",
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
