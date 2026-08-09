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
import { formatCurrency } from "@/lib/formatting/currency";
import { formatArea, formatDateTime } from "@/lib/formatting/property";
import type { Property } from "@/lib/properties/types";
import { cn } from "@/lib/utils";

export function PropertyCard({ property }: { property: Property }) {
  const phoneHref = property.agentPhone
    ? `tel:${property.agentPhone.replace(/[^\d+]/g, "")}`
    : null;
  const hasContact = Boolean(
    property.agencyName || property.agentName || property.agentPhone,
  );
  const hasViewing = Boolean(property.viewingAt);

  return (
    <Card className="overflow-hidden">
      <div className="space-y-5 p-5">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <PropertyStatus status={property.status} />
            <PropertyPriority priority={property.priority} />
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

        {hasViewing && property.viewingAt ? (
          <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            <CalendarClock
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <div>
              <p className="font-medium">Viewing</p>
              <p>{formatDateTime(property.viewingAt)}</p>
            </div>
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
