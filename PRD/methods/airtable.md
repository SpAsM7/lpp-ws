# Airtable Integration Rules

> **Documentation Guidelines**  
> - Keep this document as a quick reference guide  
> - Only list key file locations and function names  
> - **Avoid** unnecessary code snippets  
> - **Focus** on folder structure, must/must-not rules, and naming conventions  

---

## Overview

- **Airtable** is our primary data store.  
- **Supabase** handles authentication (session-based, server-side).  
- We use the **Official Airtable SDK** exclusively on the **server side**.  
- We enforce **type safety** using **Airtable schema generation**, **TypeScript**, and **Zod**.  
- We have an **access control** pattern for each Airtable record: a `user_id` field listing **all** user UUIDs who can view that row.

---

## Folder Structure

```
src/
├── types/
│   └── airtable-types.ts              // Auto-generated Airtable field types
└── lib/
    └── airtable/
        ├── client.ts                   // Contains Airtable SDK usage
        ├── queries/
        │   ├── accounts.ts             // Account-specific queries
        │   ├── documents.ts            // Document-specific queries
        │   └── ...                     // Other domains
        ├── schema-fetcher.ts           // CLI script to fetch Airtable schema + generate TS & Zod
        ├── validation.ts               // Zod-based runtime validation (generated)
        ├── schema.json                 // Raw schema (debug reference, generated)
        └── utils/
            ├── transforms.ts           // Converts raw Airtable fields to domain-friendly structures
            ├── resolve-linked-records.ts // Batch load linked records + enforce access
            └── validate-access.ts      // Checks user_id membership for record access
        └── cache/
            ├── keys.ts                 // Cache key generation
            ├── strategies.ts           // Defines cache durations, e.g. 5 minutes
            └── store.ts                // Redis or Memory-based cache
```

---

## Environment & Configuration

- **Environment Variables** (`.env.example`):
  - **MUST** include: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, and all table IDs
  - **MUST** follow naming convention: `AIRTABLE_[TABLE]_TABLE_ID`

- **Configuration Validation** (`src/lib/airtable/client.ts`):
  - **MUST** use `validateAirtableConfig()` before any Airtable operations
  - **MUST** handle validation errors with `AirtableError` class

---

## Schema Generation

1. **Schema Fetcher** (`src/lib/airtable/schema-fetcher.ts`):  
   - Pulls the latest Airtable schema via the SDK.  
   - Generates TypeScript interfaces and Zod validators.  
   - Writes output to `validation.ts`, `airtable-types.ts`, and `schema.json`.  
2. **Do not** manually edit `airtable-types.ts`, `validation.ts`, or `schema.json`.  
3. **Run**:
    ```bash
    pnpm tsx src/lib/airtable/schema-fetcher.ts
    ```

- **Generated Files**:
  - `validation.ts`: Zod schemas for runtime validation
  - `schema.json`: Debug reference file
  - `airtable-types.ts`: TypeScript interfaces

---

## Field Patterns & Rules

### Common Rules
- **Location**: `src/lib/airtable/utils/transforms.ts`
- **MUST** handle `null` and `undefined` safely
- **MUST** return `null` instead of empty arrays/objects
- **MUST** use `Array<T>` instead of `T[]` for SDK consistency
- **MUST** validate access before returning data
- **MUST NOT** leak unauthorized data

### Attachments
- **Location**: `src/lib/airtable/utils/transforms.ts`
- **Functions**: `transformAttachment`, `validateAttachment`
- **MUST** store complete objects with `url`, `filename`, `size`, `type`
- **MUST NOT** store as bare strings or URLs

### Linked Records
- **Location**: `src/lib/airtable/utils/resolve-linked-records.ts`
- **Functions**: 
  - `resolveLinkedRecords`: Batch load records
  - `validateLinkedRecords`: Check access
  - `transformLinkedRecords`: Convert to domain types
- **MUST** use batch loading to avoid N+1 queries
- **MUST** validate access for each record
- **MUST** filter out unauthorized records

### Rollups
- **Location**: `src/lib/airtable/utils/transforms.ts`
- **Functions**: `transformRollup`, `aggregateRollup`
- **MUST** preserve source field type (number, string, etc.)
- **MUST** handle aggregation based on rollup type:
  - `sum`: Numeric addition
  - `concatenate`: String joining
  - `array`: Preserve array structure

### Lookups
- **Location**: `src/lib/airtable/utils/transforms.ts`
- **Functions**: `transformLookup`
- **MUST** match source field type
- **MUST** handle missing values
- **MUST** document lookup dependencies

---

## Access Control

- **Location**: `src/lib/airtable/utils/validate-access.ts`
- **Functions**:
  - `validateRecordAccess(record, userId)`: Check if user can access record
  - `filterRecordsByAccess(records, userId)`: Filter array by access
  - `validateBatchAccess(records, userId)`: Batch validation
- **MUST** check access before returning any data
- **MUST NOT** leak partial data for unauthorized records

---

## Queries & Caching

- **Location**: `src/lib/airtable/queries/`
- **Query Files**:
  - `documents.ts`: Document-specific queries
  - `accounts.ts`: Account-specific queries
  - Each domain has its own query file

- **Cache Configuration** (`src/lib/airtable/cache/`):
  - `keys.ts`: Cache key generation functions
  - `strategies.ts`: Cache duration settings
  - `store.ts`: Cache implementation

- **MUST** implement typed query functions per domain
- **MUST** use cache strategies from `strategies.ts`
- **MUST** standardize cache durations (default: 5 minutes)

---

## Domain Usage & Data Flow

- **Domain Structure** (`src/lib/domains/`):
  - Each domain (e.g., `documents/`, `accounts/`) **MUST** contain:
    - `queries/`: Domain-specific Airtable queries
    - `hooks/`: React Query hooks that wrap queries
    - `transforms/`: Domain-specific data transformations
    - `types/`: Domain-specific TypeScript types

- **Query Location Rules**:
  - **MUST** define base queries in `src/lib/airtable/queries/`
  - **MUST** define domain-specific queries in `src/lib/domains/[domain]/queries/`
  - **MUST NOT** make direct Airtable calls outside these locations

- **Data Flow**:
  1. React Components **MUST** use domain hooks:
     ```
     src/lib/domains/documents/hooks/useDocument.ts
     src/lib/domains/accounts/hooks/useAccount.ts
     ```
  2. Hooks **MUST** use domain queries:
     ```
     src/lib/domains/documents/queries/getDocument.ts
     src/lib/domains/accounts/queries/getAccount.ts
     ```
  3. Domain queries:
     - **MUST** use base Airtable queries for standard fields:
       ```
       src/lib/airtable/queries/documents.ts
       src/lib/airtable/queries/accounts.ts
       ```
     - **MUST** use special handling functions for complex fields (see Special Field Handling below)
     - **MUST NOT** directly call Airtable SDK

- **Special Field Handling**:
  1. **Linked Records**: 
     - Domain queries **MUST** use `resolveLinkedRecords` from base queries
     - **MUST** handle batch loading at the domain query level
     - **MUST** validate access before returning

  2. **Rollups & Lookups**:
     - Domain queries **MUST** use appropriate transform functions
     - **MUST** preserve field types through the entire flow
     - **MUST** document dependencies on other fields

  3. **Attachments**:
     - Domain queries **MUST** use `transformAttachment`
     - **MUST** validate attachments before returning
     - **MUST** handle file metadata consistently

---

## Server-Side Usage

- **Airtable** calls **only** from the server.  
- **Client** must not reference the Airtable SDK.  

## Session Management
- **Supabase** built-in session (no custom hooks)  
- **Server**: `createServerClient` from `@supabase/ssr` in `src/lib/supabase/server.ts`  
- **Client**: `createBrowserClient` from `@supabase/ssr` in `src/lib/supabase/client.ts`  
- **Auth**: Use `auth.getUser()` (not `getSession`)  
- **Cookies**: Secure, HTTP-only, avoid storing sessions in localStorage  

---

## Client Instance Management

- **Location**: `src/lib/airtable/client.ts`
- **Functions**:
  - `getAirtableClient()`: Get/create singleton client
  - `validateAirtableConfig()`: Validate environment
  - `createAirtableClient()`: Internal factory function

- **MUST** use singleton pattern for clients
- **MUST** validate config before client creation
- **MUST** use environment variables for configuration

---

## Error Handling

- **Location**: `src/lib/airtable/errors.ts`
- **Classes**:
  - `AirtableError`: Base error class
  - `AirtableConfigError`: Configuration issues
  - `AirtableAccessError`: Authorization failures
  
- **MUST** use structured error objects
- **MUST** log errors server-side with context
- **MUST NOT** leak sensitive data in error messages
- **MUST** use `UserActionResponse<T>` for consistent error handling