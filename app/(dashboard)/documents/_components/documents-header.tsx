"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DocumentsHeader() {
  return (
    <div className="flex items-center justify-between space-x-4">
      <div className="flex flex-1 items-center space-x-4">
        <Input
          placeholder="Filter files..."
          className="h-9 w-[150px] lg:w-[250px]"
        />
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Investment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Investments</SelectItem>
            <SelectItem value="stocks">Stocks</SelectItem>
            <SelectItem value="real-estate">Real Estate</SelectItem>
            <SelectItem value="bonds">Bonds</SelectItem>
            <SelectItem value="crypto">Cryptocurrency</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="joint">Joint</SelectItem>
            <SelectItem value="ira">IRA</SelectItem>
            <SelectItem value="401k">401(k)</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="report">Report</SelectItem>
            <SelectItem value="prospectus">Prospectus</SelectItem>
            <SelectItem value="statement">Statement</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" className="h-9">
          View
        </Button>
      </div>
    </div>
  )
} 