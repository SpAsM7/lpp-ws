// Auto-generated Zod schemas
import { z } from 'zod';

export const UsersSchema = z.object({
  id: z.string(),
  user_title: z.string().nullable(),
  name_first: z.string().nullable(),
  name_last: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  roles: z.array(z.string())().nullable(),
  account: z.array(z.string())().nullable(),
  user_id: z.string().nullable(),
  old_user_id: z.string().nullable(),
  avatar: z.array(z.string())().nullable(),
  save_e: z.string().nullable(),
});

export const RolesSchema = z.object({
  id: z.string(),
  role_title: z.string().nullable(),
  user: z.array(z.string())().nullable(),
  account: z.array(z.string())().nullable(),
  role: z.string().nullable(),
  Email: z.array(z.string())().nullable(),
  user_id: z.array(z.string())().nullable(),
  account_name: z.array(z.string())().nullable(),
  account_type: z.array(z.string())().nullable(),
});

export const AccountsSchema = z.object({
  id: z.string(),
  account_title: z.string().nullable(),
  account_name: z.string().nullable(),
  Owner: z.array(z.string())().nullable(),
  roles: z.array(z.string())().nullable(),
  investments: z.array(z.string())().nullable(),
  files: z.array(z.string())().nullable(),
  Deployed: z.number[]().nullable(),
  email_by_account: z.array(z.string())().nullable(),
  user_id: z.array(z.string())().nullable(),
  account_type: z.string().nullable(),
  account_subtype: z.string().nullable(),
});

export const InvestmentsSchema = z.object({
  id: z.string(),
  investment_title: z.string().nullable(),
  account_name: z.array(z.string())().nullable(),
  account: z.array(z.string())().nullable(),
  portco: z.array(z.string())().nullable(),
  files: z.array(z.string())().nullable(),
  Capital: z.number().nullable(),
  Units: z.number().nullable(),
  Series: z.string().nullable(),
  Inv_date: z.string().nullable(),
  email_by_investment: z.array(z.string())().nullable(),
  Investco_ownership: z.number().nullable(),
  Total_Units: z.array(z.string())().nullable(),
  Method: z.string().nullable(),
  user_id: z.array(z.string())().nullable(),
});

export const PortcosSchema = z.object({
  id: z.string(),
  portco_title: z.string().nullable(),
  portco_name: z.string().nullable(),
  investments: z.array(z.string())().nullable(),
  Capital: z.number[]().nullable(),
  files: z.array(z.string())().nullable(),
  email_by_portco: z.array(z.string())().nullable(),
  Units: z.number[]().nullable(),
  Ownership: z.number().nullable(),
  user_id: z.array(z.string())().nullable(),
  website: z.string().nullable(),
  description: z.string().nullable(),
  logo: z.array(z.string())().nullable(),
  rev_start_year: z.string().nullable(),
  rev_y1: z.number().nullable(),
  rev_y2: z.number().nullable(),
  rev_y3: z.number().nullable(),
  rev_y4: z.number().nullable(),
  rev_units: z.string().nullable(),
});

export const FilesSchema = z.object({
  id: z.string(),
  file_title: z.string().nullable(),
  file_name: z.string().nullable(),
  description: z.string().nullable(),
  portco: z.array(z.string())().nullable(),
  account: z.array(z.string())().nullable(),
  investment: z.array(z.string())().nullable(),
  document: z.array(z.string())().nullable(),
  type: z.array(z.string())().nullable(),
  status: z.string().nullable(),
  access: z.string().nullable(),
  user_id_acc: z.array(z.string())().nullable(),
  user_id_portco: z.array(z.string())().nullable(),
  user_id_invest: z.array(z.string())().nullable(),
  user_id: z.string().nullable(),
  date: z.string().nullable(),
});

export const ActivitiesSchema = z.object({
  id: z.string(),
  Name: z.string().nullable(),
  Notes: z.string().nullable(),
  Assignee: z.string().nullable(),
  Status: z.string().nullable(),
});

