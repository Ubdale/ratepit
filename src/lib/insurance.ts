/**
 * Insurance premium ESTIMATOR.
 *
 * Real premiums are set by underwriting on data we deliberately do not collect,
 * and no free public API publishes live quotes. Rather than invent a number and
 * present it as a quote, this models published rate-table shapes and returns a
 * RANGE with the factors shown, so a reader can see exactly what drives it.
 *
 * Base rates are annual cost per 1,000 of cover, in USD, calibrated to
 * commonly published term-life and health tables. Every result must be labelled
 * as an estimate in the UI.
 */

export type CoverType = "term-life" | "health" | "auto";

export interface LifeInput {
  age: number;
  /** Cover amount (sum assured) in the display currency. */
  coverAmount: number;
  termYears: number;
  smoker: boolean;
  sex: "male" | "female" | "unspecified";
}

export interface HealthInput {
  age: number;
  /** Annual cover ceiling. */
  coverAmount: number;
  /** People on the policy including the primary member. */
  members: number;
  smoker: boolean;
  /** Excess/deductible the member pays before cover starts. */
  excess: number;
}

export interface AutoInput {
  vehicleValue: number;
  driverAge: number;
  /** Full years of claim-free driving. */
  noClaimsYears: number;
  /** At-fault claims in the last five years. */
  recentClaims: number;
  excess: number;
  comprehensive: boolean;
}

export interface PremiumFactor {
  label: string;
  /** Multiplier applied to the base rate. 1 means neutral. */
  multiplier: number;
  note?: string;
}

export interface PremiumEstimate {
  /** Midpoint annual premium, in the same currency as the inputs. */
  annual: number;
  monthly: number;
  /** Honest spread - underwriting moves real quotes well beyond a point value. */
  annualLow: number;
  annualHigh: number;
  factors: PremiumFactor[];
  /** Anything that makes the estimate materially less reliable. */
  caveats: string[];
}

const clampAge = (age: number) => Math.min(Math.max(age || 0, 18), 85);

/**
 * Term life. Mortality cost roughly doubles every 7-8 years of age, which the
 * exponential below approximates; smoking is the single largest loading.
 */
export function estimateTermLife(input: LifeInput): PremiumEstimate {
  const age = clampAge(input.age);
  const cover = Math.max(input.coverAmount || 0, 0);
  const term = Math.max(input.termYears || 1, 1);

  // Annual cost per 1,000 of cover at age 30, healthy non-smoker.
  const BASE_PER_1000 = 0.9;
  const ageFactor = Math.pow(1.09, age - 30);
  const smokerFactor = input.smoker ? 2.4 : 1;
  // Longer terms average in later, costlier years.
  const termFactor = 1 + Math.max(term - 10, 0) * 0.022;
  const sexFactor = input.sex === "female" ? 0.85 : input.sex === "male" ? 1.05 : 1;

  const annual =
    (cover / 1000) * BASE_PER_1000 * ageFactor * smokerFactor * termFactor * sexFactor;

  const factors: PremiumFactor[] = [
    { label: `Age ${age}`, multiplier: ageFactor, note: "Mortality cost roughly doubles every 8 years." },
    {
      label: input.smoker ? "Smoker" : "Non-smoker",
      multiplier: smokerFactor,
      note: input.smoker ? "The single largest loading on a life policy." : undefined,
    },
    { label: `${term}-year term`, multiplier: termFactor },
    {
      label:
        input.sex === "unspecified"
          ? "Sex not stated"
          : input.sex === "female"
            ? "Female"
            : "Male",
      multiplier: sexFactor,
      note: input.sex === "unspecified" ? "Using a blended rate." : undefined,
    },
  ];

  const caveats = [
    "Assumes you pass standard medical underwriting with no pre-existing conditions.",
    "Occupation, height and weight, family history and hazardous hobbies all move the real price.",
  ];
  if (age > 60) caveats.push("Cover above age 60 is priced far more individually - treat this as a rough floor.");
  if (input.sex === "unspecified") {
    caveats.push("Some markets (the EU, for example) require unisex pricing, so a single blended rate applies there.");
  }

  return withSpread(annual, factors, caveats, 0.35);
}

/**
 * Health cover. Age drives it, but the excess is the lever most people can
 * actually pull.
 */
export function estimateHealth(input: HealthInput): PremiumEstimate {
  const age = clampAge(input.age);
  const cover = Math.max(input.coverAmount || 0, 0);
  const members = Math.max(Math.round(input.members || 1), 1);
  const excess = Math.max(input.excess || 0, 0);

  // Annual cost per 1,000 of annual cover ceiling, age 30, single member.
  const BASE_PER_1000 = 22;
  const ageFactor = Math.pow(1.055, age - 30);
  const smokerFactor = input.smoker ? 1.25 : 1;
  // Additional members cost less each - family policies are priced at a discount.
  const memberFactor = 1 + (members - 1) * 0.75;
  // A higher excess transfers risk back to the member.
  const excessRelief = cover > 0 ? Math.max(1 - (excess / cover) * 1.6, 0.55) : 1;

  const annual =
    (cover / 1000) * BASE_PER_1000 * ageFactor * smokerFactor * memberFactor * excessRelief;

  const factors: PremiumFactor[] = [
    { label: `Age ${age}`, multiplier: ageFactor },
    { label: `${members} member${members > 1 ? "s" : ""}`, multiplier: memberFactor },
    { label: input.smoker ? "Smoker" : "Non-smoker", multiplier: smokerFactor },
    {
      label: "Excess",
      multiplier: excessRelief,
      note: excessRelief < 1 ? "A higher excess lowers the premium." : undefined,
    },
  ];

  const caveats = [
    "Health pricing is intensely local - the same profile can differ several-fold between countries and even between states.",
    "Assumes no pre-existing conditions declared; those are normally excluded or loaded.",
    "Ignores employer or state schemes, which often cover most of the real cost.",
  ];

  return withSpread(annual, factors, caveats, 0.45);
}

/** Motor cover. Claims history and age dominate; the vehicle value scales it. */
export function estimateAuto(input: AutoInput): PremiumEstimate {
  const value = Math.max(input.vehicleValue || 0, 0);
  const age = Math.min(Math.max(input.driverAge || 0, 17), 90);
  const ncd = Math.min(Math.max(input.noClaimsYears || 0, 0), 15);
  const claims = Math.max(Math.round(input.recentClaims || 0), 0);
  const excess = Math.max(input.excess || 0, 0);

  // Comprehensive cover typically runs a few percent of vehicle value a year.
  const BASE_RATE = input.comprehensive ? 0.042 : 0.019;

  // Young and very old drivers cost the most; the curve bottoms out mid-life.
  const ageFactor =
    age < 25 ? 1 + (25 - age) * 0.16 : age > 70 ? 1 + (age - 70) * 0.035 : 1;
  const ncdFactor = Math.max(1 - ncd * 0.062, 0.35);
  const claimsFactor = 1 + claims * 0.32;
  const excessRelief = value > 0 ? Math.max(1 - (excess / value) * 1.1, 0.7) : 1;

  const annual = value * BASE_RATE * ageFactor * ncdFactor * claimsFactor * excessRelief;

  const factors: PremiumFactor[] = [
    { label: input.comprehensive ? "Comprehensive" : "Third party", multiplier: 1 },
    {
      label: `Driver age ${age}`,
      multiplier: ageFactor,
      note: age < 25 ? "Under-25 drivers carry the heaviest loading." : undefined,
    },
    { label: `${ncd} years no claims`, multiplier: ncdFactor },
    {
      label: claims === 0 ? "No recent claims" : `${claims} recent claim${claims > 1 ? "s" : ""}`,
      multiplier: claimsFactor,
    },
    { label: "Excess", multiplier: excessRelief },
  ];

  const caveats = [
    "Motor pricing is postcode-level in most markets - where the car is parked overnight can move the premium more than anything here.",
    "Vehicle make, model, engine size and security rating are not modelled.",
    "Annual mileage and named additional drivers also change the price materially.",
  ];

  return withSpread(annual, factors, caveats, 0.4);
}

/**
 * Wraps a midpoint in an honest range. `spread` is the fraction either side -
 * wider for lines where underwriting varies more.
 */
function withSpread(
  annual: number,
  factors: PremiumFactor[],
  caveats: string[],
  spread: number,
): PremiumEstimate {
  const safe = isFinite(annual) && annual > 0 ? annual : 0;
  return {
    annual: safe,
    monthly: safe / 12,
    annualLow: safe * (1 - spread),
    annualHigh: safe * (1 + spread),
    factors,
    caveats,
  };
}
