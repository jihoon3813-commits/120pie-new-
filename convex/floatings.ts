import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx: any) => {
    const floating = await ctx.db.query("floatings").first();
    if (!floating) {
      return {
        isActive: true,
        instaUrl: "https://www.instagram.com/120pie77/",
        youtubeUrl: "https://youtube.com",
        chatUrl: "https://kakao.com",
        phoneNo: "1688-1200",
        kakaoUrl: "https://kakao.com",
        blogUrl: "https://blog.naver.com/120pie_coffee"
      };
    }
    return floating;
  },
});

export const update = mutation({
  args: {
    isActive: v.boolean(),
    instaUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    chatUrl: v.optional(v.string()),
    phoneNo: v.optional(v.string()),
    kakaoUrl: v.optional(v.string()),
    blogUrl: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db.query("floatings").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      const newId = await ctx.db.insert("floatings", args);
      return newId;
    }
  },
});
