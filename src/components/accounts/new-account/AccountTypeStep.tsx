"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useWizard } from "@/lib/contexts/account-wizard"
import type { AccountType } from "@/lib/schemas/account"

const ACCOUNT_TYPES = [
  {
    value: "personal",
    label: "Personal Account",
    description: "Individual or joint account for personal investments",
    icon: "👤"
  },
  {
    value: "entity",
    label: "Entity Account",
    description: "LLC, Trust, Partnership, or Corporation",
    icon: "🏢"
  },
  {
    value: "retirement",
    label: "Retirement Account",
    description: "IRA or 401(k) accounts",
    icon: "🏦"
  },
  {
    value: "special_other",
    label: "Special/Other",
    description: "Other account types requiring special handling",
    icon: "✨"
  }
] as const

export function AccountTypeStep() {
  const { state, updateForm, setValid } = useWizard()
  const value = state.formData.account_type

  const handleChange = (newValue: AccountType) => {
    updateForm({ account_type: newValue })
    setValid(true)
    // Reset subtype when type changes
    if (newValue !== state.formData.account_type) {
      updateForm({ account_subtype: undefined })
    }
  }

  return (
    <div className="space-y-6">
      <RadioGroup
        value={value}
        onValueChange={(val) => handleChange(val as AccountType)}
        className="grid gap-4"
      >
        {ACCOUNT_TYPES.map((type) => (
          <div key={type.value} className="relative">
            <RadioGroupItem
              value={type.value}
              id={type.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={type.value}
              className="flex items-start space-x-4 p-6 bg-white rounded-lg border-2 [&:has([data-state=checked])]:border-primary cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
            >
              <span className="text-2xl">{type.icon}</span>
              <div className="space-y-1">
                <p className="text-base font-semibold">{type.label}</p>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
