import "server-only";

import { desc } from "drizzle-orm";

import { db } from "@/db";
import { properties } from "@/db/schema/properties";
import { requireServerSession } from "@/lib/auth/session";
import {
  normalizeAddress,
  normalizeListingUrl,
  normalizePhone,
} from "@/lib/properties/normalization";
import type { CreatePropertyInput } from "@/lib/validation/property";

export type DuplicatePropertyMatch = {
  id: string;
  name: string;
  createdAt: string;
  reasons: string[];
};

export async function findDuplicateProperties(
  input: CreatePropertyInput,
  currentPropertyId?: string,
): Promise<DuplicatePropertyMatch[]> {
  await requireServerSession();

  const listingUrl = normalizeListingUrl(input.listingUrl);
  const address = normalizeAddress(input.address);
  const agentPhone = normalizePhone(input.agentPhone);

  if (!listingUrl && !address) {
    return [];
  }

  const candidates = await db
    .select({
      id: properties.id,
      name: properties.name,
      listingUrl: properties.listingUrl,
      address: properties.address,
      agentPhone: properties.agentPhone,
      createdAt: properties.createdAt,
    })
    .from(properties)
    .orderBy(desc(properties.createdAt));

  return candidates
    .filter((candidate) => candidate.id !== currentPropertyId)
    .map((candidate) => {
      const reasons: string[] = [];
      const listingMatches =
        listingUrl &&
        listingUrl === normalizeListingUrl(candidate.listingUrl);
      const addressMatches =
        address && address === normalizeAddress(candidate.address);

      if (listingMatches) reasons.push("Same listing URL");
      if (addressMatches) reasons.push("Same address");

      if (
        reasons.length > 0 &&
        agentPhone &&
        agentPhone === normalizePhone(candidate.agentPhone)
      ) {
        reasons.push("Same agent phone");
      }

      return {
        id: candidate.id,
        name: candidate.name,
        createdAt: candidate.createdAt.toISOString(),
        reasons,
      };
    })
    .filter((candidate) => candidate.reasons.length > 0)
    .slice(0, 5);
}
