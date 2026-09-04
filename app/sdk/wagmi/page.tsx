'use client';

import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Steps from '@/components/Steps';
import WagmiSwapPanel from '@/components/WagmiSwapPanel';

export default function WagmiPage() {
  return (
    <DocLayout href="/sdk/wagmi">
      <PageHeader
        eyebrow="SDK"
        title="wagmi"
        intro={
          <p>
            <code>executeSwap</code> takes <em>any</em> EIP-1193 provider, so the SDK
            does not care which wallet library you use. This page is the proof: the same
            calls as <Link href="/sdk/execute">the raw path</Link>, with wagmi supplying
            the wallet, the connection state and the chain switching.
          </p>
        }
        doc="https://www.swaps.pro/docs/sdk"
      />

      <Callout kind="note" title="These dependencies exist for this page only">
        <p>
          <code>wagmi</code>, <code>viem</code> and <code>@tanstack/react-query</code>{' '}
          are mounted in <code>app/sdk/wagmi/layout.tsx</code> and nowhere else. Delete
          this route and the three packages and the rest of the kit is untouched — that
          isolation is the point. The SDK itself has <strong>zero</strong> runtime
          dependencies.
        </p>
      </Callout>

      <Callout kind="danger">
        <p>This panel signs on Base mainnet with real funds, exactly like the raw path.</p>
      </Callout>

      <Section title="Try it">
        <WagmiSwapPanel />
        <p className="text-sm text-gray-500">
          The config ships one connector — <code>injected()</code> — because it needs no
          project id and no extra packages, so a fresh clone works with MetaMask or any
          browser wallet. WalletConnect, Coinbase Wallet and Safe are{' '}
          <em>optional peers</em> of wagmi: add the connector and install its SDK in the
          same change, or the build reports the module as missing.
        </p>
      </Section>

      <Section title="How to implement">
        <Steps
          steps={[
            {
              title: 'Mount the providers where you need them',
              body: (
                <>
                  <p>
                    Scope it to a route segment rather than the root layout unless every
                    page needs a wallet — the stack is not small.
                  </p>
                  <CodeBlock
                    caption="app/sdk/wagmi/providers.tsx"
                    code={`'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base, mainnet, arbitrum } from 'wagmi/chains';
import { injected } from 'wagmi/connectors/injected';

const config = createConfig({
  chains: [base, mainnet, arbitrum],
  transports: { [base.id]: http(), [mainnet.id]: http(), [arbitrum.id]: http() },
  connectors: [injected()],
  ssr: true,        // Next App Router
});`}
                  />
                  <p>
                    Import each connector from its own subpath. The{' '}
                    <code>wagmi/connectors</code> barrel pulls in every connector,
                    including ones whose SDKs you have not installed.
                  </p>
                </>
              ),
            },
            {
              title: 'Get an EIP-1193 provider out of the connector',
              body: (
                <>
                  <p>
                    This is the only line that differs from the raw path. A wagmi
                    connector hands you the real provider; a viem client&apos;s transport
                    also satisfies the interface.
                  </p>
                  <CodeBlock
                    code={`const { address, connector } = useAccount();
const { data: client } = useConnectorClient();

// Either of these is a valid signer for the SDK:
const provider = await connector.getProvider();   // the EIP-1193 provider
// const provider = client.transport;             // viem transport, also fine`}
                  />
                </>
              ),
            },
            {
              title: 'Call the SDK exactly as before',
              body: (
                <CodeBlock
                  code={`const quote = await swaps.quote({
  sellChain: base.id, sellToken: 'ETH',
  buyChain: base.id, buyToken: 'USDC',
  amount, address,
});

const hash = await swaps.executeSwap(quote, provider);
const receipt = await swaps.waitForReceipt(hash, { signer: provider });`}
                />
              ),
            },
          ]}
        />
      </Section>

      <Section title="What wagmi buys you, and what it costs">
        <ul>
          <li>
            <strong>Buys:</strong> connection persistence, account and chain state as
            hooks, a connector list you can render as a picker, and{' '}
            <code>useSwitchChain</code> instead of a hand-rolled{' '}
            <code>wallet_switchEthereumChain</code>.
          </li>
          <li>
            <strong>Costs:</strong> three packages, a provider tree, a React Query
            client, and one optional-peer SDK for every wallet beyond an injected one.
          </li>
        </ul>
        <Callout kind="gotcha" title="Let one library own chain switching">
          <p>
            With wagmi in the tree, use <code>useSwitchChain</code> rather than catching{' '}
            <code>ChainMismatchError</code> and prompting the wallet yourself. Doing both
            races: wagmi&apos;s cached chain state and the wallet&apos;s real state
            disagree for a moment, and the retry fires against the stale one.
          </p>
        </Callout>
        <p>
          If you only need one injected wallet, the{' '}
          <Link href="/sdk/execute">raw EIP-1193 path</Link> does everything this page
          does with no dependencies at all.
        </p>
      </Section>
    </DocLayout>
  );
}
