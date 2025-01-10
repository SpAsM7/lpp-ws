import { AirtableTs } from 'airtable-ts';

const airtable = new AirtableTs({
  apiKey: process.env.AIRTABLE_API_KEY!,
});

// This will print out table information
export async function getTables() {
  const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
  const tables = await base.tables();
  console.log('Tables:', tables);
  return tables;
} 