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
const CANVAS = "#FFF8EF";
const CANVAS_RAISED = "#FFFFFF";
const SURFACE = "#FFFFFF";
const SURFACE_HI = "#FCEFE1";
const LINE = "#E9DCCC";
const LINE_STRONG = "#D9C7B2";
const INK = "#181310";
const INK_MUTED = "#5F554D";
const INK_FAINT = "#766B61";
const CITRON = "#6D4AFF";      // brand accent (violet)
const CITRON_DIM = "#4B29D6";
const CORAL = "#FF5C4D";

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: CITRON, dark: CITRON_DIM, contrastText: "#FFFFFF" },
    secondary: { main: CORAL, contrastText: "#FFFFFF" },
    warning: { main: CORAL },
    background: { default: CANVAS, paper: SURFACE },
    text: { primary: INK, secondary: INK_MUTED, disabled: INK_FAINT },
    divider: LINE,
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    button: { textTransform: "none", fontWeight: 500, letterSpacing: 0 },
    h1: { fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 700 },
    h2: { fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 700 },
    h3: { fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        // v9 dropped the per-variant slots, so target the variant classes here.
        root: {
          borderRadius: 999,
          minHeight: 48,
          paddingInline: 24,
          fontWeight: 600,
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
        root: { height: 6, padding: "19px 0", boxSizing: "content-box" },
        rail: { backgroundColor: "#F0E4D6", opacity: 1 },
        track: { border: "none", backgroundColor: CITRON_DIM },
        thumb: {
          width: 22,
          height: 22,
          backgroundColor: CITRON,
          border: "3px solid #FFFFFF",
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
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          minHeight: 56,
          fontSize: "1.0625rem",
          fontFamily: "var(--font-mono), monospace",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: LINE },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: LINE_STRONG },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: CITRON,
            borderWidth: 2,
          },
        },
        input: { paddingBlock: 12, minWidth: 0 },
      },
    },

    MuiInputAdornment: {
      styleOverrides: {
        root: {
          // A unit label must never wrap: "% p.a." was breaking onto two lines
          // inside a 48px field and colliding with the value.
          whiteSpace: "nowrap",
          "& .MuiTypography-root": {
            whiteSpace: "nowrap",
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
          border: "2px solid " + LINE,
          borderRadius: "999px !important",
          marginLeft: "0 !important",
        },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 18,
          borderRadius: 999,
          fontWeight: 600,
          color: INK_MUTED,
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.875rem",
          "&:hover": { backgroundColor: SURFACE_HI, color: INK },
          "&.Mui-selected": {
            backgroundColor: INK,
            borderColor: INK,
            color: "#FFF8EF",
            "&:hover": { backgroundColor: INK, color: "#FFF8EF" },
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
        track: { borderRadius: 999, backgroundColor: "#DCCDBA", opacity: 1 },
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
          backgroundColor: INK,
          color: "#FFF8EF",
          border: "none",
          fontSize: "0.75rem",
          padding: "8px 12px",
          borderRadius: 10,
        },
        arrow: { color: INK },
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
        root: { height: 10, borderRadius: 999, backgroundColor: "#F0E4D6" },
        bar: { borderRadius: 999 },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          border: "2px solid " + INK,
          borderRadius: 16,
          backgroundImage: "none",
          boxShadow: "0 18px 40px -28px rgba(24,19,16,0.45)",
        },
      },
    },

    MuiMenuItem: { styleOverrides: { root: { minHeight: 44, fontSize: "0.875rem" } } },

    MuiSelect: { styleOverrides: { select: { paddingBlock: 12 } } },
  },
});
