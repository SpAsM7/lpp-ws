'use server'

import { createClient } from "@/lib/supabase/server"
import { verifyEmailSchema, type VerifyEmailInput, type AuthActionState } from "@/types/auth"
import { logger, LOG_CATEGORY, LOG_ACTION } from "@/lib/logging"
import { z } from "zod"

/**
 * Server action for verifying email tokens (signup, recovery, or invite)
 * Uses Supabase's built-in OTP verification
 */
export async function verifyEmailAction(data: VerifyEmailInput): Promise<AuthActionState> {
  try {
    // Validate input
    const validated = verifyEmailSchema.parse(data)

    // Get Supabase instance
    const supabase = await createClient()

    // Verify token using Supabase's OTP verification
    const { error } = await supabase.auth.verifyOtp({
      token_hash: validated.token,
      type: validated.type,
    })

    if (error) {
      logger.error('Email verification failed', {
        category: LOG_CATEGORY.AUTH,
        action: LOG_ACTION.EMAIL_VERIFY,
        error,
      })

      return {
        success: false,
        error: error.message
      }
    }

    logger.info('Email verified successfully', {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.EMAIL_VERIFY,
      metadata: { type: validated.type }
    })

    return { success: true }

  } catch (error) {
    logger.error('Email verification action error', {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.EMAIL_VERIFY,
      error: error instanceof Error ? error : new Error('Unknown error'),
    })

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid verification code format"
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}