'use server'

import { createClient } from "@/lib/supabase/server"
import { type AuthActionState } from "@/types/auth"
import { logger, LOG_CATEGORY, LOG_ACTION } from "@/lib/logging"

/**
 * Server action for signing out users
 * Uses Supabase's built-in session handling and cookie management
 */
export async function createSignOutAction(): Promise<AuthActionState> {
  try {
    const supabase = await createClient()

    // Sign out globally (clears all sessions)
    const { error } = await supabase.auth.signOut({
      scope: 'global'
    })

    if (error) {
      logger.error('Sign out failed', {
        category: LOG_CATEGORY.AUTH,
        action: LOG_ACTION.LOGOUT,
        error,
      })

      return {
        success: false,
        error: error.message
      }
    }

    logger.info('User signed out successfully', {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.LOGOUT,
    })

    return {
      success: true
    }
  } catch (error) {
    logger.error('Sign out error', {
      category: LOG_CATEGORY.AUTH,
      action: LOG_ACTION.LOGOUT,
      error: error instanceof Error ? error : new Error('Unknown error'),
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
} 