"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useWearLog() {
  const wearLog = useQuery(api.wearLog.getAll) ?? [];
  const logWear = useMutation(api.wearLog.logWear);
  const removeWear = useMutation(api.wearLog.removeWear);

  return { wearLog, logWear, removeWear };
}

export function useWearLogByWatch(watchId: Id<"watches"> | undefined) {
  const entries = useQuery(
    api.wearLog.getByWatch,
    watchId ? { watchId } : "skip",
  ) ?? [];
  return entries;
}

export function useWearLogByDate(date: string) {
  return useQuery(api.wearLog.getByDate, { date }) ?? null;
}
