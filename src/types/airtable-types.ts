// Auto-generated TypeScript interfaces
export interface BaseFields {
  id: string;
}

export interface UsersFields extends BaseFields {
  user_title?: string | null;
  name_first?: string | null;
  name_last?: string | null;
  email?: string | null;
  phone?: string | null;
  roles?: string[] | null;
  account?: string[] | null;
  user_id?: string | null;
  old_user_id?: string | null;
  avatar?: string[] | null;
  save_e?: string | null;
}

export interface RolesFields extends BaseFields {
  role_title?: string | null;
  user?: string[] | null;
  account?: string[] | null;
  role?: string | null;
  Email?: string[] | null;
  user_id?: string[] | null;
  account_name?: string[] | null;
  account_type?: string[] | null;
}

export interface AccountsFields extends BaseFields {
  account_title?: string | null;
  account_name?: string | null;
  Owner?: string[] | null;
  roles?: string[] | null;
  investments?: string[] | null;
  files?: string[] | null;
  Deployed?: string[] | null;
  email_by_account?: string[] | null;
  user_id?: string[] | null;
  account_type?: string | null;
  account_subtype?: string | null;
}

export interface InvestmentsFields extends BaseFields {
  investment_title?: string | null;
  account_name?: string[] | null;
  account?: string[] | null;
  portco?: string[] | null;
  files?: string[] | null;
  Capital?: number | null;
  Units?: number | null;
  Series?: string | null;
  Inv_date?: string | null;
  email_by_investment?: string[] | null;
  Investco_ownership?: number | null;
  Total_Units?: string[] | null;
  Method?: string | null;
  user_id?: string[] | null;
}

export interface PortcosFields extends BaseFields {
  portco_title?: string | null;
  portco_name?: string | null;
  investments?: string[] | null;
  Capital?: string[] | null;
  files?: string[] | null;
  email_by_portco?: string[] | null;
  Units?: string[] | null;
  Ownership?: number | null;
  user_id?: string[] | null;
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

export interface FilesFields extends BaseFields {
  file_title?: string | null;
  file_name?: string | null;
  description?: string | null;
  portco?: string[] | null;
  account?: string[] | null;
  investment?: string[] | null;
  document?: string[] | null;
  type?: string[] | null;
  status?: string | null;
  access?: string | null;
  user_id_acc?: string[] | null;
  user_id_portco?: string[] | null;
  user_id_invest?: string[] | null;
  user_id?: string | null;
  date?: string | null;
}

export interface ActivitiesFields extends BaseFields {
  Name?: string | null;
  Notes?: string | null;
  Assignee?: string | null;
  Status?: string | null;
}

