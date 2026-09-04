/**
 * @swapspro/sdk is a headless TypeScript client for SwapsPro: it quotes
 * cross-chain and same-chain swaps over the public HTTP API and executes EVM
 * quotes through any EIP-1193 wallet you hand it. Zero runtime dependencies,
 * tree-shakeable ESM, fully typed — and it never touches keys or funds.
 *
 * One shared client for the whole demo. Constructing it is free (no network,
 * no state), so a per-component instance would work too.
 */

import { SwapsPro } from '@swapspro/sdk';
import { PARTNER, PARTNER_FEE_BPS, SITE } from './config';

export const swaps = new SwapsPro({
  baseUrl: SITE,
  partner: PARTNER,
  partnerFeeBps: PARTNER_FEE_BPS,
});
