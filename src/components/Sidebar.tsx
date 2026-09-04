'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV } from '@/lib/nav';

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="sticky top-0 z-20 flex w-full items-center gap-2 border-b border-white/10 bg-black/80 px-4 py-3 text-sm font-medium text-gray-300 backdrop-blur lg:hidden"
      >
        <span className="text-[#4DF98A]">☰</span> Menu
      </button>
      <nav
        className={`${
          open ? 'block' : 'hidden'
        } shrink-0 border-b border-white/10 px-4 py-6 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:border-r`}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="mb-6 block text-lg font-bold tracking-tight text-white"
        >
          SwapsPro <span className="text-[#4DF98A]">starter</span>
        </Link>
        {NAV.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                        active
                          ? 'bg-[#4DF98A]/10 font-medium text-[#4DF98A]'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <a
          href="https://www.swaps.pro/docs"
          target="_blank"
          rel="noreferrer"
          className="block rounded px-2 py-1.5 text-sm text-gray-500 transition-colors hover:text-white"
        >
          swaps.pro/docs ↗
        </a>
      </nav>
    </>
  );
}
