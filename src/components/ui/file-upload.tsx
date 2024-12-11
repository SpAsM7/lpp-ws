"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Card } from "@/components/ui/card"

export function FileUpload({
  onFileSelect,
  accept = "application/pdf,image/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  label,
  description,
  uploading = false,
  error,
  success = false,
  className,
  ...props
}: FileUploadProps) {
  const [isDragActive, setIsDragActive] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file && file.size <= maxSize && isFileTypeAccepted(file, accept)) {
      onFileSelect(file)
    }
  }, [maxSize, accept, onFileSelect])

  const handleFileInput = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size <= maxSize && isFileTypeAccepted(file, accept)) {
      onFileSelect(file)
    }
  }, [maxSize, accept, onFileSelect])

  return (
    <Card
      className={cn(
        "relative p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
        isDragActive && "border-primary bg-primary/5",
        error && "border-destructive",
        success && "border-green-500",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInput}
        accept={accept}
        {...props}
      />

      <div className="flex flex-col items-center justify-center space-y-2 text-center p-4">
        {uploading ? (
          <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <Icons.upload className="h-8 w-8 text-muted-foreground" />
        )}
        
        {label && <div className="font-medium">{label}</div>}
        
        {description && (
          <div className="text-sm text-muted-foreground">{description}</div>
        )}

        {error && (
          <div className="text-sm text-destructive flex items-center">
            <Icons.warning className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-500 flex items-center">
            <Icons.check className="h-4 w-4 mr-1" />
            File uploaded successfully
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Select File"}
        </Button>
      </div>
    </Card>
  )
}

function isFileTypeAccepted(file: File, accept: string): boolean {
  const acceptedTypes = accept.split(",").map(type => type.trim())
  return acceptedTypes.some(type => {
    if (type === "*" || type === "*/*") return true
    if (type.endsWith("/*")) {
      const mainType = type.split("/")[0]
      return file.type.startsWith(mainType)
    }
    return file.type === type
  })
}

// Interfaces
interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect: (file: File) => void
  accept?: string
  maxSize?: number
  label?: string
  description?: string
  uploading?: boolean
  error?: string
  success?: boolean
  className?: string
}
