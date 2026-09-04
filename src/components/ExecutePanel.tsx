'use client';

import { useState } from 'react';
import type { Quote } from '@swapspro/sdk';
import { ChainMismatchError, NotSupportedError, SwapsProError } from '@swapspro/sdk';
import { swaps } from '@/lib/swaps';

/** The minimal EIP-1193 surface the SDK needs. window.ethereum qualifies. */
interface Eth {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
}
const getEth = (): Eth | undefined =>
  (window as unknown as { ethereum?: Eth }).ethereum;

/**
 * The real execution path over raw EIP-1193 — no wallet library at all.
 *
 * This signs on Base mainnet with real funds. Every stage is surfaced rather
 * than logged, because knowing what each failure looks like is most of what a
 * starter kit is for.
 */
export default function ExecutePanel() {
  const [account, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState('0.001');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<{ code: string; message: string; hint?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function connect() {
    const eth = getEth();
    if (!eth) return setError({ code: 'NO_WALLET', message: 'No injected wallet found in this browser.' });
    const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
    setAccount(accounts[0] ?? null);
    setError(null);
  }

  async function getQuote() {
    if (!account) return;
    setBusy(true);
    setError(null);
    setStatus('Quoting…');
    try {
      const q = await swaps.quote({
        sellChain: 8453,
        sellToken: 'ETH',
        buyChain: 8453,
        buyToken: 'USDC',
        amount,
        address: account,
      });
      setQuote(q);
      setStatus(`${q.buyAmount} USDC via ${q.provider} — floor ${q.minBuyAmount}`);
    } catch (e) {
      setStatus('');
      report(e);
    } finally {
      setBusy(false);
    }
  }

  function report(e: unknown) {
    if (e instanceof ChainMismatchError) {
      setError({
        code: e.code,
        message: e.message,
        hint: `Your wallet is on chain ${e.actual}; this quote is for ${e.expected}. Use the switch button below.`,
      });
    } else if (e instanceof NotSupportedError) {
      setError({
        code: e.code,
        message: e.message,
        hint: 'This quote has no transaction to send — it is a deposit route. Send the funds with the memo instead.',
      });
    } else if (e instanceof SwapsProError) {
      setError({ code: e.code, message: e.message });
    } else {
      setError({ code: 'ERROR', message: e instanceof Error ? e.message : String(e) });
    }
  }

  async function switchChain() {
    const eth = getEth();
    if (!eth || !quote?.tx) return;
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${quote.tx.chainId.toString(16)}` }],
    });
    setError(null);
  }

  async function execute() {
    const eth = getEth();
    if (!eth || !quote) return;
    setBusy(true);
    setError(null);
    try {
      // Quotes live about a minute. Re-quote rather than sign stale data.
      if (Date.parse(quote.expiresAt) - Date.now() < 5_000) {
        setStatus('Quote too close to expiry — re-quoting…');
        await getQuote();
      }
      setStatus(
        quote.approval
          ? 'Approving the exact amount, then waiting for it to mine…'
          : 'Confirm in your wallet…'
      );
      const hash = await swaps.executeSwap(quote, eth);
      setStatus(`Sent ${hash.slice(0, 12)}… — waiting for the network…`);
      const receipt = await swaps.waitForReceipt(hash, { signer: eth });
      setStatus(`Swapped in block ${parseInt(receipt.blockNumber, 16)}`);
    } catch (e) {
      report(e);
      setStatus('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={connect}
          className="rounded-md border border-white/15 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-[#4DF98A]/50"
        >
          {account ? `${account.slice(0, 6)}…${account.slice(-4)}` : 'Connect wallet'}
        </button>
        <label className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-400">amount (ETH)</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-28 rounded-md border border-white/10 bg-black/50 px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#4DF98A]/50"
          />
        </label>
        <button
          onClick={getQuote}
          disabled={!account || busy}
          className="rounded-md border border-white/15 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-[#4DF98A]/50 disabled:opacity-40"
        >
          Quote
        </button>
        <button
          onClick={execute}
          disabled={!quote || busy}
          className="rounded-md bg-[#4DF98A] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#3ce577] disabled:opacity-40"
        >
          Swap ETH → USDC on Base
        </button>
      </div>

      {!account && (
        <p className="mt-3 text-xs text-gray-500">
          Connect first. Nothing is quoted or signed until you do — and the swap button
          stays disabled until a quote exists.
        </p>
      )}

      {status && (
        <p className="mt-4 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-[#4DF98A]">
          {status}
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3">
          <p className="font-mono text-sm text-red-300">{error.code}</p>
          <p className="mt-1 text-sm text-red-200/80">{error.message}</p>
          {error.hint && <p className="mt-2 text-sm text-red-200/60">{error.hint}</p>}
          {error.code === 'CHAIN_MISMATCH' && (
            <button
              onClick={switchChain}
              className="mt-3 rounded-md border border-red-400/40 px-3 py-1.5 text-sm text-red-100 hover:bg-red-400/10"
            >
              Switch network and retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
