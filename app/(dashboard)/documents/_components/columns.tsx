"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"

/**
 * Represents a document in the documents table
 * @interface Document
 */
export interface Document {
  /** Unique identifier for the document */
  id: string
  /** Name of the document file */
  file: string
  /** Description of the document's contents */
  description: string
  /** Type of investment the document is related to */
  investment: string
  /** Account associated with the document */
  account: string
  /** Type of document */
  type: "Report" | "Prospectus" | "Statement"
  /** Date the document was created/uploaded */
  date: string
}

/**
 * Column definitions for the documents table
 * Includes sorting, filtering, and custom cell rendering
 */
export const columns: ColumnDef<Document>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-4 flex items-center h-full">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 flex items-center h-full">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "file",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            File
            <Icons.arrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("file")}
          </span>
        </div>
      )
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Description
            <Icons.arrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{row.original.type}</Badge>
          <span className="max-w-[500px] truncate">
            {row.getValue("description")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "investment",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Investment
            <Icons.arrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="max-w-[500px] truncate">
            {row.getValue("investment")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "account",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Account
            <Icons.arrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="max-w-[500px] truncate">
            {row.getValue("account")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Type
            <Icons.arrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="max-w-[500px] truncate">
            {row.getValue("type")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Date
            <Icons.arrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="max-w-[500px] truncate">
            {new Date(row.getValue("date")).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Icons.pinBottom className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      )
    },
  },
] 