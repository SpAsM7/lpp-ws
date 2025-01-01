import { cache } from "react"
import { getAccountTypes } from "@/lib/airtable/accounts"

export const preloadAccountTypes = cache(async () => {
  const accountTypes = await getAccountTypes()
  return accountTypes
}) 