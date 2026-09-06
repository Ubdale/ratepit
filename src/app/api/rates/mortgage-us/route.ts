import { NextResponse } from "next/server";

export const revalidate = 3600;

/**
 * Used when FRED is unreachable or no key is configured. The response is
 * flagged `stale` so the UI labels it as an estimate rather than a live rate.
 */
const FALLBACK_RATE = 6.75;

interface MortgageRatePayload {
  /** Average 30-year fixed rate, as a percentage. */
  rate: number;
  /** Observation date from FRED (YYYY-MM-DD), or null when estimated. */
  observedOn: string | null;
  fetchedAt: string;
  series: "MORTGAGE30US";
  source: string;
  stale: boolean;
  message?: string;
}

function estimate(message: string): MortgageRatePayload {
  return {
    rate: FALLBACK_RATE,
    observedOn: null,
    fetchedAt: new Date().toISOString(),
    series: "MORTGAGE30US",
    source: "estimate",
    stale: true,
    message,
  };
}

export async function GET() {
  const key = process.env.FRED_API_KEY;

  if (!key) {
    return NextResponse.json(
      estimate("Live data unavailable - FRED_API_KEY is not configured."),
      { headers: { "Cache-Control": "public, s-maxage=300" } },
    );
  }

  try {
    const endpoint = new URL("https://api.stlouisfed.org/fred/series/observations");
    endpoint.searchParams.set("series_id", "MORTGAGE30US");
    endpoint.searchParams.set("api_key", key);
    endpoint.searchParams.set("file_type", "json");
    endpoint.searchParams.set("sort_order", "desc");
    endpoint.searchParams.set("limit", "1");

    const res = await fetch(endpoint, {
      next: { revalidate },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`FRED responded ${res.status}`);

    const json = (await res.json()) as {
      observations?: Array<{ date?: string; value?: string }>;
    };
    const latest = json.observations?.[0];
    const rate = Number(latest?.value);

    // FRED marks missing observations with ".", which Number() turns into NaN.
    if (!latest || !isFinite(rate) || rate <= 0) {
      return NextResponse.json(
        estimate("Live data unavailable - FRED returned no usable observation."),
        { headers: { "Cache-Control": "public, s-maxage=300" } },
      );
    }

    const payload: MortgageRatePayload = {
      rate,
      observedOn: latest.date ?? null,
      fetchedAt: new Date().toISOString(),
      series: "MORTGAGE30US",
      source: "FRED (Freddie Mac PMMS)",
      stale: false,
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      estimate(`Live data unavailable - ${reason}.`),
      { headers: { "Cache-Control": "public, s-maxage=300" } },
    );
  }
}
