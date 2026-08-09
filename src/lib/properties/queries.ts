import "server-only";

import { desc, inArray } from "drizzle-orm";

import { db } from "@/db";
import { properties } from "@/db/schema/properties";
import { requireServerSession } from "@/lib/auth/session";
import { ACTIVE_PROPERTY_STATUSES } from "@/lib/properties/constants";

export async function getActiveProperties() {
  await requireServerSession();

  return db
    .select()
    .from(properties)
    .where(inArray(properties.status, ACTIVE_PROPERTY_STATUSES))
    .orderBy(desc(properties.priority), desc(properties.updatedAt));
}
