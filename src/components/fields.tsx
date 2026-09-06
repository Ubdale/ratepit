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
    onChange(isFinite(parsed) ? parsed : 0);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        {action}
      </div>

      <div className="field-shell">
        {prefix ? (
          <span className="shrink-0 font-mono text-sm text-ink-faint" aria-hidden>
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={formatNumber(value, decimals)}
          onChange={(e) => commit(e.target.value)}
          className="w-full min-w-0 flex-1 bg-transparent text-right font-mono text-base
                     text-ink outline-none"
        />
        {suffix ? (
          <span className="shrink-0 font-mono text-sm text-ink-faint" aria-hidden>
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

      {hint ? <p className="text-xs text-ink-faint">{hint}</p> : null}
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
  label, options, value, onChange, unit = "yr",
}: {
  label: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}) {
  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            className={`chip !px-4 font-mono ${value === option ? "chip-active" : ""}`}
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
    <div className="flex items-center gap-3 rounded-xl border border-line bg-canvas-raised/60 p-4">
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="-my-2.5 -ml-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-pill"
      >
        <span
          aria-hidden
          className={`relative block h-6 w-11 rounded-pill border transition ${
            checked ? "border-citron-500 bg-citron-400/30" : "border-line-strong bg-surface"
          }`}
        >
          <span
            className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-pill transition-all ${
              checked ? "left-6 bg-citron-400" : "left-1 bg-ink-ghost"
            }`}
          />
        </span>
      </button>
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-ink">
          {label}
        </label>
        {hint ? <p className="mt-1 text-xs text-ink-faint">{hint}</p> : null}
      </div>
    </div>
  );
}
