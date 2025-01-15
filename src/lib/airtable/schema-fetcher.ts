import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

interface Field {
  id: string;
  name: string;
  type: string;
  options?: {
    choices?: { name: string; id: string }[];
    result?: {
      type: string;
      options?: any;
    };
  };
}

// Define supported field types for better type safety
type AirtableFieldType =
  | 'url'
  | 'email'
  | 'phoneNumber'
  | 'singleLineText'
  | 'multilineText'
  | 'richText'
  | 'singleSelect'
  | 'externalSyncSource'
  | 'aiText'
  | 'singleCollaborator'
  | 'createdBy'
  | 'lastModifiedBy'
  | 'barcode'
  | 'button'
  | 'multipleAttachments'
  | 'multipleCollaborators'
  | 'multipleRecordLinks'
  | 'multipleSelects'
  | 'number'
  | 'rating'
  | 'duration'
  | 'currency'
  | 'percent'
  | 'count'
  | 'autoNumber'
  | 'date'
  | 'dateTime'
  | 'createdTime'
  | 'lastModifiedTime'
  | 'checkbox'
  | 'lookup'
  | 'multipleLookupValues'
  | 'rollup'
  | 'formula';

interface Table {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: Field[];
}

interface SchemaResponse {
  tables: Table[];
}

function getBaseType(field: Field): string | null {
  // Handle rollups by looking at their result type
  if (field.type === "rollup") {
    if (!field.options?.result) {
      console.warn(`No result type found for rollup field: ${field.name}`);
      return null;
    }
    // Get the base type for whatever kind of field is being rolled up
    const baseType = getBaseType({
      ...field,
      type: field.options.result.type
    });
    return baseType ? `${baseType}[]` : null;
  }

  // Handle computed fields by looking at their result type
  if (field.type === "formula" || field.type === "lookup") {
    if (!field.options?.result) {
      console.warn(`No result type found for computed field: ${field.name}`);
      return null;
    }
    return getBaseType({
      ...field,
      type: field.options.result.type
    });
  }

  switch (field.type) {
    // Text-like fields
    case 'url':
    case 'email':
    case 'phoneNumber':
    case 'singleLineText':
    case 'multilineText':
    case 'richText':
    case 'singleSelect':
    case 'externalSyncSource':
    case 'aiText':
    case 'singleCollaborator':
    case 'createdBy':
    case 'lastModifiedBy':
    case 'barcode':
    case 'button':
      return 'string';

    // Array fields
    case 'multipleAttachments':
    case 'multipleCollaborators':
    case 'multipleRecordLinks':
    case 'multipleSelects':
    case 'multipleLookupValues':
      return 'string[]';

    // Numeric fields
    case 'number':
    case 'rating':
    case 'duration':
    case 'currency':
    case 'percent':
    case 'count':
    case 'autoNumber':
      return 'number';

    // Date fields
    case 'date':
    case 'dateTime':
    case 'createdTime':
    case 'lastModifiedTime':
      return 'string';

    case 'checkbox':
      return 'boolean';

    default:
      console.warn(`Unsupported field type: ${field.type}`);
      return null;
  }
}

async function fetchSchema() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const apiKey = process.env.AIRTABLE_API_KEY;

  if (!baseId || !apiKey) {
    throw new Error('Missing required environment variables: AIRTABLE_BASE_ID and/or AIRTABLE_API_KEY');
  }

  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch schema: ${response.statusText}`);
  }

  const { tables }: SchemaResponse = await response.json();

  // Generate three separate files for better separation of concerns:
  // 1. TypeScript interfaces (for development)
  let typesContent = `// Auto-generated TypeScript interfaces
export interface BaseFields {
  id: string;
}

`;

  // 2. Raw schemas (for airtable-ts runtime)
  let schemasContent = `// Auto-generated schemas for airtable-ts
import { Table } from 'airtable-ts';
import type { ${tables.map(t => `${capitalize(t.name.replace(/[^a-zA-Z0-9]/g, '_'))}Fields`).join(', ')} } from '../../types/airtable-types';

`;

  // 3. Zod schemas (for runtime validation)
  let validationContent = `// Auto-generated Zod schemas
import { z } from 'zod';

`;

  // Generate content for each table
  tables.forEach(table => {
    const tableName = capitalize(table.name.replace(/[^a-zA-Z0-9]/g, '_'));
    
    // Generate TypeScript interface (always include | null for type safety)
    typesContent += `export interface ${tableName}Fields extends BaseFields {
${table.fields.map(field => {
  const fieldName = field.name.replace(/[^a-zA-Z0-9]/g, '_');
  const baseType = getBaseType(field);
  if (!baseType) return null;
  return `  ${fieldName}?: ${baseType} | null;`;
}).filter(Boolean).join('\n')}
}\n\n`;

    // Generate schema (include | null for all fields)
    schemasContent += `export const ${table.name.toLowerCase()}Table = {
  name: '${table.name}',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_${table.name.toUpperCase()}_TABLE_ID!,
  schema: {
${table.fields.map(field => {
  const fieldName = field.name.replace(/[^a-zA-Z0-9]/g, '_');
  const baseType = getBaseType(field);
  if (!baseType) return null;
  return `    ${fieldName}: "${baseType} | null",`;
}).filter(Boolean).join('\n')}
  }
} as const satisfies Table<${tableName}Fields>;\n\n`;

    // Generate Zod schema
    validationContent += `export const ${tableName}Schema = z.object({
  id: z.string(),
${table.fields.map(field => {
  const fieldName = field.name.replace(/[^a-zA-Z0-9]/g, '_');
  const baseType = getBaseType(field);
  if (!baseType) return null;
  const zodType = baseType === "string[]" ? "array(z.string())" : baseType;
  return `  ${fieldName}: z.${zodType}().nullable(),`;
}).filter(Boolean).join('\n')}
});\n\n`;
  });

  // Write the generated files
  writeFileSync(
    resolve(process.cwd(), 'src/types/airtable-types.ts'),
    typesContent
  );
  writeFileSync(
    resolve(process.cwd(), 'src/lib/airtable/schemas.ts'),
    schemasContent
  );
  writeFileSync(
    resolve(process.cwd(), 'src/lib/airtable/validation.ts'),
    validationContent
  );
  writeFileSync(
    resolve(process.cwd(), 'src/lib/airtable/schema.json'),
    JSON.stringify({ tables }, null, 2)
  );

  console.log('Schema files generated successfully!');
  console.log('Note: Access validation is handled in the data layer, not in generated types.');
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Run the schema fetcher
fetchSchema().catch(console.error);