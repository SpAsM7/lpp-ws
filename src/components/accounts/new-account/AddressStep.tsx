"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddressForm } from "./AddressForm"

export function AddressStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Address Information</CardTitle>
      </CardHeader>
      <CardContent>
        <AddressForm />
      </CardContent>
    </Card>
  )
}
