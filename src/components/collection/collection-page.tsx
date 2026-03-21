"use client";

import { useState } from "react";
import { WatchGrid } from "./watch-grid";
import { CollectionCalendar } from "./collection-calendar";
import { RotationAdvisor } from "./rotation-advisor";
import { AnalyticsPanel } from "@/components/analytics/analytics-panel";
import { Button } from "@/components/ui/button";
import { useWatches } from "@/hooks/use-watches";
import { useWearLog } from "@/hooks/use-wear-log";

type View = "grid" | "calendar";

export function CollectionPage() {
  const { watches } = useWatches();
  const { wearLog } = useWearLog();
  const [view, setView] = useState<View>("grid");

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex gap-1 border-b border-border/50">
        {(["grid", "calendar"] as View[]).map((v) => (
          <Button
            key={v}
            variant="ghost"
            size="sm"
            className={`-mb-px rounded-none border-0 border-b-2 pb-3 capitalize tracking-wide transition-none focus-visible:ring-0 hover:bg-transparent ${
              view === v
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setView(v)}
          >
            {v}
          </Button>
        ))}
      </div>

      <RotationAdvisor watches={watches} wearLog={wearLog} />

      {view === "grid" ? (
        <WatchGrid />
      ) : (
        <CollectionCalendar watches={watches} wearLog={wearLog} />
      )}

      <AnalyticsPanel watches={watches} wearLog={wearLog} />
    </div>
  );
}
