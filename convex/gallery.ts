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

export const syncGallery = mutation({
  args: {
    items: v.array(
      v.object({
        name: v.string(),
        category: v.string(),
        url: v.string(),
        regDate: v.string(),
        orderIndex: v.optional(v.number()),
        isFeatured: v.optional(v.boolean()),
      })
    ),
  },
  handler: async (ctx: any, args: any) => {
    for (const item of args.items) {
      const existing = await ctx.db
        .query("gallery")
        .filter((q: any) => q.eq(q.field("url"), item.url))
        .first();
      if (!existing) {
        await ctx.db.insert("gallery", item);
      }
    }
    return true;
  },
});

export const seedGallery = mutation({
  args: {},
  handler: async (ctx: any) => {
    const existing = await ctx.db.query("gallery").collect();
    if (existing.length === 0) {
      const DEFAULT_GALLERY = [
        {
          name: "로제미트파이 신메뉴 이미지",
          category: "신메뉴",
          url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg",
          regDate: "2026-05-20",
          orderIndex: 0,
          isFeatured: true
        },
        {
          name: "120겹파이 매장 연출컷",
          category: "홍보연출",
          url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779721204/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_du1czf.jpg",
          regDate: "2026-05-21",
          orderIndex: 1,
          isFeatured: true
        },
        {
          name: "에그120 및 디저트 라인업",
          category: "메뉴판",
          url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg",
          regDate: "2026-05-22",
          orderIndex: 2,
          isFeatured: true
        }
      ];
      for (const item of DEFAULT_GALLERY) {
        await ctx.db.insert("gallery", item);
      }
      return { success: true, seeded: DEFAULT_GALLERY.length };
    }
    return { success: false, alreadySeeded: true };
  },
});
