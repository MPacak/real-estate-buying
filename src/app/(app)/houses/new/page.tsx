import { createProperty } from "@/actions/properties";
import { PropertyForm } from "@/components/houses/property-form";
import { requireServerSession } from "@/lib/auth/session";

export default async function NewHousePage() {
  await requireServerSession();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add house</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Save what you know now. Only the property name is required.
        </p>
      </div>

      <PropertyForm action={createProperty} />
    </div>
  );
}
