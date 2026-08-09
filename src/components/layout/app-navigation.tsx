"use client";

import { Home, Plus, Scale } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/houses", label: "Houses", icon: Home },
  { href: "/compare", label: "Compare", icon: Scale },
  { href: "/houses/new", label: "Add house", icon: Plus },
];

type AppNavigationProps = {
  mobile?: boolean;
};

export function AppNavigation({ mobile = false }: AppNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        mobile
          ? "grid grid-cols-3"
          : "flex items-center gap-1",
      )}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === "/houses"
            ? pathname === href
            : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-12 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
              mobile && "flex-col gap-0.5 rounded-none py-1 text-xs",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
