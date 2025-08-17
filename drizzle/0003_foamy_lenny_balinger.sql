ALTER TABLE "locations" ADD COLUMN "level_group_name" text;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;