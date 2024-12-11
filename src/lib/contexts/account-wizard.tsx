"use client"

import { createContext, useContext, useReducer, ReactNode, useCallback } from "react"
import { newAccountSchema } from "@/lib/schemas/account"
import type { NewAccountFormData } from "@/lib/schemas/account"

type WizardStep = 
  | "type"
  | "subtype"
  | "details"
  | "documents"
  | "review"

interface WizardState {
  currentStep: WizardStep
  formData: Partial<NewAccountFormData>
  isValid: boolean
  isLoading: boolean
  error: string | null
}

type WizardAction = 
  | { type: "SET_STEP"; payload: WizardStep }
  | { type: "UPDATE_FORM"; payload: Partial<NewAccountFormData> }
  | { type: "SET_VALID"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" }

const initialState: WizardState = {
  currentStep: "type",
  formData: {},
  isValid: false,
  isLoading: false,
  error: null
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_STEP":
      if (state.currentStep === action.payload) return state
      return { ...state, currentStep: action.payload, error: null }
    case "UPDATE_FORM":
      if (JSON.stringify(state.formData) === JSON.stringify(action.payload)) return state
      return { 
        ...state, 
        formData: { 
          ...state.formData, 
          ...action.payload 
        },
        error: null
      }
    case "SET_VALID":
      if (state.isValid === action.payload) return state
      return { ...state, isValid: action.payload }
    case "SET_LOADING":
      if (state.isLoading === action.payload) return state
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      if (state.error === action.payload) return state
      return { ...state, error: action.payload, isLoading: false }
    case "RESET":
      if (JSON.stringify(state) === JSON.stringify(initialState)) return state
      return initialState
    default:
      return state
  }
}

interface WizardContextType {
  state: WizardState
  setStep: (step: WizardStep) => void
  updateForm: (data: Partial<NewAccountFormData>) => void
  setValid: (valid: boolean) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
  validateStep: () => boolean
}

const WizardContext = createContext<WizardContextType | undefined>(undefined)

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState)

  const validateStep = useCallback(() => {
    try {
      const { currentStep, formData } = state

      // Validate based on current step
      switch (currentStep) {
        case "type":
          if (!formData.account_type) {
            dispatch({ type: "SET_ERROR", payload: "Please select an account type" })
            return false
          }
          break
        case "subtype":
          if (!formData.account_subtype) {
            dispatch({ type: "SET_ERROR", payload: "Please select an account subtype" })
            return false
          }
          break
        case "details":
          // Validate required fields based on account type
          const result = newAccountSchema.safeParse(formData)
          if (!result.success) {
            dispatch({ type: "SET_ERROR", payload: "Please fill in all required fields" })
            return false
          }
          break
        case "documents":
          // Check if required documents are uploaded
          if (!formData.documents || Object.keys(formData.documents).length === 0) {
            dispatch({ type: "SET_ERROR", payload: "Please upload required documents" })
            return false
          }
          break
      }

      dispatch({ type: "SET_ERROR", payload: null })
      return true
    } catch (error) {
      dispatch({ 
        type: "SET_ERROR", 
        payload: error instanceof Error ? error.message : "Validation failed" 
      })
      return false
    }
  }, [state])

  const value = {
    state,
    setStep: useCallback((step: WizardStep) => {
      dispatch({ type: "SET_STEP", payload: step })
    }, []),
    updateForm: useCallback((data: Partial<NewAccountFormData>) => {
      dispatch({ type: "UPDATE_FORM", payload: data })
    }, []),
    setValid: useCallback((valid: boolean) => {
      dispatch({ type: "SET_VALID", payload: valid })
    }, []),
    setLoading: useCallback((loading: boolean) => {
      dispatch({ type: "SET_LOADING", payload: loading })
    }, []),
    setError: useCallback((error: string | null) => {
      dispatch({ type: "SET_ERROR", payload: error })
    }, []),
    reset: useCallback(() => {
      dispatch({ type: "RESET" })
    }, []),
    validateStep
  }

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider")
  }
  return context
}
