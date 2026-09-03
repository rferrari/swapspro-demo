/**
 * @swapspro/sdk is a headless TypeScript client for SwapPro.
 * It quotes cross-chain and same-chain swaps over the public HTTP API and executes EVM quotes through any EIP-1193 wallet you hand it.
 * Zero runtime dependencies, tree-shakeable ESM, fully typed — and it never touches keys or funds.
 */

import { SwapsPro } from '@swapspro/sdk';

// Initialize the SDK client
// You can set partner and partnerFeeBps if you have them
export const swaps = new SwapsPro({
  partner: 'swapspro-demo', // your integrator id
  partnerFeeBps: 0, // optional additive fee, capped at 100 (1%)
});