import { getCurrency, type CurrencyCode } from "./currencies";

/**
 * Currency formatting. We format with the currency's own locale so INR and PKR
 * get lakh/crore digit grouping while USD and EUR get the western grouping.
 */
export function formatCurrency(
  value: number,
  code: CurrencyCode,
  opts: { decimals?: number; compact?: boolean } = {},
): string {
  if (!isFinite(value)) return "-";
  const currency = getCurrency(code);
  const decimals = opts.decimals ?? 0;
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation: opts.compact ? "compact" : "standard",
    }).format(value);
  } catch {
    return `${currency.symbol}${formatNumber(value, decimals)}`;
  }
}

export function formatNumber(value: number, decimals = 0, locale = "en-US"): string {
  if (!isFinite(value)) return "-";
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  if (!isFinite(value)) return "-";
  return `${formatNumber(value, decimals)}%`;
}

/** "5 yr 4 mo" from a month count. */
export function formatMonths(months: number): string {
  if (!isFinite(months) || months <= 0) return "-";
  const years = Math.floor(months / 12);
  const rem = Math.round(months % 12);
  if (years === 0) return `${rem} mo`;
  if (rem === 0) return `${years} yr`;
  return `${years} yr ${rem} mo`;
}

export function formatDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
  } catch {
    return date.toISOString().slice(0, 7);
  }
}

/** "2 minutes ago" style stamp for the live-rate freshness line. */
export function formatTimestamp(iso: string | number | Date | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

/** Parses a user-typed amount, tolerating grouping separators and symbols. */
export function parseAmount(raw: string): number {
  if (typeof raw !== "string") return NaN;
  const cleaned = raw.replace(/[^0-9.\-]/g, "");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return NaN;
  return Number(cleaned);
}

export function clamp(value: number, min: number, max: number): number {
  if (!isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}
