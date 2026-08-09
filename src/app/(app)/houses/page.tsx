import { Home, Plus } from "lucide-react";
import Link from "next/link";

import { PropertyCard } from "@/components/houses/property-card";
import { buttonVariants } from "@/components/ui/button";
import { getActiveProperties } from "@/lib/properties/queries";
import { cn } from "@/lib/utils";

export default async function HousesPage() {
  const activeProperties = await getActiveProperties();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Houses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Active properties ordered by priority and recent activity.
          </p>
        </div>
        <Link
          href="/houses/new"
          className={cn(buttonVariants(), "shrink-0")}
        >
          <Plus aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Add house</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {activeProperties.length > 0 ? (
        <section
          className="grid gap-4 lg:grid-cols-2"
          aria-label="Active properties"
        >
          {activeProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </section>
      ) : (
        <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Home aria-hidden="true" className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">
            No active houses yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add the first property you are considering. Only its name is
            required.
          </p>
          <Link
            href="/houses/new"
            className={cn(buttonVariants(), "mt-6")}
          >
            <Plus aria-hidden="true" className="size-4" />
            Add house
          </Link>
        </section>
      )}
    </div>
  );
}
