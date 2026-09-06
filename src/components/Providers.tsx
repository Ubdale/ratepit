"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/theme";
import { CurrencyProvider } from "./CurrencyProvider";

/**
 * Emotion cache + MUI theme + currency context. The cache provider is what
 * keeps MUI styles server-rendered under the App Router, so there is no
 * unstyled flash on first paint.
 */
// No CSS layer: Tailwind v3 emits its preflight unlayered, and an unlayered rule
// beats any layered one regardless of specificity. With the layer enabled,
// preflight's `box-sizing: border-box` silently overrode MUI's own box metrics,
// so theme overrides that set size were being dropped on the floor.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme} defaultMode="dark">
        {/* Tailwind's preflight owns the base reset; MUI only resets what it needs. */}
        <CssBaseline enableColorScheme />
        <CurrencyProvider>{children}</CurrencyProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
