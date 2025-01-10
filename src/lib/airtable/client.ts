import { AirtableTs } from 'airtable-ts';

// Server-side only
if (typeof window !== 'undefined') {
  throw new Error('Airtable client can only be used on the server side');
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is not set in environment variables');
}

if (!AIRTABLE_BASE_ID) {
  throw new Error('AIRTABLE_BASE_ID is not set in environment variables');
}

// Initialize the client
export const airtableClient = new AirtableTs({
  apiKey: AIRTABLE_API_KEY,
});

interface QueryOptions {
  filterByFormula?: string;
  maxRecords?: number;
  view?: string;
  fields?: string[];
}

// Helper function to query a table
export async function queryTable(tableId: string, options: QueryOptions = {}) {
  const params = new URLSearchParams();

  if (options.filterByFormula) {
    params.append('filterByFormula', options.filterByFormula);
  }
  if (options.maxRecords) {
    params.append('maxRecords', options.maxRecords.toString());
  }
  if (options.view) {
    params.append('view', options.view);
  }
  if (options.fields) {
    options.fields.forEach(field => params.append('fields[]', field));
  }

  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}?${params.toString()}`;
  
  console.log('Querying Airtable:', url);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Airtable API error:', error);
    throw new Error(`Airtable API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Airtable response:', data);
  return data.records;
} 