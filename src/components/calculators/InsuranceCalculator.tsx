"use client";

import { useMemo, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useCurrency } from "@/components/CurrencyProvider";
import { MoneyField, SliderField, TermSelector, ToggleField } from "@/components/fields";
import { CostBreakdown } from "@/components/charts";
import { Headline, Insight, StatGrid, StatTile } from "@/components/results";
import {
  estimateAuto, estimateHealth, estimateTermLife,
  type CoverType, type PremiumEstimate,
} from "@/lib/insurance";
import { formatCurrency, formatNumber } from "@/lib/format";
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

const SEX_OPTIONS = ["female", "male", "unspecified"] as const;

export function InsuranceCalculator() {
  const { code, compareCode, convertFormatted } = useCurrency();
  const [cover, setCover] = useState<CoverType>("term-life");

  // Shared
  const [age, setAge] = useState(35);
  const [smoker, setSmoker] = useState(false);

  // Life
  const [lifeCover, setLifeCover] = useState(() => scale(500000, "USD"));
  const [lifeTerm, setLifeTerm] = useState(20);
  const [sex, setSex] = useState<(typeof SEX_OPTIONS)[number]>("unspecified");

  // Health
  const [healthCover, setHealthCover] = useState(() => scale(100000, "USD"));
  const [members, setMembers] = useState(1);
  const [healthExcess, setHealthExcess] = useState(() => scale(1000, "USD"));

  // Auto
  const [vehicleValue, setVehicleValue] = useState(() => scale(25000, "USD"));
  const [ncd, setNcd] = useState(5);
  const [claims, setClaims] = useState(0);
  const [autoExcess, setAutoExcess] = useState(() => scale(500, "USD"));
  const [comprehensive, setComprehensive] = useState(true);

  const [touched, setTouched] = useState(false);

  const v = useMemo(
    () => ({
      lifeCover: touched ? lifeCover : scale(500000, code),
      healthCover: touched ? healthCover : scale(100000, code),
      healthExcess: touched ? healthExcess : scale(1000, code),
      vehicleValue: touched ? vehicleValue : scale(25000, code),
      autoExcess: touched ? autoExcess : scale(500, code),
    }),
    [touched, lifeCover, healthCover, healthExcess, vehicleValue, autoExcess, code],
  );

  const estimate: PremiumEstimate = useMemo(() => {
    if (cover === "term-life") {
      return estimateTermLife({
        age, coverAmount: v.lifeCover, termYears: lifeTerm, smoker, sex,
      });
    }
    if (cover === "health") {
      return estimateHealth({
        age, coverAmount: v.healthCover, members, smoker, excess: v.healthExcess,
      });
    }
    return estimateAuto({
      vehicleValue: v.vehicleValue,
      driverAge: age,
      noClaimsYears: ncd,
      recentClaims: claims,
      excess: v.autoExcess,
      comprehensive,
    });
  }, [
    cover, age, smoker, sex, lifeTerm, members, ncd, claims, comprehensive,
    v.lifeCover, v.healthCover, v.healthExcess, v.vehicleValue, v.autoExcess,
  ]);

  const converted = compareCode ? convertFormatted(estimate.monthly, compareCode) : null;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="min-w-0 space-y-8 rounded-card border-2 border-ink bg-paper p-6 sm:p-8" aria-label="Cover details">
        <div>
          <p className="eyebrow">Inputs</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Your cover</h2>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-ink">Type of cover</span>
          <ToggleButtonGroup
            exclusive
            value={cover}
            onChange={(_, x) => {
              if (x !== null) setCover(x as CoverType);
            }}
            aria-label="Type of cover"
          >
            <ToggleButton value="term-life">Term life</ToggleButton>
            <ToggleButton value="health">Health</ToggleButton>
            <ToggleButton value="auto">Motor</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <SliderField
          label={cover === "auto" ? "Driver age" : "Your age"}
          value={age}
          onChange={(x) => setAge(Math.min(Math.max(x, 18), 85))}
          min={18}
          max={85}
          suffix="years"
        />

        {cover === "term-life" ? (
          <>
            <MoneyField
              label="Cover amount"
              value={v.lifeCover}
              onChange={(x) => {
                setTouched(true);
                setLifeCover(Math.max(x, 0));
              }}
              min={0}
              max={scale(3000000, code)}
              step={scale(25000, code)}
              help="The lump sum paid out on death. A common rule of thumb is 10-12x annual income."
            />
            <TermSelector
              label="Policy term"
              options={[10, 15, 20, 25, 30]}
              value={lifeTerm}
              onChange={setLifeTerm}
            />
            <div className="space-y-2">
              <span className="text-sm font-medium text-ink">Sex</span>
              <ToggleButtonGroup
                exclusive
                value={sex}
                onChange={(_, x) => {
                  if (x !== null) setSex(x as (typeof SEX_OPTIONS)[number]);
                }}
                aria-label="Sex"
              >
                <ToggleButton value="female">Female</ToggleButton>
                <ToggleButton value="male">Male</ToggleButton>
                <ToggleButton value="unspecified">Not stated</ToggleButton>
              </ToggleButtonGroup>
              <p className="text-xs text-ink-muted">
                Used only as a rating factor. Some markets, including the EU, require unisex pricing.
              </p>
            </div>
          </>
        ) : null}

        {cover === "health" ? (
          <>
            <MoneyField
              label="Annual cover limit"
              value={v.healthCover}
              onChange={(x) => {
                setTouched(true);
                setHealthCover(Math.max(x, 0));
              }}
              min={0}
              max={scale(1000000, code)}
              step={scale(10000, code)}
            />
            <SliderField
              label="People on the policy"
              value={members}
              onChange={(x) => setMembers(Math.min(Math.max(Math.round(x), 1), 8))}
              min={1}
              max={8}
              suffix={members === 1 ? "person" : "people"}
            />
            <MoneyField
              label="Excess / deductible"
              value={v.healthExcess}
              onChange={(x) => {
                setTouched(true);
                setHealthExcess(Math.max(x, 0));
              }}
              min={0}
              max={scale(20000, code)}
              step={scale(250, code)}
              help="What you pay before cover starts. Raising it is the main lever on the premium."
            />
          </>
        ) : null}

        {cover === "auto" ? (
          <>
            <MoneyField
              label="Vehicle value"
              value={v.vehicleValue}
              onChange={(x) => {
                setTouched(true);
                setVehicleValue(Math.max(x, 0));
              }}
              min={0}
              max={scale(200000, code)}
              step={scale(500, code)}
            />
            <SliderField
              label="Years no claims"
              value={ncd}
              onChange={(x) => setNcd(Math.min(Math.max(Math.round(x), 0), 15))}
              min={0}
              max={15}
              suffix="years"
            />
            <SliderField
              label="At-fault claims (last 5 years)"
              value={claims}
              onChange={(x) => setClaims(Math.min(Math.max(Math.round(x), 0), 5))}
              min={0}
              max={5}
              suffix={claims === 1 ? "claim" : "claims"}
            />
            <MoneyField
              label="Excess"
              value={v.autoExcess}
              onChange={(x) => {
                setTouched(true);
                setAutoExcess(Math.max(x, 0));
              }}
              min={0}
              max={scale(5000, code)}
              step={scale(100, code)}
            />
            <ToggleField
              label="Comprehensive cover"
              checked={comprehensive}
              onChange={setComprehensive}
              hint="Third-party only is cheaper but pays nothing towards your own vehicle."
            />
          </>
        ) : null}

        {cover !== "auto" ? (
          <ToggleField
            label="Smoker"
            checked={smoker}
            onChange={setSmoker}
            hint="Includes vaping and other nicotine use for most insurers."
          />
        ) : null}
      </section>

      <section
        className="min-w-0 space-y-4 lg:sticky lg:top-28"
        aria-label="Results"
        aria-live="polite"
      >
        <Headline
          label="Estimated monthly premium"
          value={estimate.monthly}
          sublabel={`Around ${formatCurrency(estimate.annual, code)} a year. This is a modelled estimate, not a quote.`}
        />

        <div className="rounded-card border-2 border-ink bg-coral-soft p-6">
          <p className="text-base text-ink">
            <strong className="font-bold">Realistic range:</strong>{" "}
            {formatCurrency(estimate.annualLow / 12, code)} to{" "}
            {formatCurrency(estimate.annualHigh / 12, code)} a month.
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            No free public API publishes live premiums, so Ratepit models published rate-table
            shapes rather than inventing a quote. Treat the midpoint as a starting point for
            shopping, never as a price.
          </p>
        </div>

        <StatGrid>
          <StatTile
            label="Annual premium"
            value={formatCurrency(estimate.annual, code)}
            hint="Midpoint estimate"
          />
          <StatTile
            label="Range"
            value={`${formatCurrency(estimate.annualLow, code)} - ${formatCurrency(estimate.annualHigh, code)}`}
            hint="Per year, before underwriting"
          />
          <StatTile
            label={cover === "term-life" ? "Cost per year of cover" : "Cost per month"}
            value={formatCurrency(estimate.monthly, code)}
            hint={cover === "term-life" ? `Over ${lifeTerm} years` : undefined}
          />
          <StatTile
            label={cover === "term-life" ? "Total across term" : "Over 5 years"}
            value={formatCurrency(
              cover === "term-life" ? estimate.annual * lifeTerm : estimate.annual * 5,
              code,
            )}
            hint="If the price never changed"
          />
        </StatGrid>

        <div className="card p-6">
          <h3 className="text-base font-medium text-ink">What drives this price</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Each factor multiplies the base rate. Above 1 raises the premium; below 1 lowers it.
          </p>
          <ul className="mt-4 space-y-3">
            {estimate.factors.map((f) => (
              <li key={f.label}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-ink-muted">{f.label}</span>
                  <span
                    className={`figure text-sm ${
                      f.multiplier > 1.02
                        ? "text-coral-deep"
                        : f.multiplier < 0.98
                          ? "text-violet"
                          : "text-ink-muted"
                    }`}
                  >
                    &times;{formatNumber(f.multiplier, 2)}
                  </span>
                </div>
                {f.note ? <p className="mt-0.5 text-xs text-ink-muted">{f.note}</p> : null}
              </li>
            ))}
          </ul>
        </div>

        {converted ? (
          <p className="text-xs text-ink-muted">
            Monthly premium in {compareCode}:{" "}
            <span className="figure text-ink-muted">{converted}</span>
          </p>
        ) : null}

        <CostBreakdown
          title="Premium against cover"
          caption="What a year of premium buys you in protection."
          code={code}
          total={
            cover === "term-life"
              ? v.lifeCover
              : cover === "health"
                ? v.healthCover
                : v.vehicleValue
          }
          slices={[
            {
              label: "Cover provided",
              value:
                (cover === "term-life"
                  ? v.lifeCover
                  : cover === "health"
                    ? v.healthCover
                    : v.vehicleValue) - estimate.annual,
              color: VIZ.series.principal,
            },
            { label: "Annual premium", value: estimate.annual, color: VIZ.series.interest },
          ]}
        />

        <Insight tone="neutral">
          <strong className="font-medium text-ink">What this cannot know:</strong>{" "}
          {estimate.caveats.join(" ")}
        </Insight>
      </section>
    </div>
  );
}
