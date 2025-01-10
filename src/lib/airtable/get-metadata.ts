import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function getMetadata() {
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
    throw new Error(`Failed to fetch metadata: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Tables:');
  data.tables.forEach((table: any) => {
    console.log(`- ${table.name}: ${table.id}`);
  });
}

// Only run if this file is being executed directly
if (require.main === module) {
  getMetadata().catch(console.error);
} 