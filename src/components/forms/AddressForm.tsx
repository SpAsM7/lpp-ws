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
import { US_STATES, COUNTRIES } from "@/lib/constants/locations"
import type { NewAccountFormData } from "@/lib/schemas/account"

export function AddressForm() {
  const { control } = useFormContext<NewAccountFormData>()

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
        name="address.street1"
        rules={{ required: "Street address is required" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="address.street2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address 2 (Optional)</FormLabel>
            <FormControl>
              <Input {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
          name="address.city"
          rules={{ required: "City is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="address.state"
          rules={{ required: "State is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
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
          name="address.postal_code"
          rules={{ required: "Postal code is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="address.country"
          rules={{ required: "Country is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
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
    </div>
  )
}
