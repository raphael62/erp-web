import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { label: "Metric A", value: "—" },
    { label: "Metric B", value: "—" },
    { label: "Metric C", value: "—" },
    { label: "Metric D", value: "—" },
  ]);
}
