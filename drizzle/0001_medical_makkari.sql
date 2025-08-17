CREATE TYPE "public"."price_type" AS ENUM('Wholesale', 'Retail', 'Special');--> statement-breakpoint
CREATE TABLE "business_execs" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"business_name" text,
	"price_type" "price_type" NOT NULL,
	"mobile" text,
	"email" text,
	"business_address" text,
	"cust_type" text,
	"bexecs_id" integer,
	"credit_limit" numeric(18, 2) DEFAULT '0',
	"location_id" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"date_created" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_bexecs_id_business_execs_id_fk" FOREIGN KEY ("bexecs_id") REFERENCES "public"."business_execs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ux_bexecs_code" ON "business_execs" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_customers_code" ON "customers" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_locations_code" ON "locations" USING btree ("code");