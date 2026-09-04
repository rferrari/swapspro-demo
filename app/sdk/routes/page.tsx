import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import RouteExplorer from '@/components/RouteExplorer';

export default function RoutesPage() {
  return (
    <DocLayout href="/sdk/routes">
      <PageHeader
        eyebrow="SDK"
        title="The three route shapes"
        intro={
          <p>
            SwapsPro routes to third-party venues and names which one won. Because the
            venues settle differently, a quote comes back in exactly <strong>one</strong>{' '}
            of three execution shapes — and what you have to do next differs completely
            between them. This is the concept to get right before writing any execution
            code.
          </p>
        }
        doc="https://www.swaps.pro/docs/api/quote"
      />

      <Section title="The three shapes">
        <ParamTable
          nameHeader="Shape"
          rows={[
            {
              name: 'tx',
              type: 'same-chain EVM',
              effect: (
                <>
                  A ready-to-sign transaction: <code>chainId</code>, <code>to</code>,{' '}
                  <code>data</code>, <code>value</code>, <code>gasLimit</code>, already
                  0x-hex. Plus <code>approval</code> when the sell asset is an ERC-20.
                  Send it and wait for the receipt.
                </>
              ),
            },
            {
              name: 'order',
              type: 'CoW Protocol',
              effect: (
                <>
                  Not a transaction. PUT the appData document, sign{' '}
                  <code>typedData</code>, POST the signed order. Gasless and
                  asynchronous: solvers fill it in a batch auction and it can expire
                  unfilled.
                </>
              ),
            },
            {
              name: 'depositAddress + memo',
              type: 'THORChain-style',
              effect: (
                <>
                  Send the sell asset to an address with a memo attached, from a wallet
                  for the sell chain. There is nothing to sign on an EVM chain at all.
                </>
              ),
            },
          ]}
        />
        <Callout kind="gotcha" title="Branch on the shape, never on the pair">
          <p>
            Which venue wins is a pricing decision made per request. The same pair can
            come back as a <code>tx</code> today and an <code>order</code> tomorrow, so
            code that assumes a shape from the token symbols will break without warning.
            Check which field is present.
          </p>
        </Callout>
      </Section>

      <Section title="Explore it live">
        <p>
          Three presets. The first two are verified to return different shapes right now;
          the third shows what an ERC-20 sell adds. Every quote here is free and signs
          nothing.
        </p>
        <RouteExplorer />
        <Callout kind="note" title="Why there is no “give me a CoW order” button">
          <p>
            CoW wins when CoW prices best, which is a market condition rather than a
            parameter. The explorer labels whichever shape it actually got instead of
            promising one — and the <code>order</code> branch is documented in the code
            below regardless, because you still have to handle it when it turns up.
          </p>
        </Callout>
      </Section>

      <Section title="How to implement">
        <p>
          One branch, three arms, in every integration that executes. The SDK covers the
          first arm and refuses the third explicitly rather than silently doing nothing.
        </p>
        <CodeBlock
          caption="the complete branch"
          code={`const quote = await swaps.quote({ /* … */ });

if (quote.tx) {
  // Same-chain EVM. executeSwap handles the approval and waits for it to mine.
  const hash = await swaps.executeSwap(quote, eth);
  const receipt = await swaps.waitForReceipt(hash, { signer: eth });
  // Settled: it is in the receipt.

} else if (quote.order) {
  // CoW. Three steps, in this order.
  await fetch(quote.order.appDataUrl, {
    method: 'PUT',
    body: JSON.stringify({ fullAppData: quote.order.appData.fullAppData }),
  });
  const signature = await eth.request({
    method: 'eth_signTypedData_v4',
    params: [account, JSON.stringify(quote.order.typedData)],
  });
  await fetch(quote.order.postUrl, {
    method: 'POST',
    body: JSON.stringify({ ...quote.order.body, signature }),
  });
  // NOT settled: poll the order uid. It can expire unfilled.
  // The vault relayer still needs a one-time ERC-20 allowance — quote.approval.

} else if (quote.depositAddress) {
  // THORChain-style. Send from a wallet for the sell chain, memo VERBATIM.
  // executeSwap() throws NotSupportedError here — there is no tx.
  // Settled when the destination chain pays out.
}`}
        />
      </Section>

      <Section title="What settlement means, per shape">
        <ul>
          <li>
            <strong>tx</strong> — settled in the transaction receipt. One poll, one
            answer.
          </li>
          <li>
            <strong>order</strong> — settled when the returned <code>orderUid</code>{' '}
            fills. Usually under a minute, but it is a batch auction: treat it as
            asynchronous and poll, never assume a fill.
          </li>
          <li>
            <strong>depositAddress</strong> — settled when the destination chain receives
            the output. Nothing on the sell chain tells you it worked.
          </li>
        </ul>
      </Section>

      <Section title="Shared rules, whichever shape you got">
        <ul>
          <li>
            <strong>Execute exactly what came back.</strong> Do not rebuild the calldata,
            do not re-derive the memo, do not round the amounts.
          </li>
          <li>
            <code>minBuyAmount</code> is the guarantee; <code>buyAmount</code> is the
            estimate. Never show a user a number better than the floor.
          </li>
          <li>
            Re-quote past <code>expiresAt</code>. About sixty seconds is all you get.
          </li>
          <li>
            An ERC-20 sell needs native gas for <em>two</em> transactions — the approval
            and the swap. Check the native balance before quoting, not after.
          </li>
        </ul>
        <p>
          Signing all of this for real: <Link href="/sdk/execute">Execute a swap</Link>.
        </p>
      </Section>
    </DocLayout>
  );
}
