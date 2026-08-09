"use client";

import {
  CalendarClock,
  ExternalLink,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { PropertyPriority } from "@/components/houses/property-priority";
import { PropertyStatus } from "@/components/houses/property-status";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { calculatePropertyCosts } from "@/lib/calculations/property-costs";
import { formatCurrency } from "@/lib/formatting/currency";
import { formatArea, formatDateTime } from "@/lib/formatting/property";
import type { Property } from "@/lib/properties/types";
import { cn } from "@/lib/utils";

type PropertyCardProps = {
  property: Property;
  selectedForComparison?: boolean;
  comparisonSelectionDisabled?: boolean;
  onComparisonSelectionChange?: (selected: boolean) => void;
  currentTime?: string;
};

export function PropertyCard({
  property,
  selectedForComparison = false,
  comparisonSelectionDisabled = false,
  onComparisonSelectionChange,
  currentTime,
}: PropertyCardProps) {
  const phoneHref = property.agentPhone
    ? `tel:${property.agentPhone.replace(/[^\d+]/g, "")}`
    : null;
  const hasContact = Boolean(
    property.agencyName || property.agentName || property.agentPhone,
  );
  const currentTimestamp = currentTime
    ? new Date(currentTime).getTime()
    : Number.NEGATIVE_INFINITY;
  const upcomingViewings = [
    { label: "Viewing 1", value: property.viewingAt },
    { label: "Viewing 2", value: property.secondViewingAt },
  ]
    .filter(
      (viewing): viewing is { label: string; value: Date } =>
        Boolean(
          viewing.value &&
            viewing.value.getTime() >= currentTimestamp,
        ),
    )
    .sort((left, right) => left.value.getTime() - right.value.getTime());
  const costs = calculatePropertyCosts(property);

  return (
    <Card className="overflow-hidden">
      <div className="space-y-5 p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <PropertyStatus status={property.status} />
              <PropertyPriority priority={property.priority} />
            </div>
            {onComparisonSelectionChange ? (
              <label className="flex min-h-10 shrink-0 cursor-pointer items-center gap-2 rounded-md px-2 text-xs font-medium hover:bg-muted">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={selectedForComparison}
                  disabled={
                    comparisonSelectionDisabled && !selectedForComparison
                  }
                  onChange={(event) =>
                    onComparisonSelectionChange(event.target.checked)
                  }
                />
                Compare
              </label>
            ) : null}
          </div>

          <div>
            <Link
              href={`/houses/${property.id}`}
              className="text-lg font-semibold tracking-tight hover:text-primary hover:underline"
            >
              {property.name}
            </Link>
            {property.location ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{property.location}</span>
              </p>
            ) : null}
          </div>
        </div>

        {property.askingPrice || property.livingAreaM2 ? (
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/60 p-3">
            {property.askingPrice ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Asking price
                </p>
                <p className="mt-1 font-semibold">
                  {formatCurrency(property.askingPrice)}
                </p>
                {costs.askingPricePerM2 ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatCurrency(costs.askingPricePerM2)}/m²
                  </p>
                ) : null}
              </div>
            ) : null}
            {property.livingAreaM2 ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Living area
                </p>
                <p className="mt-1 font-semibold">
                  {formatArea(property.livingAreaM2)}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {hasContact ? (
          <div className="space-y-1.5 text-sm">
            {property.agencyName ? (
              <p className="font-medium">{property.agencyName}</p>
            ) : null}
            {property.agentName ? (
              <p className="flex items-center gap-2 text-muted-foreground">
                <UserRound aria-hidden="true" className="size-4 shrink-0" />
                {property.agentName}
              </p>
            ) : null}
            {property.agentPhone && phoneHref ? (
              <a
                className="inline-flex min-h-9 items-center gap-2 font-medium text-primary hover:underline"
                href={phoneHref}
              >
                <Phone aria-hidden="true" className="size-4 shrink-0" />
                {property.agentPhone}
              </a>
            ) : null}
          </div>
        ) : null}

        {upcomingViewings.length > 0 ? (
          <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <CalendarClock
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <div className="space-y-2">
              {upcomingViewings.map((viewing) => (
                <div key={viewing.label}>
                  <p className="font-medium">{viewing.label}</p>
                  <p>{formatDateTime(viewing.value)}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {property.status === "REJECTED" && property.rejectionReason ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            <p className="font-medium">Why it was rejected</p>
            <p className="mt-1 line-clamp-3 whitespace-pre-line">
              {property.rejectionReason}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex gap-2 border-t bg-muted/20 p-3">
        {phoneHref ? (
          <a
            className={cn(buttonVariants({ size: "sm" }), "min-w-0 flex-1")}
            href={phoneHref}
          >
            <Phone aria-hidden="true" className="size-4" />
            Call
          </a>
        ) : null}
        {property.listingUrl ? (
          <a
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "min-w-0 flex-1",
            )}
            href={property.listingUrl}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink aria-hidden="true" className="size-4" />
            Listing
          </a>
        ) : null}
        <Link
          href={`/houses/${property.id}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-w-0 flex-1",
          )}
        >
          Details
        </Link>
      </div>
    </Card>
  );
}
