'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import CodeBlock from './CodeBlock';
import { API_BASE } from '@/lib/config';

export interface TryItParam {
  name: string;
  value: string;
  /** Renders a <select> instead of an <input>. */
  options?: { label: string; value: string }[];
  placeholder?: string;
  hint?: string;
  /** Omitted from the query string when the value is empty. */
  optional?: boolean;
}

interface Result {
  status: number;
  statusText: string;
  ms: number;
  body: string;
  ok: boolean;
}

/**
 * A live request against the real public API: edit the parameters, send it,
 * read the response, and copy the exact curl or fetch that produced it.
 *
 * Every API reference page on this site is this component plus prose — which
 * is the point. There is no key and no backend, so the browser can call the
 * API directly (CORS is open) and a reader never has to trust a screenshot.
 */
export default function TryIt({
  path,
  params: initial,
  autoRun = false,
  maxRows,
}: {
  path: string;
  params?: TryItParam[];
  /** Fire once on mount. Use only for unrated endpoints (/chains, /tokens). */
  autoRun?: boolean;
  /** Truncate the pretty-printed body to this many lines, with an expander. */
  maxRows?: number;
}) {
  const [params, setParams] = useState<TryItParam[]>(initial ?? []);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ran = useRef(false);

  const url = (() => {
    const q = new URLSearchParams();
    for (const p of params) {
      if (p.optional && !p.value.trim()) continue;
      q.set(p.name, p.value);
    }
    const qs = q.toString();
    return `${API_BASE}${path}${qs ? `?${qs}` : ''}`;
  })();

  const send = useCallback(async () => {
    setPending(true);
    const started = performance.now();
    try {
      const res = await fetch(url);
      const text = await res.text();
      let body = text;
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* not JSON — show it raw */
      }
      setResult({
        status: res.status,
        statusText: res.statusText,
        ms: Math.round(performance.now() - started),
        body,
        ok: res.ok,
      });
    } catch (err) {
      setResult({
        status: 0,
        statusText: 'Network error',
        ms: Math.round(performance.now() - started),
        body: err instanceof Error ? err.message : String(err),
        ok: false,
      });
    } finally {
      setPending(false);
      setExpanded(false);
    }
  }, [url]);

  useEffect(() => {
    if (autoRun && !ran.current) {
      ran.current = true;
      void send();
    }
  }, [autoRun, send]);

  function set(name: string, value: string) {
    setParams((ps) => ps.map((p) => (p.name === name ? { ...p, value } : p)));
  }

  const lines = result ? result.body.split('\n') : [];
  const truncated = !!maxRows && !expanded && lines.length > maxRows;
  const shown = truncated ? lines.slice(0, maxRows).join('\n') : result?.body;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="rounded bg-[#4DF98A]/15 px-2 py-0.5 font-mono text-xs font-semibold text-[#4DF98A]">
          GET
        </span>
        <span className="truncate font-mono text-sm text-gray-300">{path}</span>
        <span className="ml-auto text-xs text-gray-500">live request</span>
      </div>

      {params.length > 0 && (
        <div className="grid gap-3 border-b border-white/10 p-4 sm:grid-cols-2">
          {params.map((p) => (
            <label key={p.name} className="block">
              <span className="mb-1 block font-mono text-xs text-gray-400">
                {p.name}
                {p.optional && <span className="text-gray-600"> (optional)</span>}
              </span>
              {p.options ? (
                <select
                  value={p.value}
                  onChange={(e) => set(p.name, e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#4DF98A]/50"
                >
                  {p.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={p.value}
                  placeholder={p.placeholder}
                  onChange={(e) => set(p.name, e.target.value)}
                  className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 font-mono text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#4DF98A]/50"
                />
              )}
              {p.hint && <span className="mt-1 block text-xs text-gray-500">{p.hint}</span>}
            </label>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <button
          onClick={send}
          disabled={pending}
          className="rounded-md bg-[#4DF98A] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#3ce577] disabled:opacity-50"
        >
          {pending ? 'Sending…' : 'Send request'}
        </button>
        {result && (
          <span
            className={`font-mono text-xs ${result.ok ? 'text-[#4DF98A]' : 'text-red-400'}`}
          >
            {result.status || '—'} {result.statusText} · {result.ms} ms
          </span>
        )}
      </div>

      <div className="border-t border-white/10 px-4 pb-1 pt-3">
        <p className="mb-1 text-xs text-gray-500">Request URL</p>
        <p className="overflow-x-auto whitespace-pre font-mono text-xs text-gray-400">{url}</p>
      </div>

      {result && (
        <div className="px-4 pb-4">
          <p className="mb-1 mt-3 text-xs text-gray-500">Response</p>
          <pre className="max-h-[28rem] overflow-auto rounded-lg border border-white/10 bg-black/60 p-3 text-[12.5px] leading-relaxed text-gray-200">
            <code>{shown}</code>
          </pre>
          {truncated && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-2 text-xs text-[#4DF98A] hover:underline"
            >
              Show all {lines.length} lines
            </button>
          )}
        </div>
      )}

      <div className="border-t border-white/10 px-4 pb-4 pt-2">
        <CodeBlock
          tabs={[
            { label: 'curl', code: `curl "${url}"` },
            {
              label: 'fetch',
              code: `const res = await fetch(\n  "${url}"\n);\nconst data = await res.json();`,
            },
          ]}
        />
      </div>
    </div>
  );
}
