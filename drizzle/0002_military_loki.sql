CREATE TABLE "pricelist" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"price_type" "price_type" NOT NULL,
	"pack_unit" integer NOT NULL,
	"unit_price" numeric(18, 4) NOT NULL,
	"empties_price" numeric(18, 4) NOT NULL,
	"tax_rate" numeric(5, 2) NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date DEFAULT '2099-12-31' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "pricelist" ADD CONSTRAINT "pricelist_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ux_pricelist_range" ON "pricelist" USING btree ("product_id","price_type","pack_unit","start_date","end_date");