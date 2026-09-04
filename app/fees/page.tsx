import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';

export default function FeesPage() {
  return (
    <DocLayout href="/fees">
      <PageHeader
        eyebrow="Reference"
        title="Fees"
        intro={
          <p>
            Every path through SwapsPro and what it costs — including the paths that
            charge nothing. The swap fee is included in the quote before anyone signs, so
            the number a user reviews is the number they get.
          </p>
        }
        doc="https://www.swaps.pro/docs/fees"
      />

      <Section title="The table">
        <ParamTable
          nameHeader="Path"
          rows={[
            {
              name: 'Swaps',
              effect:
                '0.30% routing fee, included in the quote before anyone signs. Cross-chain THORChain-style routes carry the same 0.30% as a multi-affiliate memo split.',
            },
            {
              name: 'CoW surplus',
              effect:
                'Where execution beats the limit price, SwapsPro declares a 25% share of the surplus, capped at 0.7% of volume however large the surplus gets.',
            },
            {
              name: 'Batch Send',
              effect:
                'A flat 0.0002 ETH per batch, appended as the last call. Always in native ETH, never taken out of the tokens being sent, and not charged if nothing sends. Network gas is separate and quoted by the wallet.',
            },
            { name: 'Create Contract', effect: 'No fee. The pre-filled support amount is a suggestion the user can zero in one click; the deploy proceeds either way.' },
            { name: 'Quotes', effect: 'Free. No key, no payment, no account.' },
            {
              name: 'Partner fees',
              effect:
                'Up to 100 bps on top — but only where the winning venue can carry a second fee. The quote reports what was really collected.',
            },
          ]}
        />
        <Callout kind="note" title="Some routes carry no SwapsPro fee at all">
          <p>
            Pioneer&apos;s same-chain venues and the Robinhood Chain Uniswap path expose
            no fee hook, and the response says so rather than pretending otherwise.
          </p>
        </Callout>
      </Section>

      <Section title="Partner fees, honestly">
        <p>
          Set <code>partnerFeeBps</code> and every quote comes back with a{' '}
          <code>partnerFee</code> block answering two separate questions: whether the
          venue could collect a fee at all, and whether it was paid to you. It never just
          echoes your number back.
        </p>
        <CodeBlock
          caption="read the note, not the request"
          code={`const quote = await swaps.quote({ /* … */ });

quote.partnerFee;
// {
//   requestedBps: 25,      // what you asked for, already capped
//   collectedBps: 25,      // what this route actually collects — 0 is common
//   collected: true,
//   recipient: "0x…",
//   note: "…"              // a plain sentence; when collectedBps is 0 it says why
// }

if (!quote.partnerFee.collected) {
  // Do not show the user a fee you are not taking.
}`}
        />
        <ParamTable
          nameHeader="Venue"
          rows={[
            { name: '0x · CoW', effect: 'Collects your fee, and can pay a derived split.' },
            { name: 'LI.FI', effect: 'Collects, but cannot pay a split — one fee wallet per integrator, registered on their portal.' },
            { name: 'Pioneer (same-chain), non-EVM', effect: 'Cannot carry a second fee at all.' },
            { name: 'A venue that clamped the fee', effect: 'Keeps SwapsPro’s recipient — paying a split derived for a larger fee would divide the smaller amount by the wrong ratio.' },
          ]}
        />
        <Callout kind="gotcha" title="Attribution is not settlement">
          <p>
            <code>partner</code> is a free-form attribution id: it lands in a request log
            and nothing more. Being <em>paid</em> is a separate, opt-in step — you name a
            payout address and a fee, which together derive a 0xSplits contract, and
            deploying that contract is the whole activation. The details, including the
            100/200 bps ceilings, are on <Link href="/tools/partners">Partners</Link>.
          </p>
        </Callout>
      </Section>

      <Section title="What this costs you as an integrator">
        <p>
          Nothing. There is no subscription, no account, no key and no minimum. The only
          thing anyone can buy is the <Link href="/pro">Pro Pass</Link>, and it is
          optional.
        </p>
      </Section>
    </DocLayout>
  );
}
