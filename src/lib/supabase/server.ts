import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const createClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await Promise.resolve(cookies())
          return cookieStore.get(name)?.value ?? ''
        },
        async set(name: string, value: string, options: CookieOptions) {
          // In server components, we can only read cookies
          // Cookie setting is handled by Supabase internally
          return Promise.resolve()
        },
        async remove(name: string, options: CookieOptions) {
          // In server components, we can only read cookies
          // Cookie removal is handled by Supabase internally
          return Promise.resolve()
        },
      },
    }
  )
}
