import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 배너 설정 가져오기
export const get = query({
  args: {},
  handler: async (ctx: any) => {
    const banners = await ctx.db.query("banners").collect();
    if (banners.length === 0) {
      return null;
    }
    // 가장 최근에 생성/수정된 배너 반환
    return banners[0];
  }
});

// 배너 설정 수정 또는 생성
export const update = mutation({
  args: {
    mainTag: v.string(),
    mainTitle: v.string(),
    mainDesc: v.string(),
    sideTag: v.string(),
    sideTitle: v.string(),
    sideDesc: v.string(),
    sideBtnText: v.string(),
    mainImage: v.optional(v.string()),
    sideImage: v.optional(v.string()),
    sideLink: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const banners = await ctx.db.query("banners").collect();
    if (banners.length > 0) {
      // 기존 첫 번째 배너 문서 업데이트
      const existingId = banners[0]._id;
      await ctx.db.patch(existingId, args);
      return existingId;
    } else {
      // 신규 등록
      const newId = await ctx.db.insert("banners", args);
      return newId;
    }
  }
});
