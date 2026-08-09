import Decimal from "decimal.js";

type DecimalInput = string | number | null | undefined;

export type PropertyCostInputs = {
  askingPrice?: DecimalInput;
  targetOfferPrice?: DecimalInput;
  livingAreaM2?: DecimalInput;
  propertyTaxPercent?: DecimalInput;
  agencyFeePercent?: DecimalInput;
  solemnizationCost?: DecimalInput;
  additionalCosts?: DecimalInput;
  furnishingCost?: DecimalInput;
};

export type PropertyCostResult = {
  calculationBase: string | null;
  calculationBaseSource: "targetOfferPrice" | "askingPrice" | null;
  propertyTax: string | null;
  agencyFee: string | null;
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
      estimatedTotal: null,
      askingPricePerM2: calculatePricePerM2(askingPrice, livingArea),
      targetPricePerM2: calculatePricePerM2(targetOfferPrice, livingArea),
    };
  }

  const propertyTaxPercent =
    optionalDecimal(inputs.propertyTaxPercent) ?? new Decimal(0);
  const agencyFeePercent =
    optionalDecimal(inputs.agencyFeePercent) ?? new Decimal(0);
  const propertyTax = roundMoney(
    calculationBase.times(propertyTaxPercent).dividedBy(100),
  );
  const agencyFee = roundMoney(
    calculationBase.times(agencyFeePercent).dividedBy(100),
  );
  const fixedCosts = [
    inputs.solemnizationCost,
    inputs.additionalCosts,
    inputs.furnishingCost,
  ].reduce(
    (total, value) => total.plus(optionalDecimal(value) ?? 0),
    new Decimal(0),
  );
  const estimatedTotal = calculationBase
    .plus(propertyTax)
    .plus(agencyFee)
    .plus(fixedCosts);

  return {
    calculationBase: moneyString(calculationBase),
    calculationBaseSource,
    propertyTax: moneyString(propertyTax),
    agencyFee: moneyString(agencyFee),
    estimatedTotal: moneyString(estimatedTotal),
    askingPricePerM2: calculatePricePerM2(askingPrice, livingArea),
    targetPricePerM2: calculatePricePerM2(targetOfferPrice, livingArea),
  };
}
