import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. 본사용 전체 문의 조회 (최근일 순)
export const list = query({
  args: {},
  handler: async (ctx: any) => {
    const list = await ctx.db.query("storeInquiries").collect();
    return list.sort((a: any, b: any) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  },
});

// 2. 개별 가맹점용 매장별 문의 이력 조회
export const listByStore = query({
  args: { storeId: v.string() },
  handler: async (ctx: any, args: any) => {
    const list = await ctx.db
      .query("storeInquiries")
      .filter((q: any) => q.eq(q.field("storeId"), args.storeId))
      .collect();
    return list.sort((a: any, b: any) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  },
});

// 3. 점주 1:1 문의 신규 등록 및 수정
export const createOrUpdate = mutation({
  args: {
    _id: v.optional(v.id("storeInquiries")),
    id: v.string(), // "INQ-XXX"
    storeId: v.string(),
    storeName: v.string(),
    category: v.string(),
    title: v.string(),
    content: v.string(),
    date: v.string(),
    status: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const { _id, ...fields } = args;
    if (_id) {
      await ctx.db.patch(_id, fields);
      return _id;
    } else {
      const newId = await ctx.db.insert("storeInquiries", fields);
      return newId;
    }
  },
});

// 4. 본사 어드민 답변 작성 및 처리
export const answerInquiry = mutation({
  args: {
    _id: v.id("storeInquiries"),
    answer: v.string(),
    answerDate: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args._id, {
      answer: args.answer,
      answerDate: args.answerDate,
      status: "답변완료",
    });
    return true;
  },
});

// 5. 문의건 삭제
export const deleteInquiry = mutation({
  args: { _id: v.id("storeInquiries") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args._id);
    return true;
  },
});
