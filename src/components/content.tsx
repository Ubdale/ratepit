"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { FaqItem } from "@/lib/seo";

/** Injects structured data. Content is ours, so the JSON is safe to serialise. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * The "how this is calculated" block. Sits below the tool: it earns the ranking
 * and keeps people on the page, but never gets between an input and its result.
 */
export function ExplainerSection({
  title = "How this is calculated",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card border-2 border-ink bg-paper p-6 sm:p-8">
      <p className="eyebrow">Method</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">{title}</h2>
      <div className="prose-ratepit mt-6">{children}</div>
    </section>
  );
}

/** Renders the same items that feed the FAQPage schema, so the two never drift. */
export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="rounded-card border-2 border-ink bg-paper p-6 sm:p-8">
      <p className="eyebrow">Questions</p>
      <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight">Frequently asked</h2>
      <div className="mt-6">
        {items.map((item, i) => (
          <Accordion key={item.q}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "text.disabled" }} />}
              aria-controls={`faq-${i}-content`}
              id={`faq-${i}-header`}
            >
              <span className="flex gap-4 pr-4 text-base font-medium text-ink">
                <span className="figure shrink-0 text-sm text-violet-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.q}
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <p className="max-w-prose pb-4 pl-9 text-sm leading-relaxed text-ink-muted">
                {item.a}
              </p>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </section>
  );
}

export function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border-2 border-ink bg-cream-deep px-5 py-4">
      <code className="whitespace-pre font-mono text-sm font-semibold text-ink">{children}</code>
    </div>
  );
}
