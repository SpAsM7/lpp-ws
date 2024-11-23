# Absolute Code Rules

## Route Structure
1. API routes MUST go in `/app/api/**/route.ts`
2. API routes are NEVER affected by route groups like `(auth)`
3. Pages MUST go in their corresponding URL path folder as `page.tsx`
4. Never mix API routes and pages in the same folder structure
5. All request-specific APIs (cookies, headers, params, searchParams) MUST be async

## Authentication
1. Auth endpoints MUST follow these exact patterns:
   API Routes:
   - `/app/api/auth/signin/route.ts` - Sign in handlers (email, OAuth)
   - `/app/api/auth/signup/route.ts` - Sign up handlers
   - `/app/api/auth/signout/route.ts` - Sign out handler
   - `/app/api/auth/callback/route.ts` - OAuth/magic link callbacks
   - `/app/api/auth/reset/route.ts` - Password reset
   - `/app/api/auth/verify/route.ts` - Email verification
   Page Components:
   - `/app/auth/signin/page.tsx` - Sign in forms
   - `/app/auth/signup/page.tsx` - Sign up forms
   - `/app/auth/callback/page.tsx` - Auth callback handling
   - `/app/auth/reset/page.tsx` - Password reset forms
   - `/app/auth/verify/page.tsx` - Email verification
2. Always use Supabase SSR client methods:
   - Client Components: Use `createClient()` from `@/lib/supabase/client`
   - Server Components: Use `createClient()` from `@/lib/supabase/server`
   - Middleware: Use `createServerClient()` from `@supabase/ssr`
   - Route Handlers: Use `createClient()` from `@/lib/supabase/server`
3. Never manipulate cookies directly - use Supabase session methods
4. Always handle auth state changes through proper session management
5. Protected routes MUST be handled in middleware.ts
6. Never store auth tokens or user data in localStorage/client state

## Data Fetching
1. Always use server components by default (no 'use client')
2. Only add 'use client' when component needs:
   - Interactivity (onClick, onChange, etc.)
   - Browser APIs
   - React hooks (useState, useEffect, etc.)
3. Never fetch data in client components unless absolutely necessary
4. Always use database functions for data operations - never raw SQL
5. Always implement preload pattern to prevent waterfalls

## Middleware
1. Middleware MUST be in project root as `middleware.ts`
2. Use `createServerClient()` from `@supabase/ssr` for auth in middleware
3. Never add middleware logic in page or API route files

## Components
1. Always use shadcn components instead of raw HTML/Tailwind
2. Never modify shadcn component source files
3. Always extend components through composition
4. Custom components MUST go in `src/components`
5. Use function keyword for components, not const
6. Always use TypeScript interfaces over types
7. Place static content and interfaces at end of file

## Database
1. Always use BIGINT for currency (amounts in cents)
2. Always use UUID for IDs
3. Never skip audit fields (created_at, updated_at, etc.)
4. Always implement row-level security (RLS)
5. Never store sensitive data in JSONB fields

## Forms
1. Always use react-hook-form with zod validation
2. Never use uncontrolled form inputs
3. Always handle loading and error states
4. Form components must be client components ('use client')
5. Use useActionState with react-hook-form

## Error Handling
1. Always use error boundaries at page level
2. Never show raw error messages to users
3. Always log errors server-side
4. Never catch errors without handling them
5. Handle errors at start of functions with early returns
6. Model expected errors as return values

## Dependencies/Packages
1. Always use @supabase/ssr for Supabase integration - never use legacy packages
2. All imports MUST match dependencies listed in package.json
3. Never mix different versions of the same library's ecosystem
4. Always remove unused dependencies from package.json
5. Keep dependencies up to date with compatible versions
6. Never use alternative UI libraries - stick to shadcn/Radix
7. Always use exact versions (no ^ or ~) in package.json

## Code Style
1. Use lowercase with dashes for directories (e.g., components/auth-wizard)
2. Never use classes - use functional components
3. Always use named exports for components
4. Files must follow order: exports, subcomponents, helpers, static content, types
5. Omit curly braces for single-line conditional statements
6. Use descriptive variable names with auxiliary verbs (isLoading, hasError)