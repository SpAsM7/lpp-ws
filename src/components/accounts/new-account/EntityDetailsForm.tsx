"use client"

import { useFormContext } from "react-hook-form"
import { useCallback, useMemo } from "react"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { AddressForm } from "./AddressForm"
import { US_STATES } from "@/lib/constants/locations"
import type { NewAccountFormData } from "@/lib/schemas/account"

export function EntityDetailsForm() {
  const { control, watch } = useFormContext<NewAccountFormData>()
  const accountSubtype = watch("account_subtype")
  const isTrust = accountSubtype === "trust"

  const stateOptions = useMemo<ComboboxOption[]>(() => 
    US_STATES.map(state => ({
      value: state.value,
      label: state.label
    })),
    []
  )

  const renderTrustFields = useCallback(() => {
    if (!isTrust) return null

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Trust Details</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="entity_details.entity_specific_info.trust.trust_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trust Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="revocable">Revocable</SelectItem>
                    <SelectItem value="irrevocable">Irrevocable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="entity_details.entity_specific_info.trust.grantor_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grantor Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="grantor trust">Grantor Trust</SelectItem>
                    <SelectItem value="non-grantor trust">Non-Grantor Trust</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="entity_details.entity_specific_info.trust.beneficiary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Beneficiary</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    )
  }, [control, isTrust])

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Entity Information</h3>
        <div className="grid gap-6">
          <FormField
            control={control}
            name="legal_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Entity Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID (EIN)</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="XX-XXXXXXX"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={control}
              name="entity_details.formation_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formation Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="entity_details.formation_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formation State</FormLabel>
                  <FormControl>
                    <Combobox
                      options={stateOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select state"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="entity_details.fiscal_year_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiscal Year End</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={control}
              name="entity_details.is_privately_held"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <FormLabel>Privately Held</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="entity_details.is_foreign"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <FormLabel>Foreign Entity</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Card>

      {renderTrustFields()}

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Address</h3>
        <AddressForm />
      </Card>
    </div>
  )
}
