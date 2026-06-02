import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. 전체 공지사항 조회 (최신 등록일 순)
export const list = query({
  args: {},
  handler: async (ctx: any) => {
    const items = await ctx.db.query("notices").collect();
    return items.sort((a: any, b: any) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  },
});

// 2. 공지사항 신규 등록 및 수정
export const createOrUpdate = mutation({
  args: {
    _id: v.optional(v.id("notices")),
    id: v.string(), // "NOT-XXX"
    tag: v.string(), // "필독" | "일반" | "신메뉴" | "물류" | "이벤트"
    title: v.string(),
    content: v.string(),
    date: v.string(), // YYYY-MM-DD
    views: v.number(),
  },
  handler: async (ctx: any, args: any) => {
    const { _id, ...fields } = args;
    if (_id) {
      await ctx.db.patch(_id, fields);
      return _id;
    } else {
      const newId = await ctx.db.insert("notices", fields);
      return newId;
    }
  },
});

// 3. 공지사항 삭제
export const deleteNotice = mutation({
  args: { _id: v.id("notices") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args._id);
    return true;
  },
});

// 4. 공지사항 조회수 증가
export const incrementViews = mutation({
  args: { _id: v.id("notices") },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db.get(args._id);
    if (existing) {
      await ctx.db.patch(args._id, { views: existing.views + 1 });
      return true;
    }
    return false;
  },
});
