import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { pricelist, products } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';

export const runtime = 'nodejs';

// GET /api/pricelist?productId=...&activeOn=YYYY-MM-DD (both optional)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  const activeOn = searchParams.get('activeOn');

  const rows = await db
    .select({
      id: pricelist.id,
      productId: pricelist.productId,
      productCode: products.code,
      productName: products.name,
      priceType: pricelist.priceType,
      packUnit: pricelist.packUnit,
      unitPrice: pricelist.unitPrice,
      emptiesPrice: pricelist.emptiesPrice,
      taxRate: pricelist.taxRate,
      startDate: pricelist.startDate,
      endDate: pricelist.endDate,
      isActive: pricelist.isActive,
    })
    .from(pricelist)
    .leftJoin(products, eq(products.id, pricelist.productId))
    .where(
      and(
        productId ? eq(pricelist.productId, Number(productId)) : sql`true`,
        activeOn
          ? sql`${activeOn}::date between ${pricelist.startDate} and ${pricelist.endDate}`
          : sql`true`
      )
    )
    .orderBy(pricelist.productId, pricelist.priceType, pricelist.packUnit, pricelist.startDate);

  return NextResponse.json(rows);
}

// POST /api/pricelist
// body: {
//   productId:number,
//   priceType:'Wholesale'|'Retail'|'Special',
//   packUnit:number,
//   unitPrice:number,            // VAT-inclusive
//   emptiesPrice:number,         // NEW
//   taxRate:number,              // e.g. 15.00
//   startDate:'YYYY-MM-DD',
//   endDate?:'YYYY-MM-DD'
// }
export async function POST(req: Request) {
  try {
    const b = await req.json();

    // Required fields
    const required = ['productId','priceType','packUnit','unitPrice','emptiesPrice','taxRate','startDate'];
    for (const k of required) {
      if (b[k] == null || b[k] === '') {
        return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
      }
    }

    // Validate values
    if (!['Wholesale','Retail','Special'].includes(b.priceType))
      return NextResponse.json({ error: 'Invalid priceType' }, { status: 400 });

    const packUnit = Number(b.packUnit);
    if (!Number.isFinite(packUnit) || packUnit <= 0)
      return NextResponse.json({ error: 'packUnit must be a positive number' }, { status: 400 });

    const unitPrice = Number(b.unitPrice);
    const emptiesPrice = Number(b.emptiesPrice);
    const taxRate = Number(b.taxRate);

    if (!Number.isFinite(unitPrice) || unitPrice < 0)
      return NextResponse.json({ error: 'unitPrice must be >= 0' }, { status: 400 });

    if (!Number.isFinite(emptiesPrice) || emptiesPrice < 0)
      return NextResponse.json({ error: 'emptiesPrice must be >= 0' }, { status: 400 });

    if (!Number.isFinite(taxRate) || taxRate < 0)
      return NextResponse.json({ error: 'taxRate must be >= 0' }, { status: 400 });

    // Dates
    const start = new Date(b.startDate);
    const end = b.endDate ? new Date(b.endDate) : new Date('2099-12-31');
    if (isNaN(start.getTime()) || isNaN(end.getTime()))
      return NextResponse.json({ error: 'Invalid date(s)' }, { status: 400 });
    if (start > end)
      return NextResponse.json({ error: 'startDate cannot be after endDate' }, { status: 400 });

    // Insert (numeric fields → strings for postgres-js)
    const [row] = await db.insert(pricelist).values({
      productId: Number(b.productId),
      priceType: b.priceType,
      packUnit,
      unitPrice: String(unitPrice.toFixed(4)),
      emptiesPrice: String(emptiesPrice.toFixed(4)),
      taxRate: String(taxRate.toFixed(2)),
      startDate: b.startDate,
      endDate: b.endDate ?? '2099-12-31',
    }).returning();

    return NextResponse.json(row, { status: 201 });
  } catch (e: unknown) {
    const err = e as { message?: string };
    const msg = (err?.message || '').includes('ux_pricelist_range')
      ? 'A price already exists for this product/priceType/packUnit and date range.'
      : err?.message || 'Server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
