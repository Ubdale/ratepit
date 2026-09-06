import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo";

// Three roles, not three decorations: serif for editorial display, sans for
// reading, mono for every figure on the site.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    `${SITE_TAGLINE}. Loan EMI, mortgage, credit card and car finance calculators that run entirely in your browser - no signup, no tracking of what you type.`,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: { siteName: SITE_NAME, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#0B0A0D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {/*
          AD SLOT: paste the AdSense loader <script> here once the account is
          approved, then swap the placeholder boxes in AdSlot.tsx for <ins> tags.
        */}
        <CurrencyProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50
                       focus:rounded-pill focus:bg-citron-400 focus:px-4 focus:py-2
                       focus:text-sm focus:font-medium focus:text-canvas"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
