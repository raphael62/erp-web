import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { label: "Employees", value: 36 },
    { label: "Payroll (last)", value: "$12,440" },
    { label: "New Hires (30d)", value: 2 },
    { label: "Attrition (30d)", value: 0 },
  ]);
}
