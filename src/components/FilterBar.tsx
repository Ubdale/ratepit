"use client";

import { useRouter } from "next/navigation";
import { useCurrency } from "./CurrencyProvider";
import { CURRENCIES, isCurrencyCode, type CurrencyCode } from "@/lib/currencies";
import { REGIONS, REGION_SLUGS, type Region, type RegionSlug } from "@/lib/regions";
import { formatTimestamp } from "@/lib/format";

function Select({
  label, value, onChange, children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-none">
      <span className="eyebrow">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input h-11 min-w-0 py-0 pr-8 text-sm sm:min-w-[12rem]"
      >
        {children}
      </select>
    </label>
  );
}

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

  const stamp = rates?.fetchedAt ? formatTimestamp(rates.fetchedAt) : "";
  const degraded = Boolean(ratesError) || Boolean(rates?.stale);

  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-end gap-4">
        <Select
          label="Currency"
          value={code}
          onChange={(v) => {
            if (isCurrencyCode(v)) setCurrency(v);
          }}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} &mdash; {c.label}
            </option>
          ))}
        </Select>

        <Select
          label="Region"
          value={region.slug}
          onChange={(v) => {
            // Region pages are real routes so they can rank independently.
            const slug = v as RegionSlug;
            router.push(slug === "global" ? basePath : `${basePath}/${slug}`);
          }}
        >
          {REGION_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {REGIONS[slug].short}
            </option>
          ))}
        </Select>

        <Select
          label="Also show in"
          value={compareCode ?? ""}
          onChange={(v) => setCompareCode(isCurrencyCode(v) ? (v as CurrencyCode) : null)}
        >
          <option value="">Off</option>
          {CURRENCIES.filter((c) => c.code !== code).map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} &mdash; {c.label}
            </option>
          ))}
        </Select>

        <div className="ml-auto flex items-center gap-3 text-xs">
          <span
            aria-hidden
            className={`h-2 w-2 shrink-0 rounded-pill ${
              ratesLoading ? "bg-ink-ghost" : degraded ? "bg-coral-400" : "bg-citron-400"
            }`}
          />
          <div className="leading-relaxed">
            {ratesLoading ? (
              <span className="text-ink-faint">Loading exchange rates&hellip;</span>
            ) : degraded ? (
              <span className="text-coral-300">Estimated rates &mdash; live data unavailable</span>
            ) : stamp ? (
              <span className="text-ink-faint">
                Rates updated <span className="figure text-ink-muted">{stamp}</span>
              </span>
            ) : null}
            {rates?.sources?.length ? (
              <div className="text-ink-ghost">via {rates.sources.join(", ")}</div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={refreshRates}
            className="chip !px-4 !text-xs"
          >
            Refresh
          </button>
        </div>
      </div>

      <p className="mt-5 border-t border-line-soft pt-4 text-xs text-ink-ghost">
        Region presets change the default term, rate and fee fields to match local lending
        conventions. Every value stays editable.
      </p>
    </div>
  );
}
