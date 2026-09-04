'use client';

import { useState } from 'react';
import {
  useAccount,
  useChainId,
  useConnect,
  useConnectorClient,
  useDisconnect,
  useSwitchChain,
} from 'wagmi';
import { base } from 'wagmi/chains';
import type { Quote } from '@swapspro/sdk';
import { SwapsProError } from '@swapspro/sdk';
import { swaps } from '@/lib/swaps';

/** Whatever the connector exposes — a wagmi connector's provider is EIP-1193. */
interface Eip1193 {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
}

/**
 * The same SDK calls as /sdk/execute, with the wallet supplied by wagmi
 * instead of window.ethereum. Only the two lines that obtain the provider
 * differ — executeSwap takes any EIP-1193 provider.
 */
export default function WagmiSwapPanel() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending: connecting } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: client } = useConnectorClient();

  const [amount, setAmount] = useState('0.001');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const wrongChain = isConnected && chainId !== base.id;

  async function getQuote() {
    if (!address) return;
    setBusy(true);
    setError(null);
    try {
      const q = await swaps.quote({
        sellChain: base.id,
        sellToken: 'ETH',
        buyChain: base.id,
        buyToken: 'USDC',
        amount,
        address,
      });
      setQuote(q);
      setStatus(`${q.buyAmount} USDC via ${q.provider} — floor ${q.minBuyAmount}`);
    } catch (e) {
      setStatus('');
      setError(e instanceof SwapsProError ? `${e.code}: ${e.message}` : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function swap() {
    if (!quote) return;
    setBusy(true);
    setError(null);
    try {
      // Two ways to get an EIP-1193 provider out of wagmi. Either works.
      const provider =
        ((await connector?.getProvider()) as Eip1193 | undefined) ??
        (client?.transport as unknown as Eip1193);
      if (!provider) throw new Error('No EIP-1193 provider from the connector.');

      setStatus('Confirm in your wallet…');
      const hash = await swaps.executeSwap(quote, provider);
      setStatus(`Sent ${hash.slice(0, 12)}… — waiting for the network…`);
      const receipt = await swaps.waitForReceipt(hash, { signer: provider });
      setStatus(`Swapped in block ${parseInt(receipt.blockNumber, 16)}`);
    } catch (e) {
      setStatus('');
      setError(e instanceof SwapsProError ? `${e.code}: ${e.message}` : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-center gap-3">
        {isConnected ? (
          <button
            onClick={() => disconnect()}
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-[#4DF98A]/50"
          >
            {address?.slice(0, 6)}…{address?.slice(-4)} — disconnect
          </button>
        ) : (
          connectors.map((c) => (
            <button
              key={c.uid}
              onClick={() => connect({ connector: c })}
              disabled={connecting}
              className="rounded-md border border-white/15 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-[#4DF98A]/50 disabled:opacity-40"
            >
              Connect {c.name}
            </button>
          ))
        )}
        {!isConnected && connectors.length === 0 && (
          <span className="text-sm text-gray-500">No connector available.</span>
        )}
        {wrongChain && (
          <button
            onClick={() => switchChain({ chainId: base.id })}
            className="rounded-md border border-amber-400/40 px-3 py-2 text-sm text-amber-200 hover:bg-amber-400/10"
          >
            Switch to Base
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
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
          disabled={!isConnected || busy}
          className="rounded-md border border-white/15 px-4 py-2 text-sm text-gray-200 transition-colors hover:border-[#4DF98A]/50 disabled:opacity-40"
        >
          Quote
        </button>
        <button
          onClick={swap}
          disabled={!quote || busy || wrongChain}
          className="rounded-md bg-[#4DF98A] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#3ce577] disabled:opacity-40"
        >
          Swap ETH → USDC on Base
        </button>
      </div>

      {status && (
        <p className="mt-4 rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-[#4DF98A]">
          {status}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 font-mono text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
