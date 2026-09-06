/**
 * Chart tokens. Steps are taken from the categorical palette for a light
 * surface and validated as a set against the Ratepit chart surface (#FFFFFF):
 * lightness band, chroma floor, CVD separation, normal-vision separation and
 * >=3:1 contrast all pass. Do not substitute hues without re-validating.
 */
export const VIZ = {
  surface: "#FFFFFF",
  grid: "#EFE3D5",
  axis: "#C9B9A6",
  textPrimary: "#181310",
  textSecondary: "#4A4139",
  textMuted: "#9C9188",
  series: {
    principal: "#0E8F63", // green
    interest: "#DB4E1F",  // orange
    tax: "#1F6FD0",       // blue
    insurance: "#B07800", // amber
    pmi: "#C93F7B",       // magenta
    hoa: "#5B45C9",       // violet
  },
} as const;

export type SeriesKey = keyof typeof VIZ.series;
