"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export function useWatches() {
  const watches = useQuery(api.watches.list) ?? [];
  const addWatch = useMutation(api.watches.add);
  const updateWatch = useMutation(api.watches.update);
  const deleteWatch = useMutation(api.watches.remove);

  return { watches, addWatch, updateWatch, deleteWatch };
}

export type WatchId = Id<"watches">;
