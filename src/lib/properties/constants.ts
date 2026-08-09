export const PROPERTY_STATUSES = [
  "NEW",
  "CONSIDERING",
  "VIEWING_PLANNED",
  "VIEWED",
  "INTERESTED",
  "REJECTED",
  "SOLD",
  "ARCHIVED",
] as const;

export const PROPERTY_PRIORITIES = [
  "LOW",
  "NORMAL",
  "HIGH",
  "VERY_HIGH",
] as const;

export const FURNISHING_STATUSES = [
  "UNFURNISHED",
  "PARTLY_FURNISHED",
  "FURNISHED",
] as const;

export const ACTIVE_PROPERTY_STATUSES = [
  "CONSIDERING",
  "INTERESTED",
] as const;

export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];
export type PropertyPriority = (typeof PROPERTY_PRIORITIES)[number];
export type FurnishingStatus = (typeof FURNISHING_STATUSES)[number];
