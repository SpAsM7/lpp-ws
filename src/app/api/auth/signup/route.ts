import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/lib/validations/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = signUpSchema.parse(json);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        emailRedirectTo: `${request.headers.get("origin")}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to sign up. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Check your email to confirm your account" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request. Please check your input." },
      { status: 400 }
    );
  }
}
