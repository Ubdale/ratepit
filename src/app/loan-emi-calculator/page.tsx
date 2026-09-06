import type { Metadata } from "next";
import { EmiPage, EMI_PATH, EMI_TOOL_NAME, emiDescription } from "@/components/pages/EmiPage";
import { buildMetadata } from "@/lib/seo";
import { getRegion } from "@/lib/regions";

const region = getRegion("global");

export const metadata: Metadata = buildMetadata({
  toolName: EMI_TOOL_NAME,
  region,
  description: emiDescription(region),
  path: EMI_PATH,
  keywords: [
    "emi calculator",
    "loan emi calculator",
    "monthly instalment calculator",
    "loan repayment calculator",
    "amortisation schedule",
  ],
});

export default function Page() {
  return <EmiPage region={region} />;
}
