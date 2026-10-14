import { Skeleton, PropertyCardSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="page-container min-h-[65vh] py-12 md:py-16" aria-label="Loading page">
      <Skeleton className="h-3 w-36" />
      <Skeleton className="mt-5 h-12 w-[min(28rem,85vw)]" />
      <Skeleton className="mt-3 h-4 w-[min(34rem,90vw)]" />
      <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
      </div>
    </main>
  );
}
