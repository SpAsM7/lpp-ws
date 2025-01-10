"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-64 border-r">
        <div className="h-16 border-b px-4 flex items-center">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-4 w-24 ml-4" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex-1">
        <div className="h-16 border-b px-4 flex items-center">
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="p-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

// Dynamically import MainSidebar with SSR disabled
const MainSidebar = dynamic(() => import("./main-sidebar"), {
  ssr: false,
  loading: DashboardSkeleton,
})

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <DashboardSkeleton />
  }

  return <MainSidebar>{children}</MainSidebar>
}
