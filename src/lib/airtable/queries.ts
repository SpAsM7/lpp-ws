import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/types/supabase'

type Tables = Database['public']['Tables']
type Company = Tables['companies']['Row']
type Account = Tables['accounts']['Row']
type Investment = Tables['investments']['Row']

export async function getCompanies() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data
}

export async function getAccounts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('accounts')
    .select(`
      *,
      account_members (
        profile_id,
        role
      )
    `)
    .order('name')
  
  if (error) throw error
  return data
}

export async function getInvestments() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('investments')
    .select(`
      *,
      companies (
        name,
        logo_url
      ),
      accounts (
        name
      )
    `)
    .order('investment_date', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function createInvestment(investment: Omit<Investment, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('investments')
    .insert(investment)
    .select()
    .single()
  
  if (error) throw error
  return data
} 