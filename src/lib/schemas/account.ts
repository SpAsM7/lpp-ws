import { z } from "zod"

// Base schemas for different account types
export const personalDetailsSchema = z.object({
  owners: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    ownership_percentage: z.number().min(0).max(100).optional()
  }))
})

export const retirementDetailsSchema = z.object({
  custodian_name: z.string().min(1, "Custodian name is required"),
  plan_name: z.string().optional()
})

export const entityDetailsSchema = z.object({
  formation_date: z.string().min(1, "Formation date is required"),
  formation_state: z.string().min(1, "Formation state is required"),
  formation_country: z.string().min(1, "Formation country is required"),
  fiscal_year_end: z.string().min(1, "Fiscal year end is required"),
  is_privately_held: z.boolean(),
  is_foreign: z.boolean(),
  entity_specific_info: z.object({
    trust: z.object({
      trust_type: z.string().refine(
        (val): val is "living" | "testamentary" | "charitable" | "business" => 
        ["living", "testamentary", "charitable", "business"].includes(val),
        "Invalid trust type"
      ),
      grantor_status: z.string().refine(
        (val): val is "grantor trust" | "non-grantor trust" => 
        ["grantor trust", "non-grantor trust"].includes(val),
        "Invalid grantor status"
      ),
      beneficiary: z.string().min(1, "Beneficiary is required")
    }).optional()
  }).optional()
})

// Document schema
export const documentSchema = z.object({
  file: z.instanceof(File),
  name: z.string(),
  type: z.string(),
  size: z.number()
})

export type DocumentInfo = z.infer<typeof documentSchema>

// Account type enums
export const accountTypeEnum = z.enum(["personal", "entity", "retirement", "special_other"])
export const personalSubtypeEnum = z.enum(["individual", "joint"])
export const entitySubtypeEnum = z.enum(["LLC", "trust", "partnership", "corporation", "non-profit", "other"])
export const retirementSubtypeEnum = z.enum(["IRA", "401k"])

// Address schema
export const addressSchema = z.object({
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required")
})

// Base account schema
const baseAccountSchema = z.object({
  account_type: accountTypeEnum,
  account_subtype: z.string().min(1, "Account subtype is required"),
  legal_name: z.string().min(1, "Legal name is required"),
  tax_id: z.string().min(1, "Tax ID is required"),
  address: addressSchema,
  documents: z.record(z.string(), documentSchema).optional(),
  personal_details: personalDetailsSchema.optional(),
  retirement_details: retirementDetailsSchema.optional(),
  entity_details: entityDetailsSchema.optional()
})

// Combined schema for new account with conditional validation
export const newAccountSchema = baseAccountSchema.superRefine((data, ctx) => {
  switch (data.account_type) {
    case "personal":
      if (!data.personal_details) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Personal details are required for personal accounts",
          path: ["personal_details"]
        })
      }
      break
    case "entity":
      if (!data.entity_details) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Entity details are required for entity accounts",
          path: ["entity_details"]
        })
      }
      break
    case "retirement":
      if (!data.retirement_details) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Retirement details are required for retirement accounts",
          path: ["retirement_details"]
        })
      }
      break
  }
})

export type NewAccountFormData = z.infer<typeof newAccountSchema>
export type AccountType = z.infer<typeof accountTypeEnum>
export type PersonalAccountSubtype = z.infer<typeof personalSubtypeEnum>
export type EntityAccountSubtype = z.infer<typeof entitySubtypeEnum>
export type RetirementAccountSubtype = z.infer<typeof retirementSubtypeEnum>
