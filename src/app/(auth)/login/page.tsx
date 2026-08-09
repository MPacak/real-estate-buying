import { Home } from "lucide-react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession();

  if (session) {
    redirect("/houses");
  }

  const { next } = await searchParams;
  const redirectTo =
    next?.startsWith("/") && !next.startsWith("//") ? next : "/houses";

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Home aria-hidden="true" className="size-6" />
          </div>
          <CardTitle>House Buying Tracker</CardTitle>
          <CardDescription>
            Sign in to review your household property list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectTo={redirectTo} />
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Accounts are created privately by the app owner.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
