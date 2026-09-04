'use client';

import Link from 'next/link';
import { useState } from 'react';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import Steps from '@/components/Steps';
import SwapsProWidget, { embedUrl, type SwapsProWidgetProps } from '@/components/SwapsProWidget';

const DEFAULTS: SwapsProWidgetProps = {
  appearance: 'dark',
  accent: '#4DF98A',
  radius: 16,
  background: '',
  width: 480,
  font: 'sans',
  chrome: 'card',
  sell: 'base-eth',
  buy: 'base-usdc',
  amount: '0.1',
  brand: true,
  pro: '',
};

function Control({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-xs text-gray-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

const inputCls =
  'w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white outline-none focus:border-[#4DF98A]/50';

export default function WidgetPage() {
  const [cfg, setCfg] = useState<SwapsProWidgetProps>(DEFAULTS);
  const [height, setHeight] = useState<number | null>(null);
  const set = <K extends keyof SwapsProWidgetProps>(k: K, v: SwapsProWidgetProps[K]) =>
    setCfg((c) => ({ ...c, [k]: v }));

  const url = embedUrl(cfg);

  const htmlSnippet = `<iframe
  id="swapspro"
  src="${url}"
  width="100%"
  height="640"
  style="border:0;display:block;border-radius:${cfg.radius}px"
  title="SwapsPro widget"
  allow="clipboard-write"
></iframe>

<script>
  // Optional: let the card set its own height so nobody gets a scrollbar.
  const frame = document.getElementById('swapspro');
  window.addEventListener('message', (e) => {
    if (e.source !== frame.contentWindow) return;          // check the sender
    if (e.data && e.data.type === 'swapspro:height') {
      frame.style.height = e.data.height + 'px';
    }
  });
</script>`;

  const reactSnippet = `import SwapsProWidget from '@/components/SwapsProWidget';

<SwapsProWidget
  appearance="${cfg.appearance}"
  accent="${cfg.accent}"
  radius={${cfg.radius}}${cfg.background ? `\n  background="${cfg.background}"` : ''}
  width={${cfg.width}}
  font="${cfg.font}"
  chrome="${cfg.chrome}"${cfg.sell ? `\n  sell="${cfg.sell}"` : ''}${cfg.buy ? `\n  buy="${cfg.buy}"` : ''}${cfg.amount ? `\n  amount="${cfg.amount}"` : ''}${
    cfg.brand === false && cfg.pro ? `\n  brand={false}\n  pro="${cfg.pro}"` : ''
  }
  onHeightChange={(h) => console.log('card is', h, 'px tall')}
/>`;

  return (
    <DocLayout href="/widget">
      <PageHeader
        eyebrow="Widget"
        title="Embed the swap card"
        intro={
          <p>
            An iframe pointing at <code>https://www.swaps.pro/embed</code>. No API keys
            and no backend on your side: the visitor&apos;s own wallet connects inside
            the frame and signs there. Change the controls below and copy the snippet
            that produces exactly what you see.
          </p>
        }
        doc="https://www.swaps.pro/docs/widget"
      />

      <Section title="How to implement">
        <Steps
          steps={[
            {
              title: 'Paste the iframe',
              body: (
                <p>
                  That is the whole integration. Everything else on this page is
                  optional polish. There is nothing to install and nothing to
                  authenticate.
                </p>
              ),
            },
            {
              title: 'Style it with the query string',
              body: (
                <p>
                  Colours, radius, width, font and chrome all travel as parameters. Two
                  levels of styling exist and the difference is <em>how the change
                  travels</em>: the query string is set once when the frame loads, and
                  the <Link href="/widget/theming">theme object</Link> restyles the frame
                  in place afterwards.
                </p>
              ),
            },
            {
              title: 'Listen for the height message (optional)',
              body: (
                <p>
                  The frame measures itself and posts its height, so the iframe can be
                  exactly as tall as the card and your visitor never gets a scrollbar
                  over your page. Without the listener the message is simply inert.
                </p>
              ),
            },
          ]}
        />
      </Section>

      <Section title="Playground">
        <div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2">
          <Control label="theme" hint="Default: dark">
            <select className={inputCls} value={cfg.appearance} onChange={(e) => set('appearance', e.target.value as 'dark' | 'light')}>
              <option value="dark">dark</option>
              <option value="light">light</option>
            </select>
          </Control>

          <Control label="accent" hint="#RRGGBB. Default: brand green">
            <div className="flex gap-2">
              <input type="color" value={cfg.accent} onChange={(e) => set('accent', e.target.value)} className="h-[38px] w-12 rounded-md border border-white/10 bg-black/50" />
              <input className={`${inputCls} font-mono`} value={cfg.accent} onChange={(e) => set('accent', e.target.value)} />
            </div>
          </Control>

          <Control label={`radius — ${cfg.radius}`} hint="0–32 px. Default: 16">
            <input type="range" min={0} max={32} value={cfg.radius} onChange={(e) => set('radius', Number(e.target.value))} className="w-full accent-[#4DF98A]" />
          </Control>

          <Control label={`width — ${cfg.width}`} hint="320–720 px. Default: 480. Below ~320 the amount row crowds.">
            <input type="range" min={320} max={720} step={10} value={cfg.width} onChange={(e) => set('width', Number(e.target.value))} className="w-full accent-[#4DF98A]" />
          </Control>

          <Control label="bg" hint="Default: transparent">
            <select className={inputCls} value={cfg.background} onChange={(e) => set('background', e.target.value)}>
              <option value="">(omitted — transparent)</option>
              <option value="solid">solid</option>
              <option value="#0b0f0d">#0b0f0d</option>
              <option value="#ffffff">#ffffff</option>
            </select>
          </Control>

          <Control label="font" hint="Default: sans">
            <select className={inputCls} value={cfg.font} onChange={(e) => set('font', e.target.value as 'sans' | 'mono')}>
              <option value="sans">sans</option>
              <option value="mono">mono</option>
            </select>
          </Control>

          <Control label="chrome" hint="none drops the card's own border, fill, blur and shadow">
            <select className={inputCls} value={cfg.chrome} onChange={(e) => set('chrome', e.target.value as 'card' | 'none')}>
              <option value="card">card</option>
              <option value="none">none</option>
            </select>
          </Control>

          <Control label="amount" hint="Prefills the sell amount as typed">
            <input className={`${inputCls} font-mono`} value={cfg.amount} onChange={(e) => set('amount', e.target.value)} />
          </Control>

          <Control label="sell" hint="chain-symbol, e.g. base-eth">
            <input className={`${inputCls} font-mono`} value={cfg.sell} onChange={(e) => set('sell', e.target.value)} />
          </Control>

          <Control label="buy" hint="chain-symbol, e.g. base-usdc">
            <input className={`${inputCls} font-mono`} value={cfg.buy} onChange={(e) => set('buy', e.target.value)} />
          </Control>

          <Control label="brand + pro" hint="Both are required to drop the badge, and the pass is verified on-chain.">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={cfg.brand === false} onChange={(e) => set('brand', !e.target.checked)} className="h-4 w-4 accent-[#4DF98A]" />
              <input
                className={`${inputCls} font-mono`}
                placeholder="0x… Pro Pass holder"
                value={cfg.pro}
                onChange={(e) => set('pro', e.target.value)}
              />
            </div>
          </Control>

          <div className="flex items-end">
            <button onClick={() => setCfg(DEFAULTS)} className="rounded-md border border-white/15 px-4 py-2 text-sm text-gray-300 hover:border-[#4DF98A]/40 hover:text-white">
              Reset to defaults
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm text-gray-500">
            Live frame{height !== null && <> — it reported {height}px tall</>}
          </p>
          <div className="mx-auto" style={{ maxWidth: cfg.width }}>
            <SwapsProWidget {...cfg} onHeightChange={setHeight} />
          </div>
        </div>
      </Section>

      <Section title="Copy the snippet">
        <p>
          Both of these are generated from the controls above. The HTML one needs no
          build step at all — save it as a file and open it.
        </p>
        <CodeBlock
          tabs={[
            { label: 'HTML', caption: 'no build step', code: htmlSnippet },
            { label: 'React', caption: 'this repo’s component', code: reactSnippet },
            { label: 'URL', caption: 'the embed URL alone', code: url },
          ]}
        />
      </Section>

      <Section title="Every query parameter">
        <ParamTable
          rows={[
            { name: 'theme', values: 'dark · light', def: 'dark', effect: 'Stamps the theme class on the iframe document.' },
            { name: 'accent', values: '%23RRGGBB', def: 'brand green', effect: 'Overrides the accent throughout the card. URL-encode the #.' },
            { name: 'radius', values: '0–32', def: '16', effect: 'Corner radius of the outer surface, in pixels.' },
            { name: 'bg', values: 'solid · #RRGGBB · absent', def: 'transparent', effect: 'Background treatment behind the card.' },
            { name: 'width', values: '320–720', def: '480', effect: 'Maximum card width inside the frame; it centres in whatever space it has.' },
            { name: 'font', values: 'sans · mono', def: 'sans', effect: 'Switches to a monospace face.' },
            { name: 'chrome', values: 'card · none', def: 'card', effect: 'none drops the widget’s own border, fill, blur and shadow — for embedding inside your own card.' },
            { name: 'sell', values: 'chain-symbol', def: '—', effect: 'Preselects the sell asset, e.g. base-eth.' },
            { name: 'buy', values: 'chain-symbol', def: '—', effect: 'Preselects the buy asset, e.g. base-usdc.' },
            { name: 'amount', values: 'decimal', def: '—', effect: 'Prefills the sell amount as typed.' },
            { name: 'brand + pro', values: 'brand=0&pro=0x…', def: 'badge shown', effect: 'Removes the ⚡ swaps.pro badge for a verified Pro Pass holder.' },
          ]}
        />
        <Callout kind="gotcha" title="tab does not work here">
          <p>
            The app&apos;s <code>sell</code>, <code>buy</code> and <code>amount</code>{' '}
            deep-link parameters work in the frame. <code>tab</code> does not — the frame
            is the instant swap card only.
          </p>
        </Callout>
        <Callout kind="note" title="The badge fails closed">
          <p>
            <code>brand=0&amp;pro=0x…</code> removes the badge only for an address that
            holds a Pro Pass, verified on-chain on Base. An unreadable check keeps the
            badge. An address is public, so this proves a pass exists rather than that
            you own it.
          </p>
        </Callout>
      </Section>

      <Section title="Sizing">
        <ul>
          <li>
            <strong>Width:</strong> the card caps at <code>width</code> and centres
            itself. Give the iframe <code>width: 100%</code> and put the cap on a wrapper
            for a responsive layout.
          </li>
          <li>
            <strong>Height:</strong> set something reasonable to start — 640px — and let
            the height message correct it on first paint.
          </li>
          <li>
            <strong>Minimum:</strong> below about 320px the amount row starts to crowd.
          </li>
        </ul>
      </Section>

      <Section title="What the widget cannot do">
        <p>
          No partner attribution, no flow events (height is the only message it emits),
          no custom token list, no limit orders or TWAP. Move to{' '}
          <Link href="/sdk">the SDK</Link> for any of those — it is the same routing,
          with the UI yours to build.
        </p>
      </Section>
    </DocLayout>
  );
}
