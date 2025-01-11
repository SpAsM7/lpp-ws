# Steps to Display User Avatar from Airtable

## Overview
This process outlines how to display a user's avatar image from Airtable in the LP Portal UI.

## Prerequisites

1. Ensure environment variables are set:
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
   - `AIRTABLE_USERS_TABLE_ID`

2. Run schema generation to ensure types are up to date:
   ```bash
   pnpm tsx src/lib/airtable/schema-fetcher.ts
   ```

3. Verify type safety across all three layers:

   a. Check schema definition in `src/types/airtable-schema.ts`:
   ```ts
   export const usersTable = {
     schema: {
       avatar: "string[] | null"  // Airtable attachment type shape
     }
   }
   ```

   b. Verify TypeScript interface in same file:
   ```ts
   export interface UsersFields extends BaseFields {
     avatar?: string[] | null;
   }
   ```

   c. Confirm Zod schema validation:
   ```ts
   export const UsersSchema = z.object({
     id: z.string(),
     avatar: z
       .array(z.string())
       .nullable()
       .optional()
   });
   ```

   Make sure all three layers have the **same** shape for the avatar field!

4. Authentication Requirements:
   - MUST use Supabase's built-in session management via:
     - Server: `createServerClient` from `@supabase/ssr` in `src/lib/supabase/server.ts`
     - Client: `createBrowserClient` from `@supabase/ssr` in `src/lib/supabase/client.ts`
     - Auth state: `auth.getUser()` for verification (not `getSession`)
   - MUST NOT create custom session management hooks
   - MUST use secure HTTP-only cookies only
   - MUST use appropriate Supabase client based on context (server/client/middleware)

## Steps

### 1. Update Server Action
Location: `src/lib/actions/user-actions.ts`
- Update `getUserBySupabaseId` to:
  - Use airtable-ts `scan` method with filter: `{user_id} = '[supabase_id]'`
  - Extract avatar URL from the first matching user record
  - Transform the attachment data to include full details (url, filename) only at this layer
  - Ensure proper validation using `userProfileSchema`

### 2. Create Domain Hook
Location: `src/lib/domains/user/hooks/use-user-profile.ts`
- Create hook to fetch and manage user profile data
- Use Supabase's built-in session management for auth state
- Handle validation errors appropriately
- Work with the transformed attachment data that includes full details
- **MUST** follow React Query's data destructuring pattern:
  ```typescript
  // In the hook implementation:
  return useQuery<NormalizedUserProfile>({
    queryKey: ['user-profile', supabaseId],
    queryFn: async () => { ... }
  })

  // When using the hook:
  const { data: profile, isLoading, error } = useUserProfile()
  ```
- Handle loading states with shadcn Skeleton components
- Show appropriate error toasts on failure

### 3. Update Sidebar Component
Location: `src/components/layout/main-sidebar.tsx`
- Use the `useUserProfile` hook to get avatar data
- Update Avatar component to display the image
- Handle loading and error states

## Notes
- The avatar field in Airtable is an attachment type field
- Keep types simple (`string[] | null`) in schema/interface layers
- Transform attachment data to include full details (url, filename) only in the application layer (server actions, domain logic)
- Airtable returns attachments as an array of objects with `url` and `filename` properties
- We use the first attachment's URL if multiple are present
- The Avatar component will show the first letter of the user's name if no avatar is present
- All data must pass Zod validation before being used in components

## Type Definitions
The necessary types are already defined in:
- `src/types/user.ts` - For the normalized user profile and Zod schema
- `src/types/airtable-schema.ts` - For the raw Airtable fields

## Airtable-ts Methods Used
- `scan<T>`: Used to query users table with filters
- `Table<T>`: Type interface for table definitions
- `Item`: Base interface that our user types extend
- Response mapping handled by airtable-ts's `mapRecordFromAirtable`
