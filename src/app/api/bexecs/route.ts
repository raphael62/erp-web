import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { businessExecs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  const rows = await db.select().from(businessExecs).where(eq(businessExecs.isActive, true));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = await req.json();
  if (!b?.code || !b?.name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const [row] = await db.insert(businessExecs).values({
    code: String(b.code).trim(),
    name: String(b.name).trim(),
    phone: b.phone ? String(b.phone) : null,
  }).returning();
  return NextResponse.json(row, { status: 201 });
}
