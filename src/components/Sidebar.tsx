// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_MODULES, visible } from '@/config/modules';
import { useUIState } from '@/context/ui-state';
import clsx from 'clsx';

function findActiveModule(pathname: string) {
  if (pathname === '/') return MAIN_MODULES.find(m => m.href === '/');
  for (const m of MAIN_MODULES) {
    if (m.href !== '/' && pathname.startsWith(m.href)) return m;
    if (m.submenus?.some(s => pathname === s.href || pathname.startsWith(s.href + '/'))) return m;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const active = findActiveModule(pathname);
  const { isSidebarOpen } = useUIState();
  if (!active) return null;

  const collapsed = !isSidebarOpen;
  const subs = visible(active.submenus || []);

  return (
    <aside className={clsx(
      'shrink-0 border-r bg-white dark:bg-black/40 dark:border-white/10 transition-all',
      collapsed ? 'w-16' : 'w-60'
    )}>
      <div className="p-4 border-b dark:border-white/10">
        <h2 className={clsx('font-semibold text-sm uppercase tracking-wide text-gray-600 dark:text-gray-300',
          collapsed && 'text-center')}>
          {collapsed ? active.name[0] : active.name}
        </h2>
      </div>

      <nav className="p-2 space-y-1">
        {subs.map((s) => {
          const isActive = pathname === s.href || pathname.startsWith(s.href + '/');
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              title={collapsed ? s.name : undefined}
              className={clsx(
                'flex items-center gap-3 rounded px-3 py-2 text-sm transition',
                isActive
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10',
                collapsed && 'justify-center'
              )}
            >
              {Icon && <Icon className="h-4 w-4 opacity-90" />}
              {!collapsed && <span className="truncate">{s.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
