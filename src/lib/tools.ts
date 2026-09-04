/**
 * The nine tools beside the swap card. These are swaps.pro-hosted products
 * with no public API of their own, so the honest sample is a described index
 * rather than a re-implemented UI: what each one signs, what it costs, and
 * what it refuses to do.
 */

export interface Tool {
  slug: string;
  name: string;
  tagline: string;
  /** Two or three paragraphs of what it actually does. */
  body: string[];
  signs: string;
  cost: string;
  /** The refusal that defines the tool's character. */
  refuses: string;
  live?: string;
  doc: string;
}

export const TOOLS: Tool[] = [
  {
    slug: 'batch-send',
    name: 'Batch Send',
    tagline: 'Move every ERC-20 in a wallet to one address in one batch.',
    body: [
      'Sends every selected ERC-20 to one destination in a single EIP-5792 wallet_sendCalls batch — one wallet confirmation instead of one per token, up to 50 tokens per batch.',
      'Each transfer is simulated on a public RPC first and transfer-locked tokens are dropped, so one hostile airdrop cannot make a wallet reject the whole batch. Wallets without EIP-5792 fall back automatically to one transaction per token.',
      'For a multisig this is the difference between one round of signatures and N — which is why it is the treasury tool people reach for first.',
    ],
    signs: 'One EIP-5792 batch of ERC-20 transfers, plus the fee call appended last.',
    cost: 'A flat 0.0002 ETH per batch, always in native ETH and never taken out of the tokens being sent. Not charged if nothing sends. Network gas is separate and quoted by your wallet.',
    refuses: 'It drops transfer-locked tokens rather than letting one hostile token fail the batch.',
    live: 'https://www.swaps.pro/batch-send',
    doc: 'https://www.swaps.pro/docs/tools/batch-send',
  },
  {
    slug: 'airdrop',
    name: 'CSV Airdrop',
    tagline: 'One token to many recipients, from pasted text or a file.',
    body: [
      'Every line is parsed, every ENS name resolved, and every transfer simulated before anything is signed.',
      'A line that cannot be read BLOCKS the send and is reported with its line number and original text — it is never skipped. An airdrop that quietly drops one row succeeds, reports a plausible total, and leaves somebody unpaid with nothing saying so.',
      'Amounts convert from the written string at the token’s real precision, never from a float: parseUnits truncates silently rather than throwing, so more decimal places than the token has is refused with both numbers shown. Transfers are grouped into batches of up to 50 signatures, and a run that stops early states which batch it stopped at and how many recipients are still unpaid.',
    ],
    signs: 'Batched ERC-20 transfers, up to 50 per signature.',
    cost: 'The batch fee plus network gas.',
    refuses: 'An unreadable line stops the send instead of disappearing from it.',
    live: 'https://www.swaps.pro/batch-send',
    doc: 'https://www.swaps.pro/docs/tools/airdrop',
  },
  {
    slug: 'launch',
    name: 'Launch a token',
    tagline: 'Deploy a token through Clanker’s v4 factory.',
    body: [
      'Deploys through Clanker on Base, Arbitrum, Ethereum or Robinhood Chain. SwapsPro builds the call and the user’s wallet signs it; the contracts and the liquidity are Clanker’s.',
      'Trading fees accrue forever to named recipients. The creator keeps 80% of that stream and can point it at a 0xSplits address, so one launch pays a whole team with no second transaction. The split must total exactly 10000 basis points and is refused rather than rounded.',
      'The deploy is simulated against the chain before a signature is requested. Robinhood Chain is listed as supported by Clanker and its factory is deployed there — and a launch still reverts with LockerNotEnabled(). Only asking the chain distinguishes those two.',
    ],
    signs: 'One factory deploy transaction, simulated first.',
    cost: 'Network gas. The trading-fee split is shown before you sign.',
    refuses: 'A fee split that does not total exactly 10000 bps is refused, not rounded.',
    live: 'https://www.swaps.pro/swap',
    doc: 'https://www.swaps.pro/docs/tools/launch',
  },
  {
    slug: 'batch-swap',
    name: 'Batch Swap + Burn',
    tagline: 'Sell a wallet’s dust in one batch; burn what has no market.',
    body: [
      'Sells a wallet’s dust into ETH or the chain’s canonical USD stable — USDC, or USDG on Robinhood Chain — in one batch.',
      'Tokens with no market can be burned to 0x…dEaD instead, but only after an on-chain trace and a GoPlus safety check prove burning is all they can do.',
      'Contracts too hostile even to burn are quarantined, shown, and never counted. The tool names them rather than silently dropping them.',
    ],
    signs: 'One EIP-5792 batch of swaps, and optionally burns.',
    cost: 'A flat 0.0002 ETH per batch plus the route fees on what sells.',
    refuses: 'It will not burn a token until a trace proves burning is all it can do.',
    live: 'https://www.swaps.pro/batch-swap',
    doc: 'https://www.swaps.pro/docs/tools/batch-swap',
  },
  {
    slug: 'limit-orders',
    name: 'Limit orders and TWAP',
    tagline: 'Gasless CoW orders and TWAP ladders.',
    body: [
      'Limit orders and TWAP ladders are gasless CoW Protocol orders: signed, not broadcast, and filled by solvers in a batch auction. Placing and cancelling cost no gas.',
      'The one on-chain step is the ERC-20 approval to CoW’s vault relayer.',
      'Orders can expire unfilled — an agent must treat them as asynchronous and poll the order uid rather than assume a fill. Contract wallets (Safes) sign these with ERC-1271 rather than a plain signature.',
    ],
    signs: 'An EIP-712 order, plus one on-chain approval to the vault relayer.',
    cost: 'No gas to place or cancel. CoW surplus sharing applies — see Fees.',
    refuses: 'Nothing is broadcast: an unfilled order expires rather than executing late.',
    live: 'https://www.swaps.pro/swap',
    doc: 'https://www.swaps.pro/docs/tools/limit-orders',
  },
  {
    slug: 'danger-zone',
    name: 'The portfolio Danger Zone',
    tagline: 'Names the holdings whose contracts failed a safety check.',
    body: [
      'A portfolio panel that names the holdings whose contracts failed a safety check, with the evidence for each.',
      'It has no buttons on purpose. The panel’s job is to tell you what it found, not to offer a one-click action on a contract that is already known to be hostile.',
      'It is explicit about how far its evidence actually goes rather than implying a verdict it cannot support.',
    ],
    signs: 'Nothing. It is read-only by design.',
    cost: 'Free.',
    refuses: 'It offers no action at all on a contract known to be hostile.',
    live: 'https://www.swaps.pro/portfolio',
    doc: 'https://www.swaps.pro/docs/tools/danger-zone',
  },
  {
    slug: 'create-contract',
    name: 'Create Contract',
    tagline: 'Deploy an audited 0xSplits contract.',
    body: [
      'Deploys audited 0xSplits contracts — splits, waterfalls and liquid splits — that share out every payment they receive automatically, with one-click payouts.',
      'The pre-filled support amount is a suggestion the user can zero in one click; the deploy proceeds either way.',
      'The default distribution incentive is a separate thing again: it is paid by whoever triggers a distribution, not at creation, and it is editable and removable.',
    ],
    signs: 'One 0xSplits factory deploy.',
    cost: 'No fee. Network gas only.',
    refuses: 'It does not make the suggested support amount mandatory.',
    live: 'https://www.swaps.pro/create',
    doc: 'https://www.swaps.pro/docs/tools/create-contract',
  },
  {
    slug: 'partners',
    name: 'Partners',
    tagline: 'Take a cut of the swaps you route.',
    body: [
      'Activation with no signup, no API key and nothing to revoke. An integrator names the EVM address they want to be paid at and a fee in basis points; those two values DERIVE a 0xSplits contract holding SwapsPro and the partner at shares that are exactly the two fees. Deploying that contract is the whole activation.',
      'Why it works this way: every venue that carries an integrator fee (0x, CoW, LI.FI) accepts exactly one recipient, so a partner’s bps and SwapsPro’s 30 arrived together in SwapsPro’s own address. Changing whose address the single recipient IS fixes that without asking the venues for anything.',
      'The address is never taken on trust. It is predicted from the configuration, and when something is deployed there its config is read back and compared field by field; a mismatch returns a reason, not a boolean. The split’s owner is the zero address, so it is permanently immutable and one verification lasts forever.',
      'Ceilings: 100 bps by default, 200 bps when the payout address holds a Pro Pass. The split address is derived from the fee actually CHARGED, not the one requested — a capped partner must deploy the capped contract.',
    ],
    signs: 'One 0xSplits deploy, at an address derived from your fee and payout address.',
    cost: 'Network gas for the deploy. The fee itself is additive on top of SwapsPro’s 30 bps.',
    refuses: 'A read that could not complete is reported as “unknown” and the fee goes to SwapsPro — never rendered as “not deployed”.',
    live: 'https://www.swaps.pro/swap',
    doc: 'https://www.swaps.pro/docs/tools/partners',
  },
  {
    slug: 'pro-pass',
    name: 'The Pro Pass',
    tagline: 'A soulbound Base pass that is the whole membership.',
    body: [
      'A soulbound ERC-721 (ERC-5192) on Base at 0x568fcbade475c1f20ed9a5155814eeeadf9c69ef, capped at 100 by the contract, with its artwork in the bytecode. Holding it IS the membership: no account, no session, no database. Paying is minting — one mint() transaction whose value is the price, forwarded to the payout split inside the same transaction so the contract never holds ETH.',
      'The check reads tokenOf(holder), not balanceOf, because the pass NUMBER is a benefit: ids 1 through 100 pay no SwapsPro fee at all on every path where a fee can be dropped. tokenOf returns 0 for a non-holder, so one call answers both questions and 0 can never qualify.',
      'Ownership has three outcomes, not two. A pass waives; no pass charges; a read that FAILED also charges — failing closed on the money. But the UI fails open on the truth: verifyFailed makes it say “could not check” rather than telling a holder they have no pass.',
      'Agents buy it over x402 at /api/pro/x402: 40 USDC on Base, verified and settled through a facilitator, answered with an EIP-712 mint voucher valid for one hour. The agent submits mintWithVoucher(to, deadline, signature) itself and pays its own gas. A replayed voucher reverts — one pass per wallet is enforced on chain.',
    ],
    signs: 'mint() with ETH, or mintWithVoucher() after paying over x402.',
    cost: 'One payment, once. 40 USDC on Base over the x402 path.',
    refuses: 'It is not transferable, it gates nothing, and a replayed voucher reverts.',
    live: 'https://www.swaps.pro/pro',
    doc: 'https://www.swaps.pro/docs/tools/pro-pass',
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);
