"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export function PersonalDetailsForm() {
  const form = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "personal_details.owners"
  })

  const isJoint = form.watch("account_subtype") === "joint"

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="legal_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social Security Number</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="XXX-XX-XXXX"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>

      {isJoint && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Owner Information</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", ownership_percentage: 0 })}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Owner
            </Button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 border border-input">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`personal_details.owners.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isJoint && (
                    <FormField
                      control={form.control}
                      name={`personal_details.owners.${index}.ownership_percentage`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ownership %</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              max="100"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {isJoint && index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-4"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Owner
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
