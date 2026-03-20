import { formatCurrency } from "@/lib/utils";
import type { WishlistItem } from "@/lib/types";

export function WishlistStats({ items }: { items: WishlistItem[] }) {
  const totalValue = items.reduce((sum, i) => sum + i.estimatedPrice, 0);
  const byPriority = {
    High: items.filter((i) => i.priority === "High").length,
    Medium: items.filter((i) => i.priority === "Medium").length,
    Low: items.filter((i) => i.priority === "Low").length,
  };

  const stats = [
    { label: "Total items", value: String(items.length), accent: false },
    { label: "Est. total value", value: formatCurrency(totalValue), accent: false },
    { label: "High priority", value: String(byPriority.High), accent: true, color: "text-destructive" },
    { label: "Medium priority", value: String(byPriority.Medium), accent: true, color: "text-amber-500 dark:text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
      {stats.map(({ label, value, color }) => (
        <div key={label} className="bg-card px-5 py-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className={`mt-2 font-mono text-2xl font-semibold ${color ?? "text-foreground"}`}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}
