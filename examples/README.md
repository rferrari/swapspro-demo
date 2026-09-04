# Runnable examples

Each file here is complete and standalone — the `/start` page in the app renders
these exact files, so what you read there is what runs.

| File | Run it |
|---|---|
| `agent-quote.mjs` | `node examples/agent-quote.mjs` — quotes and prints the execution shape. No key, no wallet. |
| `embed.html` | Open it in a browser. The whole widget integration: an iframe and a height listener. |
| `SwapCard.tsx` | Copy into a React app, change `partner`, render `<SwapCard />`. Signs on Base mainnet. |

`agent-quote.mjs` takes positional arguments:

```bash
node examples/agent-quote.mjs 8453 ETH 8453 USDC 0.1   # same-chain: returns a tx
node examples/agent-quote.mjs 8453 USDC BTC BTC 100    # cross-chain: returns a deposit address
```
