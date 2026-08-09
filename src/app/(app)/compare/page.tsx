import { ArrowLeft, ExternalLink, Scale } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { z } from "zod";

import { PropertyPriority } from "@/components/houses/property-priority";
import { PropertyStatus } from "@/components/houses/property-status";
import { buttonVariants } from "@/components/ui/button";
import { calculatePropertyCosts } from "@/lib/calculations/property-costs";
import { formatCurrency } from "@/lib/formatting/currency";
import {
  formatArea,
  formatBoolean,
} from "@/lib/formatting/property";
import { getPropertiesByIds } from "@/lib/properties/queries";

type ComparePageProps = {
  searchParams: Promise<{ ids?: string | string[] }>;
};

function ComparisonRow({
  label,
  values,
}: {
  label: string;
  values: ReactNode[];
}) {
  return (
    <tr className="border-t">
      <th
        scope="row"
        className="sticky left-0 z-10 w-44 bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </th>
      {values.map((value, index) => (
        <td
          key={index}
          className="min-w-60 whitespace-pre-wrap px-4 py-3 align-top text-sm"
        >
          {value === null || value === undefined || value === "" ? "—" : value}
        </td>
      ))}
    </tr>
  );
}

export default async function ComparePage({
  searchParams,
}: ComparePageProps) {
  const rawIds = (await searchParams).ids;
  const idValue = Array.isArray(rawIds) ? rawIds[0] : rawIds;
  const ids = [...new Set(idValue?.split(",") ?? [])]
    .filter((id) => z.uuid().safeParse(id).success)
    .slice(0, 4);
  const properties = await getPropertiesByIds(ids);

  if (properties.length < 2) {
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
          <h2 className="mt-4 text-lg font-semibold">
            Select at least two properties
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Choose two to four houses from the dashboard, then open the
            comparison.
          </p>
          <Link href="/houses" className={`${buttonVariants()} mt-6`}>
            Choose properties
          </Link>
        </section>
      </div>
    );
  }

  const costs = properties.map((property) =>
    calculatePropertyCosts(property),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Compare</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Comparing {properties.length} shortlisted properties.
          </p>
        </div>
        <Link
          href="/houses"
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Change selection
        </Link>
      </div>

      <div className="-mx-4 overflow-x-auto border-y sm:mx-0 sm:rounded-xl sm:border">
        <table className="min-w-full border-collapse bg-card">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 w-44 bg-muted p-4 text-left text-sm font-semibold">
                Property
              </th>
              {properties.map((property) => (
                <th
                  key={property.id}
                  scope="col"
                  className="min-w-60 bg-card p-4 text-left align-top"
                >
                  <Link
                    href={`/houses/${property.id}`}
                    className="font-semibold hover:text-primary hover:underline"
                  >
                    {property.name}
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <PropertyStatus status={property.status} />
                    <PropertyPriority priority={property.priority} />
                  </div>
                  {property.listingUrl ? (
                    <a
                      href={property.listingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      <ExternalLink aria-hidden="true" className="size-3.5" />
                      Listing
                    </a>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="Asking price"
              values={properties.map((property) =>
                formatCurrency(property.askingPrice),
              )}
            />
            <ComparisonRow
              label="Target offer"
              values={properties.map((property) =>
                formatCurrency(property.targetOfferPrice),
              )}
            />
            <ComparisonRow
              label="Estimated total"
              values={costs.map((cost) =>
                formatCurrency(cost.estimatedTotal),
              )}
            />
            <ComparisonRow
              label="Living area"
              values={properties.map((property) =>
                formatArea(property.livingAreaM2),
              )}
            />
            <ComparisonRow
              label="Land area"
              values={properties.map((property) =>
                formatArea(property.landAreaM2),
              )}
            />
            <ComparisonRow
              label="Asking price/m²"
              values={costs.map((cost) =>
                cost.askingPricePerM2
                  ? `${formatCurrency(cost.askingPricePerM2)}/m²`
                  : null,
              )}
            />
            <ComparisonRow
              label="Target price/m²"
              values={costs.map((cost) =>
                cost.targetPricePerM2
                  ? `${formatCurrency(cost.targetPricePerM2)}/m²`
                  : null,
              )}
            />
            <ComparisonRow
              label="Bedrooms"
              values={properties.map((property) => property.bedrooms)}
            />
            <ComparisonRow
              label="Bathrooms"
              values={properties.map((property) => property.bathrooms)}
            />
            <ComparisonRow
              label="Year built"
              values={properties.map((property) => property.yearBuilt)}
            />
            <ComparisonRow
              label="Furnished"
              values={properties.map((property) =>
                formatBoolean(property.furnished),
              )}
            />
            <ComparisonRow
              label="New construction"
              values={properties.map((property) =>
                formatBoolean(property.newConstruction),
              )}
            />
            <ComparisonRow
              label="Location"
              values={properties.map((property) => property.location)}
            />
            <ComparisonRow
              label="Agency"
              values={properties.map((property) => property.agencyName)}
            />
            <ComparisonRow
              label="Agent"
              values={properties.map((property) => property.agentName)}
            />
            <ComparisonRow
              label="Location rating"
              values={properties.map((property) =>
                property.locationRating
                  ? `${property.locationRating}/10`
                  : null,
              )}
            />
            <ComparisonRow
              label="Layout rating"
              values={properties.map((property) =>
                property.layoutRating ? `${property.layoutRating}/10` : null,
              )}
            />
            <ComparisonRow
              label="Condition rating"
              values={properties.map((property) =>
                property.conditionRating
                  ? `${property.conditionRating}/10`
                  : null,
              )}
            />
            <ComparisonRow
              label="Garden rating"
              values={properties.map((property) =>
                property.gardenRating ? `${property.gardenRating}/10` : null,
              )}
            />
            <ComparisonRow
              label="Privacy rating"
              values={properties.map((property) =>
                property.privacyRating ? `${property.privacyRating}/10` : null,
              )}
            />
            <ComparisonRow
              label="Value rating"
              values={properties.map((property) =>
                property.valueRating ? `${property.valueRating}/10` : null,
              )}
            />
            <ComparisonRow
              label="Pros"
              values={properties.map((property) => property.pros)}
            />
            <ComparisonRow
              label="Cons"
              values={properties.map((property) => property.cons)}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
