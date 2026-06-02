import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. 등록된 제품 카테고리 목록 조회
export const get = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("productCategories").collect();
    if (list.length === 0) {
      return ["냉동생지/자재", "부자재/포장재", "소모품/집기"];
    }
    return list[0].categories;
  },
});

// 2. 어드민에서 카테고리 추가/삭제/순서 변경 시 일괄 동기화
export const update = mutation({
  args: {
    categories: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const list = await ctx.db.query("productCategories").collect();
    if (list.length > 0) {
      await ctx.db.patch(list[0]._id, { categories: args.categories });
      return list[0]._id;
    } else {
      const newId = await ctx.db.insert("productCategories", {
        categories: args.categories,
      });
      return newId;
    }
  },
});

// 3. 최초 시드 생성
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("productCategories").collect();
    if (list.length === 0) {
      await ctx.db.insert("productCategories", {
        categories: ["냉동생지/자재", "부자재/포장재", "소모품/집기"],
      });
      return true;
    }
    return false;
  },
});

