import { z } from "zod"
import type { EmailOtpType } from "@supabase/supabase-js"

/**
 * Validation schemas and types for auth forms and actions.
 * These complement Supabase's built-in types from @supabase/supabase-js
 */

// Base schema for signup
export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
})

export const magicLinkSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const resetRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification code is required"),
  type: z.custom<EmailOtpType>(),
})

// Types for form inputs
export type SignUpInput = z.infer<typeof signUpSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type MagicLinkInput = z.infer<typeof magicLinkSchema>
export type ResetRequestInput = z.infer<typeof resetRequestSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>

/**
 * Common auth action result type
 */
export type AuthActionState<T = void> = {
  success: boolean
  error?: string
  data?: T
}