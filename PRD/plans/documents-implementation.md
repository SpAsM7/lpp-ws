# Working Status - Documents UI Airtable Integration

## Overview
Implementation plan for the Documents UI Airtable integration. This document serves as the authoritative reference for file locations, function names, and required implementation patterns.

> **Documentation Guidelines**
> - MUST specify exact file paths for all components, types, and utilities
> - MUST list complete function names with their parameters
> - MUST document all required patterns with clear MUST/MUST NOT rules
> - MUST maintain up-to-date references to key dependencies
> - MUST include specific implementation steps with clear prerequisites
> - MUST NOT include implementation details or code snippets except
 for critical patterns
> - MUST update this document when:
>   - Adding new file paths
>   - Creating new functions or hooks
>   - Modifying core patterns
>   - Changing file organization
>   - Adding new dependencies

## Critical Rules
1. **Schema Modifications**
   - MUST NEVER modify generated files directly:
     - `src/types/airtable-types.ts`
     - `src/lib/airtable/schemas.ts`
     - `src/lib/airtable/validation.ts`
   - MUST discuss ALL schema changes before implementation
   - MUST wait for explicit approval before proceeding with Airtable changes
   - MUST regenerate types using schema-fetcher after Airtable changes
   - MUST verify type consistency across all three layers
   - MUST NOT mix access validation with type generation

2. **UI Preservation**
   - MUST preserve existing UI design exactly as is
   - MUST NOT modify any visual elements, layouts, or styling
   - MUST NOT add new UI components without explicit approval
   - MUST focus ONLY on Airtable integration logic
   - MUST limit UI changes to ONLY:
     - Adding PDF preview modal/overlay
     - Adding loading states
     - Adding "No documents found" message
     - Adding type filter dropdown (if not present)

## Prerequisites

1. Environment Variables:
   - AIRTABLE_API_KEY
   - AIRTABLE_BASE_ID
   - AIRTABLE_DOCUMENTS_TABLE_ID
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

2. Schema Generation:
   ```bash
   pnpm tsx src/lib/airtable/schema-fetcher.ts
   ```

## Required Patterns

### Data Layer Patterns

1. **Session Management**
   - MUST use Supabase's built-in session management via:
     - Server: `createServerClient` from `@supabase/ssr` in `src/lib/supabase/server.ts`
     - Client: `createBrowserClient` from `@supabase/ssr` in `src/lib/supabase/client.ts`
     - Auth state: `auth.getUser()` for verification (not `getSession`)
   - MUST NOT create custom session management hooks
   - MUST use secure HTTP-only cookies only
   - MUST use appropriate Supabase client based on context (server/client/middleware)

2. **Airtable Client Management**
   - MUST use airtable-ts client in `src/lib/airtable/client.ts`
   - MUST cache client instance at module level using:
     ```ts
     let airtableClient: ReturnType<typeof createClient> | null = null;
     ```
   - MUST validate configuration in `validateAirtableConfig()`
   - MUST use environment variables for all table IDs
   - MUST NOT create new client instances in components or actions

3. **Type Safety Pattern**
   - MUST implement three-layer type safety:
     1. **Schema Definition** (for airtable-ts) in `src/lib/airtable/schemas.ts`:
        ```ts
        export const documentsTable = {
          schema: {
            name: "string | null",
            description: "string | null",
            attachment: "string[] | null"  // Special case for attachments
          }
        } as const satisfies Table<DocumentsFields>;
        ```
     2. **TypeScript Interface** in `src/types/airtable-types.ts`:
        ```ts
        export interface DocumentsFields extends BaseFields {
          name?: string | null;
          description?: string | null;
          attachment?: { url: string; filename: string; }[] | null;
        }
        ```
     3. **Zod Schema** in `src/lib/airtable/validation.ts`:
        ```ts
        export const documentSchema = z.object({
          name: z.string().nullable().optional(),
          description: z.string().nullable().optional(),
          attachment: z.array(z.object({
            url: z.string(),
            filename: z.string()
          })).nullable().optional()
        });
        ```
   - MUST handle attachment fields with proper type transformations
   - MUST validate all data through Zod before use
   - MUST maintain type consistency across all three layers
   - MUST NOT modify generated files directly
   - MUST regenerate types using schema-fetcher when Airtable schema changes
   - MUST use defensive type generation that filters invalid types
   - MUST NOT mix access validation with type generation

4. **Field Transforms Pattern**
   - MUST use centralized transforms from `src/lib/airtable/utils/transforms.ts`:
     - Handles complex field types
     - Keeps transforms pure and focused on data conversion
     - Maintains separation from business logic
   
   - **Transform Layer** (`src/lib/airtable/utils/transforms.ts`):
     - Centralizes all field transformations
     - Supported transforms:
       - Attachments: Convert to `{ url: string; filename: string; }[]`
       - Rollups: Normalize array handling
       - Links: Process linked record data

   - **Usage Pattern**:
     - Domain services import transforms from airtable utils
     - Apply transforms when processing records
     - Keep transforms pure and focused on data conversion
     - Handle null/undefined cases consistently

   - **Flow**:
     Schema Fetcher -> Simple Types -> Transforms -> Domain Services

   - **Rules**:
     - MUST use centralized transforms for consistency
     - MUST handle null cases in transforms
     - MUST document transform function purposes
     - MUST NOT mix business logic with transforms
     - MUST keep transforms pure and side-effect free
     - MUST handle all edge cases consistently

5. **Data Access Pattern**
   - MUST use Server Components for direct Airtable access
   - MUST use Server Actions for client-initiated operations
   - MUST validate access using utilities from `src/lib/airtable/utils/validate-access.ts`:
     - `validateRecordAccess(record, supabaseId)` for single records
     - `filterRecordsByAccess(records, supabaseId)` for arrays
   - MUST filter by user's `supabase_uuid` before returning data
   - MUST implement proper pagination using `scanDocuments()`
   - MUST batch related changes when possible
   - MUST NOT implement custom access checks outside validate-access.ts

6. **Access Validation Pattern**
   - MUST use centralized validation from `src/lib/airtable/utils/validate-access.ts`
   - MUST validate access BEFORE returning any record data
   - MUST check user_id field which contains comma-separated list of authorized Supabase UUIDs
   - MUST NOT implement custom access checks outside the centralized utilities
   - MUST NOT return data without validating access
   - MUST use consistent error responses for access denied
   - MUST NOT mix access validation with type generation or schema fetching

7. **React Query Pattern**
   - MUST implement hooks in `src/lib/domains/documents/hooks/`:
     - `useDocumentList` for main document list
     - `useDocumentSearch` for filtered results
   - MUST configure proper cache times:
     - staleTime: 5 minutes
     - gcTime: 30 minutes
   - MUST handle loading/error states consistently
   - MUST implement proper cache invalidation

8. **Attachment Pattern**
   - MUST handle Airtable attachment URLs in `src/lib/domains/documents/services/`:
     - `getAttachmentUrl.ts` → `getAttachmentUrl(documentId: string)`
     - `validateAttachmentAccess.ts` → `validateAttachmentAccess(documentId: string, supabaseId: string)`
   - MUST verify user permissions before returning URL
   - MUST handle URL expiration
   - MUST implement proper error states for missing/invalid attachments

### UI Layer Patterns

1. **Component Architecture**
   - MUST place page components in `app/(dashboard)/documents/`:
     - `page.tsx` for list view
     - `[id]/page.tsx` for detail view
     - `loading.tsx` for route loading
     - `error.tsx` for route errors
   - MUST place all page specific components in `app/(dashboard)/documents/_components/`:
     - `documents-table.tsx`
     - `columns.tsx`
     - `data-table-toolbar.tsx`
     - `data-table-faceted-filter.tsx`
     - `documents-header.tsx`
     - `document-search/` (search and filter components)
     - `document-list/` (list components)
     - `document-preview/` (preview components)
   - MUST move components to `src/components/documents/` ONLY when they are actually reused in other pages
   - MUST default to Server Components
   - MUST mark as Client Component only when needed:
     - `DocumentSearch` (for search input)
     - `DocumentPreview` (for modal)
     - `DocumentListItem` (for interactions)

2. **Loading State Pattern**
   - MUST implement in `app/(dashboard)/documents/loading.tsx`
   - MUST create skeleton components:
     - `DocumentListSkeleton.tsx` for initial page load
     - `DocumentPreviewSkeleton.tsx` for PDF loading
     - `DocumentSearchSkeleton.tsx` for search loading
   - MUST add "No documents found" state in `DocumentList.tsx`
   - MUST wrap client components in Suspense
   - MUST co-locate loading states with components

3. **Error Handling Pattern**
   - MUST define errors in `src/lib/errors/documents.ts`
   - MUST implement boundaries at:
     - Page level in documents/error.tsx
     - List level in DocumentList/error.tsx
     - Preview level in DocumentPreview/error.tsx
   - MUST provide recovery UI for each error type
   - MUST log errors server-side with context

4. **Styling Pattern**
   - MUST use shadcn components from `src/components/ui/`:
     - Table for document list
     - Dialog for preview
     - Input for search
     - Select for filters
   - MUST use semantic tokens from theme
   - MUST implement responsive layouts
   - MUST handle dark mode correctly

## Key Files & Functions

### Data Layer

1. **Airtable Schema & Types**
   - `src/types/airtable-types.ts` - TypeScript interfaces
   - `src/lib/airtable/schemas.ts` - airtable-ts schemas
   - `src/lib/airtable/validation.ts` - Zod validation schemas
   - `src/lib/airtable/schema.json` - Raw schema for reference
   - `src/lib/airtable/schema-fetcher.ts` - Schema generation utility
   MUST NOT modify generated files directly - see Critical Rules

2. **Domain Types**
   Location: `src/lib/domains/documents/types.ts`
   - `Document` interface (normalized)
   - `DocumentWithRelations` interface
   - `DocumentActionResponse<T>` type

3. **Server Actions**
   Location: `src/lib/actions/documents/`
   - `getDocumentsForUser.ts` → `getDocumentsForUser(supabaseId, options)`
   - `getDocumentById.ts` → `getDocumentById(id, supabaseId)`
   - `searchDocuments.ts` → `searchDocuments(query, supabaseId, options)`
   - `getDocumentsByCompany.ts` → `getDocumentsByCompany(companyId, supabaseId)`
   - `getDocumentsByAccount.ts` → `getDocumentsByAccount(accountId, supabaseId)`
   - `getDocumentsByType.ts` → `getDocumentsByType(type, supabaseId)`

4. **Domain Services**
   Location: `src/lib/domains/documents/services/`
   - `document-service.ts` → Core business logic
   - `document-transform.ts` → Data transformations

5. **Domain Hooks**
   Location: `src/lib/domains/documents/hooks/`
   - `use-document-list.ts` → `useDocumentList(options)`
   - `use-document-search.ts` → `useDocumentSearch(query)`

### UI Layer

1. **Page Components**
   Location: `app/(dashboard)/documents/`
   - `page.tsx` → Main list view
   - `[id]/page.tsx` → Detail view
   - `loading.tsx` → Loading states
   - `error.tsx` → Error handling

2. **Shared Components**
   Location: `src/components/documents/`
   - document-list/
     - `DocumentList.tsx`
     - `DocumentListItem.tsx`
     - `DocumentListSkeleton.tsx`
     - `NoDocumentsFound.tsx`
   - document-search/
     - `DocumentSearch.tsx`
     - `DocumentTypeFilter.tsx`
     - `DocumentDateFilter.tsx`
   - document-preview/
     - `DocumentPreview.tsx`
     - `DocumentPreviewSkeleton.tsx`
     - `PreviewError.tsx`

3. **Error Handling**
   Location: `src/lib/errors/documents.ts`
   - Document-specific error messages
   - Error boundary components

## Implementation Steps

### 1. Schema Setup
- [ ] Review and update Airtable schema with user to match requirements
- [ ] Run schema generation (user will run this)
- [ ] Update schema documentation

### 2. Type Layer
- [ ] Create domain types and interfaces
- [ ] Add validation schemas
- [ ] Implement data transformers

### 3. Data Layer
- [ ] Configure Airtable client
- [ ] Implement server actions
- [ ] Add domain services
- [ ] Create React Query hooks

### 4. UI Layer
- [ ] Create page components
- [ ] Implement shared components
- [ ] Add loading states
- [ ] Set up error boundaries

### 5. Testing
- [ ] Add domain service tests
- [ ] Create component tests
- [ ] Implement E2E tests

### 6. Documentation
- [ ] Update component requirements
- [ ] Document API endpoints
- [ ] Add schema documentation

## Dependencies
- Airtable schema updates
- Supabase authentication
- shadcn UI components
- React Query for data fetching

## Next Steps
1. Update Airtable schema and generate types
2. Create domain types and utilities
3. Implement core server actions with tests
4. Build basic document list UI with loading states
5. Add document preview with error handling
6. Implement search and filter functionality
7. Add performance optimizations
8. Complete documentation

## Notes
- Follow Law #5 for incremental delivery
- Maintain strict type safety throughout
- Document all changes in appropriate files
- Ensure compliance with project coding rules
