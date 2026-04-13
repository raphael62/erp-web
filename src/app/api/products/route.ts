// src/app/api/products/route.ts
import { NextResponse } from "next/server";

// List products
export async function GET() {
  // const rows = await db.select().from(products).limit(100);
  // return NextResponse.json(rows);
  return NextResponse.json({ ok: true, message: "products GET placeholder" });
}

// Create a product
export async function POST() {
  // const body = await req.json();
  // const inserted = await db.insert(products).values(body).returning();
  // return NextResponse.json(inserted[0], { status: 201 });
  return NextResponse.json({ ok: true, message: "products POST placeholder" }, { status: 201 });
}
