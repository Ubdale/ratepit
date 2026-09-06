"use client";

import { useMemo, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { useCurrency } from "@/components/CurrencyProvider";
import { MoneyField, SliderField, TermSelector } from "@/components/fields";
import { BalanceChart, CostBreakdown, SplitChart } from "@/components/charts";
import { AmortizationTable, Headline, Insight, StatGrid, StatTile } from "@/components/results";
import { calculateEligibility } from "@/lib/loans";
import { formatCurrency, formatMonths, formatPercent } from "@/lib/format";
import { VIZ } from "@/lib/viz";

const MAGNITUDE: Record<string, number> = {
  USD: 1, EUR: 1, GBP: 0.9, CAD: 1.4, AUD: 1.5, SGD: 1.35,
  AED: 3.7, INR: 40, PKR: 120,
};

function scale(amount: number, to: string): number {
  const scaled = amount * (MAGNITUDE[to] ?? 1);
  const mag = Math.pow(10, Math.max(Math.floor(Math.log10(scaled)) - 1, 0));
  return Math.round(scaled / mag) * mag;
}

export function EligibilityCalculator() {
  const { code, compareCode, convertFormatted } = useCurrency();

  const [income, setIncome] = useState(() => scale(5000, "USD"));
  const [otherIncome, setOtherIncome] = useState(0);
  const [existing, setExisting] = useState(() => scale(400, "USD"));
  const [ratio, setRatio] = useState(40);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [touched, setTouched] = useState(false);

  const v = useMemo(
    () => ({
      income: touched ? income : scale(5000, code),
      existing: touched ? existing : scale(400, code),
    }),
    [touched, income, existing, code],
  );

  const result = useMemo(
    () =>
      calculateEligibility({
        monthlyIncome: v.income,
        otherIncome,
        existingRepayments: v.existing,
        ratioPct: ratio,
        annualRatePct: rate,
        termYears: years,
      }),
    [v.income, otherIncome, v.existing, ratio, rate, years],
  );

  const converted = compareCode ? convertFormatted(result.maxLoan, compareCode) : null;
  const usedPct =
    result.maxRepayment > 0
      ? Math.min((v.existing / result.maxRepayment) * 100, 100)
      : 0;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="min-w-0 space-y-8 rounded-card border-2 border-ink bg-paper p-6 sm:p-8" aria-label="Income and commitments">
        <div>
          <p className="eyebrow">Inputs</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">
            Your income
          </h2>
        </div>

        <MoneyField
          label="Monthly income"
          value={v.income}
          onChange={(x) => {
            setTouched(true);
            setIncome(Math.max(x, 0));
          }}
          min={0}
          max={scale(40000, code)}
          step={scale(100, code)}
          help="Gross or net depending on your lender - most in South Asia use net take-home, most in the US use gross."
        />

        <MoneyField
          label="Other monthly income"
          value={otherIncome}
          onChange={(x) => setOtherIncome(Math.max(x, 0))}
          min={0}
          max={scale(20000, code)}
          step={scale(100, code)}
          help="Rent received, a second job, reliably recurring bonus. Lenders discount or ignore irregular income."
        />

        <MoneyField
          label="Existing monthly repayments"
          value={v.existing}
          onChange={(x) => {
            setTouched(true);
            setExisting(Math.max(x, 0));
          }}
          min={0}
          max={scale(20000, code)}
          step={scale(50, code)}
          help="Every other loan, card minimum and finance agreement you already pay."
        />

        <SliderField
          label="Lender's income ratio"
          value={ratio}
          onChange={(x) => setRatio(Math.min(Math.max(x, 5), 80))}
          min={5}
          max={80}
          step={1}
          suffix="% of income"
          hint="Known as FOIR in India and Pakistan, DTI in the US, TDSR in Singapore."
          help="The share of income a lender will let you commit to debt. 40-50% is typical; Singapore caps TDSR at 55%."
        />

        <SliderField
          label="Interest rate"
          value={rate}
          onChange={(x) => setRate(Math.max(x, 0))}
          min={0}
          max={30}
          step={0.05}
          decimals={2}
          suffix="% p.a."
        />

        <TermSelector
          label="Term"
          options={[5, 10, 15, 20, 25, 30]}
          value={years}
          onChange={setYears}
        />
      </section>

      <section
        className="min-w-0 space-y-4 lg:sticky lg:top-28"
        aria-label="Results"
        aria-live="polite"
      >
        {result.overCommitted ? (
          <div className="rounded-card border border-coral/40 bg-coral/[0.08] p-6 sm:p-8">
            <p className="eyebrow !text-coral-deep">Nothing left to lend against</p>
            <p className="mt-3 font-display text-3xl font-normal text-ink">
              Existing repayments use your whole allowance.
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              At {formatPercent(ratio, 0)} of {formatCurrency(result.grossIncome, code)}, a lender
              would allow {formatCurrency(result.maxRepayment, code)} a month in total. You already
              pay {formatCurrency(v.existing, code)}. Clearing some of that, or extending the term,
              is what moves this.
            </p>
          </div>
        ) : (
          <Headline
            label="You could borrow about"
            value={result.maxLoan}
            sublabel={`Based on ${formatCurrency(result.affordableRepayment, code)} a month spare, over ${formatMonths(years * 12)} at ${formatPercent(rate)}.`}
          />
        )}

        <div className="rounded-card border border-ink-line bg-cream p-5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-ink-muted">Debt allowance used</span>
            <span className="figure text-sm text-ink">
              {formatCurrency(v.existing, code)} / {formatCurrency(result.maxRepayment, code)}
            </span>
          </div>
          <LinearProgress
            variant="determinate"
            value={usedPct}
            color={usedPct > 85 ? "warning" : "primary"}
            className="!mt-3"
            aria-label="Share of your borrowing allowance already committed"
          />
          <p className="mt-2 text-xs text-ink-muted">
            {formatPercent(usedPct, 0)} of what a lender would allow is already committed to
            existing debt.
          </p>
        </div>

        <StatGrid>
          <StatTile
            label="Spare each month"
            value={formatCurrency(result.affordableRepayment, code)}
            hint="What a new loan can use"
          />
          <StatTile
            label="Total allowance"
            value={formatCurrency(result.maxRepayment, code)}
            hint={`${formatPercent(ratio, 0)} of ${formatCurrency(result.grossIncome, code)}`}
          />
          <StatTile
            label="Interest over term"
            value={formatCurrency(result.totalInterest, code)}
            hint={`Over ${formatMonths(years * 12)}`}
          />
          <StatTile
            label="Current commitments"
            value={formatPercent(result.currentRatioPct, 0)}
            tone={result.currentRatioPct > ratio ? "warn" : "default"}
            hint="Share of income already spent on debt"
          />
        </StatGrid>

        <Insight tone="neutral">
          This is an affordability ceiling, not an offer. Lenders also weigh credit history,
          employment type and length, age at maturity, and the property or asset itself. Borrowing
          the maximum is rarely the same as borrowing the right amount.
        </Insight>

        {converted ? (
          <p className="text-xs text-ink-muted">
            Borrowing capacity in {compareCode}:{" "}
            <span className="figure text-ink-muted">{converted}</span>
          </p>
        ) : null}

        {result.maxLoan > 0 ? (
          <CostBreakdown
            title="What that loan would cost"
            caption="Principal against interest across the full term."
            code={code}
            total={result.maxLoan + result.totalInterest}
            slices={[
              { label: "Principal", value: result.maxLoan, color: VIZ.series.principal },
              { label: "Interest", value: result.totalInterest, color: VIZ.series.interest },
            ]}
          />
        ) : null}
      </section>

      {result.schedule.yearly.length > 0 ? (
        <>
          <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
            <SplitChart yearly={result.schedule.yearly} code={code} />
            <BalanceChart yearly={result.schedule.yearly} code={code} />
          </div>
          <div className="lg:col-span-2">
            <AmortizationTable schedule={result.schedule} />
          </div>
        </>
      ) : null}
    </div>
  );
}
