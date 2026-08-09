import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  PROPERTY_PRIORITIES,
  PROPERTY_STATUSES,
} from "@/lib/properties/constants";
import type { PropertyFilters } from "@/lib/validation/property-filters";
import { cn } from "@/lib/utils";

const quickFilters = [
  { label: "All active", href: "/houses" },
  { label: "High priority", href: "/houses?quick=HIGH_PRIORITY" },
  { label: "Interested", href: "/houses?quick=INTERESTED" },
  { label: "To view", href: "/houses?quick=TO_VIEW" },
  { label: "Viewed", href: "/houses?quick=VIEWED" },
  { label: "Rejected", href: "/houses?quick=REJECTED" },
] as const;

function readableEnum(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export function PropertyFilters({ filters }: { filters: PropertyFilters }) {
  const hasDetailedFilters = Boolean(
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
    <div className="space-y-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {quickFilters.map((filter, index) => {
          const active =
            index === 0
              ? !filters.quick && !filters.status
              : filter.href.includes(`quick=${filters.quick}`);

          return (
            <Link
              key={filter.label}
              href={filter.href}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted",
              )}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <form
        action="/houses"
        className="rounded-xl border bg-card p-4"
        method="get"
      >
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_auto]">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"
            />
            <Input
              className="pl-9"
              type="search"
              name="q"
              defaultValue={filters.q}
              placeholder="Search houses, places, agents or phone…"
              aria-label="Search properties"
            />
          </div>
          <Select
            name="sort"
            defaultValue={filters.sort}
            aria-label="Sort properties"
          >
            <option value="priority">Priority</option>
            <option value="recent">Recently added</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
            <option value="area">Living area</option>
            <option value="viewing">Upcoming viewing</option>
          </Select>
          <button className={buttonVariants()} type="submit">
            Apply
          </button>
        </div>

        <details className="mt-4" open={hasDetailedFilters}>
          <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-sm font-medium">
            <SlidersHorizontal aria-hidden="true" className="size-4" />
            More filters
          </summary>
          <div className="grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select
                id="filter-status"
                name="status"
                defaultValue={filters.status ?? ""}
              >
                <option value="">All active</option>
                {PROPERTY_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {readableEnum(status)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-priority">Priority</Label>
              <Select
                id="filter-priority"
                name="priority"
                defaultValue={filters.priority ?? ""}
              >
                <option value="">Any priority</option>
                {PROPERTY_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {readableEnum(priority)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-min-price">Minimum price (€)</Label>
              <Input
                id="filter-min-price"
                name="minPrice"
                inputMode="decimal"
                defaultValue={filters.minPrice}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-max-price">Maximum price (€)</Label>
              <Input
                id="filter-max-price"
                name="maxPrice"
                inputMode="decimal"
                defaultValue={filters.maxPrice}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-min-area">
                Minimum living area (m²)
              </Label>
              <Input
                id="filter-min-area"
                name="minArea"
                inputMode="decimal"
                defaultValue={filters.minArea}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-location">Location</Label>
              <Input
                id="filter-location"
                name="location"
                defaultValue={filters.location}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-agency">Agency</Label>
              <Input
                id="filter-agency"
                name="agency"
                defaultValue={filters.agency}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-viewing">Viewing</Label>
              <Select
                id="filter-viewing"
                name="viewing"
                defaultValue={filters.viewing ?? ""}
              >
                <option value="">Any</option>
                <option value="true">Scheduled</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-furnished">Furnished</Label>
              <Select
                id="filter-furnished"
                name="furnished"
                defaultValue={filters.furnished ?? ""}
              >
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-new-construction">
                New construction
              </Label>
              <Select
                id="filter-new-construction"
                name="newConstruction"
                defaultValue={filters.newConstruction ?? ""}
              >
                <option value="">Any</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Select>
            </div>
          </div>
        </details>

        {filters.q || filters.quick || hasDetailedFilters ? (
          <div className="mt-4 flex justify-end border-t pt-3">
            <Link
              href="/houses"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-muted-foreground",
              )}
            >
              <X aria-hidden="true" className="size-4" />
              Clear filters
            </Link>
          </div>
        ) : null}
      </form>
    </div>
  );
}
