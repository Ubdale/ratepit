"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import {
  CURRENCIES, detectCurrency, getCurrency, isCurrencyCode,
  type Currency, type CurrencyCode,
} from "@/lib/currencies";
import { formatCurrency } from "@/lib/format";

const STORAGE_KEY = "ratepit:currency";
const REGION_STORAGE_KEY = "ratepit:region";
/** Client-side cache lifetime for FX rates. */
const RATE_TTL_MS = 60 * 60 * 1000;
const RATE_CACHE_KEY = "ratepit:fx";

interface RateSnapshot {
  base: CurrencyCode;
  rates: Record<string, number>;
  fetchedAt: string;
  sources: string[];
  stale: boolean;
}

interface CurrencyContextValue {
  currency: Currency;
  code: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  available: Currency[];
  /** True until the stored/detected preference has been applied on the client. */
  ready: boolean;
  /** Formats in the active currency. */
  format: (value: number, decimals?: number) => string;
  /** Converts from the active currency into `target`. Null when no rate is known. */
  convert: (value: number, target: CurrencyCode) => number | null;
  /** Formatted conversion, e.g. "= 41,500 INR". Null when unavailable. */
  convertFormatted: (value: number, target: CurrencyCode, decimals?: number) => string | null;
  rates: RateSnapshot | null;
  ratesLoading: boolean;
  /** Set when the FX fetch failed outright. */
  ratesError: string | null;
  refreshRates: () => void;
  /** Secondary currency the user has pinned for side-by-side comparison. */
  compareCode: CurrencyCode | null;
  setCompareCode: (code: CurrencyCode | null) => void;
  /** True once the user has picked a currency themselves. */
  hasExplicitChoice: boolean;
  /**
   * Applied by region pages: switches the display currency to the local one,
   * but only while the user has not chosen for themselves.
   */
  suggestCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readCache(): RateSnapshot | null {
  try {
    const raw = localStorage.getItem(RATE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RateSnapshot;
    if (!parsed?.fetchedAt || !parsed.rates) return null;
    if (Date.now() - new Date(parsed.fetchedAt).getTime() > RATE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function CurrencyProvider({
  children,
  initialCurrency,
}: {
  children: React.ReactNode;
  /** Region pages seed their local currency; the stored preference still wins. */
  initialCurrency?: CurrencyCode;
}) {
  const [code, setCode] = useState<CurrencyCode>(initialCurrency ?? "USD");
  const [compareCode, setCompareCodeState] = useState<CurrencyCode | null>(null);
  const [ready, setReady] = useState(false);
  const [hasExplicitChoice, setHasExplicitChoice] = useState(false);
  const [rates, setRates] = useState<RateSnapshot | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  // Resolve the preference on the client only, so the server render stays
  // deterministic and we do not trip a hydration mismatch.
  useEffect(() => {
    let resolved: CurrencyCode | undefined;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isCurrencyCode(stored)) {
        resolved = stored;
        setHasExplicitChoice(true);
      }
    } catch {
      // localStorage can be blocked entirely - fall through to detection.
    }
    if (!resolved) resolved = initialCurrency ?? detectCurrency() ?? "USD";
    setCode(resolved);

    try {
      const storedCompare = localStorage.getItem(REGION_STORAGE_KEY);
      if (isCurrencyCode(storedCompare)) setCompareCodeState(storedCompare);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [initialCurrency]);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCode(next);
    setHasExplicitChoice(true);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* preference simply will not persist */
    }
  }, []);

  // A region route is a strong hint, but never overrides a deliberate choice.
  const suggestCurrency = useCallback((next: CurrencyCode) => {
    setCode((current) => (hasExplicitChoice ? current : next));
  }, [hasExplicitChoice]);

  const setCompareCode = useCallback((next: CurrencyCode | null) => {
    setCompareCodeState(next);
    try {
      if (next) localStorage.setItem(REGION_STORAGE_KEY, next);
      else localStorage.removeItem(REGION_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Rates are always fetched USD-based and converted locally, so switching the
  // display currency never triggers another network call.
  useEffect(() => {
    let cancelled = false;

    const cached = nonce === 0 ? readCache() : null;
    if (cached) {
      setRates(cached);
      return;
    }

    setRatesLoading(true);
    setRatesError(null);

    fetch("/api/rates/currency?base=USD")
      .then((res) => {
        if (!res.ok) throw new Error(`rates ${res.status}`);
        return res.json();
      })
      .then((json: RateSnapshot) => {
        if (cancelled) return;
        setRates(json);
        try {
          localStorage.setItem(RATE_CACHE_KEY, JSON.stringify(json));
        } catch {
          /* ignore */
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setRatesError(err instanceof Error ? err.message : "Rate lookup failed");
      })
      .finally(() => {
        if (!cancelled) setRatesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const refreshRates = useCallback(() => {
    try {
      localStorage.removeItem(RATE_CACHE_KEY);
    } catch {
      /* ignore */
    }
    setNonce((n) => n + 1);
  }, []);

  const convert = useCallback(
    (value: number, target: CurrencyCode): number | null => {
      if (!isFinite(value)) return null;
      if (target === code) return value;
      const table = rates?.rates;
      if (!table) return null;
      const from = table[code];
      const to = table[target];
      if (!from || !to || from <= 0) return null;
      return (value / from) * to;
    },
    [code, rates],
  );

  const value = useMemo<CurrencyContextValue>(() => {
    const currency = getCurrency(code);
    return {
      currency,
      code,
      setCurrency,
      available: CURRENCIES,
      ready,
      format: (v: number, decimals = 0) => formatCurrency(v, code, { decimals }),
      convert,
      convertFormatted: (v: number, target: CurrencyCode, decimals = 0) => {
        const converted = convert(v, target);
        if (converted === null) return null;
        return formatCurrency(converted, target, { decimals });
      },
      rates,
      ratesLoading,
      ratesError,
      refreshRates,
      compareCode,
      setCompareCode,
      hasExplicitChoice,
      suggestCurrency,
    };
  }, [
    code, setCurrency, ready, convert, rates, ratesLoading,
    ratesError, refreshRates, compareCode, setCompareCode,
    hasExplicitChoice, suggestCurrency,
  ]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside a CurrencyProvider");
  return ctx;
}

/**
 * Drop this on a region route to default the display currency to the local one.
 * Renders nothing and defers to any currency the user has already picked.
 */
export function RegionCurrencySync({ currency }: { currency: CurrencyCode }) {
  const { ready, hasExplicitChoice, suggestCurrency } = useCurrency();

  useEffect(() => {
    if (ready && !hasExplicitChoice) suggestCurrency(currency);
  }, [ready, hasExplicitChoice, suggestCurrency, currency]);

  return null;
}
