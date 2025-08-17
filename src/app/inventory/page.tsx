"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Warehouse,
} from "lucide-react";

/* ---------- types ---------- */
type KPI = {
  label: string;
  value: string | number;
  delta?: number;        // +8.2 means +8.2%
  spark?: number[];      // sparkline values
  icon: React.ReactNode; // lucide icon
};

type LowStockRow = {
  id: number;
  code: string;
  name: string;
  qty: number;
  minQty: number;
};

/* ---------- helpers ---------- */
function formatDelta(n?: number) {
  if (n == null) return null;
  const pos = n >= 0;
  const Icon = pos ? TrendingUp : TrendingDown;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium",
        pos ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {pos ? "+" : ""}
      {Math.abs(n).toFixed(1)}%
    </span>
  );
}

function Sparkline({ data, width = 90, height = 28, stroke = "#6366F1" }: {
  data?: number[];
  width?: number;
  height?: number;
  stroke?: string;
}) {
  if (!data || data.length < 2) {
    return <div className="h-[28px]" />;
  }
  const max = Math.max(...data);
  const min = Math.min(...data);
  const dx = width / (data.length - 1);
  const scaleY = (v: number) =>
    height - ((v - min) / (max - min || 1)) * height;

  const d = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * dx},${scaleY(v)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <path d={d} fill="none" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

/* ---------- page ---------- */
export default function InventoryOverview() {
  // Demo data — swap with real API later
  const [kpis] = useState<KPI[]>([
    {
      label: "Total Items",
      value: 2847,
      delta: +3.2,
      spark: [24, 26, 28, 29, 31, 32, 33],
      icon: <Package className="h-5 w-5 text-indigo-600" />,
    },
    {
      label: "Total Value",
      value: "$847,293",
      delta: +8.2,
      spark: [640, 690, 720, 710, 755, 810, 847],
      icon: <DollarSign className="h-5 w-5 text-indigo-600" />,
    },
    {
      label: "Low Stock Items",
      value: 15,
      delta: -2.4,
      spark: [20, 21, 19, 18, 17, 16, 15],
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    },
    {
      label: "Warehouses",
      value: 3,
      delta: 0,
      spark: [2, 2, 2, 3, 3, 3, 3],
      icon: <Warehouse className="h-5 w-5 text-indigo-600" />,
    },
  ]);

  const [lowStock] = useState<LowStockRow[]>([
    { id: 1, code: "10001", name: "Depot Central", qty: 8, minQty: 20 },
    { id: 2, code: "10002", name: "Depot Cape", qty: 2, minQty: 15 },
    { id: 3, code: "10003", name: "Achimota Shop", qty: 5, minQty: 12 },
    { id: 4, code: "10004", name: "Depot Salvat", qty: 1, minQty: 10 },
  ]);

  const criticalCount = useMemo(
    () => lowStock.filter((r) => r.qty <= Math.max(1, Math.floor(r.minQty * 0.25))).length,
    [lowStock]
  );

  return (
    <main className="p-6">
      {/* header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-gray-500">
            Manage stock levels, warehouses, and inventory movements.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/inventory/items"
            className="inline-flex h-9 items-center rounded border border-gray-300 bg-white px-3 text-sm hover:bg-gray-50"
          >
            Items &amp; Products
          </Link>
          <Link
            href="/inventory/new"
            className="inline-flex h-9 items-center rounded bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="group overflow-hidden rounded-xl border bg-white/90 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative grid grid-cols-[1fr_auto] gap-3 p-4">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500">
                  {k.icon}
                  {k.label}
                </div>
                <div className="text-2xl font-semibold text-gray-900">{k.value}</div>
                <div className="mt-1">{formatDelta(k.delta)}</div>
              </div>
              <div className="self-end">
                <Sparkline data={k.spark} />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Low stock panel */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="text-base font-semibold">
            Low Stock Alerts
            {criticalCount > 0 && (
              <span className="ml-2 rounded bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                {criticalCount} critical
              </span>
            )}
          </h2>

          <Link
            href="/inventory/items"
            className="inline-flex h-8 items-center rounded border border-gray-300 bg-white px-3 text-sm hover:bg-gray-50"
          >
            View All
          </Link>
        </div>

        <div className="overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th className="w-12 text-center">#</Th>
                <Th>Location Code</Th>
                <Th>Location Name</Th>
                <Th className="text-right">Qty</Th>
                <Th className="text-right">Min Qty</Th>
                <Th className="text-right">Gap</Th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-gray-500" colSpan={6}>
                    No low stock items.
                  </td>
                </tr>
              ) : (
                lowStock.map((r, idx) => {
                  const gap = r.minQty - r.qty;
                  const critical = r.qty <= Math.max(1, Math.floor(r.minQty * 0.25));
                  return (
                    <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                      <Td className="text-center text-xs text-gray-500">{idx + 1}</Td>
                      <Td className="font-medium">{r.code}</Td>
                      <Td>{r.name}</Td>
                      <Td className="text-right">{r.qty}</Td>
                      <Td className="text-right">{r.minQty}</Td>
                      <Td
                        className={clsx(
                          "text-right font-medium",
                          critical ? "text-rose-600" : "text-amber-600"
                        )}
                      >
                        {gap > 0 ? `-${gap}` : 0}
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

/* ---------- tiny table helpers ---------- */
function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={clsx(
        "border-b px-3 py-2 text-left font-medium text-gray-700",
        className
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <td className={clsx("border-t px-3 py-2", className)}>
      {children}
    </td>
  )
}
