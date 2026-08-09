import { describe, expect, it } from "vitest";

import {
  normalizeAddress,
  normalizeListingUrl,
  normalizePhone,
} from "./normalization";

describe("property duplicate normalization", () => {
  it("removes tracking data and insignificant URL differences", () => {
    expect(
      normalizeListingUrl(
        "https://EXAMPLE.com/house/?utm_source=mail&b=2&a=1#photos",
      ),
    ).toBe("https://example.com/house?a=1&b=2");
  });

  it("normalizes Croatian diacritics, punctuation and spacing in addresses", () => {
    expect(normalizeAddress("  Ulica Šime  12, Zagreb ")).toBe(
      "ulica sime 12 zagreb",
    );
  });

  it("normalizes common Croatian phone formats", () => {
    expect(normalizePhone("091 123 4567")).toBe("385911234567");
    expect(normalizePhone("+385 91 123 4567")).toBe("385911234567");
    expect(normalizePhone("00385 91 123 4567")).toBe("385911234567");
  });
});
