import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import Steps from '@/components/Steps';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';

export default function AgentsPage() {
  const script = fs.readFileSync(
    path.join(process.cwd(), 'examples', 'agent-quote.mjs'),
    'utf8'
  );

  return (
    <DocLayout href="/agents">
      <PageHeader
        eyebrow="AI agents"
        title="The agent path"
        intro={
          <p>
            Written for a program rather than a person. Quoting is free and
            unauthenticated, and every quote comes back as data you sign yourself.
            SwapsPro never takes custody and never holds keys — an agent does not connect
            a wallet at all, it holds a key and signs the returned payload itself.
          </p>
        }
        doc="https://www.swaps.pro/docs/agents"
      />

      <Section title="The whole path, in order">
        <Steps
          steps={[
            {
              title: 'Discover',
              body: (
                <>
                  <p>
                    <code>GET /chains</code>, then{' '}
                    <code>GET /tokens?chainId=…</code>. Both are cached for an hour and
                    neither is rate limited — cache them yourself and you will
                    essentially never call them again.
                  </p>
                  <CodeBlock
                    code={`const { chains } = await (await fetch(\`\${API}/chains\`)).json();
const { tokens } = await (await fetch(\`\${API}/tokens?chainId=8453\`)).json();`}
                  />
                </>
              ),
            },
            {
              title: 'Quote',
              body: (
                <p>
                  <code>GET /quote</code>. Free, no key, no payment. 60 requests per
                  minute per IP, best-effort — see{' '}
                  <Link href="/agents/access">x402 &amp; discovery</Link> for what
                  happens when that is not enough, and why it usually is.
                </p>
              ),
            },
            {
              title: 'Recognise the shape',
              body: (
                <p>
                  A quote comes back in exactly one of three execution shapes and{' '}
                  <strong>you must branch on which</strong>: <code>tx</code>,{' '}
                  <code>order</code>, or <code>depositAddress</code> +{' '}
                  <code>memo</code>. Which one is a pricing outcome, not a property of
                  the pair — the full treatment is on{' '}
                  <Link href="/sdk/routes">the three route shapes</Link>.
                </p>
              ),
            },
            {
              title: 'Sign and broadcast',
              body: (
                <p>
                  With your own key. SwapsPro never holds keys or funds and cannot move
                  anything on your behalf. There is no callback, no webhook and no
                  server-side job doing this for you.
                </p>
              ),
            },
            {
              title: 'Track to settlement',
              body: (
                <p>
                  Same-chain routes settle in the transaction receipt; a CoW order
                  settles when the returned <code>orderUid</code> fills; a deposit route
                  settles when the destination chain receives the output. Three shapes,
                  three different definitions of &quot;done&quot;.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section title="A runnable agent, in one file">
        <p>
          Node 18+, zero dependencies, no key and no wallet. It quotes and prints what
          would have to be signed next — including the branch, which is the part worth
          copying.
        </p>
        <CodeBlock caption="examples/agent-quote.mjs" code={script} />
        <CodeBlock
          caption="run it"
          code={`node examples/agent-quote.mjs                      # same-chain: returns a tx
node examples/agent-quote.mjs 8453 USDC BTC BTC 100 # cross-chain: a deposit address`}
        />
      </Section>

      <Section title="What the agent must hold">
        <p>
          A funded wallet on the sell chain, and enough native gas on that chain to send{' '}
          <strong>both</strong> the approval and the swap. Quoting itself needs nothing
          at all.
        </p>
        <Callout kind="gotcha" title="Check the native balance before quoting, not after">
          <p>
            An ERC-20 sell is two transactions. An agent that quotes first and discovers
            it cannot afford the gas second has already burned a quote and a rate-limit
            slot on a swap it was never going to make.
          </p>
        </Callout>
        <Callout kind="gotcha" title="Unmined approvals are the most common failure">
          <p>
            Grant <code>approval.amountWei</code> of <code>approval.token</code> to{' '}
            <code>approval.spender</code> and <strong>wait for it to mine</strong> before
            sending the swap. It is an exact-amount allowance, never unlimited.
          </p>
        </Callout>
        <Callout kind="gotcha" title="Quotes expire in about a minute">
          <p>
            Check <code>expiresAt</code> and re-quote rather than signing stale data. An
            agent that batches quotes and signs them later will send transactions the
            venue no longer honours.
          </p>
        </Callout>
      </Section>

      <Section title="Why this surface exists">
        <p>
          There is no key to obtain, no account to create, no integrator database and
          nothing to revoke — which means an agent can go from nothing to a signed swap
          without a human in the loop for onboarding. The <code>partner</code> parameter
          is attribution in a request log and nothing more.
        </p>
        <p>
          The one thing an agent can buy is the Pro Pass, over x402 at{' '}
          <code>/api/pro/x402</code> — 40 USDC on Base, answered with an EIP-712 mint
          voucher the agent submits itself. That path exists specifically so an
          autonomous agent can buy one without a browser. See{' '}
          <Link href="/pro">Free &amp; Pro</Link>.
        </p>
      </Section>
    </DocLayout>
  );
}
