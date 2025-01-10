'use server'

import { createClient } from "@/lib/supabase/server"
import { magicLinkSchema, type MagicLinkInput, type AuthActionState } from "@/types/auth"
import { logger, LOG_CATEGORY, LOG_ACTION } from "@/lib/logging"

/**
 * Server action for sending magic link emails
 * Uses Supabase's built-in passwordless auth
 */
export async function createMagicLinkAction(data: MagicLinkInput): Promise<AuthActionState> {
  try {
    // Validate input
    const validated = magicLinkSchema.parse(data)
    const supabase = await createClient()

    // Send magic link email
    const { error } = await supabase.auth.signInWithOtp({
      email: validated.email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?type=magiclink&next=/`,
      }
    })

    if (error) {
      logger.error('Magic link request failed', {
        category: LOG_CATEGORY.AUTH,
        action: LOG_ACTION.LOGIN,
        error,
      })

      return {
        success: false,
        error: error.message
      }
    }

    logger.info('Magic link email sent', {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.LOGIN,
      metadata: { email: validated.email }
    })

    return { success: true }

  } catch (error) {
    logger.error('Magic link action error', {
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
      error: 'An error occurred while sending the magic link.'
    }
  }
} 