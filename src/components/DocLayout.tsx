import Link from 'next/link';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { siblings } from '@/lib/nav';

/**
 * Sidebar + content + prev/next. Wraps every page except the homepage, which
 * renders the index itself.
 */
export default function DocLayout({
  href,
  wide = false,
  children,
}: {
  href: string;
  /** Widens the column for index-style pages. */
  wide?: boolean;
  children: ReactNode;
}) {
  const { prev, next } = siblings(href);

  return (
    <div className="min-h-screen bg-[#07090b] text-white lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div
          className={`mx-auto px-5 py-10 sm:px-8 lg:py-16 ${wide ? 'max-w-5xl' : 'max-w-3xl'}`}
        >
          {children}
          <nav className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
            {prev ? (
              <Link
                href={prev.href}
                className="group rounded-lg border border-white/10 px-4 py-3 transition-colors hover:border-[#4DF98A]/40"
              >
                <span className="block text-xs text-gray-500">← Previous</span>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={next.href}
                className="group rounded-lg border border-white/10 px-4 py-3 text-right transition-colors hover:border-[#4DF98A]/40"
              >
                <span className="block text-xs text-gray-500">Next →</span>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        </div>
      </main>
    </div>
  );
}
