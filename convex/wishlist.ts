import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
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
      v.literal("GADA"),
    ),
    priority: v.union(v.literal("Low"), v.literal("Medium"), v.literal("High")),
    imageUrl: v.optional(v.string()),
    imagePosition: v.optional(v.number()),
    imagePositionX: v.optional(v.number()),
    imageScale: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    return ctx.db.insert("wishlist", { ...args, userId, createdAt: Date.now() });
  },
});

export const update = mutation({
  args: {
    id: v.id("wishlist"),
    brand: v.optional(v.string()),
    model: v.optional(v.string()),
    reference: v.optional(v.string()),
    estimatedPrice: v.optional(v.number()),
    watchType: v.optional(
      v.union(
        v.literal("Integrated Bracelet"),
        v.literal("Diver"),
        v.literal("Dress"),
        v.literal("Field"),
        v.literal("Chronograph"),
        v.literal("GMT"),
        v.literal("Pilot"),
        v.literal("GADA"),
      ),
    ),
    priority: v.optional(v.union(v.literal("Low"), v.literal("Medium"), v.literal("High"))),
    imageUrl: v.optional(v.string()),
    imagePosition: v.optional(v.number()),
    imagePositionX: v.optional(v.number()),
    imageScale: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const item = await ctx.db.get(id);
    if (!item || item.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("wishlist") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const item = await ctx.db.get(id);
    if (!item || item.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});
