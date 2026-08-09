import { Scale } from "lucide-react";

export default function ComparePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Compare</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review shortlisted properties side by side.
        </p>
      </div>

      <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
        <Scale aria-hidden="true" className="size-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Nothing to compare yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Comparison becomes available after properties can be selected from
          the dashboard.
        </p>
      </section>
    </div>
  );
}
