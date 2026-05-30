import { Skeleton } from "@/components/ui/skeleton";

export function LoadingDomainCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="size-13 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-3.5 w-full" />
      <Skeleton className="mt-2 h-3.5 w-4/5" />
      <div className="mt-4 flex gap-2 border-t border-border/60 pt-3">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="ml-auto h-8 w-28" />
      </div>
    </div>
  );
}

export function LoadingDomainGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingDomainCard key={i} />
      ))}
    </div>
  );
}
