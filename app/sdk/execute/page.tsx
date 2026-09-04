import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Steps from '@/components/Steps';
import ExecutePanel from '@/components/ExecutePanel';

export default function ExecutePage() {
  return (
    <DocLayout href="/sdk/execute">
      <PageHeader
        eyebrow="SDK"
        title="Execute a swap"
        intro={
          <p>
            Quote, approve, send, wait for the receipt — over raw{' '}
            <code>window.ethereum</code>, with no wallet library at all. This is the
            canonical path: it copies into any React app, and{' '}
            <Link href="/sdk/wagmi">wagmi</Link> is one optional layer on top of it.
          </p>
        }
        doc="https://www.swaps.pro/docs/sdk"
      />

      <Callout kind="danger">
        <p>
          The panel below signs real transactions on Base mainnet with real funds. It is
          disabled until you connect, it never quotes or sends anything on its own, and
          it defaults to a small amount. Everything else on this page is safe to read.
        </p>
      </Callout>

      <Section title="Try it">
        <ExecutePanel />
        <p>
          To see <code>CHAIN_MISMATCH</code> without spending anything: connect a wallet
          that is on Ethereum rather than Base, quote, then press swap. The error and the
          network-switch button appear before any transaction is proposed.
        </p>
      </Section>

      <Section title="How to implement">
        <Steps
          steps={[
            {
              title: 'Get an account',
              body: (
                <>
                  <p>
                    Any EIP-1193 provider qualifies — <code>window.ethereum</code>, a
                    viem WalletClient&apos;s transport, an ethers{' '}
                    <code>BrowserProvider</code>&apos;s <code>provider</code>, or
                    anything with a compatible <code>request</code> method.
                  </p>
                  <CodeBlock
                    code={`const eth = window.ethereum;
const [account] = await eth.request({ method: 'eth_requestAccounts' });`}
                  />
                </>
              ),
            },
            {
              title: 'Quote for that account',
              body: (
                <>
                  <p>
                    The venue builds the transaction for this specific sender, so the
                    address is not cosmetic. Quote immediately before signing — not when
                    the page loaded.
                  </p>
                  <CodeBlock
                    code={`const quote = await swaps.quote({
  sellChain: 8453, sellToken: 'ETH',
  buyChain: 8453, buyToken: 'USDC',
  amount, address: account,
});`}
                  />
                </>
              ),
            },
            {
              title: 'Execute',
              body: (
                <>
                  <p>
                    <code>executeSwap</code> verifies the wallet is on the quote&apos;s
                    chain, grants the ERC-20 allowance if the quote requires one —{' '}
                    <strong>waiting for that approval to mine</strong> — and then sends
                    the swap.
                  </p>
                  <CodeBlock code={`const hash = await swaps.executeSwap(quote, eth);`} />
                </>
              ),
            },
            {
              title: 'Wait for settlement',
              body: (
                <>
                  <p>
                    Polls every 4 seconds, giving up after 5 minutes by default. A
                    receipt with status <code>0x0</code> throws <code>TX_REVERTED</code>{' '}
                    rather than returning quietly.
                  </p>
                  <CodeBlock
                    code={`const receipt = await swaps.waitForReceipt(hash, {
  signer: eth,          // or rpcUrl: 'https://…' outside a browser
  pollMs: 4000,
  timeoutMs: 300_000,
});
console.log('block', parseInt(receipt.blockNumber, 16));`}
                  />
                </>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Every error, and what to do about it">
        <ParamTable
          nameHeader="Code"
          rows={[
            {
              name: 'CHAIN_MISMATCH',
              type: 'ChainMismatchError',
              effect: (
                <>
                  The wallet is on a different chain than the quote. Carries{' '}
                  <code>expected</code> and <code>actual</code> — prompt{' '}
                  <code>wallet_switchEthereumChain</code> and retry.
                </>
              ),
            },
            {
              name: 'NOT_SUPPORTED',
              type: 'NotSupportedError',
              effect: (
                <>
                  A memo/deposit route: there is no transaction to send. Use{' '}
                  <Link href="/sdk/routes">the deposit branch</Link>.
                </>
              ),
            },
            { name: 'NO_ROUTE', type: 'SwapsProError', effect: 'The pair cannot be priced at that size right now. Offer a smaller amount — do not retry in a loop.' },
            { name: 'RATE_LIMITED', type: 'SwapsProError', effect: '429 from the API. Back off; the free ceiling is 60/min per IP, best-effort.' },
            { name: 'QUOTE_EXPIRED', type: 'SwapsProError', effect: 'You tried to execute past expiresAt. Re-quote and ask the user to confirm the new number.' },
            { name: 'TX_REVERTED', type: 'SwapsProError', effect: 'The receipt came back with status 0x0. It reached the chain and failed there.' },
            { name: 'TIMEOUT', type: 'SwapsProError', effect: 'No receipt within timeoutMs. The transaction may still land — do not resend blindly.' },
            { name: 'NETWORK_ERROR', type: 'SwapsProError', effect: 'The request never reached the API.' },
          ]}
        />
        <CodeBlock
          caption="the handler worth copying"
          code={`import { ChainMismatchError, NotSupportedError, SwapsProError } from '@swapspro/sdk';

async function swap() {
  try {
    const hash = await swaps.executeSwap(quote, eth);
    await swaps.waitForReceipt(hash, { signer: eth });
  } catch (e) {
    if (e instanceof ChainMismatchError) {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: \`0x\${e.expected.toString(16)}\` }],
      });
      return swap();                       // one retry, after switching
    }
    if (e instanceof NotSupportedError) return showDepositInstructions(quote);
    if (e instanceof SwapsProError) return showError(e.code, e.message);
    throw e;
  }
}`}
        />
      </Section>

      <Section title="The failures that actually happen">
        <Callout kind="gotcha" title="Unmined approvals">
          <p>
            An ERC-20 sell is <em>two</em> transactions: approve, then swap. The most
            common cause of a failed swap is sending the second before the first has
            mined. <code>executeSwap</code> waits — if you hand-roll the calls, you have
            to wait too.
          </p>
        </Callout>
        <Callout kind="gotcha" title="Not enough native gas">
          <p>
            The wallet needs the sell asset <em>and</em> native gas for both
            transactions. Check the native balance <strong>before</strong> quoting, not
            after: discovering it at the signing step means you have already shown the
            user a number you cannot deliver.
          </p>
        </Callout>
        <Callout kind="gotcha" title="Stale quotes">
          <p>
            About a minute of validity. A user who leaves the tab and comes back has an
            expired quote — re-quote on focus, or check{' '}
            <code>expiresAt</code> before you call <code>executeSwap</code>.
          </p>
        </Callout>
      </Section>
    </DocLayout>
  );
}
