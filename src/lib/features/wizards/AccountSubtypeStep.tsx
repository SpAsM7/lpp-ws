"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useWizard } from "@/lib/domains/accounts/contexts/account-wizard"
import { useFormContext } from "react-hook-form"
import type { NewAccountFormData } from "@/lib/domains/accounts/schema"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/features/ui/utils/styles"
import React from "react"

const SUBTYPE_OPTIONS = {
  personal: [
    { 
      value: "individual", 
      label: "Individual Account", 
      description: "Single owner account with full control",
      icon: Icons.user
    },
    { 
      value: "joint", 
      label: "Joint Account", 
      description: "Multiple owners with shared ownership and control",
      icon: Icons.users
    }
  ],
  entity: [
    { 
      value: "LLC", 
      label: "Limited Liability Company", 
      description: "Flexible business structure with liability protection",
      icon: Icons.building2
    },
    { 
      value: "trust", 
      label: "Trust", 
      description: "Legal arrangement for asset management and distribution",
      icon: Icons.scroll
    },
    { 
      value: "partnership", 
      label: "Partnership", 
      description: "Business owned and operated by multiple partners",
      icon: Icons.users
    },
    { 
      value: "corporation", 
      label: "Corporation", 
      description: "Formal business structure with shareholders",
      icon: Icons.landmark
    },
    { 
      value: "non-profit", 
      label: "Non-Profit", 
      description: "Organization operating for charitable or educational purposes",
      icon: Icons.heart
    },
    { 
      value: "other", 
      label: "Other Entity", 
      description: "Other business structures requiring special handling",
      icon: Icons.star
    }
  ],
  retirement: [
    { 
      value: "IRA", 
      label: "Individual Retirement Account", 
      description: "Tax-advantaged personal retirement account",
      icon: Icons.piggyBank
    },
    { 
      value: "401k", 
      label: "401(k) Plan", 
      description: "Employer-sponsored retirement savings plan",
      icon: Icons.briefcase
    }
  ],
  special_other: [
    { 
      value: "other", 
      label: "Special Account", 
      description: "Special account type requiring manual review",
      icon: Icons.star
    }
  ]
} as const

export function AccountSubtypeStep() {
  const { state, updateForm, setValid } = useWizard()
  const { setValue, getValues } = useFormContext<NewAccountFormData>()
  const { account_type, account_subtype } = state.formData

  if (!account_type) return null

  const options = SUBTYPE_OPTIONS[account_type]

  const handleChange = (newValue: string) => {
    console.log('AccountSubtypeStep - Before Update:', { 
      currentValue: account_subtype,
      newValue,
      formData: state.formData 
    })

    // Update form context first
    setValue('account_subtype', newValue, { shouldValidate: true })

    // Then update wizard state
    updateForm({ account_subtype: newValue })

    // Set valid after both updates
    setValid(true)

    console.log('AccountSubtypeStep - After Update:', { 
      newValue,
      formData: getValues(),
      wizardState: state.formData
    })
  }

  return (
    <div className="space-y-6">
      <RadioGroup
        value={account_subtype}
        onValueChange={handleChange}
        className="grid gap-4"
      >
        {options.map((type) => (
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
