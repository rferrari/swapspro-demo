'use client';

import Link from 'next/link';
import { useState } from 'react';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import Callout from '@/components/Callout';
import CodeBlock from '@/components/CodeBlock';
import SwapsProWidget, { type WidgetTheme } from '@/components/SwapsProWidget';

const COLORS = [
  'canvas', 'surface', 'surfaceRaised', 'surfaceSunken',
  'borderSubtle', 'borderStrong', 'text', 'textMuted',
  'textSubtle', 'accent', 'accentText', 'accentSoft',
] as const;

const PRESETS: Record<string, WidgetTheme> = {
  Midnight: {
    colors: {
      canvas: '#0b0f0d', surface: '#111814', surfaceRaised: '#16211b',
      surfaceSunken: '#080b09', borderSubtle: '#1f2c25', borderStrong: '#2c3f35',
      text: '#e8f1ec', textMuted: '#9fb3a8', textSubtle: '#6b8074',
      accent: '#4DF98A', accentText: '#04140b', accentSoft: 'rgba(77,249,138,0.14)',
    },
    fontFamily: '"Inter", system-ui, sans-serif',
    shape: { borderRadius: 20, borderRadiusSecondary: 10 },
  },
  Paper: {
    colors: {
      canvas: '#ffffff', surface: '#fafafa', surfaceRaised: '#ffffff',
      surfaceSunken: '#f1f1f1', borderSubtle: '#e5e5e5', borderStrong: '#d0d0d0',
      text: '#101418', textMuted: '#5b6570', textSubtle: '#8b949e',
      accent: '#3B82F6', accentText: '#ffffff', accentSoft: 'rgba(59,130,246,0.12)',
    },
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    shape: { borderRadius: 12, borderRadiusSecondary: 6 },
  },
  Terminal: {
    colors: {
      canvas: '#000000', surface: '#0a0a0a', surfaceRaised: '#141414',
      surfaceSunken: '#000000', borderSubtle: '#1f1f1f', borderStrong: '#333333',
      text: '#e6e6e6', textMuted: '#8a8a8a', textSubtle: '#5a5a5a',
      accent: '#ff7a1a', accentText: '#000000', accentSoft: 'rgba(255,122,26,0.15)',
    },
    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    shape: { borderRadius: 0, borderRadiusSecondary: 0 },
  },
};

export default function ThemingPage() {
  const [name, setName] = useState<keyof typeof PRESETS>('Midnight');
  const [theme, setTheme] = useState<WidgetTheme>(PRESETS.Midnight);

  function pick(next: keyof typeof PRESETS) {
    setName(next);
    setTheme(PRESETS[next]);
  }

  function setColor(key: string, value: string) {
    setTheme((t) => ({ ...t, colors: { ...t.colors, [key]: value } }));
  }

  return (
    <DocLayout href="/widget/theming">
      <PageHeader
        eyebrow="Widget"
        title="Deep theming over postMessage"
        intro={
          <p>
            The ceiling was never the iframe, it was the query string. Post{' '}
            <code>{'{ type: "swapspro:style", theme }'}</code> at the frame and it
            restyles <em>in place</em> — twelve named colours, a font stack and two
            radius levels, with no reload.
          </p>
        }
        doc="https://www.swaps.pro/docs/widget"
      />

      <Section title="Live — every value below is pushed to the frame">
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.keys(PRESETS).map((p) => (
            <button
              key={p}
              onClick={() => pick(p as keyof typeof PRESETS)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                name === p
                  ? 'border-[#4DF98A]/50 bg-[#4DF98A]/10 text-[#4DF98A]'
                  : 'border-white/15 text-gray-300 hover:border-white/30'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-2 self-start rounded-xl border border-white/10 bg-white/[0.03] p-4">
            {COLORS.map((c) => (
              <label key={c} className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    theme.colors?.[c]?.startsWith('#') ? theme.colors[c] : '#000000'
                  }
                  onChange={(e) => setColor(c, e.target.value)}
                  className="h-7 w-7 shrink-0 rounded border border-white/10 bg-transparent"
                />
                <span className="truncate font-mono text-[11px] text-gray-400">{c}</span>
              </label>
            ))}
            <label className="col-span-2 mt-2 block">
              <span className="mb-1 block font-mono text-[11px] text-gray-400">
                shape.borderRadius — {theme.shape?.borderRadius ?? 0}
              </span>
              <input
                type="range" min={0} max={48}
                value={theme.shape?.borderRadius ?? 0}
                onChange={(e) =>
                  setTheme((t) => ({ ...t, shape: { ...t.shape, borderRadius: Number(e.target.value) } }))
                }
                className="w-full accent-[#4DF98A]"
              />
            </label>
            <label className="col-span-2 block">
              <span className="mb-1 block font-mono text-[11px] text-gray-400">
                shape.borderRadiusSecondary — {theme.shape?.borderRadiusSecondary ?? 0}
              </span>
              <input
                type="range" min={0} max={32}
                value={theme.shape?.borderRadiusSecondary ?? 0}
                onChange={(e) =>
                  setTheme((t) => ({ ...t, shape: { ...t.shape, borderRadiusSecondary: Number(e.target.value) } }))
                }
                className="w-full accent-[#4DF98A]"
              />
            </label>
          </div>

          <SwapsProWidget appearance="dark" chrome="none" width={480} theme={theme} />
        </div>

        <CodeBlock caption="the object being posted right now" code={JSON.stringify(theme, null, 2)} />
      </Section>

      <Section title="How to implement">
        <p>
          Two rules and it works: post to a frame that has loaded, and post again on{' '}
          <code>load</code>. A theme set before the frame&apos;s first paint is otherwise
          dropped on the floor — which is the single most common reason a theme
          &quot;does not apply&quot;.
        </p>
        <CodeBlock
          tabs={[
            {
              label: 'HTML',
              code: `<iframe id="swapspro" src="https://www.swaps.pro/embed?chrome=none"></iframe>

<script>
  const frame = document.getElementById('swapspro');
  const theme = {
    colors: { canvas: '#0b0f0d', surface: '#111814', text: '#e8f1ec', accent: '#4DF98A' },
    fontFamily: '"Inter", system-ui, sans-serif',
    shape: { borderRadius: 20, borderRadiusSecondary: 10 },
  };

  const push = () =>
    frame.contentWindow.postMessage(
      { type: 'swapspro:style', theme },
      'https://www.swaps.pro'          // target the frame's origin, not '*'
    );

  frame.addEventListener('load', push);   // the one everybody forgets
  push();                                 // and again whenever the theme changes
</script>`,
            },
            {
              label: 'React',
              code: `// src/components/SwapsProWidget.tsx in this repo does both halves for you.
const pushTheme = useCallback(() => {
  if (!theme) return;
  iframeRef.current?.contentWindow?.postMessage(
    { type: 'swapspro:style', theme },
    'https://www.swaps.pro'
  );
}, [theme]);

useEffect(pushTheme, [pushTheme]);   // on every theme change
// …and <iframe onLoad={pushTheme} /> for the first paint.`,
            },
          ]}
        />
      </Section>

      <Section title="The theme object">
        <ParamTable
          nameHeader="Key"
          rows={[
            {
              name: 'colors',
              type: '12 named',
              effect: (
                <>
                  <code>canvas</code>, <code>surface</code>, <code>surfaceRaised</code>,{' '}
                  <code>surfaceSunken</code>, <code>borderSubtle</code>,{' '}
                  <code>borderStrong</code>, <code>text</code>, <code>textMuted</code>,{' '}
                  <code>textSubtle</code>, <code>accent</code>, <code>accentText</code>,{' '}
                  <code>accentSoft</code>.
                </>
              ),
            },
            {
              name: 'fontFamily',
              type: 'string',
              effect: 'A CSS font stack. Capped at 200 characters and stripped of anything that could close a declaration.',
            },
            { name: 'shape.borderRadius', type: '0–48', effect: 'The outer surface radius.' },
            { name: 'shape.borderRadiusSecondary', type: '0–32', effect: 'Inner elements — inputs, buttons, rows.' },
          ]}
        />
        <Callout kind="note" title="Values are refused, not sanitised">
          <p>
            Every value is validated before it reaches the document. A colour must parse
            as <code>#rgb</code>, <code>#rrggbb</code>, <code>#rrggbbaa</code>,{' '}
            <code>rgb()/rgba()</code> or <code>hsl()/hsla()</code>. One that does not is{' '}
            <strong>refused</strong> and the existing colour stays — so a typo shows up
            as &quot;nothing happened&quot;, never as a broken frame. Try it: put{' '}
            <code>not-a-colour</code> into the object above and the card holds its
            ground.
          </p>
        </Callout>
      </Section>

      <Section title="The message coming back">
        <p>
          The frame measures itself with a ResizeObserver and posts{' '}
          <code>{'{ type: "swapspro:height", height }'}</code> to the parent — only on
          real changes, and only when they exceed two pixels. Height is measured, not
          guessed.
        </p>
        <CodeBlock
          code={`window.addEventListener('message', (e) => {
  // Any page can post to your window. This check is not optional.
  if (e.source !== frame.contentWindow) return;
  if (e.data?.type === 'swapspro:height') {
    frame.style.height = e.data.height + 'px';
  }
});`}
        />
        <Callout kind="gotcha" title="Height is the only event it emits">
          <p>
            There are no flow events — no &quot;quote received&quot;, no &quot;swap
            submitted&quot;. If your product needs to react to what the user does, you
            need <Link href="/sdk">the SDK</Link>, where you own the flow.
          </p>
        </Callout>
      </Section>
    </DocLayout>
  );
}
