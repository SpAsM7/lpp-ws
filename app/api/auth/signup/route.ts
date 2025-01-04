import { createRouteHandlerClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/lib/supabase/auth/validations";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const json = await request.json();
    const body = signUpSchema.parse(json);

    // Initialize Supabase client
    const supabase = await createRouteHandlerClient();
    
    // Attempt signup
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        emailRedirectTo: `${request.headers.get("origin")}/auth/callback`,
      },
    });

    if (signUpError) {
      console.error("Supabase signup error:", signUpError);
      return NextResponse.json(
        { 
          error: signUpError.message || "Failed to sign up. Please try again.",
          details: signUpError
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Check your email to confirm your account",
        data 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup route error:", error);

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: "Invalid input data",
          details: error.errors 
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { 
        error: "An unexpected error occurred. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
