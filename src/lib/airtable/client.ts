import { AirtableTs, Table } from 'airtable-ts';
import { z } from 'zod';
import { logger } from '@/lib/logger';

// Ensure this module is only used on the server
if (typeof window !== 'undefined') {
  throw new Error('Airtable client can only be used on the server side');
}

/**
 * Environment configuration schema for Airtable
 * Validates required environment variables at runtime
 */
const airtableConfigSchema = z.object({
  apiKey: z.string().min(1, 'AIRTABLE_API_KEY must not be empty'),
  baseId: z.string().min(1, 'AIRTABLE_BASE_ID must not be empty'),
  tables: z.object({
    users: z.string().min(1, 'AIRTABLE_USERS_TABLE_ID must not be empty'),
    roles: z.string().min(1, 'AIRTABLE_ROLES_TABLE_ID must not be empty'),
    accounts: z.string().min(1, 'AIRTABLE_ACCOUNTS_TABLE_ID must not be empty'),
    investments: z.string().min(1, 'AIRTABLE_INVESTMENTS_TABLE_ID must not be empty'),
    portcos: z.string().min(1, 'AIRTABLE_PORTCOS_TABLE_ID must not be empty'),
    files: z.string().min(1, 'AIRTABLE_FILES_TABLE_ID must not be empty'),
    activities: z.string().min(1, 'AIRTABLE_ACTIVITIES_TABLE_ID must not be empty'),
  }),
});

type AirtableConfig = z.infer<typeof airtableConfigSchema>;

/**
 * Validates Airtable configuration from environment variables
 * @throws {AirtableError} If configuration is invalid or missing
 */
function validateAirtableConfig(): AirtableConfig {
  try {
    return airtableConfigSchema.parse({
      apiKey: process.env.AIRTABLE_API_KEY,
      baseId: process.env.AIRTABLE_BASE_ID,
      tables: {
        users: process.env.AIRTABLE_USERS_TABLE_ID,
        roles: process.env.AIRTABLE_ROLES_TABLE_ID,
        accounts: process.env.AIRTABLE_ACCOUNTS_TABLE_ID,
        investments: process.env.AIRTABLE_INVESTMENTS_TABLE_ID,
        portcos: process.env.AIRTABLE_PORTCOS_TABLE_ID,
        files: process.env.AIRTABLE_FILES_TABLE_ID,
        activities: process.env.AIRTABLE_ACTIVITIES_TABLE_ID,
      },
    });
  } catch (error) {
    logger.error('Invalid Airtable configuration', { error });
    throw new AirtableError(
      'Missing or invalid Airtable configuration. Please check your environment variables.',
      error
    );
  }
}

/**
 * Custom error class for Airtable-related errors
 */
export class AirtableError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'AirtableError';
  }
}

// User table schema validation
const userTableSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  name_first: z.string(),
  name_last: z.string(),
  email: z.string().email(),
});

export type UserTableRecord = z.infer<typeof userTableSchema>;

// Validate configuration before initializing client
const config = validateAirtableConfig();

/**
 * Airtable client instance for making API calls
 * @throws {AirtableError} If used on client-side or if configuration is invalid
 */
const db = new AirtableTs({
  apiKey: config.apiKey,
});

/**
 * Users table definition with strongly-typed schema
 */
const usersTable: Table<UserTableRecord> = {
  name: 'users',
  baseId: config.baseId,
  tableId: config.tables.users,
  schema: {
    user_id: 'string',
    name_first: 'string',
    name_last: 'string',
    email: 'string',
  },
};

/**
 * Server-side only function to scan the users table
 * @param filterByFormula - Airtable formula to filter records
 * @param maxRecords - Maximum number of records to return
 * @returns Promise<UserTableRecord[]>
 * @throws {AirtableError} If there's an error communicating with Airtable
 */
export async function scanUsers(filterByFormula?: string, maxRecords?: number): Promise<UserTableRecord[]> {
  try {
    return await db.scan(usersTable, {
      filterByFormula,
      maxRecords,
    });
  } catch (error) {
    throw new AirtableError('Failed to scan users table', error);
  }
}