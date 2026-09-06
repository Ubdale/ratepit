export type CurrencyCode =
  | "USD" | "EUR" | "GBP" | "INR" | "PKR" | "AED" | "CAD" | "AUD" | "SGD";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
  /** Currencies that conventionally group digits in lakh/crore style. */
  indianGrouping?: boolean;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$",   label: "US Dollar",         locale: "en-US" },
  { code: "EUR", symbol: "€",   label: "Euro",              locale: "de-DE" },
  { code: "GBP", symbol: "£",   label: "British Pound",     locale: "en-GB" },
  { code: "INR", symbol: "₹",   label: "Indian Rupee",      locale: "en-IN", indianGrouping: true },
  { code: "PKR", symbol: "Rs",  label: "Pakistani Rupee",   locale: "en-PK", indianGrouping: true },
  { code: "AED", symbol: "AED", label: "UAE Dirham",        locale: "en-AE" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar",   locale: "en-CA" },
  { code: "AUD", symbol: "A$",  label: "Australian Dollar", locale: "en-AU" },
  { code: "SGD", symbol: "S$",  label: "Singapore Dollar",  locale: "en-SG" },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));

export function getCurrency(code: CurrencyCode): Currency {
  return BY_CODE.get(code) ?? CURRENCIES[0];
}

export function isCurrencyCode(v: unknown): v is CurrencyCode {
  return typeof v === "string" && BY_CODE.has(v as CurrencyCode);
}

/** Maps a region/country subtag to the currency we default to for it. */
const REGION_CURRENCY: Record<string, CurrencyCode> = {
  US: "USD", IN: "INR", PK: "PKR", GB: "GBP", AE: "AED",
  CA: "CAD", AU: "AUD", SG: "SGD", NZ: "AUD",
  DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", IE: "EUR",
  BE: "EUR", AT: "EUR", PT: "EUR", FI: "EUR", GR: "EUR",
};

/**
 * Best-effort currency guess from the browser locale. Returns undefined when
 * we cannot map confidently, so the caller can fall back to its own default.
 */
export function detectCurrency(): CurrencyCode | undefined {
  if (typeof navigator === "undefined") return undefined;
  const tags = [navigator.language, ...(navigator.languages ?? [])].filter(Boolean);
  for (const tag of tags) {
    try {
      const region = new Intl.Locale(tag).maximize().region;
      if (region && REGION_CURRENCY[region]) return REGION_CURRENCY[region];
    } catch {
      // Intl.Locale is unavailable or the tag is malformed - try the next one.
      const parts = String(tag).split("-");
      const guess = parts[1]?.toUpperCase();
      if (guess && REGION_CURRENCY[guess]) return REGION_CURRENCY[guess];
    }
  }
  return undefined;
}
