# Working Status – Documents UI Airtable Integration

## Overview
Implementation plan for integrating Documents UI with Airtable. This document is the **authoritative reference** for file locations, function names, and **must/ must not** patterns.

> **Documentation Guidelines**
> - Specify **exact file paths** for all components, types, and utilities  
> - List **complete function names** with parameters  
> - Document **all required patterns** with clear MUST/MUST NOT rules  
> - Maintain **up-to-date** references to key dependencies  
> - Include **specific implementation steps** with clear prerequisites  
> - **Do not** include code snippets unless critical  
> - Update this document whenever:
>   - Adding new file paths/functions/hooks  
>   - Modifying core patterns or file organization  
>   - Adding new dependencies  

---

## Critical Rules

1. **Schema & Generated Files**  
   - **MUST NEVER** modify these generated files directly:
     - `src/types/airtable-types.ts`  
     - `src/lib/airtable/schemas.ts`  
     - `src/lib/airtable/validation.ts`  
   - **MUST** discuss **all** schema changes before implementing  
   - **MUST** wait for **explicit approval** before making Airtable changes  
   - **MUST** regenerate types with `schema-fetcher` after changes  
   - **MUST** verify type consistency across all layers  
   - **MUST NOT** mix access validation with type generation  

2. **UI Preservation**  
   - **MUST** preserve existing UI design exactly  
   - **MUST NOT** modify or add new UI components without approval  
   - **MUST** focus **only** on Airtable integration logic  
   - **MUST** limit UI changes to:
     - PDF preview modal/overlay  
     - Loading states  
     - “No documents found” message  
     - Type filter dropdown (if missing)  

---

## Prerequisites

1. **Environment Variables**  
   - `AIRTABLE_API_KEY`  
   - `AIRTABLE_BASE_ID`  
   - `AIRTABLE_DOCUMENTS_TABLE_ID`  
   - `SUPABASE_URL`  
   - `SUPABASE_ANON_KEY`

2. **Schema Generation**  
   ```bash
   pnpm tsx src/lib/airtable/schema-fetcher.ts
   ```

---

## Required Patterns

### Data Layer Patterns

1. **Session Management**  
   - **MUST** use Supabase’s built-in session management:
     - **Server**: `createServerClient` (`src/lib/supabase/server.ts`)  
     - **Client**: `createBrowserClient` (`src/lib/supabase/client.ts`)  
     - **Auth**: `auth.getUser()` (not `getSession`)  
   - **MUST NOT** create custom session hooks  
   - **MUST** use secure, HTTP-only cookies  
   - **MUST** pick the appropriate Supabase client for server/client/middleware  

2. **Airtable Client Management**  
   - **MUST** use `airtable-ts` in `src/lib/airtable/client.ts`  
   - **MUST** cache the client at module level:
     ```ts
     let airtableClient: ReturnType<typeof createClient> | null = null;
     ```
   - **MUST** validate config in `validateAirtableConfig()`  
   - **MUST** use env variables for table IDs  
   - **MUST NOT** create new Airtable clients in components or actions  

3. **Type Safety Pattern**  
   - **MUST** maintain **three-layer** type safety:
     1. **Schema Definition** (`src/lib/airtable/schemas.ts`)
     2. **TypeScript Interface** (`src/types/airtable-types.ts`)
     3. **Zod Schema** (`src/lib/airtable/validation.ts`)  
   - **MUST** handle attachments with correct transformations  
   - **MUST** validate data via Zod  
   - **MUST** keep these layers in sync  
   - For modification rules, see [Critical Rules](#critical-rules).

4. **Field Transforms Pattern**  
   - **MUST** use centralized transforms from `src/lib/airtable/utils/transforms.ts`  
   - **Transforms** are pure, focusing on data conversion (attachments, rollups, links, etc.)  
   - **Linked Records**:
     - Must batch process to avoid N+1 queries  
     - Must maintain type safety across the three layers  
     - Must handle null/undefined/circular references  

   **Usage Flow**:  
   ```
   Schema Fetcher → Simple Types → Transforms → Domain Services
   ```
   **Rules**:
   - **MUST** keep transforms side-effect free  
   - **MUST** handle edge cases consistently  
   - **MUST** validate access **before** transforming linked records  

5. **Data Access Pattern**  
   - **MUST** use **Server Components** for direct Airtable access  
   - **MUST** use **Server Actions** for client-initiated ops  
   - **MUST** validate access using `src/lib/airtable/utils/validate-access.ts`:  
     - `validateRecordAccess(record, supabaseId)`  
     - `filterRecordsByAccess(records, supabaseId)`  
   - **MUST** filter by user’s `supabase_uuid`  
   - **MUST** implement pagination with `scanDocuments()`  
   - **MUST** batch changes when possible  
   - **MUST NOT** create custom checks outside `validate-access.ts`

   **Linked Records Access**:
   - Handled in `resolve-linked-records.ts`  
   - Must separate concerns:
     1. Data fetching in `resolve-linked-records.ts`
     2. Access validation in `validate-access.ts`
     3. Transforms in `transforms.ts`  
   - **MUST** batch fetch linked records  
   - **MUST** validate parent + linked records  
   - **MUST** return `null` for inaccessible links  

6. **Access Validation Pattern**
   - **MUST** be centralized in `validate-access.ts`  
   - **MUST** validate before returning any data  
   - **MUST** check `user_id` (comma-separated Supabase UUIDs)  
   - **MUST NOT** return data without checking  
   - **MUST** use consistent errors for denial  
   - For mixing access and type generation, see [Critical Rules](#critical-rules).

7. **React Query Pattern**
   - **MUST** implement in `src/lib/domains/documents/hooks/`:
     - `useDocumentList`
     - `useDocumentSearch`
   - **MUST** use:
     - `staleTime = 5min`
     - `gcTime = 30min`
   - **MUST** handle loading/error states
   - **MUST** implement cache invalidation

8. **Attachment Pattern**
   - **MUST** handle attachment URLs in:
     - `getAttachmentUrl.ts`
     - `validateAttachmentAccess.ts`
   - **MUST** check user permissions  
   - **MUST** handle URL expiration  
   - **MUST** handle errors for missing/invalid attachments  

---

### UI Layer Patterns

1. **Component Architecture**
   - **MUST** place page components in `app/(dashboard)/documents/`:
     - `page.tsx` (list)
     - `[id]/page.tsx` (detail)
     - `loading.tsx`
     - `error.tsx`
   - **MUST** put page-specific components in `app/(dashboard)/documents/_components/`
   - **MUST** move them to `src/components/documents/` **only** if reused  
   - **MUST** default to **Server Components**  
   - **MUST** mark as **Client** only if needed (search, modal, interactions)

2. **Loading State Pattern**
   - **MUST** implement `loading.tsx` in `app/(dashboard)/documents/`
   - **MUST** create skeleton components:
     - `DocumentListSkeleton.tsx`
     - `DocumentPreviewSkeleton.tsx`
     - `DocumentSearchSkeleton.tsx`
   - **MUST** add “No documents found” in `DocumentList.tsx`
   - **MUST** wrap client comps in Suspense

3. **Error Handling Pattern**
   - **MUST** define errors in `src/lib/errors/documents.ts`
   - **MUST** implement error boundaries at:
     - `documents/error.tsx` (page level)
     - `DocumentList/error.tsx` (list level)
     - `DocumentPreview/error.tsx` (preview level)
   - **MUST** provide recovery UI for each error
   - **MUST** log errors server-side

4. **Styling Pattern**
   - **MUST** use **shadcn** components from `src/components/ui/`:
     - Table, Dialog, Input, Select
   - **MUST** use semantic tokens from theme
   - **MUST** handle responsive layouts
   - **MUST** handle dark mode  

---

## Key Files & Functions

### Data Layer

1. **Airtable Schema & Types**
   - `src/types/airtable-types.ts` (TS interfaces)  
   - `src/lib/airtable/schemas.ts` (airtable-ts schemas)  
   - `src/lib/airtable/validation.ts` (Zod schemas)  
   - `src/lib/airtable/schema.json` (raw schema)  
   - `src/lib/airtable/schema-fetcher.ts` (schema generation)  
   > See [Critical Rules #1](#critical-rules).

2. **Domain Types**
   - **Location**: `src/lib/domains/documents/types.ts`
     - `Document`
     - `DocumentWithRelations`
     - `DocumentActionResponse<T>`

3. **Server Actions**
   - **Location**: `src/lib/actions/documents/`
     - `getDocumentsForUser(supabaseId, options)`
     - `getDocumentById(id, supabaseId)`
     - `searchDocuments(query, supabaseId, options)`
     - `getDocumentsByCompany(companyId, supabaseId)`
     - `getDocumentsByAccount(accountId, supabaseId)`
     - `getDocumentsByType(type, supabaseId)`

4. **Domain Services**
   - **Location**: `src/lib/domains/documents/services/`
     - `document-service.ts` (core logic)
     - `document-transform.ts` (data transformations)

5. **Domain Hooks**
   - **Location**: `src/lib/domains/documents/hooks/`
     - `useDocumentList(options)`
     - `useDocumentSearch(query)`

### UI Layer

1. **Page Components**
   - **Location**: `app/(dashboard)/documents/`
     - `page.tsx` (main list)
     - `[id]/page.tsx` (detail)
     - `loading.tsx` (loading states)
     - `error.tsx` (errors)

2. **Shared Components**
   - **Location**: `src/components/documents/`
     - `document-list/` (`DocumentList.tsx`, `DocumentListItem.tsx`, etc.)
     - `document-search/` (`DocumentSearch.tsx`, etc.)
     - `document-preview/` (`DocumentPreview.tsx`, etc.)

3. **Error Handling**
   - **Location**: `src/lib/errors/documents.ts`
     - Document-specific error messages
     - Error boundary components