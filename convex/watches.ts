import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("watches")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    brand: v.string(),
    reference: v.string(),
    purchasePrice: v.number(),
    purchaseDate: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imagePosition: v.optional(v.number()),
    imagePositionX: v.optional(v.number()),
    imageScale: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    return ctx.db.insert("watches", { ...args, userId, createdAt: Date.now() });
  },
});

export const update = mutation({
  args: {
    id: v.id("watches"),
    name: v.optional(v.string()),
    brand: v.optional(v.string()),
    reference: v.optional(v.string()),
    purchasePrice: v.optional(v.number()),
    purchaseDate: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imagePosition: v.optional(v.number()),
    imagePositionX: v.optional(v.number()),
    imageScale: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const watch = await ctx.db.get(id);
    if (!watch || watch.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("watches") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const watch = await ctx.db.get(id);
    if (!watch || watch.userId !== userId) throw new Error("Not found");
    // Delete associated wear log entries
    const entries = await ctx.db
      .query("wearLog")
      .withIndex("by_user_watch", (q) => q.eq("userId", userId).eq("watchId", id))
      .collect();
    await Promise.all(entries.map((e) => ctx.db.delete(e._id)));
    await ctx.db.delete(id);
  },
});
