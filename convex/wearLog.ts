import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./auth";

export const getByWatch = query({
  args: { watchId: v.id("watches") },
  handler: async (ctx, { watchId }) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("wearLog")
      .withIndex("by_user_watch", (q) => q.eq("userId", userId).eq("watchId", watchId))
      .order("desc")
      .collect();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return ctx.db
      .query("wearLog")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;
    const entries = await ctx.db
      .query("wearLog")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", date))
      .collect();
    return entries[0] ?? null;
  },
});

export const logWear = mutation({
  args: {
    watchId: v.id("watches"),
    date: v.string(),
    strapType: v.union(
      v.literal("NATO"),
      v.literal("Leather"),
      v.literal("Rubber"),
      v.literal("Bracelet"),
      v.literal("Mesh"),
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    // Enforce one wear per day — replace existing entry if present
    const existing = await ctx.db
      .query("wearLog")
      .withIndex("by_user_date", (q) => q.eq("userId", userId).eq("date", args.date))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        watchId: args.watchId,
        strapType: args.strapType,
        notes: args.notes,
      });
      return existing._id;
    }

    return ctx.db.insert("wearLog", { ...args, userId });
  },
});

export const removeWear = mutation({
  args: { id: v.id("wearLog") },
  handler: async (ctx, { id }) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    const entry = await ctx.db.get(id);
    if (!entry || entry.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});
