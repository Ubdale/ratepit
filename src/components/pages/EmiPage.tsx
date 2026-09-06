import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { FilterBar } from "@/components/FilterBar";
import { RegionCurrencySync } from "@/components/CurrencyProvider";
import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import { ExplainerSection, FaqSection, Formula, JsonLd } from "@/components/content";
import { appSchema, breadcrumbSchema, faqSchema, regionalTitle, type FaqItem } from "@/lib/seo";
import { SUB_ROUTE_REGIONS, REGIONS, type Region } from "@/lib/regions";

export const EMI_PATH = "/loan-emi-calculator";
export const EMI_TOOL_NAME = "Loan EMI Calculator";

export function emiDescription(region: Region): string {
  const where = region.slug === "global" ? "" : ` in ${region.name}`;
  return `Free EMI calculator${where}: work out your monthly instalment, total interest and full amortisation schedule in ${region.currency}. Runs entirely in your browser - nothing you type is sent anywhere.`;
}

export function emiFaqs(region: Region): FaqItem[] {
  const cur = region.currency;
  return [
    {
      q: "What is an EMI?",
      a: "EMI stands for Equated Monthly Instalment - the fixed amount you pay your lender each month until the loan is cleared. Each instalment covers the interest accrued that month first, and whatever is left reduces the outstanding principal.",
    },
    {
      q: "How is the EMI amount calculated?",
      a: "EMI = P x r x (1 + r)^n / ((1 + r)^n - 1), where P is the principal, r is the monthly interest rate (the annual rate divided by 12 and by 100) and n is the number of monthly instalments. Ratepit runs that formula in your browser on every keystroke.",
    },
    {
      q: "Why is so much of my early EMI going to interest?",
      a: "Interest is charged on the balance you still owe, and that balance is at its largest on day one. As the principal falls, the interest portion of each instalment shrinks and the principal portion grows - which is why the split chart flips over the life of the loan.",
    },
    {
      q: "Does paying extra each month actually help?",
      a: "Yes, provided your lender applies the extra directly to principal and does not charge a prepayment penalty. Because it removes principal early, it stops interest accruing on that amount for the rest of the term - the calculator shows exactly how much interest you save and how many months you cut.",
    },
    {
      q: `Can I use this calculator with ${cur}?`,
      a: `Yes. Pick ${cur} - or any of the nine supported currencies - in the filter bar. Amounts are formatted using local conventions, and you can pin a second currency to see the same instalment converted at live European Central Bank reference rates.`,
    },
    {
      q: "Is anything I enter stored or sent to a server?",
      a: "No. Every calculation runs in JavaScript on your own device. The only network requests Ratepit makes are for public exchange rates and reference interest rates - they carry no information about your loan.",
    },
    {
      q: "Is a flat-rate loan the same thing?",
      a: "No, and the difference is large. A flat-rate loan charges interest on the original amount for the whole term, so the true cost is close to double the quoted rate. This calculator uses reducing-balance interest, which is how mortgages and most regulated personal loans work.",
    },
  ];
}

export function EmiPage({ region }: { region: Region }) {
  const faqs = emiFaqs(region);
  const description = emiDescription(region);
  const title = regionalTitle(EMI_TOOL_NAME, region);
  const isRegional = region.slug !== "global";

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={appSchema({ toolName: EMI_TOOL_NAME, description, path: EMI_PATH, region })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ratepit", path: "/" },
          { name: EMI_TOOL_NAME, path: EMI_PATH },
          ...(isRegional ? [{ name: region.short, path: `${EMI_PATH}/${region.slug}` }] : []),
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
                    href={EMI_PATH}
                    className="flex min-h-[44px] items-center font-medium transition hover:text-violet"
                  >
                    EMI Calculator
                  </Link>
                </li>
                <li aria-hidden className="text-ink-muted">/</li>
                <li className="flex min-h-[44px] items-center text-ink-muted">{region.short}</li>
              </>
            ) : (
              <li className="flex min-h-[44px] items-center text-ink-muted">EMI Calculator</li>
            )}
          </ol>
        </nav>

        <header className="mb-10 max-w-3xl">
          <p className="eyebrow">Loan EMI</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Enter your loan amount, rate and term to see the monthly instalment, the total interest
            you will pay and a month-by-month breakdown. Everything is computed on your device -
            nothing you type is uploaded.
          </p>
        </header>

        <FilterBar region={region} basePath={EMI_PATH} />

        {/* AD SLOT - above the tool, outside the input/result flow. */}
        <AdSlot id="emi-top" variant="leaderboard" />

        <EmiCalculator region={region} />

        {/* AD SLOT - after the tool, before the long-form content. */}
        <AdSlot id="emi-mid" variant="inline" />

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-6">
            <ExplainerSection>
              <p>
                An EMI - Equated Monthly Instalment - is the fixed payment that clears a loan over a
                set term. It is fixed in total, but the split inside it moves every single month.
              </p>

              <h3>The formula</h3>
              <p>
                Ratepit uses the standard reducing-balance annuity formula. For a principal{" "}
                <code>P</code>, a monthly rate <code>r</code> (your annual rate divided by 12 and by
                100) and <code>n</code> monthly payments:
              </p>
              <Formula>{"EMI = P x r x (1 + r)^n / ((1 + r)^n - 1)"}</Formula>
              <p>
                If the rate is zero the formula collapses to <code>P / n</code>, which the
                calculator handles as a special case rather than dividing by zero.
              </p>

              <h3>How each instalment is split</h3>
              <p>
                Every month the calculator charges interest on the balance still outstanding, then
                puts the remainder of the instalment against principal:
              </p>
              <Formula>
                {"interest = balance x r\nprincipal = EMI - interest\nbalance = balance - principal"}
              </Formula>
              <p>
                Repeating that for the whole term produces the amortisation schedule in the table
                above. Because the balance shrinks each month, the interest slice shrinks with it -
                slowly at first, then quickly towards the end.
              </p>

              <h3>What the extra payment does</h3>
              <p>
                An extra monthly amount is applied entirely to principal. That removes it from the
                balance immediately, so no interest is ever charged on it again. The saving compounds:
                a modest extra payment early in a long loan can cut years off the term. Ratepit
                recalculates the whole schedule with the extra amount included and compares it
                against the baseline to show the interest saved.
              </p>

              <h3>What is not included</h3>
              <ul>
                <li>
                  <strong>Rate changes.</strong> Floating-rate loans reprice over the term. The
                  calculator assumes the rate you enter holds for the whole period.
                </li>
                <li>
                  <strong>Insurance and add-ons.</strong> Credit life cover, documentation charges
                  and late fees are lender-specific and are not modelled.
                </li>
                <li>
                  <strong>Prepayment penalties.</strong> Some lenders charge for early settlement,
                  which reduces the benefit of extra payments.
                </li>
                <li>
                  <strong>Day-count conventions.</strong> Ratepit compounds monthly. Lenders that
                  compound daily or semi-annually will quote a slightly different instalment.
                </li>
              </ul>

              <h3>Reducing balance vs flat rate</h3>
              <p>
                Watch for loans quoted at a <strong>flat rate</strong>, common in some markets for
                car and consumer finance. A flat rate charges interest on the full original amount
                for the entire term, so a &ldquo;10% flat&rdquo; loan costs roughly the same as an
                18-19% reducing-balance loan. This calculator models reducing balance, which is what
                mortgages and regulated personal loans use.
              </p>
            </ExplainerSection>

            <FaqSection items={faqs} />
          </div>

          <aside className="min-w-0 space-y-6">
            <div className="rounded-card border-2 border-ink bg-paper p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-lg font-bold text-ink">EMI calculator by country</h2>
              <p className="mt-1.5 text-xs text-ink-muted">
                Each one starts from local rate and term conventions.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {SUB_ROUTE_REGIONS.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`${EMI_PATH}/${slug}`}
                      aria-current={slug === region.slug ? "page" : undefined}
                      className={`chip !px-3.5 sm:!h-9 ${slug === region.slug ? "chip-active" : ""}`}
                    >
                      {REGIONS[slug].short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AD SLOT - sidebar rectangle, never beside the inputs. */}
            <AdSlot id="emi-sidebar" variant="rectangle" className="!my-0" />
          </aside>
        </div>
      </div>
    </>
  );
}
