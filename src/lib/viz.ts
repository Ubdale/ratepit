/**
 * Chart tokens. Steps are taken from the categorical palette for a dark
 * surface and validated as a set against the Ratepit chart surface (#0d0f14):
 * lightness band, chroma floor, CVD separation, normal-vision separation and
 * >=3:1 contrast all pass. Do not substitute hues without re-validating.
 */
export const VIZ = {
  surface: "#0d0f14",
  grid: "#222634",
  axis: "#454b61",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  series: {
    principal: "#199e70", // aqua
    interest: "#d95926",  // orange
    tax: "#3987e5",       // blue
    insurance: "#c98500", // yellow
    pmi: "#d55181",       // magenta
    hoa: "#9085e9",       // violet
  },
} as const;

export type SeriesKey = keyof typeof VIZ.series;
