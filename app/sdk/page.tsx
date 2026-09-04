import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Steps from '@/components/Steps';
import Discovery from '@/components/Discovery';

export default function SdkPage() {
  return (
    <DocLayout href="/sdk">
      <PageHeader
        eyebrow="SDK"
        title="@swapspro/sdk"
        intro={
          <p>
            A headless TypeScript client over the same public endpoints: no runtime
            dependencies, no React, and no wallet library of its own — it takes any
            EIP-1193 provider you already have. You build the UI; it quotes and hands
            you something to sign.
          </p>
        }
        doc="https://www.swaps.pro/docs/sdk"
      />

      <Section title="What it adds, and what it does not">
        <p>
          Over calling <Link href="/api">the HTTP API</Link> directly it adds types for
          every request and response, typed errors that carry the API&apos;s{' '}
          <code>code</code>, and an execute helper that handles the ERC-20 approval,
          waits for it, and then sends the swap.
        </p>
        <p>
          It adds no behaviour the API lacks. The routing, the fees and the rate limits
          are the API&apos;s, not the SDK&apos;s.{' '}
          <strong>If you are not in a JavaScript runtime, use the API and lose nothing.</strong>
        </p>
      </Section>

      <Section title="Install and configure">
        <Steps
          steps={[
            {
              title: 'Install',
              body: <CodeBlock code={`npm i @swapspro/sdk   # 0.1.1, zero runtime dependencies`} />,
            },
            {
              title: 'Construct one client',
              body: (
                <>
                  <p>
                    Constructing it is free — no network, no state — so a module-level
                    singleton is fine and so is a per-component instance.
                  </p>
                  <CodeBlock
                    caption="src/lib/swaps.ts in this repo"
                    code={`import { SwapsPro } from '@swapspro/sdk';

export const swaps = new SwapsPro({
  partner: 'your-app-id',   // attribution only — no signup, no key
  partnerFeeBps: 0,         // additive fee, capped at 100 (1%)
});`}
                  />
                </>
              ),
            },
            {
              title: 'Quote, then branch on what came back',
              body: (
                <p>
                  A quote carries exactly one execution shape, and they are not
                  interchangeable — that is the next page:{' '}
                  <Link href="/sdk/routes">the three route shapes</Link>.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Constructor options">
        <ParamTable
          rows={[
            { name: 'baseUrl', type: 'string', def: 'https://www.swaps.pro', effect: 'Which deployment to talk to.' },
            { name: 'partner', type: 'string ≤ 64', def: '—', effect: 'Your integrator id, attached to every quote for attribution.' },
            { name: 'partnerFeeBps', type: 'number', def: '0', effect: 'Additive fee in basis points, capped at 100. Read /fees before using it.' },
            {
              name: 'timeoutMs',
              type: 'number',
              def: '30000',
              effect: 'Deadline for every API call. There was none in 0.1.0, so a stalled connection left quote() pending forever — the call an app blocks its UI on.',
            },
            { name: 'fetch', type: 'function', def: 'globalThis.fetch', effect: 'Custom fetch, for tests and non-browser runtimes.' },
          ]}
        />
      </Section>

      <Section title="The methods">
        <ParamTable
          nameHeader="Method"
          rows={[
            { name: 'chains()', type: 'Promise<Chain[]>', effect: 'Every chain that can be priced, with type, chainId and sellSupported.' },
            { name: 'tokens(chainId)', type: 'Promise<Token[]>', effect: 'The curated list for one chain. Takes a numeric id or a symbol.' },
            { name: 'quote(params)', type: 'Promise<Quote>', effect: 'A firm quote. Your partner and partnerFeeBps are attached automatically.' },
            {
              name: 'executeSwap(quote, signer)',
              type: 'Promise<string>',
              effect: 'Verifies the wallet is on the quote’s chain, grants the allowance if one is needed (waiting for it to mine), then sends the swap. Returns the hash.',
            },
            {
              name: 'waitForReceipt(hash, opts)',
              type: 'Promise<Receipt>',
              effect: 'Polls for the receipt. Takes a signer or a raw rpcUrl; pollMs defaults to 4000 and timeoutMs to 300000.',
            },
          ]}
        />
        <Callout kind="note" title="Non-custodial, structurally">
          <p>
            Quotes come back as plain transaction data and signing always happens in the
            caller&apos;s wallet. The SDK never holds keys or funds, and{' '}
            <code>executeSwap</code> is a convenience over the same{' '}
            <code>eth_sendTransaction</code> you could make yourself.
          </p>
        </Callout>
      </Section>

      <Section title="Discovery, live">
        <p>
          Both discovery calls, wired to real pickers. Note what happens to a
          destination-only chain in the sell picker: it is <em>disabled</em>, not
          discovered from an error. <code>sellSupported</code> is stated on the record
          precisely so a pair selector can be built before quoting anything.
        </p>
        <Discovery />
        <CodeBlock
          caption="the whole panel above, in eight lines"
          code={`import { swaps } from '@/lib/swaps';

const chains = await swaps.chains();
const sellable = chains.filter((c) => c.sellSupported !== false);

const tokens = await swaps.tokens('BASE');   // or 8453
const usdc = tokens.find((t) => t.symbol === 'USDC');

// Both are cached for an hour at the edge. Cache them again on your side.`}
        />
      </Section>

      <Section title="Errors are typed">
        <p>
          Every failure throws a <code>SwapsProError</code> carrying the API&apos;s
          machine-readable <code>code</code>. Two subclasses matter enough to catch by
          type, and both are demonstrated live on{' '}
          <Link href="/sdk/execute">Execute a swap</Link>.
        </p>
        <CodeBlock
          code={`import { ChainMismatchError, NotSupportedError, SwapsProError } from '@swapspro/sdk';

try {
  await swaps.executeSwap(quote, eth);
} catch (e) {
  if (e instanceof ChainMismatchError) {
    // e.expected / e.actual — offer wallet_switchEthereumChain, then retry.
  } else if (e instanceof NotSupportedError) {
    // A deposit route: no tx to send. Use quote.depositAddress + quote.memo.
  } else if (e instanceof SwapsProError) {
    // NO_ROUTE · RATE_LIMITED · QUOTE_EXPIRED · TX_REVERTED · TIMEOUT · NETWORK_ERROR
  }
}`}
        />
      </Section>

      <Section title="Known limits">
        <ul>
          <li>
            <code>executeSwap()</code> is EVM-only. Bitcoin, Litecoin and Cosmos routes
            come back as deposit addresses and are sent from a native wallet.
          </li>
          <li>Cross-chain quotes require a <code>recipient</code>.</li>
          <li>Hive pairs return <code>UNSUPPORTED_PAIR</code> over the HTTP API.</li>
          <li>Quotes expire in about a minute — re-quote instead of signing stale data.</li>
        </ul>
      </Section>
    </DocLayout>
  );
}
