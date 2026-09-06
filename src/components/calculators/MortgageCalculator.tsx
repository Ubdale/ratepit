"use client";

import { useEffect, useMemo, useState } from "react";
import { useCurrency } from "@/components/CurrencyProvider";
import { MoneyField, SliderField, TermSelector, ToggleField } from "@/components/fields";
import { BalanceChart, CostBreakdown, SplitChart } from "@/components/charts";
import { AmortizationTable, Headline, StatTile } from "@/components/results";
import { useMortgageRate } from "@/components/useMortgageRate";
import { calculateMortgage } from "@/lib/finance";
import {
  formatCurrency, formatDate, formatMonths, formatPercent, formatTimestamp,
} from "@/lib/format";
import type { Region } from "@/lib/regions";
import { VIZ } from "@/lib/viz";

/** Rough order-of-magnitude scaling for the default home price per currency. */
const MAGNITUDE: Record<string, number> = {
  USD: 1, EUR: 1, GBP: 0.9, CAD: 1.4, AUD: 1.5, SGD: 1.35,
  AED: 3.7, INR: 30, PKR: 70,
};

const BASE_HOME_PRICE = 400000;

function scalePrice(currency: string): number {
  const scaled = BASE_HOME_PRICE * (MAGNITUDE[currency] ?? 1);
  const magnitude = Math.pow(10, Math.max(Math.floor(Math.log10(scaled)) - 1, 0));
  return Math.round(scaled / magnitude) * magnitude;
}

export function MortgageCalculator({ region }: { region: Region }) {
  const { code, compareCode, convertFormatted } = useCurrency();
  const config = region.mortgage;

  const [homePrice, setHomePrice] = useState(() => scalePrice(region.currency));
  const [downPct, setDownPct] = useState(config.defaultDownPaymentPct);
  const [rate, setRate] = useState(config.defaultRatePct);
  const [years, setYears] = useState(config.defaultTermYears);
  const [propertyTaxPct, setPropertyTaxPct] = useState(config.propertyTaxPct);
  const [annualInsurance, setAnnualInsurance] = useState(config.annualInsurance);
  const [monthlyHoa, setMonthlyHoa] = useState(0);
  const [pmiEnabled, setPmiEnabled] = useState(config.showPmi);
  const [pmiPct, setPmiPct] = useState(config.pmiPct);
  const [feePct, setFeePct] = useState(config.processingFeePct);
  const [extra, setExtra] = useState(0);
  const [touchedPrice, setTouchedPrice] = useState(false);
  const [rateApplied, setRateApplied] = useState(false);

  const live = useMortgageRate(config.hasLiveRate);

  // Keep the money defaults in the right ballpark when the currency changes.
  useEffect(() => {
    if (touchedPrice) return;
    setHomePrice(scalePrice(code));
    setAnnualInsurance(Math.round(config.annualInsurance * (MAGNITUDE[code] ?? 1)));
    setMonthlyHoa(0);
    setExtra(0);
  }, [code, config.annualInsurance, touchedPrice]);

  const downPayment = (homePrice * downPct) / 100;

  const result = useMemo(
    () =>
      calculateMortgage({
        homePrice,
        downPayment,
        annualRatePct: rate,
        termYears: years,
        propertyTaxPct: config.showPropertyTax ? propertyTaxPct : 0,
        annualInsurance,
        monthlyHoa: config.showHoa ? monthlyHoa : 0,
        pmiPct,
        pmiEnabled: config.showPmi && pmiEnabled,
        processingFeePct: config.showProcessingFee ? feePct : 0,
        extraMonthly: extra,
      }),
    [
      homePrice, downPayment, rate, years, propertyTaxPct, annualInsurance,
      monthlyHoa, pmiPct, pmiEnabled, feePct, extra, config,
    ],
  );

  const baseline = useMemo(
    () =>
      calculateMortgage({
        homePrice,
        downPayment,
        annualRatePct: rate,
        termYears: years,
        extraMonthly: 0,
      }),
    [homePrice, downPayment, rate, years],
  );

  const schedule = result.schedule;
  const interestSaved = baseline.schedule.totalInterest - schedule.totalInterest;
  const monthsSaved = baseline.schedule.months - schedule.months;
  const monthlyTotal = result.monthlyTotal + extra;
  const convertedMonthly = compareCode ? convertFormatted(monthlyTotal, compareCode) : null;
  const ltv = homePrice > 0 ? (result.loanAmount / homePrice) * 100 : 0;

  const liveRate = live.data;
  const canSuggestRate = config.hasLiveRate && liveRate && !liveRate.stale;

  const rateAction = config.hasLiveRate ? (
    <span className="text-xs">
      {live.loading ? (
        <span className="text-slate-600">checking rate&hellip;</span>
      ) : canSuggestRate ? (
        <button
          type="button"
          onClick={() => {
            setRate(liveRate.rate);
            setRateApplied(true);
          }}
          className="rounded text-brand-300 underline-offset-2 hover:underline"
        >
          Current avg {formatPercent(liveRate.rate, 2)} - tap to use
        </button>
      ) : (
        <span className="text-amber-400/80">estimated rate, live data unavailable</span>
      )}
    </span>
  ) : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="card space-y-6" aria-label="Mortgage details">
        <h2 className="text-lg font-semibold text-slate-100">Your {config.hasLiveRate ? "mortgage" : region.mortgageTerm.toLowerCase()}</h2>

        <MoneyField
          label="Property price"
          value={homePrice}
          onChange={(v) => {
            setTouchedPrice(true);
            setHomePrice(Math.max(v, 0));
          }}
          min={0}
          max={scalePrice(code) * 5}
          step={scalePrice(code) / 200}
        />

        <SliderField
          label="Down payment"
          value={downPct}
          onChange={(v) => setDownPct(Math.min(Math.max(v, 0), 100))}
          min={0}
          max={100}
          step={0.5}
          decimals={1}
          suffix="%"
          hint={`${formatCurrency(downPayment, code)} down, borrowing ${formatCurrency(result.loanAmount, code)} (LTV ${formatPercent(ltv, 0)})`}
        />

        <SliderField
          label="Interest rate"
          value={rate}
          onChange={(v) => {
            setRate(Math.max(v, 0));
            setRateApplied(false);
          }}
          min={0}
          max={25}
          step={0.05}
          decimals={2}
          suffix="% p.a."
          action={rateAction}
          hint={
            rateApplied && liveRate
              ? `Using the FRED 30-year average${liveRate.observedOn ? ` observed ${liveRate.observedOn}` : ""}.`
              : undefined
          }
        />

        <TermSelector
          label="Term"
          options={config.termOptions}
          value={years}
          onChange={setYears}
        />

        {config.showPropertyTax ? (
          <SliderField
            label="Property tax"
            value={propertyTaxPct}
            onChange={(v) => setPropertyTaxPct(Math.max(v, 0))}
            min={0}
            max={4}
            step={0.05}
            decimals={2}
            suffix="% of value / yr"
            hint={`${formatCurrency(result.monthlyTax, code)} per month`}
          />
        ) : null}

        <MoneyField
          label="Home insurance"
          value={annualInsurance}
          onChange={(v) => setAnnualInsurance(Math.max(v, 0))}
          min={0}
          max={Math.max(scalePrice(code) / 40, 100)}
          step={Math.max(Math.round(scalePrice(code) / 4000), 1)}
          suffix="/ yr"
          hint={`${formatCurrency(result.monthlyInsurance, code)} per month`}
        />

        {config.showHoa ? (
          <MoneyField
            label={config.hoaLabel}
            value={monthlyHoa}
            onChange={(v) => setMonthlyHoa(Math.max(v, 0))}
            min={0}
            max={Math.max(scalePrice(code) / 200, 100)}
            step={Math.max(Math.round(scalePrice(code) / 20000), 1)}
            suffix="/ mo"
          />
        ) : null}

        {config.showPmi ? (
          <div className="space-y-3">
            <ToggleField
              label="Mortgage insurance (PMI)"
              checked={pmiEnabled}
              onChange={setPmiEnabled}
              hint="Usually required below a 20% down payment, and removed once you reach 20% equity."
            />
            {pmiEnabled ? (
              <SliderField
                label="PMI rate"
                value={pmiPct}
                onChange={(v) => setPmiPct(Math.max(v, 0))}
                min={0}
                max={2}
                step={0.05}
                decimals={2}
                suffix="% of loan / yr"
                hint={
                  result.pmiDropOffMonth === 0
                    ? "Not charged - you are already at 20% equity."
                    : result.pmiDropOffMonth
                      ? `${formatCurrency(result.monthlyPmi, code)}/mo, dropping off after ${formatMonths(result.pmiDropOffMonth)} (${formatCurrency(result.totalPmiPaid, code)} total)`
                      : undefined
                }
              />
            ) : null}
          </div>
        ) : null}

        {config.showProcessingFee ? (
          <SliderField
            label="Processing fee"
            value={feePct}
            onChange={(v) => setFeePct(Math.max(v, 0))}
            min={0}
            max={3}
            step={0.05}
            decimals={2}
            suffix="% of loan"
            hint={`One-off, charged upfront: ${formatCurrency(result.processingFee, code)}`}
          />
        ) : null}

        <MoneyField
          label="Extra payment each month"
          value={extra}
          onChange={(v) => setExtra(Math.max(v, 0))}
          min={0}
          max={Math.max(Math.round(schedule.monthlyPayment), 100)}
          step={Math.max(Math.round(scalePrice(code) / 20000), 1)}
          hint="Optional. Applied straight to principal."
        />

        {config.note ? (
          <p className="rounded-lg border border-ink-700/60 bg-ink-850/60 p-3 text-xs leading-relaxed text-slate-500">
            {config.note}
          </p>
        ) : null}

        {config.hasLiveRate && liveRate ? (
          <p className="text-xs text-slate-600">
            {liveRate.stale ? (
              <span className="text-amber-400/80">
                Estimated rate - live data unavailable
                {liveRate.message ? `. ${liveRate.message}` : ""}
              </span>
            ) : (
              <>
                Rates updated:{" "}
                <span className="text-slate-400">{formatTimestamp(liveRate.fetchedAt)}</span> &middot;{" "}
                {liveRate.source}
                {liveRate.observedOn ? `, week of ${liveRate.observedOn}` : ""}
              </>
            )}
          </p>
        ) : null}
      </section>

      <section className="space-y-4" aria-label="Results" aria-live="polite">
        <Headline
          label="Monthly payment"
          value={monthlyTotal}
          sublabel={
            config.showPropertyTax || monthlyHoa > 0
              ? "Principal, interest, tax, insurance and any monthly charges."
              : "Principal and interest, plus insurance where entered."
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <StatTile
            label="Loan amount"
            value={formatCurrency(result.loanAmount, code)}
            hint={`${formatPercent(ltv, 0)} loan-to-value`}
          />
          <StatTile
            label="Total interest"
            value={formatCurrency(schedule.totalInterest, code)}
            hint={`Over ${formatMonths(schedule.months)}`}
          />
          <StatTile label="Paid off" value={formatDate(schedule.payoffDate)} hint={formatMonths(schedule.months)} />
          <StatTile
            label="Upfront cash"
            value={formatCurrency(downPayment + result.processingFee, code)}
            hint={result.processingFee > 0 ? "Down payment + processing fee" : "Down payment"}
          />
        </div>

        {config.showPmi && pmiEnabled && result.pmiDropOffMonth ? (
          <p className="rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3 text-sm text-slate-400">
            PMI adds {formatCurrency(result.monthlyPmi, code)} a month and falls away after{" "}
            {formatMonths(result.pmiDropOffMonth)}, once the balance reaches 80% of the property
            value - about {formatCurrency(result.totalPmiPaid, code)} in total.
          </p>
        ) : null}

        {extra > 0 && interestSaved > 0 ? (
          <p className="rounded-lg border border-brand-500/25 bg-brand-500/[0.06] px-4 py-3 text-sm text-brand-200">
            Paying {formatCurrency(extra, code)} extra each month saves{" "}
            <strong className="font-semibold">{formatCurrency(interestSaved, code)}</strong> in
            interest and clears the loan {formatMonths(monthsSaved)} sooner.
          </p>
        ) : null}

        {convertedMonthly ? (
          <p className="text-xs text-slate-500">
            Monthly payment in {compareCode}:{" "}
            <span className="text-slate-300">{convertedMonthly}</span>
          </p>
        ) : null}

        <CostBreakdown
          title="What you pay each month"
          caption="The instalment your lender collects, item by item."
          code={code}
          total={monthlyTotal}
          slices={[
            {
              label: "Principal & interest",
              value: schedule.monthlyPayment + extra,
              color: VIZ.series.principal,
            },
            { label: "Property tax", value: result.monthlyTax, color: VIZ.series.tax },
            { label: "Home insurance", value: result.monthlyInsurance, color: VIZ.series.insurance },
            { label: "Mortgage insurance", value: result.monthlyPmi, color: VIZ.series.pmi },
            { label: config.hoaLabel.replace("Monthly ", ""), value: result.monthlyHoa, color: VIZ.series.hoa },
          ]}
        />
      </section>

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
