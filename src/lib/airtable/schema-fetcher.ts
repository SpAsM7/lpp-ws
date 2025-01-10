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
  description?: string;
}

interface SchemaResponse {
  tables: Table[];
}

async function fetchSchema() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const apiKey = process.env.AIRTABLE_API_KEY;

  if (!baseId || !apiKey) {
    throw new Error('Missing required environment variables');
  }

  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch schema: ${response.statusText}`);
  }

  const data: SchemaResponse = await response.json();
  
  // Generate TypeScript interfaces
  let tsContent = '// Auto-generated Airtable schema types\n// Generated on: ' + new Date().toISOString() + '\n\n';
  tsContent += 'import { Table } from \'airtable-ts\';\n\n';
  
  // Base interface
  tsContent += 'export interface BaseFields {\n  id: string;\n}\n\n';

  // Generate interfaces for each table
  data.tables.forEach(table => {
    const interfaceName = `${capitalize(table.name)}Fields`;
    tsContent += `export interface ${interfaceName} extends BaseFields {\n`;
    
    table.fields.forEach(field => {
      const fieldType = getTypeScriptType(field);
      const isOptional = field.type === 'multipleSelects' || field.type === 'multipleAttachments';
      tsContent += `  ${field.name}${isOptional ? '?' : ''}: ${fieldType};\n`;
    });
    
    tsContent += '}\n\n';

    // Generate table configuration
    tsContent += `export const ${table.name}Table: Table<${interfaceName}> = {\n`;
    tsContent += `  name: '${table.name}',\n`;
    tsContent += `  baseId: process.env.AIRTABLE_BASE_ID!,\n`;
    tsContent += `  tableId: '${table.id}',\n`;
    tsContent += `  schema: {\n`;
    table.fields.forEach(field => {
      const schemaType = getSchemaType(field);
      tsContent += `    ${field.name}: '${schemaType}',\n`;
    });
    tsContent += `  }\n`;
    tsContent += `};\n\n`;
  });

  // Save the schema
  const schemaPath = resolve(process.cwd(), 'src/types/airtable-schema.ts');
  writeFileSync(schemaPath, tsContent);
  
  // Save raw schema for reference
  const rawSchemaPath = resolve(process.cwd(), 'src/lib/airtable/schema.json');
  writeFileSync(rawSchemaPath, JSON.stringify(data, null, 2));

  console.log('Schema files generated:');
  console.log('- TypeScript types:', schemaPath);
  console.log('- Raw schema:', rawSchemaPath);
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
      return 'string';
    case 'multipleSelects':
      return 'string[]';
    case 'number':
    case 'currency':
    case 'percent':
    case 'rating':
      return 'number';
    case 'checkbox':
      return 'boolean';
    case 'date':
    case 'dateTime':
      return 'string'; // ISO date string
    case 'multipleAttachments':
      return '{ url: string; filename: string; }[]';
    default:
      return 'any';
  }
}

function getSchemaType(field: Field): string {
  switch (field.type) {
    case 'multipleSelects':
      return 'string[]';
    case 'multipleAttachments':
      return 'object[]';
    case 'number':
    case 'currency':
    case 'percent':
    case 'rating':
      return 'number';
    case 'checkbox':
      return 'boolean';
    default:
      return 'string';
  }
}

// Only run if this file is being executed directly
if (require.main === module) {
  fetchSchema().catch(console.error);
} 