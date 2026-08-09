import { describe, expect, it } from "vitest";

import { createPropertySchema } from "./property";

describe("createPropertySchema", () => {
  it("allows an incomplete property with only a name", () => {
    const result = createPropertySchema.parse({ name: "Test house" });

    expect(result.status).toBe("INTERESTED");
    expect(result.priority).toBe("NORMAL");
  });

  it("accepts optional ratings from 1 to 10", () => {
    expect(
      createPropertySchema.safeParse({
        name: "Rated house",
        locationRating: "1",
        valueRating: "10",
      }).success,
    ).toBe(true);
  });

  it("rejects ratings outside the supported range", () => {
    expect(
      createPropertySchema.safeParse({
        name: "Invalid rating",
        gardenRating: "11",
      }).success,
    ).toBe(false);
  });
});
