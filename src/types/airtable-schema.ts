// Auto-generated Airtable schema types
// Generated on: 2025-01-05T01:43:42.367Z

import { Table } from 'airtable-ts';

export interface BaseFields {
  id: string;
}

export interface UsersFields extends BaseFields {
  user_title: string;
  name_first: string;
  name_last: string;
  email: string;
  phone: string;
  roles: string;
  account: string;
  user_id: string;
}

export const usersTable: Table<UsersFields> = {
  name: 'users',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: 'tblEyO6PHeFXuxq4F',
  schema: {
    user_title: 'string',
    name_first: 'string',
    name_last: 'string',
    email: 'string',
    phone: 'string',
    roles: 'string',
    account: 'string',
    user_id: 'string'
  }
};

export interface RolesFields extends BaseFields {
  role_title: string;
  user: string;
  account: string;
  role: string;
  Email: string;
  user_id: string;
  account_name: string;
  account_type: string;
}

export const rolesTable: Table<RolesFields> = {
  name: 'roles',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: 'tblYH2nKYwfVwKVqu',
  schema: {
    role_title: 'string',
    user: 'string',
    account: 'string',
    role: 'string',
    Email: 'string',
    user_id: 'string',
    account_name: 'string',
    account_type: 'string'
  }
};

export interface AccountsFields extends BaseFields {
  account_title: string;
  account_name: string;
  Owner: string;
  roles: string;
  investments: string;
  files: string;
  Deployed: string;
  email_by_account: string;
  user_id: string;
  account_type: string;
  account_subtype: string;
}

export const accountsTable: Table<AccountsFields> = {
  name: 'accounts',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: 'tblQO83c4VTSkyYFi',
  schema: {
    account_title: 'string',
    account_name: 'string',
    Owner: 'string',
    roles: 'string',
    investments: 'string',
    files: 'string',
    Deployed: 'string',
    email_by_account: 'string',
    user_id: 'string',
    account_type: 'string',
    account_subtype: 'string'
  }
};

export interface InvestmentsFields extends BaseFields {
  investment_title: string;
  account_name: string;
  account: string;
  portco: string;
  files: string;
  Capital: number;
  Units: number;
  Series: string;
  Inv_date: string;
  email_by_investment: string;
  Investco_ownership: string;
  Total_Units: string;
  Method: string;
  user_id: string;
}

export const investmentsTable: Table<InvestmentsFields> = {
  name: 'investments',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: 'tblwlB16XvkIbpq56',
  schema: {
    investment_title: 'string',
    account_name: 'string',
    account: 'string',
    portco: 'string',
    files: 'string',
    Capital: 'number',
    Units: 'number',
    Series: 'string',
    Inv_date: 'string',
    email_by_investment: 'string',
    Investco_ownership: 'string',
    Total_Units: 'string',
    Method: 'string',
    user_id: 'string'
  }
};

export interface PortcosFields extends BaseFields {
  portco_name: string;
  investments: string;
  Capital: string;
  files: string;
  email_by_portco: string;
  Units: string;
  Ownership: number;
  user_id: string;
  website: string;
  description: string;
  logo: string[];
  rev_start_year: string;
  rev_y1: number;
  rev_y2: number;
  rev_y3: number;
  rev_y4: number;
  rev_units: string;
}

export const portcosTable: Table<PortcosFields> = {
  name: 'portcos',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: 'tblXvdDlsM2GtKofQ',
  schema: {
    portco_name: 'string',
    investments: 'string',
    Capital: 'string',
    files: 'string',
    email_by_portco: 'string',
    Units: 'string',
    Ownership: 'number',
    user_id: 'string',
    website: 'string',
    description: 'string',
    logo: 'string[]',
    rev_start_year: 'string',
    rev_y1: 'number',
    rev_y2: 'number',
    rev_y3: 'number',
    rev_y4: 'number',
    rev_units: 'string'
  }
};

export interface FilesFields extends BaseFields {
  file_title: string;
  file_name: string;
  portco: string;
  account: string;
  investment: string;
  document: string[];
  Tags: string[];
  status: string;
  access: string;
  user_id_acc: string;
  user_id_portco: string;
  user_id_invest: string;
  user_id: string;
  date: string;
}

export const filesTable: Table<FilesFields> = {
  name: 'files',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: 'tblrZGcCTKb9GT7uo',
  schema: {
    file_title: 'string',
    file_name: 'string',
    portco: 'string',
    account: 'string',
    investment: 'string',
    document: 'string[]',
    Tags: 'string[]',
    status: 'string',
    access: 'string',
    user_id_acc: 'string',
    user_id_portco: 'string',
    user_id_invest: 'string',
    user_id: 'string',
    date: 'string'
  }
};

export interface ActivitiesFields extends BaseFields {
  Name: string;
  Notes: string;
  Assignee: string;
  Status: string;
}

export const activitiesTable: Table<ActivitiesFields> = {
  name: 'activities',
  baseId: process.env.AIRTABLE_BASE_ID!,
  tableId: 'tblOVlZbAeu3jjoxg',
  schema: {
    Name: 'string',
    Notes: 'string',
    Assignee: 'string',
    Status: 'string'
  }
};

