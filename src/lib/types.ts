import type { Id } from "../../convex/_generated/dataModel";

export const STRAP_TYPES = ["NATO", "Leather", "Rubber", "Bracelet", "Mesh"] as const;
export type StrapType = (typeof STRAP_TYPES)[number];

export const WATCH_TYPES = [
  "Integrated Bracelet",
  "Diver",
  "Dress",
  "Field",
  "Chronograph",
  "GMT",
  "Pilot",
] as const;
export type WatchType = (typeof WATCH_TYPES)[number];

export const PRIORITIES = ["Low", "Medium", "High"] as const;
export type Priority = (typeof PRIORITIES)[number];

export interface Watch {
  _id: Id<"watches">;
  _creationTime: number;
  userId: string;
  name: string;
  brand: string;
  reference: string;
  purchasePrice: number;
  purchaseDate?: string;
  imageUrl?: string;
  imagePosition?: number;
  imagePositionX?: number;
  imageScale?: number;
  notes?: string;
  createdAt: number;
}

export interface WearLogEntry {
  _id: Id<"wearLog">;
  _creationTime: number;
  userId: string;
  watchId: Id<"watches">;
  date: string;
  strapType: StrapType;
  notes?: string;
}

export interface WishlistItem {
  _id: Id<"wishlist">;
  _creationTime: number;
  userId: string;
  brand: string;
  model: string;
  reference?: string;
  estimatedPrice: number;
  watchType: WatchType;
  priority: Priority;
  imageUrl?: string;
  imagePosition?: number;
  imagePositionX?: number;
  imageScale?: number;
  notes?: string;
  createdAt: number;
}
