'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SwapsPro, Quote } from '@swapspro/sdk';

export default function SDKPage() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const sdk = new SwapsPro({
        baseUrl: "https://www.swaps.pro/api/sdk/v1",
        partner: "swapspro-demo",
      });

      const q = await sdk.quote({
        sellChain: "8453",
        sellToken: "ETH",
        buyChain: "8453",
        buyToken: "USDC",
        amount: "0.1",
        address: "0x21c9a94AF76B59b171b32fD125A4edF0e9A2Ad3e",
      });
      setQuote(q);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-white mb-2">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-center text-white">
            SDK Demo
          </h1>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg mb-8">
          <div className="p-8">
            <p className="text-gray-300 text-center mb-6 text-lg">
              The SwapPro SDK is a headless TypeScript client that allows you to integrate swap functionality into your application with ease.
            </p>
            
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-white">Live Example</h2>
              <p className="text-gray-300 mb-4">
                Click the button below to fetch a real quote for 0.1 ETH → USDC on Base using the <code className="text-[#4DF98A]">@swapspro/sdk</code> package.
              </p>
              
              <button 
                onClick={handleGetQuote}
                disabled={loading}
                className="bg-[#4DF98A] hover:bg-[#3ce577] text-black font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 mb-6"
              >
                {loading ? 'Fetching Quote...' : 'Run SDK Quote Example'}
              </button>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {quote && (
                <div className="bg-black/50 p-4 rounded-lg border border-gray-700 overflow-x-auto">
                  <h3 className="text-[#4DF98A] font-semibold mb-2">Result:</h3>
                  <pre className="text-gray-300 text-sm">
                    {JSON.stringify(quote, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-white mb-4">Example Source Code</h3>
              <pre className="bg-black/50 text-gray-300 p-4 rounded-lg text-sm overflow-auto border border-gray-700">
{`import { SwapsPro } from '@swapspro/sdk';

const sdk = new SwapsPro({
  baseUrl: "https://www.swaps.pro/api/sdk/v1",
  partner: "your-partner-id",
});

const quote = await sdk.quote({
  sellChain: "8453",
  sellToken: "ETH",
  buyChain: "8453",
  buyToken: "USDC",
  amount: "0.1",
  address: "0xYourWalletAddress",
});

console.log(quote);`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
