// src/db/schema.ts
import { 
  pgTable, serial, text, boolean, numeric, timestamp, uniqueIndex, 
  integer, pgEnum, date
 } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  packUnit: numeric('pack_unit', { precision: 10, scale: 4 }).notNull(), // bottles per carton
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  uxCode: uniqueIndex('ux_products_code').on(table.code),
}));


// Enums
export const priceTypeEnum = pgEnum('price_type', ['Wholesale','Retail','Special']);

// (Assumes you already have `products` defined above)
export const pricelist = pgTable('pricelist', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').notNull().references(() => products.id),
  priceType: priceTypeEnum('price_type').notNull(),
  /** NEW: numeric pack size for the price row (e.g., 24 bottles per carton) */
  packUnit: integer('pack_unit').notNull(),
  /** VAT-inclusive unit price */
  unitPrice: numeric('unit_price', { precision: 18, scale: 4 }).notNull(),
  /** NEW: price for empties/returnable container */
  emptiesPrice: numeric('empties_price', { precision: 18, scale: 4 }).notNull(),
  taxRate: numeric('tax_rate', { precision: 5, scale: 2 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull().default('2099-12-31'),
  isActive: boolean('is_active').notNull().default(true),
}, (t) => ({
  /** Prevent duplicates for same (product, priceType, packUnit, date range) */
  uqPrice: uniqueIndex('ux_pricelist_range').on(
    t.productId, t.priceType, t.packUnit, t.startDate, t.endDate
  ),
}));


// Business Execs (sales reps)
export const businessExecs = pgTable('business_execs', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  phone: text('phone'),
  isActive: boolean('is_active').notNull().default(true),
}, (t) => ({
  uxCode: uniqueIndex('ux_bexecs_code').on(t.code),
}));

// Locations
export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  levelGroupName: text("level_group_name"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
}, (t) => ({
  uxCode: uniqueIndex('ux_locations_code').on(t.code),
}));

// Customers
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  businessName: text('business_name'),
  priceType: priceTypeEnum('price_type').notNull(),               // 'Wholesale' | 'Retail' | 'Special'
  mobile: text('mobile'),
  email: text('email'),
  businessAddress: text('business_address'),
  custType: text('cust_type'),
  bexecsId: integer('bexecs_id').references(() => businessExecs.id),
  creditLimit: numeric('credit_limit', { precision: 18, scale: 2 }).default('0'),
  locationId: integer('location_id').references(() => locations.id),
  isActive: boolean('is_active').notNull().default(true),
  dateCreated: date('date_created').defaultNow(),
}, (t) => ({
  uxCode: uniqueIndex('ux_customers_code').on(t.code),
}));
