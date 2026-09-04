import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import CodeBlock from '@/components/CodeBlock';
import Callout from '@/components/Callout';
import { NAV } from '@/lib/nav';

const SURFACES = [
  {
    href: '/widget',
    name: 'Widget',
    line: 'Paste an iframe.',
    body: 'No keys and no backend on your side. The visitor connects their own wallet inside the frame and signs there. You get the swap card in your own colours.',
    pick: 'Pick this when you want swapping on your site today and do not want to own any of it.',
  },
  {
    href: '/sdk',
    name: 'SDK',
    line: 'Build your own UI.',
    body: '@swapspro/sdk is a zero-dependency TypeScript client. It quotes, and hands you a transaction to sign through any EIP-1193 wallet you already have.',
    pick: 'Pick this when the swap has to look and behave like your product.',
  },
  {
    href: '/api',
    name: 'HTTP API',
    line: 'Any language, no key.',
    body: 'CORS-open GET endpoints. No account, no signup, no key to ask for. This is the surface an autonomous agent uses — see the agent path for the full flow.',
    pick: 'Pick this outside JavaScript, or when you are writing an agent.',
  },
];

export default function Home() {
  return (
    <DocLayout href="/" wide>
      <PageHeader
        eyebrow="SwapsPro starter kit"
        title="Build on SwapsPro"
        intro={
          <>
            <p>
              A working demo of every way to integrate{' '}
              <a
                href="https://www.swaps.pro"
                target="_blank"
                rel="noreferrer"
                className="text-[#4DF98A] hover:underline"
              >
                SwapsPro
              </a>
              : the embeddable widget, the TypeScript SDK, the keyless HTTP API and the
              agent path. Every page explains the concept, shows how to implement it,
              and runs the sample live against the real API.
            </p>
            <p className="mt-3">
              Fork it and change one environment variable — that is the whole setup.
            </p>
          </>
        }
        doc="https://www.swaps.pro/docs"
      />

      <Section title="What SwapsPro is">
        <p>
          A non-custodial, browser-based cross-chain swap terminal and wallet toolkit,
          with a keyless public HTTP API that autonomous agents can trade through. No
          account, no signup, no custody: every action is signed by the holder&apos;s own
          wallet.
        </p>
        <p>
          It routes to third-party venues — aggregators, intent networks and native
          protocols — and names which one won before anyone signs. It does not run its
          own order book or liquidity, and it cannot move anything on its own.
        </p>
      </Section>

      <Section title="Pick your surface">
        <p>
          Three ways to integrate, in increasing order of how much you build. All three
          sit on the same routing, so the chains, the prices and the fees are identical
          whichever you pick.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {SURFACES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[#4DF98A]/40 hover:bg-white/[0.06]"
            >
              <h3 className="text-lg font-semibold text-white">{s.name}</h3>
              <p className="mt-0.5 text-sm font-medium text-[#4DF98A]">{s.line}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{s.body}</p>
              <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-gray-500">
                {s.pick}
              </p>
              <span className="mt-4 text-sm text-gray-500 group-hover:text-[#4DF98A]">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="The quickstart is three requests">
        <p>
          Nothing but curl, and nothing to sign up for. Discover the chains, list a
          chain&apos;s tokens, then ask for a firm quote:
        </p>
        <CodeBlock
          caption="the entire onboarding"
          code={`curl "https://www.swaps.pro/api/sdk/v1/chains"

curl "https://www.swaps.pro/api/sdk/v1/tokens?chainId=8453"

curl "https://www.swaps.pro/api/sdk/v1/quote?sellChain=8453&sellToken=ETH\\
&buyChain=8453&buyToken=USDC&amount=0.1&address=0xYourAddress"`}
        />
        <p>
          Run all three in the browser, with editable parameters, on the{' '}
          <Link href="/start">quickstart page</Link>.
        </p>
      </Section>

      <Section title="What it costs">
        <ul>
          <li>
            <strong>Swaps</strong> carry a 0.30% routing fee, included in the quote
            before anyone signs. Cross-chain THORChain-style routes carry the same 0.30%
            as a multi-affiliate memo split.
          </li>
          <li>
            <strong>Quotes</strong> are free. No key, no payment, no account.
          </li>
          <li>
            <strong>Batch Send</strong> is a flat 0.0002 ETH per batch, in native ETH,
            never taken out of the tokens being sent.
          </li>
          <li>
            <strong>Create Contract</strong> has no fee. Everything else is free, and
            there is no subscription and no account.
          </li>
        </ul>
        <p>
          The full table, including what a partner fee actually collects, is on{' '}
          <Link href="/fees">Fees</Link>.
        </p>
        <Callout kind="note" title="Not investment advice">
          SwapsPro is software for interacting with public blockchains. The pages here
          that sign transactions do so on mainnet with real funds.
        </Callout>
      </Section>

      <Section title="Every page in this kit">
        <p>
          Twenty-odd pages, each one concept with a live sample. Nothing here is
          reachable only by guessing a URL.
        </p>
        <div className="mt-6 space-y-8">
          {NAV.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4DF98A]">
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{group.blurb}</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block h-full rounded-lg border border-white/10 px-4 py-3 transition-colors hover:border-[#4DF98A]/40 hover:bg-white/5"
                    >
                      <span className="block text-sm font-medium text-white">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-gray-500">
                        {item.learn}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </DocLayout>
  );
}
