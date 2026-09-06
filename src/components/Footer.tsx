import Link from "next/link";
import { Logo, Wordmark } from "./Logo";
import { TOOLS } from "@/lib/tools";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <Wordmark className="!text-cream" />
            </div>
            <p className="mt-4 max-w-xs text-sm text-cream/80">{SITE_TAGLINE}.</p>
            <p className="mt-6 flex items-center gap-2 font-mono text-xs text-lime">
              <span className="h-1.5 w-1.5 rounded-pill bg-lime" aria-hidden />
              nothing you type is uploaded
            </p>
          </div>

          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cream/70">Calculators</h2>
            <ul className="mt-3 text-sm">
              {TOOLS.map((tool) => (
                <li key={tool.path}>
                  {tool.live ? (
                    <Link href={tool.path} className="flex min-h-[44px] items-center font-medium text-cream/85 transition hover:text-lime">
                      {tool.name}
                    </Link>
                  ) : (
                    <span className="flex min-h-[44px] items-center text-cream/55">
                      {tool.name}
                      <span className="ml-2 font-mono text-xs">soon</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cream/70">About</h2>
            <ul className="mt-3 text-sm">
              <li>
                <Link href="/about" className="flex min-h-[44px] items-center font-medium text-cream/85 transition hover:text-lime">
                  How Ratepit works
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="flex min-h-[44px] items-center font-medium text-cream/85 transition hover:text-lime">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-cream/70">Currencies</h2>
            <p className="mt-5 text-sm text-cream/80">
              USD, EUR, GBP, INR, PKR, AED, CAD, AUD and SGD, with live conversion between them.
            </p>
          </div>
        </div>

        <hr className="my-12 h-px border-0 bg-cream/15" />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-2xl text-xs leading-relaxed text-cream/70">
            Ratepit gives estimates for general information only and is not financial advice.
            Figures are illustrations, not offers &mdash; your lender&apos;s quote is what counts.
          </p>
          <p className="font-mono text-xs text-cream/70">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
