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
  };
}

interface Table {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: Field[];
}

interface SchemaResponse {
  tables: Table[];
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

  // Generate TypeScript interfaces and table schemas
  let typeScriptContent = `// Auto-generated Airtable schema types
// Generated on: ${new Date().toISOString()}

import { Table } from 'airtable-ts';
import { z } from 'zod';

export interface BaseFields {
  id: string;
}

`;

  // Generate Zod schemas first
  tables.forEach(table => {
    const tableName = capitalize(table.name.replace(/[^a-zA-Z0-9]/g, '_'));
    
    typeScriptContent += `export const ${tableName}Schema = z.object({
  id: z.string(),
${table.fields.map(field => {
  const fieldName = field.name.replace(/[^a-zA-Z0-9]/g, '_');
  const zodType = getZodType(field);
  return `  ${fieldName}: ${zodType},`;
}).join('\n')}
});\n\n`;
  });

  // Then generate TypeScript interfaces and table schemas
  tables.forEach(table => {
    const tableName = capitalize(table.name.replace(/[^a-zA-Z0-9]/g, '_'));
    
    // Generate interface
    typeScriptContent += `export interface ${tableName}Fields extends BaseFields {
${table.fields.map(field => {
  const fieldName = field.name.replace(/[^a-zA-Z0-9]/g, '_');
  const tsType = getTypeScriptType(field);
  return `  ${fieldName}?: ${tsType};`;
}).join('\n')}
}\n\n`;

    // Generate table schema
    typeScriptContent += `export const ${table.name.toLowerCase()}Table = {
  name: '${table.name}',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_${table.name.toUpperCase()}_TABLE_ID!,
  schema: {
${table.fields.map(field => {
  const fieldName = field.name.replace(/[^a-zA-Z0-9]/g, '_');
  const schemaType = getSchemaType(field);
  return `    ${fieldName}: "${schemaType}",`;
}).join('\n')}
  }
} as const satisfies Table<${tableName}Fields>;\n\n`;
  });

  // Save TypeScript file
  writeFileSync(
    resolve(process.cwd(), 'src/types/airtable-schema.ts'),
    typeScriptContent
  );

  // Save raw schema as JSON
  writeFileSync(
    resolve(process.cwd(), 'src/lib/airtable/schema.json'),
    JSON.stringify({ tables }, null, 2)
  );

  console.log('Schema files generated successfully!');
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTypeScriptType(field: Field): string {
  switch (field.type) {
    case 'singleLineText':
    case 'multilineText':
    case 'richText':
    case 'singleSelect':
    case 'phone':
    case 'email':
    case 'url':
      return 'string | null';
    case 'multipleSelects':
      return 'string[] | null';
    case 'number':
    case 'currency':
    case 'percent':
    case 'rating':
      return 'number | null';
    case 'checkbox':
      return 'boolean | null';
    case 'date':
    case 'dateTime':
      return 'string | null'; // ISO date string
    case 'multipleAttachments':
      return 'string[] | null';
    default:
      return 'any | null';
  }
}

function getSchemaType(field: Field): string {
  switch (field.type) {
    case 'singleLineText':
    case 'multilineText':
    case 'richText':
    case 'singleSelect':
    case 'phone':
    case 'email':
    case 'url':
      return 'string | null';
    case 'multipleSelects':
      return 'string[] | null';
    case 'number':
    case 'currency':
    case 'percent':
    case 'rating':
      return 'number | null';
    case 'checkbox':
      return 'boolean | null';
    case 'date':
    case 'dateTime':
      return 'string | null';
    case 'multipleAttachments':
      return 'string[] | null';
    default:
      return 'string | null';
  }
}

function getZodType(field: Field): string {
  const baseType = (() => {
    switch (field.type) {
      case 'singleLineText':
      case 'multilineText':
      case 'richText':
      case 'singleSelect':
      case 'phone':
      case 'email':
      case 'url':
        return 'z.string()';
      case 'multipleSelects':
        return 'z.array(z.string())';
      case 'number':
      case 'currency':
      case 'percent':
      case 'rating':
        return 'z.number()';
      case 'checkbox':
        return 'z.boolean()';
      case 'date':
      case 'dateTime':
        return 'z.string()'; // Could be z.date() if we want to parse
      case 'multipleAttachments':
        return 'z.array(z.string())';
      default:
        return 'z.any()';
    }
  })();
  
  return `z.optional(${baseType}.nullable())`;
}

// Only run if this file is being executed directly
if (require.main === module) {
  fetchSchema().catch(console.error);
}