const eurFormatter = new Intl.NumberFormat("hr-HR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return eurFormatter.format(Number(value));
}
