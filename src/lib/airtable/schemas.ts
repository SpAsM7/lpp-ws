// Auto-generated schemas for airtable-ts
import { Table } from 'airtable-ts';
import type { UsersFields, RolesFields, AccountsFields, InvestmentsFields, PortcosFields, FilesFields, ActivitiesFields } from '../../types/airtable-types';

export const usersTable = {
  name: 'users',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_USERS_TABLE_ID!,
  schema: {
    user_title: "string | null",
    name_first: "string | null",
    name_last: "string | null",
    email: "string | null",
    phone: "string | null",
    roles: "string[] | null",
    account: "string[] | null",
    user_id: "string | null",
    old_user_id: "string | null",
    avatar: "string[] | null",
    save_e: "string | null",
  }
} as const satisfies Table<UsersFields>;

export const rolesTable = {
  name: 'roles',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_ROLES_TABLE_ID!,
  schema: {
    role_title: "string | null",
    user: "string[] | null",
    account: "string[] | null",
    role: "string | null",
    Email: "string[] | null",
    user_id: "string[] | null",
    account_name: "string[] | null",
    account_type: "string[] | null",
  }
} as const satisfies Table<RolesFields>;

export const accountsTable = {
  name: 'accounts',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_ACCOUNTS_TABLE_ID!,
  schema: {
    account_title: "string | null",
    account_name: "string | null",
    Owner: "string[] | null",
    roles: "string[] | null",
    investments: "string[] | null",
    files: "string[] | null",
    Deployed: "number[] | null",
    email_by_account: "string[] | null",
    user_id: "string[] | null",
    account_type: "string | null",
    account_subtype: "string | null",
  }
} as const satisfies Table<AccountsFields>;

export const investmentsTable = {
  name: 'investments',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_INVESTMENTS_TABLE_ID!,
  schema: {
    investment_title: "string | null",
    account_name: "string[] | null",
    account: "string[] | null",
    portco: "string[] | null",
    files: "string[] | null",
    Capital: "number | null",
    Units: "number | null",
    Series: "string | null",
    Inv_date: "string | null",
    email_by_investment: "string[] | null",
    Investco_ownership: "number | null",
    Total_Units: "string[] | null",
    Method: "string | null",
    user_id: "string[] | null",
  }
} as const satisfies Table<InvestmentsFields>;

export const portcosTable = {
  name: 'portcos',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_PORTCOS_TABLE_ID!,
  schema: {
    portco_title: "string | null",
    portco_name: "string | null",
    investments: "string[] | null",
    Capital: "number[] | null",
    files: "string[] | null",
    email_by_portco: "string[] | null",
    Units: "number[] | null",
    Ownership: "number | null",
    user_id: "string[] | null",
    website: "string | null",
    description: "string | null",
    logo: "string[] | null",
    rev_start_year: "string | null",
    rev_y1: "number | null",
    rev_y2: "number | null",
    rev_y3: "number | null",
    rev_y4: "number | null",
    rev_units: "string | null",
  }
} as const satisfies Table<PortcosFields>;

export const filesTable = {
  name: 'files',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_FILES_TABLE_ID!,
  schema: {
    file_title: "string | null",
    file_name: "string | null",
    description: "string | null",
    portco: "string[] | null",
    account: "string[] | null",
    investment: "string[] | null",
    document: "string[] | null",
    type: "string[] | null",
    status: "string | null",
    access: "string | null",
    user_id_acc: "string[] | null",
    user_id_portco: "string[] | null",
    user_id_invest: "string[] | null",
    user_id: "string | null",
    date: "string | null",
  }
} as const satisfies Table<FilesFields>;

export const activitiesTable = {
  name: 'activities',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_ACTIVITIES_TABLE_ID!,
  schema: {
    Name: "string | null",
    Notes: "string | null",
    Assignee: "string | null",
    Status: "string | null",
  }
} as const satisfies Table<ActivitiesFields>;

