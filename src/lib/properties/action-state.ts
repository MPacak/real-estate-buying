import type { CreatePropertyInput } from "@/lib/validation/property";

export type PropertyFieldErrors = Partial<
  Record<keyof CreatePropertyInput, string[]>
>;

export type PropertyActionState = {
  message?: string;
  fieldErrors?: PropertyFieldErrors;
};

export const INITIAL_PROPERTY_ACTION_STATE: PropertyActionState = {};
