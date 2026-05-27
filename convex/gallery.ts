import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("gallery").order("desc").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    url: v.string(),
    regDate: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("gallery", args);
  },
});

export const remove = mutation({
  args: {
    id: v.id("gallery"),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});
