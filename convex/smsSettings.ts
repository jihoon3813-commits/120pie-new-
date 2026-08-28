import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const record = await ctx.db.query("smsSettings").first();
    return record?.settings || null;
  },
});

export const getInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const record = await ctx.db.query("smsSettings").first();
    return record?.settings || null;
  },
});

export const save = mutation({
  args: {
    settings: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("smsSettings").first();
    const now = new Date().toISOString();
    if (existing) {
      await ctx.db.patch(existing._id, {
        settings: args.settings,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("smsSettings", {
        settings: args.settings,
        updatedAt: now,
      });
    }
  },
});
