"use server"

import { createClient } from "@/lib/supabase/server"
import { signUpSchema, type SignUpInput, type AuthActionState } from "@/types/auth"
import { logger, LOG_CATEGORY, LOG_ACTION } from "@/lib/logging"

/**
 * Server action for user signup with email and password
 * Uses Supabase's built-in auth and email verification
 */
export async function createSignUpAction(data: SignUpInput): Promise<AuthActionState> {
  try {
    // Validate input
    const validated = signUpSchema.parse(data)
    const supabase = await createClient()

    // Attempt signup
    const { error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?type=signup&next=/`
      }
    })

    if (error) {
      logger.error('Sign up failed', {
        category: LOG_CATEGORY.AUTH,
        action: LOG_ACTION.SIGNUP,
        error,
      })

      return {
        success: false,
        error: error.message
      }
    }

    logger.info('User signed up successfully', {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.SIGNUP,
      metadata: { email: validated.email }
    })

    return { success: true }

  } catch (error) {
    logger.error('Sign up action error', {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.SIGNUP,
      error: error instanceof Error ? error : new Error('Unknown error'),
    })

    // If it's a validation error, use Supabase's standard message format
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    }

    // For unknown errors, use Supabase's standard unknown error message
    return {
      success: false,
      error: 'An error occurred during the sign up process.'
    }
  }
} 