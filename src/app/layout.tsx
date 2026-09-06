import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo";

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
  themeColor: "#08090c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col">
        {/*
          AD SLOT: paste the AdSense loader <script> here once the account is
          approved, then swap the placeholder boxes in AdSlot.tsx for <ins> tags.
        */}
        <CurrencyProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
                       focus:rounded focus:bg-ink-800 focus:px-3 focus:py-2 focus:text-sm"
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
