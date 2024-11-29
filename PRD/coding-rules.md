# Absolute Code Rules

## Project Structure
1. All shared code MUST go in `/src/lib`
2. All shared types MUST go in `/src/types`
3. All environment variables MUST be defined in `.env.example`
4. Always use absolute imports from `@/` not relative paths
5. Never put business logic in components

## Route Structure
1. API routes MUST go in `/app/api/**/route.ts`
2. API routes are NEVER affected by route groups
3. Pages MUST go in folder matching their URL path:
   - URL `/auth/login` → `/app/auth/login/page.tsx`
   - URL `/dashboard` → `/app/dashboard/page.tsx`
4. Route groups are ONLY for organizing pages with different URL paths:
   - URL `/dashboard` in auth group → `/app/(auth)/dashboard/page.tsx`
   - URL `/settings` in auth group → `/app/(auth)/settings/page.tsx`
5. Never use route groups for pages where URL matches folder structure:
   - NO: `/app/(auth)/auth/login/page.tsx` for `/auth/login`
   - YES: `/app/auth/login/page.tsx` for `/auth/login`
6. Route groups MUST NOT contain API routes
7. All request-specific APIs (cookies, headers, params, searchParams) MUST be async
8. Layout.tsx MUST be used for shared UI within route groups
9. Always use App Router (`/app` directory) - never use Pages Router (`/pages` directory)

## Loading States
1. Always wrap client components in Suspense boundaries
2. Never show raw loading spinners - use shadcn skeleton components
3. Use route-specific loading.tsx for page-level loading states
4. Component-specific loading states should be co-located with their components
5. Reusable loading components MUST go in `/src/components/loading`

## Authentication
1. Auth endpoints MUST follow these exact patterns:
   API Routes (under `/app/api/auth/`):
   - `login/route.ts` - Sign in handlers (email, OAuth)
   - `signup/route.ts` - Sign up handlers
   - `signout/route.ts` - Sign out handler
   - `callback/route.ts` - OAuth/magic link callbacks
   - `reset-password/route.ts` - Password reset
   - `update-password/route.ts` - Password update after reset
   - `verify/route.ts` - Email verification
   Page Components (under `/app/auth/`):
   - `login/page.tsx` - Sign in forms (URL: /auth/login)
   - `signup/page.tsx` - Sign up forms (URL: /auth/signup)
   - `callback/page.tsx` - Auth callback handling (URL: /auth/callback)
   - `reset-password/page.tsx` - Password reset forms (URL: /auth/reset-password)
   - `update-password/page.tsx` - Password update forms (URL: /auth/update-password)
   - `verify/page.tsx` - Email verification (URL: /auth/verify)
2. Always use Supabase SSR client methods from `@/lib/supabase`:
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
4. Always use Supabase client methods for data operations:
   - Server Components: Use `createClient()` from `@/lib/supabase/server`
   - Client Components: Use `createClient()` from `@/lib/supabase/client`
   - API Routes: Use `createClient()` from `@/lib/supabase/server`
5. Always implement preload pattern to prevent waterfalls
6. Use Server Actions for form submissions and data mutations
7. Use pagination for large data sets
8. Never use raw SQL or direct database connections

## Database
1. Always use BIGINT for currency:
   - Store amounts in dollars (never cents/decimals)
   - For large values, display in thousands/millions format (e.g., $10M, $500K)
   - Never use floating point or decimal types for currency
2. Always use UUID for IDs
3. Never skip audit fields (created_at, updated_at, etc.)
4. Always implement row-level security (RLS) in Supabase:
   - Define policies at table level
   - Always test policies in isolation
   - Document policy purpose in comments
5. Data Access:
   - Always use generated types from `database.ts`
   - Always use Supabase client methods for CRUD operations
   - Never use .sql() or raw queries
   - Use appropriate client based on context (server vs client)
6. Never store sensitive data in JSONB fields:
   - Use JSONB only for preferences, metadata, and configuration
   - Never store PII, financial data, or auth data in JSONB
   - Always validate JSONB data structure with zod
7. GP/LP Role Separation:
   - Always implement dual-check system for GP access (is_gp_user AND gp_role)
   - Never mix GP and LP role checks in the same function
   - Always separate GP and LP policies clearly
   - Never grant GP access through LP role mechanisms
   - Always audit GP actions separately
   - Use explicit function names indicating GP/LP context (e.g., getGPUsers, getLPAccounts)

## Supabase Integration
1. File Organization:
   - `/src/lib/supabase/client.ts` - Client-side Supabase configuration
   - `/src/lib/supabase/server.ts` - Server-side Supabase configuration
   - `/src/types/database.ts` - Generated TypeScript type definitions
   - `/supabase/migrations/` - Database migration files
   - `/supabase/seed.sql` - Seed data for development

2. Type Safety:
   - Always use generated types from `database.ts`
   - Never manually define database types
   - Run `pnpm supabase gen types typescript --linked` after schema changes
   - Keep `database.ts` in sync with migrations

3. Client Usage:
   - Server Components: Use `createClient()` from `@/lib/supabase/server`
   - Client Components: Use `createClient()` from `@/lib/supabase/client`
   - Middleware: Use `createServerClient()` from `@supabase/ssr`
   - Route Handlers: Use `createClient()` from `@/lib/supabase/server`

4. Authentication:
   - Never store auth state in localStorage
   - Always use Supabase session management
   - Handle auth in middleware.ts using `createServerClient()`
   - Protected routes must use RLS policies

## Database Migrations
1. All migrations MUST be stored in `/supabase/migrations`
2. Migration files MUST follow pattern: `YYYYMMDDHHMMSS_description.sql`
3. Always include explicit schema names (public, auth)
4. Always consolidate multiple SQL statements into single query
5. Always include rollback statements
6. Always document migration steps in comments
7. Migration Workflow:
   - Run `db pull` before local schema changes
   - Make schema changes through migrations only
   - Test migrations with `db reset`
   - Run `supabase gen types` after successful migration
   - Never modify production schema directly

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
8. Never use classes - use functional components
9. Always use next/image for images - never raw <img> tags
10. Always use next/font for fonts - never import font files directly

## Forms
1. Always use react-hook-form with zod validation
2. Never use uncontrolled form inputs
3. Always handle loading and error states
4. Form components must be client components ('use client')
5. Always use Server Actions with react-hook-form for form submissions
6. Handle form state through formState from react-hook-form

## Error Handling
1. Always use error boundaries at page level
2. Never show raw error messages to users
3. Always log errors server-side
4. Never catch errors without handling them
5. Handle errors at start of functions with early returns
6. Model expected errors as return values
7. Always provide user-friendly error messages with next steps

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
2. Always use named exports for components
3. Files must follow order: exports, subcomponents, helpers, static content, types
4. Omit curly braces for single-line conditional statements
5. Use descriptive variable names with auxiliary verbs (isLoading, hasError)

## Code Editing and Content Preservation
1. NEVER use placeholders like "[Previous content is the same]" or "[Existing Content]" when editing code
2. Always preserve and explicitly write out ALL existing code when making changes
3. When editing files, include the complete context of the changes being made
4. Use proper version control practices - never assume content can be implicitly preserved
5. All code changes must be explicit and visible in the diff
