import Link from "next/link";
import type { Metadata } from "next";
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
    bg: "bg-mint",
  },
  {
    n: "02",
    title: "Built for nine currencies",
    body: "USD, EUR, GBP, INR, PKR, AED, CAD, AUD and SGD, with local formatting, local lending conventions and live conversion.",
    bg: "bg-amber",
  },
  {
    n: "03",
    title: "Honest about its limits",
    body: "Live rates where a reliable free source exists, a clearly labelled estimate where it does not. Never an invented number.",
    bg: "bg-sky",
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
      <section className="mx-auto max-w-6xl overflow-x-clip px-6 pb-10 pt-14 sm:pt-20">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Reveal className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-pill bg-ink px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-cream">
              Free &middot; No signup
            </span>

            <h1 className="mt-7 font-display text-4xl font-extrabold leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              Know what
              <br />
              it <span className="rounded-2xl bg-lime px-3 pb-1">really</span>
              <br />
              costs.
            </h1>

            <p className="mt-7 max-w-lg text-lg text-ink-soft">
              Loan, mortgage and card calculators that answer in full &mdash; the total interest,
              the real monthly cost, the date it clears. Nothing you type ever leaves your device.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/loan-emi-calculator" className="btn-primary">
                Start calculating
              </Link>
              <Link href="/mortgage-calculator" className="btn-outline">
                Mortgage
              </Link>
            </div>
          </Reveal>

          {/* A worked example, so the hero shows the product instead of describing it. */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-3xl bg-amber sm:block"
              />
              <div
                aria-hidden
                className="absolute -bottom-8 -right-4 hidden h-32 w-32 rounded-full bg-sky/70 sm:block"
              />

              <div className="relative rounded-block border-2 border-ink bg-paper p-7 shadow-block">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">Worked example</span>
                  <span className="rounded-pill bg-cream-deep px-3 py-1 font-mono text-xs font-semibold text-ink-soft">
                    EMI &middot; 5 yr
                  </span>
                </div>

                <dl className="mt-7 space-y-4">
                  {[
                    ["Loan amount", "$25,000"],
                    ["Interest rate", "10.50%"],
                    ["Term", "60 months"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm font-medium text-ink-muted">{label}</dt>
                      <dd className="figure text-base font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-7 rounded-card bg-violet p-6 text-white">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    Monthly payment
                  </p>
                  <p className="figure mt-2 font-bold leading-none text-[clamp(2.25rem,7vw,3.75rem)]">$537</p>
                  <p className="mt-3 text-sm text-white">
                    &asymp; &#8377;50,700 &middot; total interest $7,235
                  </p>
                </div>

                <p className="mt-5 flex items-center gap-2 font-mono text-xs font-medium text-mint-deep">
                  <span className="h-2 w-2 rounded-pill bg-mint" aria-hidden />
                  computed locally, nothing sent
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Currency ticker - decorative, hidden from the accessibility tree. */}
      <div className="my-10 overflow-hidden border-y-2 border-ink bg-lime py-4" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[...CURRENCIES, ...CURRENCIES].map((c, i) => (
            <span
              key={`${c.code}-${i}`}
              className="flex items-center gap-2 font-mono text-sm font-semibold text-ink"
            >
              {c.symbol} {c.code}
              <span className="text-ink/70">&mdash;</span>
              <span className="font-normal text-ink/75">{c.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">

        {/* ------------------------------------------------------------ Tools */}
        <section className="py-14 sm:py-20" aria-labelledby="tools-heading">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2
              id="tools-heading"
              className="max-w-xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Six calculators, one promise
            </h2>
            <p className="max-w-xs text-base text-ink-muted">
              All live, all free, all running entirely on your own device.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <StaggerItem key={tool.path}>
                <Press className="h-full">
                  <Link
                    href={tool.path}
                    className="group relative flex h-full flex-col overflow-hidden rounded-card
                               border-2 border-ink bg-paper p-7 transition-colors
                               hover:bg-cream-deep"
                  >
                    {/* The tool's colour, revealed as a bar along the top edge. */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-2"
                      style={{ background: toolAccent(tool.path) }}
                    />

                    <ToolIcon path={tool.path} size={20} className="mt-2" />

                    <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-ink">
                      {tool.name}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm text-ink-soft">{tool.blurb}</p>

                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-ink">
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
        <section className="pb-14 sm:pb-20" aria-labelledby="promises-heading">
          <h2 id="promises-heading" className="sr-only">
            Why Ratepit
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {PROMISES.map((item, i) => (
              <Reveal
                key={item.n}
                delay={i * 0.08}
                className={`${item.bg} rounded-card border-2 border-ink p-7`}
              >
                <span className="figure text-sm font-bold text-ink/85">{item.n}</span>
                <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-ink/80">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- Regions */}
        <section className="py-14 sm:py-20" aria-labelledby="regions-heading">
          <Reveal>
            <h2
              id="regions-heading"
              className="max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              A US mortgage is not a UK mortgage is not an Indian home loan
            </h2>
            <p className="mt-5 max-w-2xl text-base text-ink-soft">
              Each country page starts from local lending conventions: typical terms, rate levels,
              property taxes, insurance rules and fees. Every field stays editable, because a preset
              is a starting point, not a verdict.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {[
              { title: "EMI calculator", path: "/loan-emi-calculator" },
              { title: "Mortgage calculator", path: "/mortgage-calculator" },
            ].map((group, i) => (
              <Reveal
                key={group.path}
                delay={i * 0.08}
                className="rounded-card border-2 border-ink bg-paper p-7"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-ink">{group.title}</h3>
                  <Link
                    href={group.path}
                    className="inline-flex min-h-[44px] items-center text-sm font-bold text-violet hover:underline"
                  >
                    Global &rarr;
                  </Link>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {SUB_ROUTE_REGIONS.map((slug) => (
                    <li key={slug}>
                      <Link href={`${group.path}/${slug}`} className="chip !px-3.5 !text-sm sm:!h-10">
                        {REGIONS[slug].short}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- CTA */}
        <Reveal className="mb-20 overflow-hidden rounded-block border-2 border-ink bg-ink p-10 text-cream sm:p-14">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="max-w-lg">
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                No account. No upload. No catch.
              </h2>
              <p className="mt-4 text-base text-cream/80">
                Ratepit is funded by ads, not by your data. Open a calculator and start typing.
              </p>
            </div>
            <Link
              href="/loan-emi-calculator"
              className="btn inline-flex bg-lime text-ink hover:bg-white"
            >
              Start calculating &rarr;
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
