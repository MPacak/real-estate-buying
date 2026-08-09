import { eq } from "drizzle-orm";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { z } from "zod";

import { archiveProperty } from "@/actions/properties";
import { ArchivePropertyButton } from "@/components/houses/archive-property-button";
import { FinancialSummary } from "@/components/houses/financial-summary";
import { PropertyPriority } from "@/components/houses/property-priority";
import { PropertyStatus } from "@/components/houses/property-status";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToastMessage } from "@/components/ui/toast-message";
import { db } from "@/db";
import { properties } from "@/db/schema/properties";
import { requireServerSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/formatting/currency";
import {
  formatArea,
  formatBoolean,
  formatDateTime,
} from "@/lib/formatting/property";
import { cn } from "@/lib/utils";

type PropertyDetailsPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string | string[] }>;
};

function DetailItem({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: ReactNode;
  wide?: boolean;
}) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm">{value}</dd>
    </div>
  );
}

function DetailsCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">{children}</dl>
      </CardContent>
    </Card>
  );
}

export default async function PropertyDetailsPage({
  params,
  searchParams,
}: PropertyDetailsPageProps) {
  await requireServerSession();

  const { id } = await params;

  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const property = await db.query.properties.findFirst({
    where: eq(properties.id, id),
  });

  if (!property) {
    notFound();
  }

  const rawSaved = (await searchParams).saved;
  const saved = Array.isArray(rawSaved) ? rawSaved[0] : rawSaved;
  const archiveAction = archiveProperty.bind(null, property.id);
  const phoneHref = property.agentPhone
    ? `tel:${property.agentPhone.replace(/[^\d+]/g, "")}`
    : null;
  const hasOverview = Boolean(
    property.address ||
      property.livingAreaM2 ||
      property.landAreaM2 ||
      property.bedrooms !== null ||
      property.bathrooms !== null ||
      property.yearBuilt ||
      property.furnished !== null ||
      property.newConstruction !== null,
  );
  const hasContact = Boolean(
    property.agencyName ||
      property.agentName ||
      property.agentPhone ||
      property.agentEmail,
  );
  const hasFinancials = Boolean(
    property.askingPrice ||
      property.targetOfferPrice ||
      property.propertyTaxPercent ||
      property.agencyFeePercent ||
      property.solemnizationCost ||
      property.additionalCosts ||
      property.furnishingCost,
  );
  const hasRatings = Boolean(
    property.locationRating ||
      property.layoutRating ||
      property.conditionRating ||
      property.gardenRating ||
      property.privacyRating ||
      property.valueRating,
  );

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {saved === "created" ? (
        <ToastMessage message="Property created." />
      ) : saved === "updated" ? (
        <ToastMessage message="Changes saved." />
      ) : null}

      <Link
        href="/houses"
        className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Houses
      </Link>

      <section className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <PropertyStatus status={property.status} />
              <PropertyPriority priority={property.priority} />
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              {property.name}
            </h1>
            {property.location ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin aria-hidden="true" className="size-4" />
                {property.location}
              </p>
            ) : null}
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-3 sm:text-right">
            {property.askingPrice ? (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Asking
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(property.askingPrice)}
                </p>
              </div>
            ) : null}
            {property.targetOfferPrice ? (
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Target
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(property.targetOfferPrice)}
                </p>
              </div>
            ) : null}
            {property.livingAreaM2 ? (
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Living area
                </p>
                <p className="font-medium">
                  {formatArea(property.livingAreaM2)}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
          {phoneHref ? (
            <a className={buttonVariants()} href={phoneHref}>
              <Phone aria-hidden="true" className="size-4" />
              Call agent
            </a>
          ) : null}
          {property.listingUrl ? (
            <a
              className={buttonVariants({ variant: "outline" })}
              href={property.listingUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" className="size-4" />
              Open listing
            </a>
          ) : null}
          <Link
            className={cn(buttonVariants({ variant: "outline" }))}
            href={`/houses/${property.id}/edit`}
          >
            <Pencil aria-hidden="true" className="size-4" />
            Edit
          </Link>
        </div>
      </section>

      {property.status === "REJECTED" && property.rejectionReason ? (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg text-red-900">
              Rejection reason
            </CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm text-red-900">
            {property.rejectionReason}
          </CardContent>
        </Card>
      ) : null}

      {hasOverview ? (
        <DetailsCard title="Overview">
          <DetailItem label="Address" value={property.address} wide />
          <DetailItem
            label="Living area"
            value={formatArea(property.livingAreaM2)}
          />
          <DetailItem
            label="Land area"
            value={formatArea(property.landAreaM2)}
          />
          <DetailItem label="Bedrooms" value={property.bedrooms} />
          <DetailItem label="Bathrooms" value={property.bathrooms} />
          <DetailItem label="Year built" value={property.yearBuilt} />
          <DetailItem
            label="Furnished"
            value={formatBoolean(property.furnished)}
          />
          <DetailItem
            label="New construction"
            value={formatBoolean(property.newConstruction)}
          />
        </DetailsCard>
      ) : null}

      {hasContact ? (
        <DetailsCard title="Contact">
          <DetailItem label="Agency" value={property.agencyName} />
          <DetailItem label="Agent" value={property.agentName} />
          <DetailItem
            label="Phone"
            value={
              phoneHref ? (
                <a
                  className="inline-flex min-h-8 items-center gap-2 font-medium text-primary hover:underline"
                  href={phoneHref}
                >
                  <Phone aria-hidden="true" className="size-4" />
                  {property.agentPhone}
                </a>
              ) : null
            }
          />
          <DetailItem
            label="Email"
            value={
              property.agentEmail ? (
                <a
                  className="inline-flex min-h-8 items-center gap-2 font-medium text-primary hover:underline"
                  href={`mailto:${property.agentEmail}`}
                >
                  <Mail aria-hidden="true" className="size-4" />
                  {property.agentEmail}
                </a>
              ) : null
            }
          />
        </DetailsCard>
      ) : null}

      {property.viewingAt || property.viewingNotes ? (
        <DetailsCard title="Viewing">
          <DetailItem
            label="Date and time"
            value={formatDateTime(property.viewingAt)}
          />
          <DetailItem
            label="Viewing notes"
            value={property.viewingNotes}
            wide
          />
        </DetailsCard>
      ) : null}

      {property.pros || property.cons ? (
        <DetailsCard title="Pros & Cons">
          <DetailItem label="Pros" value={property.pros} />
          <DetailItem label="Cons" value={property.cons} />
        </DetailsCard>
      ) : null}

      {hasRatings ? (
        <DetailsCard title="Ratings">
          <DetailItem
            label="Location"
            value={
              property.locationRating
                ? `${property.locationRating}/10`
                : null
            }
          />
          <DetailItem
            label="Layout"
            value={
              property.layoutRating ? `${property.layoutRating}/10` : null
            }
          />
          <DetailItem
            label="Condition"
            value={
              property.conditionRating
                ? `${property.conditionRating}/10`
                : null
            }
          />
          <DetailItem
            label="Garden"
            value={
              property.gardenRating ? `${property.gardenRating}/10` : null
            }
          />
          <DetailItem
            label="Privacy"
            value={
              property.privacyRating ? `${property.privacyRating}/10` : null
            }
          />
          <DetailItem
            label="Value"
            value={property.valueRating ? `${property.valueRating}/10` : null}
          />
        </DetailsCard>
      ) : null}

      {hasFinancials ? (
        <FinancialSummary inputs={property} />
      ) : null}

      {property.notes ? (
        <DetailsCard title="Notes">
          <DetailItem label="Notes" value={property.notes} wide />
        </DetailsCard>
      ) : null}

      {property.status !== "ARCHIVED" ? (
        <section className="flex justify-end rounded-xl border border-red-200 bg-red-50 p-4">
          <ArchivePropertyButton action={archiveAction} />
        </section>
      ) : null}
    </div>
  );
}
