import { Skeleton } from "@/components/ui/skeleton"

export function AuthLoading() {
  return (
    <div className="flex flex-col space-y-6">
      {/* Form skeleton */}
      <div className="space-y-4">
        {/* Input field skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" /> {/* Label */}
          <Skeleton className="h-10 w-full" /> {/* Input */}
        </div>

        {/* Error message skeleton (optional) */}
        <Skeleton className="h-4 w-3/4" />

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full mt-6" />
      </div>

      {/* Additional info skeleton */}
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-3/4 mx-auto" />
      </div>
    </div>
  )
}
