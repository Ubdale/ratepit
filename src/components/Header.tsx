"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { LIVE_TOOLS } from "@/lib/tools";
import { SITE_NAME } from "@/lib/seo";

export function Header() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 rounded-md" aria-label={`${SITE_NAME} home`}>
          <Logo />
          <span className="text-[0.95rem] font-semibold tracking-tight text-slate-100">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Calculators">
          {LIVE_TOOLS.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className={`rounded-md px-3 py-1.5 text-sm transition ${
                isActive(tool.path)
                  ? "bg-ink-800 text-slate-100"
                  : "text-slate-400 hover:bg-ink-850 hover:text-slate-200"
              }`}
            >
              {tool.navLabel}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-xs text-slate-500 lg:inline">
            Nothing you type leaves your browser
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="rounded-md border border-ink-700 px-2.5 py-1.5 text-sm text-slate-300 md:hidden"
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Calculators"
          className="border-t border-ink-800 bg-ink-900 px-4 py-2 md:hidden"
        >
          {LIVE_TOOLS.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-2 text-sm text-slate-300 hover:bg-ink-850"
            >
              {tool.name}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
