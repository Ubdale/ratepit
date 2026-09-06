/**
 * Chart tokens. Steps are taken from the categorical palette for a dark
 * surface and validated as a set against the Ratepit chart surface (#16151C):
 * lightness band, chroma floor, CVD separation, normal-vision separation and
 * >=3:1 contrast all pass. Do not substitute hues without re-validating.
 */
export const VIZ = {
  surface: "#16151C",
  grid: "#2A2833",
  axis: "#4A4657",
  textPrimary: "#F2EFE9",
  textSecondary: "#A9A4B6",
  textMuted: "#726D80",
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
