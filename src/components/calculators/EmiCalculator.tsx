"use client";

import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/components/CurrencyProvider";
import { MoneyField, SliderField, TermSelector } from "@/components/fields";
import { BalanceChart, CostBreakdown, SplitChart } from "@/components/charts";
import { AmortizationTable, Headline, Insight, StatGrid, StatTile } from "@/components/results";
import { buildSchedule } from "@/lib/finance";
import { formatCurrency, formatDate, formatMonths, formatPercent } from "@/lib/format";
import type { Region } from "@/lib/regions";
import { VIZ } from "@/lib/viz";

/**
 * The amount defaults are written in each region's own currency. When the user
 * switches currency we rescale by a rough order of magnitude so the sliders stay
 * usable - it is a starting point, not a conversion.
 */
const MAGNITUDE: Record<string, number> = {
  USD: 1, EUR: 1, GBP: 1, CAD: 1.4, AUD: 1.5, SGD: 1.35,
  AED: 3.7, INR: 80, PKR: 280,
};

function scaleDefault(amount: number, from: string, to: string): number {
  const factor = (MAGNITUDE[to] ?? 1) / (MAGNITUDE[from] ?? 1);
  const scaled = amount * factor;
  // Round to a tidy slider-friendly figure.
  const magnitude = Math.pow(10, Math.max(Math.floor(Math.log10(scaled)) - 1, 0));
  return Math.round(scaled / magnitude) * magnitude;
}

export function EmiCalculator({ region }: { region: Region }) {
  const { code, currency, compareCode, convertFormatted } = useCurrency();
  const config = region.emi;

  const [amount, setAmount] = useState(config.defaultAmount);
  const [rate, setRate] = useState(config.defaultRatePct);
  const [years, setYears] = useState(config.defaultTermYears);
  const [extra, setExtra] = useState(0);
  const [feePct, setFeePct] = useState(config.processingFeePct);
  const [touchedAmount, setTouchedAmount] = useState(false);

  // Rescale the starting amount when the currency changes, unless the user has
  // already typed one of their own.
  useEffect(() => {
    if (touchedAmount) return;
    setAmount(scaleDefault(config.defaultAmount, region.currency, code));
    setExtra(0);
  }, [code, config.defaultAmount, region.currency, touchedAmount]);

  const schedule = useMemo(
    () => buildSchedule(amount, rate, Math.round(years * 12), extra),
    [amount, rate, years, extra],
  );

  const baseline = useMemo(
    () => buildSchedule(amount, rate, Math.round(years * 12), 0),
    [amount, rate, years],
  );

  const processingFee = config.showProcessingFee ? (amount * feePct) / 100 : 0;
  const interestSaved = baseline.totalInterest - schedule.totalInterest;
  const monthsSaved = baseline.months - schedule.months;
  const totalCost = schedule.totalInterest + processingFee;
  const apr = amount > 0 ? ((schedule.totalPayment + processingFee) / amount - 1) * 100 : 0;

  const monthlyOutgoing = schedule.monthlyPayment + extra;
  const convertedMonthly = compareCode ? convertFormatted(monthlyOutgoing, compareCode) : null;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Inputs */}
      <section className="panel min-w-0 space-y-8 p-6 sm:p-8" aria-label="Loan details">
        <div>
          <p className="eyebrow">Inputs</p>
          <h2 className="mt-2 font-display text-3xl font-normal tracking-tight">Your loan</h2>
        </div>

        <MoneyField
          label="Loan amount"
          value={amount}
          onChange={(v) => {
            setTouchedAmount(true);
            setAmount(Math.max(v, 0));
          }}
          min={0}
          max={scaleDefault(200000, "USD", code)}
          step={scaleDefault(500, "USD", code)}
        />

        <SliderField
          label="Interest rate"
          value={rate}
          onChange={(v) => setRate(Math.max(v, 0))}
          min={0}
          max={40}
          step={0.05}
          decimals={2}
          suffix="% p.a."
          hint="The nominal annual rate your lender quotes."
        />

        <TermSelector
          label="Loan term"
          options={config.termOptions}
          value={years}
          onChange={setYears}
        />

        <SliderField
          label="Term (fine tune)"
          value={years}
          onChange={(v) => setYears(Math.max(v, 0.5))}
          min={0.5}
          max={30}
          step={0.5}
          decimals={1}
          suffix="years"
        />

        <MoneyField
          label="Extra payment each month"
          value={extra}
          onChange={(v) => setExtra(Math.max(v, 0))}
          min={0}
          max={Math.max(Math.round(schedule.monthlyPayment * 2), 100)}
          step={scaleDefault(10, "USD", code)}
          hint="Optional. Paid straight off the principal, so it shortens the term."
        />

        {config.showProcessingFee ? (
          <SliderField
            label="Processing fee"
            value={feePct}
            onChange={(v) => setFeePct(Math.max(v, 0))}
            min={0}
            max={5}
            step={0.05}
            decimals={2}
            suffix="% of loan"
            hint={`One-off, charged upfront: ${formatCurrency(processingFee, code)}`}
          />
        ) : null}

        {config.note ? (
          <p className="rounded-xl border border-line bg-canvas-raised/60 p-4 text-xs leading-relaxed text-ink-faint">
            {config.note}
          </p>
        ) : null}
      </section>

      {/* Results */}
      <section
        className="min-w-0 space-y-4 lg:sticky lg:top-24"
        aria-label="Results"
        aria-live="polite"
      >
        <Headline
          label="Monthly EMI"
          value={monthlyOutgoing}
          decimals={0}
          sublabel={
            extra > 0
              ? `Includes ${formatCurrency(extra, code)} extra towards principal.`
              : `${formatMonths(schedule.months)} at ${formatPercent(rate)} on ${formatCurrency(amount, code)}.`
          }
        />

        <StatGrid>
          <StatTile
            label="Total interest"
            value={formatCurrency(schedule.totalInterest, code)}
            hint={
              amount > 0
                ? `${formatPercent((schedule.totalInterest / amount) * 100, 0)} of the amount borrowed`
                : undefined
            }
          />
          <StatTile
            label="Total repaid"
            value={formatCurrency(schedule.totalPayment + processingFee, code)}
            hint={config.showProcessingFee ? "Including the processing fee" : "Principal + interest"}
          />
          <StatTile label="Paid off" value={formatDate(schedule.payoffDate)} hint={formatMonths(schedule.months)} />
          <StatTile
            label="Cost of borrowing"
            value={formatPercent(apr, 1)}
            hint="Total charges as a share of the amount borrowed"
          />
        </StatGrid>

        {extra > 0 && interestSaved > 0 ? (
          <Insight>
            Paying {formatCurrency(extra, code)} extra each month saves{" "}
            <strong className="font-medium">{formatCurrency(interestSaved, code)}</strong> in
            interest and clears the loan {formatMonths(monthsSaved)} sooner.
          </Insight>
        ) : null}

        {convertedMonthly ? (
          <p className="text-xs text-ink-faint">
            Monthly payment in {compareCode}: <span className="figure text-ink-muted">{convertedMonthly}</span>
          </p>
        ) : null}

        <CostBreakdown
          title="What the loan costs you"
          caption={`Every ${currency.code} you hand over across the full term.`}
          code={code}
          total={amount + totalCost}
          slices={[
            { label: "Principal", value: amount, color: VIZ.series.principal },
            { label: "Interest", value: schedule.totalInterest, color: VIZ.series.interest },
            ...(processingFee > 0
              ? [{ label: "Processing fee", value: processingFee, color: VIZ.series.tax }]
              : []),
          ]}
        />
      </section>

      {/* Charts span both columns. */}
      <div className="grid gap-6 lg:col-span-2 lg:grid-cols-2">
        <SplitChart yearly={schedule.yearly} code={code} />
        <BalanceChart yearly={schedule.yearly} code={code} />
      </div>

      <div className="lg:col-span-2">
        <AmortizationTable schedule={schedule} />
      </div>
    </div>
  );
}
