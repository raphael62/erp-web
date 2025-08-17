'use client';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'>(() => 'light');

  // initialize from localStorage or prefers-color-scheme
  useEffect(() => {
    const ls = localStorage.getItem('theme');
    if (ls === 'dark' || ls === 'light') {
      setTheme(ls as 'light'|'dark');
      document.documentElement.classList.toggle('dark', ls === 'dark');
      return;
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = prefersDark ? 'dark' : 'light';
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  return (
    <button
      onClick={toggle}
      className={clsx(
        'inline-flex items-center gap-2 rounded px-3 py-2 text-sm transition',
        'hover:bg-gray-100 dark:hover:bg-white/10'
      )}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
    </button>
  );
}
