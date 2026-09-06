import Link from "next/link";
import { FilterBar } from "@/components/FilterBar";
import { ExplainerSection, FaqSection, JsonLd } from "@/components/content";
import { appSchema, breadcrumbSchema, faqSchema, type FaqItem } from "@/lib/seo";
import { getRegion } from "@/lib/regions";
import { LIVE_TOOLS } from "@/lib/tools";

/**
 * Page shell for the calculators that do not have per-region routes. Same
 * furniture as the regional pages - breadcrumb, filter bar, ad slots, explainer,
 * FAQ - so every tool page reads identically.
 */
export function ToolPage({
  toolName,
  path,
  eyebrow,
  title,
  intro,
  description,
  calculator,
  explainer,
  faqs,
  slotPrefix,
}: {
  toolName: string;
  path: string;
  eyebrow: string;
  /** Display headline; usually differs from the SEO title. */
  title: string;
  intro: string;
  description: string;
  calculator: React.ReactNode;
  explainer: React.ReactNode;
  faqs: FaqItem[];
  /** Prefix for the ad slot ids, e.g. "card". */
  slotPrefix: string;
}) {
  const region = getRegion("global");
  const others = LIVE_TOOLS.filter((t) => t.path !== path);

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={appSchema({ toolName, description, path, region })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ratepit", path: "/" },
          { name: toolName, path },
        ])}
      />

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
            <li className="flex min-h-[44px] items-center text-ink-muted">{toolName}</li>
          </ol>
        </nav>

        <header className="mb-10 max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">{intro}</p>
        </header>

        <FilterBar region={region} basePath={path} showRegion={false} />

        {calculator}

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-6">
            <ExplainerSection>{explainer}</ExplainerSection>
            <FaqSection items={faqs} />
          </div>

          <aside className="min-w-0 space-y-6">
            <div className="rounded-card border-2 border-ink bg-paper p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-lg font-bold text-ink">Other calculators</h2>
              <p className="mt-1.5 text-xs text-ink-muted">
                All free, all client-side, all in your currency.
              </p>
              <ul className="mt-5 space-y-2">
                {others.map((tool) => (
                  <li key={tool.path}>
                    <Link
                      href={tool.path}
                      className="flex min-h-[44px] items-center justify-between gap-3 rounded-xl
                                 px-3 text-sm text-ink-muted transition
                                 hover:bg-cream-deep hover:text-ink"
                    >
                      {tool.name}
                      <span aria-hidden className="text-ink-faint">&rarr;</span>
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
