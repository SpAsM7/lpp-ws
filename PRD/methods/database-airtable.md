# Airtable Integration

> **Documentation Guidelines**
> - Keep this document as a quick reference guide
> - List only key file locations and method names
> - Avoid including implementation details or code snippets
> - Focus on file paths and function names that others need to find
> - Update when adding new core functionality or changing file structure

## Overview

We use Airtable as our primary database, with Supabase handling only authentication. The integration is built using:
- `airtable-ts`: A type-safe Airtable SDK
- Custom schema generation tools
- Strongly-typed table configurations

## Schema Management

### Configuration Files

1. Environment Configuration:
   - Location: `docs/environment-setup.md`
   - Contains all required Airtable environment variables
   - Reference for setting up `.env` files

2. Schema Validation:
   - Location: `src/lib/airtable/client.ts`
   - Validates all Airtable configuration at runtime
   - Includes table ID validation

### Fetching & Updating Schema

We maintain type safety by automatically generating TypeScript types from the Airtable schema. To update the schema:

1. Run the schema fetcher:
   ```bash
   pnpm tsx src/lib/airtable/schema-fetcher.ts
   ```

This will:
- Fetch the latest schema from Airtable
- Generate TypeScript interfaces in `src/types/airtable-schema.ts`
- Save the raw schema as JSON in `src/lib/airtable/schema.json`

### Generated Files

1. `src/types/airtable-schema.ts`:
   - Contains TypeScript interfaces for all tables
   - Used for type checking and autocompletion
   - Do not edit manually
   - **Schema Type Rules**:
     - All field types MUST be nullable (e.g., `string | null`)
     - Attachment fields MUST use:
       - Interface type: `{ url: string; filename: string; }[] | null`
       - Schema type: `"attachment"`
     - Array fields MUST preserve nullability (e.g., `string[] | null`)

2. `src/lib/airtable/schema.json`:
   - Raw schema from Airtable API
   - Includes field IDs, types, and options
   - Useful for debugging and documentation

## Server-Side Only Pattern

All Airtable operations MUST be server-side only. Key files and methods:

### Data Access Layer
- Location: `src/lib/airtable/client.ts`
- Key Methods:
  - `validateAirtableConfig()`: Validates all Airtable environment variables
  - `scanUsers()`: Fetch users with optional filtering and limits

### Server Actions
- Location: `src/lib/actions/user-actions.ts`
- Key Methods:
  - `getUserBySupabaseId()`: Fetch user profile by Supabase ID
- Location: `src/lib/actions/user/get-current-user.ts`
- Key Methods:
  - `getCurrentUser()`: Get current user profile combining Supabase auth and Airtable data

### Client Instance Management

1. **Supabase Client**
   - Location: `src/lib/supabase/server.ts`
   - MUST follow standardized cookie handling patterns as documented in `@auth.md`
   - MUST cache client instances at module level:
     ```typescript
     /** Cached Supabase client instance for server-side operations */
     let supabaseClient: ReturnType<typeof createClient> | null = null;
     
     export async function getServerClient() {
       if (!supabaseClient) {
         supabaseClient = await createClient();
       }
       return supabaseClient;
     }
     ```

2. **Airtable Client**
   - Location: `src/lib/airtable/client.ts`
   - Key Methods:
     - `validateAirtableConfig()`: Validates all Airtable environment variables
     - `scanUsers()`: Fetch users with optional filtering and limits
   - MUST use environment variables for all table IDs
   - MUST validate configuration before client initialization

3. **Query Client**
   - Location: `src/components/providers/query-provider.tsx`
   - MUST use `useRef` to maintain stable instance:
     ```typescript
     /** Stable QueryClient instance for data fetching and caching */
     const queryClient = useRef(
       new QueryClient({
         defaultOptions: {
           queries: {
             staleTime: 5 * 60 * 1000,    // 5 minutes
             gcTime: 30 * 60 * 1000,      // 30 minutes
             retry: 3,
             refetchOnMount: true,        // Allow initial data fetch
             refetchOnWindowFocus: false, // Prevent unnecessary refetches
             refetchOnReconnect: false,   // Prevent unnecessary refetches
           },
         },
       })
     ).current;

### Domain-Based Client Usage
- Location: `src/lib/domains/user/hooks/use-user-profile.ts`
- Key Methods:
  - `useUserProfile()`: React Query hook for accessing user profile data
  - MUST handle errors with toast notifications
  - MUST implement proper TypeScript types for all responses
  - MUST document side effects in JSDoc comments

### Error Handling
- MUST use structured error types
- MUST provide user-friendly error messages
- MUST implement proper error logging
- MUST NOT expose internal error details to clients

### Response Types
- MUST use `UserActionResponse<T>` for all user-related actions
- MUST include proper error typing
- MUST set `isSuccess` based on presence of data and absence of error
- MUST type the `data` field appropriately for each action

### Schema Types
- Location: `src/types/airtable-schema.ts`
- Generated Types:
  - `FilesFields`: Type for files table
  - `ActivitiesFields`: Type for activities table

### Error Types
- Location: `src/lib/airtable/client.ts`
- Types:
  - `AirtableError`: Custom error for Airtable-related failures

### Response Types
- Location: `src/types/user.ts`
- Types:
  - `UserActionResponse`: Standard response format for user actions
  - `NormalizedUserProfile`: Normalized user profile data

### Schema Generation
- Location: `src/lib/airtable/schema-fetcher.ts`
- Key Methods:
  - `fetchSchema()`: Fetches and generates schema types