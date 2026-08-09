import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import type { properties } from "@/db/schema/properties";

export type Property = InferSelectModel<typeof properties>;
export type NewProperty = InferInsertModel<typeof properties>;
