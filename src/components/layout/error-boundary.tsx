"use client"

import { Component, ErrorInfo, ReactNode } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AUTH_ERRORS } from "@/lib/errors/auth"

interface Props {
  children?: ReactNode
  error?: string
}

interface State {
  hasError: boolean
  error: string | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: error.message || AUTH_ERRORS.UNKNOWN.message,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {this.state.error || this.props.error || AUTH_ERRORS.UNKNOWN.message}
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4"
            onClick={this.handleRetry}
          >
            Try again
          </Button>
        </Alert>
      )
    }

    return this.props.children
  }
}
