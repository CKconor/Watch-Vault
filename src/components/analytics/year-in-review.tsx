"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { yearInReview } from "@/lib/analytics";
import type { Watch, WearLogEntry } from "@/lib/types";

interface YearInReviewProps {
  watches: Watch[];
  wearLog: WearLogEntry[];
}

export function YearInReview({ watches, wearLog }: YearInReviewProps) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const data = yearInReview(year, watches, wearLog);

  const stats = [
    { label: "Total wears", value: String(data.totalWears) },
    { label: "Days worn", value: String(data.daysWorn) },
    { label: "Most worn", value: data.mostWornWatch ?? "—", sub: data.mostWornWatchCount > 0 ? `${data.mostWornWatchCount}×` : undefined },
    { label: "Top brand", value: data.mostWornBrand ?? "—" },
    { label: "Busiest month", value: data.busiestMonth ?? "—", sub: data.busiestMonthCount > 0 ? `${data.busiestMonthCount} wears` : undefined },
    { label: "Favourite strap", value: data.favouriteStrap ?? "—" },
  ];

  return (
    <div className="space-y-4">
      {/* Year nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setYear((y) => y - 1)}
          className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Previous year"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="font-mono text-sm tabular-nums">{year}</span>
        <button
          onClick={() => setYear((y) => y + 1)}
          disabled={year >= currentYear}
          className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next year"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {data.totalWears === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No wears logged in {year}.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map(({ label, value, sub }) => (
            <div key={label} className="rounded-lg bg-muted/30 px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-1.5 truncate font-mono text-lg font-semibold leading-tight text-foreground">
                {value}
              </p>
              {sub && (
                <p className="mt-0.5 text-[10px] text-muted-foreground">{sub}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
