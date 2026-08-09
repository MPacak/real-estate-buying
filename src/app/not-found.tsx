import { Home } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="max-w-sm text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <Home aria-hidden="true" className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The property or page may have moved or no longer exists.
        </p>
        <Link href="/houses" className={`${buttonVariants()} mt-6`}>
          Return to houses
        </Link>
      </div>
    </main>
  );
}
