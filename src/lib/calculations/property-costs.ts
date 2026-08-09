import Decimal from "decimal.js";

type DecimalInput = string | number | null | undefined;

export type PropertyCostInputs = {
  askingPrice?: DecimalInput;
  targetOfferPrice?: DecimalInput;
  livingAreaM2?: DecimalInput;
  newConstruction?: boolean | null;
  agencyFeePercent?: DecimalInput;
  solemnizationCost?: DecimalInput;
  additionalCosts?: DecimalInput;
  furnishingCost?: DecimalInput;
  renovationCost?: DecimalInput;
};

export type PropertyCostResult = {
  calculationBase: string | null;
  calculationBaseSource: "targetOfferPrice" | "askingPrice" | null;
  propertyTax: string | null;
  agencyFee: string | null;
  solemnizationCost: string;
  estimatedTotal: string | null;
  askingPricePerM2: string | null;
  targetPricePerM2: string | null;
};

function optionalDecimal(value: DecimalInput) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  try {
    return new Decimal(
      typeof value === "string" ? value.replace(",", ".") : value,
    );
  } catch {
    return null;
  }
}

function roundMoney(value: Decimal) {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

function moneyString(value: Decimal) {
  return roundMoney(value).toFixed(2);
}

function calculatePricePerM2(price: Decimal | null, area: Decimal | null) {
  if (!price || !area || area.lte(0)) {
    return null;
  }

  return moneyString(price.dividedBy(area));
}

export function calculatePropertyCosts(
  inputs: PropertyCostInputs,
): PropertyCostResult {
  const askingPrice = optionalDecimal(inputs.askingPrice);
  const targetOfferPrice = optionalDecimal(inputs.targetOfferPrice);
  const livingArea = optionalDecimal(inputs.livingAreaM2);
  const calculationBase = targetOfferPrice ?? askingPrice;
  const calculationBaseSource = targetOfferPrice
    ? "targetOfferPrice"
    : askingPrice
      ? "askingPrice"
      : null;

  if (!calculationBase) {
    return {
      calculationBase: null,
      calculationBaseSource: null,
      propertyTax: null,
      agencyFee: null,
      solemnizationCost: "2000.00",
      estimatedTotal: null,
      askingPricePerM2: calculatePricePerM2(askingPrice, livingArea),
      targetPricePerM2: calculatePricePerM2(targetOfferPrice, livingArea),
    };
  }

  const propertyTaxPercent = inputs.newConstruction
    ? new Decimal(0)
    : new Decimal(3);
  const agencyFeePercent =
    optionalDecimal(inputs.agencyFeePercent) ?? new Decimal(0);
  const propertyTax = roundMoney(
    calculationBase.times(propertyTaxPercent).dividedBy(100),
  );
  const agencyFee = roundMoney(
    calculationBase.times(agencyFeePercent).dividedBy(100),
  );
  const solemnizationCost =
    optionalDecimal(inputs.solemnizationCost) ?? new Decimal(2000);
  const fixedCosts = solemnizationCost
    .plus(optionalDecimal(inputs.additionalCosts) ?? 0)
    .plus(optionalDecimal(inputs.furnishingCost) ?? 0)
    .plus(optionalDecimal(inputs.renovationCost) ?? 0);
  const estimatedTotal = calculationBase
    .plus(propertyTax)
    .plus(agencyFee)
    .plus(fixedCosts);

  return {
    calculationBase: moneyString(calculationBase),
    calculationBaseSource,
    propertyTax: moneyString(propertyTax),
    agencyFee: moneyString(agencyFee),
    solemnizationCost: moneyString(solemnizationCost),
    estimatedTotal: moneyString(estimatedTotal),
    askingPricePerM2: calculatePricePerM2(askingPrice, livingArea),
    targetPricePerM2: calculatePricePerM2(targetOfferPrice, livingArea),
  };
}
