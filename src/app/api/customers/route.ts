import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  const rows = await db.select().from(customers).where(eq(customers.isActive, true));
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = await req.json();
  if (!b?.code || !b?.name || !b?.priceType) {
    return NextResponse.json({ error: 'Missing code, name, or priceType' }, { status: 400 });
  }
  if (!['Wholesale','Retail','Special'].includes(b.priceType)) {
    return NextResponse.json({ error: 'Invalid priceType' }, { status: 400 });
  }

  const [row] = await db.insert(customers).values({
    code: String(b.code).trim(),
    name: String(b.name).trim(),
    businessName: b.businessName ?? null,
    priceType: b.priceType,
    mobile: b.mobile ?? null,
    email: b.email ?? null,
    businessAddress: b.businessAddress ?? null,
    custType: b.custType ?? null,
    bexecsId: b.bexecsId ?? null,
    creditLimit: b.creditLimit != null ? String(Number(b.creditLimit).toFixed(2)) : null,
    locationId: b.locationId ?? null,
  }).returning();

  return NextResponse.json(row, { status: 201 });
}
