import { z } from "zod";

import {
  PROPERTY_PRIORITIES,
  PROPERTY_STATUSES,
} from "@/lib/properties/constants";

const optionalDecimal = z
  .string()
  .trim()
  .regex(/^\d+(?:[.,]\d{1,2})?$/)
  .transform((value) => value.replace(",", "."))
  .optional()
  .catch(undefined);

const propertyFiltersSchema = z
  .object({
    q: z.string().trim().max(200).optional().catch(undefined),
    quick: z
      .enum(["HIGH_PRIORITY", "INTERESTED", "TO_VIEW", "VIEWED", "REJECTED"])
      .optional()
      .catch(undefined),
    status: z.enum(PROPERTY_STATUSES).optional().catch(undefined),
    priority: z.enum(PROPERTY_PRIORITIES).optional().catch(undefined),
    minPrice: optionalDecimal,
    maxPrice: optionalDecimal,
    minArea: optionalDecimal,
    location: z.string().trim().max(200).optional().catch(undefined),
    agency: z.string().trim().max(200).optional().catch(undefined),
    viewing: z.enum(["true"]).optional().catch(undefined),
    furnished: z.enum(["true", "false"]).optional().catch(undefined),
    newConstruction: z.enum(["true", "false"]).optional().catch(undefined),
    sort: z
      .enum([
        "priority",
        "recent",
        "price-asc",
        "price-desc",
        "area",
        "viewing",
      ])
      .default("priority")
      .catch("priority"),
  })
  .transform((filters) => ({
    ...filters,
    q: filters.q || undefined,
    location: filters.location || undefined,
    agency: filters.agency || undefined,
  }));

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;

export type PropertySearchParams = Record<
  string,
  string | string[] | undefined
>;

export function parsePropertyFilters(searchParams: PropertySearchParams) {
  const singleValues = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );

  return propertyFiltersSchema.parse(singleValues);
}
