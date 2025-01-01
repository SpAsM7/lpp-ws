"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { useFormContext } from "react-hook-form"
import { Upload } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/ui/icons"
import { FileUpload } from "@/components/ui/file-upload"
import { useWizard } from "@/lib/domains/accounts/contexts/account-wizard"
import { useToast } from "@/lib/features/notifications/use-toast"
import type { NewAccountFormData } from "@/lib/domains/accounts/schema"

export function DocumentUploadStep() {
  const form = useFormContext()
  const { state, setValid } = useWizard()
  const accountType = form.watch("account_type")
  const accountSubtype = form.watch("account_subtype")
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({})
  const { toast } = useToast()
  
  const requiredDocuments = getRequiredDocuments(accountType, accountSubtype)

  // Check if all required documents are uploaded
  const checkRequiredDocuments = useCallback(() => {
    const allRequiredUploaded = requiredDocuments
      .filter(doc => doc.required)
      .every(doc => uploadStatus[doc.id]?.status === "success")
    setValid(allRequiredUploaded)
  }, [requiredDocuments, uploadStatus, setValid])

  const handleUpload = useCallback(async (docType: string, file: File) => {
    setUploadStatus(prev => ({
      ...prev,
      [docType]: { status: "uploading", file }
    }))

    try {
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB")
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg"
      ]
      if (!allowedTypes.includes(file.type)) {
        throw new Error("File must be PDF, PNG, or JPG")
      }

      // Store the file info in form data to be handled during final submission
      form.setValue(`documents.${docType}`, {
        file,
        name: file.name,
        type: file.type,
        size: file.size
      })
      
      setUploadStatus(prev => ({
        ...prev,
        [docType]: { status: "success", file }
      }))
      toast({
        title: "File Ready",
        description: `${file.name} ready for upload`,
      })
      checkRequiredDocuments()
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus(prev => ({
        ...prev,
        [docType]: { 
          status: "error", 
          file,
          error: error instanceof Error ? error.message : "Upload failed" 
        }
      }))
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to prepare file",
      })
    }
  }, [form, checkRequiredDocuments, toast])

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Required Documents</h2>
          <p className="text-muted-foreground">
            Please upload the following documents to complete your account setup
          </p>
        </div>
      </Card>

      <div className="grid gap-4">
        {requiredDocuments.map((doc) => {
          const status = uploadStatus[doc.id]
          return (
            <Card key={doc.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      {doc.name}
                      {doc.required && <span className="text-destructive ml-1">*</span>}
                    </h3>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                  </div>
                  {status?.status === "success" && (
                    <Icons.check className="h-5 w-5 text-green-500" />
                  )}
                </div>

                <FileUpload
                  onFileSelect={(file) => handleUpload(doc.id, file)}
                  uploading={status?.status === "uploading"}
                  error={status?.error}
                  success={status?.status === "success"}
                  accept=".pdf,.png,.jpg,.jpeg"
                  maxSize={10 * 1024 * 1024} // 10MB
                />

                {status?.status === "success" && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{status.file?.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        form.setValue(`documents.${doc.id}`, undefined)
                        setUploadStatus(prev => {
                          const { [doc.id]: _, ...rest } = prev
                          return rest
                        })
                        checkRequiredDocuments()
                      }}
                    >
                      <Icons.trash className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function DocumentUploadStepSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </Card>

      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function getRequiredDocuments(accountType: string, accountSubtype: string): DocumentRequirement[] {
  const baseDocuments = [
    {
      id: "tax_form",
      name: "Tax Form",
      description: "W-9 for US persons, W-8BEN for foreign individuals",
      required: true
    },
    {
      id: "id_verification",
      name: "ID Verification",
      description: "Government-issued photo ID",
      required: true
    }
  ]

  const additionalDocs = {
    entity: [
      {
        id: "formation_docs",
        name: "Formation Documents",
        description: "Articles of incorporation, trust agreement, or similar",
        required: true
      },
      {
        id: "operating_agreement",
        name: "Operating Agreement",
        description: "Current operating agreement or bylaws",
        required: true
      }
    ],
    trust: [
      {
        id: "trust_agreement",
        name: "Trust Agreement",
        description: "Complete trust agreement document",
        required: true
      }
    ],
    partnership: [
      {
        id: "partnership_agreement",
        name: "Partnership Agreement",
        description: "Complete partnership agreement",
        required: true
      }
    ],
    retirement: [
      {
        id: "custodian_agreement",
        name: "Custodian Agreement",
        description: "Agreement with retirement account custodian",
        required: true
      }
    ]
  }

  let docs = [...baseDocuments]

  if (accountType === "entity") {
    docs = [...docs, ...additionalDocs.entity]
    if (accountSubtype === "trust") {
      docs = [...docs, ...additionalDocs.trust]
    } else if (accountSubtype === "partnership") {
      docs = [...docs, ...additionalDocs.partnership]
    }
  } else if (accountType === "retirement") {
    docs = [...docs, ...additionalDocs.retirement]
  }

  return docs
}

// Interfaces
interface DocumentRequirement {
  id: string
  name: string
  description: string
  required: boolean
}

interface UploadStatus {
  [key: string]: {
    status: "idle" | "uploading" | "success" | "error"
    file?: File
    error?: string
  }
}
