"use client";

import { createTheme, alpha } from "@mui/material/styles";

/**
 * MUI themed to the Ratepit system rather than stock Material: warm-tinted
 * near-black surfaces, warm off-white text, citron as the single accent and
 * coral reserved for degraded/estimated data. Every control clears a 44px
 * touch target.
 *
 * Keep these in step with tailwind.config.ts - Tailwind owns layout, MUI owns
 * the controls.
 */
const CANVAS = "#0B0A0D";
const CANVAS_RAISED = "#111016";
const SURFACE = "#16151C";
const SURFACE_HI = "#1D1B24";
const LINE = "#2A2833";
const LINE_STRONG = "#3A3746";
const INK = "#F2EFE9";
const INK_MUTED = "#A9A4B6";
const INK_FAINT = "#726D80";
const CITRON = "#D6F25B";
const CITRON_DIM = "#C2E03A";
const CORAL = "#FF7A50";

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: { main: CITRON, dark: CITRON_DIM, contrastText: CANVAS },
    secondary: { main: CORAL, contrastText: CANVAS },
    warning: { main: CORAL },
    background: { default: CANVAS, paper: SURFACE },
    text: { primary: INK, secondary: INK_MUTED, disabled: INK_FAINT },
    divider: LINE,
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    button: { textTransform: "none", fontWeight: 500, letterSpacing: 0 },
    h1: { fontFamily: "var(--font-display), Georgia, serif", fontWeight: 400 },
    h2: { fontFamily: "var(--font-display), Georgia, serif", fontWeight: 400 },
    h3: { fontFamily: "var(--font-display), Georgia, serif", fontWeight: 400 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        // v9 dropped the per-variant slots, so target the variant classes here.
        root: {
          borderRadius: 999,
          minHeight: 44,
          paddingInline: 24,
          "&.MuiButton-containedPrimary:hover": { backgroundColor: "#DFF77E" },
          "&.MuiButton-outlined": {
            borderColor: LINE_STRONG,
            color: INK,
            "&:hover": { borderColor: INK_FAINT, backgroundColor: SURFACE },
          },
        },
      },
    },

    MuiSlider: {
      styleOverrides: {
        root: { height: 4, padding: "20px 0", boxSizing: "content-box" },
        rail: { backgroundColor: LINE, opacity: 1 },
        track: { border: "none", backgroundColor: CITRON_DIM },
        thumb: {
          width: 20,
          height: 20,
          backgroundColor: CITRON,
          border: "4px solid " + CANVAS,
          "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 8px " + alpha(CITRON, 0.16) },
          "&.Mui-active": { boxShadow: "0 0 0 12px " + alpha(CITRON, 0.2) },
        },
        valueLabel: {
          backgroundColor: SURFACE_HI,
          borderRadius: 8,
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.75rem",
        },
        markLabel: { color: INK_FAINT, fontSize: "0.7rem" },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: CANVAS_RAISED,
          borderRadius: 12,
          minHeight: 48,
          fontFamily: "var(--font-mono), monospace",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: LINE },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: LINE_STRONG },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: CITRON_DIM,
            borderWidth: 1,
          },
        },
        input: { paddingBlock: 12 },
      },
    },

    MuiInputAdornment: {
      styleOverrides: {
        root: {
          "& .MuiTypography-root": {
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.875rem",
            color: INK_FAINT,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: { root: { color: INK_MUTED, "&.Mui-focused": { color: CITRON } } },
    },

    MuiToggleButtonGroup: {
      styleOverrides: {
        root: { flexWrap: "wrap", gap: 8 },
        grouped: {
          border: "1px solid " + LINE,
          borderRadius: "999px !important",
          marginLeft: "0 !important",
        },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 16,
          borderRadius: 999,
          color: INK_MUTED,
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.875rem",
          "&:hover": { backgroundColor: SURFACE_HI, color: INK },
          "&.Mui-selected": {
            backgroundColor: alpha(CITRON, 0.12),
            borderColor: CITRON_DIM,
            color: "#DFF77E",
            "&:hover": { backgroundColor: alpha(CITRON, 0.2) },
          },
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: { width: 56, height: 44, padding: 10 },
        switchBase: {
          // Explicit box: padding alone left a 40px target.
          padding: 12,
          height: 44,
          width: 44,
          boxSizing: "border-box",
          "&.Mui-checked": {
            transform: "translateX(20px)",
            color: CITRON,
            "& + .MuiSwitch-track": { backgroundColor: alpha(CITRON, 0.32), opacity: 1 },
          },
        },
        thumb: { width: 20, height: 20 },
        track: { borderRadius: 999, backgroundColor: LINE_STRONG, opacity: 1 },
      },
    },

    MuiAccordion: {
      defaultProps: { disableGutters: true, elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          borderBottom: "1px solid " + LINE,
          "&::before": { display: "none" },
          "&:last-of-type": { borderBottom: "none" },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: { minHeight: 56, paddingInline: 0 },
        content: { marginBlock: 12 },
      },
    },

    MuiAccordionDetails: {
      styleOverrides: { root: { paddingInline: 0, paddingTop: 0 } },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: SURFACE_HI,
          border: "1px solid " + LINE,
          fontSize: "0.75rem",
          padding: "8px 12px",
          borderRadius: 10,
        },
        arrow: { color: SURFACE_HI },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontFamily: "var(--font-mono), monospace" },
        outlined: { borderColor: LINE },
      },
    },

    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },

    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 6, borderRadius: 999, backgroundColor: LINE },
        bar: { borderRadius: 999 },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: { backgroundColor: SURFACE, border: "1px solid " + LINE, backgroundImage: "none" },
      },
    },

    MuiMenuItem: { styleOverrides: { root: { minHeight: 44, fontSize: "0.875rem" } } },

    MuiSelect: { styleOverrides: { select: { paddingBlock: 12 } } },
  },
});
