import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import ParamTable from '@/components/ParamTable';

export default function ApiOverview() {
  return (
    <DocLayout href="/api">
      <PageHeader
        eyebrow="HTTP API"
        title="The keyless HTTP API"
        intro={
          <p>
            Base URL <code>https://www.swaps.pro/api/sdk/v1</code>. Every endpoint is a
            GET, CORS-open, and answers <code>OPTIONS</code> with a 204 preflight. There
            is no API key to ask for, no account and no signup. Responses are always
            JSON.
          </p>
        }
        doc="https://www.swaps.pro/docs/api"
      />

      <Section title="The endpoints">
        <ParamTable
          nameHeader="Endpoint"
          rows={[
            {
              name: 'GET /chains',
              effect: (
                <>
                  Every chain SwapsPro can price. No parameters, cached at the edge
                  for an hour, not rate limited.{' '}
                  <Link href="/api/chains">Reference →</Link>
                </>
              ),
            },
            {
              name: 'GET /tokens',
              effect: (
                <>
                  The curated token list for one chain — natives plus blue chips, not an
                  index of everything on it. Not rate limited.{' '}
                  <Link href="/api/tokens">Reference →</Link>
                </>
              ),
            },
            {
              name: 'GET /prices',
              effect: (
                <>
                  USD spot for up to 100 assets, keyed by CAIP-19 id. Rate limited.{' '}
                  <Link href="/api/prices">Reference →</Link>
                </>
              ),
            },
            {
              name: 'GET /quote',
              effect: (
                <>
                  A firm quote, priced by the same route picker the app uses, returned
                  ready to sign. Rate limited.{' '}
                  <Link href="/api/quote">Reference →</Link>
                </>
              ),
            },
            {
              name: 'GET /access',
              effect: (
                <>
                  Rate-limit elevation over x402. Answers 503 on this deployment.{' '}
                  <Link href="/api/access">Reference →</Link>
                </>
              ),
            },
          ]}
        />
        <p>
          The SDK and the widget sit on these same endpoints, so the routing, the prices
          and the fees are identical whichever surface you pick. If you are not in a
          JavaScript runtime, use the API directly and lose nothing.
        </p>
      </Section>

      <Section title="Errors have one shape">
        <p>
          Every error is <code>{'{ "error": string, "code": string }'}</code> with a
          matching HTTP status. The <code>code</code> is the part to branch on; the{' '}
          <code>error</code> is a sentence for a human.
        </p>
        <CodeBlock
          caption="a real 400 from /prices"
          code={`{
  "error": "tokens is required — a comma-separated list of CAIP-19 asset ids",
  "code": "BAD_REQUEST"
}`}
        />
        <ParamTable
          nameHeader="Code"
          rows={[
            { name: 'BAD_REQUEST', type: '400', effect: 'A required parameter is missing, or amount/slippage are malformed.' },
            { name: 'UNSUPPORTED_PAIR', type: '400', effect: 'The pair cannot be routed at all — a Hive pair, or a destination-only chain as sellChain.' },
            { name: 'UNKNOWN_CHAIN', type: '404', effect: 'The chain is not one SwapsPro serves.' },
            { name: 'UNKNOWN_TOKEN', type: '404', effect: 'The token could not be resolved on that chain.' },
            { name: 'NO_ROUTE', type: '404 / 502', effect: 'No venue could price it at that size right now. An answer, not an outage.' },
            { name: 'RATE_LIMITED', type: '429', effect: 'More than 60 requests per minute from one IP.' },
            { name: 'PRICE_SOURCE_UNAVAILABLE', type: '502', effect: 'The price source did not answer. Never read this as a zero price.' },
            { name: 'UPSTREAM_ERROR', type: '502', effect: 'A venue failed. Distinct from "nobody would price it".' },
          ]}
        />
        <Callout kind="gotcha" title="NO_ROUTE is not an outage">
          <p>
            It means the pair cannot be priced at that size right now. Try a smaller
            amount or a different pair — do not retry it in a loop.
          </p>
        </Callout>
      </Section>

      <Section title="Rate limits, stated honestly">
        <p>
          <code>/quote</code> and <code>/prices</code> use a fixed 60-second window keyed
          on the first entry of <code>X-Forwarded-For</code>. <code>/chains</code> and{' '}
          <code>/tokens</code> are not rate limited at all.
        </p>
        <Callout kind="note" title="What the limit really is">
          <p>
            60 requests per minute per IP, <strong>best-effort</strong>: counted in
            memory inside each serverless instance, so the effective ceiling is higher
            than the number and varies with how many instances are warm. Treat it as a
            courtesy brake, not a quota, and do not design around it.
          </p>
        </Callout>
        <p>
          Because a per-instance count cannot be metered, no paid tier is sold on this
          deployment and <code>/access</code> answers 503. Quoting is unaffected: free,
          keyless, and not going away. Details on{' '}
          <Link href="/api/access">GET /access</Link>.
        </p>
      </Section>

      <Section title="Calling it from a browser">
        <p>
          <code>Access-Control-Allow-Origin: *</code> means client-side <code>fetch</code>{' '}
          works with no proxy — which is why every reference page here runs the request
          in your browser rather than showing you a screenshot.
        </p>
        <CodeBlock
          tabs={[
            {
              label: 'fetch',
              code: `const res = await fetch(
  "https://www.swaps.pro/api/sdk/v1/quote?" +
    new URLSearchParams({
      sellChain: "8453", sellToken: "ETH",
      buyChain: "8453", buyToken: "USDC",
      amount: "0.1", address: account,
      partner: "your-app-id",
    })
);
if (!res.ok) {
  const { code, error } = await res.json();
  throw new Error(\`\${code}: \${error}\`);
}
const quote = await res.json();`,
            },
            {
              label: 'curl',
              code: `curl "https://www.swaps.pro/api/sdk/v1/quote?sellChain=8453&sellToken=ETH&buyChain=8453&buyToken=USDC&amount=0.1&address=0xYourAddress"`,
            },
            {
              label: 'SDK',
              code: `import { SwapsPro } from "@swapspro/sdk";

const swaps = new SwapsPro({ partner: "your-app-id" });
const quote = await swaps.quote({
  sellChain: 8453, sellToken: "ETH",
  buyChain: 8453, buyToken: "USDC",
  amount: "0.1", address: account,
});`,
            },
          ]}
        />
        <p>
          The SDK adds types, typed errors carrying the same <code>code</code>, and an
          execute helper. It adds no behaviour the API lacks — see{' '}
          <Link href="/sdk">the SDK page</Link>.
        </p>
      </Section>
    </DocLayout>
  );
}
