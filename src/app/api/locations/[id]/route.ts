// src/app/api/locations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

// ⬇️ Adjust these to your project paths if needed
import { db } from "@/lib/db";
import { locations } from "@/db/schema";

// GET /api/locations/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id); // NaN-safe if id is already a string key

    const rows = await db
      .select()
      .from(locations)
      .where(eq(locations.id, idNum as any))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    console.error("GET /locations/:id error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT /api/locations/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id); // NaN-safe if id is already a string key
    const body = await req.json();

const updateData: Partial<typeof locations.$inferInsert> = {};

// allow updating 'code' (string)
if (typeof body.code === "string") updateData.code = body.code;

// allow updating 'groupName' (string or null)
if (typeof body.levelgroupName === "string" || body.levelgroupName === null) {
  updateData.levelGroupName = body.levelgroupName;
}

// allow updating 'active' (boolean)
if (typeof body.active === "boolean") updateData.active = body.active;

// usually we DON'T allow changing createdAt from the API — omit it

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(locations)
      .set(updateData)
      .where(eq(locations.id, idNum as any))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (err) {
    console.error("PUT /locations/:id error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/locations/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = Number(id); // NaN-safe if id is already a string key

    const deleted = await db
      .delete(locations)
      .where(eq(locations.id, idNum as any))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id }, { status: 200 });
  } catch (err) {
    console.error("DELETE /locations/:id error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
