"use client";

import { useState } from "react";
import Image from "next/image";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Watch, WearLogEntry } from "@/lib/types";

interface CollectionCalendarProps {
  watches: Watch[];
  wearLog: WearLogEntry[];
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CollectionCalendar({ watches, wearLog }: CollectionCalendarProps) {
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const watchMap = new Map(watches.map((w) => [w._id, w]));
  const wearByDate = new Map(wearLog.map((e) => [e.date, e]));

  const days = eachDayOfInterval({ start: viewDate, end: endOfMonth(viewDate) });
  const startOffset = getDay(viewDate); // 0=Sun

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...days,
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setViewDate(subMonths(viewDate, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium tracking-wide">
          {format(viewDate, "MMMM yyyy")}
        </span>
        <Button variant="ghost" size="icon" onClick={() => setViewDate(addMonths(viewDate, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-px">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-1 text-center text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px rounded-sm border border-border/40 bg-border/20 overflow-hidden">
        {cells.map((day, i) => {
          if (!day) {
            return <div key={`empty-${i}`} className="min-h-[64px] bg-background/40" />;
          }

          const dateStr = format(day, "yyyy-MM-dd");
          const entry = wearByDate.get(dateStr);
          const watch = entry ? watchMap.get(entry.watchId) : undefined;
          const isHovered = hoveredDate === dateStr;
          const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

          return (
            <div
              key={dateStr}
              className={`relative min-h-[64px] bg-background p-1.5 transition-colors ${entry ? "cursor-pointer" : ""} ${isHovered && entry ? "bg-muted/60" : ""}`}
              onMouseEnter={() => entry && setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <span
                className={`text-[11px] font-medium leading-none ${isToday ? "flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {format(day, "d")}
              </span>

              {watch && (
                <div className="mt-1.5 flex justify-center">
                  {watch.imageUrl ? (
                    <div className="relative h-7 w-7 overflow-hidden rounded-sm border border-border">
                      <Image
                        src={watch.imageUrl}
                        alt={`${watch.brand} ${watch.name}`}
                        fill
                        className="object-cover"
                        style={{
                          objectPosition: `${watch.imagePositionX ?? 50}% ${watch.imagePosition ?? 0}%`,
                          transform: `scale(${watch.imageScale ?? 1})`,
                          transformOrigin: `${watch.imagePositionX ?? 50}% ${watch.imagePosition ?? 0}%`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-muted text-[10px] text-muted-foreground/40">
                      ◈
                    </div>
                  )}
                </div>
              )}

              {/* Hover popover */}
              {isHovered && entry && watch && (
                <div className="absolute left-1/2 top-full z-10 mt-1 w-44 -translate-x-1/2 rounded-sm border border-border bg-popover p-2.5 shadow-md">
                  <p className="text-xs font-medium text-foreground">
                    {watch.brand} {watch.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{entry.strapType}</p>
                  {entry.notes && (
                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">{entry.notes}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
