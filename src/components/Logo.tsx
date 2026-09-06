/**
 * Placeholder mark - a downward rate curve inside a rounded "pit". Swap the SVG
 * when real brand assets land; the sizing contract is just width/height.
 */
export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="Ratepit" className={className}>
      <defs>
        <linearGradient id="ratepit-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3fd4a2" />
          <stop offset="100%" stopColor="#0e9668" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#ratepit-mark)" opacity="0.16" />
      <rect
        x="1" y="1" width="30" height="30" rx="9"
        fill="none" stroke="url(#ratepit-mark)" strokeWidth="1.5"
      />
      <path
        d="M7 10.5c3.4 0 3.4 11 6.8 11S17.2 13 20.6 13 24 20 25 20"
        fill="none"
        stroke="url(#ratepit-mark)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
