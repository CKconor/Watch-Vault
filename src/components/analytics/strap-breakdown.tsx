import { Progress } from "@/components/ui/progress";
import { StrapBadge } from "@/components/collection/strap-badge";
import type { StrapBreakdown } from "@/lib/analytics";

export function StrapBreakdownPanel({ data }: { data: StrapBreakdown[] }) {
  if (data.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No wear data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {data.map(({ strapType, count, percentage }) => (
        <div key={strapType} className="flex items-center gap-3">
          <div className="w-20 shrink-0">
            <StrapBadge strapType={strapType} />
          </div>
          <Progress value={percentage} className="h-2 flex-1" />
          <span className="w-16 shrink-0 text-right text-sm text-muted-foreground">
            {percentage}% ({count})
          </span>
        </div>
      ))}
    </div>
  );
}
