import "server-only";

import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { db } from "@/db";
import { properties } from "@/db/schema/properties";
import { requireServerSession } from "@/lib/auth/session";
import { ACTIVE_PROPERTY_STATUSES } from "@/lib/properties/constants";
import type { PropertyFilters } from "@/lib/validation/property-filters";

export async function getProperties(filters: PropertyFilters) {
  await requireServerSession();

  const conditions: SQL[] = [];

  if (filters.quick === "HIGH_PRIORITY") {
    conditions.push(
      inArray(properties.status, ACTIVE_PROPERTY_STATUSES),
      inArray(properties.priority, ["HIGH", "VERY_HIGH"]),
    );
  } else if (filters.quick === "INTERESTED") {
    conditions.push(eq(properties.status, "INTERESTED"));
  } else if (filters.quick === "TO_VIEW") {
    conditions.push(eq(properties.status, "VIEWING_PLANNED"));
  } else if (filters.quick === "VIEWED") {
    conditions.push(eq(properties.status, "VIEWED"));
  } else if (filters.quick === "REJECTED") {
    conditions.push(eq(properties.status, "REJECTED"));
  } else if (filters.status) {
    conditions.push(eq(properties.status, filters.status));
  } else if (!filters.q) {
    conditions.push(inArray(properties.status, ACTIVE_PROPERTY_STATUSES));
  }

  if (filters.priority) {
    conditions.push(eq(properties.priority, filters.priority));
  }

  if (filters.minPrice) {
    conditions.push(gte(properties.askingPrice, filters.minPrice));
  }

  if (filters.maxPrice) {
    conditions.push(lte(properties.askingPrice, filters.maxPrice));
  }

  if (filters.minArea) {
    conditions.push(gte(properties.livingAreaM2, filters.minArea));
  }

  if (filters.location) {
    conditions.push(ilike(properties.location, `%${filters.location}%`));
  }

  if (filters.agency) {
    conditions.push(ilike(properties.agencyName, `%${filters.agency}%`));
  }

  if (filters.viewing === "true") {
    conditions.push(isNotNull(properties.viewingAt));
  }

  if (filters.furnished) {
    conditions.push(eq(properties.furnished, filters.furnished === "true"));
  }

  if (filters.newConstruction) {
    conditions.push(
      eq(properties.newConstruction, filters.newConstruction === "true"),
    );
  }

  if (filters.q) {
    const search = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(properties.name, search),
        ilike(properties.location, search),
        ilike(properties.address, search),
        ilike(properties.agencyName, search),
        ilike(properties.agentName, search),
        ilike(properties.agentPhone, search),
      )!,
    );
  }

  const orderBy = {
    priority: [desc(properties.priority), desc(properties.updatedAt)],
    recent: [desc(properties.createdAt)],
    "price-asc": [asc(properties.askingPrice), desc(properties.updatedAt)],
    "price-desc": [
      sql`${properties.askingPrice} DESC NULLS LAST`,
      desc(properties.updatedAt),
    ],
    area: [
      sql`${properties.livingAreaM2} DESC NULLS LAST`,
      desc(properties.updatedAt),
    ],
    viewing: [
      sql`${properties.viewingAt} ASC NULLS LAST`,
      desc(properties.priority),
    ],
  } satisfies Record<PropertyFilters["sort"], SQL[]>;

  return db
    .select()
    .from(properties)
    .where(and(...conditions))
    .orderBy(...orderBy[filters.sort]);
}
