'use server'

import { createClient } from "@/lib/supabase/server"
import { loginSchema, type LoginInput, type AuthActionState } from "@/types/auth"
import { logger, LOG_CATEGORY, LOG_ACTION } from "@/lib/logging"

/**
 * Server action for user login with email and password
 * Uses Supabase's built-in auth and session management
 */
export async function createLoginAction(data: LoginInput): Promise<AuthActionState> {
  try {
    // Validate input
    const validated = loginSchema.parse(data)
    const supabase = await createClient()

    // Attempt login
    const { error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (error) {
      logger.error('Authentication failed', {
        category: LOG_CATEGORY.AUTH,
        action: LOG_ACTION.LOGIN,
        error,
      })

      return {
        success: false,
        error: error.message
      }
    }

    logger.info('User logged in successfully', {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.LOGIN,
      metadata: { email: validated.email }
    })

    return { success: true }

  } catch (error) {
    logger.error('Login action error', {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.LOGIN,
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
      error: 'An error occurred during the sign in process.'
    }
  }
} 