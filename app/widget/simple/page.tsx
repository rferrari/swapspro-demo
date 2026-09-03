'use client';

import SwapsProWidget from '@/components/SwapProWidget';
import Link from 'next/link';

export default function SimpleWidgetPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="text-sm text-gray-300 mb-2">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">
            Simple Widget (Query String Only)
          </h1>
          <p className="mt-2 text-gray-400">
            Configured via URL parameters: theme=dark, accent=%234DF98A, radius=16
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Widget Preview
            </h2>
            <SwapsProWidget
              appearance="dark"
              accent="#4DF98A"
              radius={16}
              width="100%"
              sell="ETH"
              buy="USDC"
              amount="0.1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}