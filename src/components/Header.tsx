"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, Wordmark } from "./Logo";
import { LIVE_TOOLS } from "@/lib/tools";
import { SITE_NAME } from "@/lib/seo";

/**
 * Floating pill nav. It detaches from the top edge on scroll rather than
 * sitting as a full-width bar - the page reads as a sheet moving under it.
 */
export function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`mx-auto flex max-w-6xl items-center gap-3 rounded-pill border px-3 py-2
                    transition-all duration-300 ${
                      scrolled
                        ? "border-line bg-canvas-raised/85 shadow-lift backdrop-blur-xl"
                        : "border-transparent bg-transparent"
                    }`}
      >
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className="flex h-11 shrink-0 items-center gap-2.5 rounded-pill pl-1 pr-2"
        >
          <Logo className="h-8 w-8" />
          <Wordmark />
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Calculators">
          {LIVE_TOOLS.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              aria-current={isActive(tool.path) ? "page" : undefined}
              className={`rounded-pill px-4 py-2 text-sm transition ${
                isActive(tool.path)
                  ? "bg-surface-hi text-ink"
                  : "text-ink-muted hover:bg-surface hover:text-ink"
              }`}
            >
              {tool.navLabel}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-2 pr-2 font-mono text-xs text-ink-faint lg:flex">
            <span className="h-1.5 w-1.5 rounded-pill bg-citron-400" aria-hidden />
            runs in your browser
          </span>
          <Link href="/loan-emi-calculator" className="btn-primary hidden !h-9 !px-5 sm:inline-flex">
            Calculate
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-pill border border-line
                       text-ink transition hover:bg-surface md:hidden"
          >
            <span aria-hidden className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-0.5 w-4 rounded bg-current transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-4 rounded bg-current transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Calculators"
          className="panel mx-auto mt-2 max-w-6xl overflow-hidden p-2 md:hidden"
        >
          {LIVE_TOOLS.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="flex h-12 items-center justify-between rounded-xl px-4 text-base
                         text-ink-muted transition hover:bg-surface-hi hover:text-ink"
            >
              {tool.name}
              <span aria-hidden className="text-citron-400">
                &rarr;
              </span>
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
