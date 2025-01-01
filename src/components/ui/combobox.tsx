"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/features/ui/utils/styles"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
  name?: string
}

export function Combobox({
  options = [],
  value,
  onValueChange,
  placeholder = "Select option...",
  emptyText = "No results found.",
  className,
  name,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const optionsRef = React.useRef<HTMLDivElement>(null)

  // Ensure options is always an array
  const safeOptions = React.useMemo(() => {
    return Array.isArray(options) ? options : []
  }, [options])

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    const term = searchTerm.toLowerCase()
    return safeOptions.filter(option => 
      option.label.toLowerCase().includes(term)
    )
  }, [safeOptions, searchTerm])

  // Find selected option
  const selectedOption = React.useMemo(() => {
    return safeOptions.find(option => option.value === value)
  }, [safeOptions, value])

  // Handle value change
  const handleValueChange = React.useCallback((newValue: string) => {
    onValueChange(newValue)
    setOpen(false)
    setSearchTerm("")
  }, [onValueChange])

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!open) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case "Enter":
        e.preventDefault()
        if (filteredOptions[highlightedIndex]) {
          handleValueChange(filteredOptions[highlightedIndex].value)
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        break
    }
  }, [open, filteredOptions, highlightedIndex, handleValueChange])

  // Reset highlighted index when filtered options change
  React.useEffect(() => {
    setHighlightedIndex(0)
  }, [filteredOptions])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            placeholder="Search..."
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            name={name}
          />
        </div>
        <div
          ref={optionsRef}
          className="max-h-[200px] overflow-y-auto"
          role="listbox"
          aria-label={placeholder}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors",
                  option.value === value && "bg-accent",
                  index === highlightedIndex && "bg-accent",
                  "hover:bg-accent focus:bg-accent"
                )}
                onClick={() => handleValueChange(option.value)}
                role="option"
                aria-selected={option.value === value}
                data-highlighted={index === highlightedIndex}
              >
                <Check
                  className={cn(
                    "absolute left-2 h-4 w-4",
                    option.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </div>
            ))
          ) : (
            <div className="relative flex select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none text-muted-foreground">
              {emptyText}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
