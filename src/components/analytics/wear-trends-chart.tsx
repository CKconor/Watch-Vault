"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WearTrend } from "@/lib/analytics";

export function WearTrendsChart({ data }: { data: WearTrend[] }) {
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No wear data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="wearGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="oklch(0.74 0.12 82)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="oklch(0.74 0.12 82)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "oklch(0.57 0.010 70)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 10, fill: "oklch(0.57 0.010 70)" }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            fontSize: "12px",
            color: "var(--popover-foreground)",
          }}
          labelStyle={{ color: "var(--popover-foreground)" }}
          itemStyle={{ color: "var(--muted-foreground)" }}
          formatter={(value) => [`${value} wears`, "Wears"]}
          cursor={{ stroke: "var(--border)" }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="oklch(0.74 0.12 82)"
          strokeWidth={2}
          fill="url(#wearGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "oklch(0.74 0.12 82)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
