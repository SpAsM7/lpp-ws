// Auto-generated Airtable schema types
// Generated on: 2025-01-11T16:25:39.033Z

import { Table } from 'airtable-ts';
import { z } from 'zod';

export interface BaseFields {
  id: string;
}

export const UsersSchema = z.object({
  id: z.string(),
  user_title: z.optional(z.any().nullable()),
  name_first: z.optional(z.string().nullable()),
  name_last: z.optional(z.string().nullable()),
  email: z.optional(z.string().nullable()),
  phone: z.optional(z.any().nullable()),
  roles: z.optional(z.any().nullable()),
  account: z.optional(z.any().nullable()),
  user_id: z.optional(z.string().nullable()),
  old_user_id: z.optional(z.string().nullable()),
  avatar: z.optional(z.array(z.string()).nullable()),
});

export const RolesSchema = z.object({
  id: z.string(),
  role_title: z.optional(z.any().nullable()),
  user: z.optional(z.any().nullable()),
  account: z.optional(z.any().nullable()),
  role: z.optional(z.string().nullable()),
  Email: z.optional(z.any().nullable()),
  user_id: z.optional(z.any().nullable()),
  account_name: z.optional(z.any().nullable()),
  account_type: z.optional(z.any().nullable()),
});

export const AccountsSchema = z.object({
  id: z.string(),
  account_title: z.optional(z.any().nullable()),
  account_name: z.optional(z.string().nullable()),
  Owner: z.optional(z.any().nullable()),
  roles: z.optional(z.any().nullable()),
  investments: z.optional(z.any().nullable()),
  files: z.optional(z.any().nullable()),
  Deployed: z.optional(z.any().nullable()),
  email_by_account: z.optional(z.any().nullable()),
  user_id: z.optional(z.any().nullable()),
  account_type: z.optional(z.string().nullable()),
  account_subtype: z.optional(z.string().nullable()),
});

export const InvestmentsSchema = z.object({
  id: z.string(),
  investment_title: z.optional(z.any().nullable()),
  account_name: z.optional(z.any().nullable()),
  account: z.optional(z.any().nullable()),
  portco: z.optional(z.any().nullable()),
  files: z.optional(z.any().nullable()),
  Capital: z.optional(z.number().nullable()),
  Units: z.optional(z.number().nullable()),
  Series: z.optional(z.string().nullable()),
  Inv_date: z.optional(z.string().nullable()),
  email_by_investment: z.optional(z.any().nullable()),
  Investco_ownership: z.optional(z.any().nullable()),
  Total_Units: z.optional(z.any().nullable()),
  Method: z.optional(z.string().nullable()),
  user_id: z.optional(z.any().nullable()),
});

export const PortcosSchema = z.object({
  id: z.string(),
  portco_name: z.optional(z.string().nullable()),
  investments: z.optional(z.any().nullable()),
  Capital: z.optional(z.any().nullable()),
  files: z.optional(z.any().nullable()),
  email_by_portco: z.optional(z.any().nullable()),
  Units: z.optional(z.any().nullable()),
  Ownership: z.optional(z.number().nullable()),
  user_id: z.optional(z.any().nullable()),
  website: z.optional(z.string().nullable()),
  description: z.optional(z.string().nullable()),
  logo: z.optional(z.array(z.string()).nullable()),
  rev_start_year: z.optional(z.string().nullable()),
  rev_y1: z.optional(z.number().nullable()),
  rev_y2: z.optional(z.number().nullable()),
  rev_y3: z.optional(z.number().nullable()),
  rev_y4: z.optional(z.number().nullable()),
  rev_units: z.optional(z.string().nullable()),
});

export const FilesSchema = z.object({
  id: z.string(),
  file_title: z.optional(z.any().nullable()),
  file_name: z.optional(z.string().nullable()),
  portco: z.optional(z.any().nullable()),
  account: z.optional(z.any().nullable()),
  investment: z.optional(z.any().nullable()),
  document: z.optional(z.array(z.string()).nullable()),
  Tags: z.optional(z.array(z.string()).nullable()),
  status: z.optional(z.string().nullable()),
  access: z.optional(z.any().nullable()),
  user_id_acc: z.optional(z.any().nullable()),
  user_id_portco: z.optional(z.any().nullable()),
  user_id_invest: z.optional(z.any().nullable()),
  user_id: z.optional(z.any().nullable()),
  date: z.optional(z.string().nullable()),
});

export const ActivitiesSchema = z.object({
  id: z.string(),
  Name: z.optional(z.string().nullable()),
  Notes: z.optional(z.string().nullable()),
  Assignee: z.optional(z.any().nullable()),
  Status: z.optional(z.string().nullable()),
});

export interface UsersFields extends BaseFields {
  user_title?: any | null;
  name_first?: string | null;
  name_last?: string | null;
  email?: string | null;
  phone?: any | null;
  roles?: any | null;
  account?: any | null;
  user_id?: string | null;
  old_user_id?: string | null;
  avatar?: string[] | null;
}

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
    roles: "string | null",
    account: "string | null",
    user_id: "string | null",
    old_user_id: "string | null",
    avatar: "string[] | null",
  }
} as const satisfies Table<UsersFields>;

export interface RolesFields extends BaseFields {
  role_title?: any | null;
  user?: any | null;
  account?: any | null;
  role?: string | null;
  Email?: any | null;
  user_id?: any | null;
  account_name?: any | null;
  account_type?: any | null;
}

export const rolesTable = {
  name: 'roles',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_ROLES_TABLE_ID!,
  schema: {
    role_title: "string | null",
    user: "string | null",
    account: "string | null",
    role: "string | null",
    Email: "string | null",
    user_id: "string | null",
    account_name: "string | null",
    account_type: "string | null",
  }
} as const satisfies Table<RolesFields>;

export interface AccountsFields extends BaseFields {
  account_title?: any | null;
  account_name?: string | null;
  Owner?: any | null;
  roles?: any | null;
  investments?: any | null;
  files?: any | null;
  Deployed?: any | null;
  email_by_account?: any | null;
  user_id?: any | null;
  account_type?: string | null;
  account_subtype?: string | null;
}

export const accountsTable = {
  name: 'accounts',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_ACCOUNTS_TABLE_ID!,
  schema: {
    account_title: "string | null",
    account_name: "string | null",
    Owner: "string | null",
    roles: "string | null",
    investments: "string | null",
    files: "string | null",
    Deployed: "string | null",
    email_by_account: "string | null",
    user_id: "string | null",
    account_type: "string | null",
    account_subtype: "string | null",
  }
} as const satisfies Table<AccountsFields>;

export interface InvestmentsFields extends BaseFields {
  investment_title?: any | null;
  account_name?: any | null;
  account?: any | null;
  portco?: any | null;
  files?: any | null;
  Capital?: number | null;
  Units?: number | null;
  Series?: string | null;
  Inv_date?: string | null;
  email_by_investment?: any | null;
  Investco_ownership?: any | null;
  Total_Units?: any | null;
  Method?: string | null;
  user_id?: any | null;
}

export const investmentsTable = {
  name: 'investments',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_INVESTMENTS_TABLE_ID!,
  schema: {
    investment_title: "string | null",
    account_name: "string | null",
    account: "string | null",
    portco: "string | null",
    files: "string | null",
    Capital: "number | null",
    Units: "number | null",
    Series: "string | null",
    Inv_date: "string | null",
    email_by_investment: "string | null",
    Investco_ownership: "string | null",
    Total_Units: "string | null",
    Method: "string | null",
    user_id: "string | null",
  }
} as const satisfies Table<InvestmentsFields>;

export interface PortcosFields extends BaseFields {
  portco_name?: string | null;
  investments?: any | null;
  Capital?: any | null;
  files?: any | null;
  email_by_portco?: any | null;
  Units?: any | null;
  Ownership?: number | null;
  user_id?: any | null;
  website?: string | null;
  description?: string | null;
  logo?: string[] | null;
  rev_start_year?: string | null;
  rev_y1?: number | null;
  rev_y2?: number | null;
  rev_y3?: number | null;
  rev_y4?: number | null;
  rev_units?: string | null;
}

export const portcosTable = {
  name: 'portcos',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_PORTCOS_TABLE_ID!,
  schema: {
    portco_name: "string | null",
    investments: "string | null",
    Capital: "string | null",
    files: "string | null",
    email_by_portco: "string | null",
    Units: "string | null",
    Ownership: "number | null",
    user_id: "string | null",
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

export interface FilesFields extends BaseFields {
  file_title?: any | null;
  file_name?: string | null;
  portco?: any | null;
  account?: any | null;
  investment?: any | null;
  document?: string[] | null;
  Tags?: string[] | null;
  status?: string | null;
  access?: any | null;
  user_id_acc?: any | null;
  user_id_portco?: any | null;
  user_id_invest?: any | null;
  user_id?: any | null;
  date?: string | null;
}

export const filesTable = {
  name: 'files',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: process.env.AIRTABLE_FILES_TABLE_ID!,
  schema: {
    file_title: "string | null",
    file_name: "string | null",
    portco: "string | null",
    account: "string | null",
    investment: "string | null",
    document: "string[] | null",
    Tags: "string[] | null",
    status: "string | null",
    access: "string | null",
    user_id_acc: "string | null",
    user_id_portco: "string | null",
    user_id_invest: "string | null",
    user_id: "string | null",
    date: "string | null",
  }
} as const satisfies Table<FilesFields>;

export interface ActivitiesFields extends BaseFields {
  Name?: string | null;
  Notes?: string | null;
  Assignee?: any | null;
  Status?: string | null;
}

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

