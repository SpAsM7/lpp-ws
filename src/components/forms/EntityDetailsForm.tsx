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
import { US_STATES, COUNTRIES } from "@/lib/features/location/locations"
import type { NewAccountFormData } from "@/lib/schemas/account"

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
                  <Input {...field} />
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
              name="entity_details.fiscal_year_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiscal Year End</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01">January</SelectItem>
                        <SelectItem value="02">February</SelectItem>
                        <SelectItem value="03">March</SelectItem>
                        <SelectItem value="04">April</SelectItem>
                        <SelectItem value="05">May</SelectItem>
                        <SelectItem value="06">June</SelectItem>
                        <SelectItem value="07">July</SelectItem>
                        <SelectItem value="08">August</SelectItem>
                        <SelectItem value="09">September</SelectItem>
                        <SelectItem value="10">October</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
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
              name="entity_details.formation_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formation Country</FormLabel>
                  <FormControl>
                    <Combobox
                      options={countryOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="Select country"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-6">
            <FormField
              control={control}
              name="entity_details.is_privately_held"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
        </div>
      </Card>

      {isTrust && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trust Details</h3>
          <div className="grid gap-6">
            <FormField
              control={control}
              name="entity_details.entity_specific_info.trust.grantor_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grantor Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="entity_details.entity_specific_info.trust.trust_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trust Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trust type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revocable">Revocable</SelectItem>
                        <SelectItem value="irrevocable">Irrevocable</SelectItem>
                        <SelectItem value="charitable">Charitable</SelectItem>
                        <SelectItem value="testamentary">Testamentary</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      )}
    </div>
  )
}
