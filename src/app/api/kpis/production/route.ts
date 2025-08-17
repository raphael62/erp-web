import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { label: "Open WOs", value: 7 },
    { label: "Completed (30d)", value: 21 },
    { label: "OEE", value: "78%" },
    { label: "Scrap Rate", value: "1.6%" },
  ]);
}
