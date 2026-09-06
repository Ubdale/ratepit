import type { Metadata } from "next";
import { ToolPage } from "@/components/pages/ToolPage";
import { CardPayoffCalculator } from "@/components/calculators/CardPayoffCalculator";
import { Formula } from "@/components/content";
import { buildMetadata, type FaqItem } from "@/lib/seo";
import { getRegion } from "@/lib/regions";

const PATH = "/credit-card-payoff-calculator";
const TOOL = "Credit Card Payoff Calculator";
const DESCRIPTION =
  "Free credit card payoff calculator: see how long your balance takes to clear, what it costs in interest, and how much paying more each month saves. Runs entirely in your browser.";

export const metadata: Metadata = buildMetadata({
  toolName: TOOL,
  region: getRegion("global"),
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "credit card payoff calculator",
    "credit card interest calculator",
    "minimum payment calculator",
    "debt payoff calculator",
    "how long to pay off credit card",
  ],
});

const FAQS: FaqItem[] = [
  {
    q: "How long will it take to pay off my credit card?",
    a: "It depends entirely on how much you pay above the interest charge. Enter your balance, APR and monthly payment and the calculator walks the balance down month by month until it reaches zero, then shows the exact date.",
  },
  {
    q: "Why does paying the minimum take so long?",
    a: "Minimum payments are usually a small percentage of the balance, so as the balance falls the payment falls with it. That keeps you in the shallow end of repayment almost indefinitely - a balance that clears in three years on a fixed payment can take over twenty on minimums alone.",
  },
  {
    q: "What happens if my payment is less than the interest?",
    a: "The balance grows instead of shrinking, and no repayment date exists. The calculator detects this and tells you the exact monthly interest charge, which is the floor your payment has to clear before the debt moves at all.",
  },
  {
    q: "How is credit card interest actually calculated?",
    a: "Your APR is divided by twelve to get a monthly rate, which is charged on the outstanding balance. Whatever is left of your payment after that reduces the principal. Most issuers compound daily on the average balance, so a real statement can differ slightly from this monthly model.",
  },
  {
    q: "Is it better to pay off the highest rate or the smallest balance first?",
    a: "Mathematically, highest rate first (the avalanche method) always costs less interest. Smallest balance first (snowball) clears individual cards sooner, which some people find easier to stick with. This calculator models one card at a time, so run it once per card to compare.",
  },
  {
    q: "Does a balance transfer help?",
    a: "Usually yes, if you clear the balance before the promotional rate ends. Model it by setting the APR to the promotional rate for the promotional period, then check what happens at the revert rate if any balance would be left.",
  },
  {
    q: "Is anything I enter sent to a server?",
    a: "No. The whole calculation runs in JavaScript on your device. Ratepit never sees your balance, your rate or your payment.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolName={TOOL}
      path={PATH}
      slotPrefix="card"
      eyebrow="Credit card"
      title="Find out what that balance really costs"
      intro="Enter your balance, rate and monthly payment to see exactly when the card clears and how much of your money goes to interest along the way."
      description={DESCRIPTION}
      calculator={<CardPayoffCalculator />}
      faqs={FAQS}
      explainer={
        <>
          <p>
            A credit card is just a loan with no fixed term. That single difference is what makes it
            expensive: because you choose the payment, it is entirely possible to pay every month
            for years and barely move the balance.
          </p>

          <h3>The monthly cycle</h3>
          <p>
            Each month the issuer charges interest on what you owe, then applies your payment. Only
            what is left after interest reduces the principal:
          </p>
          <Formula>
            {"interest = balance x (APR / 12 / 100)\nprincipal = payment - interest\nbalance = balance - principal"}
          </Formula>
          <p>
            Repeat until the balance reaches zero. If <code>payment</code> is smaller than{" "}
            <code>interest</code>, <code>principal</code> is negative and the balance grows - there
            is no payoff date at all, which is the trap the calculator warns you about explicitly.
          </p>

          <h3>Why minimum payments are designed to last</h3>
          <p>
            A minimum payment is typically the greater of a small percentage of the balance and a
            flat floor. Because the percentage is applied to a shrinking balance, your payment
            shrinks too, and the debt decays asymptotically. Switching to a fixed monthly amount -
            even the same amount as today&apos;s minimum - shortens the payoff dramatically, because
            the payment no longer falls away beneath you.
          </p>

          <h3>What moves the needle</h3>
          <ul>
            <li>
              <strong>Paying more, not longer.</strong> Every extra unit of currency goes straight
              to principal and stops accruing interest permanently.
            </li>
            <li>
              <strong>Stopping new spending.</strong> This calculator assumes you add nothing to the
              balance. New purchases reset the maths.
            </li>
            <li>
              <strong>A lower rate.</strong> A balance transfer or a consolidation loan can cut the
              interest charge sharply, provided the fee is smaller than the interest saved.
            </li>
          </ul>

          <h3>What this does not model</h3>
          <ul>
            <li>
              <strong>Daily compounding.</strong> Most issuers compound on the average daily
              balance; this uses a monthly cycle, so expect small differences against a statement.
            </li>
            <li>
              <strong>Promotional and revert rates.</strong> A single APR applies for the whole
              period.
            </li>
            <li>
              <strong>Fees and penalties.</strong> Annual fees, late fees, cash advance charges and
              foreign transaction fees are not included.
            </li>
            <li>
              <strong>New spending.</strong> The balance only ever goes down.
            </li>
          </ul>
        </>
      }
    />
  );
}
