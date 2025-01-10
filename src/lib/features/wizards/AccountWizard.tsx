"use client"

import { useTransition, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWizard } from "@/lib/domains/accounts/contexts/account-wizard"
import { submitNewAccount } from "@/lib/actions/accounts"
import { AccountTypeStep } from "./AccountTypeStep"
import { AccountSubtypeStep } from "./AccountSubtypeStep"
import { AddressStep } from "./AddressStep"
import { PersonalDetailsForm } from "@/components/forms/PersonalDetailsForm"
import { EntityDetailsForm } from "@/components/forms/EntityDetailsForm"
import { RetirementDetailsForm } from "@/components/forms/RetirementDetailsForm"
import { DocumentUploadStep } from "./DocumentUploadStep"
import { ReviewStep } from "./ReviewStep"
import { useToast } from "@/components/ui/use-toast"
import { newAccountSchema } from "@/lib/domains/accounts/schema"
import type { NewAccountFormData } from "@/lib/domains/accounts/schema"

const STEPS = [
  { title: "Basic Information", description: "Let's start with some basic information about the account" },
  { title: "Account Details", description: "Please provide detailed information based on the account type" },
  { title: "Address", description: "Please provide your address information" },
  { title: "Documents", description: "Upload required documents for account verification" },
  { title: "Review & Submit", description: "Review your information before submitting" }
]

export function AccountWizard() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { state, setStep, updateForm, setValid } = useWizard()
  const { currentStep, isValid, formData } = state
  const { toast } = useToast()

  const methods = useForm<NewAccountFormData>({
    defaultValues: {
      account_type: formData?.account_type || undefined,
      account_subtype: formData?.account_subtype || undefined,
      legal_name: formData?.legal_name || "",
      tax_id: formData?.tax_id || "",
      address: {
        street1: formData?.address?.street1 || "",
        street2: formData?.address?.street2 || "",
        city: formData?.address?.city || "",
        state: formData?.address?.state || "",
        postal_code: formData?.address?.postal_code || "",
        country: formData?.address?.country || ""
      },
      entity_details: {
        formation_date: formData?.entity_details?.formation_date || "",
        formation_state: formData?.entity_details?.formation_state || "",
        formation_country: formData?.entity_details?.formation_country || "",
        fiscal_year_end: formData?.entity_details?.fiscal_year_end || "",
        is_privately_held: formData?.entity_details?.is_privately_held || false,
        is_foreign: formData?.entity_details?.is_foreign || false,
        entity_specific_info: {
          trust: formData?.entity_details?.entity_specific_info?.trust || undefined
        }
      }
    },
    resolver: zodResolver(newAccountSchema),
    mode: "onChange"
  })

  // Sync form state with wizard context
  const handleFormChange = useCallback((value: any) => {
    console.log('Form Change:', { 
      oldValue: formData, 
      newValue: value,
      isDifferent: JSON.stringify(value) !== JSON.stringify(formData)
    })

    if (JSON.stringify(value) !== JSON.stringify(formData)) {
      updateForm(value as Partial<NewAccountFormData>)
      setValid(true) // Set valid when form changes
    }
  }, [formData, updateForm, setValid])

  useEffect(() => {
    const subscription = methods.watch(handleFormChange)
    return () => subscription.unsubscribe()
  }, [methods, handleFormChange])

  const validateCurrentStep = useCallback(() => {
    const values = methods.getValues()
    const formState = methods.formState
    console.log('Validating step:', { 
      currentStep, 
      values,
      formContext: state.formData,
      isValid: state.isValid,
      formErrors: formState.errors,
      isDirty: formState.isDirty,
      dirtyFields: formState.dirtyFields
    })

    let stepValid = false
    switch (currentStep) {
      case "type":
        stepValid = !!values.account_type
        break
      case "subtype":
        stepValid = !!values.account_subtype
        break
      case "address":
        stepValid = !!values.address?.street1 && !!values.address?.city && 
          !!values.address?.state && !!values.address?.postal_code && !!values.address?.country
        break
      case "details":
        if (values.account_type === "entity") {
          if (values.account_subtype === "trust") {
            stepValid = !!(
              values.legal_name &&
              values.tax_id &&
              values.entity_details?.formation_date &&
              values.entity_details?.formation_state &&
              values.entity_details?.formation_country &&
              values.entity_details?.fiscal_year_end &&
              values.address?.street1 &&
              values.address?.city &&
              values.address?.state &&
              values.address?.postal_code &&
              values.address?.country &&
              values.entity_details?.entity_specific_info?.trust?.trust_type &&
              values.entity_details?.entity_specific_info?.trust?.grantor_status &&
              values.entity_details?.entity_specific_info?.trust?.beneficiary
            )
          } else {
            stepValid = !!(
              values.legal_name &&
              values.tax_id &&
              values.entity_details?.formation_date &&
              values.entity_details?.formation_state &&
              values.entity_details?.formation_country &&
              values.entity_details?.fiscal_year_end &&
              values.address?.street1 &&
              values.address?.city &&
              values.address?.state &&
              values.address?.postal_code &&
              values.address?.country
            )
          }
        }
        console.log('Details validation:', {
          stepValid,
          accountType: values.account_type,
          accountSubtype: values.account_subtype,
          requiredFields: {
            legalName: !!values.legal_name,
            taxId: !!values.tax_id,
            formationDate: !!values.entity_details?.formation_date,
            formationState: !!values.entity_details?.formation_state,
            formationCountry: !!values.entity_details?.formation_country,
            fiscalYearEnd: !!values.entity_details?.fiscal_year_end,
            street1: !!values.address?.street1,
            city: !!values.address?.city,
            state: !!values.address?.state,
            postalCode: !!values.address?.postal_code,
            country: !!values.address?.country,
            ...(values.account_subtype === "trust" && {
              trustType: !!values.entity_details?.entity_specific_info?.trust?.trust_type,
              grantorStatus: !!values.entity_details?.entity_specific_info?.trust?.grantor_status,
              beneficiary: !!values.entity_details?.entity_specific_info?.trust?.beneficiary
            })
          }
        })
        break
      case "documents":
        stepValid = true
        break
      case "review":
        stepValid = true
        break
      default:
        stepValid = false
    }

    console.log('Step validation result:', { currentStep, stepValid })
    return stepValid
  }, [currentStep, methods, state])

  const handleNext = useCallback(() => {
    console.log('Next clicked:', { 
      currentStep, 
      formData: methods.getValues(),
      wizardState: state,
      formState: methods.formState
    })

    const isValid = validateCurrentStep()
    console.log('Step validation result:', { currentStep, isValid })

    if (!isValid) {
      console.log('Validation failed')
      toast({
        title: "Please complete all required fields",
        description: "All fields are required unless marked as optional",
        variant: "destructive"
      })
      return
    }

    console.log('Advancing to next step from:', currentStep)
    switch (currentStep) {
      case "type":
        setStep("subtype")
        break
      case "subtype":
        setStep("address")
        break
      case "address":
        setStep("details")
        break
      case "details":
        setStep("documents")
        break
      case "documents":
        setStep("review")
        break
      case "review":
        startTransition(async () => {
          const result = await submitNewAccount(formData as NewAccountFormData)
          if (result.success) {
            toast({
              title: "Success",
              description: "Account created successfully"
            })
            router.push("/accounts")
          } else {
            toast({
              variant: "destructive",
              title: "Error",
              description: result.error || "Failed to create account"
            })
          }
        })
        break
    }
  }, [currentStep, validateCurrentStep, setStep, toast, formData, startTransition, router, state, methods])

  const handleBack = useCallback(() => {
    switch (currentStep) {
      case "subtype":
        setStep("type")
        break
      case "address":
        setStep("subtype")
        break
      case "details":
        setStep("address")
        break
      case "documents":
        setStep("details")
        break
      case "review":
        setStep("documents")
        break
    }
  }, [currentStep, setStep])

  const getStepIndex = useCallback(() => {
    switch (currentStep) {
      case "type":
        return 0
      case "subtype":
        return 1
      case "address":
        return 2
      case "details":
        return 3
      case "documents":
        return 3
      case "review":
        return 4
      default:
        return 0
    }
  }, [currentStep])

  const stepIndex = getStepIndex()

  return (
    <FormProvider {...methods}>
      <div className="space-y-8 pb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Create New Account</CardTitle>
            <CardDescription>
              Step {stepIndex + 1} of {STEPS.length}: {STEPS[stepIndex].title}
            </CardDescription>
            <div className="mt-2">
              <div className="overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-2 w-full bg-primary transition-all"
                  style={{
                    transform: `translateX(-${100 - ((stepIndex + 1) / STEPS.length) * 100}%)`
                  }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {STEPS[stepIndex].description}
              </p>

              {currentStep === "type" && <AccountTypeStep />}
              {currentStep === "subtype" && <AccountSubtypeStep />}
              {currentStep === "address" && <AddressStep />}
              {currentStep === "details" && formData?.account_type === "personal" && <PersonalDetailsForm />}
              {currentStep === "details" && formData?.account_type === "entity" && <EntityDetailsForm />}
              {currentStep === "details" && formData?.account_type === "retirement" && <RetirementDetailsForm />}
              {currentStep === "documents" && <DocumentUploadStep />}
              {currentStep === "review" && <ReviewStep />}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === "type"}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button onClick={handleNext}>
                  {currentStep === "review" ? "Submit" : "Next"}
                  {currentStep !== "review" && (
                    <ChevronRight className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  )
}
