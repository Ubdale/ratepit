import {
  buildSchedule,
  type AmortizationRow,
  type LoanSchedule,
  type YearlyRow,
} from "./finance";

/** Rolls a monthly schedule up into per-year buckets. */
export function toYearly(rows: AmortizationRow[]): YearlyRow[] {
  const yearly: YearlyRow[] = [];
  let cumInterest = 0;
  let cumPrincipal = 0;
  for (const row of rows) {
    let bucket = yearly[row.year - 1];
    if (!bucket) {
      bucket = {
        year: row.year,
        interest: 0,
        principal: 0,
        balance: row.balance,
        cumulativeInterest: 0,
        cumulativePrincipal: 0,
      };
      yearly[row.year - 1] = bucket;
    }
    bucket.interest += row.interest;
    bucket.principal += row.principal;
    bucket.balance = row.balance;
    cumInterest += row.interest;
    cumPrincipal += row.principal;
    bucket.cumulativeInterest = cumInterest;
    bucket.cumulativePrincipal = cumPrincipal;
  }
  return yearly.filter(Boolean);
}

/* ------------------------------------------------------------------ *
 * Credit card payoff                                                  *
 * ------------------------------------------------------------------ */

export interface CardPayoffResult {
  /** Null when the payment never clears the balance. */
  months: number | null;
  totalInterest: number;
  totalPaid: number;
  payoffDate: Date | null;
  /** Interest charged in the first month - the cost of standing still. */
  firstMonthInterest: number;
  rows: AmortizationRow[];
  yearly: YearlyRow[];
}

const NEVER: Omit<CardPayoffResult, "firstMonthInterest"> = {
  months: null,
  totalInterest: 0,
  totalPaid: 0,
  payoffDate: null,
  rows: [],
  yearly: [],
};

/**
 * Fixed-payment payoff. Returns months = null when the payment does not cover
 * the monthly interest, because the balance then never falls.
 */
export function cardPayoff(
  balance: number,
  aprPct: number,
  monthlyPayment: number,
  startDate: Date = new Date(),
): CardPayoffResult {
  const r = aprPct / 100 / 12;
  const firstMonthInterest = Math.max(balance, 0) * (isFinite(r) ? r : 0);

  if (!(balance > 0)) {
    return { ...NEVER, months: 0, firstMonthInterest, payoffDate: new Date(startDate) };
  }
  if (!(monthlyPayment > 0) || monthlyPayment <= firstMonthInterest) {
    return { ...NEVER, firstMonthInterest };
  }

  const rows: AmortizationRow[] = [];
  let remaining = balance;
  let totalInterest = 0;
  let totalPaid = 0;

  for (let period = 1; period <= 1200 && remaining > 0.005; period++) {
    const interest = remaining * r;
    let principal = monthlyPayment - interest;
    let payment = monthlyPayment;
    if (principal >= remaining) {
      principal = remaining;
      payment = remaining + interest;
    }
    remaining -= principal;
    totalInterest += interest;
    totalPaid += payment;
    rows.push({
      period,
      year: Math.ceil(period / 12),
      payment,
      interest,
      principal,
      balance: Math.max(remaining, 0),
    });
  }

  const payoffDate = new Date(startDate);
  payoffDate.setMonth(payoffDate.getMonth() + rows.length);

  return {
    months: rows.length,
    totalInterest,
    totalPaid,
    payoffDate,
    firstMonthInterest,
    rows,
    yearly: toYearly(rows),
  };
}

/**
 * The other common card model: pay a percentage of the balance each month,
 * subject to a floor. The payment shrinks as the balance does, which is
 * exactly why minimum-only payoff drags on for decades.
 */
export function cardMinimumPayoff(
  balance: number,
  aprPct: number,
  percentOfBalance: number,
  floor: number,
  startDate: Date = new Date(),
): CardPayoffResult {
  const r = aprPct / 100 / 12;
  const firstMonthInterest = Math.max(balance, 0) * (isFinite(r) ? r : 0);

  if (!(balance > 0)) {
    return { ...NEVER, months: 0, firstMonthInterest, payoffDate: new Date(startDate) };
  }

  const rows: AmortizationRow[] = [];
  let remaining = balance;
  let totalInterest = 0;
  let totalPaid = 0;

  for (let period = 1; period <= 1200 && remaining > 0.005; period++) {
    const interest = remaining * r;
    let payment = Math.max((remaining * percentOfBalance) / 100, floor);
    if (payment <= interest) return { ...NEVER, firstMonthInterest };

    let principal = payment - interest;
    if (principal >= remaining) {
      principal = remaining;
      payment = remaining + interest;
    }
    remaining -= principal;
    totalInterest += interest;
    totalPaid += payment;
    rows.push({
      period,
      year: Math.ceil(period / 12),
      payment,
      interest,
      principal,
      balance: Math.max(remaining, 0),
    });
  }

  const payoffDate = new Date(startDate);
  payoffDate.setMonth(payoffDate.getMonth() + rows.length);

  return {
    months: rows.length,
    totalInterest,
    totalPaid,
    payoffDate,
    firstMonthInterest,
    rows,
    yearly: toYearly(rows),
  };
}

/* ------------------------------------------------------------------ *
 * Car loan                                                            *
 * ------------------------------------------------------------------ */

export interface CarLoanInput {
  vehiclePrice: number;
  downPayment: number;
  tradeIn: number;
  /** Finance still owed on the trade-in; rolled back into the new loan. */
  tradeInOwed: number;
  annualRatePct: number;
  termMonths: number;
  /** Sales tax / VAT / GST as a percentage of the vehicle price. */
  salesTaxPct: number;
  /** Registration, documentation and dealer fees, absolute. */
  fees: number;
  /** Guaranteed future value paid as a lump sum at the end, if any. */
  balloon: number;
}

export interface CarLoanResult {
  amountFinanced: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  salesTax: number;
  netTradeIn: number;
  schedule: LoanSchedule;
  balloonDue: number;
  /** True when negative equity on the trade-in is rolled into the loan. */
  negativeEquity: boolean;
}

export function calculateCarLoan(input: CarLoanInput): CarLoanResult {
  const price = Math.max(input.vehiclePrice || 0, 0);
  const salesTax = (price * Math.max(input.salesTaxPct || 0, 0)) / 100;
  const netTradeIn = (input.tradeIn || 0) - (input.tradeInOwed || 0);

  const amountFinanced = Math.max(
    price + salesTax + (input.fees || 0) - (input.downPayment || 0) - netTradeIn,
    0,
  );

  const months = Math.max(Math.round(input.termMonths || 0), 0);
  const r = input.annualRatePct / 100 / 12;
  const balloon = Math.min(Math.max(input.balloon || 0, 0), amountFinanced);

  // A balloon is settled as a lump sum, so only its present value amortises.
  let payment: number;
  if (months <= 0 || amountFinanced <= 0) {
    payment = 0;
  } else if (!isFinite(r) || Math.abs(r) < 1e-12) {
    payment = (amountFinanced - balloon) / months;
  } else {
    const growth = Math.pow(1 + r, months);
    payment = ((amountFinanced - balloon / growth) * r * growth) / (growth - 1);
  }

  const rows: AmortizationRow[] = [];
  let remaining = amountFinanced;
  let totalInterest = 0;

  for (let period = 1; period <= months && remaining > 0.005; period++) {
    const interest = remaining * (isFinite(r) ? r : 0);
    // The final instalment leaves exactly the balloon outstanding.
    let principal = period === months ? Math.max(remaining - balloon, 0) : payment - interest;
    if (principal < 0) break;
    if (principal > remaining) principal = remaining;
    remaining -= principal;
    totalInterest += interest;
    rows.push({
      period,
      year: Math.ceil(period / 12),
      payment: principal + interest,
      interest,
      principal,
      balance: Math.max(remaining, 0),
    });
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + rows.length);

  const schedule: LoanSchedule = {
    monthlyPayment: payment,
    totalInterest,
    totalPayment: payment * rows.length + balloon,
    months: rows.length,
    rows,
    yearly: toYearly(rows),
    payoffDate,
  };

  return {
    amountFinanced,
    monthlyPayment: payment,
    totalInterest,
    totalCost: (input.downPayment || 0) + payment * rows.length + balloon,
    salesTax,
    netTradeIn,
    schedule,
    balloonDue: balloon,
    negativeEquity: netTradeIn < 0,
  };
}

/* ------------------------------------------------------------------ *
 * Borrowing eligibility                                               *
 * ------------------------------------------------------------------ */

export interface EligibilityInput {
  monthlyIncome: number;
  /** Other regular income: rent received, averaged bonus, and so on. */
  otherIncome: number;
  /** Total existing loan and card repayments per month. */
  existingRepayments: number;
  /** Share of income a lender will let you commit, as a percentage. */
  ratioPct: number;
  annualRatePct: number;
  termYears: number;
}

export interface EligibilityResult {
  grossIncome: number;
  /** The most a lender would let you pay each month, before existing debt. */
  maxRepayment: number;
  /** What is left for a new loan after existing commitments. */
  affordableRepayment: number;
  maxLoan: number;
  totalInterest: number;
  /** Current commitments as a share of income. */
  currentRatioPct: number;
  /** True when existing debt already consumes the whole allowance. */
  overCommitted: boolean;
  schedule: LoanSchedule;
}

/**
 * Reverses the annuity formula: given the repayment a lender will allow, how
 * much principal does that support?
 */
export function calculateEligibility(input: EligibilityInput): EligibilityResult {
  const grossIncome =
    Math.max(input.monthlyIncome || 0, 0) + Math.max(input.otherIncome || 0, 0);
  const maxRepayment = (grossIncome * Math.max(input.ratioPct || 0, 0)) / 100;
  const affordableRepayment = Math.max(
    maxRepayment - Math.max(input.existingRepayments || 0, 0),
    0,
  );

  const months = Math.round(Math.max(input.termYears || 0, 0) * 12);
  const r = input.annualRatePct / 100 / 12;

  let maxLoan = 0;
  if (affordableRepayment > 0 && months > 0) {
    if (!isFinite(r) || Math.abs(r) < 1e-12) {
      maxLoan = affordableRepayment * months;
    } else {
      const growth = Math.pow(1 + r, months);
      maxLoan = (affordableRepayment * (growth - 1)) / (r * growth);
    }
  }

  const schedule = buildSchedule(maxLoan, input.annualRatePct, months);

  return {
    grossIncome,
    maxRepayment,
    affordableRepayment,
    maxLoan,
    totalInterest: schedule.totalInterest,
    currentRatioPct: grossIncome > 0 ? ((input.existingRepayments || 0) / grossIncome) * 100 : 0,
    overCommitted: maxRepayment > 0 && affordableRepayment <= 0,
    schedule,
  };
}
