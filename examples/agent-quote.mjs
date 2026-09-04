/**
 * Quote a swap and branch on the execution shape. Node 18+, no dependencies.
 *
 *   node examples/agent-quote.mjs
 *   node examples/agent-quote.mjs 8453 USDC BTC BTC 100
 *
 * Quoting is free, keyless and signs nothing — this script never touches a
 * private key. What it prints is what an agent would have to sign next.
 */

const API = 'https://www.swaps.pro/api/sdk/v1';
const PARTNER = process.env.SWAPSPRO_PARTNER ?? 'swapspro-demo';

const [
  sellChain = '8453',
  sellToken = 'ETH',
  buyChain = '8453',
  buyToken = 'USDC',
  amount = '0.1',
] = process.argv.slice(2);

const address = process.env.AGENT_ADDRESS ?? '0x21c9a94AF76B59b171b32fD125A4edF0e9A2Ad3e';
// Cross-chain routes need somewhere to land on the destination chain.
const recipient = process.env.AGENT_RECIPIENT ?? 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';

const params = new URLSearchParams({
  sellChain,
  sellToken,
  buyChain,
  buyToken,
  amount, // human units — "0.1", never base units
  address,
  partner: PARTNER,
});
if (sellChain !== buyChain) params.set('recipient', recipient);

const res = await fetch(`${API}/quote?${params}`);
const quote = await res.json();

if (!res.ok) {
  // An error is an answer: NO_ROUTE means this pair cannot be priced at this
  // size right now. Do not retry it in a loop.
  console.error(`${res.status} ${quote.code}: ${quote.error}`);
  process.exit(1);
}

console.log(`${quote.sellAmount} ${quote.sellToken.symbol} -> ${quote.buyAmount} ${quote.buyToken.symbol}`);
console.log(`venue: ${quote.provider}   floor: ${quote.minBuyAmount}   expires: ${quote.expiresAt}`);
console.log(`partner fee: ${quote.partnerFee?.note ?? 'n/a'}\n`);

// Exactly one of these three is present. Branch on which.
if (quote.tx) {
  console.log('shape: tx — a ready-to-sign EVM transaction');
  if (quote.approval) {
    console.log(
      `  first: approve ${quote.approval.amountWei} of ${quote.approval.token}` +
        ` to ${quote.approval.spender}, and WAIT for it to mine`
    );
  }
  console.log(`  then: eth_sendTransaction to ${quote.tx.to} on chain ${quote.tx.chainId}`);
  console.log(`  value ${quote.tx.value ?? '0x0'}  gasLimit ${quote.tx.gasLimit ?? 'estimate'}`);
  console.log('  send it as-is: value and gasLimit are 0x-hex. Do not rebuild the calldata.');
} else if (quote.order) {
  console.log('shape: order — a CoW Protocol order. Gasless, and asynchronous.');
  console.log(`  1. PUT ${quote.order.appDataUrl} with { fullAppData }`);
  console.log('  2. eth_signTypedData_v4 over order.typedData');
  console.log(`  3. POST the signed order to ${quote.order.postUrl}`);
  console.log(`  valid until ${new Date(quote.order.validTo * 1000).toISOString()};`);
  console.log('  solvers fill it in a batch auction, and it can expire unfilled.');
} else if (quote.depositAddress) {
  console.log('shape: depositAddress — a THORChain-style deposit route.');
  console.log(`  send ${quote.sellAmount} ${quote.sellToken.symbol} to ${quote.depositAddress}`);
  console.log(`  memo (verbatim): ${quote.memo}`);
  console.log('  the SDK’s executeSwap() throws NOT_SUPPORTED here — there is no tx to send.');
}
