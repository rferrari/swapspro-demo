import type { ReactNode } from 'react';

/**
 * Every page opens the same way: what it is, what you will be able to build
 * after reading it, and where the upstream documentation lives.
 */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  doc,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  doc?: string;
}) {
  return (
    <header className="border-b border-white/10 pb-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#4DF98A]">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <div className="mt-4 max-w-2xl text-[15px] leading-relaxed text-gray-400 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]">
        {intro}
      </div>
      {doc && (
        <a
          href={doc}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-[#4DF98A]"
        >
          Everything below is on this page — the original doc is at{' '}
          <span className="font-mono">{doc.replace('https://www.swaps.pro', '')}</span> ↗
        </a>
      )}
    </header>
  );
}
