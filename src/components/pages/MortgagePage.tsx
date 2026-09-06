import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { RegionCurrencySync } from "@/components/CurrencyProvider";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { ExplainerSection, FaqSection, Formula, JsonLd } from "@/components/content";
import { appSchema, breadcrumbSchema, faqSchema, regionalTitle, type FaqItem } from "@/lib/seo";
import { SUB_ROUTE_REGIONS, REGIONS, type Region } from "@/lib/regions";

export const MORTGAGE_PATH = "/mortgage-calculator";
export const MORTGAGE_TOOL_NAME = "Mortgage Calculator";

export function mortgageDescription(region: Region): string {
  const where = region.slug === "global" ? "" : ` for ${region.name}`;
  return `Free mortgage calculator${where}: monthly payment, total interest, property tax, insurance and PMI, plus a full amortisation schedule in ${region.currency}. Runs entirely in your browser.`;
}

export function mortgageFaqs(region: Region): FaqItem[] {
  const config = region.mortgage;

  const shared: FaqItem[] = [
    {
      q: "What does the monthly payment figure include?",
      a: "Principal and interest always. Where the region uses them, it also adds monthly property tax, home insurance, mortgage insurance and any HOA or service charge - the full amount that leaves your account each month, not just the loan repayment.",
    },
    {
      q: "How is the monthly mortgage payment calculated?",
      a: "The loan portion uses the standard annuity formula: M = P x r x (1 + r)^n / ((1 + r)^n - 1), where P is the amount borrowed, r is the monthly rate and n is the number of monthly payments. Escrow items - tax, insurance, mortgage insurance - are annual figures divided by twelve and added on top.",
    },
    {
      q: "Why does almost all of my early payment go to interest?",
      a: "Interest is charged on what you still owe, and the balance is largest at the start. On a 30-year loan at typical rates, roughly two thirds of the first payment is interest. The proportion flips slowly, then accelerates near the end - the yearly split chart shows exactly when.",
    },
    {
      q: "How much difference does a bigger down payment make?",
      a: "Three ways: you borrow less, so the payment falls; you pay interest on a smaller balance for the whole term; and above 20% down you usually avoid mortgage insurance entirely. Move the down payment slider and watch all three change at once.",
    },
    {
      q: "Does paying extra each month really shorten the term?",
      a: "Yes. Extra payments go straight to principal, so interest never accrues on that money again. The calculator rebuilds the whole schedule with the extra amount and tells you the interest saved and the months cut off the term.",
    },
    {
      q: "Is any of this sent to a server?",
      a: "No. Every figure is calculated in your browser. Ratepit fetches public exchange rates and the published US average mortgage rate, and those requests contain nothing about your property, income or loan.",
    },
  ];

  const regional: FaqItem[] = [];

  if (config.showPmi) {
    regional.push({
      q: "When does PMI stop?",
      a: "Private mortgage insurance is normally charged until the loan balance reaches 80% of the property value. Ratepit walks the amortisation schedule to find the exact month that happens and stops charging PMI from that point, then shows the total you will have paid.",
    });
  }
  if (config.hasLiveRate) {
    regional.push({
      q: "Where does the suggested rate come from?",
      a: "The MORTGAGE30US series from FRED at the Federal Reserve Bank of St. Louis - the Freddie Mac Primary Mortgage Market Survey weekly average for a 30-year fixed loan. It is a national average, not an offer: your own rate depends on credit score, down payment and lender. If the feed is unavailable, Ratepit clearly labels the figure as an estimate instead of guessing.",
    });
  }
  if (config.showProcessingFee) {
    regional.push({
      q: "What is the processing fee?",
      a: "A one-off charge lenders levy on the sanctioned amount, typically a fraction of a percent up to about 1%. It is paid upfront rather than spread across the instalments, so it is shown separately in the upfront cash figure rather than inside the monthly payment.",
    });
  }
  if (region.slug === "uk") {
    regional.push({
      q: "What about Stamp Duty?",
      a: "Stamp Duty Land Tax is a one-off purchase tax with banded rates that depend on the price, whether you are a first-time buyer and whether you own another property. It is not part of the monthly payment and is not included here - budget for it separately alongside your deposit.",
    });
  }
  if (region.slug === "canada") {
    regional.push({
      q: "Why does my bank quote a slightly different payment?",
      a: "Canadian fixed-rate mortgages are compounded semi-annually by law, while this calculator compounds monthly like most of the world. The difference on a typical loan is small - a few dollars a month - but it is real, so treat a lender quote as authoritative.",
    });
  }

  return [...shared.slice(0, 2), ...regional, ...shared.slice(2)];
}

export function MortgagePage({ region }: { region: Region }) {
  const faqs = mortgageFaqs(region);
  const description = mortgageDescription(region);
  const title = regionalTitle(MORTGAGE_TOOL_NAME, region);
  const isRegional = region.slug !== "global";
  const config = region.mortgage;

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={appSchema({
          toolName: MORTGAGE_TOOL_NAME,
          description,
          path: MORTGAGE_PATH,
          region,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ratepit", path: "/" },
          { name: MORTGAGE_TOOL_NAME, path: MORTGAGE_PATH },
          ...(isRegional ? [{ name: region.short, path: `${MORTGAGE_PATH}/${region.slug}` }] : []),
        ])}
      />
      {isRegional ? <RegionCurrencySync currency={region.currency} /> : null}

      <div className="mx-auto max-w-6xl px-6 pb-12 pt-10">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-x-2 font-mono text-xs text-ink-muted">
            <li>
              <Link
                href="/"
                className="flex min-h-[44px] items-center font-medium transition hover:text-violet"
              >
                Ratepit
              </Link>
            </li>
            <li aria-hidden className="text-ink-muted">/</li>
            {isRegional ? (
              <>
                <li>
                  <Link
                    href={MORTGAGE_PATH}
                    className="flex min-h-[44px] items-center font-medium transition hover:text-violet"
                  >
                    Mortgage Calculator
                  </Link>
                </li>
                <li aria-hidden className="text-ink-muted">/</li>
                <li className="flex min-h-[44px] items-center text-ink-muted">{region.short}</li>
              </>
            ) : (
              <li className="flex min-h-[44px] items-center text-ink-muted">Mortgage Calculator</li>
            )}
          </ol>
        </nav>

        <header className="mb-10 max-w-3xl">
          <p className="eyebrow">Mortgage</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Work out the real monthly cost of a home loan - principal, interest
            {config.showPropertyTax ? ", property tax" : ""}
            {config.showPmi ? ", mortgage insurance" : ""} and insurance - with a full amortisation
            schedule. Every calculation happens on your device.
          </p>
        </header>

        <FilterBar region={region} basePath={MORTGAGE_PATH} />

        <MortgageCalculator region={region} />

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-6">
            <ExplainerSection>
              <p>
                A mortgage payment is really several separate costs collected as one figure. Ratepit
                calculates each part on its own so you can see which ones you can actually influence.
              </p>

              <h3>The loan repayment</h3>
              <p>
                Principal and interest come from the standard annuity formula, where <code>P</code>{" "}
                is the amount borrowed (price minus down payment), <code>r</code> is the annual rate
                divided by 12 and by 100, and <code>n</code> is the number of monthly payments:
              </p>
              <Formula>{"M = P x r x (1 + r)^n / ((1 + r)^n - 1)"}</Formula>
              <p>
                Each month, interest is charged on the outstanding balance and the rest of the
                payment reduces the principal. That single rule, applied {config.defaultTermYears}{" "}
                years deep, produces the whole schedule.
              </p>

              <h3>The escrow items</h3>
              <ul>
                {config.showPropertyTax ? (
                  <li>
                    <strong>Property tax</strong> is an annual percentage of the property value,
                    divided by twelve. The regional default is a national average - your county or
                    municipality rate is what actually applies.
                  </li>
                ) : null}
                <li>
                  <strong>Home insurance</strong> is an annual premium divided by twelve. Lenders
                  normally require cover for the full term.
                </li>
                {config.showPmi ? (
                  <li>
                    <strong>Mortgage insurance</strong> protects the lender, not you, and is charged
                    while your equity is under 20%. Ratepit charges it monthly at your chosen rate
                    and stops the month the balance crosses 80% of the property value.
                  </li>
                ) : null}
                {config.showHoa ? (
                  <li>
                    <strong>{config.hoaLabel.replace("Monthly ", "")}</strong> is added as a flat
                    monthly amount. It usually rises over time, which this calculator does not model.
                  </li>
                ) : null}
                {config.showProcessingFee ? (
                  <li>
                    <strong>Processing fee</strong> is a one-off charge on the sanctioned amount. It
                    is counted in your upfront cash rather than the monthly payment.
                  </li>
                ) : null}
              </ul>

              <h3>Loan-to-value, and why it matters</h3>
              <p>
                LTV is the loan as a percentage of the property price. It drives almost everything a
                lender decides: below 80% you typically avoid mortgage insurance, and lower LTV bands
                usually unlock better rates. The down payment slider shows the LTV live so you can
                see where the thresholds sit.
              </p>

              {config.hasLiveRate ? (
                <>
                  <h3>About the suggested rate</h3>
                  <p>
                    The &ldquo;current avg&rdquo; figure is the weekly 30-year fixed average from the
                    Freddie Mac Primary Mortgage Market Survey, served through FRED. It is a
                    reference point for a well-qualified borrower, not a quote. Where no reliable
                    free source exists for a region, Ratepit asks you to enter a rate rather than
                    inventing one.
                  </p>
                </>
              ) : (
                <>
                  <h3>Where to get a rate for {region.name}</h3>
                  <p>
                    There is no free, reliable public feed of average mortgage rates for{" "}
                    {region.name}, so this calculator does not suggest one - inventing a number would
                    be worse than asking. Take the rate from a lender comparison site or a quote and
                    enter it above. The regional default is only a starting point.
                  </p>
                </>
              )}

              <h3>What this does not cover</h3>
              <ul>
                <li>
                  <strong>Closing and purchase costs</strong> - legal fees, valuation, transfer
                  duties and taxes on the purchase itself.
                </li>
                <li>
                  <strong>Rate changes</strong> - variable and short-fix products reprice; the
                  calculator holds your rate constant for the whole term.
                </li>
                <li>
                  <strong>Tax relief</strong> - mortgage interest deductions where they exist.
                </li>
                <li>
                  <strong>Rising costs</strong> - tax assessments, insurance premiums and service
                  charges all tend to increase over a long term.
                </li>
              </ul>
            </ExplainerSection>

            <FaqSection items={faqs} />
          </div>

          <aside className="min-w-0 space-y-6">
            <div className="rounded-card border-2 border-ink bg-paper p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-lg font-bold text-ink">Mortgage calculator by country</h2>
              <p className="mt-1.5 text-xs text-ink-muted">
                Local terms, taxes and insurance conventions built in.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {SUB_ROUTE_REGIONS.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`${MORTGAGE_PATH}/${slug}`}
                      aria-current={slug === region.slug ? "page" : undefined}
                      className={`chip !px-3.5 sm:!h-9 ${slug === region.slug ? "chip-active" : ""}`}
                    >
                      {REGIONS[slug].short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>
      </div>
    </>
  );
}
