"use client";

import Link from "next/link";
import { MAIN_MODULES, visible } from "@/config/modules";
import { useCurrentModule } from "@/hooks/useCurrentModule";
import ModuleKPIs from "./ModuleKPIs";

export default function ModuleOverview() {
  const module = useCurrentModule();

  if (!module) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-gray-500">No module context found for this route.</p>
      </main>
    );
  }

  const cards = visible(module.submenus || []).filter(s => s.href !== module.href);

  return (
    <main className="p-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{module.name}</h1>
        <p className="text-gray-500">Overview</p>
      </div>

      {/* Module-specific KPIs */}
      <ModuleKPIs />

      {/* Quick links */}
      {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-lg border p-5 hover:bg-gray-50 block"
            >
              <div className="text-lg font-semibold mb-1">{s.name}</div>
              <div className="text-gray-500 text-sm">Open {s.name}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

