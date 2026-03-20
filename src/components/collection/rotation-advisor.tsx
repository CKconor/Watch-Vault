"use client";

import Image from "next/image";
import { differenceInDays, parseISO } from "date-fns";
import type { Watch, WearLogEntry } from "@/lib/types";

interface RotationAdvisorProps {
  watches: Watch[];
  wearLog: WearLogEntry[];
}

export function RotationAdvisor({ watches, wearLog }: RotationAdvisorProps) {
  const today = new Date();

  const neglected = watches
    .map((watch) => {
      const entries = wearLog.filter((e) => e.watchId === watch._id);
      if (entries.length === 0) return { watch, daysSince: Infinity };
      const latest = entries.reduce((a, b) => (a.date > b.date ? a : b));
      const daysSince = differenceInDays(today, parseISO(latest.date));
      return { watch, daysSince };
    })
    .filter(({ daysSince }) => daysSince >= 30)
    .sort((a, b) => {
      if (a.daysSince === Infinity && b.daysSince === Infinity) return 0;
      if (a.daysSince === Infinity) return -1;
      if (b.daysSince === Infinity) return 1;
      return b.daysSince - a.daysSince;
    })
    .slice(0, 3);

  if (neglected.length === 0) return null;

  return (
    <div className="rounded-sm border border-border/50 bg-muted/30 px-4 py-3">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Up Next
      </p>
      <div className="flex flex-wrap gap-4">
        {neglected.map(({ watch, daysSince }) => (
          <div key={watch._id} className="flex items-center gap-3">
            {watch.imageUrl ? (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-border">
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-xs text-muted-foreground/30">
                ◈
              </div>
            )}
            <div>
              <p className="text-sm font-medium leading-none text-foreground">
                {watch.brand} {watch.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {daysSince === Infinity ? "Never worn" : `${daysSince} days since last worn`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
