import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { label: "Open Invoices", value: 24, note: "$18,430 receivable" },
    { label: "Open Bills", value: 12, note: "$7,210 payable" },
    { label: "Cash Balance", value: "$54,920" },
    { label: "Journals (30d)", value: 71 },
  ]);
}
