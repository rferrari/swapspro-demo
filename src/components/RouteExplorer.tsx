'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Quote } from '@swapspro/sdk';
import { SwapsProError } from '@swapspro/sdk';
import { swaps } from '@/lib/swaps';
import { DEMO_ADDRESS, DEMO_BTC_ADDRESS } from '@/lib/config';
import CodeBlock from './CodeBlock';

interface Form {
  sellChain: string;
  sellToken: string;
  buyChain: string;
  buyToken: string;
  amount: string;
  slippage: string;
  recipient: string;
}

const PRESETS: { label: string; note: string; form: Form }[] = [
  {
    label: 'Same-chain EVM → tx',
    note: '0.1 ETH for USDC on Base. An aggregator wins and hands back a transaction.',
    form: {
      sellChain: '8453', sellToken: 'ETH', buyChain: '8453', buyToken: 'USDC',
      amount: '0.1', slippage: '', recipient: '',
    },
  },
  {
    label: 'Cross-chain → depositAddress',
    note: '100 USDC on Base for BTC. THORChain-style: there is no transaction to sign.',
    form: {
      sellChain: '8453', sellToken: 'USDC', buyChain: 'BTC', buyToken: 'BTC',
      amount: '100', slippage: '', recipient: DEMO_BTC_ADDRESS,
    },
  },
  {
    label: 'ERC-20 sell → tx + approval',
    note: 'Selling a token, not the native asset — so an allowance has to be granted first.',
    form: {
      sellChain: '8453', sellToken: 'USDC', buyChain: '8453', buyToken: 'WETH',
      amount: '25', slippage: '1', recipient: '',
    },
  },
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-xs text-gray-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

const input =
  'w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#4DF98A]/50';

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-white/5 py-1.5 last:border-0">
      <span className="w-40 shrink-0 font-mono text-xs text-gray-500">{k}</span>
      <span className="min-w-0 break-all font-mono text-xs text-gray-200">{v}</span>
    </div>
  );
}

/**
 * One quote form that renders whichever of the three execution shapes came
 * back. The shape is the thing to learn here — it decides what you do next.
 */
export default function RouteExplorer() {
  const [form, setForm] = useState<Form>(PRESETS[0].form);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [pending, setPending] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const crossChain = form.sellChain !== form.buyChain;
  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const run = useCallback(async () => {
    setPending(true);
    setError(null);
    try {
      const q = await swaps.quote({
        sellChain: form.sellChain,
        sellToken: form.sellToken,
        buyChain: form.buyChain,
        buyToken: form.buyToken,
        amount: form.amount,
        address: DEMO_ADDRESS,
        ...(form.recipient ? { recipient: form.recipient } : {}),
        ...(form.slippage ? { slippage: Number(form.slippage) } : {}),
      });
      setQuote(q);
      setNow(Date.now());
    } catch (e) {
      setQuote(null);
      if (e instanceof SwapsProError) setError({ code: e.code, message: e.message });
      else setError({ code: 'ERROR', message: e instanceof Error ? e.message : String(e) });
    } finally {
      setPending(false);
    }
  }, [form]);

  // Drive the expiry countdown.
  useEffect(() => {
    if (!quote) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [quote]);

  const secondsLeft = quote
    ? Math.max(0, Math.round((Date.parse(quote.expiresAt) - now) / 1000))
    : 0;
  const expired = !!quote && secondsLeft === 0;

  const shape = quote?.tx ? 'tx' : quote?.order ? 'order' : quote?.depositAddress ? 'depositAddress' : null;

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setForm(p.form);
              setQuote(null);
              setError(null);
            }}
            title={p.note}
            className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:border-[#4DF98A]/50 hover:text-white"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="sellChain" hint="Symbol or numeric id."><input className={input} value={form.sellChain} onChange={(e) => set('sellChain', e.target.value)} /></Field>
        <Field label="sellToken"><input className={input} value={form.sellToken} onChange={(e) => set('sellToken', e.target.value)} /></Field>
        <Field label="buyChain"><input className={input} value={form.buyChain} onChange={(e) => set('buyChain', e.target.value)} /></Field>
        <Field label="buyToken"><input className={input} value={form.buyToken} onChange={(e) => set('buyToken', e.target.value)} /></Field>
        <Field label="amount" hint="Human units, never base units."><input className={input} value={form.amount} onChange={(e) => set('amount', e.target.value)} /></Field>
        <Field label="slippage (optional)" hint="Percent, 0 < s ≤ 50."><input className={input} placeholder="venue floor" value={form.slippage} onChange={(e) => set('slippage', e.target.value)} /></Field>
        {crossChain && (
          <div className="sm:col-span-2">
            <Field label="recipient" hint="The chains differ, so the bought asset needs somewhere to land on the destination chain.">
              <input className={input} value={form.recipient} onChange={(e) => set('recipient', e.target.value)} />
            </Field>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={run}
          disabled={pending}
          className="rounded-md bg-[#4DF98A] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#3ce577] disabled:opacity-50"
        >
          {pending ? 'Quoting…' : quote ? 'Re-quote' : 'Get quote'}
        </button>
        <span className="text-xs text-gray-500">
          Quoting is free and signs nothing. address is a demo wallet.
        </span>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3">
          <p className="font-mono text-sm text-red-300">{error.code}</p>
          <p className="mt-1 text-sm text-red-200/80">{error.message}</p>
        </div>
      )}

      {quote && (
        <div className="mt-5 space-y-4">
          <div
            className={`rounded-lg border p-4 ${
              expired ? 'border-amber-400/40 bg-amber-400/5' : 'border-[#4DF98A]/30 bg-[#4DF98A]/5'
            }`}
          >
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-lg font-semibold text-white">
                {quote.sellAmount} {quote.sellToken.symbol} → {quote.buyAmount}{' '}
                {quote.buyToken.symbol}
              </span>
              <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-gray-300">
                shape: {shape}
              </span>
              <span className="ml-auto font-mono text-xs text-gray-400">
                {expired ? 'expired — re-quote' : `expires in ${secondsLeft}s`}
              </span>
            </div>
            <Row k="provider" v={quote.provider} />
            <Row k="rate" v={`${quote.rate} ${quote.buyToken.symbol} per ${quote.sellToken.symbol}`} />
            <Row k="minBuyAmount" v={`${quote.minBuyAmount ?? '—'} — the floor, and the only number to promise`} />
            <Row k="expiresAt" v={quote.expiresAt} />
            <Row k="partnerFee.note" v={quote.partnerFee?.note ?? '—'} />
          </div>

          {quote.tx && (
            <div className="rounded-lg border border-white/10 p-4">
              <p className="mb-2 font-semibold text-white">
                tx — a ready-to-sign EVM transaction
              </p>
              {quote.approval && (
                <div className="mb-3 rounded border border-amber-400/30 bg-amber-400/5 p-3">
                  <p className="mb-2 text-sm text-amber-100">
                    An <code className="font-mono">approval</code> came with it: an
                    exact-amount allowance, never unlimited. Send it first and wait for
                    it to mine — an unmined approval is the most common cause of a failed
                    swap.
                  </p>
                  <Row k="approval.token" v={quote.approval.token} />
                  <Row k="approval.spender" v={quote.approval.spender} />
                  <Row k="approval.amountWei" v={quote.approval.amountWei} />
                </div>
              )}
              <Row k="tx.chainId" v={quote.tx.chainId} />
              <Row k="tx.to" v={quote.tx.to} />
              <Row k="tx.value" v={quote.tx.value ?? '0x0'} />
              <Row k="tx.gasLimit" v={quote.tx.gasLimit ?? 'estimate it yourself'} />
              <Row k="tx.data" v={`${quote.tx.data?.slice(0, 66)}… (${quote.tx.data?.length ?? 0} chars)`} />
              <CodeBlock code={`// Send it as-is. value and gasLimit are already 0x-hex.
const hash = await swaps.executeSwap(quote, window.ethereum);
await swaps.waitForReceipt(hash, { signer: window.ethereum });`} />
            </div>
          )}

          {quote.order && (
            <div className="rounded-lg border border-white/10 p-4">
              <p className="mb-2 font-semibold text-white">
                order — a CoW Protocol order. Gasless, and asynchronous.
              </p>
              <Row k="order.protocol" v={quote.order.protocol} />
              <Row k="order.chainId" v={quote.order.chainId} />
              <Row k="order.validTo" v={new Date(quote.order.validTo * 1000).toISOString()} />
              <Row k="order.postUrl" v={quote.order.postUrl} />
              <CodeBlock code={`// Three steps, in order. executeSwap() does not cover this shape.
await fetch(order.appDataUrl, {
  method: "PUT",
  body: JSON.stringify({ fullAppData: order.appData.fullAppData }),
});

const signature = await eth.request({
  method: "eth_signTypedData_v4",
  params: [account, JSON.stringify(order.typedData)],
});

await fetch(order.postUrl, {
  method: "POST",
  body: JSON.stringify({ ...order.body, signature }),
});
// Solvers fill it in a batch auction. It can expire unfilled — poll the uid.`} />
            </div>
          )}

          {quote.depositAddress && (
            <div className="rounded-lg border border-white/10 p-4">
              <p className="mb-2 font-semibold text-white">
                depositAddress — a THORChain-style deposit route
              </p>
              <Row k="depositAddress" v={quote.depositAddress} />
              <Row k="memo" v={quote.memo ?? '—'} />
              <CodeBlock code={`// There is no transaction to send: executeSwap() throws NOT_SUPPORTED here.
// Send ${quote.sellAmount} ${quote.sellToken.symbol} to depositAddress with the
// memo attached VERBATIM, from a wallet for the sell chain.
//
// The memo encodes the destination and the floor. Alter one character and the
// funds arrive somewhere you did not intend, or not at all.`} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
