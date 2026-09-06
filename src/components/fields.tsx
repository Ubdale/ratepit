"use client";

import { useId } from "react";
import { formatNumber, parseAmount } from "@/lib/format";
import { useCurrency } from "./CurrencyProvider";

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Prefixed unit, e.g. the currency symbol. */
  prefix?: string;
  /** Suffixed unit, e.g. "%" or "years". */
  suffix?: string;
  decimals?: number;
  hint?: string;
  /** Rendered to the right of the label - used for the live-rate suggestion. */
  action?: React.ReactNode;
}

/** Number input paired with a range slider, the pattern used by every field. */
export function SliderField({
  label, value, onChange, min, max, step = 1,
  prefix, suffix, decimals = 0, hint, action,
}: SliderFieldProps) {
  const id = useId();

  const commit = (raw: string) => {
    const parsed = parseAmount(raw);
    // Let the field empty out to NaN-free zero rather than locking the cursor.
    onChange(isFinite(parsed) ? parsed : 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
        {action}
      </div>

      <div className="flex items-center gap-2">
        {prefix ? (
          <span className="shrink-0 text-sm text-slate-500" aria-hidden>
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={formatNumber(value, decimals)}
          onChange={(e) => commit(e.target.value)}
          className="field-input text-right font-mono tabular-nums"
        />
        {suffix ? (
          <span className="shrink-0 text-sm text-slate-500" aria-hidden>
            {suffix}
          </span>
        ) : null}
      </div>

      <input
        type="range"
        aria-label={`${label} slider`}
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(value, min), max)}
        onChange={(e) => onChange(Number(e.target.value))}
      />

      {hint ? <p className="text-xs text-slate-600">{hint}</p> : null}
    </div>
  );
}

/** Money field that shows the live-converted equivalent underneath. */
export function MoneyField(props: Omit<SliderFieldProps, "prefix">) {
  const { currency, compareCode, convertFormatted } = useCurrency();
  const converted = compareCode ? convertFormatted(props.value, compareCode) : null;

  return (
    <SliderField
      {...props}
      prefix={currency.symbol}
      hint={converted ? `${converted} at today's rate` : props.hint}
    />
  );
}

export function TermSelector({
  label, options, value, onChange, unit = "years",
}: {
  label: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              value === option
                ? "border-brand-500 bg-brand-500/15 text-brand-300"
                : "border-ink-700 text-slate-400 hover:border-ink-600 hover:text-slate-200"
            }`}
          >
            {option} {unit}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToggleField({
  label, checked, onChange, hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-ink-600 bg-ink-850 accent-brand-500"
      />
      <div>
        <label htmlFor={id} className="text-sm font-medium text-slate-300">
          {label}
        </label>
        {hint ? <p className="text-xs text-slate-600">{hint}</p> : null}
      </div>
    </div>
  );
}
