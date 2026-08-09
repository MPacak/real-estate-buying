"use client";

import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  INITIAL_PROPERTY_ACTION_STATE,
  type PropertyActionState,
} from "@/lib/properties/action-state";
import {
  PROPERTY_PRIORITIES,
  PROPERTY_STATUSES,
} from "@/lib/properties/constants";
import type { Property } from "@/lib/properties/types";

type PropertyFormProps = {
  action: (
    state: PropertyActionState,
    formData: FormData,
  ) => Promise<PropertyActionState>;
  property?: Property;
};

type FieldName = keyof NonNullable<PropertyActionState["fieldErrors"]>;

function readableEnum(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function FieldError({
  field,
  state,
}: {
  field: FieldName;
  state: PropertyActionState;
}) {
  const message = state.fieldErrors?.[field]?.[0];

  return message ? (
    <p className="text-sm text-destructive" id={`${field}-error`}>
      {message}
    </p>
  ) : null;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending
        ? "Saving…"
        : isEditing
          ? "Save changes"
          : "Save property"}
    </Button>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {children}
      </CardContent>
    </Card>
  );
}

function TextField({
  name,
  label,
  defaultValue,
  state,
  required,
  type = "text",
  inputMode,
  placeholder,
  className,
}: {
  name: FieldName;
  label: string;
  defaultValue?: string | number | null;
  state: PropertyActionState;
  required?: boolean;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  className?: string;
}) {
  const hasError = Boolean(state.fieldErrors?.[name]?.length);

  return (
    <div className={className ?? "space-y-2"}>
      <Label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      <FieldError field={name} state={state} />
    </div>
  );
}

function MultilineField({
  name,
  label,
  defaultValue,
  state,
  placeholder,
  className = "space-y-2 sm:col-span-2",
}: {
  name: FieldName;
  label: string;
  defaultValue?: string | null;
  state: PropertyActionState;
  placeholder?: string;
  className?: string;
}) {
  const hasError = Boolean(state.fieldErrors?.[name]?.length);

  return (
    <div className={className}>
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${name}-error` : undefined}
      />
      <FieldError field={name} state={state} />
    </div>
  );
}

function BooleanField({
  name,
  label,
  value,
}: {
  name: "furnished" | "newConstruction";
  label: string;
  value?: boolean | null;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Select id={name} name={name} defaultValue={String(value ?? "")}>
        <option value="">Unknown</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </Select>
    </div>
  );
}

export function PropertyForm({ action, property }: PropertyFormProps) {
  const [state, formAction] = useActionState(
    action,
    INITIAL_PROPERTY_ACTION_STATE,
  );
  const isEditing = Boolean(property);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.message}
        </div>
      ) : null}

      <FormSection
        title="Basic information"
        description="Only the property name is required."
      >
        <TextField
          name="name"
          label="Property name"
          defaultValue={property?.name}
          state={state}
          required
          className="space-y-2 sm:col-span-2"
          placeholder="Rugvica big garden"
        />
        <TextField
          name="location"
          label="Location"
          defaultValue={property?.location}
          state={state}
          placeholder="Rugvica"
        />
        <TextField
          name="address"
          label="Address"
          defaultValue={property?.address}
          state={state}
          placeholder="Street and house number"
        />
        <TextField
          name="listingUrl"
          label="Listing URL"
          defaultValue={property?.listingUrl}
          state={state}
          type="url"
          inputMode="url"
          className="space-y-2 sm:col-span-2"
          placeholder="https://…"
        />
      </FormSection>

      <FormSection title="Price">
        <TextField
          name="askingPrice"
          label="Asking price (€)"
          defaultValue={property?.askingPrice}
          state={state}
          inputMode="decimal"
          placeholder="455000"
        />
        <TextField
          name="targetOfferPrice"
          label="Target offer (€)"
          defaultValue={property?.targetOfferPrice}
          state={state}
          inputMode="decimal"
          placeholder="420000"
        />
      </FormSection>

      <FormSection title="Property">
        <TextField
          name="livingAreaM2"
          label="Living area (m²)"
          defaultValue={property?.livingAreaM2}
          state={state}
          inputMode="decimal"
        />
        <TextField
          name="landAreaM2"
          label="Land area (m²)"
          defaultValue={property?.landAreaM2}
          state={state}
          inputMode="decimal"
        />
        <TextField
          name="bedrooms"
          label="Bedrooms"
          defaultValue={property?.bedrooms}
          state={state}
          type="number"
        />
        <TextField
          name="bathrooms"
          label="Bathrooms"
          defaultValue={property?.bathrooms}
          state={state}
          type="number"
        />
        <TextField
          name="yearBuilt"
          label="Year built"
          defaultValue={property?.yearBuilt}
          state={state}
          type="number"
        />
        <div className="hidden sm:block" />
        <BooleanField
          name="furnished"
          label="Furnished"
          value={property?.furnished}
        />
        <BooleanField
          name="newConstruction"
          label="New construction"
          value={property?.newConstruction}
        />
      </FormSection>

      <FormSection title="Contact">
        <TextField
          name="agencyName"
          label="Agency"
          defaultValue={property?.agencyName}
          state={state}
        />
        <TextField
          name="agentName"
          label="Agent name"
          defaultValue={property?.agentName}
          state={state}
        />
        <TextField
          name="agentPhone"
          label="Agent phone"
          defaultValue={property?.agentPhone}
          state={state}
          type="tel"
          inputMode="tel"
        />
        <TextField
          name="agentEmail"
          label="Agent email"
          defaultValue={property?.agentEmail}
          state={state}
          type="email"
          inputMode="email"
        />
      </FormSection>

      <FormSection title="Decision">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={property?.status ?? "NEW"}
          >
            {PROPERTY_STATUSES.map((status) => (
              <option key={status} value={status}>
                {readableEnum(status)}
              </option>
            ))}
          </Select>
          <FieldError field="status" state={state} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            name="priority"
            defaultValue={property?.priority ?? "NORMAL"}
          >
            {PROPERTY_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {readableEnum(priority)}
              </option>
            ))}
          </Select>
          <FieldError field="priority" state={state} />
        </div>
        <MultilineField
          name="rejectionReason"
          label="Rejection reason"
          defaultValue={property?.rejectionReason}
          state={state}
          placeholder="Why should this property not be reconsidered?"
        />
      </FormSection>

      <FormSection title="Viewing">
        <TextField
          name="viewingAt"
          label="Viewing date and time"
          defaultValue={
            property?.viewingAt
              ? formatInTimeZone(
                  property.viewingAt,
                  "Europe/Zagreb",
                  "yyyy-MM-dd'T'HH:mm",
                )
              : ""
          }
          state={state}
          type="datetime-local"
          className="space-y-2 sm:col-span-2"
        />
        <MultilineField
          name="viewingNotes"
          label="Viewing notes"
          defaultValue={property?.viewingNotes}
          state={state}
        />
      </FormSection>

      <FormSection title="Evaluation">
        <MultilineField
          name="pros"
          label="Pros"
          defaultValue={property?.pros}
          state={state}
          placeholder="One point per line"
        />
        <MultilineField
          name="cons"
          label="Cons"
          defaultValue={property?.cons}
          state={state}
          placeholder="One point per line"
        />
        <MultilineField
          name="notes"
          label="Notes"
          defaultValue={property?.notes}
          state={state}
        />
      </FormSection>

      <FormSection
        title="Additional costs"
        description="Percentages are entered as whole percentages. For example, 3 means 3%."
      >
        <TextField
          name="propertyTaxPercent"
          label="Property tax (%)"
          defaultValue={property?.propertyTaxPercent}
          state={state}
          inputMode="decimal"
        />
        <TextField
          name="agencyFeePercent"
          label="Agency fee, VAT included (%)"
          defaultValue={property?.agencyFeePercent}
          state={state}
          inputMode="decimal"
        />
        <TextField
          name="solemnizationCost"
          label="Solemnization (€)"
          defaultValue={property?.solemnizationCost}
          state={state}
          inputMode="decimal"
        />
        <TextField
          name="additionalCosts"
          label="Other costs (€)"
          defaultValue={property?.additionalCosts}
          state={state}
          inputMode="decimal"
        />
        <TextField
          name="furnishingCost"
          label="Furnishing (€)"
          defaultValue={property?.furnishingCost}
          state={state}
          inputMode="decimal"
        />
      </FormSection>

      <div className="sticky bottom-16 z-20 flex items-center justify-end gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur md:bottom-3">
        <Link
          className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          href={property ? `/houses/${property.id}` : "/houses"}
        >
          Cancel
        </Link>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
