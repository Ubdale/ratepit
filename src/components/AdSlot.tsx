/*
 * AD SLOT
 * -------
 * Placeholder container for an AdSense unit. To go live, drop the AdSense
 * script into src/app/layout.tsx and replace the placeholder box below with
 * an <ins class="adsbygoogle" ...> tag carrying your slot id.
 *
 * Slots are deliberately placed outside the input/result flow: never between
 * a field and the number it changes.
 */

type SlotVariant = "leaderboard" | "inline" | "rectangle";

const VARIANTS: Record<SlotVariant, { minHeight: string; hint: string }> = {
  leaderboard: { minHeight: "min-h-[90px]", hint: "728x90 / responsive" },
  inline: { minHeight: "min-h-[100px]", hint: "responsive in-article" },
  rectangle: { minHeight: "min-h-[250px]", hint: "300x250 / responsive" },
};

export function AdSlot({
  id,
  variant = "inline",
  className = "",
}: {
  /** Human-readable slot name, e.g. "emi-below-results". */
  id: string;
  variant?: SlotVariant;
  className?: string;
}) {
  const spec = VARIANTS[variant];

  return (
    <aside
      aria-label="Advertisement"
      data-ad-slot={id}
      className={`my-6 ${className}`}
    >
      <p className="mb-1 text-center text-[0.65rem] uppercase tracking-widest text-slate-600">
        Advertisement
      </p>
      {/* AD SLOT: replace this box with the AdSense <ins> tag for `id`. */}
      <div
        className={`flex ${spec.minHeight} items-center justify-center overflow-hidden rounded-lg
                    border border-dashed border-ink-700 bg-ink-900/40 px-4 text-center`}
      >
        <span className="break-words font-mono text-[0.7rem] text-slate-600">
          ad slot &ldquo;{id}&rdquo; &middot; {spec.hint}
        </span>
      </div>
    </aside>
  );
}
