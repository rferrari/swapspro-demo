import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import TryIt from '@/components/TryIt';
import { ACCESS_HEADER, ACCESS_HEADER_NEXT } from '@/lib/config';

export default function AccessPage() {
  return (
    <DocLayout href="/api/access">
      <PageHeader
        eyebrow="HTTP API"
        title="GET /access"
        intro={
          <p>
            A 24-hour grant that lifts <Link href="/api/quote">/quote</Link> from 60 to
            600 requests per minute, paid over x402 or unlocked by a Pro Pass. On{' '}
            <code>www.swaps.pro</code> it answers <strong>503</strong>, and that is the
            correct answer rather than an outage — the reason is worth reading.
          </p>
        }
        doc="https://www.swaps.pro/docs/api/access"
      />

      <Section title="Try it — this returns 503, on purpose">
        <TryIt path="/access" autoRun />
        <p>
          The body says why: the quote limit on this deployment is counted in memory
          inside each serverless instance rather than in a shared store, so it is
          best-effort and cannot be metered. Elevation is only sold where the limit is
          countable, so none is sold here. <code>missingConfig</code> even names what is
          absent (<code>KV_REST_API_URL + KV_REST_API_TOKEN</code>).
        </p>
        <Callout kind="note" title="Treat 503 as “no grants here”">
          <p>
            Not as a retryable error. Quoting is unaffected — still free, still keyless,
            still 60 rpm best-effort. Most agents never need more.
          </p>
        </Callout>
      </Section>

      <Section title="Parameters">
        <ParamTable
          rows={[
            {
              name: 'PAYMENT-SIGNATURE',
              type: 'header',
              effect: (
                <>
                  The signed payment answering the 402 challenge (x402 v2).{' '}
                  <code>X-PAYMENT</code> is accepted for v1.
                </>
              ),
            },
            { name: 'address', type: 'query', effect: 'Pro Pass flow, step 1: the wallet holding the pass. Returns the message to sign.' },
            { name: 'issued', type: 'query', effect: 'Pro Pass flow, step 2: the issued value from step 1, verbatim.' },
            { name: 'signature', type: 'query', effect: 'Pro Pass flow, step 2: EIP-191 personal_sign of the step-1 message.' },
          ]}
        />
      </Section>

      <Section title="What a grant looks like where one is sold">
        <CodeBlock
          caption="200 response"
          code={`{
  "token": "sp_acc_…",
  "header": "X-SwapPro-Access",
  "subject": "0x21c9…Ad3e",
  "via": "x402",
  "limit": { "requestsPerMinute": 600, "previously": 60 },
  "expiresAt": "2026-09-04T12:00:00.000Z",
  "ttlSeconds": 86400,
  "usage": "Send \\"X-SwapPro-Access: <token>\\" (or \\"Authorization: Bearer <token>\\") on GET /api/sdk/v1/quote.",
  "note": "Quotes are free at 60 requests per minute with no credential at all — this token only raises the ceiling. It is a bearer token: everyone presenting it draws from the same bucket, so sharing it divides your headroom rather than multiplying it."
}`}
        />
        <Callout kind="note" title="The response names its own header — use that field">
          <p>
            <code>header</code> is not decoration. Read the header name out of the
            response instead of hard-coding it and your client keeps working through a
            rename, because the server tells you what to send.
          </p>
        </Callout>
        <CodeBlock
          caption="using the grant, without hard-coding the name"
          code={`const grant = await (await fetch(\`\${API}/access\`, { headers })).json();

const res = await fetch(quoteUrl, {
  headers: { [grant.header]: grant.token },   // whatever the server asked for
});

// Or skip the question entirely — this form is always accepted:
const res2 = await fetch(quoteUrl, {
  headers: { Authorization: \`Bearer \${grant.token}\` },
});`}
        />
      </Section>

      <Section title="The header is being renamed">
        <p>
          <code>{ACCESS_HEADER}</code> becomes <code>{ACCESS_HEADER_NEXT}</code>.{' '}
          <code>Authorization: Bearer</code> is unaffected, and so is any client that
          reads <code>grant.header</code> from the response.
        </p>
        <Callout kind="gotcha" title="Server first, clients second — because of CORS">
          <p>
            A browser sends a preflight for any custom header, and one the server does
            not list in <code>Access-Control-Allow-Headers</code> is blocked before the
            request leaves. Today that list is{' '}
            <code>Content-Type, Authorization, {ACCESS_HEADER}</code>, so browser code
            sending the new name would fail even though the API itself would accept it.
            The server must advertise the new name before clients start sending it.
          </p>
          <p>
            Outside a browser there is no preflight, so a server-side client can send
            both names at once and span the change with no coordinated deploy.
          </p>
        </Callout>
        <CodeBlock
          caption="src/lib/access.ts in this repo"
          code={`import { accessFetch } from '@/lib/access';
import { SwapsPro } from '@swapspro/sdk';

// The SDK takes a custom fetch precisely so callers can attach headers.
const swaps = new SwapsPro({
  partner: 'your-app-id',
  fetch: accessFetch(token, 'server'),   // both header names + Bearer
});

// In a browser, pass 'browser' (the default) — Bearer only, so no preflight
// change is needed and the rename cannot break it.`}
        />
        <p>
          The name itself lives in one constant, <code>ACCESS_HEADER</code> in{' '}
          <code>src/lib/config.ts</code>. Every page and sample in this kit renders from
          it, so the day the rename lands it is a one-line change here.
        </p>
      </Section>

      <Section title="Errors">
        <ParamTable
          nameHeader="Status"
          rows={[
            { name: '402', effect: 'No payment presented, and the facilitator IS configured. The body carries the x402 terms.' },
            { name: '503 ACCESS_NOT_CONFIGURED', effect: 'No x402 facilitator on this deployment. What you get above.' },
          ]}
        />
      </Section>

      <Section title="Rules">
        <ul>
          <li>
            <strong>Do not buy a grant until you have actually been rate limited</strong>{' '}
            — a real 429 from <code>/quote</code>. At the free ceiling most agents never
            need one.
          </li>
          <li>
            Keep the token server-side. It is a bearer token: presenting it from many
            clients shares one bucket, so sharing divides your headroom rather than
            multiplying it.
          </li>
          <li>
            A 503 with <code>missingConfig</code> means &quot;no grants here&quot;. Do
            not retry it.
          </li>
        </ul>
        <p>
          The full handshake — both the x402 payment path and the free Pro Pass path — is
          walked through on <Link href="/agents/access">x402 &amp; discovery</Link>.
        </p>
      </Section>
    </DocLayout>
  );
}
