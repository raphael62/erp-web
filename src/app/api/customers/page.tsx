'use client';

import React, { useEffect, useState } from 'react';

type Exec = { id: number; code: string; name: string };
type Loc  = { id: number; code: string; name: string };
type Customer = {
  id: number; code: string; name: string;
  priceType: 'Wholesale'|'Retail'|'Special';
  bexecsId: number | null;
  locationId: number | null;
  creditLimit: string | null;
};

export default function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [execs, setExecs] = useState<Exec[]>([]);
  const [locs, setLocs] = useState<Loc[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [form, setForm] = useState({
    code: '', name: '', priceType: 'Wholesale',
    bexecsId: '', locationId: '', creditLimit: ''
  });

  const load = async () => {
    const [c,e,l] = await Promise.all([
      fetch('/api/customers').then(r=>r.json()),
      fetch('/api/bexecs').then(r=>r.json()),
      fetch('/api/locations').then(r=>r.json()),
    ]);
    setItems(c); setExecs(e); setLocs(l);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const payload = {
        code: form.code,
        name: form.name,
        priceType: form.priceType,
        bexecsId: form.bexecsId ? Number(form.bexecsId) : null,
        locationId: form.locationId ? Number(form.locationId) : null,
        creditLimit: form.creditLimit ? Number(form.creditLimit) : undefined,
      };
      const res = await fetch('/api/customers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setForm({ code:'', name:'', priceType:'Wholesale', bexecsId:'', locationId:'', creditLimit:'' });
      await load();
    } catch (err:any) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Customers</h1>

      <form onSubmit={submit} className="grid gap-3 max-w-2xl sm:grid-cols-2">
        <input className="border px-3 py-2 rounded" placeholder="Code" value={form.code}
          onChange={e=>setForm(f=>({...f, code:e.target.value}))}/>
        <input className="border px-3 py-2 rounded" placeholder="Name" value={form.name}
          onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>

        <select className="border px-3 py-2 rounded" value={form.priceType}
          onChange={e=>setForm(f=>({...f, priceType:e.target.value as any}))}>
          <option>Wholesale</option><option>Retail</option><option>Special</option>
        </select>

        <select className="border px-3 py-2 rounded" value={form.bexecsId}
          onChange={e=>setForm(f=>({...f, bexecsId:e.target.value}))}>
          <option value="">– Business Exec –</option>
          {execs.map(x => <option key={x.id} value={x.id}>{x.code} — {x.name}</option>)}
        </select>

        <select className="border px-3 py-2 rounded" value={form.locationId}
          onChange={e=>setForm(f=>({...f, locationId:e.target.value}))}>
          <option value="">– Location –</option>
          {locs.map(x => <option key={x.id} value={x.id}>{x.code} — {x.name}</option>)}
        </select>

        <input className="border px-3 py-2 rounded" placeholder="Credit Limit"
          type="number" step="0.01" min="0" value={form.creditLimit}
          onChange={e=>setForm(f=>({...f, creditLimit:e.target.value}))}/>

        <button className="bg-black text-white px-4 py-2 rounded disabled:opacity-50 sm:col-span-2" disabled={busy}>
          {busy ? 'Saving…' : 'Add Customer'}
        </button>
        {error && <p className="text-red-600 sm:col-span-2">{error}</p>}
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Active Customers</h2>
        <table className="w-full max-w-4xl border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border text-left">Code</th>
              <th className="p-2 border text-left">Name</th>
              <th className="p-2 border text-left">Price Type</th>
              <th className="p-2 border text-left">Exec</th>
              <th className="p-2 border text-left">Location</th>
              <th className="p-2 border text-right">Credit Limit</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{c.code}</td>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.priceType}</td>
                <td className="p-2 border">{c.bexecsId ?? ''}</td>
                <td className="p-2 border">{c.locationId ?? ''}</td>
                <td className="p-2 border text-right">{c.creditLimit ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

