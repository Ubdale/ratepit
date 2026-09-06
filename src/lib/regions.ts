import type { CurrencyCode } from "./currencies";

export type RegionSlug =
  | "global" | "usa" | "uk" | "india" | "pakistan" | "uae"
  | "canada" | "australia" | "singapore" | "eurozone";

export interface MortgageRegionConfig {
  /** Term options offered in the term selector, in years. */
  termOptions: number[];
  defaultTermYears: number;
  defaultRatePct: number;
  defaultDownPaymentPct: number;
  /** Annual property tax as % of home value. Hidden when showPropertyTax is false. */
  propertyTaxPct: number;
  showPropertyTax: boolean;
  /** PMI / lender's mortgage insurance toggle. */
  showPmi: boolean;
  pmiPct: number;
  /** Upfront processing fee as % of loan - the South Asia / Gulf convention. */
  showProcessingFee: boolean;
  processingFeePct: number;
  showHoa: boolean;
  hoaLabel: string;
  annualInsurance: number;
  /** Region-specific caveat rendered under the inputs. */
  note?: string;
  /** True only where we have a live rate feed. */
  hasLiveRate: boolean;
}

export interface EmiRegionConfig {
  defaultRatePct: number;
  defaultTermYears: number;
  defaultAmount: number;
  termOptions: number[];
  showProcessingFee: boolean;
  processingFeePct: number;
  note?: string;
}

export interface Region {
  slug: RegionSlug;
  /** Country name as used in prose and page titles. */
  name: string;
  /** Short display label for the region picker. */
  short: string;
  currency: CurrencyCode;
  /** ISO country code. Undefined for the global page. */
  country?: string;
  emi: EmiRegionConfig;
  mortgage: MortgageRegionConfig;
  /** What a home loan is usually called locally. */
  mortgageTerm: string;
}

const baseMortgage: MortgageRegionConfig = {
  termOptions: [10, 15, 20, 25, 30],
  defaultTermYears: 25,
  defaultRatePct: 6.5,
  defaultDownPaymentPct: 20,
  propertyTaxPct: 0,
  showPropertyTax: false,
  showPmi: false,
  pmiPct: 0.5,
  showProcessingFee: false,
  processingFeePct: 1,
  showHoa: false,
  hoaLabel: "Monthly HOA / service charge",
  annualInsurance: 0,
  hasLiveRate: false,
};

const baseEmi: EmiRegionConfig = {
  defaultRatePct: 10,
  defaultTermYears: 5,
  defaultAmount: 25000,
  termOptions: [1, 2, 3, 5, 7, 10],
  showProcessingFee: false,
  processingFeePct: 1,
};

export const REGIONS: Record<RegionSlug, Region> = {
  global: {
    slug: "global",
    name: "Worldwide",
    short: "Global",
    currency: "USD",
    mortgageTerm: "Mortgage",
    emi: { ...baseEmi },
    mortgage: { ...baseMortgage },
  },

  usa: {
    slug: "usa",
    name: "the USA",
    short: "United States",
    currency: "USD",
    country: "US",
    mortgageTerm: "Mortgage",
    emi: { ...baseEmi, defaultRatePct: 11.5, defaultAmount: 25000 },
    mortgage: {
      ...baseMortgage,
      termOptions: [10, 15, 20, 30],
      defaultTermYears: 30,
      defaultRatePct: 6.75,
      propertyTaxPct: 1.1,
      showPropertyTax: true,
      showPmi: true,
      pmiPct: 0.5,
      showHoa: true,
      annualInsurance: 1800,
      hasLiveRate: true,
      note: "PMI is normally required below a 20% down payment and drops off once you reach 20% equity. Property tax varies widely by state and county - 1.1% is a national average, not a quote.",
    },
  },

  uk: {
    slug: "uk",
    name: "the UK",
    short: "United Kingdom",
    currency: "GBP",
    country: "GB",
    mortgageTerm: "Mortgage",
    emi: { ...baseEmi, defaultRatePct: 9.5, defaultAmount: 15000 },
    mortgage: {
      ...baseMortgage,
      termOptions: [15, 20, 25, 30, 35],
      defaultTermYears: 25,
      defaultRatePct: 5.2,
      defaultDownPaymentPct: 15,
      showPropertyTax: false,
      annualInsurance: 300,
      note: "UK mortgages are usually quoted on a 2- or 5-year fixed deal that then reverts to a variable rate, so treat a full-term figure as an illustration. Stamp Duty Land Tax is charged separately on purchase and is not included above.",
    },
  },

  india: {
    slug: "india",
    name: "India",
    short: "India",
    currency: "INR",
    country: "IN",
    mortgageTerm: "Home Loan",
    emi: {
      ...baseEmi,
      defaultRatePct: 10.5,
      defaultAmount: 500000,
      defaultTermYears: 5,
      showProcessingFee: true,
      processingFeePct: 1,
    },
    mortgage: {
      ...baseMortgage,
      termOptions: [5, 10, 15, 20],
      defaultTermYears: 20,
      defaultRatePct: 8.6,
      defaultDownPaymentPct: 20,
      showPropertyTax: false,
      showProcessingFee: true,
      processingFeePct: 0.5,
      note: "Indian home loans are typically floating-rate and linked to an external benchmark, so your EMI can change over the term. Lenders usually charge a processing fee of roughly 0.25-1% of the sanctioned amount.",
    },
  },

  pakistan: {
    slug: "pakistan",
    name: "Pakistan",
    short: "Pakistan",
    currency: "PKR",
    country: "PK",
    mortgageTerm: "Home Loan",
    emi: {
      ...baseEmi,
      defaultRatePct: 20,
      defaultAmount: 1000000,
      defaultTermYears: 5,
      showProcessingFee: true,
      processingFeePct: 1,
    },
    mortgage: {
      ...baseMortgage,
      termOptions: [5, 10, 15, 20],
      defaultTermYears: 15,
      defaultRatePct: 19,
      defaultDownPaymentPct: 25,
      showPropertyTax: false,
      showProcessingFee: true,
      processingFeePct: 1,
      note: "Rates track the SBP policy rate and move frequently. Islamic (Shariah-compliant) home finance is priced as rent plus a profit rate rather than interest, but the monthly instalment maths works out the same way.",
    },
  },

  uae: {
    slug: "uae",
    name: "the UAE",
    short: "United Arab Emirates",
    currency: "AED",
    country: "AE",
    mortgageTerm: "Mortgage",
    emi: { ...baseEmi, defaultRatePct: 8, defaultAmount: 100000, showProcessingFee: true },
    mortgage: {
      ...baseMortgage,
      termOptions: [5, 10, 15, 20, 25],
      defaultTermYears: 25,
      defaultRatePct: 4.5,
      defaultDownPaymentPct: 20,
      showPropertyTax: false,
      showProcessingFee: true,
      processingFeePct: 1,
      showHoa: true,
      hoaLabel: "Monthly service charge",
      note: "Expat buyers are generally capped at 80% loan-to-value on a first property. There is no annual property tax, but expect a one-off DLD transfer fee of around 4% plus bank arrangement fees.",
    },
  },

  canada: {
    slug: "canada",
    name: "Canada",
    short: "Canada",
    currency: "CAD",
    country: "CA",
    mortgageTerm: "Mortgage",
    emi: { ...baseEmi, defaultRatePct: 10, defaultAmount: 25000 },
    mortgage: {
      ...baseMortgage,
      termOptions: [15, 20, 25, 30],
      defaultTermYears: 25,
      defaultRatePct: 5.4,
      propertyTaxPct: 1.0,
      showPropertyTax: true,
      showPmi: true,
      pmiPct: 0.6,
      annualInsurance: 1500,
      note: "CMHC mortgage default insurance is mandatory below a 20% down payment. Canadian mortgages are conventionally compounded semi-annually; this calculator uses monthly compounding, so expect a small difference against a lender quote.",
    },
  },

  australia: {
    slug: "australia",
    name: "Australia",
    short: "Australia",
    currency: "AUD",
    country: "AU",
    mortgageTerm: "Home Loan",
    emi: { ...baseEmi, defaultRatePct: 9.5, defaultAmount: 30000 },
    mortgage: {
      ...baseMortgage,
      termOptions: [15, 20, 25, 30],
      defaultTermYears: 30,
      defaultRatePct: 6.1,
      showPropertyTax: false,
      showPmi: true,
      pmiPct: 0.6,
      annualInsurance: 1600,
      note: "Lenders Mortgage Insurance (LMI) usually applies below a 20% deposit and is often capitalised into the loan. Council rates and strata fees are charged separately.",
    },
  },

  singapore: {
    slug: "singapore",
    name: "Singapore",
    short: "Singapore",
    currency: "SGD",
    country: "SG",
    mortgageTerm: "Home Loan",
    emi: { ...baseEmi, defaultRatePct: 6, defaultAmount: 30000 },
    mortgage: {
      ...baseMortgage,
      termOptions: [10, 15, 20, 25, 30],
      defaultTermYears: 25,
      defaultRatePct: 3.5,
      defaultDownPaymentPct: 25,
      showPropertyTax: false,
      showHoa: true,
      hoaLabel: "Monthly maintenance fee",
      note: "Loan-to-value is capped by MAS rules and the Total Debt Servicing Ratio limits repayments to 55% of gross monthly income. Buyer's Stamp Duty (and ABSD, where it applies) is charged on purchase and is not included above.",
    },
  },

  eurozone: {
    slug: "eurozone",
    name: "the Eurozone",
    short: "Eurozone",
    currency: "EUR",
    country: "EU",
    mortgageTerm: "Mortgage",
    emi: { ...baseEmi, defaultRatePct: 7.5, defaultAmount: 20000 },
    mortgage: {
      ...baseMortgage,
      termOptions: [15, 20, 25, 30],
      defaultTermYears: 25,
      defaultRatePct: 3.8,
      showPropertyTax: false,
      annualInsurance: 400,
      note: "Terms, taxes and notary costs differ substantially between euro-area countries - purchase costs commonly run 8-14% of the price in Germany, France and Italy. Use this as a repayment illustration only.",
    },
  },
};

export const REGION_SLUGS = Object.keys(REGIONS) as RegionSlug[];

/** Region slugs that get their own indexable sub-route (everything but global). */
export const SUB_ROUTE_REGIONS = REGION_SLUGS.filter((s) => s !== "global");

export function isRegionSlug(v: unknown): v is RegionSlug {
  return typeof v === "string" && v in REGIONS;
}

export function getRegion(slug: string | undefined): Region {
  return isRegionSlug(slug) ? REGIONS[slug] : REGIONS.global;
}
