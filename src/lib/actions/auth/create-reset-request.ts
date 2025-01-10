'use server'

import { createClient } from '@/lib/supabase/server'
import type { ResetRequestInput } from '@/types/auth'

/**
 * Server action for requesting a password reset
 * Uses Supabase's built-in password reset flow with minimal custom handling
 */
export async function createResetRequestAction(data: ResetRequestInput) {
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?type=recovery&next=/auth/update-password`
  })

  return {
    success: !error,
    error: error?.message
  }
}
