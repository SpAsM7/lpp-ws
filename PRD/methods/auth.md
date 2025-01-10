# Authentication Implementation Guide

This document outlines how we implement Supabase Auth in our Next.js 15 app. We strictly follow Supabase's recommended patterns to ensure reliable auth flows.

## Key Principles

1. **Follow Supabase Patterns Exactly**
   - MUST use Supabase's auth helpers as documented
   - MUST NOT create custom auth implementations
   - MUST NOT add custom callback routes

2. **URL Configuration**
   - MUST set Site URL in Supabase dashboard (e.g., `http://localhost:3000`)
   - MUST provide direct page URLs in redirectTo (e.g., `/auth/update-password`)
   - MUST NOT create custom callback handling

3. **Next.js 15 Requirements**
   - MUST handle cookies as async operations
   - MUST use proper cookie handling patterns in middleware
   - MUST follow Server Component/Action patterns

4. **Supabase Best Practices**
   - MUST use `getUser()` instead of `getSession()` for auth checks
   - MUST NOT rely on session data directly from storage/cookies
   - MUST verify auth data by contacting Supabase server
   - MUST handle auth state through Supabase's built-in mechanisms

## Project Setup

1. **Environment Variables**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_URL=your-app-url
   ```

2. **File Structure**
   ```
   src/lib/supabase/
   ├── server.ts     # Server-side Supabase client
   └── client.ts     # Client-side Supabase client

   src/lib/actions/auth/
   ├── create-login.ts      # Email/password login
   ├── create-signup.ts     # New user registration
   ├── create-signout.ts    # Session termination
   ├── create-magic-link.ts # Passwordless login
   ├── create-reset-request.ts  # Password reset request
   └── update-password.ts   # Password updates

   app/auth/
   ├── login/page.tsx       # Login form
   ├── signup/page.tsx      # Signup form
   ├── reset-password/page.tsx  # Reset request form
   └── update-password/page.tsx # New password form
   ```

## Implementation Patterns

1. **Auth Actions**
   ```typescript
   // Password Reset Request
   const { error } = await supabase.auth.resetPasswordForEmail(email, {
     redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`
   })

   // Magic Link Request
   const { error } = await supabase.auth.signInWithOtp({
     email,
     options: {
       redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
     }
   })
   ```

2. **Middleware Setup**
   ```typescript
   export async function middleware(request: NextRequest) {
     let response = NextResponse.next()

     const supabase = createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get(name: string) {
             return request.cookies.get(name)?.value
           },
           set(name: string, value: string, options: CookieOptions) {
             request.cookies.set({ name, value, ...options })
             response = NextResponse.next({
               request: { headers: request.headers },
             })
             response.cookies.set({ name, value, ...options })
           },
           remove(name: string, options: CookieOptions) {
             request.cookies.delete(name)
           },
         },
       }
     )

     // MUST use getUser() instead of getSession() for secure auth verification
     const { data: { user } } = await supabase.auth.getUser()

     // If user is not signed in and the current path is not /auth/* redirect the user to /auth/login
     if (!user && !request.nextUrl.pathname.startsWith('/auth/')) {
       return NextResponse.redirect(new URL('/auth/login', request.url))
     }

     return response
   }
   ```

## Auth Flows

1. **Password Reset Flow**
   - User requests reset → Supabase sends reset email
   - User clicks link → Contains `type=recovery` parameter
   - MUST provide `/auth/update-password` as redirectTo URL in reset request:
     ```typescript
     redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`
     ```
   - Supabase automatically handles the recovery flow and redirects
   - IMPORTANT: No custom handling needed when redirectTo is set correctly

2. **Magic Link Flow**
   - User enters email → Supabase sends magic link
   - User clicks link → Supabase handles verification
   - User is signed in
   - IMPORTANT: Let Supabase handle the flow

3. **Sign Up Flow**
   - User submits email/password
   - Verification email sent
   - User verifies → Supabase handles verification
   - Redirect to app

## Security Notes

1. **Session Management**
   - Use Supabase's built-in session handling
   - Use HTTP-only cookies only
   - NEVER store tokens in localStorage
   - MUST use `getUser()` for auth verification

2. **Route Protection**
   - Use basic middleware for session refresh
   - Use Server Components for data access verification
   - Let Supabase handle auth state
   - MUST verify auth state with Supabase server

## Common Pitfalls

1. **DON'T**:
   - Create custom auth callback routes
   - Add complexity to auth flows
   - Try to handle auth verification yourself
   - Store auth state in client
   - Use localStorage for tokens
   - Use `getSession()` for auth verification
   - Trust auth data directly from cookies/storage
   - Create custom recovery flow handling

2. **DO**:
   - Follow Supabase patterns exactly
   - Use direct page URLs in redirectTo
   - Let Supabase handle auth flows
   - Use HTTP-only cookies
   - Keep it simple
   - Use `getUser()` for secure auth verification
   - Let Supabase handle the recovery flow via redirectTo
   - Trust Supabase's built-in auth state management

For detailed information about Supabase Auth features and configuration options, refer to the [official Supabase Auth documentation](https://supabase.com/docs/guides/auth/server-side/nextjs).