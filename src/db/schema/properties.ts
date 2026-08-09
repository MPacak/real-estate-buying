import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import {
  PROPERTY_PRIORITIES,
  PROPERTY_STATUSES,
} from "@/lib/properties/constants";

export const propertyStatusEnum = pgEnum(
  "property_status",
  PROPERTY_STATUSES,
);

export const propertyPriorityEnum = pgEnum(
  "property_priority",
  PROPERTY_PRIORITIES,
);

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),

    address: text("address"),
    location: text("location"),

    askingPrice: numeric("asking_price", {
      precision: 14,
      scale: 2,
    }),
    targetOfferPrice: numeric("target_offer_price", {
      precision: 14,
      scale: 2,
    }),

    livingAreaM2: numeric("living_area_m2", {
      precision: 10,
      scale: 2,
    }),
    landAreaM2: numeric("land_area_m2", {
      precision: 12,
      scale: 2,
    }),
    bedrooms: integer("bedrooms"),
    bathrooms: integer("bathrooms"),
    yearBuilt: integer("year_built"),
    furnished: boolean("furnished"),
    newConstruction: boolean("new_construction"),

    listingUrl: text("listing_url"),

    agencyName: text("agency_name"),
    agentName: text("agent_name"),
    agentPhone: text("agent_phone"),
    agentEmail: text("agent_email"),

    status: propertyStatusEnum("status").default("NEW").notNull(),
    priority: propertyPriorityEnum("priority").default("NORMAL").notNull(),

    viewingAt: timestamp("viewing_at", {
      mode: "date",
      withTimezone: true,
    }),
    viewingNotes: text("viewing_notes"),

    pros: text("pros"),
    cons: text("cons"),
    notes: text("notes"),
    rejectionReason: text("rejection_reason"),

    propertyTaxPercent: numeric("property_tax_percent", {
      precision: 7,
      scale: 4,
    }),
    agencyFeePercent: numeric("agency_fee_percent", {
      precision: 7,
      scale: 4,
    }),
    solemnizationCost: numeric("solemnization_cost", {
      precision: 14,
      scale: 2,
    }),
    additionalCosts: numeric("additional_costs", {
      precision: 14,
      scale: 2,
    }),
    furnishingCost: numeric("furnishing_cost", {
      precision: 14,
      scale: 2,
    }),

    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("properties_status_idx").on(table.status),
    index("properties_priority_idx").on(table.priority),
    index("properties_updated_at_idx").on(table.updatedAt),
    index("properties_viewing_at_idx").on(table.viewingAt),
    check(
      "properties_asking_price_nonnegative",
      sql`${table.askingPrice} >= 0`,
    ),
    check(
      "properties_target_offer_price_nonnegative",
      sql`${table.targetOfferPrice} >= 0`,
    ),
    check(
      "properties_living_area_positive",
      sql`${table.livingAreaM2} > 0`,
    ),
    check(
      "properties_land_area_nonnegative",
      sql`${table.landAreaM2} >= 0`,
    ),
    check("properties_bedrooms_nonnegative", sql`${table.bedrooms} >= 0`),
    check("properties_bathrooms_nonnegative", sql`${table.bathrooms} >= 0`),
    check(
      "properties_year_built_range",
      sql`${table.yearBuilt} BETWEEN 1000 AND 2100`,
    ),
    check(
      "properties_property_tax_nonnegative",
      sql`${table.propertyTaxPercent} >= 0`,
    ),
    check(
      "properties_agency_fee_nonnegative",
      sql`${table.agencyFeePercent} >= 0`,
    ),
    check(
      "properties_solemnization_nonnegative",
      sql`${table.solemnizationCost} >= 0`,
    ),
    check(
      "properties_additional_costs_nonnegative",
      sql`${table.additionalCosts} >= 0`,
    ),
    check(
      "properties_furnishing_cost_nonnegative",
      sql`${table.furnishingCost} >= 0`,
    ),
  ],
);
