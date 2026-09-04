/**
 * The whole site in one array.
 *
 * The homepage index, the sidebar, the prev/next footer and the README
 * coverage table all render from this, so a new page is added in exactly one
 * place. `doc` is the swaps.pro page the content came from.
 */

export interface NavItem {
  href: string;
  title: string;
  /** One line: what a developer learns here. */
  learn: string;
  /** The upstream doc this page inlines. */
  doc?: string;
}

export interface NavGroup {
  title: string;
  blurb: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    title: 'Start here',
    blurb: 'What SwapsPro is, which surface to pick, and how to fork this repo.',
    items: [
      {
        href: '/',
        title: 'Overview',
        learn: 'The three integration surfaces and which one your project wants.',
        doc: 'https://www.swaps.pro/docs',
      },
      {
        href: '/start',
        title: 'Quickstart',
        learn: 'Fork, configure, and three copy-paste recipes that run as-is.',
        doc: 'https://www.swaps.pro/docs',
      },
    ],
  },
  {
    title: 'Widget',
    blurb: 'Paste an iframe. No keys, no backend — the visitor signs in the frame.',
    items: [
      {
        href: '/widget',
        title: 'Embed & parameters',
        learn: 'Every query parameter, live, with a copy-paste snippet generator.',
        doc: 'https://www.swaps.pro/docs/widget',
      },
      {
        href: '/widget/theming',
        title: 'Deep theming',
        learn: 'The postMessage theme object: 12 colours, fonts, radii, auto-height.',
        doc: 'https://www.swaps.pro/docs/widget',
      },
    ],
  },
  {
    title: 'SDK',
    blurb: '@swapspro/sdk — a zero-dependency TypeScript client. You build the UI.',
    items: [
      {
        href: '/sdk',
        title: 'Install & methods',
        learn: 'Constructor options and every method, with live chain/token discovery.',
        doc: 'https://www.swaps.pro/docs/sdk',
      },
      {
        href: '/sdk/routes',
        title: 'The three route shapes',
        learn: 'Why a quote returns tx, order, or depositAddress — and how to branch.',
        doc: 'https://www.swaps.pro/docs/api/quote',
      },
      {
        href: '/sdk/execute',
        title: 'Execute a swap',
        learn: 'Approval, send, receipt and every typed error, over raw EIP-1193.',
        doc: 'https://www.swaps.pro/docs/sdk',
      },
      {
        href: '/sdk/wagmi',
        title: 'wagmi',
        learn: 'The same SDK against a wallet library, since executeSwap takes any provider.',
        doc: 'https://www.swaps.pro/docs/sdk',
      },
    ],
  },
  {
    title: 'HTTP API',
    blurb: 'CORS-open GET endpoints. Any language, any runtime, no key.',
    items: [
      {
        href: '/api',
        title: 'Overview',
        learn: 'Base URL, CORS, the error shape and the real rate limit.',
        doc: 'https://www.swaps.pro/docs/api',
      },
      {
        href: '/api/chains',
        title: 'GET /chains',
        learn: 'Chain symbols, CAIP-2 ids, and which chains can be sold from.',
        doc: 'https://www.swaps.pro/docs/api/chains',
      },
      {
        href: '/api/tokens',
        title: 'GET /tokens',
        learn: 'The curated list per chain, and the CAIP-19 id everything else keys on.',
        doc: 'https://www.swaps.pro/docs/api/tokens',
      },
      {
        href: '/api/prices',
        title: 'GET /prices',
        learn: 'USD spot for up to 100 assets — and why it is not an execution price.',
        doc: 'https://www.swaps.pro/docs/api/prices',
      },
      {
        href: '/api/quote',
        title: 'GET /quote',
        learn: 'Every parameter, the response shapes, and what each error means.',
        doc: 'https://www.swaps.pro/docs/api/quote',
      },
      {
        href: '/api/access',
        title: 'GET /access',
        learn: 'Rate-limit elevation over x402 — and the 503 this deployment really returns.',
        doc: 'https://www.swaps.pro/docs/api/access',
      },
    ],
  },
  {
    title: 'AI agents',
    blurb: 'Quoting is keyless and every quote is data you sign yourself.',
    items: [
      {
        href: '/agents',
        title: 'Agent path',
        learn: 'Discover, quote, branch, sign, track — with a runnable Node script.',
        doc: 'https://www.swaps.pro/docs/agents',
      },
      {
        href: '/agents/access',
        title: 'x402 & discovery',
        learn: 'The payment handshake, the Pro Pass path, and llms.txt.',
        doc: 'https://www.swaps.pro/docs/api/access',
      },
    ],
  },
  {
    title: 'Tools',
    blurb: 'Everything SwapsPro does to a wallet that is not a swap.',
    items: [
      {
        href: '/tools',
        title: 'All nine tools',
        learn: 'What each one signs, what it costs, and what it refuses to do.',
        doc: 'https://www.swaps.pro/docs/tools',
      },
    ],
  },
  {
    title: 'Reference',
    blurb: 'The commercial and operational facts an integrator has to know.',
    items: [
      {
        href: '/dao',
        title: 'DAO & treasury',
        learn: 'Running SwapsPro from a Safe, and ERC-1271 signing.',
        doc: 'https://www.swaps.pro/docs/dao',
      },
      {
        href: '/fees',
        title: 'Fees',
        learn: 'Every path and its cost, plus what partner fees really collect.',
        doc: 'https://www.swaps.pro/docs/fees',
      },
      {
        href: '/pro',
        title: 'Free & Pro',
        learn: 'The Pro Pass, what it waives, and what is dormant here.',
        doc: 'https://www.swaps.pro/docs/pro',
      },
    ],
  },
];

/** Flat, in sidebar order — used for prev/next. */
export const FLAT: NavItem[] = NAV.flatMap((g) => g.items);

export function siblings(href: string) {
  const i = FLAT.findIndex((n) => n.href === href);
  return { prev: i > 0 ? FLAT[i - 1] : null, next: i >= 0 ? FLAT[i + 1] ?? null : null };
}
