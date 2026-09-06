"use client";

import { useRouter } from "next/navigation";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import RefreshIcon from "@mui/icons-material/Refresh";
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
  /** Tools without per-region routes hide the region picker entirely. */
  showRegion = true,
}: {
  region: Region;
  basePath: string;
  showRegion?: boolean;
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
      <div className="flex flex-wrap items-center gap-4">
        <FormControl size="small" className="w-full sm:w-52">
          <InputLabel id="rp-currency">Currency</InputLabel>
          <Select
            labelId="rp-currency"
            label="Currency"
            value={code}
            onChange={(e) => {
              if (isCurrencyCode(e.target.value)) setCurrency(e.target.value);
            }}
          >
            {CURRENCIES.map((c) => (
              <MenuItem key={c.code} value={c.code}>
                <span className="font-mono">{c.symbol}</span>
                <span className="ml-2">{c.code}</span>
                <span className="ml-2 text-ink-faint">{c.label}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {showRegion ? (
          <FormControl size="small" className="w-full sm:w-52">
            <InputLabel id="rp-region">Region</InputLabel>
            <Select
              labelId="rp-region"
              label="Region"
              value={region.slug}
              onChange={(e) => {
                // Region pages are real routes so they can rank independently.
                const slug = e.target.value as RegionSlug;
                router.push(slug === "global" ? basePath : `${basePath}/${slug}`);
              }}
            >
              {REGION_SLUGS.map((slug) => (
                <MenuItem key={slug} value={slug}>
                  {REGIONS[slug].short}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null}

        <FormControl size="small" className="w-full sm:w-52">
          <InputLabel id="rp-compare">Also show in</InputLabel>
          <Select
            labelId="rp-compare"
            label="Also show in"
            value={compareCode ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setCompareCode(isCurrencyCode(v) ? (v as CurrencyCode) : null);
            }}
          >
            <MenuItem value="">Off</MenuItem>
            {CURRENCIES.filter((c) => c.code !== code).map((c) => (
              <MenuItem key={c.code} value={c.code}>
                <span className="font-mono">{c.symbol}</span>
                <span className="ml-2">{c.code}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <Chip
            size="small"
            variant="outlined"
            color={degraded ? "warning" : "default"}
            label={
              ratesLoading
                ? "Loading rates"
                : degraded
                  ? "Estimated rates"
                  : stamp
                    ? `Rates ${stamp}`
                    : "Rates ready"
            }
            icon={
              <span
                aria-hidden
                className={`!ml-2.5 h-1.5 w-1.5 rounded-pill ${
                  ratesLoading ? "bg-ink-ghost" : degraded ? "bg-coral-400" : "bg-citron-400"
                }`}
              />
            }
          />
          <Button
            size="small"
            variant="outlined"
            onClick={refreshRates}
            startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      <p className="mt-5 border-t border-line-soft pt-4 text-xs text-ink-ghost">
        {degraded
          ? "Live exchange rates are unavailable, so conversions use a stored estimate. "
          : ""}
        {showRegion
          ? "Region presets change the default term, rate and fee fields to match local lending conventions. Every value stays editable."
          : "Every value stays editable - the defaults are a starting point, not a verdict."}
        {rates?.sources?.length ? ` Rates via ${rates.sources.join(", ")}.` : ""}
      </p>
    </div>
  );
}
