"use client";

import { useEffect, useState } from "react";

const CACHE_KEY = "ratepit:us-mortgage-rate";
const TTL_MS = 60 * 60 * 1000;

export interface MortgageRate {
  rate: number;
  observedOn: string | null;
  fetchedAt: string;
  source: string;
  /** True when the value is our fallback estimate rather than a live reading. */
  stale: boolean;
  message?: string;
}

interface State {
  data: MortgageRate | null;
  loading: boolean;
  error: string | null;
}

/**
 * Reads the current US 30-year average via our FRED proxy. Only called where a
 * live source actually exists - other regions stay on manual entry rather than
 * being shown an invented number.
 */
export function useMortgageRate(enabled: boolean): State {
  const [state, setState] = useState<State>({ data: null, loading: enabled, error: null });

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let cancelled = false;

    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as MortgageRate;
        if (cached?.fetchedAt && Date.now() - new Date(cached.fetchedAt).getTime() < TTL_MS) {
          setState({ data: cached, loading: false, error: null });
          return;
        }
      }
    } catch {
      // Unreadable cache is not worth recovering - just refetch.
    }

    fetch("/api/rates/mortgage-us")
      .then((res) => {
        if (!res.ok) throw new Error(`rate lookup failed (${res.status})`);
        return res.json() as Promise<MortgageRate>;
      })
      .then((data) => {
        if (cancelled) return;
        setState({ data, loading: false, error: null });
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch {
          /* ignore */
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : "Rate lookup failed",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return state;
}
