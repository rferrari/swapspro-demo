'use client';

/**
 * A complete swap card for an existing React app: quote, execute, receipt.
 * Dependencies: @swapspro/sdk and a browser wallet. Nothing else.
 *
 * Copy this file into your project, change `partner`, and render <SwapCard />.
 */

import { useState } from 'react';
import { SwapsPro, ChainMismatchError, SwapsProError } from '@swapspro/sdk';

const swaps = new SwapsPro({ partner: 'your-app-id' });

// Minimal EIP-1193 surface — window.ethereum, or anything with .request().
type Eth = { request(a: { method: string; params?: unknown[] }): Promise<unknown> };
const getEth = () => (window as unknown as { ethereum?: Eth }).ethereum;

export default function SwapCard() {
  const [amount, setAmount] = useState('0.001');
  const [preview, setPreview] = useState('');
  const [status, setStatus] = useState('');

  async function onQuote(next: string) {
    setAmount(next);
    const eth = getEth();
    if (!eth || !(Number(next) > 0)) return setPreview('');
    const [account] = (await eth.request({ method: 'eth_accounts' })) as string[];
    if (!account) return setPreview('');

    const quote = await swaps.quote({
      sellChain: 8453,
      sellToken: 'ETH',
      buyChain: 8453,
      buyToken: 'USDC',
      amount: next,
      address: account,
    });
    // minBuyAmount is the guarantee; buyAmount is the estimate.
    setPreview(`≈ ${quote.buyAmount} USDC via ${quote.provider} (floor ${quote.minBuyAmount})`);
  }

  async function onSwap() {
    const eth = getEth();
    if (!eth) return setStatus('No wallet found.');
    const [account] = (await eth.request({ method: 'eth_requestAccounts' })) as string[];

    try {
      setStatus('Quoting…');
      // Re-quote immediately before signing: quotes expire in about a minute.
      const quote = await swaps.quote({
        sellChain: 8453,
        sellToken: 'ETH',
        buyChain: 8453,
        buyToken: 'USDC',
        amount,
        address: account,
      });

      setStatus('Confirm in your wallet…');
      // Handles the ERC-20 approval and waits for it, when one is needed.
      const txHash = await swaps.executeSwap(quote, eth);

      setStatus('Waiting for the network…');
      const receipt = await swaps.waitForReceipt(txHash, { signer: eth });
      setStatus(`Swapped in block ${parseInt(receipt.blockNumber, 16)}`);
    } catch (e) {
      if (e instanceof ChainMismatchError) {
        // The wallet is on the wrong chain. Switch, then try again.
        await eth.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${e.expected.toString(16)}` }],
        });
        return onSwap();
      }
      if (e instanceof SwapsProError) return setStatus(`${e.code}: ${e.message}`);
      throw e;
    }
  }

  return (
    <div>
      <input value={amount} onChange={(e) => onQuote(e.target.value)} />
      <p>{preview}</p>
      <button onClick={onSwap}>Swap ETH for USDC</button>
      <p>{status}</p>
    </div>
  );
}
