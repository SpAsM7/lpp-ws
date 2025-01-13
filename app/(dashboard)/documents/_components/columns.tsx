"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { Checkbox } from "@/components/ui/checkbox"
import type { Document } from "@/lib/domains/documents/types"
import { format } from "date-fns"

export type { Document }

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
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Title
            <Icons.arrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "fileName",
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            File Name
            <Icons.arrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const type = row.original.type?.[0] || 'Unknown';
      return (
        <div className="flex items-center gap-2">
          <Badge variant="outline">{type}</Badge>
          <span className="max-w-[500px] truncate">
            {row.getValue("fileName")}
          </span>
        </div>
      )
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
            {row.original.type?.[0] || 'Unknown'}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const type = row.original.type?.[0];
      return type ? value.includes(type) : false;
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
      const date = row.getValue("date") as string | null;
      return (
        <div className="flex items-center">
          <span className="max-w-[500px] truncate">
            {date ? format(new Date(date), 'PP') : 'No date'}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const documentUrl = row.original.documentUrl;
      return (
        <div className="flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            disabled={!documentUrl}
            onClick={() => documentUrl && window.open(documentUrl, '_blank')}
          >
            <Icons.pinBottom className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      )
    },
  },
] 