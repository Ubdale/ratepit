"use client";

import { useId } from "react";
import Slider from "@mui/material/Slider";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
  /** Short explanation shown behind an info icon beside the label. */
  help?: string;
}

/** Number input paired with a slider - the pattern every field uses. */
export function SliderField({
  label, value, onChange, min, max, step = 1,
  prefix, suffix, decimals = 0, hint, action, help,
}: SliderFieldProps) {
  const id = useId();

  const commit = (raw: string) => {
    const parsed = parseAmount(raw);
    onChange(isFinite(parsed) ? parsed : 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-ink">
          {label}
          {help ? (
            <Tooltip title={help} arrow enterTouchDelay={0} leaveTouchDelay={4000}>
              <InfoOutlinedIcon
                sx={{ fontSize: 15, color: "text.disabled", cursor: "help" }}
                aria-label={`About ${label}`}
              />
            </Tooltip>
          ) : null}
        </label>
        {action}
      </div>

      <OutlinedInput
        id={id}
        fullWidth
        value={formatNumber(value, decimals)}
        onChange={(e) => commit(e.target.value)}
        inputProps={{ inputMode: "decimal", style: { textAlign: "right" } }}
        startAdornment={
          prefix ? <InputAdornment position="start">{prefix}</InputAdornment> : undefined
        }
        endAdornment={suffix ? <InputAdornment position="end">{suffix}</InputAdornment> : undefined}
      />

      <Slider
        aria-label={`${label} slider`}
        value={Math.min(Math.max(value, min), max)}
        min={min}
        max={max}
        step={step}
        onChange={(_, v) => onChange(Array.isArray(v) ? v[0] : v)}
      />

      {hint ? <p className="-mt-1 text-xs text-ink-faint">{hint}</p> : null}
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
    <div className="space-y-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      <ToggleButtonGroup
        exclusive
        value={options.includes(value) ? value : null}
        onChange={(_, v) => {
          // Null arrives when the active button is clicked again - keep the value.
          if (v !== null) onChange(v as number);
        }}
        aria-label={label}
      >
        {options.map((option) => (
          <ToggleButton key={option} value={option}>
            {option} {unit}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
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
      <Switch
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        slotProps={{ input: { "aria-label": label } }}
      />
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-ink">
          {label}
        </label>
        {hint ? <p className="mt-1 text-xs text-ink-faint">{hint}</p> : null}
      </div>
    </div>
  );
}
