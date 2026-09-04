'use client';

import { useEffect, useState } from 'react';
import type { Chain, Token } from '@swapspro/sdk';
import { swaps } from '@/lib/swaps';

/**
 * The two discovery calls, wired to real pickers.
 *
 * The point it demonstrates: `sellSupported` is on the record so a pair
 * selector can be built BEFORE quoting — a destination-only chain is disabled
 * in the sell picker rather than discovered from an UNSUPPORTED_PAIR error.
 */
export default function Discovery() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [chain, setChain] = useState('BASE');
  const [error, setError] = useState<string | null>(null);
  const [loadingTokens, setLoadingTokens] = useState(false);

  useEffect(() => {
    swaps
      .chains()
      .then(setChains)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    let live = true;
    setLoadingTokens(true);
    swaps
      .tokens(chain)
      .then((t) => live && setTokens(t))
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)))
      .finally(() => live && setLoadingTokens(false));
    return () => {
      live = false;
    };
  }, [chain]);

  const sellable = chains.filter((c) => c.sellSupported !== false);
  const destinationOnly = chains.filter((c) => c.sellSupported === false);

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      {error && (
        <p className="mb-3 rounded border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-mono text-xs text-gray-400">
            swaps.chains() — {chains.length || '…'} chains
          </span>
          <select
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#4DF98A]/50"
          >
            {chains.map((c) => (
              <option key={c.id} value={c.id} disabled={c.sellSupported === false}>
                {c.name} ({c.id}
                {c.chainId ? ` · ${c.chainId}` : ''})
                {c.sellSupported === false ? ' — destination only' : ''}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-gray-500">
            {sellable.length} sellable
            {destinationOnly.length > 0 && (
              <>
                {' · '}
                {destinationOnly.map((c) => c.id).join(', ')} disabled as a sell chain
              </>
            )}
          </span>
        </label>

        <label className="block">
          <span className="mb-1 block font-mono text-xs text-gray-400">
            swaps.tokens(&quot;{chain}&quot;) — {loadingTokens ? '…' : tokens.length}
          </span>
          <select className="w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#4DF98A]/50">
            {tokens.map((t) => (
              <option key={t.caip} value={t.symbol}>
                {t.symbol} — {t.name}
                {t.isToken ? '' : ' (native)'}
              </option>
            ))}
          </select>
          <span className="mt-1 block truncate font-mono text-xs text-gray-500">
            {tokens[0]?.caip ?? ' '}
          </span>
        </label>
      </div>

      {tokens.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-3 py-2 font-medium">Symbol</th>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">CAIP-19</th>
                <th className="px-3 py-2 font-medium">Decimals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tokens.slice(0, 8).map((t) => (
                <tr key={t.caip}>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-[13px] text-[#4DF98A]">
                    {t.symbol}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-300">{t.name}</td>
                  <td className="max-w-[22rem] truncate px-3 py-2 font-mono text-[12px] text-gray-500">
                    {t.caip}
                  </td>
                  <td className="px-3 py-2 font-mono text-[13px] text-gray-400">
                    {t.decimals ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tokens.length > 8 && (
            <p className="border-t border-white/10 px-3 py-2 text-xs text-gray-500">
              {tokens.length - 8} more — the list is curated, not an index of every token
              on the chain.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
