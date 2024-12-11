"use server"

import { createAccount } from "@/lib/services/accounts"
import { newAccountSchema } from "@/lib/schemas/account"
import type { NewAccountFormData } from "@/lib/schemas/account"

export async function submitNewAccount(data: NewAccountFormData) {
  try {
    // Validate data
    const validationResult = newAccountSchema.safeParse(data)
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error)
      return {
        success: false,
        error: "Invalid account data"
      }
    }

    // Create account
    const result = await createAccount(validationResult.data)
    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to create account"
      }
    }

    return {
      success: true,
      data: result.data
    }
  } catch (error) {
    console.error("Error in submitNewAccount:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit account"
    }
  }
}

export async function validateAccountData(data: Partial<NewAccountFormData>) {
  try {
    const result = newAccountSchema.safeParse(data)
    return {
      success: result.success,
      error: result.success ? null : result.error.message
    }
  } catch (error) {
    console.error("Error validating account data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Validation failed"
    }
  }
}
