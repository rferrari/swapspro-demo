'use client';

import { useEffect, useState } from 'react';
import SwapsProWidget from '@/components/SwapProWidget';
import Link from 'next/link';

export default function AdvancedWidgetPage() {
  const [theme, setTheme] = useState<{
    colors: {
      canvas: string;
      surface: string;
      text: string;
      accent: string;
    };
    fontFamily: string;
    shape: {
      borderRadius: number;
      borderRadiusSecondary: number;
    };
  } | undefined>(undefined);

  // Default theme (dark)
  const defaultTheme = {
    colors: {
      canvas: '#0b0f0d',
      surface: 'rgb(17, 24, 20)',
      text: '#e8f1ec',
      accent: '#4DF98A',
    },
    fontFamily: '"Inter", system-ui, sans-serif',
    shape: {
      borderRadius: 20,
      borderRadiusSecondary: 10,
    },
  };

  // Light theme
  const lightTheme = {
    colors: {
      canvas: '#ffffff',
      surface: '#fafafa',
      text: '#101418',
      accent: '#3B82F6',
    },
    fontFamily: '"Inter", system-ui, sans-serif',
    shape: {
      borderRadius: 16,
      borderRadiusSecondary: 8,
    },
  };

  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  // Update theme object based on selection
  useEffect(() => {
    if (currentTheme === 'dark') {
      setTheme(defaultTheme);
    } else {
      setTheme(lightTheme);
    }
  }, [currentTheme, defaultTheme, lightTheme]); // Added dependencies to fix exhaustive-deps warning

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="text-sm text-gray-300 mb-2">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">
            Advanced Widget (postMessage Theme Object)
          </h1>
          <p className="mt-2 text-gray-400">
            Configured via postMessage for deep theming, with chrome=none
          </p>
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
                      onClick={() => setCurrentTheme('dark')}
                      className={currentTheme === 'dark'
                        ? 'px-3 py-1 rounded border bg-indigo-600 text-white border-indigo-600'
                        : 'px-3 py-1 rounded border bg-gray-800 text-gray-300 border-gray-700'
                      }
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => setCurrentTheme('light')}
                      className={currentTheme === 'light'
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
                  <span className="text-gray-300">Sell Token</span>
                  <input
                    type="text"
                    value="ETH"
                    readOnly
                    className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="ETH"
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <label className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <span className="text-gray-300">Buy Token</span>
                  <input
                    type="text"
                    value="USDC"
                    readOnly
                    className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="USDC"
                  />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <label className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <span className="text-gray-300">Amount</span>
                  <input
                    type="number"
                    step="0.01"
                    value="0.1"
                    readOnly
                    className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-800 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0.1"
                  />
                </label>
              </div>
            </div>

            {/* Widget Preview */}
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-white mb-4">
                Widget Preview
              </h2>
              <SwapsProWidget
                theme={theme}
                chrome="none"
                sell="ETH"
                buy="USDC"
                amount="0.1"
                width="100%"
                onHeightChange={(h) => console.log('Widget height:', h)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}