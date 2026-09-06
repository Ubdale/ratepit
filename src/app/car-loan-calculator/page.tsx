import type { Metadata } from "next";
import { ToolPage } from "@/components/pages/ToolPage";
import { CarLoanCalculator } from "@/components/calculators/CarLoanCalculator";
import { Formula } from "@/components/content";
import { buildMetadata, type FaqItem } from "@/lib/seo";
import { getRegion } from "@/lib/regions";

const PATH = "/car-loan-calculator";
const TOOL = "Car Loan Calculator";
const DESCRIPTION =
  "Free car loan calculator: monthly payment, total interest and full schedule, with trade-in, negative equity, sales tax, fees and balloon/PCP options. Runs entirely in your browser.";

export const metadata: Metadata = buildMetadata({
  toolName: TOOL,
  region: getRegion("global"),
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "car loan calculator",
    "auto loan calculator",
    "vehicle finance calculator",
    "car payment calculator",
    "pcp balloon calculator",
  ],
});

const FAQS: FaqItem[] = [
  {
    q: "How is a car loan payment calculated?",
    a: "The amount financed is the vehicle price plus tax and fees, minus your down payment and any trade-in equity. That amount is then amortised over the term using the standard annuity formula, so every instalment covers the month's interest first and reduces the principal with the rest.",
  },
  {
    q: "What is negative equity on a trade-in?",
    a: "It is when you still owe more finance on your old car than the dealer will allow you for it. The shortfall does not disappear - it is added to the new loan, so you begin the new agreement already owing more than the new car is worth. The calculator flags this as soon as it happens.",
  },
  {
    q: "What is a balloon payment or PCP?",
    a: "A large lump sum deferred to the end of the agreement, often called a guaranteed future value. Only the difference between the loan and the discounted balloon is amortised, which is why the monthly payment looks low. At the end you pay the balloon, refinance it, or hand the car back.",
  },
  {
    q: "Is a longer term a good idea?",
    a: "It lowers the monthly payment and raises the total interest. The bigger risk is that cars depreciate faster than a long loan amortises, so on a 72- or 84-month term you can spend years owing more than the car is worth - which matters the moment you want to sell or the car is written off.",
  },
  {
    q: "Should I take the dealer finance or the manufacturer's low rate?",
    a: "Compare the total cost, not the rate. A subsidised low rate is often offered instead of a cash discount, so a higher rate on a lower price can work out cheaper. Run both through the calculator with their actual prices and rates.",
  },
  {
    q: "Does this include insurance and running costs?",
    a: "No. It models the finance agreement only. Insurance, fuel, servicing, tyres and road tax are substantial and vary far too much by driver and region to estimate meaningfully here.",
  },
  {
    q: "Is anything I enter sent to a server?",
    a: "No. Every figure is calculated in your browser and nothing you type is transmitted.",
  },
];

export default function Page() {
  return (
    <ToolPage
      toolName={TOOL}
      path={PATH}
      slotPrefix="car"
      eyebrow="Car finance"
      title="What the car actually costs to finance"
      intro="Price, deposit, trade-in, tax and fees all fold into one monthly payment. See the real number, the total interest, and what a balloon defers to the end."
      description={DESCRIPTION}
      calculator={<CarLoanCalculator />}
      faqs={FAQS}
      explainer={
        <>
          <p>
            Car finance hides its cost in the monthly payment. Dealers quote the instalment because
            it is the number buyers react to, but the instalment can be lowered by stretching the
            term or deferring a balloon without making the car any cheaper.
          </p>

          <h3>What gets financed</h3>
          <p>
            The loan is not the sticker price. It is the price plus everything added, minus
            everything you put in:
          </p>
          <Formula>
            {"financed = price + sales tax + fees - down payment - (trade-in - trade-in owed)"}
          </Formula>
          <p>
            Note the last bracket. If you still owe more on the old car than it is worth, that
            negative equity is a positive number added to the new loan.
          </p>

          <h3>The payment</h3>
          <p>
            Without a balloon, the amount financed amortises normally over the term. With one, only
            the present value of the balloon is removed from the amount being amortised:
          </p>
          <Formula>
            {"M = (financed - balloon / (1 + r)^n) x r x (1 + r)^n / ((1 + r)^n - 1)"}
          </Formula>
          <p>
            That is why a balloon cuts the monthly payment so sharply - you are simply not repaying
            that portion yet, while still paying interest on it throughout.
          </p>

          <h3>The depreciation trap</h3>
          <p>
            A new car typically loses a fifth of its value in the first year. A long loan repays
            principal slowly at the start. Put those together and there is a window - longest on 72-
            and 84-month terms with small deposits - where you owe more than the car is worth. That
            is only a theoretical problem until you need to sell, or the car is written off and the
            insurer pays market value rather than your balance.
          </p>

          <h3>What this does not cover</h3>
          <ul>
            <li>
              <strong>Running costs.</strong> Insurance, fuel or charging, servicing, tyres and road
              tax often exceed the finance payment over the life of the car.
            </li>
            <li>
              <strong>Mileage limits and end-of-contract charges.</strong> PCP agreements charge for
              excess mileage and damage when you hand the car back.
            </li>
            <li>
              <strong>Add-ons.</strong> Gap insurance, paint protection and extended warranties are
              frequently financed alongside the car and add interest of their own.
            </li>
            <li>
              <strong>Rate changes.</strong> The rate you enter is held for the whole term.
            </li>
          </ul>
        </>
      }
    />
  );
}
