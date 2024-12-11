"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useWizard } from "@/lib/contexts/account-wizard"

const SUBTYPE_OPTIONS = {
  personal: [
    { 
      value: "individual", 
      label: "Individual Account", 
      description: "Single owner account with full control",
      icon: "👤"
    },
    { 
      value: "joint", 
      label: "Joint Account", 
      description: "Multiple owners with shared ownership and control",
      icon: "👥"
    }
  ],
  entity: [
    { 
      value: "LLC", 
      label: "Limited Liability Company", 
      description: "Flexible business structure with liability protection",
      icon: "🏢"
    },
    { 
      value: "trust", 
      label: "Trust", 
      description: "Legal arrangement for asset management and distribution",
      icon: "📜"
    },
    { 
      value: "partnership", 
      label: "Partnership", 
      description: "Business owned and operated by multiple partners",
      icon: "🤝"
    },
    { 
      value: "corporation", 
      label: "Corporation", 
      description: "Formal business structure with shareholders",
      icon: "🏛️"
    },
    { 
      value: "non-profit", 
      label: "Non-Profit", 
      description: "Organization operating for charitable or educational purposes",
      icon: "🎗️"
    },
    { 
      value: "other", 
      label: "Other Entity", 
      description: "Other business structures requiring special handling",
      icon: "✨"
    }
  ],
  retirement: [
    { 
      value: "IRA", 
      label: "Individual Retirement Account", 
      description: "Tax-advantaged personal retirement account",
      icon: "💰"
    },
    { 
      value: "401k", 
      label: "401(k) Plan", 
      description: "Employer-sponsored retirement savings plan",
      icon: "🏦"
    }
  ],
  special_other: [
    { 
      value: "other", 
      label: "Special Account", 
      description: "Special account type requiring manual review",
      icon: "⭐"
    }
  ]
} as const

export function AccountSubtypeStep() {
  const { state, updateForm, setValid } = useWizard()
  const { account_type, account_subtype } = state.formData

  if (!account_type) return null

  const options = SUBTYPE_OPTIONS[account_type]

  const handleChange = (newValue: string) => {
    updateForm({ account_subtype: newValue })
    setValid(true)
  }

  return (
    <div className="space-y-6">
      <RadioGroup
        value={account_subtype}
        onValueChange={handleChange}
        className="grid gap-4"
      >
        {options.map((option) => (
          <div key={option.value} className="relative">
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={option.value}
              className="flex items-start space-x-4 p-6 bg-white rounded-lg border-2 [&:has([data-state=checked])]:border-primary cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary"
            >
              <span className="text-2xl">{option.icon}</span>
              <div className="space-y-1">
                <p className="text-base font-semibold">{option.label}</p>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
