import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import Steps from '@/components/Steps';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import TryIt from '@/components/TryIt';
import { DEMO_ADDRESS } from '@/lib/config';

/**
 * The recipes are read from `examples/` at build time rather than pasted here,
 * so the code on this page cannot drift from the code that actually runs.
 */
const read = (f: string) =>
  fs.readFileSync(path.join(process.cwd(), 'examples', f), 'utf8');

export default function StartPage() {
  const agent = read('agent-quote.mjs');
  const embed = read('embed.html');
  const card = read('SwapCard.tsx');

  return (
    <DocLayout href="/start">
      <PageHeader
        eyebrow="Start here"
        title="Fork this and build"
        intro={
          <p>
            What to change, what the three requests do, and three complete files you can
            copy into a project right now. Every one of them runs against the live
            public API — there is no key to obtain and no account to create.
          </p>
        }
        doc="https://www.swaps.pro/docs"
      />

      <Section title="Set it up">
        <Steps
          steps={[
            {
              title: 'Clone and install',
              body: (
                <CodeBlock
                  code={`git clone https://github.com/your-fork/swapspro-demo
cd swapspro-demo
npm install`}
                />
              ),
            },
            {
              title: 'Name yourself as the partner',
              body: (
                <>
                  <p>
                    <code>partner</code> is attribution and nothing more: there is no
                    signup, no API key and no integrator database behind it. Any string
                    up to 64 characters works, and it is stamped on every quote you ask
                    for.
                  </p>
                  <CodeBlock
                    caption=".env.local"
                    code={`NEXT_PUBLIC_SWAPSPRO_PARTNER=your-app-id

# Optional: an additive fee in basis points, capped at 100 (1%).
# Read /fees first — not every venue can carry a second fee.
NEXT_PUBLIC_SWAPSPRO_FEE_BPS=0`}
                  />
                  <p>
                    Both are read in one place,{' '}
                    <code>src/lib/config.ts</code>, and flow into the shared SDK client
                    in <code>src/lib/swaps.ts</code>.
                  </p>
                </>
              ),
            },
            {
              title: 'Run it',
              body: (
                <>
                  <CodeBlock code={`npm run dev   # http://localhost:3000`} />
                  <p>
                    Getting paid for the fee you set is a separate step with its own
                    rules — see <Link href="/fees">Fees</Link>.
                  </p>
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="The quickstart is three requests">
        <p>
          Discovery, then a firm quote. The first two are cached for an hour and are not
          rate limited; cache them yourself and you will essentially never call them
          again.
        </p>

        <p className="pt-2 font-medium text-white">1 — which chains can be priced</p>
        <TryIt path="/chains" maxRows={22} />

        <p className="pt-2 font-medium text-white">
          2 — the curated token list for one chain
        </p>
        <p>
          Not an index of every token on the chain: natives first, then the ERC-20s
          SwapsPro resolves by symbol. You can still quote any ERC-20 by passing its
          contract address instead.
        </p>
        <TryIt
          path="/tokens"
          params={[
            {
              name: 'chainId',
              value: '8453',
              hint: 'Numeric EVM id or a chain symbol — 8453 and BASE both resolve.',
            },
          ]}
          maxRows={22}
        />

        <p className="pt-2 font-medium text-white">3 — a firm, ready-to-sign quote</p>
        <p>
          <code>amount</code> is in <strong>human units</strong> — <code>0.1</code>, not{' '}
          <code>100000000000000000</code>. The reply names the winning venue and carries
          exactly one execution shape.
        </p>
        <TryIt
          path="/quote"
          params={[
            { name: 'sellChain', value: '8453' },
            { name: 'sellToken', value: 'ETH' },
            { name: 'buyChain', value: '8453' },
            { name: 'buyToken', value: 'USDC' },
            { name: 'amount', value: '0.1', hint: 'Human units. Hex and exponents are rejected.' },
            { name: 'address', value: DEMO_ADDRESS, hint: 'The wallet that would sign. Quoting signs nothing.' },
            { name: 'partner', value: 'swapspro-demo', optional: true },
          ]}
          maxRows={26}
        />
        <p>
          Full parameter and error reference: <Link href="/api/quote">GET /quote</Link>.
          Why the response shape varies: <Link href="/sdk/routes">the three route shapes</Link>.
        </p>
      </Section>

      <Section title="Recipe 1 — a swap card in a React app">
        <p>
          The whole integration in one file: quote as the user types, execute through
          their wallet, wait for the receipt. The SDK handles the ERC-20 approval and
          waits for it to mine before sending the swap.
        </p>
        <CodeBlock caption="examples/SwapCard.tsx" code={card} />
        <Callout kind="danger">
          <p>
            This signs on Base mainnet. Start with an amount you would not mind losing to
            a mistake, and read <Link href="/sdk/execute">Execute a swap</Link> for what
            each failure mode looks like.
          </p>
        </Callout>
      </Section>

      <Section title="Recipe 2 — the widget in a static page">
        <p>
          No build step and no framework: an iframe and a height listener. Open the file
          in a browser and it works. The visitor connects their own wallet inside the
          frame and signs there, so your page never touches keys.
        </p>
        <CodeBlock caption="examples/embed.html" code={embed} />
        <p>
          Generate this snippet with your own colours on the{' '}
          <Link href="/widget">widget page</Link>.
        </p>
      </Section>

      <Section title="Recipe 3 — an agent that quotes and branches">
        <p>
          Node 18+, zero dependencies, no key and no wallet. It asks for a quote and
          prints what an agent would have to sign next — which differs depending on
          which venue won.
        </p>
        <CodeBlock caption="examples/agent-quote.mjs" code={agent} />
        <CodeBlock
          caption="both shapes, verified"
          tabs={[
            {
              label: 'same-chain',
              code: `$ node examples/agent-quote.mjs 8453 ETH 8453 USDC 0.1

0.1 ETH -> 250.60717 USDC
venue: 0x   floor: 248.114944   expires: 2026-09-04T04:41:31.004Z

shape: tx — a ready-to-sign EVM transaction
  then: eth_sendTransaction to 0x0000000000001ff3684f28c67538d4d072c22734 on chain 8453`,
            },
            {
              label: 'cross-chain',
              code: `$ node examples/agent-quote.mjs 8453 USDC BTC BTC 100

100 USDC -> 0.00121472 BTC
venue: thorchain   floor: 0.00117827   expires: 2026-09-04T04:55:22.000Z

shape: depositAddress — a THORChain-style deposit route.
  send 100 USDC to 0x10392ff6fa5dc86e78501515e59f01dd41f64dbc
  memo (verbatim): =:BTC.BTC:bc1qar0s…:117827:keep/thor1ujdj…:15/15`,
            },
          ]}
        />
        <p>
          The full agent path — discovery, signing, tracking to settlement — is on{' '}
          <Link href="/agents">Agent path</Link>.
        </p>
      </Section>
    </DocLayout>
  );
}
