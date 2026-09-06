# Ratepit

**Free, private finance calculators that never touch a server.**

Every calculation runs client-side in the browser — no account, no upload, no figure of the
user's stored anywhere.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · MUI · Recharts · Motion · dark by default.

### Design system

"Editorial ledger": a warm-tinted near-black canvas with warm off-white text (not cold
slate), **citron** as the single brand accent used about once per screen, and **coral**
reserved for live/estimated-data notices. Three type roles — Instrument Serif for display,
Inter for reading, JetBrains Mono for every figure. Tokens live in `tailwind.config.ts`;
component primitives (`.panel`, `.btn`, `.chip`, `.eyebrow`, `.figure`) in
`src/app/globals.css`.

**MUI supplies the controls** (slider, select, switch, toggle group, accordion, tooltip),
themed in `src/theme.ts` to the Ratepit palette rather than stock Material. Tailwind still
owns layout. Two things to know before changing that setup:

- The emotion cache runs **without** `enableCssLayer`. Tailwind v3 emits its preflight
  unlayered, and an unlayered rule beats any layered one regardless of specificity — with
  the layer on, preflight's `box-sizing: border-box` silently overrode MUI's box metrics
  and size overrides in the theme were dropped.
- A plain function exported from a `"use client"` module cannot be *called* by a server
  component. Shared data like `toolAccent` lives in `src/lib/tools.ts` for that reason.

Rules the codebase holds itself to:

- Spacing on the 4/8 scale; page gutter `px-6`; content `max-w-6xl`.
- A sparse type scale — no sizes between the defined steps.
- Mobile-first, and every page must survive a 360px viewport with no horizontal scroll.
- Interactive controls are at least 44px tall (sliders included — the visible track is a
  hairline, the hit area is not).
- Motion enters once on scroll, animates opacity/transform only, and branches on
  `useReducedMotion()`. **Reveals never ship `opacity: 0` in the server HTML** — see
  `src/components/motion.tsx`; content stays visible if JavaScript fails.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000
```

```bash
npm run build      # production build (prerenders all region routes)
npm start
npm run typecheck
```

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `FRED_API_KEY` | No | [Free key](https://fred.stlouisfed.org/docs/api/api_key.html) for the live US 30-year mortgage rate. Without it the endpoint returns a clearly-labelled estimate. |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin for sitemap and OpenGraph URLs. Defaults to `https://ratepit.app`. |

## Calculators

| Route | Status |
|---|---|
| `/loan-emi-calculator` | Live |
| `/mortgage-calculator` | Live |
| `/credit-card-payoff-calculator` | Live |
| `/car-loan-calculator` | Live |
| `/loan-eligibility-calculator` | Live |
| `/insurance-calculator` | Live |

The EMI and mortgage calculators also have nine prerendered region routes — `/{tool}/{usa,uk,india,pakistan,uae,canada,australia,singapore,eurozone}`
— with its own title, description, canonical, FAQ set and field defaults, so each can
rank independently in its own market.

Income tax is deliberately out of scope: doing it honestly means encoding one country's
tax code at a time and keeping it current, and a wrong tax estimate is worse than none.

## Architecture

```
src/
  app/
    api/rates/currency/       Frankfurter (ECB) + fallback source proxy, 1h cache
    api/rates/mortgage-us/    FRED MORTGAGE30US proxy, 1h cache
    {tool}/page.tsx           global variant
    {tool}/[region]/page.tsx  prerendered per region (generateStaticParams)
  components/
    CurrencyProvider.tsx      currency context, FX cache, conversion
    FilterBar.tsx             the one filter bar reused by every calculator
    calculators/              the interactive tools
    pages/                    server-rendered page bodies (copy, schema, ad slots)
    charts.tsx  fields.tsx  results.tsx  content.tsx  AdSlot.tsx
  lib/
    finance.ts    amortisation + mortgage math (pure, checked by hand against known values)
    loans.ts      card payoff, car finance and borrowing-eligibility math
    insurance.ts  premium ESTIMATOR - models rate-table shapes, returns a range, never a quote
    regions.ts    per-region field config — terms, rates, taxes, fees, caveats
    currencies.ts nine currencies + locale detection
    seo.ts        titles, metadata, FAQPage / SoftwareApplication / Breadcrumb schema
    viz.ts        validated chart palette
```

### Adding a calculator

1. Add the entry to `src/lib/tools.ts` and flip `live: true`.
2. Add its config block to each region in `src/lib/regions.ts` if it needs regional defaults.
3. Build the client component in `src/components/calculators/`.
4. Build the page body in `src/components/pages/` — headline, explainer, FAQ, ad slots.
5. Add `app/{route}/page.tsx` and, if regional, `app/{route}/[region]/page.tsx`.

The sitemap picks it up automatically from `tools.ts`.

## Data sources

- **Exchange rates** — [Frankfurter](https://frankfurter.app) (ECB reference rates), with
  [open.er-api.com](https://open.er-api.com) filling in PKR and AED, which the ECB does not publish.
- **US mortgage rate** — FRED series `MORTGAGE30US` (Freddie Mac PMMS weekly average).

Both are proxied server-side, cached for an hour on the server and again in
`localStorage` on the client. **Every failure path degrades to a hardcoded default plus a
visible "estimated rate, live data unavailable" notice** — a calculator never breaks, and
never presents a guess as live data. Regions with no reliable free rate feed get manual
entry and say so, rather than being shown an invented number.

## Monetisation

Ad placeholders are marked `<!-- AD SLOT -->` in `src/components/AdSlot.tsx` and placed 2–3
per page, always outside the input → result flow. To go live: add the AdSense loader script
in `src/app/layout.tsx` (marked with a comment) and replace the placeholder box in
`AdSlot.tsx` with an `<ins class="adsbygoogle">` tag keyed on the slot `id`.

Every calculator page carries a "how this is calculated" section and an FAQ, both of which
also feed `FAQPage` and `SoftwareApplication` structured data.

## Charts

The palette in `src/lib/viz.ts` is validated as a set against the dark chart surface —
lightness band, chroma floor, colour-vision-deficiency separation, normal-vision separation
and ≥3:1 contrast. **Re-validate before substituting hues.** Every chart ships a table view
alongside it, and no chart uses a second y-axis.

## Disclaimer

Ratepit produces estimates for general information only. It is not financial advice, and
results are illustrations rather than offers.
