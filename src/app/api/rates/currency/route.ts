import { NextResponse } from "next/server";
import { CURRENCY_CODES, isCurrencyCode, type CurrencyCode } from "@/lib/currencies";

export const revalidate = 3600;

/**
 * Last-resort rates, used only when every upstream call fails. These are
 * deliberately rough - the response is flagged `stale` so the UI can say so
 * rather than passing them off as live.
 */
const FALLBACK_USD: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.5,
  PKR: 278,
  AED: 3.6725,
  CAD: 1.36,
  AUD: 1.52,
  SGD: 1.35,
};

interface RatesPayload {
  base: CurrencyCode;
  rates: Record<string, number>;
  date: string;
  fetchedAt: string;
  /** Which upstreams actually answered. */
  sources: string[];
  /** True when any value came from the hardcoded table. */
  stale: boolean;
}

function rebase(usdRates: Record<CurrencyCode, number>, base: CurrencyCode) {
  const perBase = usdRates[base];
  const out: Record<string, number> = {};
  for (const code of CURRENCY_CODES) {
    const v = usdRates[code];
    out[code] = perBase > 0 && isFinite(v) ? v / perBase : FALLBACK_USD[code] / FALLBACK_USD[base];
  }
  return out;
}

/** ECB-backed, no key. Does not cover PKR or AED. */
async function fetchFrankfurter(): Promise<Partial<Record<CurrencyCode, number>>> {
  const symbols = CURRENCY_CODES.filter((c) => c !== "USD").join(",");
  const res = await fetch(
    `https://api.frankfurter.app/latest?from=USD&to=${symbols}`,
    { next: { revalidate }, signal: AbortSignal.timeout(6000) },
  );
  if (!res.ok) throw new Error(`frankfurter ${res.status}`);
  const json = (await res.json()) as { rates?: Record<string, number> };
  const out: Partial<Record<CurrencyCode, number>> = { USD: 1 };
  for (const [code, value] of Object.entries(json.rates ?? {})) {
    if (isCurrencyCode(code) && typeof value === "number" && value > 0) out[code] = value;
  }
  return out;
}

/**
 * Secondary source for the currencies the ECB does not publish (PKR, AED).
 * Also key-free.
 */
async function fetchOpenErApi(): Promise<Partial<Record<CurrencyCode, number>>> {
  const res = await fetch("https://open.er-api.com/v6/latest/USD", {
    next: { revalidate },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`er-api ${res.status}`);
  const json = (await res.json()) as { rates?: Record<string, number> };
  const out: Partial<Record<CurrencyCode, number>> = {};
  for (const [code, value] of Object.entries(json.rates ?? {})) {
    if (isCurrencyCode(code) && typeof value === "number" && value > 0) out[code] = value;
  }
  return out;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const baseParam = url.searchParams.get("base");
  const base: CurrencyCode = isCurrencyCode(baseParam) ? baseParam : "USD";

  const [primary, secondary] = await Promise.allSettled([fetchFrankfurter(), fetchOpenErApi()]);

  const merged: Partial<Record<CurrencyCode, number>> = {};
  const sources: string[] = [];

  // Frankfurter wins where it has coverage; er-api fills the gaps.
  if (secondary.status === "fulfilled") {
    Object.assign(merged, secondary.value);
    sources.push("open.er-api.com");
  }
  if (primary.status === "fulfilled") {
    Object.assign(merged, primary.value);
    sources.push("frankfurter.app (ECB)");
  }

  let stale = false;
  const usdRates = {} as Record<CurrencyCode, number>;
  for (const code of CURRENCY_CODES) {
    const value = merged[code];
    if (typeof value === "number" && value > 0) {
      usdRates[code] = value;
    } else {
      usdRates[code] = FALLBACK_USD[code];
      stale = true;
    }
  }

  const payload: RatesPayload = {
    base,
    rates: rebase(usdRates, base),
    date: new Date().toISOString().slice(0, 10),
    fetchedAt: new Date().toISOString(),
    sources: sources.length ? sources : ["fallback table"],
    stale,
  };

  return NextResponse.json(payload, {
    headers: {
      // Serve stale copies briefly rather than hammering upstream on a miss.
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
