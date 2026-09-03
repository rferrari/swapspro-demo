'use client';

import Link from 'next/link';
import { useState } from 'react';
import SwapsProWidget from '@/components/SwapProWidget';

export default function WidgetPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [accent, setAccent] = useState<string>('#4DF98A');
  const [sellToken, setSellToken] = useState<string>('ETH');
  const [buyToken, setBuyToken] = useState<string>('USDC');
  const [amount, setAmount] = useState<string>('0.1');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="text-sm text-gray-300 mb-2">
            ← Back to Home
          </Link>
          <div className="flex space-x-4 text-sm text-gray-300">
            <Link href="/widget/simple" className="hover:underline">
              Simple Demo
            </Link>
            <Link href="/widget/advanced" className="ml-4 hover:underline">
              Advanced Demo
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white mt-4">
            SwapPro Widget Demo
          </h1>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
          <div className="p-6 space-y-6">
            {/* Controls */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <label className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <span className="text-gray-300">Theme</span>
                  <div className="mt-2 sm:mt-0 sm:flex-row sm:items-center">
                    <button
                      onClick={() => setTheme('dark')}
                      className={theme === 'dark'
                        ? 'px-3 py-1 rounded border bg-indigo-600 text-white border-indigo-600'
                        : 'px-3 py-1 rounded border bg-gray-800 text-gray-300 border-gray-700'
                      }
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={theme === 'light'
                        ? 'px-3 py-1 rounded border ml-2 bg-indigo-600 text-white border-indigo-600'
                        : 'px-3 py-1 rounded border ml-2 bg-gray-800 text-gray-300 border-gray-700'
                      }
                    >
                      Light
                    </button>
                  </div>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <label className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <span className="text-gray-300">Accent Color</span>
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    className="mt-2 sm:mt-0 w-12 h-12 sm:w-auto sm:h-auto border border-gray-700 rounded bg-gray-800 cursor-pointer"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Sell Token
                  </label>
                  <input
                    type="text"
                    value={sellToken}
                    onChange={(e) => setSellToken(e.target.value.toUpperCase())}
                    className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="ETH"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Buy Token
                  </label>
                  <input
                    type="text"
                    value={buyToken}
                    onChange={(e) => setBuyToken(e.target.value.toUpperCase())}
                    className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="USDC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.1"
                  />
                </div>
              </div>
            </div>

            {/* Widget Preview */}
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-white mb-4">
                Widget Preview
              </h2>
              <SwapsProWidget
                appearance={theme}
                accent={accent}
                radius={16}
                width="100%"
                sell={sellToken}
                buy={buyToken}
                amount={amount}
                onHeightChange={(h) => console.log('Widget height:', h)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}