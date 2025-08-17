import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { label: "POs (30d)", value: 48 },
    { label: "Bills (30d)", value: 37 },
    { label: "Spend (30d)", value: "$72,310" },
    { label: "Suppliers", value: 28 },
  ]);
}
