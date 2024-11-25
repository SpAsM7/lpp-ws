import { createClient } from "@/lib/supabase/client"
import type { SignUpInput } from "@/lib/validations/auth"

interface AuthError {
  message: string;
  action?: string;
  details?: any;
}

interface AuthResponse<T = any> {
  data?: T;
  error?: AuthError;
}

export async function signUp(data: SignUpInput): Promise<AuthResponse> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: result.error || "Failed to sign up",
          action: "Please try again or contact support if the problem persists",
          details: result.details
        },
      };
    }

    return { data: result };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      error: {
        message: "An unexpected error occurred",
        action: "Please check your internet connection and try again",
        details: error instanceof Error ? error.message : "Unknown error"
      },
    };
  }
}

export async function handleAuthCallback(code: string, type?: string): Promise<AuthResponse> {
  try {
    const url = new URL("/api/auth/callback", window.location.origin);
    url.searchParams.set("code", code);
    if (type) url.searchParams.set("type", type);

    const response = await fetch(url.toString());
    const result = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: result.error || "Failed to authenticate",
          action: "Please try signing in again",
          details: result.details
        },
      };
    }

    return { data: result };
  } catch (error) {
    console.error("Auth callback error:", error);
    return {
      error: {
        message: "Failed to sign in",
        action: "Please try again or contact support if the problem persists",
        details: error instanceof Error ? error.message : "Unknown error"
      },
    };
  }
}
