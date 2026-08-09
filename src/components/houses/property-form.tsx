"use client";

import { formatInTimeZone } from "date-fns-tz";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { FinancialSummary } from "@/components/houses/financial-summary";
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
import type { PropertyCostInputs } from "@/lib/calculations/property-costs";

const duplicateDateFormatter = new Intl.DateTimeFormat("hr-HR", {
  dateStyle: "medium",
  timeZone: "Europe/Zagreb",
});

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
  min,
  max,
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
  min?: number;
  max?: number;
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
        min={min}
        max={max}
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
  name: "newConstruction";
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

function FurnishingField({
  value,
}: {
  value?: Property["furnished"];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="furnished">Furnished</Label>
      <Select
        id="furnished"
        name="furnished"
        defaultValue={value ?? ""}
      >
        <option value="">Unknown</option>
        <option value="UNFURNISHED">Unfurnished</option>
        <option value="PARTLY_FURNISHED">Partly furnished</option>
        <option value="FURNISHED">Furnished</option>
      </Select>
    </div>
  );
}

export function PropertyForm({ action, property }: PropertyFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    action,
    INITIAL_PROPERTY_ACTION_STATE,
  );
  const [financialInputs, setFinancialInputs] = useState<PropertyCostInputs>({
    askingPrice: property?.askingPrice,
    targetOfferPrice: property?.targetOfferPrice,
    livingAreaM2: property?.livingAreaM2,
    newConstruction: property?.newConstruction,
    agencyFeePercent: property?.agencyFeePercent,
    solemnizationCost: property?.solemnizationCost ?? "2000",
    additionalCosts: property?.additionalCosts,
    furnishingCost: property?.furnishingCost,
    renovationCost: property?.renovationCost,
  });
  const [selectedStatus, setSelectedStatus] = useState<Property["status"]>(
    property?.status ?? "INTERESTED",
  );
  const [isDirty, setIsDirty] = useState(false);
  const isEditing = Boolean(property);

  useEffect(() => {
    const form = formRef.current;

    if (!form || !state.values) return;

    for (const [name, value] of Object.entries(state.values)) {
      const field = form.elements.namedItem(name);

      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement ||
        field instanceof HTMLTextAreaElement
      ) {
        field.value = value;
      }
    }

    form.dispatchEvent(new Event("input", { bubbles: true }));
  }, [state.values]);

  useEffect(() => {
    if (!isDirty) return;

    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5"
      onInput={(event) => {
        setIsDirty(true);
        const data = new FormData(event.currentTarget);
        const value = (name: string) => String(data.get(name) ?? "");

        setFinancialInputs({
          askingPrice: value("askingPrice"),
          targetOfferPrice: value("targetOfferPrice"),
          livingAreaM2: value("livingAreaM2"),
          newConstruction:
            value("newConstruction") === "true"
              ? true
              : value("newConstruction") === "false"
                ? false
                : null,
          agencyFeePercent: value("agencyFeePercent"),
          solemnizationCost: value("solemnizationCost"),
          additionalCosts: value("additionalCosts"),
          furnishingCost: value("furnishingCost"),
          renovationCost: value("renovationCost"),
        });
      }}
    >
      {state.message && !state.duplicates ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.message}
        </div>
      ) : null}

      {state.duplicates?.length ? (
        <div
          className="space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950"
          role="alert"
        >
          <div>
            <p className="font-semibold">This may already exist</p>
            <p className="mt-1 text-sm">
              Review the possible matches before saving another property.
            </p>
          </div>
          <ul className="space-y-2">
            {state.duplicates.map((duplicate) => (
              <li
                key={duplicate.id}
                className="rounded-md border border-amber-200 bg-white/70 p-3 text-sm"
              >
                <a
                  className="font-semibold underline"
                  href={`/houses/${duplicate.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {duplicate.name}
                </a>
                <p className="mt-1 text-xs">
                  Added {duplicateDateFormatter.format(new Date(duplicate.createdAt))}
                  {" · "}
                  {duplicate.reasons.join(", ")}
                </p>
              </li>
            ))}
          </ul>
          <Button
            type="submit"
            name="saveAnyway"
            value="true"
            variant="outline"
          >
            Save anyway
          </Button>
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
        <FurnishingField value={property?.furnished} />
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
            defaultValue={property?.status ?? "INTERESTED"}
            onChange={(event) => {
              setSelectedStatus(event.target.value as Property["status"]);
            }}
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
          className={
            selectedStatus === "REJECTED"
              ? "space-y-2 sm:col-span-2"
              : "hidden"
          }
        />
      </FormSection>

      <FormSection title="Viewing">
        <TextField
          name="viewingAt"
          label="Viewing 1 date and time"
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
          label="Viewing 1 notes"
          defaultValue={property?.viewingNotes}
          state={state}
        />
        <TextField
          name="secondViewingAt"
          label="Viewing 2 date and time"
          defaultValue={
            property?.secondViewingAt
              ? formatInTimeZone(
                  property.secondViewingAt,
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
          name="secondViewingNotes"
          label="Viewing 2 notes"
          defaultValue={property?.secondViewingNotes}
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
        title="Ratings"
        description="Optional individual 1–10 ratings. No combined score is calculated."
      >
        <TextField
          name="locationRating"
          label="Location"
          defaultValue={property?.locationRating}
          state={state}
          type="number"
          min={1}
          max={10}
        />
        <TextField
          name="layoutRating"
          label="Layout"
          defaultValue={property?.layoutRating}
          state={state}
          type="number"
          min={1}
          max={10}
        />
        <TextField
          name="conditionRating"
          label="Condition"
          defaultValue={property?.conditionRating}
          state={state}
          type="number"
          min={1}
          max={10}
        />
        <TextField
          name="gardenRating"
          label="Garden"
          defaultValue={property?.gardenRating}
          state={state}
          type="number"
          min={1}
          max={10}
        />
        <TextField
          name="privacyRating"
          label="Privacy"
          defaultValue={property?.privacyRating}
          state={state}
          type="number"
          min={1}
          max={10}
        />
        <TextField
          name="valueRating"
          label="Value"
          defaultValue={property?.valueRating}
          state={state}
          type="number"
          min={1}
          max={10}
        />
      </FormSection>

      <FormSection
        title="Additional costs"
        description="Property tax is automatic: 0% for new construction, otherwise 3%. Agency fee is entered as a whole percentage."
      >
        <div className="space-y-2">
          <Label>Property tax</Label>
          <p className="flex min-h-11 items-center rounded-md border bg-muted/50 px-3 text-sm">
            Automatic: 0% for new construction, otherwise 3%
          </p>
        </div>
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
          defaultValue={property?.solemnizationCost ?? "2000"}
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
        <TextField
          name="renovationCost"
          label="Renovation (€)"
          defaultValue={property?.renovationCost}
          state={state}
          inputMode="decimal"
        />
      </FormSection>

      <FinancialSummary inputs={financialInputs} preview />

      <div className="sticky bottom-16 z-20 flex items-center justify-end gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur md:bottom-3">
        <Link
          className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
          href={property ? `/houses/${property.id}` : "/houses"}
          onClick={(event) => {
            if (
              isDirty &&
              !window.confirm("Discard your unsaved property changes?")
            ) {
              event.preventDefault();
            }
          }}
        >
          Cancel
        </Link>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
