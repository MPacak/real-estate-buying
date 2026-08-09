CREATE TYPE "public"."furnishing_status" AS ENUM('UNFURNISHED', 'PARTLY_FURNISHED', 'FURNISHED');--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "furnished" SET DATA TYPE "public"."furnishing_status" USING (
	CASE
		WHEN "furnished" IS TRUE THEN 'FURNISHED'::"public"."furnishing_status"
		WHEN "furnished" IS FALSE THEN 'UNFURNISHED'::"public"."furnishing_status"
		ELSE NULL
	END
);--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "status" SET DEFAULT 'INTERESTED';--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "second_viewing_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "second_viewing_notes" text;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "renovation_cost" numeric(14, 2);--> statement-breakpoint
CREATE INDEX "properties_second_viewing_at_idx" ON "properties" USING btree ("second_viewing_at");--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_renovation_cost_nonnegative" CHECK ("properties"."renovation_cost" >= 0);