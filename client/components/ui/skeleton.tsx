import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-sm bg-[#eceeea]', className)} />;
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden border border-line bg-white">
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-3 p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>
    </div>
  );
}
