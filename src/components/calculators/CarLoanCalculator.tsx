"use client";

import { useMemo, useState } from "react";
import { useCurrency } from "@/components/CurrencyProvider";
import { MoneyField, SliderField, TermSelector, ToggleField } from "@/components/fields";
import { BalanceChart, CostBreakdown, SplitChart } from "@/components/charts";
import { AmortizationTable, Headline, Insight, StatGrid, StatTile } from "@/components/results";
import { calculateCarLoan } from "@/lib/loans";
import { formatCurrency, formatDate, formatMonths, formatPercent } from "@/lib/format";
import { VIZ } from "@/lib/viz";

const MAGNITUDE: Record<string, number> = {
  USD: 1, EUR: 1, GBP: 0.9, CAD: 1.4, AUD: 1.5, SGD: 1.35,
  AED: 3.7, INR: 60, PKR: 200,
};

function scale(amount: number, to: string): number {
  const scaled = amount * (MAGNITUDE[to] ?? 1);
  const mag = Math.pow(10, Math.max(Math.floor(Math.log10(scaled)) - 1, 0));
  return Math.round(scaled / mag) * mag;
}

const TERMS = [24, 36, 48, 60, 72, 84];

export function CarLoanCalculator() {
  const { code, compareCode, convertFormatted } = useCurrency();

  const [price, setPrice] = useState(() => scale(32000, "USD"));
  const [down, setDown] = useState(() => scale(4000, "USD"));
  const [tradeIn, setTradeIn] = useState(0);
  const [tradeInOwed, setTradeInOwed] = useState(0);
  const [rate, setRate] = useState(7.5);
  const [months, setMonths] = useState(60);
  const [taxPct, setTaxPct] = useState(0);
  const [fees, setFees] = useState(0);
  const [useBalloon, setUseBalloon] = useState(false);
  const [balloonPct, setBalloonPct] = useState(30);
  const [touched, setTouched] = useState(false);

  const v = useMemo(
    () => ({
      price: touched ? price : scale(32000, code),
      down: touched ? down : scale(4000, code),
    }),
    [touched, price, down, code],
  );

  const balloon = useBalloon ? (v.price * balloonPct) / 100 : 0;

  const result = useMemo(
    () =>
      calculateCarLoan({
        vehiclePrice: v.price,
        downPayment: v.down,
        tradeIn,
        tradeInOwed,
        annualRatePct: rate,
        termMonths: months,
        salesTaxPct: taxPct,
        fees,
        balloon,
      }),
    [v.price, v.down, tradeIn, tradeInOwed, rate, months, taxPct, fees, balloon],
  );

  const converted = compareCode ? convertFormatted(result.monthlyPayment, compareCode) : null;
  const depositPct = v.price > 0 ? ((v.down + result.netTradeIn) / v.price) * 100 : 0;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="panel min-w-0 space-y-8 p-6 sm:p-8" aria-label="Vehicle and finance">
        <div>
          <p className="eyebrow">Inputs</p>
          <h2 className="mt-2 font-display text-3xl font-normal tracking-tight">Your car</h2>
        </div>

        <MoneyField
          label="Vehicle price"
          value={v.price}
          onChange={(x) => {
            setTouched(true);
            setPrice(Math.max(x, 0));
          }}
          min={0}
          max={scale(150000, code)}
          step={scale(500, code)}
        />

        <MoneyField
          label="Down payment"
          value={v.down}
          onChange={(x) => {
            setTouched(true);
            setDown(Math.max(x, 0));
          }}
          min={0}
          max={v.price}
          step={scale(250, code)}
          hint={`${formatPercent(depositPct, 0)} of the price, including any trade-in equity`}
        />

        <MoneyField
          label="Trade-in value"
          value={tradeIn}
          onChange={(x) => setTradeIn(Math.max(x, 0))}
          min={0}
          max={scale(60000, code)}
          step={scale(250, code)}
          help="What the dealer allows you for your current vehicle."
        />

        <MoneyField
          label="Still owed on trade-in"
          value={tradeInOwed}
          onChange={(x) => setTradeInOwed(Math.max(x, 0))}
          min={0}
          max={scale(60000, code)}
          step={scale(250, code)}
          help="Outstanding finance on the old car. Anything above its value is rolled into the new loan."
        />

        <SliderField
          label="Interest rate (APR)"
          value={rate}
          onChange={(x) => setRate(Math.max(x, 0))}
          min={0}
          max={30}
          step={0.05}
          decimals={2}
          suffix="% p.a."
        />

        <TermSelector label="Term" options={TERMS} value={months} onChange={setMonths} unit="mo" />

        <SliderField
          label="Sales tax / VAT"
          value={taxPct}
          onChange={(x) => setTaxPct(Math.max(x, 0))}
          min={0}
          max={30}
          step={0.5}
          decimals={1}
          suffix="% of price"
          hint={taxPct > 0 ? `${formatCurrency(result.salesTax, code)} added to the loan` : undefined}
          help="Varies enormously by country and state. Set it to zero if tax is paid separately."
        />

        <MoneyField
          label="Registration and dealer fees"
          value={fees}
          onChange={(x) => setFees(Math.max(x, 0))}
          min={0}
          max={scale(5000, code)}
          step={scale(50, code)}
        />

        <div className="space-y-3">
          <ToggleField
            label="Balloon / guaranteed future value"
            checked={useBalloon}
            onChange={setUseBalloon}
            hint="PCP-style finance: a lump sum deferred to the end of the term."
          />
          {useBalloon ? (
            <SliderField
              label="Balloon amount"
              value={balloonPct}
              onChange={(x) => setBalloonPct(Math.max(x, 0))}
              min={0}
              max={60}
              step={1}
              suffix="% of price"
              hint={`${formatCurrency(result.balloonDue, code)} due as a lump sum at the end`}
            />
          ) : null}
        </div>
      </section>

      <section
        className="min-w-0 space-y-4 lg:sticky lg:top-24"
        aria-label="Results"
        aria-live="polite"
      >
        <Headline
          label="Monthly payment"
          value={result.monthlyPayment}
          sublabel={
            result.balloonDue > 0
              ? `${months} payments, then ${formatCurrency(result.balloonDue, code)} to own the car outright.`
              : `${formatMonths(months)} at ${formatPercent(rate)} on ${formatCurrency(result.amountFinanced, code)}.`
          }
        />

        <StatGrid>
          <StatTile
            label="Amount financed"
            value={formatCurrency(result.amountFinanced, code)}
            hint={`After ${formatCurrency(v.down, code)} down`}
          />
          <StatTile
            label="Total interest"
            value={formatCurrency(result.totalInterest, code)}
            hint={`Over ${formatMonths(months)}`}
          />
          <StatTile
            label="Total cost"
            value={formatCurrency(result.totalCost, code)}
            hint="Deposit + payments + balloon"
          />
          <StatTile
            label="Paid off"
            value={formatDate(result.schedule.payoffDate)}
            hint={formatMonths(result.schedule.months)}
          />
        </StatGrid>

        {result.negativeEquity ? (
          <Insight tone="neutral">
            You owe {formatCurrency(Math.abs(result.netTradeIn), code)} more on the trade-in than it
            is worth. That negative equity is rolled into the new loan, so you start the new
            agreement already underwater.
          </Insight>
        ) : null}

        {result.balloonDue > 0 ? (
          <Insight tone="neutral">
            The balloon keeps the monthly payment down, but{" "}
            <strong className="font-medium text-ink">
              {formatCurrency(result.balloonDue, code)}
            </strong>{" "}
            still falls due at the end. You either pay it, refinance it, or hand the car back.
          </Insight>
        ) : null}

        {months >= 72 ? (
          <Insight tone="neutral">
            A {months}-month term lowers the payment but stretches interest over{" "}
            {formatMonths(months)}. Cars usually depreciate faster than the loan amortises early on,
            so long terms often leave you owing more than the car is worth.
          </Insight>
        ) : null}

        {converted ? (
          <p className="text-xs text-ink-faint">
            Monthly payment in {compareCode}:{" "}
            <span className="figure text-ink-muted">{converted}</span>
          </p>
        ) : null}

        <CostBreakdown
          title="Where the money goes"
          caption="Everything you pay across the agreement."
          code={code}
          total={result.totalCost}
          slices={[
            { label: "Vehicle price", value: v.price, color: VIZ.series.principal },
            { label: "Interest", value: result.totalInterest, color: VIZ.series.interest },
            { label: "Sales tax", value: result.salesTax, color: VIZ.series.tax },
            { label: "Fees", value: fees, color: VIZ.series.insurance },
          ]}
        />
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
