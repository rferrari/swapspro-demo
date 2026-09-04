import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import TryIt from '@/components/TryIt';
import { ACCESS_HEADER, DEMO_ADDRESS } from '@/lib/config';

export default function QuotePage() {
  return (
    <DocLayout href="/api/quote">
      <PageHeader
        eyebrow="HTTP API"
        title="GET /quote"
        intro={
          <p>
            One routed quote across every integrated venue, returned ready to sign: a
            transaction, a CoW order, or a deposit address. This is the endpoint the app,
            the widget and the SDK all sit on — there is no privileged version of it.
          </p>
        }
        doc="https://www.swaps.pro/docs/api/quote"
      />

      <Section title="Parameters">
        <ParamTable
          rows={[
            { name: 'sellChain', type: 'chain', def: 'required', effect: 'Chain symbol or numeric id, from /chains.' },
            { name: 'sellToken', type: 'symbol | address', def: 'required', effect: 'Symbol from /tokens, or a contract address. An address always wins over a symbol.' },
            { name: 'buyChain', type: 'chain', def: 'required', effect: 'May differ from sellChain for a cross-chain route.' },
            { name: 'buyToken', type: 'symbol | address', def: 'required', effect: 'Symbol or contract address.' },
            {
              name: 'amount',
              type: 'decimal string',
              def: 'required',
              effect: (
                <>
                  Human amount of <code>sellToken</code> — <code>&quot;0.1&quot;</code>,
                  never base units. Hex, exponents and negatives are rejected.
                </>
              ),
            },
            { name: 'address', type: 'address', def: 'required', effect: 'The wallet that will sign. The venue builds the transaction for this sender.' },
            { name: 'recipient', type: 'address', def: 'same as address', effect: 'Where the bought asset lands. Required for cross-chain routes.' },
            { name: 'slippage', type: 'percent', def: "the venue's floor", effect: 'Maximum slippage, 0 < s ≤ 50. Sets minBuyAmount on venues that accept it.' },
            { name: 'partner', type: 'string ≤ 64', def: '—', effect: 'Your integrator id. Stamped on the quote and used for attribution.' },
            { name: 'partnerFeeBps', type: 'integer bps', def: '0', effect: 'Fee you keep on top of SwapsPro’s, capped by tier. The response says what was actually collected.' },
            {
              name: ACCESS_HEADER,
              type: 'header',
              def: '—',
              effect: (
                <>
                  A grant from <Link href="/api/access">/access</Link>. Raises the ceiling
                  from 60 to 600 rpm. <code>Authorization: Bearer</code> is also accepted
                  — and is the form that survives the header rename.
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Try it">
        <p>
          Two presets worth running back to back. The same-chain pair returns a{' '}
          <code>tx</code>; switching <code>buyChain</code> to <code>BTC</code> (with{' '}
          <code>buyToken=BTC</code> and a <code>recipient</code>) returns a{' '}
          <code>depositAddress</code> and a <code>memo</code> instead.
        </p>
        <TryIt
          path="/quote"
          params={[
            { name: 'sellChain', value: '8453' },
            { name: 'sellToken', value: 'ETH' },
            { name: 'buyChain', value: '8453', hint: 'Set to BTC for a cross-chain deposit route.' },
            { name: 'buyToken', value: 'USDC' },
            { name: 'amount', value: '0.1' },
            { name: 'address', value: DEMO_ADDRESS },
            { name: 'recipient', value: '', optional: true, hint: 'Required when the chains differ.' },
            { name: 'slippage', value: '', optional: true, placeholder: '1', hint: 'Percent, 0 < s ≤ 50.' },
            { name: 'partner', value: 'swapspro-demo', optional: true },
          ]}
          maxRows={28}
        />
      </Section>

      <Section title="What comes back">
        <ParamTable
          nameHeader="Field"
          rows={[
            { name: 'provider', type: 'string', effect: 'Which venue won: 0x, cow, lifi, thorchain, …' },
            { name: 'buyAmount', type: 'string', effect: 'Expected output, human decimals. The estimate.' },
            { name: 'minBuyAmount', type: 'string', effect: 'The enforced floor. The guarantee.' },
            { name: 'rate', type: 'number', effect: 'buyAmount per 1 sellToken. The one numeric field — the amounts are strings.' },
            { name: 'tx', type: 'object?', effect: 'chainId, to, data, value, gasLimit — ready for eth_sendTransaction.' },
            { name: 'approval', type: 'object?', effect: 'Exact-amount ERC-20 approve to send first, when needed. Never unlimited.' },
            { name: 'order', type: 'object?', effect: 'CoW: typedData to sign, plus body and postUrl to submit.' },
            { name: 'depositAddress / memo', type: 'string?', effect: 'THORChain-style: where to send and what to say.' },
            { name: 'expiresAt', type: 'ISO time', effect: 'After this, the quote must not be used.' },
            { name: 'partnerFee', type: 'object', effect: 'What was requested, what was collected, and why — never just an echo of your number.' },
          ]}
        />
        <Callout kind="note" title="Exactly one execution shape">
          <p>
            Every quote carries <code>tx</code>, <em>or</em> <code>order</code>,{' '}
            <em>or</em> <code>depositAddress</code> + <code>memo</code> — never two. What
            you must do with each is on{' '}
            <Link href="/sdk/routes">the three route shapes</Link>.
          </p>
        </Callout>
      </Section>

      <Section title="Rules that keep you out of trouble">
        <ul>
          <li>
            Read <code>minBuyAmount</code> as the guarantee and <code>buyAmount</code> as
            the estimate. <strong>Never promise a user more than the floor.</strong>
          </li>
          <li>
            Execute exactly what came back: send <code>tx</code> as-is (<code>value</code>{' '}
            and <code>gasLimit</code> are 0x-hex), or sign <code>order.typedData</code>{' '}
            and POST <code>order.body</code> to <code>order.postUrl</code>, or deposit to{' '}
            <code>depositAddress</code> with <code>memo</code> verbatim.{' '}
            <strong>Do not rebuild the calldata.</strong>
          </li>
          <li>
            If <code>approval</code> is present, send that approve transaction first and{' '}
            <strong>wait for it to confirm</strong>. Unmined approvals are the most
            common cause of a failed swap.
          </li>
          <li>
            A quote expires at <code>expiresAt</code> — about a minute. Re-quote instead
            of sending a stale transaction.
          </li>
          <li>
            A 502 with <code>NO_ROUTE</code> is an answer, not an outage: the pair cannot
            be priced at that size right now. Try a smaller amount or a different pair;
            do not retry in a loop.
          </li>
        </ul>
        <CodeBlock
          caption="the shape of correct usage"
          code={`const quote = await swaps.quote({ /* … */ });

if (Date.parse(quote.expiresAt) - Date.now() < 5_000) {
  // Too close to the edge to sign. Ask again.
  return requote();
}

if (quote.tx) {
  // executeSwap() does the approval-then-send dance for you.
  const hash = await swaps.executeSwap(quote, eth);
  await swaps.waitForReceipt(hash, { signer: eth });
}`}
        />
      </Section>

      <Section title="Errors">
        <ParamTable
          nameHeader="Code"
          rows={[
            { name: 'BAD_REQUEST', type: '400', effect: 'A required parameter is missing, or amount/slippage are malformed.' },
            { name: 'UNSUPPORTED_PAIR', type: '400', effect: 'The pair cannot be routed — e.g. a Hive pair, or Solana as sellChain.' },
            { name: 'UNKNOWN_CHAIN / UNKNOWN_TOKEN', type: '404', effect: 'A chain or token could not be resolved.' },
            { name: 'NO_ROUTE', type: '404 / 502', effect: 'No venue would price it at that size.' },
            { name: 'RATE_LIMITED', type: '429', effect: 'More than 60 requests per minute from one IP without a grant.' },
            { name: 'UPSTREAM_ERROR', type: '502', effect: 'A venue failed.' },
          ]}
        />
      </Section>
    </DocLayout>
  );
}
