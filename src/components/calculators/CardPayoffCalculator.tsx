"use client";

import { useMemo, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useCurrency } from "@/components/CurrencyProvider";
import { MoneyField, SliderField } from "@/components/fields";
import { BalanceChart, CostBreakdown, SplitChart } from "@/components/charts";
import { AmortizationTable, Headline, Insight, StatGrid, StatTile } from "@/components/results";
import { cardMinimumPayoff, cardPayoff } from "@/lib/loans";
import type { LoanSchedule } from "@/lib/finance";
import { formatCurrency, formatDate, formatMonths, formatPercent } from "@/lib/format";
import { VIZ } from "@/lib/viz";

/** Order-of-magnitude scaling so the defaults suit the chosen currency. */
const MAGNITUDE: Record<string, number> = {
  USD: 1, EUR: 1, GBP: 1, CAD: 1.4, AUD: 1.5, SGD: 1.35,
  AED: 3.7, INR: 80, PKR: 280,
};

function scale(amount: number, to: string): number {
  const scaled = amount * (MAGNITUDE[to] ?? 1);
  const mag = Math.pow(10, Math.max(Math.floor(Math.log10(scaled)) - 1, 0));
  return Math.round(scaled / mag) * mag;
}

type Mode = "fixed" | "minimum";

export function CardPayoffCalculator() {
  const { code, compareCode, convertFormatted } = useCurrency();

  const [balance, setBalance] = useState(() => scale(5000, "USD"));
  const [apr, setApr] = useState(22.9);
  const [mode, setMode] = useState<Mode>("fixed");
  const [payment, setPayment] = useState(() => scale(200, "USD"));
  const [minPct, setMinPct] = useState(2.5);
  const [minFloor, setMinFloor] = useState(() => scale(25, "USD"));
  const [touched, setTouched] = useState(false);

  // Rescale the defaults on a currency switch, unless the user has typed.
  const scaled = useMemo(
    () => ({
      balance: touched ? balance : scale(5000, code),
      payment: touched ? payment : scale(200, code),
      floor: touched ? minFloor : scale(25, code),
    }),
    [touched, balance, payment, minFloor, code],
  );

  const result = useMemo(
    () =>
      mode === "fixed"
        ? cardPayoff(scaled.balance, apr, scaled.payment)
        : cardMinimumPayoff(scaled.balance, apr, minPct, scaled.floor),
    [mode, scaled.balance, apr, scaled.payment, minPct, scaled.floor],
  );

  // Always compute the minimum-only path so we can show what it costs.
  const minimumOnly = useMemo(
    () => cardMinimumPayoff(scaled.balance, apr, minPct, scaled.floor),
    [scaled.balance, apr, minPct, scaled.floor],
  );

  // And what one step up in payment would save.
  const stepUp = useMemo(() => {
    const extra = Math.max(scale(50, code), 1);
    return cardPayoff(scaled.balance, apr, scaled.payment + extra);
  }, [scaled.balance, apr, scaled.payment, code]);

  const neverClears = result.months === null;
  const firstPayment = result.rows[0]?.payment ?? 0;
  const monthlyShown = mode === "fixed" ? scaled.payment : firstPayment;
  const converted = compareCode ? convertFormatted(monthlyShown, compareCode) : null;

  const asSchedule: LoanSchedule = {
    monthlyPayment: monthlyShown,
    totalInterest: result.totalInterest,
    totalPayment: result.totalPaid,
    months: result.months ?? 0,
    rows: result.rows,
    yearly: result.yearly,
    payoffDate: result.payoffDate ?? new Date(),
  };

  const interestSaved = minimumOnly.months !== null && result.months !== null
    ? minimumOnly.totalInterest - result.totalInterest
    : 0;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="panel min-w-0 space-y-8 p-6 sm:p-8" aria-label="Card details">
        <div>
          <p className="eyebrow">Inputs</p>
          <h2 className="mt-2 font-display text-3xl font-normal tracking-tight">Your balance</h2>
        </div>

        <MoneyField
          label="Card balance"
          value={scaled.balance}
          onChange={(v) => {
            setTouched(true);
            setBalance(Math.max(v, 0));
          }}
          min={0}
          max={scale(50000, code)}
          step={scale(100, code)}
          help="What you owe today, across the card you want to clear."
        />

        <SliderField
          label="Interest rate (APR)"
          value={apr}
          onChange={(v) => setApr(Math.max(v, 0))}
          min={0}
          max={60}
          step={0.1}
          decimals={2}
          suffix="% p.a."
          help="The purchase APR on your statement. Cash advances usually cost more."
        />

        <div className="space-y-2">
          <span className="text-sm font-medium text-ink">How much do you pay each month?</span>
          <ToggleButtonGroup
            exclusive
            value={mode}
            onChange={(_, v) => {
              if (v !== null) setMode(v as Mode);
            }}
            aria-label="Payment mode"
          >
            <ToggleButton value="fixed">Fixed amount</ToggleButton>
            <ToggleButton value="minimum">Minimum only</ToggleButton>
          </ToggleButtonGroup>
        </div>

        {mode === "fixed" ? (
          <MoneyField
            label="Monthly payment"
            value={scaled.payment}
            onChange={(v) => {
              setTouched(true);
              setPayment(Math.max(v, 0));
            }}
            min={0}
            max={Math.max(scale(2000, code), scaled.balance)}
            step={scale(10, code)}
            hint={
              neverClears
                ? undefined
                : `Clears in ${formatMonths(result.months ?? 0)}.`
            }
          />
        ) : (
          <>
            <SliderField
              label="Minimum payment"
              value={minPct}
              onChange={(v) => setMinPct(Math.max(v, 0.1))}
              min={0.5}
              max={10}
              step={0.1}
              decimals={1}
              suffix="% of balance"
              help="Most issuers charge a small percentage of the balance, or a flat floor, whichever is greater."
            />
            <MoneyField
              label="Minimum payment floor"
              value={scaled.floor}
              onChange={(v) => {
                setTouched(true);
                setMinFloor(Math.max(v, 0));
              }}
              min={0}
              max={scale(200, code)}
              step={scale(5, code)}
            />
          </>
        )}
      </section>

      <section
        className="min-w-0 space-y-4 lg:sticky lg:top-24"
        aria-label="Results"
        aria-live="polite"
      >
        {neverClears ? (
          <div className="rounded-card border border-coral-400/40 bg-coral-400/[0.08] p-6 sm:p-8">
            <p className="eyebrow !text-coral-300">This never clears</p>
            <p className="mt-3 font-display text-3xl font-normal text-ink">
              The balance grows instead of falling.
            </p>
            <p className="mt-3 text-sm text-ink-muted">
              Interest in the first month alone is{" "}
              <strong className="font-medium text-coral-300">
                {formatCurrency(result.firstMonthInterest, code)}
              </strong>
              . Any payment at or below that leaves the debt larger than it started. You need to pay
              more than {formatCurrency(result.firstMonthInterest, code)} a month before the balance
              moves at all.
            </p>
          </div>
        ) : (
          <Headline
            label="Debt free in"
            value={monthlyShown}
            display={formatMonths(result.months ?? 0)}
            sublabel={`Paying ${formatCurrency(monthlyShown, code)} a month clears it by ${formatDate(result.payoffDate ?? new Date())}.`}
          />
        )}

        <StatGrid>
          <StatTile
            label="Time to clear"
            value={neverClears ? "Never" : formatMonths(result.months ?? 0)}
            tone={neverClears ? "warn" : "default"}
            hint={neverClears ? undefined : formatDate(result.payoffDate ?? new Date())}
          />
          <StatTile
            label="Total interest"
            value={neverClears ? "Unbounded" : formatCurrency(result.totalInterest, code)}
            tone={neverClears ? "warn" : "default"}
            hint={
              !neverClears && scaled.balance > 0
                ? `${formatPercent((result.totalInterest / scaled.balance) * 100, 0)} on top of the balance`
                : undefined
            }
          />
          <StatTile
            label="Total repaid"
            value={neverClears ? "-" : formatCurrency(result.totalPaid, code)}
            hint="Balance + interest"
          />
          <StatTile
            label="Interest this month"
            value={formatCurrency(result.firstMonthInterest, code)}
            hint="Charged before a penny comes off the balance"
          />
        </StatGrid>

        {mode === "minimum" && !neverClears ? (
          <Insight tone="neutral">
            Paying only the minimum drags this out to{" "}
            <strong className="font-medium text-ink">{formatMonths(result.months ?? 0)}</strong> and
            costs {formatCurrency(result.totalInterest, code)} in interest, because the payment
            shrinks as the balance does. Switch to a fixed amount to see the difference.
          </Insight>
        ) : null}

        {mode === "fixed" && !neverClears && stepUp.months !== null ? (
          <Insight>
            Paying {formatCurrency(scale(50, code), code)} more each month clears it in{" "}
            <strong className="font-medium">{formatMonths(stepUp.months)}</strong> instead and saves{" "}
            <strong className="font-medium">
              {formatCurrency(result.totalInterest - stepUp.totalInterest, code)}
            </strong>{" "}
            in interest.
          </Insight>
        ) : null}

        {mode === "fixed" && !neverClears && interestSaved > 0 ? (
          <p className="text-xs text-ink-faint">
            Versus minimum-only payments, this saves{" "}
            <span className="figure text-ink-muted">{formatCurrency(interestSaved, code)}</span>
            {minimumOnly.months !== null
              ? ` and ${formatMonths(minimumOnly.months - (result.months ?? 0))}.`
              : "."}
          </p>
        ) : null}

        {converted ? (
          <p className="text-xs text-ink-faint">
            Monthly payment in {compareCode}:{" "}
            <span className="figure text-ink-muted">{converted}</span>
          </p>
        ) : null}

        {!neverClears ? (
          <CostBreakdown
            title="What clearing this costs"
            caption="Everything you hand the issuer before the balance hits zero."
            code={code}
            total={result.totalPaid}
            slices={[
              { label: "Balance", value: scaled.balance, color: VIZ.series.principal },
              { label: "Interest", value: result.totalInterest, color: VIZ.series.interest },
            ]}
          />
        ) : null}
      </section>

      {!neverClears && result.yearly.length > 0 ? (
        <>
          <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
            <SplitChart yearly={result.yearly} code={code} />
            <BalanceChart yearly={result.yearly} code={code} />
          </div>
          <div className="lg:col-span-2">
            <AmortizationTable schedule={asSchedule} />
          </div>
        </>
      ) : null}
    </div>
  );
}
