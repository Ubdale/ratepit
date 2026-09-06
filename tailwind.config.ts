import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090c",
          900: "#0d0f14",
          850: "#12141b",
          800: "#171a23",
          700: "#222634",
          600: "#2f3446",
          500: "#454b61",
        },
        brand: {
          300: "#7de2c3",
          400: "#3fd4a2",
          500: "#16b981",
          600: "#0e9668",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
