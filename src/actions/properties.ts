"use server";

import { eq } from "drizzle-orm";
import { fromZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "@/db";
import { properties } from "@/db/schema/properties";
import type { PropertyActionState } from "@/lib/properties/action-state";
import { requireServerSession } from "@/lib/auth/session";
import { findDuplicateProperties } from "@/lib/properties/duplicates";
import { normalizeListingUrl } from "@/lib/properties/normalization";
import {
  createPropertySchema,
  type CreatePropertyInput,
} from "@/lib/validation/property";

const propertyIdSchema = z.uuid();

const propertyFormFields = [
  "name",
  "address",
  "location",
  "askingPrice",
  "targetOfferPrice",
  "livingAreaM2",
  "landAreaM2",
  "bedrooms",
  "bathrooms",
  "yearBuilt",
  "furnished",
  "newConstruction",
  "listingUrl",
  "agencyName",
  "agentName",
  "agentPhone",
  "agentEmail",
  "status",
  "priority",
  "viewingAt",
  "viewingNotes",
  "secondViewingAt",
  "secondViewingNotes",
  "pros",
  "cons",
  "notes",
  "rejectionReason",
  "locationRating",
  "layoutRating",
  "conditionRating",
  "gardenRating",
  "privacyRating",
  "valueRating",
  "propertyTaxPercent",
  "agencyFeePercent",
  "solemnizationCost",
  "additionalCosts",
  "furnishingCost",
  "renovationCost",
] as const;

function readPropertyFormValues(formData: FormData) {
  const values: Record<string, string> = {};

  for (const field of propertyFormFields) {
    const value = formData.get(field);

    if (typeof value === "string") {
      values[field] = value;
    }
  }

  return values;
}

function parsePropertyForm(values: Record<string, string>) {
  const input: Record<string, string | Date> = { ...values };
  const viewingAt = input.viewingAt;

  if (typeof viewingAt === "string" && viewingAt.trim() !== "") {
    input.viewingAt = fromZonedTime(viewingAt, "Europe/Zagreb");
  }

  const secondViewingAt = input.secondViewingAt;

  if (
    typeof secondViewingAt === "string" &&
    secondViewingAt.trim() !== ""
  ) {
    input.secondViewingAt = fromZonedTime(
      secondViewingAt,
      "Europe/Zagreb",
    );
  }

  return input;
}

function toDatabaseValues(input: CreatePropertyInput) {
  return {
    name: input.name,
    address: input.address ?? null,
    location: input.location ?? null,
    askingPrice: input.askingPrice ?? null,
    targetOfferPrice: input.targetOfferPrice ?? null,
    livingAreaM2: input.livingAreaM2 ?? null,
    landAreaM2: input.landAreaM2 ?? null,
    bedrooms: input.bedrooms ?? null,
    bathrooms: input.bathrooms ?? null,
    yearBuilt: input.yearBuilt ?? null,
    furnished: input.furnished ?? null,
    newConstruction: input.newConstruction ?? null,
    listingUrl: normalizeListingUrl(input.listingUrl),
    agencyName: input.agencyName ?? null,
    agentName: input.agentName ?? null,
    agentPhone: input.agentPhone ?? null,
    agentEmail: input.agentEmail ?? null,
    status: input.status,
    priority: input.priority,
    viewingAt: input.viewingAt ?? null,
    viewingNotes: input.viewingNotes ?? null,
    secondViewingAt: input.secondViewingAt ?? null,
    secondViewingNotes: input.secondViewingNotes ?? null,
    pros: input.pros ?? null,
    cons: input.cons ?? null,
    notes: input.notes ?? null,
    rejectionReason: input.rejectionReason ?? null,
    locationRating: input.locationRating ?? null,
    layoutRating: input.layoutRating ?? null,
    conditionRating: input.conditionRating ?? null,
    gardenRating: input.gardenRating ?? null,
    privacyRating: input.privacyRating ?? null,
    valueRating: input.valueRating ?? null,
    propertyTaxPercent: input.propertyTaxPercent ?? null,
    agencyFeePercent: input.agencyFeePercent ?? null,
    solemnizationCost: input.solemnizationCost ?? null,
    additionalCosts: input.additionalCosts ?? null,
    furnishingCost: input.furnishingCost ?? null,
    renovationCost: input.renovationCost ?? null,
  } satisfies typeof properties.$inferInsert;
}

function validationErrorState(
  error: z.ZodError,
  values: Record<string, string>,
): PropertyActionState {
  return {
    message: "Check the highlighted fields and try again.",
    fieldErrors: error.flatten()
      .fieldErrors as PropertyActionState["fieldErrors"],
    values,
  };
}

export async function createProperty(
  _previousState: PropertyActionState,
  formData: FormData,
): Promise<PropertyActionState> {
  await requireServerSession();

  const values = readPropertyFormValues(formData);
  const validation = createPropertySchema.safeParse(
    parsePropertyForm(values),
  );

  if (!validation.success) {
    return validationErrorState(validation.error, values);
  }

  if (formData.get("saveAnyway") !== "true") {
    const duplicates = await findDuplicateProperties(validation.data);

    if (duplicates.length > 0) {
      return {
        message: "This property may already exist.",
        duplicates,
        values,
      };
    }
  }

  let propertyId: string;

  try {
    const [createdProperty] = await db
      .insert(properties)
      .values(toDatabaseValues(validation.data))
      .returning({ id: properties.id });

    propertyId = createdProperty.id;
  } catch (error) {
    console.error("Unable to create property", error);
    return {
      message: "The property could not be saved. Please try again.",
      values,
    };
  }

  revalidatePath("/houses");
  redirect(`/houses/${propertyId}?saved=created`);
}

export async function updateProperty(
  id: string,
  _previousState: PropertyActionState,
  formData: FormData,
): Promise<PropertyActionState> {
  await requireServerSession();

  const values = readPropertyFormValues(formData);
  const idValidation = propertyIdSchema.safeParse(id);

  if (!idValidation.success) {
    return { message: "This property ID is invalid.", values };
  }

  const validation = createPropertySchema.safeParse(
    parsePropertyForm(values),
  );

  if (!validation.success) {
    return validationErrorState(validation.error, values);
  }

  if (formData.get("saveAnyway") !== "true") {
    const duplicates = await findDuplicateProperties(
      validation.data,
      idValidation.data,
    );

    if (duplicates.length > 0) {
      return {
        message: "This property may already exist.",
        duplicates,
        values,
      };
    }
  }

  try {
    const [updatedProperty] = await db
      .update(properties)
      .set({
        ...toDatabaseValues(validation.data),
        updatedAt: new Date(),
      })
      .where(eq(properties.id, idValidation.data))
      .returning({ id: properties.id });

    if (!updatedProperty) {
      return { message: "This property no longer exists.", values };
    }
  } catch (error) {
    console.error("Unable to update property", error);
    return {
      message: "The property could not be updated. Please try again.",
      values,
    };
  }

  revalidatePath("/houses");
  revalidatePath(`/houses/${idValidation.data}`);
  redirect(`/houses/${idValidation.data}?saved=updated`);
}

export async function archiveProperty(id: string): Promise<void> {
  await requireServerSession();

  const propertyId = propertyIdSchema.parse(id);

  await db
    .update(properties)
    .set({
      status: "ARCHIVED",
      updatedAt: new Date(),
    })
    .where(eq(properties.id, propertyId));

  revalidatePath("/houses");
  revalidatePath(`/houses/${propertyId}`);
  redirect("/houses?saved=archived");
}
