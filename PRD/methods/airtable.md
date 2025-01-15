# Airtable Integration

> **Documentation Guidelines**  
> - Keep this document as a quick reference guide  
> - List only key file locations and method names  
> - **Avoid including implementation details or code snippets** (unless critical)  
> - Focus on file paths and function names  
> - Update when adding new core functionality or changing file structure  

## Overview
We use **Airtable** as our primary database and **Supabase** for authentication.  
Key tools and patterns include:
- **airtable-ts** (type-safe Airtable SDK)  
- **Custom schema generation** (automatic TypeScript and Zod schemas)  
- **Strict type safety** (three-layer pattern)  

---

## Schema Management

### Configuration & Validation
- **Environment Config** (location: `docs/environment-setup.md`):
  - Lists required Airtable env variables (e.g., `.env` keys)
  - Reference for setting up environment variables
- **Client Validation** (location: `src/lib/airtable/client.ts`):
  - Validates Airtable config at runtime (table IDs, etc.)
  - Ensures environment variables are present

### Schema Generation Pattern
1. **Schema Fetcher**  
   - Location: `src/lib/airtable/schema-fetcher.ts`  
   - Fetches latest Airtable schema → Maps to TS types  
   - Returns `null` for unsupported fields  
   - Preserves raw schema in JSON  

2. **Generated Files**  
   - `src/types/airtable-types.ts`: TypeScript interfaces  
   - `src/lib/airtable/schemas.ts`: Raw schemas for **airtable-ts**  
   - `src/lib/airtable/validation.ts`: Zod schemas  
   - `src/lib/airtable/schema.json`: Raw schema (debugging reference)  
   - **MUST NOT** modify these files manually. Regenerate after schema changes.

3. **Field Transforms**  
   - Location: `src/lib/airtable/utils/transforms.ts`  
   - Handles complex fields (attachments, rollups, linked records)  
   - Domain services import these to convert raw data → app-friendly objects  

### Usage Pattern
- **Schema Layer**: Simple, Airtable-oriented types  
- **Transform Layer**: Centralized in `utils/transforms.ts`; pure, well-documented, handles null/undefined  
- **Domain Layer**: Uses transforms + handles business logic + separate access checks  

### Type Safety Pattern
1. **Schema Types**  
   - Mirror Airtable fields closely  
   - Use `string[] | null` for attachments/rollups/links as needed  

2. **Runtime Validation**  
   - Zod schemas in `validation.ts`  
   - Validate after transforms to ensure final data correctness  

3. **Access Patterns**  
   - Validate user access in domain services (not in schema generation)  
   - Keep checks centralized in validation utilities  
   - Document user_id or linked-record-based rules  

### Fetching & Updating Schema
To update:
```bash
pnpm tsx src/lib/airtable/schema-fetcher.ts
```
- Pulls latest Airtable schema → Generates TS interfaces, airtable-ts schemas, Zod validation, plus `schema.json`.

### Schema Generation Rules
- **MUST** use `schema-fetcher` for generation  
- **MUST NOT** manually edit generated files  
- **MUST** verify consistency across TS, airtable-ts, and Zod  
- **MUST NOT** mix access validation with type generation  

---

## Server-Side Only Pattern
All Airtable operations **MUST** occur server-side.  

### Data Access Layer
- **Location**: `src/lib/airtable/client.ts`  
- **Key Methods**:
  - `validateAirtableConfig()`: Ensures env variables are set  
  - `scanUsers()`: Example method for fetching users with filtering  

### Server Actions
- **Location**: `src/lib/actions/user-actions.ts`  
  - `getUserBySupabaseId()`: Fetches user by Supabase ID  
- **Location**: `src/lib/actions/user/get-current-user.ts`  
  - `getCurrentUser()`: Combines Supabase auth + Airtable user data  

---

## Authentication Integration

### Session Management
- **Supabase** built-in session (no custom hooks)  
- **Server**: `createServerClient` from `@supabase/ssr` in `src/lib/supabase/server.ts`  
- **Client**: `createBrowserClient` from `@supabase/ssr` in `src/lib/supabase/client.ts`  
- **Auth**: Use `auth.getUser()` (not `getSession`)  
- **Cookies**: Secure, HTTP-only, avoid storing sessions in localStorage  

---

## Client Instance Management

1. **Supabase Client**  
   - **Location**: `src/lib/supabase/server.ts`  
   - **Caching**:
     ```ts
     let supabaseClient: ReturnType<typeof createClient> | null = null;
     ```
   - Must handle cookies securely (per `@auth.md`)

2. **Airtable Client**  
   - **Location**: `src/lib/airtable/client.ts`  
   - Must validate config before using
   - Must use env vars for table IDs

3. **Query Client**  
   - **Location**: `src/components/providers/query-provider.tsx`  
   - Maintain stable `QueryClient` with `useRef`  
   - Recommended defaults: `staleTime = 5m`, `gcTime = 30m`, `retry = 3`  

---

## Domain-Based Client Usage

- **Location**: `src/lib/domains/user/hooks/use-user-profile.ts`  
  - `useUserProfile()`: React Query hook for user data  
  - Must handle errors (e.g., toasts) and apply proper TS types  
  - Document side effects in JSDoc  

## React Query Pattern

- **Destructure**: `(data, isLoading, error)` from hooks  
- **Loading states**: Use skeleton components (shadcn)  
- **Error**: Show user-friendly toasts/log messages  
- **Type**: Provide explicit TypeScript for query data  

---

## Error Handling

- Use **structured error types**  
- Provide **friendly** messages to users  
- Log errors server-side with context  
- **Do not** leak sensitive internals in error messages  

## Response Types

- **`UserActionResponse<T>`** for user-related actions  
- `isSuccess` indicates success/failure  
- `data` field typed for each action  

---

## Field Transforms

### Transform Layer
- **Location**: `src/lib/airtable/utils/transforms.ts`  
- **Focus**: attachments, rollups, links  
- Keep pure (no external API calls)  
- Null handling is crucial  

### Usage Flow
```
schema-fetcher -> simple TS types -> transforms -> domain services
```

### Linked Records
We apply the **three-layer type safety** (Schema, TypeScript, Zod) to linked fields but add **batch resolution** and **access checks**:

1. **Schema Layer** (`schemas.ts`)  
   - Declare linked record fields as `string[] | null` (array of record IDs).

2. **TypeScript Layer** (`airtable-types.ts`)  
   - Mirror this shape (`string[] | null`) or optionally define a more specific interface if you plan to expand them into objects.

3. **Zod Layer** (`validation.ts`)  
   - Validate arrays of IDs or objects, depending on how you handle expanded links.

4. **Transforms** (`utils/transforms.ts`)  
   - Keep them **pure** (no API calls).  
   - Focus on converting raw data to the desired format (e.g., ID arrays → objects).  
   - Handle `null`/`undefined` gracefully.

5. **Linked Record Resolution** (`utils/resolve-linked-records.ts`)  
   - **Batch fetch** all linked IDs to avoid N+1 queries.  
   - Apply access validation (see `validate-access.ts`) **before** returning data.  
   - Return `null` for any unauthorized linked records.  

6. **Access Control** (`utils/validate-access.ts`)  
   - Validate user permissions prior to revealing linked records.  
   - Never leak unauthorized IDs or partial data.  

7. **Common Rules**  
   - **MUST** batch fetch linked records outside the transform layer.  
   - **MUST** handle circular references if two records link to each other.  
   - **MUST NOT** mix business logic or access checks into transforms.  

## Access Validation Pattern

- **Centralized** in `src/lib/airtable/utils/validate-access.ts`
  - `validateRecordAccess(record, supabaseId)`
  - `filterRecordsByAccess(records, supabaseId)`
- Must run **before** returning data
- Must handle `user_id` fields with comma-separated UUIDs
- Must not leak inaccessible records  
- Must log or handle `access denied` events  

---

## Type Safety Patterns

### Three-Layer Model
1. **Schema** (`schemas.ts`): minimal, Airtable-friendly  
2. **TypeScript** (`airtable-types.ts`): compile-time safety  
3. **Zod** (`validation.ts`): runtime validation  

### Example: Attachments
- **Schema**: `string[] | null`  
- **TypeScript**: same shape, or expand if needed  
- **Zod**: array of strings or objects (e.g. `{ url, filename }`)  
- **Transforms**: In domain logic, map raw strings → detailed objects  

**Do not** bypass these layers, or type errors may arise.

---
## Special Field Types & Transforms

### Schema Definition Rules
- **airtable-ts expects string literals**, not TypeScript types:
  - ✅ Correct: `"string"`, `"number"`, `"string[]"`
  - ❌ Incorrect: `"string | null"`, `"string[] | null"`
- **Why**: These are runtime schema definitions that airtable-ts uses for coercion
- **Example**: For array fields like rollups, use `"string[]"` not `"string[] | null"`

### 1. Rollup Fields
- **Schema Definition**: `"string[]"` or `"number[]"` (no null in schema)
- **Transform**: Must use `transformRollup()` from `transforms.ts`
- **Example Fields**: `user_id_acc`, `Deployed`, `Units`
- **Why**: Airtable returns rollups as complex objects that need normalization
- **Runtime**: Transform handles null values and complex object formats

### 2. Attachments
- **Schema Definition**: `"string[]"` (no null in schema)
- **Transform**: Must use `transformAttachment()` from `transforms.ts`
- **Example Fields**: `document`, `logo`, `avatar`
- **Why**: Airtable returns URLs that need to be transformed into `{ url, filename }` objects
- **Runtime**: Transform handles null values and URL parsing

### 3. Linked Records
- **Schema Definition**: `"string[]"` (no null in schema)
- **Transform**: Use record expansion utilities from `resolve-linked-records.ts`
- **Example Fields**: `account`, `roles`, `investments`
- **Why**: Returns IDs that often need to be expanded into full records with access control
- **Runtime**: Transform handles access control and record expansion

### 4. Lookup Values
- **Schema Definition**: Based on looked-up field type (e.g., `"string[]"` for text lookups)
- **Transform**: May need transformation depending on source field type
- **Example Fields**: `email_by_account`, `Total_Units`
- **Why**: Format varies based on the source field being looked up
- **Runtime**: Transform handles type conversion and null values

### Usage Pattern
1. **Schema Layer** (`schemas.ts`):
   ```typescript
   schema: {
     // Rollup example (correct)
     user_id_acc: "string[]",
     // Attachment example (correct)
     document: "string[]",
     // Linked record example (correct)
     account: "string[]"
   }
   ```

2. **Transform Layer** (`transforms.ts`):
   ```typescript
   // For rollups
   const userIds = transformRollup<string>(record.user_id_acc);
   
   // For attachments
   const files = transformAttachment(record.document);
   
   // For linked records
   const accounts = await resolveAccountRecords(record.account);
   ```

3. **Domain Layer**:
   - Import transforms from `transforms.ts`
   - Apply transforms before using data
   - Handle access control for linked records
   - Validate final transformed data

### Key Rules
- **MUST** use string literals in schema definitions, not TypeScript types
- **MUST** use appropriate transform for each special field type
- **MUST** handle transforms before using data in domain logic
- **MUST** apply access control after expanding linked records
- **MUST NOT** bypass transform layer when handling special fields
- **MUST** check field comments in `schemas.ts` for required transforms