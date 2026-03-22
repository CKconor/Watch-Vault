import { format, subMonths, startOfMonth, parse } from "date-fns";
import type { Watch, WearLogEntry, StrapType } from "./types";

export interface YearInReview {
  year: number;
  totalWears: number;
  daysWorn: number;
  mostWornWatch: string | null;
  mostWornWatchCount: number;
  busiestMonth: string | null;
  busiestMonthCount: number;
  favouriteStrap: StrapType | null;
  mostWornBrand: string | null;
}

export function yearInReview(year: number, watches: Watch[], wearLog: WearLogEntry[]): YearInReview {
  const prefix = String(year);
  const yearLog = wearLog.filter((e) => e.date.startsWith(prefix));

  const daysWorn = new Set(yearLog.map((e) => e.date)).size;

  // Most worn watch
  const wearsByWatch: Record<string, { name: string; brand: string; count: number }> = {};
  for (const watch of watches) {
    wearsByWatch[watch._id] = { name: watch.name, brand: watch.brand, count: 0 };
  }
  for (const entry of yearLog) {
    if (wearsByWatch[entry.watchId]) wearsByWatch[entry.watchId].count++;
  }
  const topWatch = Object.values(wearsByWatch).sort((a, b) => b.count - a.count)[0];

  // Busiest month
  const monthCounts: Record<string, number> = {};
  for (const entry of yearLog) {
    const m = entry.date.slice(0, 7); // "yyyy-MM"
    monthCounts[m] = (monthCounts[m] ?? 0) + 1;
  }
  const topMonthKey = Object.entries(monthCounts).sort((a, b) => b[1] - a[1])[0];
  const busiestMonth = topMonthKey
    ? format(parse(topMonthKey[0], "yyyy-MM", new Date()), "MMMM")
    : null;

  // Favourite strap
  const strapCounts: Record<string, number> = {};
  for (const entry of yearLog) {
    strapCounts[entry.strapType] = (strapCounts[entry.strapType] ?? 0) + 1;
  }
  const topStrap = Object.entries(strapCounts).sort((a, b) => b[1] - a[1])[0];

  // Most worn brand
  const brandCounts: Record<string, number> = {};
  for (const { brand, count } of Object.values(wearsByWatch)) {
    brandCounts[brand] = (brandCounts[brand] ?? 0) + count;
  }
  const topBrand = Object.entries(brandCounts).sort((a, b) => b[1] - a[1])[0];

  return {
    year,
    totalWears: yearLog.length,
    daysWorn,
    mostWornWatch: topWatch?.count > 0 ? topWatch.name : null,
    mostWornWatchCount: topWatch?.count ?? 0,
    busiestMonth,
    busiestMonthCount: topMonthKey?.[1] ?? 0,
    favouriteStrap: topStrap ? (topStrap[0] as StrapType) : null,
    mostWornBrand: topBrand?.[1] > 0 ? topBrand[0] : null,
  };
}

export interface WearTrend {
  month: string; // "MMM yy"
  count: number;
}

export function wearsByMonth(wearLog: WearLogEntry[], months = 12): WearTrend[] {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const date = subMonths(startOfMonth(now), months - 1 - i);
    const key = format(date, "yyyy-MM");
    const month = format(date, "MMM yy");
    const count = wearLog.filter((e) => e.date.startsWith(key)).length;
    return { month, count };
  });
}

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
