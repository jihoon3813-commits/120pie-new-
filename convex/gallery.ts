import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    const items = await ctx.db.query("gallery").collect();
    return items.sort((a: any, b: any) => {
      const aOrder = a.orderIndex !== undefined ? a.orderIndex : 999999;
      const bOrder = b.orderIndex !== undefined ? b.orderIndex : 999999;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return b._creationTime - a._creationTime;
    });
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    url: v.string(),
    regDate: v.string(),
    orderIndex: v.optional(v.number()),
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

export const updateOrder = mutation({
  args: {
    orderedIds: v.array(v.id("gallery")),
  },
  handler: async (ctx: any, args: any) => {
    for (let i = 0; i < args.orderedIds.length; i++) {
      const id = args.orderedIds[i];
      await ctx.db.patch(id, { orderIndex: i });
    }
  },
});
