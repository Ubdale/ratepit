"use client";

import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import { toolAccent } from "@/lib/tools";

/**
 * Each tool gets its own icon and accent so the cards read as six distinct
 * things rather than six copies of the same box. Accents are drawn from the
 * chart palette, which is already validated for contrast on this surface.
 */
const ICONS: Record<string, SvgIconComponent> = {
  "/loan-emi-calculator": PaymentsOutlinedIcon,
  "/mortgage-calculator": HomeOutlinedIcon,
  "/credit-card-payoff-calculator": CreditCardOutlinedIcon,
  "/car-loan-calculator": DirectionsCarFilledOutlinedIcon,
  "/loan-eligibility-calculator": AccountBalanceOutlinedIcon,
  "/insurance-calculator": ShieldOutlinedIcon,
};

export function ToolIcon({
  path,
  size = 22,
  className = "",
}: {
  path: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[path];
  if (!Icon) return null;
  const accent = toolAccent(path);

  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl ${className}`}
      style={{
        width: size * 2,
        height: size * 2,
        background: `linear-gradient(140deg, ${accent}26, ${accent}0A)`,
        border: `1px solid ${accent}38`,
      }}
    >
      <Icon sx={{ fontSize: size, color: accent }} aria-hidden />
    </span>
  );
}
