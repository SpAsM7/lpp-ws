import { createClient as _createClient } from "../client"
import { 
  SignUpInput, 
  LoginInput, 
  MagicLinkInput,
  signUpSchema,
  loginSchema,
  magicLinkSchema
} from "./validations"

export type { SignUpInput, LoginInput, MagicLinkInput }
export { signUpSchema, loginSchema, magicLinkSchema }
export const createClient = _createClient

export async function signUp({ email, password }: SignUpInput) {
  const supabase = createClient()
  return supabase.auth.signUp({
    email,
    password,
  })
}

export async function signIn({ email, password }: LoginInput) {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}

export async function resetPassword({ email }: MagicLinkInput) {
  const supabase = createClient()
  return supabase.auth.resetPasswordForEmail(email)
}

export async function updatePassword(password: string) {
  const supabase = createClient()
  return supabase.auth.updateUser({ password })
} 