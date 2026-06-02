import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 모든 발주 주문 리스트 조회 (최근 주문이 위로 정렬)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return orders.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  },
});

// 단일 발주 주문 생성 및 수정
export const createOrUpdate = mutation({
  args: {
    id: v.string(),
    date: v.string(),
    items: v.array(
      v.object({
        productName: v.string(),
        quantity: v.number(),
        price: v.number(),
        selectedOption: v.optional(v.string()),
      })
    ),
    totalPrice: v.number(),
    status: v.string(),
    storeId: v.optional(v.string()),
    courier: v.optional(v.string()),
    trackingNo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    const { ...fields } = args;

    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return existing._id;
    } else {
      const newId = await ctx.db.insert("orders", fields);
      return newId;
    }
  },
});

// 벌크 주문 동기화 (로컬스토리지 발주 내역을 클라우드 DB로 밀어 올릴 때 사용)
export const syncOrders = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.string(),
        date: v.string(),
        items: v.array(
          v.object({
            productName: v.string(),
            quantity: v.number(),
            price: v.number(),
            selectedOption: v.optional(v.string()),
          })
        ),
        totalPrice: v.number(),
        status: v.string(),
        storeId: v.optional(v.string()),
        courier: v.optional(v.string()),
        trackingNo: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const ord of args.orders) {
      const existing = await ctx.db
        .query("orders")
        .filter((q) => q.eq(q.field("id"), ord.id))
        .first();

      const fields = {
        id: ord.id,
        date: ord.date,
        items: ord.items,
        totalPrice: ord.totalPrice,
        status: ord.status,
        storeId: ord.storeId,
        courier: ord.courier,
        trackingNo: ord.trackingNo,
      };

      if (existing) {
        await ctx.db.patch(existing._id, fields);
      } else {
        await ctx.db.insert("orders", fields);
      }
    }
    return true;
  },
});

// 발주 주문 상태 변경 API
export const updateStatus = mutation({
  args: { id: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { status: args.status });
      return true;
    }
    return false;
  },
});

// 대시보드 테이블 노출용 초기화/시드 데이터 mutation
export const seedOrders = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("orders").collect();
    if (existing.length === 0) {
      await ctx.db.insert("orders", {
        id: "ORD-INIT-001",
        date: "2026-06-02",
        items: [],
        totalPrice: 0,
        status: "대기",
      });
      return true;
    }
    return false;
  },
});

// 송장번호 및 배송 정보 단독 업데이트 mutation
export const updateTracking = mutation({
  args: {
    id: v.string(),
    courier: v.string(),
    trackingNo: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("orders")
      .filter((q: any) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      const patchData: any = {
        courier: args.courier,
        trackingNo: args.trackingNo,
      };
      
      // 송장이 입력되면 자동으로 배송중으로 상태를 영리하게 전이시킵니다.
      patchData.status = args.status || "배송중";
      
      await ctx.db.patch(existing._id, patchData);
      return true;
    }
    return false;
  },
});

