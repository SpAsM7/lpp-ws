'use server'

import { createClient } from '@/lib/supabase/server'
import { updatePasswordSchema, type UpdatePasswordInput } from '@/types/auth'
import { z } from 'zod'

/**
 * Server action for updating password after reset
 * Uses Supabase's built-in password update functionality
 */
export async function updatePasswordAction(data: UpdatePasswordInput) {
  try {
    // Validate input
    const validated = updatePasswordSchema.parse(data)
    
    // Get Supabase instance
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('No valid user for password update:', userError)
      return {
        success: false,
        error: "Please use a valid password reset link"
      }
    }

    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password: validated.password
    })

    if (error) {
      console.error('Password update failed:', error)
      return {
        success: false,
        error: error.message
      }
    }

    console.info('Password updated successfully')
    return { success: true }

  } catch (error) {
    console.error('Password update action error:', error)

    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.map(err => err.message)
      return {
        success: false,
        error: fieldErrors.join(". ")
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}