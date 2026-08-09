const trackingParameters = new Set([
  "fbclid",
  "gclid",
  "msclkid",
  "ref",
  "source",
]);

export function normalizeListingUrl(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();

    for (const key of [...url.searchParams.keys()]) {
      const normalizedKey = key.toLowerCase();

      if (
        normalizedKey.startsWith("utm_") ||
        trackingParameters.has(normalizedKey)
      ) {
        url.searchParams.delete(key);
      }
    }

    url.searchParams.sort();

    if (url.pathname.length > 1) {
      url.pathname = url.pathname.replace(/\/+$/, "");
    }

    return url.toString();
  } catch {
    return value.trim();
  }
}

export function normalizeAddress(value: string | null | undefined) {
  if (!value) return null;

  const normalized = value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");

  return normalized || null;
}

export function normalizePhone(value: string | null | undefined) {
  if (!value) return null;

  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("00385")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = `385${digits.slice(1)}`;
  }

  return digits || null;
}
