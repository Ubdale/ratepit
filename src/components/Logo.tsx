/**
 * Placeholder mark: a stack of descending bars in a rounded block, the last one
 * picked out in the brand violet. Swap the SVG when real brand assets land -
 * the sizing contract is just the className.
 */
export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" role="img" aria-label="Ratepit" className={className}>
      <rect x="0" y="0" width="40" height="40" rx="13" fill="#181310" />
      <rect x="8"  y="11" width="4.5" height="18" rx="2.25" fill="#FFF8EF" opacity="0.35" />
      <rect x="15" y="16" width="4.5" height="13" rx="2.25" fill="#FFF8EF" opacity="0.6" />
      <rect x="22" y="20" width="4.5" height="9"  rx="2.25" fill="#FFF8EF" />
      <rect x="29" y="24" width="4.5" height="5"  rx="2.25" fill="#C6F24F" />
    </svg>
  );
}

/** Wordmark used in the header and footer. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-xl font-extrabold tracking-tight text-ink ${className}`}>
      Ratepit
    </span>
  );
}
