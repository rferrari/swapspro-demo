# SwapPro Demo

A demonstration of SwapPro's SDK, HTTP API, and Widget built with Next.js.

## Features

- **Homepage**: Links to demo pages for each integration method
- **Widget Demo**: Interactive SwapPro widget with customizable theme, tokens, and amount
- **SDK Demo**: Uses the `@swapspro/sdk` package to fetch chains, tokens, and get quotes
- **HTTP API Demo**: Makes direct fetch requests to SwapPro's public HTTP API endpoints

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Project Structure

- `app/page.tsx` - Homepage with links to demos
- `app/widget/page.tsx` - Widget demo page
- `app/sdk/page.tsx` - SDK demo page
- `app/http-api/page.tsx` - HTTP API demo page
- `src/lib/swaps.ts` - SDK client initialization
- `src/components/SwapProWidget.tsx` - Custom widget component with height listener

## API Usage Examples

### SDK Usage

```typescript
import { SwapsPro } from '@swapspro/sdk';

const swaps = new SwapsPro({
  partner: 'your-app-id',
  partnerFeeBps: 25, // optional
});

const chains = await swaps.chains();
const tokens = await swaps.tokens('BASE'); // or chainId: 8453
const quote = await swaps.quote({
  sellChain: 8453,
  sellToken: 'ETH',
  buyChain: 8453,
  buyToken: 'USDC',
  amount: '0.1',
  address: '0xYourAddress',
});
```

### HTTP API Usage

```javascript
// Get chains
const chainsResponse = await fetch('https://www.swaps.pro/api/sdk/v1/chains');
const chainsData = await chainsResponse.json();

// Get tokens for a chain
const tokensResponse = await fetch('https://www.swaps.pro/api/sdk/v1/tokens?chainId=8453');
const tokensData = await tokensResponse.json();

// Get a quote
const quoteResponse = await fetch(
  'https://www.swaps.pro/api/sdk/v1/quote?sellChain=8453&sellToken=ETH&buyChain=8453&buyToken=USDC&amount=0.1&address=0xYourAddress&partner=your-app-id'
);
const quoteData = await quoteResponse.json();
```

## Deployment

This app is ready to be deployed on Vercel. Simply push the repository to GitHub and import it into Vercel.

## Learn More

- [SwapPro Documentation](https://www.swaps.pro/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT