"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useWizard } from "@/lib/domains/accounts/contexts/account-wizard"
import { useFormContext } from "react-hook-form"
import type { NewAccountFormData } from "@/lib/domains/accounts/schema"
import { cn } from "@/lib/features/ui/utils/styles"
import { Icons } from "@/components/ui/icons"
import React from "react"

type AccountType = "personal" | "entity" | "retirement" | "special_other"

const ACCOUNT_TYPES = [
  {
    value: "personal",
    label: "Personal Account",
    description: "Individual or joint account for personal investments",
    icon: Icons.user
  },
  {
    value: "entity",
    label: "Entity Account",
    description: "LLC, Trust, Partnership, or Corporation",
    icon: Icons.building2
  },
  {
    value: "retirement",
    label: "Retirement Account",
    description: "IRA or 401(k) accounts",
    icon: Icons.piggyBank
  },
  {
    value: "special_other",
    label: "Special/Other",
    description: "Other account types requiring special handling",
    icon: Icons.star
  }
] as const

export function AccountTypeStep() {
  const { state, updateForm, setValid } = useWizard()
  const { setValue, getValues } = useFormContext<NewAccountFormData>()
  const value = state.formData.account_type

  const handleChange = (newValue: AccountType) => {
    console.log('AccountTypeStep - Before Update:', { 
      currentValue: value,
      newValue,
      formData: state.formData 
    })

    // Update form context first
    setValue('account_type', newValue, { shouldValidate: true })
    setValue('account_subtype', undefined, { shouldValidate: true })

    // Then update wizard state
    updateForm({
      account_type: newValue,
      account_subtype: undefined
    })

    // Set valid after both updates
    setValid(true)

    console.log('AccountTypeStep - After Update:', { 
      newValue,
      formData: getValues(),
      wizardState: state.formData
    })
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
              className={cn(
                "flex items-start space-x-4 p-6 rounded-lg border border-input",
                "cursor-pointer bg-background hover:bg-accent",
                "peer-data-[state=checked]:bg-secondary"
              )}
            >
              <span className={cn(
                "flex-shrink-0 h-5 w-5 mt-1",
                "text-muted-foreground",
                "peer-data-[state=checked]:text-primary"
              )}>
                {React.createElement(type.icon, { className: "h-5 w-5" })}
              </span>
              <div className="space-y-1 flex-grow">
                <p className="font-semibold tracking-tight">{type.label}</p>
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
