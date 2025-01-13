import { Skeleton } from '@/components/ui/skeleton';

export function DocumentSearchSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Search bar */}
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      {/* Results count */}
      <Skeleton className="h-6 w-[200px]" />
    </div>
  );
} 