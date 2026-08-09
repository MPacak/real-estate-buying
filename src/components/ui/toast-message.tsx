"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ToastMessage({ message }: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("saved");
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );

    const timeout = window.setTimeout(() => setVisible(false), 5_000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-4 top-20 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-950 shadow-lg"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 aria-hidden="true" className="size-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-emerald-950"
        onClick={() => setVisible(false)}
        aria-label="Dismiss notification"
      >
        <X aria-hidden="true" className="size-4" />
      </Button>
    </div>
  );
}
