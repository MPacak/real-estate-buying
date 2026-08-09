import { Construction } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NewHousePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add house</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quickly save a property from a listing.
        </p>
      </div>

      <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
        <Construction
          aria-hidden="true"
          className="size-10 text-muted-foreground"
        />
        <h2 className="mt-4 text-lg font-semibold">
          Property entry is coming next
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          This phase establishes the secure application shell. The reusable
          property form will be added with property CRUD.
        </p>
        <Link
          href="/houses"
          className={buttonVariants({ variant: "outline", className: "mt-6" })}
        >
          Back to houses
        </Link>
      </section>
    </div>
  );
}
