"use client"

import { Table } from "@tanstack/react-table"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Document } from "@/lib/domains/documents/types"

/**
 * Props for the DataTableToolbar component
 */
interface DataTableToolbarProps {
  /** The table instance from TanStack Table */
  table: Table<Document>
}

/**
 * DataTableToolbar component provides filtering and view options for the documents table
 * Includes:
 * - Text search for file names
 * - Document type filter from Airtable data
 * - Reset button for clearing filters
 * - View options button for column visibility
 */
export function DataTableToolbar({
  table,
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Get unique document types from the data
  const documentTypes = useMemo(() => {
    const types = new Set<string>();
    table.getFilteredRowModel().rows.forEach(row => {
      const docTypes = row.original.type;
      if (docTypes) {
        docTypes.forEach(type => types.add(type));
      }
    });
    return Array.from(types).map(type => ({
      label: type,
      value: type,
    }));
  }, [table.getFilteredRowModel().rows]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search files..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && documentTypes.length > 0 && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={documentTypes}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <Icons.cross className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9">
              <Icons.view className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" && column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 