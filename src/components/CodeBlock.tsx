'use client';

import { useState } from 'react';

export interface CodeTab {
  label: string;
  /** Shown above the code as a filename or a note. */
  caption?: string;
  code: string;
}

/**
 * A copy-paste block. Optionally tabbed, so one sample can show the same call
 * as curl, as fetch and through the SDK.
 *
 * Deliberately has no syntax highlighter: a starter kit should not make a
 * developer install a 300 kB dependency to read its own source.
 */
export default function CodeBlock({
  code,
  caption,
  tabs,
}: {
  code?: string;
  caption?: string;
  tabs?: CodeTab[];
}) {
  const all: CodeTab[] = tabs ?? [{ label: '', caption, code: code ?? '' }];
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = all[Math.min(active, all.length - 1)];

  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-white/10 bg-black/60">
      <div className="flex items-center gap-1 border-b border-white/10 bg-white/5 px-2 py-1.5">
        {all.length > 1 &&
          all.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                i === active
                  ? 'bg-[#4DF98A]/15 text-[#4DF98A]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        <span className="truncate px-1 font-mono text-xs text-gray-500">
          {current.caption ?? ''}
        </span>
        <button
          onClick={copy}
          className="ml-auto shrink-0 rounded px-2.5 py-1 text-xs font-medium text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-gray-200">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}
