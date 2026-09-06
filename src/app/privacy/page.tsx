import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Ratepit does and does not collect. Every calculation runs in your browser; the only network requests are for public exchange and interest rates.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">Privacy</h1>
      <p className="mt-2 text-sm text-slate-500">
        The short version: {SITE_NAME} never sees the numbers you type.
      </p>

      <div className="prose-ratepit mt-8">
        <h3>What stays on your device</h3>
        <p>
          Every calculation - loan amounts, rates, terms, property prices, extra payments - is
          computed in JavaScript inside your browser. Those values are never sent to our servers,
          because there is no server-side calculation to send them to.
        </p>

        <h3>What we store locally</h3>
        <p>
          Two small preferences are kept in your browser&apos;s <code>localStorage</code> so the site
          remembers them between visits: your selected currency, and your optional second currency
          for conversion. Cached exchange rates and the cached US average mortgage rate are also kept
          there for about an hour to avoid repeat requests. All of it stays on your device and can be
          cleared at any time through your browser settings.
        </p>

        <h3>What we request from the network</h3>
        <ul>
          <li>
            <strong>Exchange rates</strong> from the Frankfurter API (European Central Bank reference
            rates), with a secondary source for currencies the ECB does not publish.
          </li>
          <li>
            <strong>The US 30-year average mortgage rate</strong> from FRED at the Federal Reserve
            Bank of St. Louis.
          </li>
        </ul>
        <p>
          Both are proxied through this site so no third party receives your IP address directly, and
          neither request carries any information about your loan.
        </p>

        <h3>Advertising</h3>
        <p>
          Ratepit is funded by advertising. Ad networks may set cookies and use device identifiers
          for measurement and personalisation, subject to your regional consent settings. Ads are
          served independently of anything you enter into a calculator - the ad code has no access to
          those values.
        </p>

        <h3>Analytics</h3>
        <p>
          We may record aggregate page-level traffic to understand which calculators are used. This
          never includes the contents of any input field.
        </p>

        <h3>Not financial advice</h3>
        <p>
          Ratepit produces estimates for general information. Results are illustrations, not offers
          or recommendations, and they cannot account for your full circumstances. Always confirm
          figures with your lender or a qualified adviser before making a decision.
        </p>
      </div>
    </div>
  );
}
