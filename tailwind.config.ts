import type { Config } from "tailwindcss";

/**
 * "Editorial ledger" palette. The canvas is a warm-tinted near-black and the
 * text is warm off-white rather than cold slate - that warmth is what stops it
 * reading as another stock dark SaaS theme. Citron is the single brand accent
 * and appears roughly once per screen; coral is reserved for live/estimated
 * data notices.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#0B0A0D",
          raised: "#111016",
          sunken: "#08070A",
        },
        surface: {
          DEFAULT: "#16151C",
          hi: "#1D1B24",
          hover: "#232128",
        },
        line: {
          DEFAULT: "#2A2833",
          soft: "#201E28",
          strong: "#3A3746",
        },
        ink: {
          DEFAULT: "#F2EFE9",
          muted: "#A9A4B6",
          faint: "#726D80",
          ghost: "#4A4657",
        },
        citron: {
          50: "#F7FCE6",
          200: "#E8F9A8",
          300: "#DFF77E",
          400: "#D6F25B",
          500: "#C2E03A",
          600: "#9CBB1F",
          700: "#748C14",
        },
        coral: {
          300: "#FFA484",
          400: "#FF7A50",
          500: "#F2603A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Deliberately sparse scale - nothing between these steps.
        xs: ["0.75rem", { lineHeight: "1.1rem" }],
        sm: ["0.875rem", { lineHeight: "1.35rem" }],
        base: ["1rem", { lineHeight: "1.6rem" }],
        lg: ["1.125rem", { lineHeight: "1.7rem" }],
        xl: ["1.375rem", { lineHeight: "1.85rem" }],
        "3xl": ["2rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.75rem", { lineHeight: "2.9rem" }],
        "6xl": ["4rem", { lineHeight: "4rem" }],
        "7xl": ["5.5rem", { lineHeight: "5.2rem" }],
      },
      borderRadius: {
        card: "1.25rem",
        pill: "999px",
      },
      boxShadow: {
        lift: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 18px 40px -24px rgba(0,0,0,0.9)",
        glow: "0 0 0 1px rgba(214,242,91,0.35), 0 12px 32px -12px rgba(214,242,91,0.35)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 44s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
