import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import TryIt from '@/components/TryIt';

const ETH_CAIP = 'eip155:8453/slip44:60';
const USDC_CAIP = 'eip155:8453/erc20:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

export default function PricesPage() {
  return (
    <DocLayout href="/api/prices">
      <PageHeader
        eyebrow="HTTP API"
        title="GET /prices"
        intro={
          <p>
            USD spot prices for up to 100 assets in one call, keyed by CAIP-19 id. This
            is the endpoint for showing a portfolio total or a dollar estimate beside an
            input — it is <em>not</em> an execution price.
          </p>
        }
        doc="https://www.swaps.pro/docs/api/prices"
      />

      <Section title="Parameters">
        <ParamTable
          rows={[
            {
              name: 'tokens',
              type: 'CAIP-19 list',
              def: 'required',
              effect: (
                <>
                  Comma-separated CAIP-19 asset ids, at most 100. Get them from{' '}
                  <Link href="/api/tokens">/tokens</Link> — the <code>caip</code> field.
                </>
              ),
            },
          ]}
        />
        <Callout kind="gotcha" title="It is not chainId + symbols">
          <p>
            The only parameter is <code>tokens</code>, and it takes CAIP-19 ids. Sending{' '}
            <code>?chainId=8453&amp;symbols=ETH,USDC</code> returns{' '}
            <code>BAD_REQUEST</code>: <em>tokens is required — a comma-separated list of
            CAIP-19 asset ids</em>. Clear the field below and send it to see that for
            yourself.
          </p>
        </Callout>
      </Section>

      <Section title="Try it">
        <TryIt
          path="/prices"
          params={[
            {
              name: 'tokens',
              value: `${ETH_CAIP},${USDC_CAIP}`,
              hint: 'Base ETH and Base USDC. Comma-separated, at most 100.',
            },
          ]}
          autoRun
        />
      </Section>

      <Section title="What comes back">
        <ParamTable
          nameHeader="Field"
          rows={[
            { name: 'prices[]', type: 'array', effect: 'One entry per priced asset: caip, usd, symbol, confidence, asOf.' },
            { name: 'unpriced', type: 'string[]', effect: 'Ids the source had no price for. Never treat these as zero.' },
            { name: 'requested', type: 'number', effect: 'How many ids you asked for — compare against prices.length.' },
          ]}
        />
        <CodeBlock
          caption="200 response"
          code={`{
  "prices": [
    {
      "caip": "eip155:8453/slip44:60",
      "usd": 2458.35662985502,
      "symbol": "ETH",
      "confidence": 0.99,
      "asOf": "2026-09-03T14:42:50.000Z"
    },
    {
      "caip": "eip155:8453/erc20:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      "usd": 1.000011030039417,
      "symbol": "USDC",
      "confidence": 0.99,
      "asOf": "2026-09-03T14:42:50.000Z"
    }
  ],
  "unpriced": [],
  "requested": 2
}`}
        />
      </Section>

      <Section title="How to implement">
        <p>
          Collect the <code>caip</code> ids from the token lists you already fetched,
          then price them in one call rather than one per asset.
        </p>
        <CodeBlock
          caption="price a whole holdings list in one request"
          code={`const { tokens } = await fetch(
  "https://www.swaps.pro/api/sdk/v1/tokens?chainId=8453"
).then((r) => r.json());

const ids = tokens.slice(0, 100).map((t) => t.caip);   // hard cap: 100

const { prices, unpriced } = await fetch(
  "https://www.swaps.pro/api/sdk/v1/prices?" +
    new URLSearchParams({ tokens: ids.join(",") })
).then((r) => r.json());

const byCaip = Object.fromEntries(prices.map((p) => [p.caip, p.usd]));

// An asset with no price is UNKNOWN, not worthless.
const total = holdings.reduce((sum, h) => sum + h.amount * (byCaip[h.caip] ?? 0), 0);
const complete = unpriced.length === 0;   // show the total as partial when false`}
        />
        <Callout kind="gotcha" title="Two rules that decide whether your totals are honest">
          <p>
            Never treat <code>unpriced</code> or a 502 as a zero price. Show the asset as
            unpriced and keep any total it belongs to marked incomplete — a silent zero
            turns a missing price into a wrong number nobody can see.
          </p>
          <p>
            Prices are USD floats cached for a minute at the edge. Do not use them as
            execution prices: <Link href="/api/quote">/quote</Link> is the execution
            price, and it is the only number that carries a floor.
          </p>
        </Callout>
      </Section>

      <Section title="Errors">
        <ParamTable
          nameHeader="Code"
          rows={[
            { name: 'BAD_REQUEST', type: '400', effect: 'tokens is missing, or more than 100 were sent (TOO_MANY_TOKENS).' },
            { name: 'RATE_LIMITED', type: '429', effect: 'More than 60 requests per minute from one IP.' },
            { name: 'PRICE_SOURCE_UNAVAILABLE', type: '502', effect: 'The price source did not answer. Not a zero price.' },
          ]}
        />
      </Section>
    </DocLayout>
  );
}
