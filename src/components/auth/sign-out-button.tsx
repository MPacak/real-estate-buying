"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setIsPending(true);
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={signOut}
      disabled={isPending}
    >
      <LogOut aria-hidden="true" className="size-4" />
      <span className="hidden sm:inline">
        {isPending ? "Signing out…" : "Sign out"}
      </span>
    </Button>
  );
}
