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
 * Each tool owns an icon on a solid colour block, so the six cards read as six
 * distinct things rather than six copies of the same box. White glyph on a
 * saturated block clears contrast on every accent in the set.
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
        width: size * 2.2,
        height: size * 2.2,
        background: accent,
        borderRadius: size * 0.75,
      }}
    >
      <Icon sx={{ fontSize: size * 1.1, color: "#FFFFFF" }} aria-hidden />
    </span>
  );
}
