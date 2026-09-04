import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import TryIt from '@/components/TryIt';

export default function TokensPage() {
  return (
    <DocLayout href="/api/tokens">
      <PageHeader
        eyebrow="HTTP API"
        title="GET /tokens"
        intro={
          <p>
            The curated token list for one chain: natives first, then the ERC-20s
            SwapsPro resolves by symbol. Not rate limited, cached for an hour. This is
            also where you get the <code>caip</code> id that{' '}
            <Link href="/api/prices">/prices</Link> keys on.
          </p>
        }
        doc="https://www.swaps.pro/docs/api/tokens"
      />

      <Section title="Parameters">
        <ParamTable
          rows={[
            {
              name: 'chainId',
              type: 'number | symbol',
              def: 'required',
              effect: (
                <>
                  Numeric EVM chain id or SwapsPro chain symbol — <code>8453</code> and{' '}
                  <code>BASE</code> both work. <code>chain</code> is accepted as an
                  alias.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Try it">
        <TryIt
          path="/tokens"
          params={[
            {
              name: 'chainId',
              value: '8453',
              options: [
                { label: 'Base (8453)', value: '8453' },
                { label: 'Ethereum (1)', value: '1' },
                { label: 'Arbitrum (42161)', value: '42161' },
                { label: 'BNB Smart Chain (56)', value: '56' },
                { label: 'Avalanche (43114)', value: '43114' },
                { label: 'Bitcoin (by symbol: BTC)', value: 'BTC' },
              ],
              hint: 'The BTC option shows that a symbol resolves just like a numeric id.',
            },
          ]}
          autoRun
          maxRows={24}
        />
      </Section>

      <Section title="What comes back">
        <ParamTable
          nameHeader="Field"
          rows={[
            { name: 'symbol', type: 'string', effect: 'What you pass as sellToken / buyToken. Resolves case-insensitively.' },
            { name: 'name', type: 'string', effect: 'Human name.' },
            {
              name: 'caip',
              type: 'string',
              effect: (
                <>
                  The CAIP-19 asset id — the canonical swap identity, and the key{' '}
                  <Link href="/api/prices">/prices</Link> takes.
                </>
              ),
            },
            { name: 'chain', type: 'string', effect: 'The chain symbol this asset lives on.' },
            { name: 'isToken', type: 'boolean', effect: 'False for the chain’s native asset.' },
            { name: 'contract', type: 'string?', effect: 'ERC-20 address. EVM token assets only.' },
            { name: 'mint', type: 'string?', effect: 'SPL mint. Solana only.' },
            { name: 'decimals', type: 'number?', effect: 'Only when known statically. Resolve it on-chain otherwise.' },
          ]}
        />
      </Section>

      <Section title="How to implement">
        <ul>
          <li>
            <strong>The list is curated, not exhaustive.</strong> It is natives plus the
            blue chips SwapsPro resolves by symbol — you can still quote any ERC-20 by
            passing its contract address as <code>sellToken</code> or{' '}
            <code>buyToken</code>. A contract address always wins over a symbol.
          </li>
          <li>
            <strong>Chain the two discovery calls.</strong> Fetch{' '}
            <Link href="/api/chains">/chains</Link> once, then <code>/tokens</code> per
            chain the user actually opens, and cache both.
          </li>
        </ul>
        <CodeBlock
          tabs={[
            {
              label: 'SDK',
              code: `import { swaps } from "@/lib/swaps";

// Symbol or numeric id — both resolve.
const tokens = await swaps.tokens("BASE");

const usdc = tokens.find((t) => t.symbol === "USDC");
usdc.caip;      // "eip155:8453/erc20:0x8335…2913" — feed this to /prices
usdc.contract;  // "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"

// Not on the curated list? Quote the address directly.
const quote = await swaps.quote({
  sellChain: 8453, sellToken: "ETH",
  buyChain: 8453, buyToken: "0xSomeErc20Address",
  amount: "0.1", address: account,
});`,
            },
            {
              label: 'fetch',
              code: `const { tokens } = await fetch(
  "https://www.swaps.pro/api/sdk/v1/tokens?chainId=8453"
).then((r) => r.json());`,
            },
          ]}
        />
        <Callout kind="gotcha" title="decimals is for reading balances, not building amounts">
          <p>
            Amounts on <Link href="/api/quote">/quote</Link> are human decimals —{' '}
            <code>&quot;0.1&quot;</code>, never base units. Use <code>decimals</code> to
            read a wallet balance and format it; never to multiply an amount up before
            sending it.
          </p>
        </Callout>
      </Section>

      <Section title="Errors">
        <ParamTable
          nameHeader="Code"
          rows={[
            { name: 'BAD_REQUEST', type: '400', effect: 'chainId is missing.' },
            { name: 'UNKNOWN_CHAIN', type: '404', effect: 'The chain is not one SwapsPro serves.' },
          ]}
        />
        <p>
          Try it above: replace <code>8453</code> with <code>999999</code> and send the
          request to see the real 404 body.
        </p>
      </Section>
    </DocLayout>
  );
}
