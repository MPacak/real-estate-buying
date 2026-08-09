const numberFormatter = new Intl.NumberFormat("hr-HR", {
  maximumFractionDigits: 2,
});

const dateTimeFormatter = new Intl.DateTimeFormat("hr-HR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Zagreb",
});

export function formatArea(value: string | null | undefined) {
  if (!value) return null;
  return `${numberFormatter.format(Number(value))} m²`;
}

export function formatPercentage(value: string | null | undefined) {
  if (!value) return null;
  return `${numberFormatter.format(Number(value))}%`;
}

export function formatDateTime(value: Date | null | undefined) {
  if (!value) return null;
  return dateTimeFormatter.format(value);
}

export function formatBoolean(value: boolean | null | undefined) {
  if (value === null || value === undefined) return null;
  return value ? "Yes" : "No";
}

export function formatEnum(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}
