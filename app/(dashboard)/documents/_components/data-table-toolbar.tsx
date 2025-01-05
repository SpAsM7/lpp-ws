"use client"

import { Table } from "@tanstack/react-table"

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

/**
 * Props for the DataTableToolbar component
 */
interface DataTableToolbarProps<TData> {
  /** The table instance from TanStack Table */
  table: Table<TData>
}

/**
 * DataTableToolbar component provides filtering and view options for the documents table
 * Includes:
 * - Text search for file names
 * - Faceted filters for investment, account, and document types
 * - Reset button for clearing filters
 * - View options button for column visibility
 */
export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search files..."
          value={(table.getColumn("file")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("file")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("investment") && (
          <DataTableFacetedFilter
            column={table.getColumn("investment")}
            title="Investment"
            options={[
              { value: "Stocks", label: "Stocks" },
              { value: "Real Estate", label: "Real Estate" },
              { value: "Bonds", label: "Bonds" },
              { value: "Cryptocurrency", label: "Cryptocurrency" },
            ]}
          />
        )}
        {table.getColumn("account") && (
          <DataTableFacetedFilter
            column={table.getColumn("account")}
            title="Account"
            options={[
              { value: "Personal", label: "Personal" },
              { value: "Joint", label: "Joint" },
              { value: "IRA", label: "IRA" },
              { value: "401(k)", label: "401(k)" },
            ]}
          />
        )}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={[
              { value: "Report", label: "Report" },
              { value: "Prospectus", label: "Prospectus" },
              { value: "Statement", label: "Statement" },
            ]}
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