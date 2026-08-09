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
  "pros",
  "cons",
  "notes",
  "rejectionReason",
  "propertyTaxPercent",
  "agencyFeePercent",
  "solemnizationCost",
  "additionalCosts",
  "furnishingCost",
] as const;

function readPropertyForm(formData: FormData) {
  const input: Record<string, FormDataEntryValue | Date> = {};

  for (const field of propertyFormFields) {
    const value = formData.get(field);

    if (value !== null) {
      input[field] = value;
    }
  }

  const viewingAt = input.viewingAt;

  if (typeof viewingAt === "string" && viewingAt.trim() !== "") {
    input.viewingAt = fromZonedTime(viewingAt, "Europe/Zagreb");
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
    pros: input.pros ?? null,
    cons: input.cons ?? null,
    notes: input.notes ?? null,
    rejectionReason: input.rejectionReason ?? null,
    propertyTaxPercent: input.propertyTaxPercent ?? null,
    agencyFeePercent: input.agencyFeePercent ?? null,
    solemnizationCost: input.solemnizationCost ?? null,
    additionalCosts: input.additionalCosts ?? null,
    furnishingCost: input.furnishingCost ?? null,
  } satisfies typeof properties.$inferInsert;
}

function validationErrorState(error: z.ZodError): PropertyActionState {
  return {
    message: "Check the highlighted fields and try again.",
    fieldErrors: error.flatten()
      .fieldErrors as PropertyActionState["fieldErrors"],
  };
}

export async function createProperty(
  _previousState: PropertyActionState,
  formData: FormData,
): Promise<PropertyActionState> {
  await requireServerSession();

  const validation = createPropertySchema.safeParse(
    readPropertyForm(formData),
  );

  if (!validation.success) {
    return validationErrorState(validation.error);
  }

  if (formData.get("saveAnyway") !== "true") {
    const duplicates = await findDuplicateProperties(validation.data);

    if (duplicates.length > 0) {
      return {
        message: "This property may already exist.",
        duplicates,
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
    };
  }

  revalidatePath("/houses");
  redirect(`/houses/${propertyId}`);
}

export async function updateProperty(
  id: string,
  _previousState: PropertyActionState,
  formData: FormData,
): Promise<PropertyActionState> {
  await requireServerSession();

  const idValidation = propertyIdSchema.safeParse(id);

  if (!idValidation.success) {
    return { message: "This property ID is invalid." };
  }

  const validation = createPropertySchema.safeParse(
    readPropertyForm(formData),
  );

  if (!validation.success) {
    return validationErrorState(validation.error);
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
      return { message: "This property no longer exists." };
    }
  } catch (error) {
    console.error("Unable to update property", error);
    return {
      message: "The property could not be updated. Please try again.",
    };
  }

  revalidatePath("/houses");
  revalidatePath(`/houses/${idValidation.data}`);
  redirect(`/houses/${idValidation.data}`);
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
  redirect("/houses");
}
