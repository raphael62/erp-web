'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_MODULES, visible } from '@/config/modules';
import { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useUIState } from '@/context/ui-state';
import clsx from 'clsx';

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function isModuleActive(pathname: string, href: string, subHrefs: string[]) {
  if (href !== '/' && pathname.startsWith(href)) return true;
  return subHrefs.some((sub) => pathname === sub || pathname.startsWith(sub + '/'));
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isSidebarOpen, toggleSidebar } = useUIState();

  const items = visible(MAIN_MODULES).map((m) => ({
    name: m.name,
    href: m.href,
    subHrefs: (m.submenus || []).map((s) => s.href),
  }));

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-black/60">
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Left: sidebar toggle + brand */}
          <div className="flex items-center gap-2">
            <button
              className="hidden md:inline-flex items-center justify-center rounded p-2 hover:bg-gray-100 dark:hover:bg-white/10"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </button>

            <Link href="/" className="font-semibold text-lg leading-none">
              ERP
            </Link>
          </div>

          {/* Desktop links (single line, scroll if overflow) */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto whitespace-nowrap">
            {items.map(({ name, href, subHrefs }) => {
              const active = isModuleActive(pathname, href, subHrefs);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cx(
                    'px-3 py-2 rounded text-sm leading-none transition',
                    active
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10'
                  )}
                >
                  {name}
                </Link>
              );
            })}
          </div>

          {/* Right: theme + mobile menu */}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              className="md:hidden inline-flex items-center justify-center rounded p-2 hover:bg-gray-100 dark:hover:bg-white/10"
              aria-label="Open Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden pb-3">
            <div className="flex gap-1 overflow-x-auto whitespace-nowrap px-1">
              {items.map(({ name, href, subHrefs }) => {
                const active = isModuleActive(pathname, href, subHrefs);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cx(
                      'px-3 py-2 rounded text-sm leading-none',
                      active
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10'
                    )}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

