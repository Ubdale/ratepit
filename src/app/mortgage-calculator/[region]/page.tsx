import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MortgagePage, MORTGAGE_PATH, MORTGAGE_TOOL_NAME, mortgageDescription,
} from "@/components/pages/MortgagePage";
import { buildMetadata } from "@/lib/seo";
import { REGIONS, SUB_ROUTE_REGIONS, isRegionSlug } from "@/lib/regions";

interface Props {
  params: { region: string };
}

// Prerendered per region so each country page can rank on its own.
export function generateStaticParams() {
  return SUB_ROUTE_REGIONS.map((region) => ({ region }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: Props): Metadata {
  if (!isRegionSlug(params.region)) return {};
  const region = REGIONS[params.region];
  const local = region.short.toLowerCase();
  return buildMetadata({
    toolName: MORTGAGE_TOOL_NAME,
    region,
    description: mortgageDescription(region),
    path: MORTGAGE_PATH,
    keywords: [
      `mortgage calculator ${local}`,
      `home loan calculator ${local}`,
      `${region.mortgageTerm.toLowerCase()} emi ${local}`,
      "monthly mortgage payment",
    ],
  });
}

export default function Page({ params }: Props) {
  if (!isRegionSlug(params.region)) notFound();
  return <MortgagePage region={REGIONS[params.region]} />;
}
