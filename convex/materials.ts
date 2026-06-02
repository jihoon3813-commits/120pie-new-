import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. 전체 가맹지원 자료 리스트 조회 (최신 등록일 순)
export const list = query({
  args: { type: v.optional(v.string()) }, // "training" | "pr"
  handler: async (ctx: any, args: any) => {
    const items = await ctx.db.query("materials").collect();
    const sorted = items.sort((a: any, b: any) => b.date.localeCompare(a.date));
    if (args.type) {
      return sorted.filter((item: any) => item.type === args.type);
    }
    return sorted;
  },
});

// 2. 자료 신규 등록 및 편집
export const createOrUpdate = mutation({
  args: {
    _id: v.optional(v.id("materials")),
    title: v.string(),
    date: v.string(),
    size: v.string(),
    format: v.string(),
    desc: v.string(),
    img: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    type: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const { _id, ...fields } = args;
    if (_id) {
      await ctx.db.patch(_id, fields);
      return _id;
    } else {
      const newId = await ctx.db.insert("materials", fields);
      return newId;
    }
  },
});

// 3. 자료 삭제
export const deleteMaterial = mutation({
  args: { _id: v.id("materials") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args._id);
    return true;
  },
});
