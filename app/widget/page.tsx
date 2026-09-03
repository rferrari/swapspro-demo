'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import SwapsProWidget from '@/components/SwapProWidget';

export default function WidgetPage() {
  // Simple Widget State (query string parameters)
  const [simpleTheme, setSimpleTheme] = useState<'dark' | 'light'>('dark');
  const [simpleAccent, setSimpleAccent] = useState<string>('#4DF98A');
  const [simpleSellToken, setSimpleSellToken] = useState<string>('ETH');
  const [simpleBuyToken, setSimpleBuyToken] = useState<string>('USDC');
  const [simpleAmount, setSimpleAmount] = useState<string>('0.1');

  // Advanced Widget State (postMessage theme object)
  const [advancedTheme, setAdvancedTheme] = useState<{
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

  // Default theme (dark) for advanced widget
  const defaultTheme = useMemo(() => ({
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
  }), []);

  // Light theme for advanced widget
  const lightTheme = useMemo(() => ({
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
  }), []);

  const [advancedCurrentTheme, setAdvancedCurrentTheme] = useState<'dark' | 'light'>('dark');

  // Update advanced theme object based on toggle
  useMemo(() => {
    if (advancedCurrentTheme === 'dark') {
      setAdvancedTheme(defaultTheme);
    } else {
      setAdvancedTheme(lightTheme);
    }
  }, [advancedCurrentTheme, defaultTheme, lightTheme]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="text-sm text-gray-300 mb-2">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">
            SwapPro Widget Demo
          </h1>
        </div>

        {/* Simple Widget Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Simple Widget (Query String Parameters)
            </h2>
            <div className="space-y-4">
              {/* Controls */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <label className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <span className="text-gray-300">Theme</span>
                    <div className="mt-2 sm:mt-0 sm:flex-row sm:items-center">
                      <button
                        onClick={() => setSimpleTheme('dark')}
                        className={simpleTheme === 'dark'
                          ? 'px-3 py-1 rounded border bg-indigo-600 text-white border-indigo-600'
                          : 'px-3 py-1 rounded border bg-gray-800 text-gray-300 border-gray-700'
                        }
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => setSimpleTheme('light')}
                        className={simpleTheme === 'light'
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
                      value={simpleAccent}
                      onChange={(e) => setSimpleAccent(e.target.value)}
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
                      value={simpleSellToken}
                      onChange={(e) => setSimpleSellToken(e.target.value.toUpperCase())}
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
                      value={simpleBuyToken}
                      onChange={(e) => setSimpleBuyToken(e.target.value.toUpperCase())}
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
                      value={simpleAmount}
                      onChange={(e) => setSimpleAmount(e.target.value)}
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
                  appearance={simpleTheme}
                  accent={simpleAccent}
                  radius={16}
                  width="100%"
                  sell={simpleSellToken}
                  buy={simpleBuyToken}
                  amount={simpleAmount}
                  onHeightChange={(h) => console.log('Simple widget height:', h)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Widget Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-inner">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Advanced Widget (postMessage Theme Object)
            </h2>
            <div className="space-y-4">
              {/* Controls */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <label className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <span className="text-gray-300">Theme</span>
                    <div className="mt-2 sm:mt-0 sm:flex-row sm:items-center">
                      <button
                        onClick={() => setAdvancedCurrentTheme('dark')}
                        className={advancedCurrentTheme === 'dark'
                          ? 'px-3 py-1 rounded border bg-indigo-600 text-white border-indigo-600'
                          : 'px-3 py-1 rounded border bg-gray-800 text-gray-300 border-gray-700'
                        }
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => setAdvancedCurrentTheme('light')}
                        className={advancedCurrentTheme === 'light'
                          ? 'px-3 py-1 rounded border ml-2 bg-indigo-600 text-white border-indigo-600'
                          : 'px-3 py-1 rounded border ml-2 bg-gray-800 text-gray-300 border-gray-700'
                        }
                      >
                        Light
                      </button>
                    </div>
                  </label>
                </div>
              </div>

              {/* Widget Preview */}
              <div className="border-t pt-4">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Widget Preview
                </h2>
                <SwapsProWidget
                  theme={advancedTheme}
                  chrome="none"
                  sell="ETH"
                  buy="USDC"
                  amount="0.1"
                  width="100%"
                  onHeightChange={(h) => console.log('Advanced widget height:', h)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}