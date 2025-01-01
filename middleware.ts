import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const cookieSettings: Partial<CookieOptions> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/"
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            response.cookies.set({
              name,
              value,
              ...cookieSettings,
              ...options,
            })
          } catch (error) {
            console.error("Error setting cookie in middleware:", error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            response.cookies.set({
              name,
              value: "",
              ...cookieSettings,
              ...options,
              maxAge: 0
            })
          } catch (error) {
            console.error("Error removing cookie in middleware:", error)
          }
        },
      },
    }
  )

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Get the pathname from the URL
    const path = request.nextUrl.pathname

    // Allow static files and API routes
    if (
      path.startsWith('/_next') || 
      path.startsWith('/api') ||
      path.includes('.')
    ) {
      return response
    }

    // Handle root path
    if (path === '/') {
      const redirectUrl = session ? '/home' : '/auth/login'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Define auth and protected paths
    const authPaths = [
      '/auth/login',
      '/auth/signup',
      '/auth/reset-password',
      '/auth/verify'
    ]
    const protectedPaths = ['/home', '/companies', '/investments', '/accounts', '/documents']
    const isAuthPath = authPaths.includes(path)
    const isProtectedPath = protectedPaths.includes(path) || 
                          path.startsWith('/companies/') || 
                          path.startsWith('/accounts/')

    // Always allow access to callback and update password paths
    if (
      path === '/auth/callback' || 
      path.startsWith('/api/auth/callback') ||
      path === '/auth/update-password'
    ) {
      return response
    }

    // If logged in and trying to access auth pages, redirect to home
    if (session && isAuthPath) {
      return NextResponse.redirect(new URL('/home', request.url))
    }

    // If not logged in and trying to access protected pages, redirect to login
    if (!session && isProtectedPath) {
      const searchParams = new URLSearchParams()
      searchParams.set('redirect', path)
      return NextResponse.redirect(new URL(`/auth/login?${searchParams}`, request.url))
    }

    return response
  } catch (error) {
    console.error("Error in middleware:", error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 