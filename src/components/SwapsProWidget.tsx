'use client';

import { useCallback, useEffect, useRef } from 'react';
import { SITE } from '@/lib/config';

/**
 * The deep theme object the frame accepts over postMessage. Twelve named
 * colours, a font stack and two radius levels.
 *
 * Every value is validated inside the frame: a colour that does not parse as
 * hex/rgb/hsl is REFUSED rather than sanitised, and a font stack is stripped of
 * anything that could close a declaration.
 */
export interface WidgetTheme {
  colors?: {
    canvas?: string;
    surface?: string;
    surfaceRaised?: string;
    surfaceSunken?: string;
    borderSubtle?: string;
    borderStrong?: string;
    text?: string;
    textMuted?: string;
    textSubtle?: string;
    accent?: string;
    accentText?: string;
    accentSoft?: string;
  };
  /** Capped at 200 characters. */
  fontFamily?: string;
  shape?: {
    /** 0–48. */
    borderRadius?: number;
    /** 0–32. */
    borderRadiusSecondary?: number;
  };
}

export interface SwapsProWidgetProps {
  /** `theme` in the query string. */
  appearance?: 'dark' | 'light';
  /** #RRGGBB. URL-encoding is handled here. */
  accent?: string;
  /** 0–32. */
  radius?: number;
  /** 'solid', a #RRGGBB hex, or omitted for transparent. */
  background?: string;
  /** 320–720. */
  width?: number;
  font?: 'sans' | 'mono';
  /** 'none' drops the widget's own border, fill, blur and shadow. */
  chrome?: 'card' | 'none';
  /** Deep-link prefill, e.g. 'base-eth'. */
  sell?: string;
  buy?: string;
  amount?: string;
  /** Pass false with `pro` to remove the attribution badge. */
  brand?: boolean;
  /** A Pro Pass holder's address, verified on-chain, failing closed. */
  pro?: string;
  /** Deep theming, pushed over postMessage. */
  theme?: WidgetTheme;
  onHeightChange?: (h: number) => void;
  className?: string;
}

/** Build the embed URL. Exported so a page can show the exact snippet it renders. */
export function embedUrl(p: SwapsProWidgetProps): string {
  const q = new URLSearchParams();
  if (p.appearance) q.set('theme', p.appearance);
  if (p.accent) q.set('accent', p.accent); // URLSearchParams encodes # as %23
  if (p.radius !== undefined) q.set('radius', String(p.radius));
  if (p.background) q.set('bg', p.background);
  if (p.width !== undefined) q.set('width', String(p.width));
  if (p.font) q.set('font', p.font);
  if (p.chrome) q.set('chrome', p.chrome);
  if (p.sell) q.set('sell', p.sell);
  if (p.buy) q.set('buy', p.buy);
  if (p.amount) q.set('amount', p.amount);
  // The badge only comes off for a verified Pro Pass holder: both are needed.
  if (p.brand === false && p.pro) {
    q.set('brand', '0');
    q.set('pro', p.pro);
  }
  const qs = q.toString();
  return `${SITE}/embed${qs ? `?${qs}` : ''}`;
}

/**
 * The iframe plus both halves of its messaging: the auto-height listener and
 * the theme push.
 *
 * The card runs in the frame, deployed by SwapsPro — this is a wrapper, not a
 * port. No API keys and no backend on your side: the visitor's own wallet
 * connects inside the frame and signs there.
 */
export default function SwapsProWidget(props: SwapsProWidgetProps) {
  const { theme, onHeightChange, width, radius, background, className } = props;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const src = embedUrl(props);

  const pushTheme = useCallback(() => {
    if (!theme) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'swapspro:style', theme },
      SITE
    );
  }, [theme]);

  // The frame measures itself with a ResizeObserver and posts its height on
  // real changes. Listening is optional; without it the message is inert.
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Any page can post to your window — always check the sender.
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === 'swapspro:height') {
        const iframe = iframeRef.current;
        if (iframe) {
          iframe.style.height = `${event.data.height}px`;
          onHeightChange?.(event.data.height);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onHeightChange]);

  // Push on every change, and again on load: a theme set before the frame's
  // first paint would otherwise be dropped.
  useEffect(pushTheme, [pushTheme]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      onLoad={pushTheme}
      width={width ?? '100%'}
      height={640}
      className={className}
      style={{
        border: 0,
        borderRadius: radius !== undefined ? `${radius}px` : undefined,
        display: 'block',
        maxWidth: '100%',
        background: background && background !== 'solid' ? background : undefined,
      }}
      title="SwapsPro widget"
      allow="clipboard-write"
    />
  );
}
