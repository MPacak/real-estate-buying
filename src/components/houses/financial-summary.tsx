import { Calculator } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculatePropertyCosts,
  type PropertyCostInputs,
} from "@/lib/calculations/property-costs";
import { formatCurrency } from "@/lib/formatting/currency";

function SummaryItem({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string | null;
  emphasized?: boolean;
}) {
  if (!value) return null;

  return (
    <div
      className={
        emphasized
          ? "rounded-lg bg-secondary p-3 text-secondary-foreground"
          : undefined
      }
    >
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className={emphasized ? "mt-1 text-lg font-bold" : "mt-1 font-semibold"}>
        {value}
      </dd>
    </div>
  );
}

export function FinancialSummary({
  inputs,
  preview = false,
}: {
  inputs: PropertyCostInputs;
  preview?: boolean;
}) {
  const costs = calculatePropertyCosts(inputs);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator aria-hidden="true" className="size-5 text-primary" />
          <CardTitle className="text-lg">
            {preview ? "Estimated cost preview" : "Financial summary"}
          </CardTitle>
        </div>
        <CardDescription>
          Calculated from the target offer when available, otherwise the asking
          price.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {costs.calculationBase ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <SummaryItem
              label={
                costs.calculationBaseSource === "targetOfferPrice"
                  ? "Calculation base (target)"
                  : "Calculation base (asking)"
              }
              value={formatCurrency(costs.calculationBase)}
            />
            <SummaryItem
              label="Property tax"
              value={formatCurrency(costs.propertyTax)}
            />
            <SummaryItem
              label="Agency fee"
              value={formatCurrency(costs.agencyFee)}
            />
            <SummaryItem
              label="Solemnization"
              value={formatCurrency(inputs.solemnizationCost)}
            />
            <SummaryItem
              label="Additional costs"
              value={formatCurrency(inputs.additionalCosts)}
            />
            <SummaryItem
              label="Furnishing"
              value={formatCurrency(inputs.furnishingCost)}
            />
            <SummaryItem
              label="Asking price per m²"
              value={
                costs.askingPricePerM2
                  ? `${formatCurrency(costs.askingPricePerM2)}/m²`
                  : null
              }
            />
            <SummaryItem
              label="Target price per m²"
              value={
                costs.targetPricePerM2
                  ? `${formatCurrency(costs.targetPricePerM2)}/m²`
                  : null
              }
            />
            <SummaryItem
              label="Estimated total"
              value={formatCurrency(costs.estimatedTotal)}
              emphasized
            />
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter an asking price or target offer to calculate the estimate.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
