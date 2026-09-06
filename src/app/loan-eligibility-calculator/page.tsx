import type { Metadata } from "next";
import { ToolPage } from "@/components/pages/ToolPage";
import { EligibilityCalculator } from "@/components/calculators/EligibilityCalculator";
import { Formula } from "@/components/content";
import { buildMetadata, type FaqItem } from "@/lib/seo";
import { getRegion } from "@/lib/regions";

const PATH = "/loan-eligibility-calculator";
const TOOL = "Loan Eligibility Calculator";
const DESCRIPTION =
  "Free loan eligibility calculator: estimate how much you could borrow from your income, existing repayments and your lender's income ratio (FOIR, DTI or TDSR). Runs entirely in your browser.";

export const metadata: Metadata = buildMetadata({
  toolName: TOOL,
  region: getRegion("global"),
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "loan eligibility calculator",
    "how much can i borrow",
    "borrowing capacity calculator",
    "foir calculator",
    "debt to income ratio calculator",
  ],
});

const FAQS: FaqItem[] = [
  {
    q: "How much can I borrow?",
    a: "Lenders cap your total monthly repayments at a share of your income. Subtract what you already pay on other debts, and whatever is left is what a new loan can use. This calculator takes that spare repayment and works backwards through the annuity formula to the principal it supports.",
  },
  {
    q: "What is FOIR, DTI or TDSR?",
    a: "They are the same idea under different names: the maximum share of income a lender will let you commit to debt repayments. India and Pakistan call it FOIR (Fixed Obligation to Income Ratio), the US calls it DTI (debt-to-income), and Singapore regulates it as TDSR, capped at 55%. Typical limits run from 40% to 55%.",
  },
  {
    q: "Should I use gross or net income?",
    a: "It depends on the lender. US lenders generally work on gross (pre-tax) income; lenders in India, Pakistan and much of the Gulf usually work on net take-home pay. Use whichever your lender uses, or run it both ways to see the range.",
  },
  {
    q: "Why does a longer term increase how much I can borrow?",
    a: "Because eligibility is driven by the monthly repayment, not the total cost. Stretching the term lowers the repayment on any given principal, so the same monthly allowance supports a larger loan - while costing considerably more in total interest.",
  },
  {
    q: "Does this guarantee I will be approved?",
    a: "No. It is an affordability ceiling, not an offer. Lenders also assess credit history, employment type and tenure, age at loan maturity, the asset being financed, and their own risk appetite. A clean affordability calculation can still be declined on any of those.",
  },
  {
    q: "What counts as an existing repayment?",
    a: "Every regular debt payment: other loans, car finance, credit card minimums, buy-now-pay-later instalments and guarantor obligations. Lenders find these on your credit file, so leaving them out only misleads you.",
  },
  {
    q: "Is my income data sent anywhere?",
    a: "No. Income is exactly the kind of information that should never leave your device, and it does not - the entire calculation runs in your browser.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolName={TOOL}
      path={PATH}
      slotPrefix="elig"
      eyebrow="Eligibility"
      title="How much would a lender actually give you?"
      intro="Your income sets a ceiling on monthly repayments. Existing debt eats into it. What is left decides how much you can borrow - and this shows you the whole chain."
      description={DESCRIPTION}
      calculator={<EligibilityCalculator />}
      faqs={FAQS}
      explainer={
        <>
          <p>
            Lenders do not start from the amount you want. They start from your income, cap the
            share of it that can go to debt, subtract what you already owe, and lend against
            whatever repayment capacity is left.
          </p>

          <h3>The chain</h3>
          <Formula>
            {"allowance   = (income + other income) x ratio%\nspare       = allowance - existing repayments\nmax loan    = spare x ((1 + r)^n - 1) / (r x (1 + r)^n)"}
          </Formula>
          <p>
            The last line is the annuity formula run backwards. Instead of asking what a loan costs
            per month, it asks what monthly payment can support - which is precisely how an
            underwriter reads your file.
          </p>

          <h3>The ratio is the whole game</h3>
          <p>
            That single percentage decides more than the interest rate does. It goes by different
            names in different markets - FOIR in India and Pakistan, DTI in the US, TDSR in
            Singapore where regulation caps it at 55% - but the mechanic is identical. Typical
            limits run 40-55%, and lenders often tighten them for self-employed applicants or
            longer terms.
          </p>

          <h3>Why existing debt hurts so much</h3>
          <p>
            Existing repayments come off the top. A card minimum of a few hundred a month does not
            just reduce your borrowing by a few hundred - it reduces it by the entire principal that
            payment could have supported over the full term, which on a long loan is many times
            larger. Clearing small debts before applying is often the highest-leverage thing you can
            do.
          </p>

          <h3>Borrowing capacity is not a target</h3>
          <p>
            The number this produces is the most a lender would allow, calculated at today&apos;s
            rate with today&apos;s income. It assumes nothing goes wrong. Borrowing to the ceiling
            leaves no room for a rate rise, a lost job or a change in circumstances - which is why
            the maximum and the sensible amount are rarely the same figure.
          </p>

          <h3>What this does not model</h3>
          <ul>
            <li>
              <strong>Credit history.</strong> A thin or damaged file reduces or removes eligibility
              regardless of income.
            </li>
            <li>
              <strong>Employment type.</strong> Self-employed and contract income is usually
              discounted or averaged over several years.
            </li>
            <li>
              <strong>Age at maturity.</strong> Most lenders require the loan to end before a set
              age, which caps the term.
            </li>
            <li>
              <strong>Stress testing.</strong> Many regulators require affordability to be tested at
              a rate well above the one on offer.
            </li>
            <li>
              <strong>Loan-to-value limits.</strong> For secured lending, the asset caps the loan
              independently of your income.
            </li>
          </ul>
        </>
      }
    />
  );
}
