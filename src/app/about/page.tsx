import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How Ratepit works",
  description:
    "Why Ratepit runs entirely in your browser, where its rate data comes from, and what its calculators deliberately do not model.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-14">
      <h1 className="font-display text-4xl font-normal tracking-tight sm:text-6xl">
        How {SITE_NAME} works
      </h1>
      <p className="mt-5 text-lg text-ink-muted">{SITE_TAGLINE}.</p>

      <hr className="rule my-10" />
      <div className="prose-ratepit">
        <h3>Client-side by design</h3>
        <p>
          Financial calculators ask for exactly the information people are most careful with: income,
          debts, property prices. Almost none of it needs to reach a server - the arithmetic is
          simple enough to run on the device that already has the numbers. So that is where Ratepit
          runs it. There is no account, no submit button, and no request carrying your figures.
        </p>

        <h3>Where the numbers come from</h3>
        <ul>
          <li>
            <strong>Exchange rates</strong> - the Frankfurter API, built on European Central Bank
            reference rates, with a secondary free source covering currencies the ECB does not
            publish. Cached for an hour.
          </li>
          <li>
            <strong>US mortgage rates</strong> - the MORTGAGE30US series from FRED, which is the
            Freddie Mac Primary Mortgage Market Survey weekly average for a 30-year fixed loan.
          </li>
        </ul>
        <p>
          Both go through our own API routes, so keys stay server-side and responses are cached. When
          a source is unreachable the calculator falls back to a sensible default and says plainly
          that the figure is an estimate. For regions with no reliable free rate feed, Ratepit asks
          you to enter a rate rather than inventing one.
        </p>

        <h3>Regional presets</h3>
        <p>
          Lending conventions differ enormously. A US mortgage is typically 30 years with property
          tax and PMI folded into the monthly payment; a UK one is 25 years with stamp duty handled
          separately at purchase; an Indian home loan is usually 20 years, floating-rate, with an
          upfront processing fee and no annual property tax. Each country page starts from those
          local conventions - and every field remains editable, because a preset is a starting point,
          not a verdict.
        </p>

        <h3>What the calculators do not model</h3>
        <p>
          Deliberately: rate changes over the term, tax relief, closing costs, prepayment penalties,
          and inflation in tax and insurance costs. Each calculator lists its own exclusions in the
          &ldquo;how this is calculated&rdquo; section. There is no income tax calculator, because
          doing that honestly means encoding one country&apos;s tax code at a time and keeping it
          current - a bad tax estimate is worse than none.
        </p>

        <p>
          <Link href="/privacy" className="text-violet underline-offset-4 hover:underline">
            Read the privacy page
          </Link>{" "}
          for specifics on what is stored locally.
        </p>
      </div>
    </div>
  );
}
