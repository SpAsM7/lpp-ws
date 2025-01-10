'use server'

import { createClient } from '@/lib/supabase/server'
import { getUserBySupabaseId } from '../user-actions'
import type { UserActionResponse, NormalizedUserProfile } from '@/types/user'

// Cache the Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null;

/**
 * Server action to get the current user's profile
 * Combines Supabase auth check with Airtable profile lookup
 * 
 * @returns Promise<UserActionResponse<NormalizedUserProfile>>
 */
export async function getCurrentUser(): Promise<UserActionResponse<NormalizedUserProfile>> {
  try {
    // Reuse or create the Supabase client
    if (!supabaseClient) {
      supabaseClient = await createClient();
    }

    const { data: { user } } = await supabaseClient.auth.getUser()

    if (!user) {
      return {
        error: 'No authenticated user found',
        isSuccess: false
      }
    }

    return await getUserBySupabaseId(user.id)
  } catch (error) {
    console.error('Error getting current user:', error)
    return {
      error: 'Failed to get current user',
      isSuccess: false
    }
  }
}
