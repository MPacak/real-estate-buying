import { Home, Plus } from "lucide-react";
import Link from "next/link";

import { PropertyDashboardGrid } from "@/components/houses/property-dashboard-grid";
import { PropertyFilters } from "@/components/houses/property-filters";
import { buttonVariants } from "@/components/ui/button";
import { getProperties } from "@/lib/properties/queries";
import {
  parsePropertyFilters,
  type PropertySearchParams,
} from "@/lib/validation/property-filters";
import { cn } from "@/lib/utils";

type HousesPageProps = {
  searchParams: Promise<PropertySearchParams>;
};

export default async function HousesPage({ searchParams }: HousesPageProps) {
  const filters = parsePropertyFilters(await searchParams);
  const matchingProperties = await getProperties(filters);
  const hasFilters = Boolean(
    filters.q ||
      filters.quick ||
      filters.status ||
      filters.priority ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.minArea ||
      filters.location ||
      filters.agency ||
      filters.viewing ||
      filters.furnished ||
      filters.newConstruction,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Houses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find the properties that currently deserve your attention.
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

      <PropertyFilters filters={filters} />

      {matchingProperties.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {matchingProperties.length}{" "}
            {matchingProperties.length === 1 ? "property" : "properties"}
          </p>
          <PropertyDashboardGrid properties={matchingProperties} />
        </div>
      ) : (
        <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Home aria-hidden="true" className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">
            {hasFilters ? "No matching houses" : "No active houses yet"}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {hasFilters
              ? "Try changing or clearing the current filters."
              : "Add the first property you are considering. Only its name is required."}
          </p>
          {hasFilters ? (
            <Link
              href="/houses"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-6",
              )}
            >
              Clear filters
            </Link>
          ) : (
            <Link
              href="/houses/new"
              className={cn(buttonVariants(), "mt-6")}
            >
              <Plus aria-hidden="true" className="size-4" />
              Add house
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
