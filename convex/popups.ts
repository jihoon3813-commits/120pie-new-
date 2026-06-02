import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. 특정 페이지에서 현재 노출할 팝업 가져오기 (게시 기간 + 노출 상태 + 타겟 페이지 필터)
export const get = query({
  args: { targetPage: v.optional(v.string()) }, // "landing" | "portal"
  handler: async (ctx: any, args: any) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const popups = await ctx.db.query("popups").collect();

    // 유효한 팝업 필터링
    const activePopups = popups.filter((p: any) => {
      // 1. 활성화 여부
      if (!p.isActive) return false;

      // 2. 타겟 페이지 일치 여부 (필드가 누락된 기존 팝업은 기본값 "all"로 간주)
      const target = p.targetPage || "all";
      if (args.targetPage && target !== "all" && target !== args.targetPage) {
        return false;
      }

      // 3. 게시 기간 필터 (시작일 & 종료일 설정 시 체크)
      if (p.startDate && p.startDate > today) return false;
      if (p.endDate && p.endDate < today) return false;

      return true;
    });

    // 만약 해당하는 팝업이 없다면 null 반환
    if (activePopups.length === 0) {
      return null;
    }

    // 가장 최근에 생성된 팝업 1개 반환
    return activePopups.sort((a: any, b: any) => 
      (b.createdAt || "").localeCompare(a.createdAt || "")
    )[0];
  }
});

// 2. 전체 팝업 히스토리 목록 조회 (어드민용)
export const list = query({
  args: {},
  handler: async (ctx: any) => {
    const list = await ctx.db.query("popups").collect();
    return list.sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  }
});

// 3. 팝업 신규 생성 및 수정
export const createOrUpdate = mutation({
  args: {
    _id: v.optional(v.id("popups")),
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
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    targetPage: v.optional(v.string()), // 유연하게 optional 처리
  },
  handler: async (ctx: any, args: any) => {
    const { _id, ...fields } = args;
    // KST 시간 기준으로 생성일 생성 (UTC+9)
    const offset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(Date.now() + offset);
    const nowStr = kstDate.toISOString().replace("T", " ").substring(0, 19);

    const safeFields = {
      ...fields,
      targetPage: fields.targetPage || "all" // 기본값 설정
    };

    if (_id) {
      // 수정
      await ctx.db.patch(_id, safeFields);
      return _id;
    } else {
      // 신규 등록
      const newId = await ctx.db.insert("popups", {
        ...safeFields,
        createdAt: nowStr
      });
      return newId;
    }
  }
});

// 4. 팝업 삭제
export const deletePopup = mutation({
  args: { _id: v.id("popups") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args._id);
    return true;
  }
});

// 5. 팝업 활성 여부 퀵 토글
export const toggleActive = mutation({
  args: { _id: v.id("popups"), isActive: v.boolean() },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args._id, { isActive: args.isActive });
    return true;
  }
});
