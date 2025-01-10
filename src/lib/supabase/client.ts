/**
 * Client-side Supabase client for use in Client Components.
 * This client runs in the browser and handles client-side auth state.
 */
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export the singleton instance
export const supabase = createClient()
