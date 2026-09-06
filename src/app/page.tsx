import Link from "next/link";
import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/content";
import { Reveal, Stagger, StaggerItem, Press } from "@/components/motion";
import { ToolIcon } from "@/components/ToolIcon";
import { TOOLS, toolAccent } from "@/lib/tools";
import { CURRENCIES } from "@/lib/currencies";
import { REGIONS, SUB_ROUTE_REGIONS } from "@/lib/regions";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo";

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
              All six are live, all free, and all of them run entirely on your own device.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool, i) => (
              <StaggerItem key={tool.path}>
                <Press className="h-full">
                  <Link
                    href={tool.path}
                    className="panel group relative flex h-full flex-col overflow-hidden p-6
                               transition hover:bg-surface-hi"
                    style={{ ["--accent" as string]: toolAccent(tool.path) }}
                  >
                    {/* Accent wash that lifts on hover - the only per-card colour. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full
                                 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: toolAccent(tool.path) }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-40"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${toolAccent(tool.path)}, transparent)`,
                      }}
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <ToolIcon path={tool.path} />
                      <span className="figure text-xs text-ink-ghost">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="relative mt-5 text-lg font-medium text-ink">{tool.name}</h3>
                    <p className="relative mt-2 flex-1 text-sm text-ink-muted">{tool.blurb}</p>

                    <span className="relative mt-6 inline-flex items-center gap-2 text-sm text-citron-400">
                      Open
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        &rarr;
                      </span>
                    </span>
                  </Link>
                </Press>
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

      </div>
    </>
  );
}
