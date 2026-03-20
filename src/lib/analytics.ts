import type { Watch, WearLogEntry, StrapType } from "./types";

export interface WearCount {
  watchId: string;
  watchName: string;
  brand: string;
  count: number;
}

export interface StrapBreakdown {
  strapType: StrapType;
  count: number;
  percentage: number;
}

export interface CostPerWear {
  watchId: string;
  watchName: string;
  brand: string;
  purchasePrice: number;
  wearCount: number;
  costPerWear: number;
}

export function mostWorn(watches: Watch[], wearLog: WearLogEntry[]): WearCount[] {
  const counts = watches.map((watch) => ({
    watchId: watch._id,
    watchName: watch.name,
    brand: watch.brand,
    count: wearLog.filter((e) => e.watchId === watch._id).length,
  }));
  return counts.sort((a, b) => b.count - a.count);
}

export function strapBreakdown(wearLog: WearLogEntry[]): StrapBreakdown[] {
  if (wearLog.length === 0) return [];
  const counts: Record<string, number> = {};
  for (const entry of wearLog) {
    counts[entry.strapType] = (counts[entry.strapType] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([strapType, count]) => ({
      strapType: strapType as StrapType,
      count,
      percentage: Math.round((count / wearLog.length) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function calcCostPerWear(watches: Watch[], wearLog: WearLogEntry[]): CostPerWear[] {
  return watches
    .map((watch) => {
      const wearCount = wearLog.filter((e) => e.watchId === watch._id).length;
      return {
        watchId: watch._id,
        watchName: watch.name,
        brand: watch.brand,
        purchasePrice: watch.purchasePrice,
        wearCount,
        costPerWear: wearCount > 0 ? watch.purchasePrice / wearCount : watch.purchasePrice,
      };
    })
    .sort((a, b) => a.costPerWear - b.costPerWear);
}
