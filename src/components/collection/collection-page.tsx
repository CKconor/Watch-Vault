"use client";

import { WatchGrid } from "./watch-grid";
import { AnalyticsPanel } from "@/components/analytics/analytics-panel";
import { useWatches } from "@/hooks/use-watches";
import { useWearLog } from "@/hooks/use-wear-log";

export function CollectionPage() {
  const { watches } = useWatches();
  const { wearLog } = useWearLog();

  return (
    <div>
      <WatchGrid />
      <AnalyticsPanel watches={watches} wearLog={wearLog} />
    </div>
  );
}
