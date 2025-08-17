"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Toolbar from "@/components/ui/Toolbar";
import Button from "@/components/ui/Button";

type CustomerRow = {
  id: number;
  code: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  active?: boolean | null;
};

type SortKey = "code" | "name" | "phone" | "email" | "active";
type SortDir = "asc" | "desc";

export default function CustomersPage() {
  const [items, setItems] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const selectedCount = items.filter((r) => selected[r.id]).length;

  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    phone: "",
    email: "",
    active: true,
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/customers", { cache: "no-store" });
      const data = (await res.json()) as CustomerRow[];
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
        : items.filter((r) =>
            [r.code, r.name, r.phone ?? "", r.email ?? ""]
              .some((v) => v.toLowerCase().includes(q))
          );
    rows = [...rows].sort((a, b) => {
      const av = (a[sortKey] ?? "") as any;
      const bv = (b[sortKey] ?? "") as any;
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [items, search, sortKey, sortDir]);

  function openCreate() {
    setEditId(null);
    setForm({ code: "", name: "", phone: "", email: "", active: true });
    setError(null);
    setShow(true);
  }
  function openEdit(row: CustomerRow) {
    setEditId(row.id);
    setForm({
      code: row.code,
      name: row.name,
      phone: row.phone || "",
      email: row.email || "",
      active: row.active !== false,
    });
    setError(null);
    setShow(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      active: !!form.active,
    };
    try {
      let res: Response;
      if (editId == null) {
        res = await fetch("/api/customers", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/customers/${editId}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save");
      setShow(false);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function bulkToggleActive(active: boolean) {
    const ids = items.filter((r) => selected[r.id]).map((r) => r.id);
    if (ids.length === 0) return;
    setBusy(true);
    try {
      for (const id of ids) {
        const row = items.find((r) => r.id === id);
        if (!row) continue;
        await fetch(`/api/customers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: row.code,
            name: row.name,
            phone: row.phone ?? null,
            email: row.email ?? null,
            active,
          }),
        });
      }
      await load();
    } finally { setBusy(false); }
  }

  function exportCSV() {
    const header = ["Customer Code", "Customer Name", "Phone", "Email", "Active"];
    const rows = filteredSorted.map((r) => [
      r.code, r.name, r.phone ?? "", r.email ?? "", r.active === false ? "No" : "Yes",
    ]);
    const csv =
      [header, ...rows]
        .map((arr) => arr.map((v) => `"${String(v).replace(/"/g,'""')}"`).join(","))
        .join("\r\n") + "\r\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "customers.csv"; a.click(); URL.revokeObjectURL(url);
  }

  function toggleAll() {
    const next: Record<number, boolean> = {};
    if (items.every((r) => selected[r.id])) for (const r of items) next[r.id] = false;
    else for (const r of items) next[r.id] = true;
    setSelected(next);
  }
  function toggleOne(id: number) { setSelected((s) => ({ ...s, [id]: !s[id] })); }

  return (
    <main className="p-6">
      {/* Top: Search + Option only */}
      <Toolbar
        showActions={false}
        search={search}
        onSearchChange={setSearch}
        onSearch={() => {}}
        onOptionClick={() => {}}
      />

      {/* Table */}
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
              <Th label="Customer Code" active={sortKey === "code"} dir={sortDir} onClick={() => toggleSort("code")} width="160px" />
              <Th label="Customer Name" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
              <Th label="Phone" active={sortKey === "phone"} dir={sortDir} onClick={() => toggleSort("phone")} />
              <Th label="Email" active={sortKey === "email"} dir={sortDir} onClick={() => toggleSort("email")} />
              <Th label="Active" active={sortKey === "active"} dir={sortDir} onClick={() => toggleSort("active")} width="120px" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(7)].map((__, j) => (
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
                  <td className="border px-2 py-2">
                    <button className="text-purple-700 hover:underline" onClick={() => openEdit(r)}>{r.code}</button>
                  </td>
                  <td className="border px-2 py-2">
                    <button className="text-purple-700 hover:underline text-left" onClick={() => openEdit(r)}>{r.name}</button>
                  </td>
                  <td className="border px-2 py-2">{r.phone ?? ""}</td>
                  <td className="border px-2 py-2">{r.email ?? ""}</td>
                  <td className="border px-2 py-2">{r.active === false ? "No" : "Yes"}</td>
                </tr>
              ))
            ) : (
              <tr><td className="border px-3 py-3 text-gray-500" colSpan={7}>No customers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom: Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button onClick={openCreate} className="bg-purple-600 hover:bg-purple-700">New (F2)</Button>

        <div className="relative">
          <details className="group">
            <summary className="list-none">
              <Button variant="outline" className="!h-8">Deactivate/Reactivate ▾</Button>
            </summary>
            <div className="absolute mt-1 w-56 rounded border bg-white shadow">
              <button
                onClick={() => bulkToggleActive(false)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled={selectedCount === 0}
              >
                Deactivate selected
              </button>
              <button
                onClick={() => bulkToggleActive(true)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled={selectedCount === 0}
              >
                Reactivate selected
              </button>
            </div>
          </details>
        </div>

        <Button variant="outline" onClick={exportCSV}>Excel</Button>
        <Button variant="outline" onClick={() => { /* TODO: uploader */ }}>Web Uploader</Button>
      </div>

      {/* Modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[42rem] rounded bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editId == null ? "New Customer" : "Edit Customer"}</h2>
              <button className="text-gray-500 hover:text-black" onClick={() => setShow(false)} aria-label="Close">✕</button>
            </div>
            <form onSubmit={submit} className="grid grid-cols-2 gap-3">
              <Field label="Customer Code"><input className="w-full rounded border p-2" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} required /></Field>
              <Field label="Active"><select className="w-full rounded border p-2" value={form.active ? "yes" : "no"} onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === "yes" }))}><option value="yes">Yes</option><option value="no">No</option></select></Field>
              <Field label="Customer Name" colSpan={2}><input className="w-full rounded border p-2" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required /></Field>
              <Field label="Phone"><input className="w-full rounded border p-2" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></Field>
              <Field label="Email"><input className="w-full rounded border p-2" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></Field>
              {error && <p className="col-span-2 text-red-600">{error}</p>}
              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <Button variant="subtle" type="button" onClick={() => setShow(false)}>Cancel</Button>
                <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Th({ label, active, dir, onClick, width }: { label: string; active: boolean; dir: SortDir; onClick: () => void; width?: string; }) {
  return (
    <th className={clsx("select-none border px-2 py-2 text-left font-medium hover:bg-gray-100 cursor-pointer")} style={width ? { width } : undefined} onClick={onClick} title="Click to sort">
      <span className="inline-flex items-center gap-1">{label}<span className={clsx("text-[10px] opacity-60", !active && "invisible")}>{dir === "asc" ? "▲" : "▼"}</span></span>
    </th>
  );
}
function Field({ label, colSpan = 1, children }: { label: string; colSpan?: 1 | 2; children: React.ReactNode }) {
  return (<div className={clsx(colSpan === 2 && "col-span-2")}><label className="mb-1 block text-sm">{label}</label>{children}</div>);
}
