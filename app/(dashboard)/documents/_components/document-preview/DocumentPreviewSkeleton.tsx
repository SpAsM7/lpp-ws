import { Skeleton } from '@/components/ui/skeleton';

export function DocumentPreviewSkeleton() {
  return (
    <div className="flex h-full w-full flex-col space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[250px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
      <Skeleton className="h-[calc(100vh-200px)] w-full" />
    </div>
  );
} 