"use client";

import { Archive } from "lucide-react";
import { useRef } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Archive aria-hidden="true" className="size-4" />
        Archive property
      </Button>

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/50"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
      >
        <div className="space-y-5 p-6">
          <div>
            <h2 className="text-lg font-semibold">Archive this property?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              It will leave the active dashboard but remain available through
              search and filters.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </Button>
            <form action={action}>
              <ArchiveSubmitButton />
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
