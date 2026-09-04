import type { ReactNode } from 'react';

const STYLES = {
  note: 'border-sky-400/30 bg-sky-400/5 text-sky-100',
  gotcha: 'border-amber-400/30 bg-amber-400/5 text-amber-100',
  danger: 'border-red-400/40 bg-red-400/5 text-red-100',
} as const;

const LABELS = {
  note: 'Note',
  gotcha: 'Gotcha',
  danger: 'Real funds',
} as const;

/** A fact worth interrupting the page for. */
export default function Callout({
  kind = 'note',
  title,
  children,
}: {
  kind?: keyof typeof STYLES;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`my-5 rounded-lg border px-4 py-3 text-sm leading-relaxed ${STYLES[kind]}`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-80">
        {title ?? LABELS[kind]}
      </p>
      <div className="space-y-2 [&_code]:rounded [&_code]:bg-black/40 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]">
        {children}
      </div>
    </div>
  );
}
