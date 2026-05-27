import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx: any) => {
    const popup = await ctx.db.query("popups").first();
    if (!popup) {
      return {
        isActive: true,
        title: "여름 스페셜 '망고파이' 물류 정식 출시!",
        desc: "신메뉴 출시 기념 특전! 지금 물류 메뉴에서 망고파이 생지 3박스 이상 주문 시 캐릭터 홍보 포스터 패키지 및 아크릴 테이블 텐트 시안 무상 증정!",
        image: "",
        link: "order",
        btnText: "지금 바로 신메뉴 생지 주문하러 가기",
        titleColor: "#ffffff",
        titleSize: "18px",
        descColor: "#735965",
        descSize: "12px",
        btnBgColor: "#f25f8a",
        btnTextColor: "#ffffff",
        btnTextSize: "12px"
      };
    }
    return popup;
  },
});

export const update = mutation({
  args: {
    isActive: v.boolean(),
    title: v.string(),
    desc: v.string(),
    image: v.optional(v.string()),
    link: v.optional(v.string()),
    btnText: v.optional(v.string()),
    titleColor: v.optional(v.string()),
    titleSize: v.optional(v.string()),
    descColor: v.optional(v.string()),
    descSize: v.optional(v.string()),
    btnBgColor: v.optional(v.string()),
    btnTextColor: v.optional(v.string()),
    btnTextSize: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db.query("popups").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      const newId = await ctx.db.insert("popups", args);
      return newId;
    }
  },
});
