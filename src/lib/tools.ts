export interface Tool {
  name: string;
  /** Short label for the nav bar. */
  navLabel: string;
  path: string;
  blurb: string;
  /** False until the calculator ships; renders as a disabled card. */
  live: boolean;
  /** Whether this tool has per-region sub-routes. */
  regional: boolean;
  /** Per-tool accent, drawn from the validated chart palette. */
  accent: string;
}

export const TOOLS: Tool[] = [
  {
    name: "Loan EMI Calculator",
    navLabel: "Loan EMI",
    path: "/loan-emi-calculator",
    blurb:
      "Work out the monthly instalment, total interest and full amortisation schedule for any personal, business or education loan.",
    live: true,
    regional: true,
    accent: "#199e70",
  },
  {
    name: "Mortgage Calculator",
    navLabel: "Mortgage",
    path: "/mortgage-calculator",
    blurb:
      "Full monthly housing cost including principal, interest, property tax, insurance and PMI, with live US rate suggestions.",
    live: true,
    regional: true,
    accent: "#3987e5",
  },
  {
    name: "Credit Card Payoff Calculator",
    navLabel: "Card Payoff",
    path: "/credit-card-payoff-calculator",
    blurb:
      "See exactly when your balance clears, what it costs in interest, and how much paying more each month saves.",
    live: true,
    regional: false,
    accent: "#d95926",
  },
  {
    name: "Car Loan Calculator",
    navLabel: "Car Loan",
    path: "/car-loan-calculator",
    blurb:
      "Monthly payment with trade-in, negative equity, sales tax, fees and balloon/PCP finance built in.",
    live: true,
    regional: false,
    accent: "#c98500",
  },
  {
    name: "Loan Eligibility Calculator",
    navLabel: "Eligibility",
    path: "/loan-eligibility-calculator",
    blurb:
      "Work backwards from your income and existing debts to the loan a lender would actually allow.",
    live: true,
    regional: false,
    accent: "#9085e9",
  },
  {
    name: "Insurance Premium Estimator",
    navLabel: "Insurance",
    path: "/insurance-calculator",
    blurb:
      "A modelled range for term life, health and motor cover, with every rating factor shown.",
    live: true,
    regional: false,
    accent: "#d55181",
  },
];

export const LIVE_TOOLS = TOOLS.filter((t) => t.live);

const ACCENTS = new Map(TOOLS.map((t) => [t.path, t.accent]));

export function toolAccent(path: string): string {
  return ACCENTS.get(path) ?? "#D6F25B";
}
