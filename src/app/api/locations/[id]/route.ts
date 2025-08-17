// src/app/api/locations/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { locations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

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

    await db
      .update(locations)
      .set({
        code: body.code.trim(),
        name: body.name.trim(),
        levelGroupName: body.levelGroupName ?? null,
        active: body.active ?? true,
      })
      .where(eq(locations.id, id));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const rows = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
  const row = rows[0];
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}


export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  await db.delete(locations).where(eq(locations.id, id));
  return NextResponse.json({ ok: true });
}
