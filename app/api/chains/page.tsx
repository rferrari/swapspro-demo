import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import TryIt from '@/components/TryIt';

export default function ChainsPage() {
  return (
    <DocLayout href="/api/chains">
      <PageHeader
        eyebrow="HTTP API"
        title="GET /chains"
        intro={
          <p>
            Every chain SwapsPro can quote, with its CAIP-2 id and whether it can be sold
            from. No parameters, no key, not rate limited, and cached for an hour — this
            is the first call any integration makes, and then never makes again.
          </p>
        }
        doc="https://www.swaps.pro/docs/api/chains"
      />

      <Section title="Try it">
        <TryIt path="/chains" autoRun maxRows={24} />
      </Section>

      <Section title="What comes back">
        <ParamTable
          nameHeader="Field"
          rows={[
            {
              name: 'id',
              type: 'string',
              effect: (
                <>
                  The SwapsPro chain symbol — <code>ETH</code>, <code>BASE</code>,{' '}
                  <code>BTC</code>. Accepted anywhere a chain is a parameter.
                </>
              ),
            },
            { name: 'name', type: 'string', effect: 'Human name, for your picker.' },
            { name: 'nativeSymbol', type: 'string', effect: 'The chain’s gas asset — ETH, BNB, RUNE.' },
            {
              name: 'caip2',
              type: 'string',
              effect: (
                <>
                  CAIP-2 network id, e.g. <code>eip155:8453</code>.
                </>
              ),
            },
            {
              name: 'type',
              type: 'enum',
              values: 'evm · utxo · cosmos · hive · svm',
              effect: 'Decides how you sign: only evm chains produce a ready-to-send transaction.',
            },
            {
              name: 'chainId',
              type: 'number?',
              effect: 'Numeric EIP-155 id. EVM chains only — absent on Bitcoin, Cosmos, Hive.',
            },
            {
              name: 'sellSupported',
              type: 'boolean?',
              effect: 'False when the chain can only be a destination. Stated on the record so you can build a pair selector before quoting anything.',
            },
          ]}
        />
      </Section>

      <Section title="How to implement">
        <p>
          Two rules make the difference between a pair selector that works and one that
          throws on the user&apos;s first pick.
        </p>
        <ul>
          <li>
            Use <code>id</code> (<code>BASE</code>) <em>or</em> <code>chainId</code> (
            <code>8453</code>) as the <code>sellChain</code>/<code>buyChain</code> value
            on <Link href="/api/quote">/quote</Link>. Both resolve, so pick one and be
            consistent.
          </li>
          <li>
            A chain with <code>sellSupported: false</code> may appear as{' '}
            <code>buyChain</code> only. Disable it in the sell picker rather than
            discovering it from an <code>UNSUPPORTED_PAIR</code> error.
          </li>
        </ul>
        <CodeBlock
          caption="build both pickers from one call"
          tabs={[
            {
              label: 'SDK',
              code: `import { swaps } from "@/lib/swaps";

const chains = await swaps.chains();

// Everything can be bought into.
const buyable = chains;

// Only some can be sold from.
const sellable = chains.filter((c) => c.sellSupported !== false);

// Only EVM chains can return a ready-to-sign transaction.
const evm = chains.filter((c) => c.type === "evm");`,
            },
            {
              label: 'fetch',
              code: `const { chains } = await fetch(
  "https://www.swaps.pro/api/sdk/v1/chains"
).then((r) => r.json());

const sellable = chains.filter((c) => c.sellSupported !== false);`,
            },
          ]}
        />
        <Callout kind="note" title="Cache this yourself">
          <p>
            The response is cached at the edge for an hour and changes about as often as
            SwapsPro adds a chain. Fetch it once at startup and keep it — an agent that
            re-fetches it per quote is spending its rate limit on a constant.
          </p>
        </Callout>
      </Section>

      <Section title="What is actually there">
        <p>
          EVM: Ethereum (1), Base (8453), BNB Smart Chain (56), Avalanche (43114),
          Arbitrum (42161), Robinhood Chain (4663). Non-EVM: Bitcoin, Bitcoin Cash,
          Litecoin, Dogecoin, Cosmos, THORChain, Solana and Hive.
        </p>
        <Callout kind="gotcha" title="Listed is not the same as quotable">
          <p>
            Solana is destination-only (<code>sellSupported: false</code>) — passing it
            as <code>sellChain</code> returns <code>UNSUPPORTED_PAIR</code>. Hive appears
            because the app supports it, but quoting a Hive pair over the HTTP API also
            returns <code>UNSUPPORTED_PAIR</code>. Some non-EVM chains are still in demo
            mode pending a signing integration;{' '}
            <a href="https://www.swaps.pro/about" target="_blank" rel="noreferrer">
              swaps.pro/about
            </a>{' '}
            lists which, line by line.
          </p>
        </Callout>
      </Section>
    </DocLayout>
  );
}
