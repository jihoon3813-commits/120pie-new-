import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all stores
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stores").collect();
  },
});

// Create or update a store
export const createOrUpdate = mutation({
  args: {
    id: v.string(), // 로그인 ID
    pw: v.string(), // 비밀번호
    pwConfirm: v.string(), // 비밀번호 확인
    name: v.string(), // 가맹점명
    owner: v.string(), // 점주명
    phone: v.string(), // 연락처
    status: v.string(), // 가맹상태
    roadAddress: v.string(), // 도로명주소
    detailAddress: v.string(), // 상세주소
    regDate: v.string(), // 가맹 등록일
    cancelDate: v.optional(v.string()), // 가맹 해지일
    adoptionMenu: v.array(v.string()), // 도입메뉴
    monthlySales: v.number(), // 월매출
    partnerId: v.optional(v.string()), // 영업 파트너 ID
  },
  handler: async (ctx, args) => {
    // Check if store already exists by the logic ID
    const existing = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      // Update existing store
      await ctx.db.patch(existing._id, {
        pw: args.pw,
        pwConfirm: args.pwConfirm,
        name: args.name,
        owner: args.owner,
        phone: args.phone,
        status: args.status,
        roadAddress: args.roadAddress,
        detailAddress: args.detailAddress,
        regDate: args.regDate,
        cancelDate: args.cancelDate,
        adoptionMenu: args.adoptionMenu,
        monthlySales: args.monthlySales,
        partnerId: args.partnerId,
      });
      return { success: true, action: "updated", storeId: args.id };
    } else {
      // Insert new store
      await ctx.db.insert("stores", {
        id: args.id,
        pw: args.pw,
        pwConfirm: args.pwConfirm,
        name: args.name,
        owner: args.owner,
        phone: args.phone,
        status: args.status,
        roadAddress: args.roadAddress,
        detailAddress: args.detailAddress,
        regDate: args.regDate,
        cancelDate: args.cancelDate,
        adoptionMenu: args.adoptionMenu,
        monthlySales: args.monthlySales,
        partnerId: args.partnerId,
      });
      return { success: true, action: "created", storeId: args.id };
    }
  },
});

// Delete a store
export const deleteStore = mutation({
  args: {
    id: v.string(), // 로그인 ID
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { success: true, action: "deleted" };
    }
    return { success: false, error: "Store not found" };
  },
});

// Seed initial default stores if empty
export const seedStores = mutation({
  args: {},
  handler: async (ctx) => {
    const existingStores = await ctx.db.query("stores").collect();
    if (existingStores.length === 0) {
      const DEFAULT_STORES = [
        {
          id: "owner",
          pw: "owner",
          pwConfirm: "owner",
          name: "강남역삼점",
          owner: "김지훈",
          phone: "010-3813-1200",
          status: "승인",
          roadAddress: "경기 군포시 엘에스로 143 (금정동, 1층 1001호)",
          detailAddress: "1층 1001호",
          regDate: "2026-05-01",
          cancelDate: "",
          adoptionMenu: ["120pie", "egg120", "츄러스120", "핫도그120", "120coffee"],
          monthlySales: 12800000,
        },
        {
          id: "hongdae",
          pw: "owner123",
          pwConfirm: "owner123",
          name: "홍대입구점",
          owner: "이민우",
          phone: "010-4211-5678",
          status: "승인",
          roadAddress: "서울 마포구 양화로 160 (동교동)",
          detailAddress: "2층 201호",
          regDate: "2026-04-12",
          cancelDate: "",
          adoptionMenu: ["120pie", "egg120", "츄러스120"],
          monthlySales: 15400000,
        },
        {
          id: "seomyeon",
          pw: "owner456",
          pwConfirm: "owner456",
          name: "부산서면점",
          owner: "박수진",
          phone: "010-5182-9012",
          status: "대기",
          roadAddress: "부산 부산진구 중앙대로 730 (부전동)",
          detailAddress: "1층",
          regDate: "2026-05-20",
          cancelDate: "",
          adoptionMenu: ["120pie", "120coffee"],
          monthlySales: 9600000,
        },
      ];

      for (const store of DEFAULT_STORES) {
        await ctx.db.insert("stores", store);
      }
      return { success: true, seeded: DEFAULT_STORES.length };
    }
    return { success: false, alreadySeeded: true };
  },
});
