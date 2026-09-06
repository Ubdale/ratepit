import type { Metadata } from "next";
import type { Region } from "./regions";

export const SITE_NAME = "Ratepit";
export const SITE_TAGLINE = "Free, private finance calculators that never touch a server";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ratepit.app";
export const SIBLING_URL = "https://toolpit.app";

/** Region-aware title: "Ratepit - EMI Calculator for India". */
export function regionalTitle(toolName: string, region: Region): string {
  if (region.slug === "global") return `${SITE_NAME} - ${toolName}`;
  const preposition = region.slug === "usa" ? "in" : "for";
  return `${SITE_NAME} - ${toolName} ${preposition} ${region.name}`;
}

interface PageSeoArgs {
  toolName: string;
  region: Region;
  description: string;
  /** Route without a region suffix, e.g. "/loan-emi-calculator". */
  path: string;
  keywords?: string[];
}

export function buildMetadata({
  toolName, region, description, path, keywords = [],
}: PageSeoArgs): Metadata {
  const canonical = region.slug === "global" ? path : `${path}/${region.slug}`;
  const title = regionalTitle(toolName, region);

  return {
    // Absolute: the title already carries the brand, so skip the layout template.
    title: { absolute: title },
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

/** FAQPage structured data for rich snippets. */
export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** SoftwareApplication structured data, naming Ratepit as the app. */
export function appSchema({
  toolName, description, path, region,
}: {
  toolName: string;
  description: string;
  path: string;
  region: Region;
}) {
  const canonical = region.slug === "global" ? path : `${path}/${region.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${SITE_NAME} ${toolName}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any (web browser)",
    url: `${SITE_URL}${canonical}`,
    description,
    isAccessibleForFree: true,
    browserRequirements: "Requires JavaScript.",
    offers: { "@type": "Offer", price: "0", priceCurrency: region.currency },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function breadcrumbSchema(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
