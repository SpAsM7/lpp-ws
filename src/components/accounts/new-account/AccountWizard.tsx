"use client"

import { useTransition, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWizard } from "@/lib/contexts/account-wizard"
import { submitNewAccount } from "@/lib/actions/accounts"
import { AccountTypeStep } from "./AccountTypeStep"
import { AccountSubtypeStep } from "./AccountSubtypeStep"
import { PersonalDetailsForm } from "./PersonalDetailsForm"
import { EntityDetailsForm } from "./EntityDetailsForm"
import { RetirementDetailsForm } from "./RetirementDetailsForm"
import { DocumentUploadStep } from "./DocumentUploadStep"
import { ReviewStep } from "./ReviewStep"
import { useToast } from "@/hooks/use-toast"
import { newAccountSchema } from "@/lib/schemas/account"
import type { NewAccountFormData } from "@/lib/schemas/account"

const STEPS = [
  { title: "Basic Information", description: "Let's start with some basic information about the account" },
  { title: "Account Details", description: "Please provide detailed information based on the account type" },
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
    defaultValues: formData,
    resolver: zodResolver(newAccountSchema),
    mode: "onChange"
  })

  // Sync form state with wizard context
  const handleFormChange = useCallback((value: any) => {
    if (JSON.stringify(value) !== JSON.stringify(formData)) {
      updateForm(value as Partial<NewAccountFormData>)
    }
  }, [formData, updateForm])

  useEffect(() => {
    const subscription = methods.watch(handleFormChange)
    return () => subscription.unsubscribe()
  }, [methods, handleFormChange])

  // Update validation state
  const handleValidationChange = useCallback((isFormValid: boolean) => {
    if (isFormValid !== isValid) {
      setValid(isFormValid)
    }
  }, [isValid, setValid])

  useEffect(() => {
    const subscription = methods.watch(() => {
      handleValidationChange(methods.formState.isValid)
    })
    return () => subscription.unsubscribe()
  }, [methods, handleValidationChange])

  const stepIndex = (() => {
    switch (currentStep) {
      case "type":
      case "subtype":
        return 0
      case "details":
        return 1
      case "documents":
        return 2
      case "review":
        return 3
      default:
        return 0
    }
  })()

  const handleNext = async () => {
    if (currentStep === "review") {
      startTransition(async () => {
        // Cast formData to NewAccountFormData since we've validated it through the wizard steps
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
      return
    }

    switch (currentStep) {
      case "type":
        setStep("subtype")
        break
      case "subtype":
        setStep("details")
        break
      case "details":
        setStep("documents")
        break
      case "documents":
        setStep("review")
        break
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case "subtype":
        setStep("type")
        break
      case "details":
        setStep("subtype")
        break
      case "documents":
        setStep("details")
        break
      case "review":
        setStep("documents")
        break
    }
  }

  const renderDetailsStep = () => {
    switch (formData.account_type) {
      case "personal":
        return <PersonalDetailsForm />
      case "entity":
        return <EntityDetailsForm />
      case "retirement":
        return <RetirementDetailsForm />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Create New Account</h1>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Step {stepIndex + 1} of {STEPS.length}:</span>
              <span className="text-zinc-600">{STEPS[stepIndex].title}</span>
            </div>
            <div className="flex items-center space-x-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === stepIndex
                      ? "bg-zinc-900"
                      : i < stepIndex
                      ? "bg-zinc-600"
                      : "bg-zinc-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-zinc-900 transition-all duration-300"
              style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <Card>
          <CardHeader>
            <CardTitle>{STEPS[stepIndex].title}</CardTitle>
            <CardDescription>{STEPS[stepIndex].description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px]">
              {currentStep === "type" && <AccountTypeStep />}
              {currentStep === "subtype" && <AccountSubtypeStep />}
              {currentStep === "details" && renderDetailsStep()}
              {currentStep === "documents" && <DocumentUploadStep />}
              {currentStep === "review" && <ReviewStep />}
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === "type"}
                className="flex items-center"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isValid || isPending}
                className="flex items-center"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Submitting...
                  </div>
                ) : currentStep === "review" ? (
                  "Submit"
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  )
}
