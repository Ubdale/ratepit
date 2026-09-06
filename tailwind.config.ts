import type { Config } from "tailwindcss";

/**
 * "Bright fintech" system. A warm cream canvas carries the page, cards are
 * white, and each tool owns a saturated colour block. Type is oversized and
 * shapes are heavily rounded - the energy comes from colour and scale, not
 * from decoration.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FFF8EF",
          deep: "#FCEFE1",
          sunken: "#F7E7D6",
        },
        paper: "#FFFFFF",
        ink: {
          DEFAULT: "#181310",
          soft: "#4A4139",
          muted: "#5F554D",
          faint: "#766B61",
          line: "#E9DCCC",
          lineStrong: "#D9C7B2",
        },
        // Tool + accent blocks. Deliberately saturated.
        violet: { DEFAULT: "#6D4AFF", deep: "#4B29D6", soft: "#EDE7FF" },
        coral: { DEFAULT: "#FF5C4D", deep: "#DB3A2B", soft: "#FFE6E2" },
        mint: { DEFAULT: "#00C08B", deep: "#00966C", soft: "#DEF8EF" },
        sky: { DEFAULT: "#2E9BFF", deep: "#1470CC", soft: "#E1F0FF" },
        amber: { DEFAULT: "#FFA33D", deep: "#D97A0B", soft: "#FFF0DC" },
        pink: { DEFAULT: "#FF5FA2", deep: "#D63277", soft: "#FFE4F0" },
        lime: { DEFAULT: "#C6F24F", deep: "#8FB914", soft: "#F2FCD9" },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.1rem" }],
        sm: ["0.875rem", { lineHeight: "1.4rem" }],
        base: ["1rem", { lineHeight: "1.65rem" }],
        lg: ["1.1875rem", { lineHeight: "1.8rem" }],
        xl: ["1.5rem", { lineHeight: "1.9rem" }],
        "3xl": ["2.25rem", { lineHeight: "2.4rem" }],
        "4xl": ["3rem", { lineHeight: "3.05rem" }],
        "6xl": ["4.5rem", { lineHeight: "4.3rem" }],
        "7xl": ["6rem", { lineHeight: "5.6rem" }],
      },
      borderRadius: {
        card: "1.75rem",
        block: "2.5rem",
        pill: "999px",
      },
      boxShadow: {
        block: "0 2px 0 0 rgba(24,19,16,0.06), 0 24px 48px -32px rgba(24,19,16,0.30)",
        lift: "0 18px 40px -28px rgba(24,19,16,0.45)",
        pop: "0 10px 0 0 var(--pop-color, #181310)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
