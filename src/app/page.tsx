import Link from "next/link";
import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/content";
import { Reveal, Stagger, StaggerItem, Press } from "@/components/motion";
import { TOOLS } from "@/lib/tools";
import { CURRENCIES } from "@/lib/currencies";
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
    n: "01",
    title: "Nothing leaves your browser",
    body: "Every calculation runs in JavaScript on your device. No account, no upload, no figure of yours stored anywhere.",
  },
  {
    n: "02",
    title: "Built for nine currencies",
    body: "USD, EUR, GBP, INR, PKR, AED, CAD, AUD and SGD, with local formatting, local lending conventions and live conversion between them.",
  },
  {
    n: "03",
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

      {/* ---------------------------------------------------------------- Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <Reveal className="min-w-0">
            <p className="eyebrow">Free &middot; No signup &middot; Client-side</p>

            <h1 className="mt-6 font-display text-4xl font-normal leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              Finance calculators that
              <br className="hidden sm:block" />{" "}
              <span className="text-citron-400">never touch</span> a server.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-ink-muted">
              Your salary, your debts, your property price. None of it is ever transmitted, because
              none of it needs to be. The arithmetic runs on the device that already has the numbers.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/loan-emi-calculator" className="btn-primary">
                Loan EMI Calculator
              </Link>
              <Link href="/mortgage-calculator" className="btn-ghost">
                Mortgage Calculator
              </Link>
            </div>
          </Reveal>

          {/* A worked example, so the hero shows the product instead of describing it. */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Worked example</span>
                <span className="font-mono text-xs text-ink-ghost">EMI &middot; 5 yr</span>
              </div>

              <dl className="mt-6 space-y-3">
                {[
                  ["Loan amount", "$25,000"],
                  ["Interest rate", "10.50%"],
                  ["Term", "60 months"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-ink-faint">{label}</dt>
                    <dd className="figure text-sm text-ink-muted">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 rounded-xl border border-citron-500/30 bg-citron-400/[0.07] p-5">
                <p className="eyebrow !text-citron-600">Monthly payment</p>
                <p className="figure mt-1 text-4xl font-medium text-ink">$537</p>
                <p className="mt-1 text-sm text-ink-faint">
                  &asymp; &#8377;50,700 &middot; total interest $7,235
                </p>
              </div>

              <p className="mt-4 flex items-center gap-2 font-mono text-xs text-ink-ghost">
                <span className="h-1.5 w-1.5 rounded-pill bg-citron-400" aria-hidden />
                computed locally, nothing sent
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Currency ticker - decorative, and hidden from the accessibility tree. */}
      <div
        className="relative overflow-hidden border-y border-line-soft py-4"
        aria-hidden
      >
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[...CURRENCIES, ...CURRENCIES].map((c, i) => (
            <span
              key={`${c.code}-${i}`}
              className="flex items-center gap-2 font-mono text-sm text-ink-ghost"
            >
              <span className="text-citron-600">{c.symbol}</span>
              {c.code}
              <span className="text-line-strong">/</span>
              <span className="text-ink-ghost/70">{c.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <AdSlot id="home-top" variant="leaderboard" />

        {/* ------------------------------------------------------------ Tools */}
        <section className="py-16 sm:py-24" aria-labelledby="tools-heading">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">The tools</p>
              <h2
                id="tools-heading"
                className="mt-3 font-display text-3xl font-normal tracking-tight sm:text-4xl"
              >
                Six calculators, one promise
              </h2>
            </div>
            <p className="max-w-sm text-sm text-ink-faint">
              Two are live today. The rest are in build, in the order people actually search for
              them.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool, i) => (
              <StaggerItem key={tool.path}>
                {tool.live ? (
                  <Press className="h-full">
                    <Link
                      href={tool.path}
                      className="panel group flex h-full flex-col p-6 transition
                                 hover:border-citron-500/40 hover:bg-surface-hi"
                    >
                      <span className="figure text-xs text-ink-ghost">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-4 text-lg font-medium text-ink">{tool.name}</h3>
                      <p className="mt-2 flex-1 text-sm text-ink-muted">{tool.blurb}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm text-citron-400">
                        Open
                        <span
                          aria-hidden
                          className="transition-transform group-hover:translate-x-1"
                        >
                          &rarr;
                        </span>
                      </span>
                    </Link>
                  </Press>
                ) : (
                  <div className="panel-flush flex h-full flex-col p-6">
                    <span className="figure text-xs text-ink-ghost">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-lg font-medium text-ink-muted">{tool.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-ink-faint">{tool.blurb}</p>
                    <span className="eyebrow mt-6">In build</span>
                  </div>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* --------------------------------------------------------- Promises */}
        <section className="py-16 sm:py-24" aria-labelledby="promises-heading">
          <h2 id="promises-heading" className="sr-only">
            Why Ratepit
          </h2>
          <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
            {PROMISES.map((item, i) => (
              <Reveal key={item.n} delay={i * 0.08} className="bg-canvas-raised p-8">
                <span className="figure text-sm text-citron-600">{item.n}</span>
                <h3 className="mt-6 font-display text-xl font-normal text-ink">{item.title}</h3>
                <p className="mt-3 text-sm text-ink-muted">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <AdSlot id="home-mid" variant="inline" />

        {/* ---------------------------------------------------------- Regions */}
        <section className="py-16 sm:py-24" aria-labelledby="regions-heading">
          <Reveal>
            <p className="eyebrow">Localised</p>
            <h2
              id="regions-heading"
              className="mt-3 max-w-2xl font-display text-3xl font-normal tracking-tight sm:text-4xl"
            >
              A US mortgage is not a UK mortgage is not an Indian home loan
            </h2>
            <p className="mt-4 max-w-2xl text-base text-ink-muted">
              Each country page starts from local lending conventions: typical terms, rate levels,
              property taxes, insurance rules and fees. Every field stays editable, because a preset
              is a starting point, not a verdict.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {[
              { title: "EMI calculator", path: "/loan-emi-calculator" },
              { title: "Mortgage calculator", path: "/mortgage-calculator" },
            ].map((group, i) => (
              <Reveal key={group.path} delay={i * 0.08} className="panel p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-ink">{group.title}</h3>
                  <Link href={group.path} className="inline-flex min-h-[44px] items-center text-sm text-citron-400 hover:underline">
                    Global &rarr;
                  </Link>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {SUB_ROUTE_REGIONS.map((slug) => (
                    <li key={slug}>
                      <Link href={`${group.path}/${slug}`} className="chip !px-3.5 sm:!h-9">
                        {REGIONS[slug].short}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ Family */}
        <Reveal className="mb-20 mt-4 rounded-card border border-line bg-canvas-raised p-8 sm:p-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-lg">
              <p className="eyebrow">The family</p>
              <p className="mt-4 font-display text-xl font-normal text-ink sm:text-3xl">
                Ratepit is the money half of Toolpit.
              </p>
              <p className="mt-3 text-base text-ink-muted">
                Same principle, different problem: useful tools, no signup, nothing sent anywhere.
              </p>
            </div>
            <a href={SIBLING_URL} rel="noopener" className="btn-ghost">
              Visit Toolpit
              <span aria-hidden>&rarr;</span>
            </a>
          </div>
        </Reveal>
      </div>
    </>
  );
}
