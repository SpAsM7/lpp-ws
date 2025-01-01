"use client"

import { useFormContext } from "react-hook-form"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Skeleton } from "@/components/ui/skeleton"
import type { NewAccountFormData, DocumentInfo } from "@/lib/domains/accounts/schema"
import { formatFileSize } from "@/lib/features/formatting"

export function ReviewStep() {
  const { watch } = useFormContext<NewAccountFormData>()
  const formData = watch()
  const {
    account_type,
    account_subtype,
    legal_name,
    tax_id,
    personal_details,
    retirement_details,
    entity_details,
    address,
    documents
  } = formData

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Review Account Details</h2>
          <p className="text-muted-foreground">
            Please review all information before submitting
          </p>
        </div>
      </Card>

      <ReviewSection title="Account Type">
        <ReviewField 
          label="Account Type" 
          value={account_type?.charAt(0).toUpperCase() + account_type?.slice(1)} 
        />
        <ReviewField 
          label="Account Subtype" 
          value={account_subtype?.toUpperCase()} 
        />
        <ReviewField label="Legal Name" value={legal_name} />
        <ReviewField 
          label="Tax ID" 
          value={tax_id?.replace(/\d/g, "X")} 
        />
      </ReviewSection>

      {personal_details && (
        <ReviewSection title="Personal Details">
          {personal_details.owners.map((owner, index: number) => (
            <div key={index} className="space-y-2">
              <ReviewField 
                label={`Owner ${index + 1} Name`} 
                value={owner.name} 
              />
              {owner.ownership_percentage && (
                <ReviewField 
                  label="Ownership Percentage" 
                  value={`${owner.ownership_percentage}%`} 
                />
              )}
            </div>
          ))}
        </ReviewSection>
      )}

      {entity_details && (
        <ReviewSection title="Entity Details">
          <ReviewField 
            label="Formation Date" 
            value={entity_details.formation_date} 
          />
          <ReviewField 
            label="Formation State" 
            value={entity_details.formation_state} 
          />
          <ReviewField 
            label="Formation Country" 
            value={entity_details.formation_country} 
          />
          <ReviewField 
            label="Fiscal Year End" 
            value={entity_details.fiscal_year_end} 
          />
          <ReviewField 
            label="Privately Held" 
            value={entity_details.is_privately_held ? "Yes" : "No"} 
          />
          <ReviewField 
            label="Foreign Entity" 
            value={entity_details.is_foreign ? "Yes" : "No"} 
          />
        </ReviewSection>
      )}

      {retirement_details && (
        <ReviewSection title="Retirement Account Details">
          <ReviewField 
            label="Custodian Name" 
            value={retirement_details.custodian_name} 
          />
          {retirement_details.plan_name && (
            <ReviewField 
              label="Plan Name" 
              value={retirement_details.plan_name} 
            />
          )}
        </ReviewSection>
      )}

      {address && (
        <ReviewSection title="Address">
          <ReviewField label="Street" value={address.street1} />
          {address.street2 && (
            <ReviewField label="Street 2" value={address.street2} />
          )}
          <ReviewField label="City" value={address.city} />
          <ReviewField label="State" value={address.state} />
          <ReviewField label="Postal Code" value={address.postal_code} />
          <ReviewField label="Country" value={address.country} />
        </ReviewSection>
      )}

      {documents && Object.keys(documents).length > 0 && (
        <ReviewSection title="Documents">
          <h4 className="font-medium capitalize">
            Documents
          </h4>
          {Object.entries(documents).map(([docType, doc]) => (
            <div key={docType} className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <h4 className="font-medium capitalize">
                  {docType.replace(/_/g, " ")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {(doc as DocumentInfo).name} ({formatFileSize((doc as DocumentInfo).size)})
                </p>
              </div>
              <Icons.check className="h-5 w-5 text-green-500" />
            </div>
          ))}
        </ReviewSection>
      )}
    </div>
  )
}

interface ReviewSectionProps {
  title: string
  children: React.ReactNode
  onEdit?: () => void
}

function ReviewSection({ title, children, onEdit }: ReviewSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Icons.edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  )
}

interface ReviewFieldProps {
  label: string
  value: string | number | undefined
}

function ReviewField({ label, value }: ReviewFieldProps) {
  if (!value) return null
  return (
    <div className="grid grid-cols-2 gap-4 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}

export function ReviewStepSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </Card>

      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <div key={j} className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
