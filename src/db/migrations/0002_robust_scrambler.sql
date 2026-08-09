ALTER TABLE "properties" ADD COLUMN "location_rating" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "layout_rating" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "condition_rating" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "garden_rating" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "privacy_rating" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "value_rating" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_location_rating_range" CHECK ("properties"."location_rating" BETWEEN 1 AND 10);--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_layout_rating_range" CHECK ("properties"."layout_rating" BETWEEN 1 AND 10);--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_condition_rating_range" CHECK ("properties"."condition_rating" BETWEEN 1 AND 10);--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_garden_rating_range" CHECK ("properties"."garden_rating" BETWEEN 1 AND 10);--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_privacy_rating_range" CHECK ("properties"."privacy_rating" BETWEEN 1 AND 10);--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_value_rating_range" CHECK ("properties"."value_rating" BETWEEN 1 AND 10);