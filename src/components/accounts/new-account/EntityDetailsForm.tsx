"use client"

import { useFormContext } from "react-hook-form"
import { useMemo } from "react"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { US_STATES, COUNTRIES } from "@/lib/constants/locations"
import type { NewAccountFormData } from "@/lib/schemas/account"
import { AddressForm } from "./AddressForm"

export function EntityDetailsForm() {
  const { control, watch, getValues } = useFormContext<NewAccountFormData>()
  const accountSubtype = watch("account_subtype")
  const isTrust = accountSubtype === "trust"

  console.log('EntityDetailsForm - Full Form Context:', JSON.stringify(getValues(), null, 2))
  console.log('EntityDetailsForm - Account Subtype:', accountSubtype)
  console.log('EntityDetailsForm - US_STATES:', JSON.stringify(US_STATES, null, 2))
  console.log('EntityDetailsForm - US_STATES Type:', typeof US_STATES)
  console.log('EntityDetailsForm - US_STATES is Array:', Array.isArray(US_STATES))

  const stateOptions = useMemo<ComboboxOption[]>(() => 
    US_STATES.map(state => ({
      value: state.value,
      label: state.label
    })),
    []
  )

  const countryOptions = useMemo<ComboboxOption[]>(() => 
    COUNTRIES.map(country => ({
      value: country.value,
      label: country.label
    })),
    []
  )

  return (
    <div className="grid gap-6">
      <FormField
        control={control}
        name="legal_name"
        rules={{ required: "Legal name is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Legal Name</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="tax_id"
        rules={{ required: "Tax ID is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tax ID</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="entity_details.formation_date"
        rules={{ required: "Formation date is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Formation Date</FormLabel>
            <FormControl>
              <Input {...field} type="date" value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name="entity_details.formation_state"
          rules={{ required: "Formation state is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formation State</FormLabel>
              <FormControl>
                <Combobox
                  options={stateOptions}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  placeholder="Select state"
                  name={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="entity_details.formation_country"
          rules={{ required: "Formation country is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formation Country</FormLabel>
              <FormControl>
                <Combobox
                  options={countryOptions}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  placeholder="Select country"
                  name={field.name}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name="entity_details.fiscal_year_end"
          rules={{ required: "Fiscal year end is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fiscal Year End</FormLabel>
              <FormControl>
                <Input {...field} type="date" value={field.value || ""} />
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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Privately Held
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="entity_details.is_foreign"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Foreign Entity
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>

      {isTrust && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trust Details</h3>
          <div className="grid gap-6">
            <FormField
              control={control}
              name="entity_details.entity_specific_info.trust.trust_type"
              rules={{ required: "Trust type is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trust Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="living">Living Trust</SelectItem>
                        <SelectItem value="testamentary">Testamentary Trust</SelectItem>
                        <SelectItem value="charitable">Charitable Trust</SelectItem>
                        <SelectItem value="business">Business Trust</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="entity_details.entity_specific_info.trust.grantor_status"
              rules={{ required: "Grantor status is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grantor Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grantor trust">Grantor Trust</SelectItem>
                        <SelectItem value="non-grantor trust">Non-Grantor Trust</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="entity_details.entity_specific_info.trust.beneficiary"
              rules={{ required: "Beneficiary is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Beneficiary</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      )}

      <AddressForm />
    </div>
  )
}
