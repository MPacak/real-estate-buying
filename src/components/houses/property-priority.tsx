import type { PropertyPriority as PropertyPriorityValue } from "@/lib/properties/constants";
import { formatEnum } from "@/lib/formatting/property";

const priorityStars: Record<PropertyPriorityValue, number> = {
  LOW: 1,
  NORMAL: 2,
  HIGH: 3,
  VERY_HIGH: 4,
};

export function PropertyPriority({
  priority,
}: {
  priority: PropertyPriorityValue;
}) {
  return (
    <span
      className="inline-flex min-h-7 items-center gap-1.5 rounded-full border bg-background px-2.5 text-xs font-semibold"
      aria-label={`${formatEnum(priority)} priority`}
    >
      <span aria-hidden="true" className="tracking-tight text-amber-500">
        {"★".repeat(priorityStars[priority])}
      </span>
      {formatEnum(priority)}
    </span>
  );
}
