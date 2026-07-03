import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. 점주가 계정 정보 제출/수정
export const submit = mutation({
  args: {
    noticeId: v.string(),
    storeId: v.string(),
    storeName: v.string(),
    baeminId: v.string(),
    baeminPw: v.string(),
    coupangId: v.string(),
    coupangPw: v.string(),
    submittedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("deliveryCredentials")
      .withIndex("by_storeId_and_noticeId", (q) =>
        q.eq("storeId", args.storeId).eq("noticeId", args.noticeId)
      )
      .unique();

    if (existing) {
      // 기존에 존재하면 업데이트
      await ctx.db.patch(existing._id, {
        storeName: args.storeName,
        baeminId: args.baeminId,
        baeminPw: args.baeminPw,
        coupangId: args.coupangId,
        coupangPw: args.coupangPw,
        submittedAt: args.submittedAt,
      });
      return existing._id;
    } else {
      // 신규 입력
      const newId = await ctx.db.insert("deliveryCredentials", args);
      return newId;
    }
  },
});

// 2. 본사 어드민에서 특정 공지사항에 제출된 정보 목록 조회
export const getByNotice = query({
  args: { noticeId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deliveryCredentials")
      .withIndex("by_noticeId", (q) => q.eq("noticeId", args.noticeId))
      .collect();
  },
});

// 3. 점주가 기존에 제출한 정보 조회
export const getByStoreAndNotice = query({
  args: {
    noticeId: v.string(),
    storeId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("deliveryCredentials")
      .withIndex("by_storeId_and_noticeId", (q) =>
        q.eq("storeId", args.storeId).eq("noticeId", args.noticeId)
      )
      .unique();
  },
});
