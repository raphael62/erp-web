"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Toolbar from "@/components/ui/Toolbar";
import Button from "@/components/ui/Button";

type LocationRow = {
  id: number;
  code: string;
  name: string;
  levelGroupName?: string | null;
  active?: boolean | null;
};

type SortKey = "code" | "name" | "levelGroupName" | "active";
type SortDir = "asc" | "desc";

export default function LocationsPage() {
  const [items, setItems] = useState<LocationRow[]>([]);
  const [loading, setLoading] = useState(true);

  // table ui
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // selection
  const [selected, setSelected] = useState<Record<number, boolean>>({});
  const selectedCount = items.filter((r) => selected[r.id]).length;

  // modal
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    levelGroupName: "",
    active: true,
  });

  // load
  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/locations", { cache: "no-store" });
      const data = (await res.json()) as LocationRow[];
      setItems(data);
      // rebuild selection map
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

  // sort
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
              r.code.toLowerCase().includes(q) ||
              r.name.toLowerCase().includes(q) ||
              (r.levelGroupName || "").toLowerCase().includes(q)
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

  // create / edit modal
  function openCreate() {
    setEditId(null);
    setForm({ code: "", name: "", levelGroupName: "", active: true });
    setError(null);
    setShow(true);
  }
  function openEdit(row: LocationRow) {
    setEditId(row.id);
    setForm({
      code: row.code,
      name: row.name,
      levelGroupName: row.levelGroupName || "",
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
      levelGroupName: form.levelGroupName.trim() || null,
      active: !!form.active,
    };
    try {
      let res: Response;
      if (editId == null) {
        res = await fetch("/api/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/locations/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save location");
      setShow(false);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // bulk toggle active
  async function bulkToggleActive(active: boolean) {
    const ids = items.filter((r) => selected[r.id]).map((r) => r.id);
    if (ids.length === 0) return;
    setBusy(true);
    try {
      for (const id of ids) {
        const row = items.find((r) => r.id === id);
        if (!row) continue;
        await fetch(`/api/locations/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: row.code,
            name: row.name,
            levelGroupName: row.levelGroupName ?? null,
            active,
          }),
        });
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  // export
  function exportCSV() {
    const header = ["Location Code", "Location Name", "Level Group Name", "Active"];
    const rows = filteredSorted.map((r) => [
      r.code,
      r.name,
      r.levelGroupName ?? "",
      r.active === false ? "No" : "Yes",
    ]);
    const csv =
      [header, ...rows]
        .map((arr) => arr.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
        .join("\r\n") + "\r\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "locations.csv"; a.click(); URL.revokeObjectURL(url);
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
        supportsDeactivate={true}
        selectedCount={selectedCount}
        onDeactivateSelected={() => bulkToggleActive(false)}
        onReactivateSelected={() => bulkToggleActive(true)}
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
              <Th label="Location Code" active={sortKey === "code"} dir={sortDir} onClick={() => toggleSort("code")} width="160px" />
              <Th label="Location Name" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
              <Th label="Level Group Name" active={sortKey === "levelGroupName"} dir={sortDir} onClick={() => toggleSort("levelGroupName")} />
              <Th label="Active" active={sortKey === "active"} dir={sortDir} onClick={() => toggleSort("active")} width="120px" />
            </tr>
          </thead>

          <tbody>
            {loading ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {[...Array(6)].map((__, j) => (
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
                  {/* clickable to edit */}
                  <td className="border px-2 py-2">
                    <button className="text-purple-700 hover:underline" onClick={() => openEdit(r)}>{r.code}</button>
                  </td>
                  <td className="border px-2 py-2">
                    <button className="text-purple-700 hover:underline text-left" onClick={() => openEdit(r)}>{r.name}</button>
                  </td>
                  <td className="border px-2 py-2">{r.levelGroupName ?? ""}</td>
                  <td className="border px-2 py-2">{r.active === false ? "No" : "Yes"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-3 py-3 text-gray-500" colSpan={6}>No locations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit modal */}
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[40rem] rounded bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editId == null ? "New Location" : "Edit Location"}
              </h2>
              <button
                className="text-gray-500 hover:text-black"
                onClick={() => setShow(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submit} className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm">Location Code</label>
                <input
                  className="w-full rounded border p-2"
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Active</label>
                <select
                  className="w-full rounded border p-2"
                  value={form.active ? "yes" : "no"}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === "yes" }))}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="mb-1 block text-sm">Location Name</label>
                <input
                  className="w-full rounded border p-2"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1 block text-sm">Level Group Name</label>
                <input
                  className="w-full rounded border p-2"
                  value={form.levelGroupName}
                  onChange={(e) => setForm((f) => ({ ...f, levelGroupName: e.target.value }))}
                />
              </div>

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
