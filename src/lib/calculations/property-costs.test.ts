import { describe, expect, it } from "vitest";

import { calculatePropertyCosts } from "./property-costs";

describe("calculatePropertyCosts", () => {
  it("uses the target offer and calculates the complete estimate", () => {
    const result = calculatePropertyCosts({
      askingPrice: "455000",
      targetOfferPrice: "420000",
      livingAreaM2: "245",
      agencyFeePercent: "2.5",
      solemnizationCost: "2000",
      additionalCosts: "5000",
      furnishingCost: "20000",
      renovationCost: "10000",
    });

    expect(result).toEqual({
      calculationBase: "420000.00",
      calculationBaseSource: "targetOfferPrice",
      propertyTax: "12600.00",
      agencyFee: "10500.00",
      solemnizationCost: "2000.00",
      estimatedTotal: "480100.00",
      askingPricePerM2: "1857.14",
      targetPricePerM2: "1714.29",
    });
  });

  it("falls back to asking price when no target offer exists", () => {
    const result = calculatePropertyCosts({
      askingPrice: "455000",
    });

    expect(result.calculationBaseSource).toBe("askingPrice");
    expect(result.propertyTax).toBe("13650.00");
    expect(result.solemnizationCost).toBe("2000.00");
    expect(result.estimatedTotal).toBe("470650.00");
  });

  it("returns unknown price-based costs when both prices are missing", () => {
    const result = calculatePropertyCosts({
      solemnizationCost: "2000",
      livingAreaM2: "100",
    });

    expect(result.calculationBase).toBeNull();
    expect(result.propertyTax).toBeNull();
    expect(result.agencyFee).toBeNull();
    expect(result.solemnizationCost).toBe("2000.00");
    expect(result.estimatedTotal).toBeNull();
    expect(result.askingPricePerM2).toBeNull();
  });

  it("does not calculate property tax for new construction", () => {
    const result = calculatePropertyCosts({
      askingPrice: "100",
      newConstruction: true,
    });

    expect(result.propertyTax).toBe("0.00");
    expect(result.agencyFee).toBe("0.00");
    expect(result.estimatedTotal).toBe("2100.00");
  });
});
