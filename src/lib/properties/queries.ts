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
  } else if (filters.quick === "CONSIDERING") {
    conditions.push(eq(properties.status, "CONSIDERING"));
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

  if (filters.viewing === "true") {
    conditions.push(
      or(
        isNotNull(properties.viewingAt),
        isNotNull(properties.secondViewingAt),
      )!,
    );
  }

  if (filters.furnished) {
    conditions.push(eq(properties.furnished, filters.furnished));
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
      sql`LEAST(
        COALESCE(${properties.viewingAt}, 'infinity'::timestamptz),
        COALESCE(${properties.secondViewingAt}, 'infinity'::timestamptz)
      ) ASC`,
      desc(properties.priority),
    ],
  } satisfies Record<PropertyFilters["sort"], SQL[]>;

  return db
    .select()
    .from(properties)
    .where(and(...conditions))
    .orderBy(...orderBy[filters.sort]);
}

export async function getPropertiesByIds(ids: string[]) {
  await requireServerSession();

  if (ids.length === 0) return [];

  const matchingProperties = await db
    .select()
    .from(properties)
    .where(inArray(properties.id, ids));
  const propertyById = new Map(
    matchingProperties.map((property) => [property.id, property]),
  );

  return ids
    .map((id) => propertyById.get(id))
    .filter((property) => property !== undefined);
}

export async function getUpcomingViewingProperties(currentTime: Date) {
  await requireServerSession();

  return db
    .select()
    .from(properties)
    .where(
      and(
        inArray(properties.status, ACTIVE_PROPERTY_STATUSES),
        or(
          gte(properties.viewingAt, currentTime),
          gte(properties.secondViewingAt, currentTime),
        ),
      ),
    )
    .orderBy(
      sql`LEAST(
        CASE
          WHEN ${properties.viewingAt} >= now()
          THEN ${properties.viewingAt}
          ELSE 'infinity'::timestamptz
        END,
        CASE
          WHEN ${properties.secondViewingAt} >= now()
          THEN ${properties.secondViewingAt}
          ELSE 'infinity'::timestamptz
        END
      ) ASC`,
      desc(properties.priority),
    );
}
