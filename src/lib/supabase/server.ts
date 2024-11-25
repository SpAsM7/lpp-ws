import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

const cookieSettings: Partial<CookieOptions> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/"
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...cookieSettings,
              ...options,
            })
          } catch (error) {
            console.error("Error setting cookie:", error)
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...cookieSettings,
              ...options,
              maxAge: 0
            })
          } catch (error) {
            console.error("Error removing cookie:", error)
          }
        },
      },
    }
  )
}

export async function createRouteHandlerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...cookieSettings,
              ...options,
            })
          } catch (error) {
            console.error("Error setting cookie:", error)
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...cookieSettings,
              ...options,
              maxAge: 0
            })
          } catch (error) {
            console.error("Error removing cookie:", error)
          }
        },
      },
    }
  )
}
