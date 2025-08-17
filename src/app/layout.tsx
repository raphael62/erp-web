// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';            // if you don't use React Query, you can remove this line + wrapper
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { UIStateProvider } from '@/context/ui-state';

export const metadata: Metadata = {
  title: 'ERP',
  description: 'ERP App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
        <UIStateProvider>
          {/* If you don't have ./providers.tsx, replace <Providers>...</Providers> with <>...</> */}
          <Providers>
            <Navbar />
            <div className="mx-auto max-w-7xl px-4">
              <div className="flex gap-6">
                <Sidebar />
                <main className="flex-1 py-6">{children}</main>
              </div>
            </div>
          </Providers>
        </UIStateProvider>
      </body>
    </html>
  );
}

