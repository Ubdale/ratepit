/**
 * Placeholder mark: a descending bar stack in the "pit", with the last bar
 * picked out in citron. Swap the SVG when real brand assets land - the sizing
 * contract is just the className.
 */
export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="Ratepit" className={className}>
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="10" fill="#16151C" />
      <rect
        x="0.75" y="0.75" width="30.5" height="30.5" rx="10"
        fill="none" stroke="#3A3746" strokeWidth="1.5"
      />
      <g>
        <rect x="7" y="9" width="3.6" height="14" rx="1.8" fill="#726D80" />
        <rect x="12.6" y="13" width="3.6" height="10" rx="1.8" fill="#A9A4B6" />
        <rect x="18.2" y="16.5" width="3.6" height="6.5" rx="1.8" fill="#F2EFE9" />
        <rect x="23.8" y="19.5" width="3.6" height="3.5" rx="1.75" fill="#D6F25B" />
      </g>
    </svg>
  );
}

/** Wordmark used in the header and footer. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-lg font-medium tracking-tight text-ink ${className}`}>
      Rate<span className="text-citron-400">pit</span>
    </span>
  );
}
