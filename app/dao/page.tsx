import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import Steps from '@/components/Steps';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';

export default function DaoPage() {
  return (
    <DocLayout href="/dao">
      <PageHeader
        eyebrow="Reference"
        title="DAO and treasury tooling"
        intro={
          <p>
            SwapsPro runs as a Safe App inside <code>app.safe.global</code>. A Safe is a
            contract account, so the interesting part is what happens to signatures — and
            the answer is ERC-1271.
          </p>
        }
        doc="https://www.swaps.pro/docs/dao"
      />

      <Section title="Adding it to a Safe">
        <Steps
          steps={[
            {
              title: 'Use the /swap URL, not the apex domain',
              body: (
                <>
                  <p>
                    The apex domain serves the marketing landing page and will not load
                    as an app.
                  </p>
                  <CodeBlock caption="Safe → Apps → Add custom app" code={`https://www.swaps.pro/swap`} />
                </>
              ),
            },
            {
              title: 'Sign the way a contract account signs',
              body: (
                <p>
                  Anything that needs a <em>signature</em> rather than a transaction goes
                  through ERC-1271: SwapsPro detects contract accounts by code lookup and
                  signs gasless limit orders and TWAP ladders that way. The Safe still
                  collects its usual owner threshold before anything executes — SwapsPro
                  proposes, the Safe decides.
                </p>
              ),
            },
          ]}
        />
        <Callout kind="note" title="Why /swap and not the widget embed">
          <p>
            The app itself is frameable only by the hosts it names: the{' '}
            <code>/swap</code> response ships{' '}
            <code>frame-ancestors &apos;self&apos; app.safe.global farcaster.xyz
            warpcast.com</code>, so a Safe (or a Farcaster mini app) can load it and
            nothing else can. The <Link href="/widget">widget embed</Link> is the
            opposite — <code>/embed</code> sends <code>frame-ancestors *</code> and goes
            on any site. Two different products, two deliberately different policies.
          </p>
        </Callout>
      </Section>

      <Section title="What a treasury actually uses">
        <ul>
          <li>
            <strong><Link href="/tools/batch-send">Batch Send</Link></strong> pays a whole
            team in one batch instead of one transfer per recipient — which for a
            multisig means one round of signatures rather than N.
          </li>
          <li>
            <strong><Link href="/tools/limit-orders">TWAP</Link></strong> ladders a
            treasury sale into equal parts over hours or days through CoW, so a large
            sale does not move the price against itself.
          </li>
          <li>
            <strong><Link href="/tools/create-contract">Splits</Link></strong> deploys an
            audited 0xSplits contract that shares out every payment it receives
            automatically.
          </li>
        </ul>
      </Section>

      <Section title="Building this into your own app">
        <p>
          Nothing here is Safe-specific on your side. The SDK takes any EIP-1193
          provider, and a Safe App exposes one — so the{' '}
          <Link href="/sdk/execute">execution path</Link> is unchanged. What differs is
          timing: a Safe transaction is <em>proposed</em>, not sent, so the hash you get
          back may not be minable until the threshold is met.
        </p>
        <Callout kind="gotcha" title="Do not block your UI on a receipt inside a Safe">
          <p>
            <code>waitForReceipt</code> times out after five minutes by default. In a
            multisig the signatures may take days. Treat the proposal as the end of your
            flow and let the Safe report the execution.
          </p>
        </Callout>
      </Section>
    </DocLayout>
  );
}
