import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { z } from "zod";

import { updateProperty } from "@/actions/properties";
import { PropertyForm } from "@/components/houses/property-form";
import { db } from "@/db";
import { properties } from "@/db/schema/properties";
import { requireServerSession } from "@/lib/auth/session";

type EditPropertyPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
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

  const action = updateProperty.bind(null, property.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit property
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update {property.name}.
        </p>
      </div>

      <PropertyForm action={action} property={property} />
    </div>
  );
}
