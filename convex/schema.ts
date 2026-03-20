import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  watches: defineTable({
    userId: v.string(),
    name: v.string(),
    brand: v.string(),
    reference: v.string(),
    purchasePrice: v.number(),
    purchaseDate: v.optional(v.string()), // "YYYY-MM-DD"
    imageUrl: v.optional(v.string()),
    imagePosition: v.optional(v.number()), // vertical crop 0–100
    imagePositionX: v.optional(v.number()), // horizontal crop 0–100
    imageScale: v.optional(v.number()), // zoom 1–3
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  wearLog: defineTable({
    userId: v.string(),
    watchId: v.id("watches"),
    date: v.string(), // "YYYY-MM-DD"
    strapType: v.union(
      v.literal("NATO"),
      v.literal("Leather"),
      v.literal("Rubber"),
      v.literal("Bracelet"),
      v.literal("Mesh"),
    ),
    notes: v.optional(v.string()),
  })
    .index("by_user_date", ["userId", "date"])
    .index("by_user_watch", ["userId", "watchId"]),

  wishlist: defineTable({
    userId: v.string(),
    brand: v.string(),
    model: v.string(),
    reference: v.optional(v.string()),
    estimatedPrice: v.number(),
    watchType: v.union(
      v.literal("Integrated Bracelet"),
      v.literal("Diver"),
      v.literal("Dress"),
      v.literal("Field"),
      v.literal("Chronograph"),
      v.literal("GMT"),
      v.literal("Pilot"),
    ),
    priority: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
    imageUrl: v.optional(v.string()),
    imagePosition: v.optional(v.number()), // vertical crop 0–100
    imagePositionX: v.optional(v.number()), // horizontal crop 0–100
    imageScale: v.optional(v.number()), // zoom 1–3
    notes: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
