import type { ReactNode } from 'react';
import WagmiProviders from './providers';

/** The wallet stack is mounted for this route only. */
export default function WagmiLayout({ children }: { children: ReactNode }) {
  return <WagmiProviders>{children}</WagmiProviders>;
}
