import { cn } from "@/lib/utils";
import type { PropertyStatus as PropertyStatusValue } from "@/lib/properties/constants";
import { formatEnum } from "@/lib/formatting/property";

const statusStyles: Record<PropertyStatusValue, string> = {
  NEW: "border-slate-200 bg-slate-50 text-slate-700",
  CONSIDERING: "border-amber-200 bg-amber-50 text-amber-800",
  VIEWING_PLANNED: "border-blue-200 bg-blue-50 text-blue-800",
  VIEWED: "border-indigo-200 bg-indigo-50 text-indigo-800",
  INTERESTED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  REJECTED: "border-red-200 bg-red-50 text-red-800",
  SOLD: "border-slate-200 bg-slate-100 text-slate-600",
  ARCHIVED: "border-slate-200 bg-slate-100 text-slate-600",
};

export function PropertyStatus({ status }: { status: PropertyStatusValue }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-semibold",
        statusStyles[status],
      )}
    >
      {formatEnum(status)}
    </span>
  );
}
