'use client';

import { useEffect, useRef } from 'react';

interface WidgetTheme {
  colors?: {
    canvas?: string;
    surface?: string;
    surfaceSunken?: string;
    borderSubtle?: string;
    text?: string;
    textMuted?: string;
    accent?: string;
    accentText?: string;
    accentSoft?: string;
  };
  fontFamily?: string;
  shape?: {
    borderRadius?: number;
    borderRadiusSecondary?: number;
  };
}

interface SwapsProWidgetProps {
  appearance?: 'dark' | 'light';
  accent?: string;
  radius?: number | string;
  background?: string;
  width?: number | string;
  font?: 'sans' | 'mono';
  chrome?: 'card' | 'none';
  sell?: string;
  buy?: string;
  amount?: string;
  proAddress?: string;
  theme?: WidgetTheme;
  onHeightChange?: (h: number) => void;
}

export default function SwapsProWidget({
  appearance,
  accent,
  radius,
  background,
  width,
  font,
  chrome,
  sell,
  buy,
  amount,
  proAddress,
  theme,
  onHeightChange,
}: SwapsProWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Height listener
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data && event.data.type === 'swapspro:height') {
        const iframe = iframeRef.current;
        if (iframe) {
          iframe.style.height = event.data.height + 'px';
          onHeightChange?.(event.data.height);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onHeightChange]);

  // Send theme object via postMessage when it changes
  useEffect(() => {
    if (theme && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'swapspro:style', theme },
        '*'
      );
    }
  }, [theme]);

  // Build query parameters for simple styling
  const params = new URLSearchParams();
  if (appearance) params.set('theme', appearance);
  if (accent) params.set('accent', accent);
  if (radius) params.set('radius', radius.toString());
  if (background) params.set('bg', background);
  if (width) params.set('width', width.toString());
  if (font) params.set('font', font);
  if (chrome) params.set('chrome', chrome);
  if (sell) params.set('sell', sell);
  if (buy) params.set('buy', buy);
  if (amount) params.set('amount', amount);
  if (proAddress) params.set('proAddress', proAddress);
  // Note: origin is not a query parameter for the embed endpoint per docs

  const src = `https://www.swaps.pro/embed?${params.toString()}`;

  return (
    <iframe
      id="swapspro"
      ref={iframeRef}
      src={src}
      width={width ?? '100%'}
      height={640}
      style={{
        border: 0,
        borderRadius:
          typeof radius === 'number' ? `${radius}px` : radius,
        display: 'block',
        maxWidth: '100%',
        background:
          background === 'transparent' ? 'transparent' : background,
      }}
      title="SwapPro widget"
      allow="clipboard-write"
    />
  );
}