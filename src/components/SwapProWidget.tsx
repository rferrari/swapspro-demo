'use client';

import { useEffect, useRef } from 'react';

interface SwapsProWidgetProps {
  theme?: string;
  accent?: string;
  radius?: number | string;
  width?: number | string;
  background?: string;
  sell?: string;
  buy?: string;
  amount?: string;
  onHeightChange?: (h: number) => void;
}

export default function SwapsProWidget({
  theme,
  accent,
  radius = 16,
  width = '100%',
  background = 'transparent',
  sell,
  buy,
  amount,
  onHeightChange,
}: SwapsProWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Check that the message is from the iframe we rendered
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data && event.data.type === 'swapspro:height') {
        const iframe = iframeRef.current;
        if (iframe) {
          iframe.style.height = event.data.height + 'px';
          // Optionally call the onHeightChange callback
          onHeightChange?.(event.data.height);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onHeightChange]);

  // Build the src URL for the iframe
  const params = new URLSearchParams();
  if (theme) params.set('theme', theme);
  if (accent) params.set('accent', accent);
  if (radius) params.set('radius', radius.toString());
  // Note: The widget also accepts width, but we control the iframe width via props.
  // The embed endpoint might accept other parameters like sell, buy, amount.
  if (sell) params.set('sell', sell);
  if (buy) params.set('buy', buy);
  if (amount) params.set('amount', amount);

  const src = `https://www.swaps.pro/embed?${params.toString()}`;

  return (
    <iframe
      id="swapspro"
      ref={iframeRef}
      src={src}
      width={width}
      height={640} // Initial height, will be updated by the message
      style={{
        border: 0,
        borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
        display: 'block',
        maxWidth: '100%',
        background: background === 'transparent' ? 'transparent' : background,
      }}
      title="SwapPro widget"
      allow="clipboard-write"
    />
  );
}