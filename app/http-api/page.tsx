'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Chain {
  id: string;
  name: string;
  type: string;
  chainId?: string;
  sellSupported?: boolean;
}

interface Token {
  symbol: string;
  name: string;
  contract?: string;
  decimals?: number;
  isToken?: boolean;
}

interface QuoteFee {
  requestedBps: number;
  collectedBps: number;
}

interface Quote {
  provider: string;
  sellAmount: number;
  buyAmount: number;
  rate: number;
  minBuyAmount: number;
  expiresAt: string;
  partnerFee: QuoteFee;
}

export default function HTTPAPIPage() {
  const [chains, setChains] = useState<Chain[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string>('8453'); // Base chainId
  const sellToken = 'ETH';
  const buyToken = 'USDC';
  const [amount, setAmount] = useState<string>('0.1');

  // Base URL for the HTTP API
  const API_BASE = 'https://www.swaps.pro/api/sdk/v1';

  // Fetch chains on mount
  useEffect(() => {
    const fetchChains = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/chains`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setChains(data.chains);
      } catch (err) {
        setError('Failed to fetch chains');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChains();
  }, []);

  // Fetch tokens when selectedChain changes
  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/tokens?chainId=${selectedChain}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTokens(data.tokens);
      } catch (err) {
        setError('Failed to fetch tokens');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (selectedChain) {
      fetchTokens();
    }
  }, [selectedChain]);

  // Fetch quote when sellToken, buyToken, amount, or selectedChain changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!sellToken || !buyToken || !amount) return;
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          sellChain: selectedChain,
          sellToken,
          buyChain: selectedChain, // same-chain for simplicity
          buyToken,
          amount,
          address: '0x21c9a94AF76B59b171b32fD125A4edF0e9A2Ad3e', // example address
          partner: 'swapspro-demo',
        });
        const response = await fetch(`${API_BASE}/quote?${queryParams.toString()}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setQuote(data);
      } catch (err) {
        setError('Failed to fetch quote');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (sellToken && buyToken && amount) {
      fetchQuote();
    }
  }, [selectedChain, sellToken, buyToken, amount]);

  if (loading && (!chains.length || !tokens.length || !quote)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="text-sm text-gray-400 mb-2">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-white">
              HTTP API Demo
            </h1>
          </div>
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500 text-white">
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="text-sm text-gray-400 mb-2">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-white">
            HTTP API Demo
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 mb-6">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Chains Section */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              Chains (GET /chains)
            </h2>
            <div className="bg-gray-800 rounded-xl shadow-2xl shadow-black/50 border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Chain ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                        Sell Supported
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {chains.map((chain) => (
                      <tr key={chain.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {chain.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {chain.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrow text-sm text-gray-400">
                          {chain.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {chain.chainId ?? 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {chain.sellSupported ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                Example Request
              </h3>
              <pre className="bg-black text-[#4DF98A] border border-gray-700 p-4 rounded text-sm overflow-auto">
curl {API_BASE}/chains
              </pre>
            </div>
          </section>

          {/* Tokens Section */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Tokens for {selectedChain} (GET /tokens?chainId={selectedChain})
              </h2>
              <div className="mt-4 sm:mt-0">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Select Chain
                </label>
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:w-48 bg-gray-900 text-white"
                >
                  {chains.map((chain) => (
                    <option key={chain.id} value={chain.id}>
                      {chain.name} ({chain.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-2xl shadow-black/50 border border-gray-700 overflow-hidden">
              {tokens.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                          Symbol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                          Contract
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                          Decimals
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                          Is Token
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {tokens.map((token) => (
                        <tr key={token.symbol}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {token.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {token.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {token.contract ?? 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {token.decimals ?? 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {token.isToken ? 'Yes' : 'No'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No tokens data available.</p>
              )}
            </div>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                Example Request
              </h3>
              <pre className="bg-black text-[#4DF98A] border border-gray-700 p-4 rounded text-sm overflow-auto">
              curl &apos;{API_BASE}/tokens?chainId=${selectedChain}&apos;
              </pre>
            </div>
          </section>

          {/* Quote Section */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Quote (GET /quote)
              </h2>
              <div className="mt-4 sm:mt-0 space-x-2">
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-24 bg-gray-900 text-white"
                />
                <button
                  onClick={() => {
                    // Trigger a refetch by changing a dummy state
                    setAmount(amount);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Get Quote
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Sell
                </label>
                <p className="mt-1 text-sm text-white">
                  {sellToken} on {selectedChain}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Buy
                </label>
                <p className="mt-1 text-sm text-white">
                  {buyToken} on {selectedChain}
                </p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-2xl shadow-black/50 border border-gray-700 overflow-hidden">
              {quote ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                          Field
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          Provider
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                          {quote.provider}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          Sell Amount
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                          {quote.sellAmount} {sellToken}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          Buy Amount
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                          {quote.buyAmount} {buyToken}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          Rate
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                          {quote.rate.toFixed(4)} {buyToken}/{sellToken}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          Min Buy Amount
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                          {quote.minBuyAmount} {buyToken}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          Expires At
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                          {new Date(quote.expiresAt).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          Partner Fee Requested (bps)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                          {quote.partnerFee.requestedBps}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          Partner Fee Collected (bps)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                          {quote.partnerFee.collectedBps}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">Enter details above to get a quote.</p>
              )}
            </div>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">
                Example Request
              </h3>
              <pre className="bg-black text-[#4DF98A] border border-gray-700 p-4 rounded text-sm overflow-auto">
curl &apos;${API_BASE}/quote?sellChain=${selectedChain}&sellToken=${sellToken}&buyChain=${selectedChain}&buyToken=${buyToken}&amount=${amount}&address=0x21c9a94AF76B59b171b32fD125A4edF0e9A2Ad3e&partner=swapspro-demo&apos;
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}