export default function ViewingsLoading() {
  return (
    <div className="space-y-6" aria-label="Loading upcoming viewings">
      <div className="space-y-2">
        <div className="h-8 w-52 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="h-80 animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
    </div>
  );
}
