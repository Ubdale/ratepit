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
    <section className="card">
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
      <div className="prose-ratepit mt-3">{children}</div>
    </section>
  );
}

/** Renders the same items that feed the FAQPage schema, so the two never drift. */
export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold text-slate-100">Frequently asked questions</h2>
      <dl className="mt-4 divide-y divide-ink-800">
        {items.map((item) => (
          <div key={item.q} className="py-3 first:pt-0 last:pb-0">
            <dt className="text-sm font-medium text-slate-200">{item.q}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-slate-400">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-ink-700 bg-ink-950/60 px-4 py-3">
      <code className="whitespace-pre font-mono text-[0.8125rem] text-brand-300">{children}</code>
    </div>
  );
}
