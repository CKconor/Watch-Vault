"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { WearCount } from "@/lib/analytics";

const GOLD_STOPS = [
  "oklch(0.74 0.12 82)",
  "oklch(0.70 0.11 80)",
  "oklch(0.66 0.10 78)",
  "oklch(0.62 0.10 76)",
  "oklch(0.58 0.09 74)",
  "oklch(0.54 0.09 72)",
  "oklch(0.50 0.08 70)",
  "oklch(0.46 0.08 68)",
];

export function WearChart({ data }: { data: WearCount[] }) {
  const top = data.slice(0, 8);

  if (top.every((d) => d.count === 0)) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No wear data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={top} layout="vertical" margin={{ left: 0, right: 20, top: 4, bottom: 4 }}>
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "oklch(0.57 0.010 70)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="watchName"
          width={110}
          tick={{ fontSize: 11, fill: "oklch(0.57 0.010 70)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: string) => (v.length > 15 ? v.slice(0, 14) + "…" : v)}
        />
        <Tooltip
          contentStyle={{
            background: "oklch(0.155 0.008 58)",
            border: "1px solid oklch(1 0 0 / 9%)",
            borderRadius: "4px",
            fontSize: "12px",
          }}
          formatter={(value) => [`${value} wears`, "Wears"]}
          labelFormatter={(label) => String(label)}
          cursor={{ fill: "oklch(1 0 0 / 4%)" }}
        />
        <Bar dataKey="count" radius={[0, 3, 3, 0]}>
          {top.map((_, i) => (
            <Cell key={i} fill={GOLD_STOPS[i] ?? GOLD_STOPS[GOLD_STOPS.length - 1]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
