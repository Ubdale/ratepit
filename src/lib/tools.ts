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
  },
  {
    name: "Mortgage Calculator",
    navLabel: "Mortgage",
    path: "/mortgage-calculator",
    blurb:
      "Full monthly housing cost including principal, interest, property tax, insurance and PMI, with live US rate suggestions.",
    live: true,
    regional: true,
  },
  {
    name: "Credit Card Payoff Calculator",
    navLabel: "Card Payoff",
    path: "/credit-card-payoff-calculator",
    blurb: "See how long a balance takes to clear and what raising your payment saves you.",
    live: false,
    regional: false,
  },
  {
    name: "Car Loan Calculator",
    navLabel: "Car Loan",
    path: "/car-loan-calculator",
    blurb: "Auto finance payments with trade-in, down payment and balloon options.",
    live: false,
    regional: false,
  },
  {
    name: "Loan Eligibility Calculator",
    navLabel: "Eligibility",
    path: "/loan-eligibility-calculator",
    blurb: "Estimate how much you could borrow from your income and existing commitments.",
    live: false,
    regional: false,
  },
  {
    name: "Insurance Premium Estimator",
    navLabel: "Insurance",
    path: "/insurance-calculator",
    blurb: "Ballpark life, health and vehicle cover costs before you talk to a broker.",
    live: false,
    regional: false,
  },
];

export const LIVE_TOOLS = TOOLS.filter((t) => t.live);
