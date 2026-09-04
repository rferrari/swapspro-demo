import Link from 'next/link';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import Callout from '@/components/Callout';
import { TOOLS } from '@/lib/tools';

export default function ToolsIndex() {
  return (
    <DocLayout href="/tools" wide>
      <PageHeader
        eyebrow="Tools"
        title="Everything that is not a swap"
        intro={
          <p>
            Nine tools sit beside the swap card. Between them they cover everything
            SwapsPro can do to a wallet that is not a swap. Each has a page here with what
            it signs, what it costs, and what it refuses to do.
          </p>
        }
        doc="https://www.swaps.pro/docs/tools"
      />

      <Section title="The nine">
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group flex flex-col rounded-lg border border-white/10 px-4 py-3 transition-colors hover:border-[#4DF98A]/40 hover:bg-white/5"
            >
              <span className="text-sm font-semibold text-white">{t.name}</span>
              <span className="mt-1 text-sm leading-relaxed text-gray-400">
                {t.tagline}
              </span>
              <span className="mt-2 text-xs text-gray-600">{t.cost.split('.')[0]}.</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Why there is no live demo here">
        <p>
          These are swaps.pro-hosted products, not endpoints — there is no public API to
          call, so re-implementing their buttons here would be a mock rather than a
          sample. What these pages give you instead is the part an integrator actually
          needs: what gets signed, what it costs, and where the tool deliberately stops.
          Every page links to the live tool.
        </p>
        <Callout kind="gotcha" title="“One confirmation” is batching, not atomicity">
          <p>
            It describes EIP-5792 <code>wallet_sendCalls</code>. Some hosts — the
            Farcaster host wallet, for instance — execute a batch{' '}
            <strong>sequentially rather than atomically</strong>. Do not design a flow
            that assumes all-or-nothing.
          </p>
        </Callout>
      </Section>
    </DocLayout>
  );
}
