"use client"

import { createContext, useContext, useReducer, useCallback } from "react"
import type { NewAccountFormData } from "@/lib/domains/accounts/schema"

type Step = "type" | "subtype" | "address" | "details" | "documents" | "review"

interface WizardState {
  currentStep: Step
  isValid: boolean
  formData: Partial<NewAccountFormData>
}

type Action =
  | { type: "SET_STEP"; payload: Step }
  | { type: "SET_VALID"; payload: boolean }
  | { type: "UPDATE_FORM"; payload: Partial<NewAccountFormData> }

const initialState: WizardState = {
  currentStep: "type",
  isValid: false,
  formData: {}
}

function reducer(state: WizardState, action: Action): WizardState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload }
    case "SET_VALID":
      return { ...state, isValid: action.payload }
    case "UPDATE_FORM":
      return {
        ...state,
        formData: { ...state.formData, ...action.payload }
      }
    default:
      return state
  }
}

const WizardContext = createContext<{
  state: WizardState
  setStep: (step: Step) => void
  setValid: (valid: boolean) => void
  updateForm: (data: Partial<NewAccountFormData>) => void
} | null>(null)

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setStep = useCallback((step: Step) => {
    dispatch({ type: "SET_STEP", payload: step })
  }, [])

  const setValid = useCallback((valid: boolean) => {
    dispatch({ type: "SET_VALID", payload: valid })
  }, [])

  const updateForm = useCallback((data: Partial<NewAccountFormData>) => {
    dispatch({ type: "UPDATE_FORM", payload: data })
  }, [])

  return (
    <WizardContext.Provider value={{ state, setStep, setValid, updateForm }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return context
} 