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
    isFeatured: v.optional(v.boolean()),
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

export const toggleFeatured = mutation({
  args: {
    id: v.id("gallery"),
    isFeatured: v.boolean(),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.id, { isFeatured: args.isFeatured });
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx: any) => {
    const doc = await ctx.db.query("galleryCategories").first();
    return doc ? doc.categories : ["신메뉴", "홍보연출", "메뉴판", "매장"];
  },
});

export const updateCategories = mutation({
  args: {
    categories: v.array(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const doc = await ctx.db.query("galleryCategories").first();
    if (doc) {
      await ctx.db.patch(doc._id, { categories: args.categories });
    } else {
      await ctx.db.insert("galleryCategories", { categories: args.categories });
    }
  },
});
