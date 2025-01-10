import type { Item } from 'airtable-ts';

// Base interface for all Airtable records
export interface BaseFields {
  id: string;
  Name: string;
  Created: string;
  LastModified: string;
}

// Document record fields
export interface DocumentFields extends BaseFields {
  Title: string;
  Description: string | null;
  FileURL: string;
  Type: 'Report' | 'Statement' | 'Contract' | 'Other';
  Status: 'Draft' | 'Published' | 'Archived';
  Tags: string[];
}

// Account record fields
export interface AccountFields extends BaseFields {
  Email: string;
  Role: 'LP' | 'GP' | 'Admin';
  Status: 'Active' | 'Inactive';
  SupabaseId: string;
}

// Table names as constants
export const TABLES = {
  DOCUMENTS: 'Documents',
  ACCOUNTS: 'Accounts',
} as const;

// Type for table names
export type TableName = typeof TABLES[keyof typeof TABLES]; 