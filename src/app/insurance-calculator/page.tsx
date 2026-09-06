import type { Metadata } from "next";
import { ToolPage } from "@/components/pages/ToolPage";
import { InsuranceCalculator } from "@/components/calculators/InsuranceCalculator";
import { buildMetadata, type FaqItem } from "@/lib/seo";
import { getRegion } from "@/lib/regions";

const PATH = "/insurance-calculator";
const TOOL = "Insurance Premium Estimator";
const DESCRIPTION =
  "Free insurance premium estimator for term life, health and motor cover. See a realistic range and exactly which factors drive the price, before you talk to a broker. Runs entirely in your browser.";

export const metadata: Metadata = buildMetadata({
  toolName: TOOL,
  region: getRegion("global"),
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "insurance premium calculator",
    "term life insurance calculator",
    "health insurance cost estimator",
    "car insurance estimate",
    "how much is life insurance",
  ],
});

const FAQS: FaqItem[] = [
  {
    q: "How accurate is this estimate?",
    a: "It is a model, not a quote, and it says so everywhere. Premiums are set by underwriting on information this tool deliberately does not collect, and no free public API publishes live prices. What it gives you is a realistic range built from published rate-table shapes, plus the factors that move it - enough to know whether a broker's number is sane.",
  },
  {
    q: "Why show a range instead of one number?",
    a: "Because a single number would be false precision. Two applicants with identical inputs routinely get quotes 40% apart depending on insurer appetite, medical history and location. The range reflects that honestly rather than hiding it.",
  },
  {
    q: "What actually drives a life insurance premium?",
    a: "Age first - mortality cost roughly doubles every eight years, which is why buying earlier locks in a materially lower price for the whole term. Then smoking, which typically more than doubles the premium. Then term length, cover amount, and health at underwriting.",
  },
  {
    q: "How do I lower a health insurance premium?",
    a: "The excess (deductible) is the lever most within your control: raising it transfers early-claim risk back to you and cuts the premium noticeably. Beyond that, network restrictions, outpatient exclusions and co-payment options all reduce price at the cost of coverage.",
  },
  {
    q: "Why is motor insurance so sensitive to where I live?",
    a: "Because claims frequency is intensely local. In most markets the postcode where the car is parked overnight moves the premium more than any single factor modelled here, which is why this estimator cannot be precise about motor cover.",
  },
  {
    q: "How much life cover do I need?",
    a: "A common rule of thumb is ten to twelve times annual income, adjusted for outstanding debts, years until dependants are independent, and any existing employer cover. That rule is a starting point, not advice - the right figure depends on your obligations.",
  },
  {
    q: "Is any of this sent to a server?",
    a: "No. Age, health status and cover requirements are sensitive, and none of it leaves your browser. There is no account, no submission, and no request carrying anything you enter.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolName={TOOL}
      path={PATH}
      slotPrefix="ins"
      eyebrow="Insurance"
      title="What cover should cost, and why"
      intro="A modelled range for term life, health and motor cover, with every rating factor shown. Not a quote - a sanity check before you talk to anyone selling."
      description={DESCRIPTION}
      calculator={<InsuranceCalculator />}
      faqs={FAQS}
      explainer={
        <>
          <p>
            Every other calculator on Ratepit computes an exact answer, because loan arithmetic is
            deterministic. Insurance is not. Premiums come out of underwriting models built on
            claims data that insurers do not publish, and there is no free public API that returns
            live prices. So this page does something different, and it is important to be clear
            about what.
          </p>

          <h3>What this actually does</h3>
          <p>
            It models the <em>shape</em> of published rate tables: a base rate per unit of cover,
            multiplied by the rating factors insurers consistently use - age, smoking status, term,
            excess, claims history. Then it returns a range rather than a point, because the spread
            between insurers for an identical profile is genuinely wide.
          </p>
          <p>
            The multipliers are shown to you explicitly. That is the useful part: not the number,
            but seeing that being a smoker roughly doubles a life premium, or that raising your
            excess is the one lever on health cover you fully control.
          </p>

          <h3>Why we will not fake a quote</h3>
          <p>
            It would be easy to present a single confident figure. It would also be wrong, and on a
            product where people make real decisions about protecting their families, a
            confident-looking wrong number is worse than an honest range. The same principle governs
            the rest of the site: live data where a reliable free source exists, a clearly labelled
            estimate where it does not, and never an invented number dressed up as fact.
          </p>

          <h3>Age is the one thing you cannot undo</h3>
          <p>
            Mortality cost compounds. On term life it roughly doubles every eight years, so the same
            cover bought at 30 rather than 40 is not marginally cheaper - it is a different price
            bracket, locked in for the whole term. If cover is something you intend to buy
            eventually, the arithmetic strongly favours buying it sooner.
          </p>

          <h3>What no model can see</h3>
          <ul>
            <li>
              <strong>Your medical history.</strong> Pre-existing conditions are the largest single
              driver of both price and eligibility, and they are assessed individually.
            </li>
            <li>
              <strong>Where you live.</strong> Health and motor pricing is regional, often down to
              the postcode.
            </li>
            <li>
              <strong>Insurer appetite.</strong> Insurers actively target different risk profiles,
              which is why shopping around moves the price so much.
            </li>
            <li>
              <strong>Occupation and hobbies.</strong> Hazardous work and pursuits carry loadings or
              exclusions.
            </li>
            <li>
              <strong>Policy detail.</strong> Exclusions, waiting periods, co-payments and claim
              limits change what the cover is worth as much as the premium does.
            </li>
          </ul>

          <p>
            Use this to walk into a conversation informed, to spot a quote that is wildly out of
            line, and to understand which levers actually move your price. Then get real quotes.
          </p>
        </>
      }
    />
  );
}
