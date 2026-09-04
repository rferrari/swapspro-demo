import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import Steps from '@/components/Steps';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import TryIt from '@/components/TryIt';
import { ACCESS_HEADER } from '@/lib/config';

export default function AgentAccessPage() {
  return (
    <DocLayout href="/agents/access">
      <PageHeader
        eyebrow="AI agents"
        title="x402 and machine discovery"
        intro={
          <p>
            Two things an agent needs that a person does not: a way to read the
            documentation without a browser, and a way to pay for headroom without an
            account. SwapsPro answers the first with <code>llms.txt</code> and the second
            with x402 — where a deployment sells headroom at all.
          </p>
        }
        doc="https://www.swaps.pro/docs/api/access"
      />

      <Section title="Start with the free ceiling, because it is probably enough">
        <p>
          Quoting is free: no key, no payment, no account. The limit is 60 requests per
          minute per IP, <strong>best-effort</strong> — counted in memory inside each
          serverless instance, so the effective ceiling is higher than the number and
          varies with how many instances are warm.
        </p>
        <Callout kind="note" title="Do not design around the number">
          <p>
            Treat it as a courtesy brake, not a quota. And do not buy a grant until you
            have actually been rate limited — a real 429 from{' '}
            <Link href="/api/quote">/quote</Link>. At the free ceiling most agents never
            need one.
          </p>
        </Callout>
      </Section>

      <Section title="On this deployment there is nothing to buy">
        <TryIt path="/access" autoRun />
        <p>
          Elevation is only sold where the limit is counted in a shared store. Here it is
          per-instance and therefore unmeterable, so <code>/access</code> answers 503
          with <code>ACCESS_NOT_CONFIGURED</code> rather than quoting a price for
          headroom nobody can measure. <strong>Quoting is unaffected.</strong> Treat the
          503 as &quot;no grants here&quot;, not as a retryable error.
        </p>
      </Section>

      <Section title="The x402 handshake, where a facilitator is configured">
        <Steps
          steps={[
            {
              title: 'Ask, and get a 402 back',
              body: (
                <>
                  <p>
                    The response carries the x402 terms: what to pay, to whom, on which
                    chain.
                  </p>
                  <CodeBlock code={`const res = await fetch(\`\${API}/access\`);
if (res.status === 402) {
  const terms = await res.json();   // x402 payment terms
}`} />
                </>
              ),
            },
            {
              title: 'Pay the terms with your x402 client',
              body: (
                <p>
                  The 402 body states the amount, the asset and the chain — read them
                  from the response rather than hard-coding them, since they are the
                  deployment&apos;s to set. The agent signs the payment with its own key.
                </p>
              ),
            },
            {
              title: 'Retry with the signature',
              body: (
                <>
                  <p>
                    Send it as <code>PAYMENT-SIGNATURE</code> (x402 v2);{' '}
                    <code>X-PAYMENT</code> is accepted for v1. A 200 comes back carrying
                    the bearer grant.
                  </p>
                  <CodeBlock code={`const granted = await fetch(\`\${API}/access\`, {
  headers: { 'PAYMENT-SIGNATURE': signedPayload },
});
const { token, header, expiresAt } = await granted.json();`} />
                </>
              ),
            },
            {
              title: 'Send the grant on every quote',
              body: (
                <>
                  <CodeBlock code={`// The grant response names the header it wants — send that,
// and a rename can never strand your client.
await fetch(quoteUrl, {
  headers: { [grant.header]: grant.token },
});

// 'Authorization: Bearer <token>' is always accepted too.`} />
                  <p>
                    600 requests per minute for 24 hours, bound to the paying address.
                    The header is currently <code>{ACCESS_HEADER}</code> and is being
                    renamed — which is exactly why the sample reads{' '}
                    <code>grant.header</code> rather than naming it. See{' '}
                    <Link href="/api/access">GET /access</Link> for the migration and its
                    CORS ordering.
                  </p>
                </>
              ),
            },
          ]}
        />
        <Callout kind="gotcha" title="It is a bearer token — keep it server-side">
          <p>
            Everyone presenting it draws from the same bucket, so sharing it{' '}
            <em>divides</em> your headroom rather than multiplying it.
          </p>
        </Callout>
      </Section>

      <Section title="The free path: a Pro Pass instead of a payment">
        <p>
          A pass holder claims the same elevation without paying again. Three requests,
          one signature, no transaction.
        </p>
        <CodeBlock
          caption="challenge, sign, claim"
          code={`// 1. Ask for the message to sign.
const { message, issued } = await (
  await fetch(\`\${API}/access?address=\${holder}&challenge=1\`)
).json();

// 2. Sign it — EIP-191 personal_sign, no gas, no transaction.
const signature = await eth.request({
  method: 'personal_sign',
  params: [message, holder],
});

// 3. Claim. 'issued' must be returned verbatim.
const { token } = await (
  await fetch(\`\${API}/access?address=\${holder}\` +
    \`&issued=\${encodeURIComponent(issued)}&signature=\${signature}\`)
).json();`}
        />
        <p>
          Both paths elevate to the same 600 rpm for 24 hours. On this deployment neither
          is available — the perk is dormant rather than removed. See{' '}
          <Link href="/pro">Free &amp; Pro</Link>.
        </p>
      </Section>

      <Section title="Machine-readable discovery">
        <p>
          SwapsPro publishes its own documentation in a form an agent can read directly,
          and advertises it on every response:
        </p>
        <CodeBlock
          caption="the header is on every page and every endpoint"
          code={`$ curl -sI https://www.swaps.pro/api/sdk/v1/quote | grep -i '^link'
link: </llms.txt>; rel="describedby"; type="text/plain"`}
        />
        <ul>
          <li>
            <a href="https://www.swaps.pro/llms.txt" target="_blank" rel="noreferrer">
              <code>/llms.txt</code>
            </a>{' '}
            — the index, with a one-line annotation per link. About 8 kB.
          </li>
          <li>
            <a href="https://www.swaps.pro/llms-full.txt" target="_blank" rel="noreferrer">
              <code>/llms-full.txt</code>
            </a>{' '}
            — the same index with every section inlined. About 44 kB: the entire
            documentation in one fetch.
          </li>
        </ul>
        <Callout kind="note" title="Where this site's content came from">
          <p>
            Every parameter table, error code and quoted rule in this starter kit was
            taken from <code>llms-full.txt</code> and checked against live responses —
            which is exactly the workflow the file exists to support.
          </p>
        </Callout>
        <CodeBlock
          caption="an agent bootstrapping itself"
          code={`const docs = await (await fetch('https://www.swaps.pro/llms-full.txt')).text();
// ~44 kB of markdown: every endpoint, every parameter, every error code,
// with real captured response bodies. One fetch, then quote.`}
        />
      </Section>
    </DocLayout>
  );
}
