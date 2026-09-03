// ponytail: make home page a client component to allow passing function props to client widgets
'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          SwapPro Demo
        </h1>
        <p className="text-center text-gray-300 mb-12 text-lg">
          A demonstration of SwapPro&apos;s SDK, HTTP API, and Widget.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Widget Card */}
          <Link href="/widget">
            <div className="h-full bg-white/5 backdrop-blur rounded-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Widget
                </h2>
                <p className="text-gray-300 mb-4">
                  Embeddable swap card for your site.
                </p>
                <p className="text-sm text-gray-400">
                  Configure and preview the SwapPro widget
                </p>
              </div>
            </div>
          </Link>

          {/* SDK Card */}
          <Link href="/sdk">
            <div className="h-full bg-white/5 backdrop-blur rounded-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  SDK
                </h2>
                <p className="text-gray-300 mb-4">
                  Headless TypeScript client for SwapPro.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  See how to use the SDK to get chains, tokens, and quotes.
                </p>
              </div>
            </div>
          </Link>

          {/* HTTP API Card */}
          <Link href="/http-api">
            <div className="h-full bg-white/5 backdrop-blur rounded-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  HTTP API
                </h2>
                <p className="text-gray-300 mb-4">
                  Direct API calls to SwapPro&apos;s endpoints.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  See how to make fetch requests to /chains, /tokens, and /quote.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center text-gray-500">
          <p className="mb-2">
            <a href="https://www.swaps.pro/" className="text-gray-400 hover:text-white hover:underline transition-colors">
              SwapPro
            </a>{' '}
            •{' '}
            <a href="https://www.swaps.pro/docs" className="text-gray-400 hover:text-white hover:underline transition-colors">
              Docs
            </a>{' '}
            •{' '}
            <a href="https://www.swaps.pro/docs/tools" className="text-gray-400 hover:text-white hover:underline transition-colors">
              Tools
            </a>
          </p>
          <p>
            Built with <a href="https://www.swaps.pro/" className="text-[#4DF98A] hover:underline">swaps.pro</a> and{' '}
            <a href="https://nextjs.org/" className="underline hover:no-underline">
              Next.js
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}