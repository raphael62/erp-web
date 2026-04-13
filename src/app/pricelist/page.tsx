"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Toolbar from "@/components/ui/Toolbar";
import Button from "@/components/ui/Button";

type PriceRow = {
  id: number;
  productId: number;             // adjust if your API returns productCode instead
  priceType: string;
  packUnit: string;
  unitPrice: number;
  emptiesPrice?: number | null;
  taxRate?: number | null;
  startDate: string;             // ISO date string
  endDate?: string | null;       // ISO or null
};

type SortKey =
  | "productId" | "priceType" | "packUnit"
  | "unitPrice" | "emptiesPrice" | "taxRate"
  | "startDate" | "endDate";
type SortDir = "asc" | "desc";

export default function PriceListPage() {
  const [items, setItems] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);

  // table ui
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("productId");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // selection
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  // modal
  const [isOpen, setIsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    productId: "",
    priceType: "Retail",
    packUnit: "",
    unitPrice: "",
    emptiesPrice: "",
    taxRate: "",
    startDate: "",
    endDate: "",
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/pricelist", { cache: "no-store" });
      const data = (await res.json()) as PriceRow[];
      setItems(data);
      setSelected((prev) => {
        const next: Record<number, boolean> = {};
        for (const row of data) next[row.id] = prev[row.id] || false;
        return next;
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows =
      q === ""
        ? items
        : items.filter(
            (r) =>
              String(r.productId).toLowerCase().includes(q) ||
              r.priceType.toLowerCase().includes(q) ||
              r.packUnit.toLowerCase().includes(q)
          );

    rows = [...rows].sort((a, b) => {
      const av = String(a[sortKey] ?? "");
      const bv = String(b[sortKey] ?? "");
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [items, search, sortKey, sortDir]);

  function openCreate() {
    setEditId(null);
    setForm({
      productId: "",
      priceType: "Retail",
      packUnit: "",
      unitPrice: "",
      emptiesPrice: "",
      taxRate: "",
      startDate: "",
      endDate: "",
    });
    setError(null);
    setIsOpen(true);
  }
  function openEdit(row: PriceRow) {
    setEditId(row.id);
    setForm({
      productId: String(row.productId),
      priceType: row.priceType,
      packUnit: row.packUnit,
      unitPrice: String(row.unitPrice),
      emptiesPrice: row.emptiesPrice ? String(row.emptiesPrice) : "",
      taxRate: row.taxRate ? String(row.taxRate) : "",
      startDate: row.startDate?.slice(0, 10) || "",
      endDate: row.endDate ? row.endDate.slice(0, 10) : "",
    });
    setError(null);
    setIsOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload = {
        productId: Number(form.productId),
        priceType: form.priceType,
        packUnit: form.packUnit,
        unitPrice: Number(form.unitPrice),
        emptiesPrice: form.emptiesPrice ? Number(form.emptiesPrice) : null,
        taxRate: form.taxRate ? Number(form.taxRate) : null,
        startDate: form.startDate,
        endDate: form.endDate || null,
      };
      let res: Response;
      if (editId == null) {
        res = await fetch("/api/pricelist", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/pricelist/${editId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save");
      setIsOpen(false);
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  // export
  function exportCSV() {
    const header = [
      "Product", "Price Type", "Pack Unit", "Unit Price",
      "Empties Price", "Tax Rate", "Start Date", "End Date",
    ];
    const rows = filteredSorted.map((r) => [
      r.productId, r.priceType, r.packUnit, r.unitPrice,
      r.emptiesPrice ?? "", r.taxRate ?? "", r.startDate, r.endDate ?? "",
    ]);
    const csv =
      [header, ...rows]
        .map((arr) => arr.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\r\n") + "\r\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "pricelist.csv"; a.click(); URL.revokeObjectURL(url);
  }

  // selection
  function toggleAll() {
    const next: Record<number, boolean> = {};
    if (items.every((r) => selected[r.id])) for (const r of items) next[r.id] = false;
    else for (const r of items) next[r.id] = true;
    setSelected(next);
  }
  function toggleOne(id: number) { setSelected((s) => ({ ...s, [id]: !s[id] })); }

  return (
    <main className="p-6">
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        onSearch={() => {/* filter on Enter handled in input */}}
        onOptionClick={() => {/* future options */}}
        onNew={openCreate}
        onExport={exportCSV}
        onUpload={() => {/* TODO */}}
        supportsDeactivate={false}   // Pricelist has no active column
      />

      <div className="overflow-auto rounded border">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr>
              <th className="border px-2 py-2 w-12 text-center">#</th>
              <th className="border px-2 py-2 w-10 text-center">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={items.length > 0 && items.every((r) => selected[r.id])}
                  ref={(el) => {
                    if (!el) return;
                    const all = items.length > 0 && items.every((r) => selected[r.id]);
                    const some = items.some((r) => selected[r.id]);
                    el.indeterminate = some && !all;
                  }}
                  onChange={toggleAll}
                />
              </th>
              <Th label="Product" active={sortKey === "productId"} dir={sortDir} onClick={() => toggleSort("productId")} />
              <Th label="Price Type" active={sortKey === "priceType"} dir={sortDir} onClick={() => toggleSort("priceType")} />
              <Th label="Pack Unit" active={sortKey === "packUnit"} dir={sortDir} onClick={() => toggleSort("packUnit")} />
              <Th label="Unit Price" active={sortKey === "unitPrice"} dir={sortDir} onClick={() => toggleSort("unitPrice")} />
              <Th label="Empties Price" active={sortKey === "emptiesPrice"} dir={sortDir} onClick={() => toggleSort("emptiesPrice")} />
              <Th label="Tax Rate" active={sortKey === "taxRate"} dir={sortDir} onClick={() => toggleSort("taxRate")} />
              <Th label="Start Date" active={sortKey === "startDate"} dir={sortDir} onClick={() => toggleSort("startDate")} />
              <Th label="End Date" active={sortKey === "endDate"} dir={sortDir} onClick={() => toggleSort("endDate")} />
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(10)].map((__, j) => (
                    <td key={j} className="border px-2 py-2">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredSorted.length ? (
              filteredSorted.map((r, idx) => (
                <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-2 py-2 text-center text-xs text-gray-500">{idx + 1}</td>
                  <td className="border px-2 py-2 text-center">
                    <input type="checkbox" checked={!!selected[r.id]} onChange={() => toggleOne(r.id)} />
                  </td>

                  {/* Click to edit on product or price type */}
                  <td className="border px-2 py-2">
                    <button className="text-purple-700 hover:underline" onClick={() => openEdit(r)}>{r.productId}</button>
                  </td>
                  <td className="border px-2 py-2">
                    <button className="text-purple-700 hover:underline text-left" onClick={() => openEdit(r)}>{r.priceType}</button>
                  </td>

                  <td className="border px-2 py-2">{r.packUnit}</td>
                  <td className="border px-2 py-2">{r.unitPrice}</td>
                  <td className="border px-2 py-2">{r.emptiesPrice ?? ""}</td>
                  <td className="border px-2 py-2">{r.taxRate ?? ""}</td>
                  <td className="border px-2 py-2">{r.startDate?.slice(0, 10)}</td>
                  <td className="border px-2 py-2">{r.endDate ? r.endDate.slice(0, 10) : ""}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-3 py-3 text-gray-500" colSpan={10}>No prices found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[48rem] rounded bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editId == null ? "Create Price" : "Edit Price"}</h2>
              <button
                className="text-gray-500 hover:text-black"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="grid grid-cols-2 gap-3">
              <Field label="Product ID">
                <input className="w-full rounded border p-2" value={form.productId} onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))} required />
              </Field>
              <Field label="Price Type">
                <select className="w-full rounded border p-2" value={form.priceType} onChange={(e) => setForm((f) => ({ ...f, priceType: e.target.value }))}>
                  <option>Retail</option><option>Wholesale</option><option>Promo</option>
                </select>
              </Field>
              <Field label="Pack Unit">
                <input className="w-full rounded border p-2" value={form.packUnit} onChange={(e) => setForm((f) => ({ ...f, packUnit: e.target.value }))} required />
              </Field>
              <Field label="Unit Price">
                <input className="w-full rounded border p-2" value={form.unitPrice} onChange={(e) => setForm((f) => ({ ...f, unitPrice: e.target.value }))} required />
              </Field>
              <Field label="Empties Price">
                <input className="w-full rounded border p-2" value={form.emptiesPrice} onChange={(e) => setForm((f) => ({ ...f, emptiesPrice: e.target.value }))} />
              </Field>
              <Field label="Tax Rate">
                <input className="w-full rounded border p-2" value={form.taxRate} onChange={(e) => setForm((f) => ({ ...f, taxRate: e.target.value }))} />
              </Field>
              <Field label="Start Date">
                <input type="date" className="w-full rounded border p-2" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} required />
              </Field>
              <Field label="End Date">
                <input type="date" className="w-full rounded border p-2" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </Field>

              {error && <p className="col-span-2 text-red-600">{error}</p>}

              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <Button variant="subtle" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Th({
  label, active, dir, onClick, width,
}: { label: string; active: boolean; dir: SortDir; onClick: () => void; width?: string }) {
  return (
    <th
      className={clsx(
        "select-none border px-2 py-2 text-left font-medium",
        "hover:bg-gray-100 cursor-pointer"
      )}
      style={width ? { width } : undefined}
      onClick={onClick}
      title="Click to sort"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={clsx("text-[10px] opacity-60", !active && "invisible")}>
          {dir === "asc" ? "▲" : "▼"}
        </span>
      </span>
    </th>
  );
}

function Field({ label, colSpan = 1, children }: { label: string; colSpan?: 1 | 2; children: React.ReactNode }) {
  return (
    <div className={clsx(colSpan === 2 && "col-span-2")}>
      <label className="mb-1 block text-sm">{label}</label>
      {children}
    </div>
  );
}
