import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { label: "Reports", value: 12 },
    { label: "Exports (30d)", value: 34 },
    { label: "Dashboards", value: 3 },
    { label: "Schedules", value: 2 },
  ]);
}
