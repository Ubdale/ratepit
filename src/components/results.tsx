"use client";

import { useState } from "react";
import { useCurrency } from "./CurrencyProvider";
import { formatCurrency, formatDate, formatMonths } from "@/lib/format";
import type { LoanSchedule } from "@/lib/finance";

/**
 * The single headline number. Shows the live conversion underneath when the
 * user has pinned a second currency.
 */
export function Headline({
  label, value, sublabel, decimals = 0,
}: {
  label: string;
  value: number;
  sublabel?: string;
  decimals?: number;
}) {
  const { code, compareCode, convertFormatted, rates } = useCurrency();
  const converted = compareCode ? convertFormatted(value, compareCode, decimals) : null;

  return (
    <div className="rounded-xl border border-brand-500/30 bg-brand-500/[0.07] p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-brand-300/80">{label}</p>
      <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-slate-50 sm:text-4xl">
        {formatCurrency(value, code, { decimals })}
      </p>
      {converted ? (
        <p className="mt-1 text-sm text-slate-400">
          &asymp; {converted}
          {rates?.stale ? (
            <span className="ml-1 text-amber-400/80">(estimated rate)</span>
          ) : null}
        </p>
      ) : null}
      {sublabel ? <p className="mt-2 text-sm text-slate-400">{sublabel}</p> : null}
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
    <div className="rounded-lg border border-ink-700/70 bg-ink-900/50 px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p
        className={`mt-0.5 font-mono text-lg font-medium tabular-nums ${
          tone === "warn" ? "text-amber-300" : "text-slate-100"
        }`}
      >
        {value}
      </p>
      {hint ? <p className="mt-0.5 text-xs text-slate-600">{hint}</p> : null}
    </div>
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
    <section className="card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-slate-100">
            Full amortisation schedule
          </span>
          <span className="block text-xs text-slate-500">
            {schedule.months} payments &middot; paid off {formatDate(schedule.payoffDate)}
          </span>
        </span>
        <span className="shrink-0 text-xs text-brand-300">{open ? "Hide" : "Show"}</span>
      </button>

      {open ? (
        <>
          <div className="mt-4 max-h-96 overflow-auto rounded-lg border border-ink-800">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-ink-850 text-left text-slate-400">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">#</th>
                  <th scope="col" className="px-3 py-2 font-medium">Date</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Payment</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Principal</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Interest</th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody className="font-mono tabular-nums text-slate-300">
                {rows.map((row) => {
                  const date = new Date(start);
                  date.setMonth(date.getMonth() + row.period);
                  return (
                    <tr key={row.period} className="border-t border-ink-800/70">
                      <td className="px-3 py-1.5 text-slate-500">{row.period}</td>
                      <td className="px-3 py-1.5 text-slate-500">{formatDate(date)}</td>
                      <td className="px-3 py-1.5 text-right">
                        {formatCurrency(row.payment, code, { decimals: 2 })}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        {formatCurrency(row.principal, code, { decimals: 2 })}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        {formatCurrency(row.interest, code, { decimals: 2 })}
                      </td>
                      <td className="px-3 py-1.5 text-right">
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
              className="mt-3 rounded text-xs text-brand-300 underline-offset-2 hover:underline"
            >
              {showAll
                ? "Show first year only"
                : `Show all ${schedule.rows.length} payments`}
            </button>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export function payoffSummary(schedule: LoanSchedule): string {
  return `${formatMonths(schedule.months)} to clear`;
}
