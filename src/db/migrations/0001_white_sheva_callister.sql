CREATE TYPE "public"."property_priority" AS ENUM('LOW', 'NORMAL', 'HIGH', 'VERY_HIGH');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('NEW', 'CONSIDERING', 'VIEWING_PLANNED', 'VIEWED', 'INTERESTED', 'REJECTED', 'SOLD', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"address" text,
	"location" text,
	"asking_price" numeric(14, 2),
	"target_offer_price" numeric(14, 2),
	"living_area_m2" numeric(10, 2),
	"land_area_m2" numeric(12, 2),
	"bedrooms" integer,
	"bathrooms" integer,
	"year_built" integer,
	"furnished" boolean,
	"new_construction" boolean,
	"listing_url" text,
	"agency_name" text,
	"agent_name" text,
	"agent_phone" text,
	"agent_email" text,
	"status" "property_status" DEFAULT 'NEW' NOT NULL,
	"priority" "property_priority" DEFAULT 'NORMAL' NOT NULL,
	"viewing_at" timestamp with time zone,
	"viewing_notes" text,
	"pros" text,
	"cons" text,
	"notes" text,
	"rejection_reason" text,
	"property_tax_percent" numeric(7, 4),
	"agency_fee_percent" numeric(7, 4),
	"solemnization_cost" numeric(14, 2),
	"additional_costs" numeric(14, 2),
	"furnishing_cost" numeric(14, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_asking_price_nonnegative" CHECK ("properties"."asking_price" >= 0),
	CONSTRAINT "properties_target_offer_price_nonnegative" CHECK ("properties"."target_offer_price" >= 0),
	CONSTRAINT "properties_living_area_positive" CHECK ("properties"."living_area_m2" > 0),
	CONSTRAINT "properties_land_area_nonnegative" CHECK ("properties"."land_area_m2" >= 0),
	CONSTRAINT "properties_bedrooms_nonnegative" CHECK ("properties"."bedrooms" >= 0),
	CONSTRAINT "properties_bathrooms_nonnegative" CHECK ("properties"."bathrooms" >= 0),
	CONSTRAINT "properties_year_built_range" CHECK ("properties"."year_built" BETWEEN 1000 AND 2100),
	CONSTRAINT "properties_property_tax_nonnegative" CHECK ("properties"."property_tax_percent" >= 0),
	CONSTRAINT "properties_agency_fee_nonnegative" CHECK ("properties"."agency_fee_percent" >= 0),
	CONSTRAINT "properties_solemnization_nonnegative" CHECK ("properties"."solemnization_cost" >= 0),
	CONSTRAINT "properties_additional_costs_nonnegative" CHECK ("properties"."additional_costs" >= 0),
	CONSTRAINT "properties_furnishing_cost_nonnegative" CHECK ("properties"."furnishing_cost" >= 0)
);
--> statement-breakpoint
CREATE INDEX "properties_status_idx" ON "properties" USING btree ("status");--> statement-breakpoint
CREATE INDEX "properties_priority_idx" ON "properties" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "properties_updated_at_idx" ON "properties" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "properties_viewing_at_idx" ON "properties" USING btree ("viewing_at");