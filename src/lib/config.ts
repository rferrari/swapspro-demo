/**
 * Every value a fork needs to change lives here.
 *
 * `partner` is attribution and nothing more — there is no signup, no API key
 * and no integrator database behind it. Pick any string up to 64 characters.
 */

export const PARTNER =
  process.env.NEXT_PUBLIC_SWAPSPRO_PARTNER ?? 'swapspro-demo';

/** Additive partner fee in basis points. Capped at 100 (1%) by the API. */
export const PARTNER_FEE_BPS = Number(
  process.env.NEXT_PUBLIC_SWAPSPRO_FEE_BPS ?? 0
);

/** Base URL of the public HTTP API. No key, CORS open. */
export const API_BASE = 'https://www.swaps.pro/api/sdk/v1';

/** The SwapsPro app, for docs links and the widget embed. */
export const SITE = 'https://www.swaps.pro';

/**
 * A read-only address used for demo quotes. Quoting is free and signs nothing,
 * so any well-formed address works — the venue just builds the tx for it.
 */
export const DEMO_ADDRESS = '0x21c9a94AF76B59b171b32fD125A4edF0e9A2Ad3e';

/** A demo BTC destination, for the cross-chain deposit-route example. */
export const DEMO_BTC_ADDRESS = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';

/**
 * The header carrying a rate-limit grant from /access.
 *
 * MIGRATION: this is being renamed to `X-SwapsPro-Access`. Everything in this
 * repo that names the header — code, samples and prose — reads it from here, so
 * the switch is this one line.
 *
 * Do not flip it until the API advertises the new name in its CORS
 * `Access-Control-Allow-Headers`. A browser sends a preflight for any custom
 * header, and a name the server does not list is blocked before the request
 * leaves. Server first, clients second. See src/lib/access.ts.
 */
export const ACCESS_HEADER = 'X-SwapPro-Access';

/** What ACCESS_HEADER becomes once the rename ships. */
export const ACCESS_HEADER_NEXT = 'X-SwapsPro-Access';
