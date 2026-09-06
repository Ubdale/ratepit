"use client";

import { useMemo, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { YearlyRow } from "@/lib/finance";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { CurrencyCode } from "@/lib/currencies";
import { VIZ } from "@/lib/viz";

const AXIS_STYLE = { fill: VIZ.textMuted, fontSize: 11 } as const;

function compact(value: number, code: CurrencyCode): string {
  return formatCurrency(value, code, { compact: true, decimals: value >= 1000 ? 1 : 0 });
}

interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

function ChartTooltip({
  active, payload, label, code, labelPrefix = "Year",
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  code: CurrencyCode;
  labelPrefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-ink-line bg-paper px-4 py-3 text-xs shadow-block backdrop-blur">
      <p className="mb-2 font-medium text-ink">
        {labelPrefix} {label}
      </p>
      {payload.map((entry) => (
        <div key={String(entry.dataKey)} className="flex items-center gap-2 py-0.5">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-[2px]"
            style={{ background: entry.color }}
          />
          <span className="text-ink-muted">{entry.name}</span>
          <span className="figure ml-auto text-ink">
            {formatCurrency(Number(entry.value), code)}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Shared chrome: heading, optional legend row, and a chart/table switch. */
function ChartFrame({
  title, caption, children, table, legend,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
  /** Table view of the same data - required for accessibility. */
  table: React.ReactNode;
  legend?: Array<{ label: string; color: string }>;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <figure className="card p-6">
      <figcaption className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-ink">{title}</h3>
          {caption ? <p className="mt-1 text-xs text-ink-muted">{caption}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {legend?.length ? (
            <ul className="flex flex-wrap items-center gap-3">
              {legend.map((item) => (
                <li key={item.label} className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-[3px]"
                    style={{ background: item.color }}
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="flex rounded-pill border border-ink-line p-1">
            {(["chart", "table"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
                className={`h-11 rounded-pill px-4 text-xs capitalize transition sm:h-8 sm:px-3 ${
                  view === mode ? "bg-cream-deep text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </figcaption>

      {view === "chart" ? (
        <div className="h-72 w-full">{children}</div>
      ) : (
        <div className="max-h-72 overflow-auto">{table}</div>
      )}
    </figure>
  );
}

function YearlyTable({ rows, code }: { rows: YearlyRow[]; code: CurrencyCode }) {
  return (
    <table className="w-full text-xs">
      <thead className="sticky top-0 bg-cream-deep text-left text-ink-muted">
        <tr>
          <th scope="col" className="py-1.5 pr-3 font-medium">Year</th>
          <th scope="col" className="py-1.5 pr-3 text-right font-medium">Principal</th>
          <th scope="col" className="py-1.5 pr-3 text-right font-medium">Interest</th>
          <th scope="col" className="py-1.5 text-right font-medium">Balance</th>
        </tr>
      </thead>
      <tbody className="figure text-ink-muted">
        {rows.map((row) => (
          <tr key={row.year} className="border-t border-ink-line">
            <td className="py-1.5 pr-3">{row.year}</td>
            <td className="py-1.5 pr-3 text-right">{formatCurrency(row.principal, code)}</td>
            <td className="py-1.5 pr-3 text-right">{formatCurrency(row.interest, code)}</td>
            <td className="py-1.5 text-right">{formatCurrency(row.balance, code)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Single series - balance remaining. No legend box; the title names it. */
export function BalanceChart({
  yearly, code,
}: {
  yearly: YearlyRow[];
  code: CurrencyCode;
}) {
  const data = useMemo(
    () => [
      { year: 0, balance: (yearly[0]?.balance ?? 0) + (yearly[0]?.principal ?? 0) },
      ...yearly.map((row) => ({ year: row.year, balance: row.balance })),
    ],
    [yearly],
  );

  return (
    <ChartFrame
      title="Balance remaining"
      caption="What you still owe at the end of each year."
      table={<YearlyTable rows={yearly} code={code} />}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="rp-balance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={VIZ.series.principal} stopOpacity={0.35} />
              <stop offset="100%" stopColor={VIZ.series.principal} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={VIZ.grid} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="year"
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: VIZ.grid }}
            label={{ value: "Year", position: "insideBottom", offset: -2, fill: VIZ.textMuted, fontSize: 11 }}
            height={34}
          />
          <YAxis
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            width={62}
            tickFormatter={(v: number) => compact(v, code)}
          />
          <Tooltip
            cursor={{ stroke: VIZ.axis, strokeDasharray: "3 3" }}
            content={<ChartTooltip code={code} />}
          />
          <Area
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke={VIZ.series.principal}
            strokeWidth={2}
            fill="url(#rp-balance)"
            dot={false}
            activeDot={{ r: 4, stroke: VIZ.surface, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

/** Two series - where each year's payments actually go. */
export function SplitChart({
  yearly, code,
}: {
  yearly: YearlyRow[];
  code: CurrencyCode;
}) {
  const data = useMemo(
    () =>
      yearly.map((row) => ({
        year: row.year,
        principal: row.principal,
        interest: row.interest,
      })),
    [yearly],
  );

  return (
    <ChartFrame
      title="Where each year's payments go"
      caption="Early years are mostly interest; the split flips as the balance falls."
      legend={[
        { label: "Principal", color: VIZ.series.principal },
        { label: "Interest", color: VIZ.series.interest },
      ]}
      table={<YearlyTable rows={yearly} code={code} />}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="18%">
          <CartesianGrid stroke={VIZ.grid} strokeDasharray="2 4" vertical={false} />
          <XAxis
            dataKey="year"
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={{ stroke: VIZ.grid }}
            label={{ value: "Year", position: "insideBottom", offset: -2, fill: VIZ.textMuted, fontSize: 11 }}
            height={34}
          />
          <YAxis
            tick={AXIS_STYLE}
            tickLine={false}
            axisLine={false}
            width={62}
            tickFormatter={(v: number) => compact(v, code)}
          />
          <Tooltip
            cursor={{ fill: "rgba(148,163,184,0.06)" }}
            content={<ChartTooltip code={code} />}
          />
          <Legend wrapperStyle={{ display: "none" }} />
          {/* 2px surface-coloured gap between stacked segments. */}
          <Bar
            dataKey="interest"
            name="Interest"
            stackId="split"
            fill={VIZ.series.interest}
            stroke={VIZ.surface}
            strokeWidth={2}
          />
          <Bar
            dataKey="principal"
            name="Principal"
            stackId="split"
            fill={VIZ.series.principal}
            stroke={VIZ.surface}
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export interface BreakdownSlice {
  label: string;
  value: number;
  color: string;
}

/**
 * Composition of a single total. A labelled proportional bar rather than a pie -
 * the parts are directly readable and every slice carries its own number.
 */
export function CostBreakdown({
  slices, total, code, title, caption,
}: {
  slices: BreakdownSlice[];
  total: number;
  code: CurrencyCode;
  title: string;
  caption?: string;
}) {
  const visible = slices.filter((s) => s.value > 0.005);
  const safeTotal = total > 0 ? total : 1;

  return (
    <figure className="card p-6">
      <figcaption className="mb-3">
        <h3 className="text-base font-medium text-ink">{title}</h3>
        {caption ? <p className="mt-1 text-xs text-ink-muted">{caption}</p> : null}
      </figcaption>

      <div className="flex h-4 w-full gap-1 overflow-hidden rounded-pill" role="presentation">
        {visible.map((slice) => (
          <div
            key={slice.label}
            title={`${slice.label}: ${formatCurrency(slice.value, code)}`}
            style={{
              width: `${(slice.value / safeTotal) * 100}%`,
              background: slice.color,
            }}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {visible.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2 text-sm">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
              style={{ background: slice.color }}
            />
            <span className="text-ink-muted">{slice.label}</span>
            <span className="figure ml-auto text-ink">
              {formatCurrency(slice.value, code)}
            </span>
            <span className="figure w-12 text-right text-xs text-ink-muted">
              {formatNumber((slice.value / safeTotal) * 100, 0)}%
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-2 border-t border-ink-line pt-4 text-sm">
        <span className="font-medium text-ink-muted">Total</span>
        <span className="figure ml-auto text-ink">
          {formatCurrency(total, code)}
        </span>
        <span className="w-12" />
      </div>
    </figure>
  );
}
