'use client';

import Link from 'next/link';
import { MAIN_MODULES } from '@/config/modules';

export default function Home() {
  const modules = MAIN_MODULES.filter(m => m.visible !== false);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-2">ERP Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6 dark:text-gray-300">
        Quick links to your modules. Edit{' '}
        <code className="px-1 rounded bg-gray-100 dark:bg-white/10">
          src/config/modules.ts
        </code>{' '}
        to add/remove items.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="group block rounded-xl p-5 text-white shadow hover:shadow-md transition bg-gray-800"
            >
              <div className="flex items-center gap-3 mb-2">
                {Icon && <Icon className="w-5 h-5" />}
                <h2 className="text-xl font-semibold">{m.name}</h2>
              </div>
              {m.submenus?.length ? (
                <p className="text-white/90 text-sm">
                  {m.submenus.slice(0, 3).map(s => s.name).join(' • ')}
                  {m.submenus.length > 3 ? '…' : ''}
                </p>
              ) : null}
              <span className="inline-block mt-4 text-xs uppercase tracking-wide opacity-80 group-hover:opacity-100">
                Open →
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
