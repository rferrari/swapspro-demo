/**
 * Sending a rate-limit grant, across the header rename.
 *
 * The grant from /access is presented as a header. That header is being renamed
 * from `X-SwapPro-Access` to `X-SwapsPro-Access`, so any client that hard-codes
 * the string has to be redeployed in lockstep with the API. Nothing here does:
 * the name comes from `ACCESS_HEADER` in config.ts.
 *
 * The API also accepts `Authorization: Bearer <token>`, which is unaffected by
 * the rename and already allowed by CORS — so it is what `accessFetch` sends
 * from a browser.
 */

import { ACCESS_HEADER, ACCESS_HEADER_NEXT } from './config';

export type Transport = 'browser' | 'server';

/**
 * Headers for a grant.
 *
 * - `browser` (default): `Authorization: Bearer` only. Rename-proof, and needs
 *   no CORS change — a custom header name the server does not list in
 *   `Access-Control-Allow-Headers` fails the preflight.
 * - `server`: both header names, since there is no preflight outside a browser.
 *   Sending both is safe in either direction of the rename: an endpoint ignores
 *   the name it does not know, so the same build works before and after.
 */
export function accessHeaders(
  token: string | undefined,
  transport: Transport = 'browser'
): Record<string, string> {
  if (!token) return {};
  if (transport === 'browser') return { Authorization: `Bearer ${token}` };
  return {
    Authorization: `Bearer ${token}`,
    [ACCESS_HEADER]: token,
    [ACCESS_HEADER_NEXT]: token,
  };
}

/**
 * A `fetch` that attaches the grant to every call — drop it straight into the
 * SDK, which takes a custom fetch precisely so callers can do this.
 *
 *   const swaps = new SwapsPro({ partner, fetch: accessFetch(token, 'server') });
 *
 * Without a token it is `fetch` unchanged, so it is safe to wire in before you
 * have a grant — and most integrations never need one: quoting is free at the
 * default ceiling.
 */
export function accessFetch(
  token: string | undefined,
  transport: Transport = 'browser'
): typeof globalThis.fetch {
  if (!token) return globalThis.fetch;
  const extra = accessHeaders(token, transport);
  return (input, init) =>
    globalThis.fetch(input, {
      ...init,
      headers: { ...(init?.headers as Record<string, string>), ...extra },
    });
}
