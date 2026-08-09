import { Home, Plus } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HousesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Houses</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Properties that currently deserve your attention will appear here.
        </p>
      </div>

      <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Home aria-hidden="true" className="size-7" />
        </span>
        <h2 className="mt-4 text-lg font-semibold">No houses yet</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          The application foundation is ready. Property entry is implemented in
          the property CRUD phase.
        </p>
        <Link
          href="/houses/new"
          className={cn(buttonVariants(), "mt-6")}
        >
          <Plus aria-hidden="true" className="size-4" />
          Add house
        </Link>
      </section>
    </div>
  );
}
