"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTableToolbar } from "./data-table-toolbar"
import { Document, columns } from "./columns"
import { TableSkeleton } from "@/components/loading/table-skeleton"
import { Icons } from "@/components/icons"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Mock data for development
const documents: Document[] = [
  {
    id: "1",
    file: "Q4 Financial Report.pdf",
    description: "Quarterly financial report for Q4 2023",
    investment: "Stocks",
    account: "Personal",
    type: "Report",
    date: "2023-12-31",
  },
  {
    id: "2",
    file: "Investment Prospectus.docx",
    description: "Prospectus for new real estate investment opportunity",
    investment: "Real Estate",
    account: "Joint",
    type: "Prospectus",
    date: "2024-01-15",
  },
  {
    id: "3",
    file: "Tax Statement 2023.pdf",
    description: "Annual tax statement for 2023",
    investment: "Bonds",
    account: "IRA",
    type: "Statement",
    date: "2024-02-28",
  },
  {
    id: "4",
    file: "Portfolio Summary.xlsx",
    description: "Monthly portfolio performance summary",
    investment: "Stocks",
    account: "401(k)",
    type: "Report",
    date: "2024-03-01",
  },
  {
    id: "5",
    file: "Risk Assessment Report.pdf",
    description: "Annual risk assessment for cryptocurrency investments",
    investment: "Cryptocurrency",
    account: "Personal",
    type: "Report",
    date: "2024-03-15",
  },
]

/**
 * DocumentsTable component displays a list of documents with sorting, filtering, and pagination
 * Based on the shadcn tasks example but customized for our document management needs
 * 
 * Features:
 * - Row selection with checkboxes
 * - Sorting on all columns
 * - Filtering by file name and faceted filters
 * - Pagination with previous/next
 * - Loading states and error handling
 */
export function DocumentsTable() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    type: false,
  })
  const [rowSelection, setRowSelection] = React.useState({})

  // Initialize table with TanStack Table
  const table = useReactTable({
    data: documents,
    columns,
    enableRowSelection: true,
    enableColumnFilters: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
      columnVisibility: {
        type: false,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Error handling for table operations
  const handleTableOperation = React.useCallback(async (operation: () => Promise<void>) => {
    try {
      setLoading(true)
      setError(null)
      await operation()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  if (loading) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4 text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div className="py-4">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No documents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <Icons.chevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <Icons.chevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <Icons.chevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <Icons.chevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
