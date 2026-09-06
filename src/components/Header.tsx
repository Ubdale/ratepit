"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, Wordmark } from "./Logo";
import { ToolIcon } from "./ToolIcon";
import { LIVE_TOOLS } from "@/lib/tools";
import { SITE_NAME } from "@/lib/seo";

/** Floating pill nav that lifts off the canvas once the page scrolls. */
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

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header
      className={`sticky top-0 z-40 px-4 pt-4 pb-3 transition-colors duration-300 sm:px-6 ${
        scrolled ? "bg-cream" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center gap-3 rounded-pill border-2 px-3 py-2
                    transition-all duration-300 ${
                      scrolled
                        ? "border-ink bg-paper shadow-block"
                        : "border-transparent bg-transparent"
                    }`}
      >
        <Link
          href="/"
          aria-label={`${SITE_NAME} home`}
          className="flex h-12 shrink-0 items-center gap-2.5 rounded-pill pl-0.5 pr-2"
        >
          <Logo className="h-10 w-10" />
          <Wordmark />
        </Link>

        <nav className="ml-2 hidden items-center gap-1 lg:flex" aria-label="Calculators">
          {LIVE_TOOLS.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              aria-current={isActive(tool.path) ? "page" : undefined}
              className={`whitespace-nowrap rounded-pill px-3.5 py-2.5 text-sm font-semibold transition ${
                isActive(tool.path)
                  ? "bg-ink text-cream"
                  : "text-ink-muted hover:bg-cream-deep hover:text-ink"
              }`}
            >
              {tool.navLabel}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-pill bg-mint-soft px-3.5 py-2 font-mono text-xs font-medium text-mint-deep xl:flex">
            <span className="h-1.5 w-1.5 rounded-pill bg-mint" aria-hidden />
            runs in your browser
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-12 w-12 items-center justify-center rounded-pill border-2 border-ink
                       bg-paper text-ink transition hover:bg-ink hover:text-cream lg:hidden"
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

      <nav
        id="mobile-nav"
        aria-label="Calculators"
        hidden={!open}
        className="mx-auto mt-2 max-w-6xl rounded-card border-2 border-ink bg-paper p-2 shadow-block lg:hidden"
      >
        {LIVE_TOOLS.map((tool) => (
          <Link
            key={tool.path}
            href={tool.path}
            className="flex min-h-[60px] items-center gap-3 rounded-2xl px-3 text-base
                       font-semibold text-ink transition hover:bg-cream-deep"
          >
            <ToolIcon path={tool.path} size={18} />
            <span className="flex-1">{tool.name}</span>
            <span aria-hidden className="text-ink-faint">&rarr;</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
