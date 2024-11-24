import { createClient } from "@/lib/supabase/client"
import type { SignUpInput } from "@/lib/validations/auth"

interface AuthError {
  message: string;
  action?: string;
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
        },
      };
    }

    return { data: result };
  } catch (error) {
    return {
      error: {
        message: "An unexpected error occurred",
        action: "Please check your internet connection and try again",
      },
    };
  }
}

export async function handleAuthCallback(code: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`/api/auth/callback?code=${code}`);
    const result = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: result.error || "Failed to authenticate",
          action: "Please try signing in again",
        },
      };
    }

    return { data: result };
  } catch (error) {
    return {
      error: {
        message: "Failed to sign in",
        action: "Please try again or contact support if the problem persists",
      },
    };
  }
}
