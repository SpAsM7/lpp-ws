"use client"

/**
 * This component provides a faceted filter dropdown for the documents table
 * It allows users to filter table data by selecting multiple values from a list of options
 * Features include:
 * - Multi-select functionality
 * - Badge display for selected items
 * - Clear filters option
 * - Faceted counts display
 * 
 * @module DocumentsTable
 */

import * as React from "react"
import { Column } from "@tanstack/react-table"

import { cn } from "@/lib/features/ui/utils/styles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

/**
 * Props for the DataTableFacetedFilter component
 */
interface DataTableFacetedFilterProps<TData, TValue> {
  /** The table column to filter */
  column?: Column<TData, TValue>
  /** The title of the filter */
  title?: string
  /** The available filter options */
  options: {
    /** The display label for the option */
    label: string
    /** The value to use for filtering */
    value: string
    /** Optional icon component to display next to the option */
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

/**
 * A faceted filter component for data tables that supports multi-select filtering
 */
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])
  const [open, setOpen] = React.useState(false)

  /**
   * Handles the selection/deselection of filter options
   * @param value - The value to toggle in the filter
   */
  const handleSelect = React.useCallback(
    (value: string) => {
      const filterValues = Array.from(selectedValues)
      const index = filterValues.indexOf(value)
      
      if (index !== -1) {
        filterValues.splice(index, 1)
      } else {
        filterValues.push(value)
      }
      
      column?.setFilterValue(filterValues.length ? filterValues : undefined)
    },
    [column, selectedValues]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Icons.plusCircle className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <div
                    key={option.value}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleSelect(option.value)
                    }}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Icons.check className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </div>
                )
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  column?.setFilterValue(undefined)
                  setOpen(false)
                }}
                className="relative flex cursor-pointer select-none items-center justify-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                Clear filters
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
