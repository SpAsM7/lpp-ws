import { createClient } from "@/lib/supabase/server"
import { cache } from "react"
import type { NewAccountFormData } from "@/lib/schemas/account"

// Preload pattern for account types
export const preloadAccountTypes = cache(async () => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("account_types")
      .select("*")
      .order("name")

    if (error) {
      console.error("Error loading account types:", error)
      throw new Error("Failed to load account types")
    }

    return data
  } catch (error) {
    console.error("Error in preloadAccountTypes:", error)
    throw error
  }
})

// Create new account
export async function createAccount(data: NewAccountFormData) {
  try {
    const supabase = await createClient()

    // Start a transaction
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .insert({
        legal_name: data.legal_name,
        account_type: data.account_type,
        account_subtype: data.account_subtype,
        tax_id: data.tax_id,
        status: "pending",
        details: {
          personal: data.personal_details,
          entity: data.entity_details,
          retirement: data.retirement_details,
          address: data.address
        }
      })
      .select()
      .single()

    if (accountError) {
      console.error("Error creating account:", accountError)
      throw new Error("Failed to create account")
    }

    // Handle document uploads if any
    if (data.documents) {
      const documentPromises = Object.entries(data.documents).map(
        async ([docType, docInfo]) => {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("account-documents")
            .upload(
              `${account.id}/${docType}/${docInfo.name}`,
              docInfo.file as File
            )

          if (uploadError) {
            console.error(`Error uploading ${docType} document:`, uploadError)
            throw new Error(`Failed to upload ${docType} document`)
          }

          // Create document record
          const { error: docError } = await supabase
            .from("account_documents")
            .insert({
              account_id: account.id,
              document_type: docType,
              file_path: uploadData.path,
              file_name: docInfo.name,
              file_type: docInfo.type,
              file_size: docInfo.size,
            })

          if (docError) {
            console.error(`Error creating ${docType} document record:`, docError)
            throw new Error(`Failed to create ${docType} document record`)
          }
        }
      )

      await Promise.all(documentPromises)
    }

    // Create activity log
    const { error: activityError } = await supabase
      .from("account_activities")
      .insert({
        account_id: account.id,
        activity_type: "account_created",
        description: "Account created successfully",
      })

    if (activityError) {
      console.error("Error creating activity log:", activityError)
      // Don't throw here, just log the error
    }

    return { success: true, data: account }
  } catch (error) {
    console.error("Error in createAccount:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create account" 
    }
  }
}

// Get account by ID
export async function getAccountById(id: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("accounts")
      .select(`
        *,
        account_documents (
          id,
          document_type,
          file_name,
          file_type,
          file_size,
          created_at
        ),
        account_activities (
          id,
          activity_type,
          description,
          created_at
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error loading account:", error)
      throw new Error("Failed to load account")
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error in getAccountById:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to load account" 
    }
  }
}

// Get accounts list with pagination
export async function getAccounts(page = 1, limit = 10) {
  try {
    const supabase = await createClient()
    const start = (page - 1) * limit
    const end = start + limit - 1

    const { data, error, count } = await supabase
      .from("accounts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, end)

    if (error) {
      console.error("Error loading accounts:", error)
      throw new Error("Failed to load accounts")
    }

    return {
      success: true,
      data: {
        accounts: data,
        total: count || 0,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0,
      }
    }
  } catch (error) {
    console.error("Error in getAccounts:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to load accounts" 
    }
  }
}
