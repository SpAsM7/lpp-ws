"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-64 border-r">
        <div className="h-16 border-b px-4 flex items-center">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
      <div className="flex-1">
        <div className="h-16 border-b px-4 flex items-center">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Sidebar = dynamic(
  () => import("@/components/main-sidebar").then(mod => ({ default: mod.Sidebar })),
  {
    ssr: false,
    loading: () => <DashboardSkeleton />
  }
);

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <DashboardSkeleton />
  }

  return (
    <div suppressHydrationWarning>
      <Sidebar>{children}</Sidebar>
    </div>
  );
}
