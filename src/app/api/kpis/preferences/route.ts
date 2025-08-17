import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { label: "Companies", value: 1 },
    { label: "Tax Schemes", value: 2 },
    { label: "Users", value: 6 },
    { label: "Roles", value: 4 },
  ]);
}
