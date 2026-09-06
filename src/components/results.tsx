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
    <div className="relative overflow-hidden rounded-card border border-citron-500/25 bg-citron-400/[0.06] p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-citron-400/10 blur-3xl"
      />
      <p className="eyebrow !text-citron-600">{label}</p>
      <p className="figure mt-3 text-4xl font-medium leading-none text-ink sm:text-6xl">
        {display ?? formatCurrency(value, code, { decimals })}
      </p>
      {converted ? (
        <p className="figure mt-3 text-base text-ink-muted">
          &asymp; {converted}
          {rates?.stale ? <span className="ml-2 text-coral-400">estimated rate</span> : null}
        </p>
      ) : null}
      {sublabel ? <p className="mt-3 max-w-md text-sm text-ink-faint">{sublabel}</p> : null}
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
    <div className="min-w-0 bg-canvas-raised p-5">
      <p className="text-xs text-ink-faint">{label}</p>
      <p
        className={`figure mt-2 break-words text-lg font-medium sm:text-xl ${
          tone === "warn" ? "text-coral-300" : "text-ink"
        }`}
      >
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-ink-ghost">{hint}</p> : null}
    </div>
  );
}

/** Hairline-separated grid of stat tiles. */
export function StatGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line min-[400px]:grid-cols-2">
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
      className={`rounded-card border p-5 text-sm leading-relaxed ${
        tone === "brand"
          ? "border-citron-500/25 bg-citron-400/[0.06] text-citron-200"
          : "border-line bg-canvas-raised text-ink-muted"
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
    <section className="panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-surface-hi"
      >
        <span>
          <span className="block text-base font-medium text-ink">Full amortisation schedule</span>
          <span className="figure mt-1 block text-xs text-ink-faint">
            {schedule.months} payments &middot; paid off {formatDate(schedule.payoffDate)}
          </span>
        </span>
        <span className="chip !h-9 shrink-0 !px-4">{open ? "Hide" : "Show"}</span>
      </button>

      {open ? (
        <div className="border-t border-line px-6 pb-6">
          <div className="mt-4 max-h-96 overflow-auto rounded-xl border border-line">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-surface-hi text-left">
                <tr>
                  {["#", "Date", "Payment", "Principal", "Interest", "Balance"].map((h, i) => (
                    <th
                      key={h}
                      scope="col"
                      className={`px-4 py-3 font-mono text-xs font-normal uppercase tracking-wider
                                  text-ink-faint ${i > 1 ? "text-right" : ""}`}
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
                    <tr key={row.period} className="border-t border-line-soft">
                      <td className="px-4 py-2.5 text-ink-ghost">{row.period}</td>
                      <td className="px-4 py-2.5 text-ink-ghost">{formatDate(date)}</td>
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
              className="mt-4 text-sm text-citron-400 underline-offset-4 hover:underline"
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
