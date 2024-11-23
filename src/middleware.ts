import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

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
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

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
    const redirectUrl = session ? '/home' : '/login'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  // Define auth and protected paths
  const authPaths = ['/login', '/reset-password', '/update-password']
  const protectedPaths = ['/home', '/companies', '/investments', '/accounts', '/documents']
  const isAuthPath = authPaths.includes(path)
  const isProtectedPath = protectedPaths.includes(path) || 
                         path.startsWith('/companies/') || 
                         path.startsWith('/accounts/')

  // Always allow access to callback paths
  if (path === '/auth/callback' || path.startsWith('/api/auth/callback')) {
    return response
  }

  // If logged in and trying to access auth pages, redirect to home
  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // If not logged in and trying to access protected pages, redirect to login
  if (!session && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
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
