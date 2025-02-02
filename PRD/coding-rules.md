# Absolute Code Rules

This document uses specific keywords to indicate requirement levels:

- **MUST / MUST NOT**: Absolute requirements that cannot be ignored. **Failure to comply with a MUST or MUST NOT will result in immediate rejection of the merge or build.**
- **SHOULD / SHOULD NOT**: Strong recommendations that can be deviated from only if fully understood  
- **MAY**: Optional items  

## 1. Tech Stack & Overview

This project is a Next.js-based LP Portal that provides limited partners with a secure interface for viewing and managing investment data, documents, and updates. Our data source is **Airtable** (where GPs store and manage records), and user authentication is handled by **Supabase**.

1. **Frontend**  
   - Next.js 15 with App Router  
   - React 18 with Server Components  
   - TypeScript with strict mode  
   - Tailwind CSS  
   - shadcn UI components (Zinc theme)

2. **Database & Platform**  
   - **Airtable** for all LP-related data (documents, roles, accounts, etc.)  
   - **Supabase** for user authentication only:
     - Sign-up, sign-in, password resets, and JWT issuance
     - We do **not** use Supabase Postgres for data storage or row-level security

3. **Infrastructure**  
   - Vercel for Frontend & Serverless Functions  
   - Airtable as primary DB (via its API/SDK)  
   - Supabase Cloud for Authentication  

4. **Additional Libraries**  
   - React Hook Form & Zod for form handling  
   - TanStack Query for data fetching  
   - TanStack Table for data tables  
   - Recharts for data visualization  
   - date-fns for date handling  

---

## 3. Workflow Laws

### Law #0: AlwaysFollow the Rules

When making changes, **MUST** follow these sections based on the type of change:

1. **UI Changes**
   - **MUST** follow Section 16 (Styling & Theme) for all styling decisions
   - **MUST** follow Section 12 (Components) for component architecture
   - **MUST** follow Section 7 (Loading States) for loading states
   - **MUST** follow Section 14 (Error Handling) for error states

2. **Data & Backend**
   - **MUST** follow Section 9 (Data Management) for all Airtable operations
   - **MUST** follow Section 10 (Schema Management) for schema changes
   - **MUST** follow Section 13 (Server-Side Logic) for server actions
   - **MUST** follow Section 17 (Environment Variables) for configuration

3. **Authentication**
   - **MUST** follow Section 8 (Authentication) for all auth flows
   - **MUST** follow Section 11 (Middleware) for route protection
   - **MUST** follow Section 6 (Route Structure) for auth endpoints

4. **Project Organization**
   **MUST** follow:
   - Section 4 for file placement
   - Section 5 for naming & formatting
   - Section 15 for dependencies

5. **Testing & Quality**
   - **MUST** follow Section 18 (Testing) for test implementation
   - **MUST** follow Section 14 (Error Handling) for error cases and recovery paths
   - **MUST** document according to Law #3 (Documentation)
   - **MUST** ensure both test coverage and error handling are complete before marking work as done

Remember:
- **MUST** check these sections BEFORE making changes
- **MUST** follow ALL relevant sections (changes often cross multiple concerns)
- **MUST** prioritize sections specific to your change type
- When in doubt, **MUST** ask for clarification

### Law #1: Verify & Reuse Existing Code Before Creating New Code

1. **Search Before Implementing**  
   - **MUST** check the entire codebase (domains, shared utilities, components) for existing functionality **before** writing anything new.  
   - **MUST** confirm no similar logic or pattern already exists.

2. **Unify & Extend**  
   - **MUST** **extend or reuse** an existing solution if found, rather than creating a duplicate.  
   - **MUST** unify duplicates if they appear. Avoid parallel code paths that solve the same problem.

3. **Document the Decision**  
   - **MUST** briefly explain your search or rationale (e.g., in pull requests, commit messages):  
     - “Searched `/src/lib/domains/accounts` and `/src/components/accounts`… no matching function found. Creating new `createAccountAction`.”  

### Law #2: Manage Airtable & Supabase Config Manually

1. **Manual Schema & Auth**  
   - **MUST** perform all Airtable field/table modifications in the Airtable UI.  
   - **MUST** configure Supabase auth settings in the Supabase dashboard.  
   - **MUST NOT** attempt programmatic schema changes or direct system-level edits.

2. **Prompt & Wait for Approval**  
   - **MUST** propose exact field names, types, or configurations when code needs new schema.  
   - **MUST** wait for **explicit** user confirmation before implementing code dependent on those changes.

### Law #3: Maintain Documentation in Step with Development

1. **What to Update**  
   - **Key Reference Files**:
     - `product-requirements.md` – Update when **new features** are added or **existing features** are significantly changed
     - `component-requirements.md` – Update when a **component** is added, modified, or completed
     - `app-flow.mermaid` – Update if a **new flow** is introduced or an **existing flow** changes significantly
     - `working-status.md` – Update at each **logical development step** (starting a feature, finishing a sub-feature, discovering new tasks)
   - **Code Documentation**: Follow Section 5.6 (Documentation) for all code documentation requirements, including:
     - File headers and purpose statements
     - Function and method documentation
     - Type and interface documentation
     - Comments and inline documentation

2. **How & When to Update**  
   - **Consistency**:
     - **MUST NOT** introduce contradictory statements in any doc
     - **MUST** flag conflicts for user clarification **immediately**
     - **MUST** keep comments minimal and meaningful
     - **MUST** update documentation when functionality changes
   - **Timing**:
     - **MUST** update relevant docs **before** finalizing a merge/pull request
     - **SHOULD** revise docs if bug fixes alter documented behavior
     - **MUST** document changes as they happen, not after the fact
     - **MUST** update all affected documentation when making changes

### Law #4: Follow Requirements, Stay on Task, & Seek Approvals

1. **Check Requirements First**  
   - **MUST** consult `component-requirements.md` and `product-requirements.md` **before** coding.  
   - If something is unclear or missing, **MUST** ask the user for a decision instead of guessing.

2. **Stay on Task**  
   - **MUST** focus on resolving the **current** issue or error.  
   - If unrelated problems or improvement ideas are uncovered, **MUST** add them as notes to `working-status.md`.  
   - **MUST NOT** derail the current task to pursue those side issues. Wait for user approval or instructions to address them next.

3. **Restrict Off-Task UI Changes**
   - **MUST NOT** make UI changes during edits unless:
     - The user has explicitly requested UI changes, or
     - You have requested and received explicit permission from the user to change the UI
   - This applies to all visual changes including layout, styling, component structure, and interaction patterns

4. **Implementation & Approvals**  
   - **MUST** reflect actual changes in `working-status.md` as you progress (e.g., "Fixed Issue #123, awaiting user review")
   - **MUST** pause immediately and prompt the user for guidance if a conflict, unclear requirement, or unexpected scenario arises
   - **MUST NOT** attempt to fix or modify code outside the original scope while waiting for feedback
   - **MUST** document the specific issue or question that caused the pause in `working-status.md`

### Law #5: Deliver Features in Small, Verified Steps

1. **Incremental Bites**  
   - **MUST** implement new features or fixes as small, self-contained changes aligned with the relevant requirement item (e.g., "Implementing 7.1.2 Document Search UI").  
   - Avoid massive multi-feature merges that confuse the review process.

2. **Blockers & Dependencies**  
   - **MUST** request or confirm Airtable/Supabase changes (Law #2) **before** coding dependent features.  
   - If a blocking dependency arises (e.g., a schema field is missing), **MUST** document it in `working-status.md` and pause until resolved.

3. **Testing & Verification**  
   - **MUST** test each small change to ensure it meets the requirement (UI correctness, data filters, or permissions).  
   - **SHOULD** gather quick user feedback (if possible) before proceeding to the next chunk.

## 4. Project Structure Overview

```
/
├── app/                    # Next.js App Router (pages and API routes)
│   ├── (auth)/            # Auth pages and their specific components
│   │   └── _components/   # Components used ONLY by auth pages
│   ├── (dashboard)/       # Main pages and their specific components
│   │   └── _components/   # Components used ONLY by dashboard pages
│   └── api/               # API routes (auth endpoints, webhooks, etc.)
├── src/
│   ├── lib/               # Shared code and business logic - ALL shared code MUST go here
│   │   ├── domains/       # Core business domains (accounts, companies, investments) - domain-specific logic MUST go here
│   │   ├── features/      # Cross-domain features (document-access, metrics) - cross-domain logic MUST go here
│   │   ├── actions/       # Server Actions organized by feature or domain
│   │   ├── errors/        # Centralized error dictionary
│   │   ├── airtable/      # Airtable queries and utilities
│   │   └── supabase/      # Supabase client configs (client.ts, server.ts) for auth
│   ├── components/        # Shared components used across multiple pages
│   │   ├── ui/            # shadcn components (buttons, inputs, etc.)
│   │   ├── layout/        # Layout wrappers (headers, sidebars)
│   │   ├── loading/       # Loading states and skeletons
│   │   ├── forms/         # Shared form components
│   │   ├── icons/         # Centralized icon components
│   │   ├── providers/     # Context providers
│   │   ├── [domain]/      # Components shared within a domain (e.g., accounts/)
│   │   └── [feature]/     # Components shared within a feature
│   └── types/             # Shared TypeScript types - ALL shared types MUST go here
├── tests/                 # Tests (unit in __tests__, e2e in e2e/)
├── public/                # Static assets
├── .env.example           # Environment variable documentation
└── middleware.ts          # Edge middleware for authentication
```

## 5. Code Style

1. **Directory Names**: use lowercase with dashes (e.g. `user-management`)  
2. **Exports**: prefer named exports over default exports  
3. **Order** in files: top-level exports → subcomponents → helpers → static content → types  
4. **Conditionals**: omit curly braces for single-line if statements  
5. **Variable Names**: must be descriptive, especially booleans (`isLoading`, `hasError`)  
6. **Documentation**:
   - **Files**: Follow requirements in Law #3.4 (File-Level Documentation)
   - **Functions & Methods**:
     - MUST have a brief JSDoc comment explaining purpose and behavior
     - MUST document parameters and return types with TypeScript
     - MUST include example usage for complex functions
     - MUST document side effects (e.g., API calls, state changes)
     - MUST explain any non-obvious logic or business rules
   - **Interfaces & Types**:
     - MUST document each property with JSDoc comments
     - MUST explain constraints and valid values
     - MUST reference related types or interfaces
   - **Comments**:
     - MUST explain "why" not "what" (code should be self-documenting)
     - MUST keep inline comments minimal and meaningful
     - MUST update comments when code changes
     - MUST NOT commit commented-out code
7. **File Size & Organization**:
   - Each file SHOULD be under 300 lines of code
   - SHOULD split large modules into smaller logical pieces
   - MUST extract reusable logic into separate files
   - MUST group related functionality together

8. **Import & Module Organization**:
   - MUST use absolute imports from `@/` not relative paths
   - MUST NOT put business logic in components
   - MUST keep business logic in appropriate domain or feature directories
   - MUST use barrel exports (`index.ts`) for public module APIs
   - MUST use explicit imports (no `import *`)

## 6. Route Structure

1. **API routes** MUST go in `/app/api/**/route.ts`  
2. **API routes** MUST NOT be affected by route groups  
3. **Pages** MUST go in folder matching their URL path:  
   - URL `/auth/login` → `/app/auth/login/page.tsx`  
   - URL `/dashboard` → `/app/dashboard/page.tsx`  
4. **Route groups** MUST ONLY be used for organizing pages (e.g., `(auth)` group)  
5. **Route groups** MUST NOT contain API routes  
6. All request-specific APIs (`cookies`, `headers`, `params`, `searchParams`) MUST be async  
7. **Next.js Layouts**  
   - Route-level `layout.tsx` MUST be used for shared UI within route groups  
   - Route-level `layout.tsx` MUST NOT contain complex component logic  
8. MUST use App Router in `/app` - MUST NOT use the legacy Pages Router  
9. Route groups SHOULD NOT be nested more than two levels deep  

## 7. Loading States

1. MUST wrap client components in Suspense boundaries  
2. MUST NOT show raw loading spinners - MUST use shadcn skeleton components  
3. MUST use route-specific `loading.tsx` for page-level loading states  
4. SHOULD co-locate component-specific loading states with their components  
5. MUST place reusable loading components in `/src/components/loading`  

## 8. Authentication

We rely on **Supabase** exclusively for user sign-up, log-in, and password resets. **All** user-facing data is stored in Airtable; user data remains in Supabase only for auth (email, password, session tokens).

**MUST NOT** store tokens in localStorage or client-side state—sessions are cookie-based only.

1. **Auth Actions**
   - MUST place all auth actions under `src/lib/actions/auth/`
   - MUST follow naming convention: `create-*.ts` for creation actions, `update-*.ts` for updates
   - MUST implement all core flows: login, signup, signout, password reset, magic link, email verification
   - MUST place auth pages under `app/auth/` following Next.js file conventions

2. **Client Creation**
   - MUST use appropriate client for each context (browser, server, middleware)
   - MUST use standardized cookie handling patterns as documented in `@auth.md`
   - MUST NOT mix client types or cookie handling approaches
   - MUST follow Next.js 15 cookie requirements

3. **Session Management**
   - MUST use Supabase's built-in session management
   - MUST use secure HTTP-only cookies
   - MUST NOT store auth tokens in localStorage/client state
   - SHOULD configure appropriate session lengths in Supabase dashboard (Pro)

4. **Error Handling**
   - MUST use Supabase's built-in error types
   - MUST provide user-friendly error messages via toast notifications
   - MUST implement structured error logging on the server
   - MUST NOT expose internal error details to clients

5. **Action Return Types**
   - MUST use `AuthActionState<T>` as return type for all auth actions
   - MUST include Supabase's error type for detailed error handling
   - MUST set `isSuccess` based on presence of data and absence of error
   - MUST type the `data` field appropriately for each action

6. **Route Protection**
   - MUST implement basic route protection in middleware using Supabase's session management
   - MUST verify auth state in Server Components before data access
   - MUST redirect unauthenticated users to login
   - MUST handle session validation failures gracefully
   - SHOULD use Supabase Pro features for advanced session configuration when available

7. **Auth Flow Types**
   - MUST use standard callback types: signup, recovery, magiclink, invite
   - MUST handle all callback types in the auth callback route
   - MUST implement proper redirection for each type
   - MUST follow flow sequences as documented in `@auth.md`

## 9. Data Management (Airtable)

All investment, document, role, and account data is kept in **Airtable**, while Supabase handles authentication only.

1. **Architecture**:
   - MUST use the official Airtable SDK for all Airtable operations
   - MUST pin Airtable SDK version in package.json (no `^` or `~`)
   - MUST NOT use any other Airtable client libraries
   - MUST keep all Airtable operations in `/src/lib/airtable`
   - MUST store credentials (base IDs, API keys) in environment variables
   - MUST use TypeScript interfaces for all Airtable tables
   - MUST NEVER use `any` types for Airtable records

2. **File Organization**:
   - `/src/lib/airtable/client.ts` - Airtable SDK client configuration
   - `/src/lib/airtable/schema-fetcher.ts` - Schema generation utility
   - `/src/lib/airtable/schema.json` - Raw schema reference
   - `/src/types/airtable-schema.ts` - Generated TypeScript types
   - `/src/lib/airtable/queries.ts` - Reusable queries

3. **Data Access Patterns**:
   - **Server Components**: Use Airtable SDK directly
   - **Client Components**: Use Server Actions for Airtable operations
   - **API Routes**: Use SDK only for external integrations/webhooks
   - MUST NOT fetch same data in child components if parent has it
   - MUST pass fetched data down via props
   - MUST filter data by user's `user_id` before returning results

4. **Performance & Scaling**:
   - MUST implement pagination/filtering for large datasets
   - MUST batch related changes when possible
   - MUST use formula fields for computed values
   - SHOULD cache frequently accessed data
   - MUST monitor API usage limits
   - MUST use meaningful loading states

5. **Data Conventions**:
   - **Currency Storage**:
     - Store currency as whole numbers in dollars (never cents)
     - Use Airtable's integer field type for currency
     - NEVER use floating-point or text-based currency fields
     - Display large values in K/M format (e.g., $10M, $500K)
   - **IDs and References**:
     - Use UUID for IDs (stored as strings in Airtable)
     - Include audit fields (created_at, updated_at as Date/Time type)
     - Use Linked Record fields for relationships between tables
   - **Field Types & Validation**:
     - MUST use appropriate Airtable field types:
       - Single Select for enumerated values
       - Multiple Select for flag/tag combinations
       - Number (integer) for whole numbers
       - Number (decimal, 2 places) for percentages
       - Long Text for markdown/formatted content
       - Attachment for files/documents
     - MUST handle Airtable type constraints:
       - Number fields may return null/undefined
       - Formula fields are read-only and may have precision limits
       - Date fields need explicit timezone handling
     - MUST validate all data with Zod:
       - Parse number fields with appropriate checks
       - Validate select fields against known values
       - Handle null/undefined gracefully
     - MUST NEVER store sensitive data in unstructured fields
     - MUST document field type choices in schema documentation

6. **Permissions Model**:
   - Link records to User_Profiles table for permissions
   - Verify `user_id` membership in allowed users
   - Implement row-level filtering in serverless code
   - Document all permission logic in comments
   - NEVER mix GP and LP role checks
   - Use explicit function names for context (e.g., `getGPUsers`)

## 10. Schema Management

1. **Documentation**:
   - MUST maintain changelog in `/docs/airtable-schema/`
   - MUST document all tables and relationships
   - MUST version changes with timestamps
   - MUST include rollback procedures

2. **Change Process**:
   - MUST test in development base first
   - MUST document impact on existing data
   - MUST update TypeScript types
   - MUST validate permission logic
   - MUST backup data before significant changes
   - MUST maintain referential integrity

3. **Communication**:
   - MUST notify team of changes
   - MUST document breaking changes
   - MUST coordinate with GP administrators
   - MUST provide migration guides when needed

4. **Schema Generation**:
   - MUST use the built-in schema-fetcher for type generation
   - MUST run schema generation command:
     ```bash
     pnpm tsx src/lib/airtable/schema-fetcher.ts
     ```
   - MUST verify generated types match Airtable schema
   - MUST commit both schema.json and airtable-schema.ts
   - MUST document any manual type adjustments
   - MUST run schema generation after any Airtable schema changes
   - MUST update dependent code when schema changes

## 11. Middleware

1. MUST exist in `middleware.ts` at project root  

2. **Authentication Setup**
   - MUST use `createServerClient()` from `@supabase/ssr` to handle authentication
   - MUST implement proper session refresh logic
   - MUST handle authentication failures gracefully
   - MUST redirect unauthenticated users appropriately

3. **Cookie & Session Handling**
   - MUST follow Next.js 15 cookie requirements (see Section 19.2)
   - MUST use a single response instance for all operations
   - MUST handle both request and response states
   - MUST implement proper error recovery (see Section 8.6)

4. **Route Protection**
   - MUST ensure user is authenticated before allowing access to protected routes
   - MUST implement proper error states for unauthorized access
   - MUST handle session validation failures gracefully
   - MUST NOT add application logic in page or API route files for restricting access
   - MUST enforce access control in middleware + serverless checks

5. **Performance & Caching**
   - MUST implement proper caching strategies
   - MUST handle session refresh efficiently
   - MUST NOT block on unnecessary operations
   - MUST optimize cookie operations

## 12. Components

1. **Architecture**:
   - MUST default to Server Components
   - MUST add `'use client'` when component needs:
     - Interactivity (`onClick`, `onChange`)
     - Browser APIs
     - React hooks (`useState`, `useEffect`)
     - Forms (react-hook-form requirement)
   - MUST add `'use server'` at Server Action file top
   - MUST add `'use server'` for inline Server Actions

2. **Component Types**:
   - **Server Components**:
     - MUST handle all data fetching
     - MUST contain primary business logic
     - MUST pass only necessary props to clients
   - **Client Components**:
     - MUST be leaf nodes when possible
     - MUST NOT contain business logic
     - MUST focus solely on UI interactivity
     - SHOULD be small and focused
   - NEVER convert to Client Component just for:
     - Data fetching
     - Rendering optimization
     - Code organization

3. **UI Components**:
   - MUST use shadcn UI components over raw HTML/Tailwind
   - MUST install via `pnpm dlx shadcn@latest add <component-name>`
   - MUST NOT copy/paste shadcn code directly
   - MUST NOT modify shadcn source files (extend through composition)

4. **Organization**:
   - **Cross-Cutting UI**: `src/components/ui/` for basic building blocks (Button, Input, etc.)
   - **Layout**: `src/components/layout/` for shared navigation, sidebars, headers
   - **Loading**: `src/components/loading/` for skeleton or spinner components
   - **Providers**: `src/components/providers/` for context providers
   - **[domain]/[feature]**: for domain/feature-specific components used by multiple pages
   - Page-specific components: in `app/**/[page]/_components/`

5. **Naming**:
   - MUST use kebab-case for file and directory names (`user-profile.tsx`, `investment-table.tsx`)
   - MUST use PascalCase for React component names (`export function UserProfile()`)

6. **Business Logic**:
   - MUST NOT include complex domain logic
   - MUST pass data through props from server components
   - MUST use Server Actions for mutations

## 13. Server-Side Logic

1. **Data Mutations**:
   - MUST use Server Actions for all Airtable operations
   - MUST use API Routes ONLY for:
     - External integrations
     - Webhooks
     - Streaming data
   - MUST NOT create API Routes for internal operations

2. **Server Action Organization**:
   - MUST follow CRUD order: Create, Read, Update, Delete
   - MUST use consistent naming:
     - Files: `[feature]-actions.ts` or `[domain]-actions.ts`
     - Functions: `[action][Feature]Action` or `[action][Domain]Action` (e.g., `createDocumentAction`, `updateRoleAction`)
   - MUST organize by domain/feature:
     - Core domain actions in `/src/lib/actions/[domain]`
     - Cross-domain features in `/src/lib/actions/[feature]`
   - MUST export as named functions
   - MUST use consistent naming: `handle[Action]Action`
   - MUST place shared logic in domain services
   - MAY reuse service functions across actions

3. **Return Types**:
   - MUST use `ActionState<T>` pattern:
     ```ts
     type ActionState<T> = {
       isSuccess: boolean;
       message: string;
       data?: T;
       fieldErrors?: Record<string, string[]>;
     };
     ```
   - MUST return `Promise<ActionState<T>>`
   - MUST handle all error states
   - MUST log detailed errors server-side
   - MUST return user-friendly messages

## 14. Error Handling

1. **Error Boundaries**:
   - MUST use error boundaries at the page level
   - MUST provide fallback UI for each boundary
   - MUST log boundary catches server-side

2. **Error Messages**:
   - MUST come from `/src/lib/errors` dictionary
   - MUST include user-friendly message and next steps
   - MUST support i18n through message keys
   - NEVER show raw error messages (Airtable or Supabase error text) to users
   - NEVER hardcode messages in components
   - MUST translate known error codes into user-friendly text

3. **Error Handling Patterns**:
   - MUST catch errors at function start with early returns
   - MUST model expected errors as return values
   - MUST log detailed errors server-side
   - NEVER catch errors without handling them
   - MUST provide recovery paths where possible
   - MUST handle all possible error states with appropriate messages

## 15. Dependencies/Packages

1. **Airtable**  
   - MUST use the official Airtable SDK for all Airtable operations
   - MUST pin Airtable SDK version in package.json (no `^` or `~`)
   - MUST NOT use any other Airtable client libraries
   - MUST keep schema in sync using schema-fetcher
   - MUST NEVER commit tokens or keys

2. **Supabase**  
   - Only for auth; pinned version; do not import unused subpackages (e.g., Postgres clients or storage)  

3. **UI Libraries**  
   - MUST stick to shadcn (Radix under the hood)  
   - MUST NOT add other competing UI libraries  

4. **General**  
   - Keep dependencies updated to patch versions for security  
   - MUST remove any unused dependencies  

## 16. Styling & Theme

1. **Theme Configuration**  
   - **MUST** use shadcn's theme configuration system.  
   - **MUST** define all theme tokens in `app/globals.css` under `@layer base`, or in `tailwind.config.ts` using the `extend` property.  
   - **MUST** keep naming **semantic** (describing purpose) rather than purely visual (e.g., `--primary`, not `--blue500`).  
   - **MUST NOT** override shadcn's **base** component styles directly (e.g., by editing their source files).  
   - **SHOULD** define **additional** tokens or custom colors in **Tailwind's** theme (under `extend.colors`) if truly needed, rather than ad hoc custom CSS.

2. **Color Tokens**  
   - **MUST** rely on these semantic tokens for consistent theming:
     ```
     background / foreground
     card / card-foreground
     popover / popover-foreground
     primary / primary-foreground
     secondary / secondary-foreground
     muted / muted-foreground
     accent / accent-foreground
     destructive / destructive-foreground
     border
     input
     ring
     ```
   - **MUST** avoid raw color variables (hex, rgb, etc.) in components.  
   - **MUST** define any new tokens in `tailwind.config.ts` or as CSS variables (in HSL) following the same naming pattern (e.g., `--custom-brand`).

3. **Interactive States**  
   - **MUST** use **semantic tokens** plus Tailwind states for hover, focus, active, disabled, etc. For example:
     ```css
     hover:bg-muted hover:text-muted-foreground
     focus-visible:ring-2 focus-visible:ring-ring
     disabled:opacity-50
     data-[state=open]:bg-accent
     ```
   - **MUST** use **opacity modifiers** only on semantic tokens (e.g. `bg-primary/80`).  
   - **MUST NOT** create new custom states or combine tokens in conflicting ways.

4. **Component Styling**  
   - **MUST** use the **shadcn** composition pattern with:
     ```tsx
     className={cn(
       "base-classes",
       condition && "conditional-classes"
     )}
     ```
   - **MUST** rely on **Tailwind utilities** (spacing, flex, grid, etc.) instead of writing standalone CSS whenever possible.  
   - **MUST NOT** override shadcn transitions or animations by default—extend via composition if absolutely needed.  
   - **MUST NOT** create one-off color tokens (e.g., `--my-button-bg`); use existing tokens or properly extend the theme.

5. **Dark Mode**  
   - **MUST** implement dark mode using Tailwind's class strategy:
     ```ts
     /** @type {import('tailwindcss').Config} */
     module.exports = {
       darkMode: ["class"],
       // ...
     }
     ```
   - **MUST** define parallel light/dark tokens in `globals.css` (e.g., `--primary: 222.2 47.4% 11.2%` for light mode and another HSL value for dark mode).  
   - **MUST** test all components in both modes.  
   - **MUST** maintain the **same** semantic token names for both light and dark.  

6. **CSS Variables**  
   - **MUST** store color values in HSL format (e.g., `--primary: 222.2 47.4% 11.2%`).  
   - **MUST** reference them via `hsl(var(--primary))`.  
   - **MUST NOT** use raw color values directly in components.  
   - **MUST** keep **matching** variable naming for light/dark modes (same property names, different HSL values).

7. **Responsive Design**  
   - **MUST** use Tailwind's breakpoint system (`sm:`, `md:`, `lg:`, etc.).  
   - **SHOULD** design **mobile-first**, layering on styles for larger screens.  
   - **MUST** test all interactive states across breakpoints (e.g., hover might not apply on mobile).  
   - **MUST** maintain consistent spacing scales across breakpoints.

8. **Animation & Transitions**  
   - **MUST** use shadcn's **predefined** animations or Tailwind's built-in `animate-*` classes.  
   - **MUST** respect user preferences for reduced motion (`prefers-reduced-motion`).  
   - **SHOULD** maintain consistent transition durations and easing.  
   - **MUST** avoid random or excessive animations that conflict with the minimal UI approach.

9. **Style Inheritance & Overrides**  
   - **MUST** use a `className` prop with `cn()` to override or extend styles.  
   - **MUST** rely on each component's **variant API** (e.g., `size`, `variant`) for consistent adjustments.  
   - **MUST** document style overrides if they significantly alter the design.  
   - **MUST NOT** override shadcn's internal classes ad hoc or by editing source files directly.

10. **Additional Suggestions**  
    - **Consistent Typography**  
      - **SHOULD** define a **type scale** (e.g., `--font-size-sm`, `--font-size-base`, `--font-size-lg`) in `globals.css` or `tailwind.config.ts` for uniform sizing.  
      - **MUST** use **semantic naming** for headings and body text (e.g., `.text-title`, `.text-body`) if adding custom classes.

    - **Limit "One-Off" Customizations**  
      - **MUST** strive to use existing utility classes and tokens in all new components.  
      - **MUST** unify repeated style patterns (e.g., if multiple cards share a style, create a `card` variant).

    - **Document Extensions**  
      - **SHOULD** update or maintain a short **theming reference doc** whenever new tokens or styles are added (e.g., `docs/theming.md`).  
      - **MUST** clarify **why** each new token exists (business need, brand requirement, etc.) so future developers (and Cursor) don't introduce duplicates.

## 17. Environment Variables

1. **File Usage**  
   - MUST use `.env.local` for local development  
   - MUST use `.env.example` for documenting **all** variables  
   - MUST NEVER commit `.env.local` or other `.env.*` files  
   - MUST keep `.env.example` up to date with every required variable  
   - MUST define ALL environment variables in `.env.example`

2. **Variable Naming**  
   - MUST prefix client-side variables with `NEXT_PUBLIC_`  
   - MUST use SCREAMING_SNAKE_CASE for all variables  
   - MUST prefix feature flags with `FEATURE_` (e.g. `FEATURE_SOMETHING_EXPERIMENTAL`)  

3. **Security**  
   - MUST store credentials such as the **Airtable API key** and **Supabase keys** in environment variables  
   - MUST NEVER expose sensitive values in client-side code  
   - MUST NEVER log environment variables  
   - MUST validate all required environment variables on startup  

## 18. Testing

1. **Test Location**  
   - Co-locate feature tests with the code in `__tests__` subdirectories  
   - End-to-end tests go in `/tests/e2e`  

2. **Test Files**  
   - Use `.test.ts` for unit tests, `.spec.ts` for integration tests  
   - Match the source file name (e.g., `Button.tsx` → `Button.test.tsx`)  

3. **Test Tools**  
   - Use Vitest for unit tests  
   - Use Playwright for integration/e2e tests  

4. **Coverage**  
   - Ensure coverage for all critical data-handling code (Airtable row checks, role logic)  
   - Include GP/LP role separation logic in tests  

## 19. Next.js 15 Breaking Changes

1. **Server Actions**
   - **MUST** declare all Server Actions as async functions:
     ```ts
     // Before (will error in Next.js 15)
     export function myAction() {}
     
     // After (required in Next.js 15)
     export async function myAction() {}
     ```
   - This applies to:
     - All functions marked with 'use server'
     - All functions in files marked with 'use server'
     - All Server Action functions passed to forms
   - **MUST NOT** use non-async Server Actions even if they don't contain async operations

2. **Cookie Handling**  
   - **MUST** handle `cookies()` as an async operation:
     ```ts
     const cookieStore = await cookies()
     ```
   - **MUST** make cookie operations async in server components and route handlers:
     ```ts
     cookies: {
       async get(name: string) {
         return (await cookieStore).get(name)?.value
       },
       async set(name: string, value: string) {
         (await cookieStore).set(name, value)
       },
       async remove(name: string) {
         (await cookieStore).delete(name)
       }
     }
     ```
   - **MUST** handle both request and response cookies in middleware:
     ```ts
     set(name: string, value: string, options: CookieOptions) {
       // Set on request
       request.cookies.set({ name, value, ...options })
       // Set on response
       response.cookies.set({ name, value, ...options })
     }
     ```

3. **Fetch Caching**  
   - Fetch requests are no longer cached by default
   - **MUST** explicitly opt-in to caching with `cache: 'force-cache'`:
     ```ts
     // Not cached
     const data = await fetch('https://api.example.com')
     
     // Cached
     const data = await fetch('https://api.example.com', { 
       cache: 'force-cache' 
     })
     ```
   - **MAY** use `fetchCache = 'default-cache'` segment config to opt-in entire layouts/pages

4. **Route Handlers**  
   - `GET` functions in Route Handlers are no longer cached by default
   - **MUST** explicitly opt-in to caching with route config:
     ```ts
     export const dynamic = 'force-static'
     export async function GET() {}
     ```

5. **Client-side Router Cache**  
   - Page segments are no longer reused from client-side router cache
   - **MAY** opt-in to caching with `staleTimes` config:
     ```ts
     // next.config.js
     module.exports = {
       experimental: {
         staleTimes: {
           dynamic: 30,
           static: 180,
         },
       },
     }
     ```

6. **Error Handling**  
   - **MUST** handle async errors in cookie operations
   - **MUST** provide fallbacks for cookie operations that may fail
   - **MUST** handle cases where cookies are not available or accessible