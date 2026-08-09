import type { CreatePropertyInput } from "@/lib/validation/property";
import type { DuplicatePropertyMatch } from "@/lib/properties/duplicates";

export type PropertyFieldErrors = Partial<
  Record<keyof CreatePropertyInput, string[]>
>;

export type PropertyActionState = {
  message?: string;
  fieldErrors?: PropertyFieldErrors;
  duplicates?: DuplicatePropertyMatch[];
  values?: Record<string, string>;
};

export const INITIAL_PROPERTY_ACTION_STATE: PropertyActionState = {};
