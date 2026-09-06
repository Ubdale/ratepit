import Link from "next/link";
import { Logo, Wordmark } from "./Logo";
import { TOOLS } from "@/lib/tools";
import { SIBLING_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line-soft bg-canvas-sunken">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <Wordmark />
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-faint">{SITE_TAGLINE}.</p>
            <p className="mt-6 flex items-center gap-2 font-mono text-xs text-ink-ghost">
              <span className="h-1.5 w-1.5 rounded-pill bg-citron-400" aria-hidden />
              nothing you type is uploaded
            </p>
          </div>

          <div>
            <h2 className="eyebrow">Calculators</h2>
            <ul className="mt-3 text-sm">
              {TOOLS.map((tool) => (
                <li key={tool.path}>
                  {tool.live ? (
                    <Link href={tool.path} className="nav-link">
                      {tool.name}
                    </Link>
                  ) : (
                    <span className="nav-link !text-ink-ghost">
                      {tool.name}
                      <span className="ml-2 font-mono text-xs">soon</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow">About</h2>
            <ul className="mt-3 text-sm">
              <li>
                <Link href="/about" className="nav-link">
                  How Ratepit works
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="nav-link">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="eyebrow">Family</h2>
            <p className="mt-5 text-sm text-ink-faint">
              Part of the{" "}
              <a
                href={SIBLING_URL}
                rel="noopener"
                className="text-citron-400 underline-offset-4 hover:underline"
              >
                Toolpit
              </a>{" "}
              family. Same idea, everything runs in your browser.
            </p>
          </div>
        </div>

        <hr className="rule my-12" />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-2xl text-xs leading-relaxed text-ink-ghost">
            Ratepit gives estimates for general information only and is not financial advice.
            Figures are illustrations, not offers &mdash; your lender&apos;s quote is what counts.
          </p>
          <p className="font-mono text-xs text-ink-ghost">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
