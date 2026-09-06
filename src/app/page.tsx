import Link from "next/link";
import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/content";
import { TOOLS } from "@/lib/tools";
import { REGIONS, SUB_ROUTE_REGIONS } from "@/lib/regions";
import { SIBLING_URL, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} - ${SITE_TAGLINE}` },
  description:
    "Loan EMI, mortgage, credit card payoff and car finance calculators for nine currencies. No signup, no tracking of what you type - every calculation runs in your browser.",
  alternates: { canonical: "/" },
};

const PROMISES = [
  {
    title: "Nothing leaves your browser",
    body: "Every calculation runs in JavaScript on your device. No account, no upload, no figure of yours stored anywhere.",
  },
  {
    title: "Built for nine currencies",
    body: "USD, EUR, GBP, INR, PKR, AED, CAD, AUD and SGD - with local formatting, local terms and live conversion between them.",
  },
  {
    title: "Honest about its limits",
    body: "Live rates where a reliable free source exists, a clearly labelled estimate where it does not. Never an invented number.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          description: SITE_TAGLINE,
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />

      <div className="mx-auto max-w-6xl px-4">
        <section className="py-14 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-400">
            Free &middot; No signup &middot; Client-side
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
            {SITE_TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Loan, mortgage and credit calculators that work the way they should: instant, precise,
            and completely private. Your salary, your debts, your property price - none of it is ever
            transmitted, because none of it needs to be.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/loan-emi-calculator"
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-brand-400"
            >
              Loan EMI Calculator
            </Link>
            <Link
              href="/mortgage-calculator"
              className="rounded-lg border border-ink-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-ink-600 hover:bg-ink-900"
            >
              Mortgage Calculator
            </Link>
          </div>
        </section>

        {/* AD SLOT - below the hero, above the tool grid. */}
        <AdSlot id="home-top" variant="leaderboard" />

        <section className="py-6" aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="text-lg font-semibold text-slate-100">
            Calculators
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <li key={tool.path}>
                {tool.live ? (
                  <Link
                    href={tool.path}
                    className="card block h-full transition hover:border-brand-500/50 hover:bg-ink-900"
                  >
                    <h3 className="text-sm font-semibold text-slate-100">{tool.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{tool.blurb}</p>
                    <span className="mt-3 inline-block text-xs text-brand-300">Open &rarr;</span>
                  </Link>
                ) : (
                  <div className="card h-full opacity-60">
                    <h3 className="text-sm font-semibold text-slate-300">{tool.name}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{tool.blurb}</p>
                    <span className="mt-3 inline-block rounded border border-ink-700 px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-slate-500">
                      Coming soon
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="py-10" aria-labelledby="promises-heading">
          <h2 id="promises-heading" className="sr-only">
            Why Ratepit
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {PROMISES.map((item) => (
              <div key={item.title} className="card">
                <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AD SLOT - between content blocks near the foot of the page. */}
        <AdSlot id="home-mid" variant="inline" />

        <section className="pb-14" aria-labelledby="regions-heading">
          <h2 id="regions-heading" className="text-lg font-semibold text-slate-100">
            Localised calculators
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Each country page starts from local lending conventions - typical terms, rate levels,
            taxes and fees - and everything stays editable.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="card">
              <h3 className="text-sm font-semibold text-slate-100">EMI calculator</h3>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                {SUB_ROUTE_REGIONS.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/loan-emi-calculator/${slug}`}
                      className="rounded-md border border-ink-700 px-2.5 py-1 text-slate-400 transition hover:border-brand-500/50 hover:text-slate-200"
                    >
                      {REGIONS[slug].short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="text-sm font-semibold text-slate-100">Mortgage calculator</h3>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                {SUB_ROUTE_REGIONS.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/mortgage-calculator/${slug}`}
                      className="rounded-md border border-ink-700 px-2.5 py-1 text-slate-400 transition hover:border-brand-500/50 hover:text-slate-200"
                    >
                      {REGIONS[slug].short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            Ratepit is part of the{" "}
            <a href={SIBLING_URL} rel="noopener" className="text-brand-300 hover:underline">
              Toolpit
            </a>{" "}
            family - the same client-side, no-signup approach, applied to money.
          </p>
        </section>
      </div>
    </>
  );
}
