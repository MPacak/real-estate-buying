import { CalendarClock, Plus } from "lucide-react";
import Link from "next/link";

import { PropertyCard } from "@/components/houses/property-card";
import { buttonVariants } from "@/components/ui/button";
import { getUpcomingViewingProperties } from "@/lib/properties/queries";
import { cn } from "@/lib/utils";

export default async function ViewingsPage() {
  const currentTime = new Date();
  const properties = await getUpcomingViewingProperties(currentTime);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Upcoming viewings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Scheduled viewings ordered by the next upcoming date.
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

      {properties.length > 0 ? (
        <section
          className="grid gap-4 lg:grid-cols-2"
          aria-label="Upcoming property viewings"
        >
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              currentTime={currentTime.toISOString()}
            />
          ))}
        </section>
      ) : (
        <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-12 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <CalendarClock aria-hidden="true" className="size-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">
            No upcoming viewings
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add a future viewing date while editing an interested property.
          </p>
          <Link
            href="/houses"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-6",
            )}
          >
            Browse houses
          </Link>
        </section>
      )}
    </div>
  );
}
