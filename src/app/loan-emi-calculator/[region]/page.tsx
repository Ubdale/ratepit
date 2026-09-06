import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmiPage, EMI_PATH, EMI_TOOL_NAME, emiDescription } from "@/components/pages/EmiPage";
import { buildMetadata } from "@/lib/seo";
import { REGIONS, SUB_ROUTE_REGIONS, isRegionSlug } from "@/lib/regions";

interface Props {
  params: { region: string };
}

// Every region route is prerendered so each one is independently indexable.
export function generateStaticParams() {
  return SUB_ROUTE_REGIONS.map((region) => ({ region }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: Props): Metadata {
  if (!isRegionSlug(params.region)) return {};
  const region = REGIONS[params.region];
  return buildMetadata({
    toolName: EMI_TOOL_NAME,
    region,
    description: emiDescription(region),
    path: EMI_PATH,
    keywords: [
      `emi calculator ${region.short.toLowerCase()}`,
      `loan calculator ${region.short.toLowerCase()}`,
      `${region.currency.toLowerCase()} loan emi`,
      "monthly instalment calculator",
    ],
  });
}

export default function Page({ params }: Props) {
  if (!isRegionSlug(params.region)) notFound();
  return <EmiPage region={REGIONS[params.region]} />;
}
