"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card px-6 py-12 text-center">
      <AlertTriangle
        aria-hidden="true"
        className="size-10 text-destructive"
      />
      <h2 className="mt-4 text-lg font-semibold">Something went wrong</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        The page could not be loaded. Try again.
      </p>
      <Button className="mt-6" type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
