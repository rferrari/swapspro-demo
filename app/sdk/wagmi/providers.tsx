'use client';

/**
 * The wagmi stack, scoped to this one route.
 *
 * This is the only page in the kit that pulls in a wallet library. Everything
 * else runs on raw EIP-1193 with no dependencies at all — see /sdk/execute.
 *
 * Connectors are deliberately limited to `injected()`, which needs no
 * configuration and no extra packages. WalletConnect, Coinbase Wallet and Safe
 * are optional peers of wagmi: add the connector AND install its SDK together.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { arbitrum, base, mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors/injected';

const config = createConfig({
  chains: [base, mainnet, arbitrum],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
  connectors: [injected()],
  ssr: true, // Next App Router
});

export default function WagmiProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
