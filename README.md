# SwapsPro starter kit

A working demo of **every way to integrate [SwapsPro](https://www.swaps.pro)** — the
embeddable widget, the TypeScript SDK, the keyless HTTP API and the agent path.

It is built to be forked. Every page explains the concept, shows how to implement it,
and runs the sample live against the real public API, with the reference content on the
page itself — you should not have to read the docs in another tab to use this.

```bash
git clone <your-fork>
cd swapspro-demo
npm install
cp .env.example .env.local     # change NEXT_PUBLIC_SWAPSPRO_PARTNER
npm run dev                    # http://localhost:3000
```

That is the whole setup. There is no API key, no account and no signup — quoting is free
and keyless, and every quote comes back as data the holder's own wallet signs.

## Configuration

| Variable | Default | What it does |
|---|---|---|
| `NEXT_PUBLIC_SWAPSPRO_PARTNER` | `swapspro-demo` | Your integrator id. Attribution only: no signup, no key, nothing to revoke. Up to 64 characters. |
| `NEXT_PUBLIC_SWAPSPRO_FEE_BPS` | `0` | Additive partner fee in basis points, capped at 100 (1%) by the API. Read `/fees` first — not every venue can carry a second fee, and attribution is not settlement. |

All of it is read in one place: `src/lib/config.ts`.

## What each page teaches

| Route | You learn | Docs source |
|---|---|---|
| `/` | The three integration surfaces and which one your project wants | [docs](https://www.swaps.pro/docs) |
| `/start` | Fork, configure, and three copy-paste recipes that run as-is | [docs](https://www.swaps.pro/docs) |
| `/widget` | Every embed query parameter, live, with a snippet generator | [widget](https://www.swaps.pro/docs/widget) |
| `/widget/theming` | The postMessage theme object: 12 colours, fonts, radii, auto-height | [widget](https://www.swaps.pro/docs/widget) |
| `/sdk` | Constructor options and every method, with live discovery | [sdk](https://www.swaps.pro/docs/sdk) |
| `/sdk/routes` | Why a quote returns `tx`, `order` or `depositAddress`, and how to branch | [quote](https://www.swaps.pro/docs/api/quote) |
| `/sdk/execute` | Approval, send, receipt and every typed error, over raw EIP-1193 | [sdk](https://www.swaps.pro/docs/sdk) |
| `/sdk/wagmi` | The same SDK against a wallet library (wagmi), not just `window.ethereum` | [sdk](https://www.swaps.pro/docs/sdk) |
| `/api` | Base URL, CORS, the error shape and the real rate limit | [api](https://www.swaps.pro/docs/api) |
| `/api/chains` | Chain symbols, CAIP-2 ids, and which chains can be sold from | [chains](https://www.swaps.pro/docs/api/chains) |
| `/api/tokens` | The curated list per chain, and the CAIP-19 id everything keys on | [tokens](https://www.swaps.pro/docs/api/tokens) |
| `/api/prices` | USD spot for up to 100 assets — and why it is not an execution price | [prices](https://www.swaps.pro/docs/api/prices) |
| `/api/quote` | Every parameter, the response shapes, and what each error means | [quote](https://www.swaps.pro/docs/api/quote) |
| `/api/access` | Rate-limit elevation over x402 — and the 503 this deployment returns | [access](https://www.swaps.pro/docs/api/access) |
| `/agents` | Discover, quote, branch, sign, track — with a runnable Node script | [agents](https://www.swaps.pro/docs/agents) |
| `/agents/access` | The x402 handshake, the Pro Pass path, and `llms.txt` | [access](https://www.swaps.pro/docs/api/access) |
| `/tools` + `/tools/[slug]` ×9 | What each tool signs, what it costs, what it refuses to do | [tools](https://www.swaps.pro/docs/tools) |
| `/dao` | Running SwapsPro from a Safe, and ERC-1271 signing | [dao](https://www.swaps.pro/docs/dao) |
| `/fees` | Every path and its cost, plus what partner fees really collect | [fees](https://www.swaps.pro/docs/fees) |
| `/pro` | The Pro Pass, what it waives, and what is dormant here | [pro](https://www.swaps.pro/docs/pro) |

The routes are declared once in `src/lib/nav.ts`; the homepage index, the sidebar and the
prev/next links all render from it.

## Runnable examples

`examples/` holds three complete files. The `/start` page renders these exact files, so
what you read there is what runs.

```bash
node examples/agent-quote.mjs                       # same-chain: returns a tx
node examples/agent-quote.mjs 8453 USDC BTC BTC 100 # cross-chain: a deposit address
open examples/embed.html                            # the whole widget integration
```

`examples/SwapCard.tsx` is a complete React swap card — copy it into a project, change
`partner`, render `<SwapCard />`.

## Project structure

```
app/                    one directory per route, mirroring the docs
src/lib/config.ts       every value a fork changes, incl. the access header name
src/lib/access.ts       sending a grant across the header rename
src/lib/nav.ts          the whole route tree, in one array
src/lib/swaps.ts        the shared SDK client
src/lib/tools.ts        the nine tools, as data
src/components/         DocLayout, TryIt, CodeBlock, ParamTable, Callout, Steps…
examples/               three standalone, runnable files
```

`TryIt` is the workhorse: an editable, live request against the public API that also
prints the equivalent `curl` and `fetch`. Every API reference page is that component
plus prose — which works because the API is CORS-open and needs no key.

## Pending: the access-header rename

The rate-limit grant from `/access` is presented as a header, and that header is being
renamed from `X-SwapPro-Access` to `X-SwapsPro-Access`. This repo is set up so the switch
is one line:

1. Flip `ACCESS_HEADER` in `src/lib/config.ts`. Every page, sample and code path renders
   from it.
2. Do it **after** the API lists the new name in its CORS `Access-Control-Allow-Headers`.
   A browser preflights any custom header, so a name the server does not advertise is
   blocked before the request leaves. Today that list is
   `Content-Type, Authorization, X-SwapPro-Access`.

Better still, do not name the header at all. The `/access` response carries a `header`
field naming what to send, and `Authorization: Bearer <token>` is accepted either way and
is unaffected by the rename — `src/lib/access.ts` uses Bearer in the browser and sends
both header names server-side, where there is no preflight to fail.

## Two things worth knowing before you build

**Every quote carries exactly one execution shape.** `tx` (same-chain EVM), `order`
(CoW, gasless and asynchronous), or `depositAddress` + `memo` (THORChain-style). Which
one you get is a pricing outcome, not a property of the pair, so branch on the field
rather than on the token symbols. `/sdk/routes` demonstrates this live.

**Attribution is not settlement.** Setting `partner` puts your id in a request log.
Being *paid* is a separate opt-in with its own ceilings and its own deploy — see `/fees`
and `/tools/partners`. Read `quote.partnerFee.note` rather than assuming your requested
bps were collected.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run lint     # eslint
```

## License

MIT.
