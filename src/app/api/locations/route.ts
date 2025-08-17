// src/app/api/locations/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  // version-agnostic, no lambda signature issues
  const rows = await db.select().from(locations).orderBy(asc(locations.code));
  return NextResponse.json(rows);
}


export async function POST(req: Request) {
  const body = (await req.json()) as {
    code?: string;
    name?: string;
    levelGroupName?: string | null;
    active?: boolean;
  };

  if (!body.code || !body.name) {
    return NextResponse.json(
      { error: "Code and Name are required" },
      { status: 400 }
    );
  }

  const [row] = await db
    .insert(locations)
    .values({
      code: body.code.trim(),
      name: body.name.trim(),
      levelGroupName: body.levelGroupName ?? null,
      active: body.active ?? true,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
