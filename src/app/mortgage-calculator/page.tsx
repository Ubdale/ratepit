import type { Metadata } from "next";
import {
  MortgagePage, MORTGAGE_PATH, MORTGAGE_TOOL_NAME, mortgageDescription,
} from "@/components/pages/MortgagePage";
import { buildMetadata } from "@/lib/seo";
import { getRegion } from "@/lib/regions";

const region = getRegion("global");

export const metadata: Metadata = buildMetadata({
  toolName: MORTGAGE_TOOL_NAME,
  region,
  description: mortgageDescription(region),
  path: MORTGAGE_PATH,
  keywords: [
    "mortgage calculator",
    "home loan calculator",
    "monthly mortgage payment",
    "amortisation schedule",
    "pmi calculator",
  ],
});

export default function Page() {
  return <MortgagePage region={region} />;
}
