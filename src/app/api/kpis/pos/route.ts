import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { label: "Registers", value: 4 },
    { label: "Transactions (7d)", value: 921 },
    { label: "Avg Ticket", value: "$18.40" },
    { label: "Refunds (7d)", value: 5 },
  ]);
}
