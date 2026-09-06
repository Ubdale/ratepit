import Link from "next/link";
import { Logo } from "./Logo";
import { TOOLS } from "@/lib/tools";
import { SIBLING_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-800 bg-ink-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-semibold text-slate-100">{SITE_NAME}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-500">{SITE_TAGLINE}.</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Calculators
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {TOOLS.map((tool) => (
              <li key={tool.path}>
                {tool.live ? (
                  <Link href={tool.path} className="text-slate-400 hover:text-brand-300">
                    {tool.name}
                  </Link>
                ) : (
                  <span className="text-slate-600">
                    {tool.name} <span className="text-[0.7rem]">soon</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">About</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="text-slate-400 hover:text-brand-300">
                How Ratepit works
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-slate-400 hover:text-brand-300">
                Privacy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Family</h2>
          <p className="mt-3 text-sm text-slate-500">
            Part of the{" "}
            <a
              href={SIBLING_URL}
              className="font-medium text-brand-300 underline-offset-4 hover:underline"
              rel="noopener"
            >
              Toolpit
            </a>{" "}
            family - same idea, everything runs in your browser.
          </p>
        </div>
      </div>

      <div className="border-t border-ink-800/70">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs leading-relaxed text-slate-600">
          <p>
            Ratepit gives estimates for general information only and is not financial advice. Figures
            are illustrations, not offers - your lender&apos;s quote is what counts.
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} {SITE_NAME}.
          </p>
        </div>
      </div>
    </footer>
  );
}
