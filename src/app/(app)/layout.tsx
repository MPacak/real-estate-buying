import { Home } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppNavigation } from "@/components/layout/app-navigation";
import { requireServerSession } from "@/lib/auth/session";

export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireServerSession();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 font-semibold">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home aria-hidden="true" className="size-5" />
            </span>
            <span className="hidden truncate sm:inline">
              House Buying Tracker
            </span>
          </div>

          <div className="ml-auto hidden md:block">
            <AppNavigation />
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-2 md:ml-2">
            <span className="hidden max-w-48 truncate text-sm text-muted-foreground lg:inline">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 md:pb-8">
        {children}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <AppNavigation mobile />
      </div>
    </div>
  );
}
