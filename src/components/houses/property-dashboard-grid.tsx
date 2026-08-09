"use client";

import { Scale, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PropertyCard } from "@/components/houses/property-card";
import { buttonVariants, Button } from "@/components/ui/button";
import type { Property } from "@/lib/properties/types";
import { cn } from "@/lib/utils";

export function PropertyDashboardGrid({
  properties,
  currentTime,
}: {
  properties: Property[];
  currentTime: string;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function setSelected(id: string, selected: boolean) {
    setSelectedIds((current) => {
      if (selected) {
        return current.includes(id) || current.length >= 4
          ? current
          : [...current, id];
      }

      return current.filter((selectedId) => selectedId !== id);
    });
  }

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-2" aria-label="Properties">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            selectedForComparison={selectedIds.includes(property.id)}
            comparisonSelectionDisabled={selectedIds.length >= 4}
            onComparisonSelectionChange={(selected) =>
              setSelected(property.id, selected)
            }
            currentTime={currentTime}
          />
        ))}
      </section>

      {selectedIds.length > 0 ? (
        <div className="fixed inset-x-4 bottom-20 z-40 mx-auto flex max-w-md items-center gap-3 rounded-xl border bg-background/95 p-3 shadow-xl backdrop-blur md:bottom-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {selectedIds.length} of 4 selected
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Select at least two properties to compare.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setSelectedIds([])}
            aria-label="Clear comparison selection"
          >
            <X aria-hidden="true" className="size-4" />
          </Button>
          {selectedIds.length >= 2 ? (
            <Link
              href={`/compare?ids=${selectedIds.join(",")}`}
              className={cn(buttonVariants(), "shrink-0")}
            >
              <Scale aria-hidden="true" className="size-4" />
              Compare
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
