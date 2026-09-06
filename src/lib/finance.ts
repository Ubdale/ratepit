/**
 * Loan math. Everything here is pure and runs in the browser - no figure the
 * user types is ever sent anywhere.
 */

export interface AmortizationRow {
  period: number;        // 1-based month index
  year: number;          // 1-based year index
  payment: number;
  interest: number;
  principal: number;
  balance: number;       // remaining after this payment
}

export interface YearlyRow {
  year: number;
  interest: number;
  principal: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface LoanSchedule {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  months: number;
  rows: AmortizationRow[];
  yearly: YearlyRow[];
  payoffDate: Date;
}

/** Monthly payment for an amortising loan. Handles the 0% case. */
export function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  if (!isFinite(principal) || principal <= 0 || !isFinite(months) || months <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (!isFinite(r) || Math.abs(r) < 1e-12) return principal / months;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
}

/**
 * Full amortisation schedule. `extraMonthly` is an optional additional
 * principal payment applied every month, which shortens the term.
 */
export function buildSchedule(
  principal: number,
  annualRatePct: number,
  months: number,
  extraMonthly = 0,
  startDate: Date = new Date(),
): LoanSchedule {
  const base = monthlyPayment(principal, annualRatePct, months);
  const r = annualRatePct / 100 / 12;
  const rows: AmortizationRow[] = [];

  let balance = principal;
  let totalInterest = 0;
  let totalPayment = 0;

  if (principal > 0 && months > 0) {
    // Cap iterations so a pathological rate/extra combination cannot spin.
    const maxPeriods = Math.min(months, 1200);
    for (let period = 1; period <= maxPeriods && balance > 0.005; period++) {
      const interest = balance * (isFinite(r) ? r : 0);
      let payment = base + extraMonthly;
      let principalPart = payment - interest;

      // Never overpay the final instalment.
      if (principalPart >= balance) {
        principalPart = balance;
        payment = balance + interest;
      }

      // A payment that does not cover interest would never amortise - bail out
      // rather than emitting a schedule that grows forever.
      if (principalPart <= 0) break;

      balance -= principalPart;
      totalInterest += interest;
      totalPayment += payment;

      rows.push({
        period,
        year: Math.ceil(period / 12),
        payment,
        interest,
        principal: principalPart,
        balance: Math.max(balance, 0),
      });
    }
  }

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

  const payoffDate = new Date(startDate);
  payoffDate.setMonth(payoffDate.getMonth() + Math.max(rows.length, 0));

  return {
    monthlyPayment: base,
    totalInterest,
    totalPayment,
    months: rows.length,
    rows,
    yearly: yearly.filter(Boolean),
    payoffDate,
  };
}

/** Total of a set of recurring monthly costs, ignoring blanks. */
export function sum(...values: Array<number | undefined | null>): number {
  return values.reduce<number>((acc, v) => acc + (typeof v === "number" && isFinite(v) ? v : 0), 0);
}

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  annualRatePct: number;
  termYears: number;
  /** Annual property tax as a percentage of home price. */
  propertyTaxPct?: number;
  /** Annual home insurance, absolute amount. */
  annualInsurance?: number;
  /** Monthly HOA / service charge. */
  monthlyHoa?: number;
  /** Annual PMI rate as a percentage of the loan, charged until 80% LTV. */
  pmiPct?: number;
  pmiEnabled?: boolean;
  /** One-off processing fee as a percentage of the loan (South Asia convention). */
  processingFeePct?: number;
  extraMonthly?: number;
}

export interface MortgageResult {
  loanAmount: number;
  schedule: LoanSchedule;
  monthlyPrincipalInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPmi: number;
  /** Full monthly outgoing including escrow items. */
  monthlyTotal: number;
  processingFee: number;
  /** Months until PMI drops off at 80% LTV, or null when not applicable. */
  pmiDropOffMonth: number | null;
  totalPmiPaid: number;
  downPaymentPct: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const homePrice = Math.max(input.homePrice || 0, 0);
  const downPayment = Math.min(Math.max(input.downPayment || 0, 0), homePrice);
  const loanAmount = Math.max(homePrice - downPayment, 0);

  const schedule = buildSchedule(
    loanAmount,
    input.annualRatePct,
    Math.round((input.termYears || 0) * 12),
    input.extraMonthly ?? 0,
  );

  const monthlyTax = (homePrice * (input.propertyTaxPct ?? 0)) / 100 / 12;
  const monthlyInsurance = (input.annualInsurance ?? 0) / 12;
  const monthlyHoa = input.monthlyHoa ?? 0;

  // PMI applies while the loan balance is above 80% of the home's value.
  const pmiActive = Boolean(input.pmiEnabled) && (input.pmiPct ?? 0) > 0 && homePrice > 0;
  const monthlyPmi = pmiActive ? (loanAmount * (input.pmiPct ?? 0)) / 100 / 12 : 0;

  let pmiDropOffMonth: number | null = null;
  if (pmiActive) {
    const threshold = homePrice * 0.8;
    if (loanAmount <= threshold) {
      pmiDropOffMonth = 0;
    } else {
      const hit = schedule.rows.find((row) => row.balance <= threshold);
      pmiDropOffMonth = hit ? hit.period : schedule.months;
    }
  }
  const totalPmiPaid = pmiDropOffMonth === null ? 0 : monthlyPmi * pmiDropOffMonth;

  return {
    loanAmount,
    schedule,
    monthlyPrincipalInterest: schedule.monthlyPayment,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    monthlyPmi: pmiDropOffMonth === 0 ? 0 : monthlyPmi,
    monthlyTotal:
      schedule.monthlyPayment +
      monthlyTax +
      monthlyInsurance +
      monthlyHoa +
      (pmiDropOffMonth === 0 ? 0 : monthlyPmi),
    processingFee: (loanAmount * (input.processingFeePct ?? 0)) / 100,
    pmiDropOffMonth,
    totalPmiPaid,
    downPaymentPct: homePrice > 0 ? (downPayment / homePrice) * 100 : 0,
  };
}
