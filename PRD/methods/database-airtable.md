# Airtable Integration

This document outlines how we integrate with Airtable as our primary data source.

## Overview

We use Airtable as our primary database, with Supabase handling only authentication. The integration is built using:
- `airtable-ts`: A type-safe Airtable SDK
- Custom schema generation tools
- Strongly-typed table configurations

## Schema Management

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
   - TypeScript interfaces for each table
   - Type-safe table configurations
   - Automatically includes all fields and their correct types

2. `src/lib/airtable/schema.json`:
   - Raw schema data for reference
   - Includes field IDs, types, and options
   - Useful for debugging and documentation

## Usage

### Basic Operations

```typescript
import { airtableClient } from '@/lib/airtable/client';
import { usersTable } from '@/types/airtable-schema';

// Fetch all records
const allUsers = await airtableClient.scan(usersTable);

// Get single record
const user = await airtableClient.get(usersTable, 'rec123');

// Create record
await airtableClient.create(usersTable, {
  Name: 'John Doe',
  Email: 'john@example.com'
});

// Update record
await airtableClient.update(usersTable, {
  id: 'rec123',
  Name: 'Jane Doe'
});
```

### Type Safety

The generated types provide full type safety:
- Correct field names and types
- Required vs optional fields
- Enum values for select fields
- Array types for multiple select fields

### Error Handling

All operations should be wrapped in try/catch blocks:

```typescript
try {
  const user = await airtableClient.get(usersTable, id);
} catch (error) {
  if (error.statusCode === 404) {
    // Handle not found
  } else {
    // Handle other errors
  }
}
```

## Maintenance

### Updating Schema

When the Airtable schema changes:

1. Run the schema fetcher
2. Review the changes in the generated files
3. Update any affected code to handle new/modified fields
4. Test affected functionality

### Best Practices

1. **Type Safety**:
   - Always use the generated types
   - Never use `any` or ignore type errors
   - Add custom type guards for complex operations

2. **Performance**:
   - Use `select()` to limit returned fields
   - Use `filterByFormula` for server-side filtering
   - Cache frequently accessed data

3. **Error Handling**:
   - Always handle potential errors
   - Provide user-friendly error messages
   - Log errors for debugging

4. **Schema Changes**:
   - Document all schema changes
   - Update types immediately
   - Test affected functionality

## Tables

The current schema includes:
- users
- roles
- accounts
- investments
- portcos
- activities

Each table's specific fields and relationships are documented in the generated schema files. 