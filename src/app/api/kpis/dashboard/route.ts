import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { label: "Revenue (MTD)", value: "$129,450" },
    { label: "COGS (MTD)", value: "$72,310" },
    { label: "Gross Margin", value: "44%" },
    { label: "Orders (MTD)", value: 162 },
  ]);
}
