"use client";

import { useRouter } from "next/navigation";
import { useCurrency } from "./CurrencyProvider";
import { CURRENCIES, isCurrencyCode, type CurrencyCode } from "@/lib/currencies";
import { REGIONS, REGION_SLUGS, type Region, type RegionSlug } from "@/lib/regions";
import { formatTimestamp } from "@/lib/format";

/**
 * The one filter bar reused by every calculator: currency, region, and an
 * optional secondary currency for side-by-side conversion.
 */
export function FilterBar({
  region,
  /** Base route the region picker navigates within, e.g. "/mortgage-calculator". */
  basePath,
}: {
  region: Region;
  basePath: string;
}) {
  const router = useRouter();
  const {
    code, setCurrency, compareCode, setCompareCode,
    rates, ratesLoading, ratesError, refreshRates,
  } = useCurrency();

  const onRegionChange = (slug: RegionSlug) => {
    // Region pages are real routes so they can rank independently.
    router.push(slug === "global" ? basePath : `${basePath}/${slug}`);
  };

  const stamp = rates?.fetchedAt ? formatTimestamp(rates.fetchedAt) : "";

  return (
    <div className="card mb-6 !p-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Currency
          </span>
          <select
            value={code}
            onChange={(e) => {
              if (isCurrencyCode(e.target.value)) setCurrency(e.target.value);
            }}
            className="field-input min-w-[11rem] py-1.5"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Region</span>
          <select
            value={region.slug}
            onChange={(e) => onRegionChange(e.target.value as RegionSlug)}
            className="field-input min-w-[11rem] py-1.5"
          >
            {REGION_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {REGIONS[slug].short}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Also show in
          </span>
          <select
            value={compareCode ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setCompareCode(isCurrencyCode(v) ? (v as CurrencyCode) : null);
            }}
            className="field-input min-w-[11rem] py-1.5"
          >
            <option value="">Off</option>
            {CURRENCIES.filter((c) => c.code !== code).map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.label}
              </option>
            ))}
          </select>
        </label>

        <div className="ml-auto text-right text-xs leading-relaxed text-slate-500">
          {ratesLoading ? (
            <span>Loading exchange rates&hellip;</span>
          ) : ratesError || rates?.stale ? (
            <span className="text-amber-400/90">
              Estimated rates - live data unavailable
            </span>
          ) : stamp ? (
            <span>
              Rates updated: <span className="text-slate-400">{stamp}</span>
            </span>
          ) : null}
          {rates?.sources?.length ? (
            <div className="text-[0.7rem] text-slate-600">via {rates.sources.join(", ")}</div>
          ) : null}
          <button
            type="button"
            onClick={refreshRates}
            className="mt-0.5 rounded text-[0.7rem] text-brand-400 underline-offset-2 hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>

      <p className="mt-3 border-t border-ink-800 pt-3 text-xs text-slate-600">
        Region presets change the default term, rate and fee fields to match local lending
        conventions. Every value stays editable.
      </p>
    </div>
  );
}
