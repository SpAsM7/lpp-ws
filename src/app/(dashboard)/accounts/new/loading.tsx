import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NewAccountLoading() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-2 w-2 rounded-full" />
                ))}
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Form content */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-8 w-8" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </Card>
    </div>
  )
}
