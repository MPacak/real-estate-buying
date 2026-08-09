"use client";

import { Archive } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

function ArchiveSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      <Archive aria-hidden="true" className="size-4" />
      {pending ? "Archiving…" : "Archive property"}
    </Button>
  );
}

export function ArchivePropertyButton({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Archive this property? It will leave the active property view.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <ArchiveSubmitButton />
    </form>
  );
}
