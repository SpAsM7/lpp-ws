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

### Schema Generation Pattern

1. **Schema Fetcher**:
   - Location: `src/lib/airtable/schema-fetcher.ts`
   - Fetches latest schema from Airtable
   - Maps field types to TypeScript types
   - Returns `null` for unsupported types
   - Special handling for rollup fields (always `string[]`)
   - Preserves raw schema in JSON format

2. **Generated Files**:
   - `src/types/airtable-types.ts`: TypeScript interfaces
   - `src/lib/airtable/schemas.ts`: Raw schemas for airtable-ts
   - `src/lib/airtable/validation.ts`: Zod validation schemas
   - `src/lib/airtable/schema.json`: Raw schema for reference
   - MUST NOT modify generated files directly
   - MUST regenerate after any Airtable schema changes

3. **Field Transforms**:
   - Location: `src/lib/airtable/utils/transforms.ts`
   - Handles complex field transformations
   - Used by domain services to transform raw data
   - Common transforms:
     - Attachments: `string[] -> { url: string; filename: string; }[]`
     - Rollups: Ensures array handling
     - Links: Record ID normalization

### Usage Pattern

1. **Schema Layer**:
   - Keep types simple and aligned with Airtable's API
   - Let transforms handle complex field structures
   - Filter out unsupported types
   - Document special cases in schema.json

2. **Transform Layer**:
   - Centralize all transforms in utils
   - Keep transforms pure and well-documented
   - Handle null/undefined cases consistently
   - Used by domain services, not schema generation

3. **Domain Layer**:
   - Import and use transforms as needed
   - Handle access validation separately
   - Focus on business logic
   - Maintain type safety through the chain

### Type Safety Pattern

1. **Schema Types**:
   - Simple types matching Airtable's API
   - Nullable fields where appropriate
   - Array types for multi-value fields
   - Special handling documented in schema.json

2. **Runtime Validation**:
   - Zod schemas for runtime checks
   - Validation happens after transforms
   - Error handling at domain level
   - Clear error messages for debugging

3. **Access Patterns**:
   - Validate access in domain services
   - Use centralized validation utilities
   - Handle user_id fields consistently
   - Document access patterns clearly

### Fetching & Updating Schema

We maintain type safety by automatically generating TypeScript types from the Airtable schema. To update the schema:

1. Run the schema fetcher:
   ```bash
   pnpm tsx src/lib/airtable/schema-fetcher.ts
   ```

This will:
- Fetch the latest schema from Airtable
- Generate three separate type files:
  - TypeScript interfaces in `src/types/airtable-types.ts`
  - Raw schemas in `src/lib/airtable/schemas.ts`
  - Zod validation in `src/lib/airtable/validation.ts`
- Save raw schema as JSON in `src/lib/airtable/schema.json`

### Generated Files

1. `src/types/airtable-types.ts`:
   - Contains TypeScript interfaces for all tables
   - Used for type checking and autocompletion
   - Do not edit manually

2. `src/lib/airtable/schemas.ts`:
   - Contains raw schemas for airtable-ts
   - Used for runtime API interactions
   - Do not edit manually

3. `src/lib/airtable/validation.ts`:
   - Contains Zod schemas for runtime validation
   - Used for data validation
   - Do not edit manually

4. `src/lib/airtable/schema.json`:
   - Raw schema from Airtable API
   - Includes field IDs, types, and options
   - Useful for debugging and documentation

### Schema Generation Rules
- MUST use schema-fetcher to generate all types
- MUST NOT modify generated files directly
- MUST regenerate after any Airtable schema changes
- MUST verify type consistency across all three layers
- MUST NOT mix access validation with type generation

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

### Authentication Integration

1. **Session Management**
   - MUST use Supabase's built-in session management via:
     - Server: `createServerClient` from `@supabase/ssr` in `src/lib/supabase/server.ts`
     - Client: `createBrowserClient` from `@supabase/ssr` in `src/lib/supabase/client.ts`
     - Auth state: `auth.getUser()` for verification (not `getSession`)
   - MUST NOT create custom session management hooks
   - MUST use secure HTTP-only cookies only
   - MUST use appropriate Supabase client based on context (server/client/middleware)

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

### React Query Pattern
- MUST destructure hook results correctly with `data`, `isLoading`, and `error`
- MUST use TypeScript data renaming syntax when aliasing the data field
- MUST handle loading states with shadcn Skeleton components
- MUST show appropriate error toasts on failure
- MUST type the query response properly

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
- Location: `src/types/airtable-types.ts`
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

1. **Schema Fetcher** (`src/lib/airtable/schema-fetcher.ts`)
   - Generates three files:
     - `src/types/airtable-types.ts` - TypeScript interfaces
     - `src/lib/airtable/schemas.ts` - Raw schemas
     - `src/lib/airtable/validation.ts` - Zod schemas
   - Keeps special field types simple:
     - Attachments: `string[] | null`
     - Rollups: `string[] | null`
     - Links: `string[] | null`
   - Raw schema preserved in `schema.json` for reference

2. **Generated Files**
   - MUST NOT be modified directly
   - MUST be regenerated after Airtable schema changes
   - MUST maintain type consistency across all three layers

## Field Transforms

1. **Transform Layer** (`src/lib/airtable/utils/transforms.ts`)
   - Centralizes all field transformations
   - Handles complex field types:
     - Attachments: Convert to `{ url: string; filename: string; }[]`
     - Rollups: Normalize array handling
     - Links: Process linked record data

2. **Usage Pattern**
   - Domain services import transforms from airtable utils
   - Apply transforms when processing records
   - Keep transforms pure and focused on data conversion
   - Handle null/undefined cases consistently

3. **Flow**
   Schema Fetcher -> Simple Types -> Transforms -> Domain Services

4. **Rules**
   - MUST use centralized transforms for consistency
   - MUST handle null cases in transforms
   - MUST document transform function purposes
   - MUST NOT mix business logic with transforms

## Access Validation Pattern

### Centralized Access Control
- Location: `src/lib/airtable/utils/validate-access.ts`
- Key Methods:
  - `validateRecordAccess(record, supabaseId)`: Validates single record access
  - `filterRecordsByAccess(records, supabaseId)`: Filters array of records by access

### Implementation Rules
- MUST validate access BEFORE returning any record data
- MUST use centralized validation utilities for all record access
- MUST NOT implement custom access checks
- MUST check `user_id` field which contains comma-separated list of authorized Supabase UUIDs
- MUST handle access denied with standard error response:
  ```typescript
  type ActionResponse<T> = {
    success: boolean;
    message: string;
    error?: {
      code: 'ACCESS_DENIED' | 'FETCH_ERROR' | 'NOT_FOUND';
      details: string;
    };
    data?: T;
  };
  ```
### Usage Pattern
- MUST validate single records with `validateRecordAccess`
- MUST filter record arrays with `filterRecordsByAccess`
- MUST validate in service layer before any transformations
- MUST NOT expose records without validation
- MUST log access denied events for security monitoring

## Type Safety Patterns

### Three-Layer Type Safety

All fields in our Airtable integration require three layers of type safety to work correctly:

1. **Schema Definition** (for airtable-ts) in `src/lib/airtable/schemas.ts`:
   - Tells airtable-ts how to handle API interactions
   - Uses simplified types that the library understands
   ```ts
   export const usersTable = {
     schema: {
       name: "string | null",
       age: "number | null",
       avatar: "string[] | null"  // Special case for attachments
     }
   } as const satisfies Table<UsersFields>;
   ```

2. **TypeScript Interface** (for compile-time type safety) in `src/types/airtable-types.ts`:
   - Defines the exact shape of our data
   - More specific than schema definitions
   ```ts
   export interface UsersFields extends BaseFields {
     name?: string | null;
     age?: number | null;
     avatar?: { url: string; filename: string; }[] | null;  // More specific for attachments
   }
   ```

3. **Zod Schema** (for runtime validation) in `src/lib/airtable/validation.ts`:
   - Validates data at runtime
   - Matches TypeScript interface structure
   ```ts
   export const UsersSchema = z.object({
     name: z.string().nullable().optional(),
     age: z.number().nullable().optional(),
     avatar: z.array(z.object({  // Complex validation for attachments
       url: z.string(),
       filename: z.string()
     })).nullable().optional()
   });
   ```

### Type Generation Pattern
- Uses single-pass type resolution
- Handles computed fields uniformly
- Returns null for unsupported types
- Logs warnings for debugging
- Maintains type consistency across layers
- Separates access validation from type generation

## Special Cases - Attachments

**Attachments** are a notable example where these layers differ significantly:
- Schema: Must use `"string[] | null"` (airtable-ts maps attachments to string arrays)
- TypeScript: Must use `string[] | null` (matches schema type exactly)
- Zod: Must use array validation with string elements:
  ```ts
  z.object({
    id: z.string(),
    avatar: z.optional(z.array(z.string()).nullable())
  })
  ```

**Data Transformation Pattern**:
- Keep types simple (`string[] | null`) in schema/interface/validation layers
- Transform attachment data to include full details ONLY in the application layer:
  ```ts
  // In server actions or domain logic:
  interface AttachmentDetails {
    url: string;
    filename: string;
  }

  function transformAttachmentData(data: string[] | null): AttachmentDetails[] | null {
    if (!data) return null;
    return data.map(attachment => ({
      url: attachment,
      filename: attachment.split('/').pop() || ''
    }));
  }
  ```
- This separation keeps the schema clean while preserving type safety where detailed data is needed

Other field types (strings, numbers, etc.) have more straightforward mappings across the layers.

The schema generator (`schema-fetcher.ts`) handles these mappings automatically for all field types, but it's crucial to understand this pattern when:
- Debugging type errors
- Adding new fields manually
- Working with complex field types like attachments
- Transforming data in the application layer

**Breaking this pattern for any field type will cause type errors or runtime issues.**
