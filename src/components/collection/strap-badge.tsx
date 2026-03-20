import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StrapType } from "@/lib/types";

const strapColors: Record<StrapType, string> = {
  NATO: "bg-sky-100 text-sky-800 dark:bg-sky-900/25 dark:text-sky-300",
  Leather: "bg-amber-100 text-amber-800 dark:bg-amber-900/25 dark:text-amber-300",
  Rubber: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/25 dark:text-emerald-300",
  Bracelet: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300",
  Mesh: "bg-violet-100 text-violet-800 dark:bg-violet-900/25 dark:text-violet-300",
};

export function StrapBadge({ strapType }: { strapType: StrapType }) {
  return (
    <Badge className={cn("border-0 font-medium tracking-wide", strapColors[strapType])}>
      {strapType}
    </Badge>
  );
}
