import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    const items = await ctx.db.query("gallery").collect();
    if (items.length === 0) {
      return [
        {
          _id: "gal-1" as any,
          name: "로제미트파이 신메뉴 이미지",
          category: "신메뉴",
          url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg",
          regDate: "2026-05-20"
        },
        {
          _id: "gal-2" as any,
          name: "120겹파이 매장 연출컷",
          category: "홍보연출",
          url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779721204/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_du1czf.jpg",
          regDate: "2026-05-21"
        },
        {
          _id: "gal-3" as any,
          name: "에그120 및 디저트 라인업",
          category: "메뉴판",
          url: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg",
          regDate: "2026-05-22"
        }
      ];
    }
    return items;
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
