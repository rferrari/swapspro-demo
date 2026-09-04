import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';

export default function ProPage() {
  return (
    <DocLayout href="/pro">
      <PageHeader
        eyebrow="Reference"
        title="Free and Pro"
        intro={
          <p>
            The SwapsPro Pass is an optional lifetime licence — a soulbound ERC-721
            (ERC-5192) on Base, paid once. There is no account and no database behind it:
            holding the pass <em>is</em> Pro, and every check is an on-chain read.
          </p>
        }
        doc="https://www.swaps.pro/docs/pro"
      />

      <Section title="What every visitor gets free">
        <ul>
          <li>Swapping, cross-chain and same-chain, priced across every integrated venue.</li>
          <li>
            The whole <Link href="/api">HTTP API</Link>: no key, no account, no signup.
          </li>
          <li>The <Link href="/widget">widget</Link> and the <Link href="/sdk">SDK</Link>.</li>
          <li>Every tool: batch send, airdrop, batch swap, splits, limit orders, portfolio.</li>
        </ul>
      </Section>

      <Section title="What the pass adds">
        <ParamTable
          nameHeader="Perk"
          rows={[
            {
              name: 'Fee waiver (first 100)',
              effect:
                'Passes 1–100 carry a full SwapsPro fee waiver on the paths where a fee can actually be dropped: 0x, CoW including its surplus share, and LI.FI same-chain and cross-chain.',
            },
            {
              name: 'Partner fee ceiling',
              effect: 'Raises the partner ceiling from 100 to 200 bps when the payout address holds the pass. It does not change SwapsPro’s own 30 bps.',
            },
            {
              name: 'Widget badge',
              effect: 'brand=0&pro=0x… removes the ⚡ swaps.pro badge, verified on-chain and failing closed.',
            },
            {
              name: 'Rate-limit elevation',
              effect: 'Only on a deployment with a shared rate-limit store. This deployment has none, so no elevation is sold to anybody and the perk is dormant.',
            },
          ]}
        />
        <Callout kind="note" title="Dormant, not removed">
          <p>
            The elevation perk is real code against a facility this deployment does not
            run — which is why <Link href="/api/access">/access</Link> answers 503 for
            pass holders and non-holders alike. Anything on the pass page that is planned
            rather than shipped is marked as such.
          </p>
        </Callout>
      </Section>

      <Section title="How the check works">
        <p>
          The check reads <code>tokenOf(holder)</code>, not <code>balanceOf</code>,
          because the pass <em>number</em> is a benefit. <code>tokenOf</code> returns 0
          for a non-holder, so one call answers both questions and 0 can never qualify.
        </p>
        <p>
          Ownership has <strong>three</strong> outcomes, not two: a pass waives, no pass
          charges, and a read that <em>failed</em> also charges — failing closed on the
          money, because charging when we cannot verify costs a holder one quote, while
          the opposite waives for anyone who can arrange for the check to fail.
        </p>
        <Callout kind="note" title="But the UI fails open on the truth">
          <p>
            <code>verifyFailed</code> makes the interface say &quot;could not
            check&quot; rather than telling a holder they have no pass. Nothing anywhere
            trusts a client-supplied boolean: the server-stamped 0x path re-reads{' '}
            <code>tokenOf(taker)</code> itself.
          </p>
        </Callout>
      </Section>

      <Section title="Buying one as an agent">
        <p>
          Minting with ETH happens on the pass page. The other path exists specifically
          so an autonomous agent can buy one without a browser:
        </p>
        <CodeBlock
          caption="x402, 40 USDC on Base"
          code={`// 1. Ask, get the x402 terms, pay through the facilitator.
const res = await fetch('https://www.swaps.pro/api/pro/x402');

// 2. The answer is an EIP-712 mint voucher for the confirmed PAYER,
//    valid for one hour. Both x402 wire versions are spoken.

// 3. The agent submits the mint itself and pays its own gas:
//    mintWithVoucher(to, deadline, signature)
//
// A replayed voucher reverts — one pass per wallet is enforced on chain.`}
        />
        <p>
          The contract is at <code>0x568fcbade475c1f20ed9a5155814eeeadf9c69ef</code> on
          Base, capped at 100 by the contract, with its artwork in the bytecode. Paying is
          minting: the value is forwarded to the payout split inside the same
          transaction, so the contract never holds ETH.
        </p>
        <Callout kind="gotcha" title="It is not transferable and it gates nothing">
          <p>
            Soulbound, so it cannot be sold on. And no feature is locked behind it — the
            early-access and priority-support perks are team commitments rather than
            anything the code enforces.
          </p>
        </Callout>
      </Section>
    </DocLayout>
  );
}
