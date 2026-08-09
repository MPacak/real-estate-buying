function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="space-y-5 p-5">
        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-16 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          <div className="h-4 w-2/5 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-14 animate-pulse border-t bg-muted/50" />
    </div>
  );
}

export default function HousesLoading() {
  return (
    <div className="space-y-6" aria-label="Loading houses">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-8 w-28 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-11 w-28 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
        <PropertyCardSkeleton />
      </div>
    </div>
  );
}
