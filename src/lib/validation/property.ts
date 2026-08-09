import { z } from "zod";

import {
  FURNISHING_STATUSES,
  PROPERTY_PRIORITIES,
  PROPERTY_STATUSES,
} from "@/lib/properties/constants";

function emptyToUndefined(value: unknown) {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }

  return value;
}

function optionalText(maximumLength: number) {
  return z.preprocess(
    emptyToUndefined,
    z.string().trim().max(maximumLength).optional(),
  );
}

function optionalDecimal({
  integerDigits,
  scale,
  positive = false,
}: {
  integerDigits: number;
  scale: number;
  positive?: boolean;
}) {
  const decimalPattern = new RegExp(
    `^\\d{1,${integerDigits}}(?:\\.\\d{1,${scale}})?$`,
  );

  return z.preprocess(
    (value) => {
      const normalized = emptyToUndefined(value);

      if (typeof normalized === "number") {
        return String(normalized);
      }

      if (typeof normalized === "string") {
        return normalized.replace(",", ".");
      }

      return normalized;
    },
    z
      .string()
      .regex(decimalPattern, "Enter a valid non-negative number")
      .refine(
        (value) => !positive || /[1-9]/.test(value),
        "Value must be greater than zero",
      )
      .optional(),
  );
}

function optionalInteger({
  minimum = 0,
  maximum,
}: {
  minimum?: number;
  maximum?: number;
} = {}) {
  return z.preprocess(
    (value) => {
      const normalized = emptyToUndefined(value);
      return typeof normalized === "string"
        ? Number(normalized)
        : normalized;
    },
    z
      .number()
      .int()
      .min(minimum)
      .max(maximum ?? Number.MAX_SAFE_INTEGER)
      .optional(),
  );
}

const optionalBoolean = z.preprocess(
  (value) => {
    const normalized = emptyToUndefined(value);

    if (normalized === "true") return true;
    if (normalized === "false") return false;

    return normalized;
  },
  z.boolean().optional(),
);

const optionalDate = z.preprocess(
  (value) => {
    const normalized = emptyToUndefined(value);

    if (typeof normalized === "string") {
      return new Date(normalized);
    }

    return normalized;
  },
  z.date().optional(),
);

const optionalListingUrl = z.preprocess(
  emptyToUndefined,
  z
    .url()
    .refine(
      (value) => value.startsWith("http://") || value.startsWith("https://"),
      "Listing URL must use http or https",
    )
    .optional(),
);

const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.email().max(320).optional(),
);

export const createPropertySchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(200),
    address: optionalText(500),
    location: optionalText(200),

    askingPrice: optionalDecimal({ integerDigits: 12, scale: 2 }),
    targetOfferPrice: optionalDecimal({ integerDigits: 12, scale: 2 }),
    livingAreaM2: optionalDecimal({
      integerDigits: 8,
      scale: 2,
      positive: true,
    }),
    landAreaM2: optionalDecimal({ integerDigits: 10, scale: 2 }),
    bedrooms: optionalInteger(),
    bathrooms: optionalInteger(),
    yearBuilt: optionalInteger({
      minimum: 1000,
      maximum: new Date().getFullYear() + 1,
    }),
    furnished: z.enum(FURNISHING_STATUSES).optional(),
    newConstruction: optionalBoolean,

    listingUrl: optionalListingUrl,

    agencyName: optionalText(200),
    agentName: optionalText(200),
    agentPhone: optionalText(50),
    agentEmail: optionalEmail,

    status: z.enum(PROPERTY_STATUSES).default("INTERESTED"),
    priority: z.enum(PROPERTY_PRIORITIES).default("NORMAL"),

    viewingAt: optionalDate,
    viewingNotes: optionalText(10_000),
    secondViewingAt: optionalDate,
    secondViewingNotes: optionalText(10_000),

    pros: optionalText(10_000),
    cons: optionalText(10_000),
    notes: optionalText(20_000),
    rejectionReason: optionalText(10_000),

    locationRating: optionalInteger({ minimum: 1, maximum: 10 }),
    layoutRating: optionalInteger({ minimum: 1, maximum: 10 }),
    conditionRating: optionalInteger({ minimum: 1, maximum: 10 }),
    gardenRating: optionalInteger({ minimum: 1, maximum: 10 }),
    privacyRating: optionalInteger({ minimum: 1, maximum: 10 }),
    valueRating: optionalInteger({ minimum: 1, maximum: 10 }),

    propertyTaxPercent: optionalDecimal({
      integerDigits: 3,
      scale: 4,
    }),
    agencyFeePercent: optionalDecimal({
      integerDigits: 3,
      scale: 4,
    }),
    solemnizationCost: optionalDecimal({
      integerDigits: 12,
      scale: 2,
    }),
    additionalCosts: optionalDecimal({
      integerDigits: 12,
      scale: 2,
    }),
    furnishingCost: optionalDecimal({
      integerDigits: 12,
      scale: 2,
    }),
    renovationCost: optionalDecimal({
      integerDigits: 12,
      scale: 2,
    }),
  })
  .strict();

export const updatePropertySchema = createPropertySchema.partial();

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
