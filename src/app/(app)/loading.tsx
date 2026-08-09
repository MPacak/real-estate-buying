export default function AppLoading() {
  return (
    <div className="space-y-6" aria-label="Loading">
      <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
      <div className="h-72 animate-pulse rounded-xl border bg-card" />
    </div>
  );
}
