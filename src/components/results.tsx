"use client";

import { useState } from "react";
import { useCurrency } from "./CurrencyProvider";
import { formatCurrency, formatDate, formatMonths } from "@/lib/format";
import type { LoanSchedule } from "@/lib/finance";

/**
 * The single headline number, and the loudest thing on the page. Shows the live
 * conversion underneath when the user has pinned a second currency.
 */
export function Headline({
  label, value, sublabel, decimals = 0, display,
}: {
  label: string;
  value: number;
  sublabel?: string;
  decimals?: number;
  /**
   * Overrides the formatted currency for headlines that are not money -
   * a payoff duration, for instance. Suppresses the conversion line.
   */
  display?: string;
}) {
  const { code, compareCode, convertFormatted, rates } = useCurrency();
  const converted =
    display || !compareCode ? null : convertFormatted(value, compareCode, decimals);

  return (
    <div className="relative overflow-hidden rounded-block bg-violet p-8 text-white sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-white/[0.07]"
      />
      <p className="relative font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white">
        {label}
      </p>
      <p className="figure relative mt-4 font-bold leading-none text-[clamp(2rem,8.5vw,4.5rem)] sm:text-[clamp(2.5rem,4.5vw,5.5rem)]">
        {display ?? formatCurrency(value, code, { decimals })}
      </p>
      {converted ? (
        <p className="figure relative mt-4 text-lg text-white">
          &asymp; {converted}
          {rates?.stale ? <span className="ml-2 text-lime">estimated rate</span> : null}
        </p>
      ) : null}
      {sublabel ? (
        <p className="relative mt-4 max-w-md text-base text-white">{sublabel}</p>
      ) : null}
    </div>
  );
}

export function StatTile({
  label, value, hint, tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn";
}) {
  return (
    <div className="min-w-0 bg-paper p-6">
      <p className="text-sm font-medium text-ink-muted">{label}</p>
      <p
        className={`figure mt-2 break-words text-xl font-bold sm:text-3xl ${
          tone === "warn" ? "text-coral-deep" : "text-ink"
        }`}
      >
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

/** Hairline-separated grid of stat tiles. */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-ink-line bg-line min-[400px]:grid-cols-2">
      {children}
    </div>
  );
}

/** A callout for a genuinely useful finding, not decoration. */
export function Insight({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "neutral";
}) {
  return (
    <p
      className={`rounded-card p-6 text-base leading-relaxed ${
        tone === "brand"
          ? "bg-lime text-ink"
          : "border-2 border-ink-line bg-paper text-ink-soft"
      }`}
    >
      {children}
    </p>
  );
}

/** Full month-by-month schedule, collapsed by default to keep the page light. */
export function AmortizationTable({ schedule }: { schedule: LoanSchedule }) {
  const { code } = useCurrency();
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (!schedule.rows.length) return null;

  const rows = showAll ? schedule.rows : schedule.rows.slice(0, 12);
  const start = new Date();

  return (
    <section className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-cream-deep"
      >
        <span>
          <span className="block text-base font-medium text-ink">Full amortisation schedule</span>
          <span className="figure mt-1 block text-xs text-ink-muted">
            {schedule.months} payments &middot; paid off {formatDate(schedule.payoffDate)}
          </span>
        </span>
        <span className="chip !h-9 shrink-0 !px-4">{open ? "Hide" : "Show"}</span>
      </button>

      {open ? (
        <div className="border-t border-ink-line px-6 pb-6">
          <div className="mt-4 max-h-96 overflow-auto rounded-xl border border-ink-line">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-cream-deep text-left">
                <tr>
                  {["#", "Date", "Payment", "Principal", "Interest", "Balance"].map((h, i) => (
                    <th
                      key={h}
                      scope="col"
                      className={`px-4 py-3 font-mono text-xs font-normal uppercase tracking-wider
                                  text-ink-muted ${i > 1 ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="figure text-ink-muted">
                {rows.map((row) => {
                  const date = new Date(start);
                  date.setMonth(date.getMonth() + row.period);
                  return (
                    <tr key={row.period} className="border-t border-ink-line">
                      <td className="px-4 py-2.5 text-ink-muted">{row.period}</td>
                      <td className="px-4 py-2.5 text-ink-muted">{formatDate(date)}</td>
                      <td className="px-4 py-2.5 text-right">
                        {formatCurrency(row.payment, code, { decimals: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {formatCurrency(row.principal, code, { decimals: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {formatCurrency(row.interest, code, { decimals: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-right text-ink">
                        {formatCurrency(row.balance, code, { decimals: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {schedule.rows.length > 12 ? (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 text-sm text-violet underline-offset-4 hover:underline"
            >
              {showAll ? "Show first year only" : `Show all ${schedule.rows.length} payments`}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export function payoffSummary(schedule: LoanSchedule): string {
  return `${formatMonths(schedule.months)} to clear`;
}
