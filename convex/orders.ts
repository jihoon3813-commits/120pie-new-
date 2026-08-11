import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

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
    trackingList: v.optional(
      v.array(
        v.object({
          courier: v.string(),
          trackingNo: v.string(),
        })
      )
    ),
    impUid: v.optional(v.string()),
    payMethod: v.optional(v.string()),
    deliveryAddress: v.optional(v.string()),
    deliveryDetailAddress: v.optional(v.string()),
    recipientName: v.optional(v.string()),
    recipientPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_order_id", (q) => q.eq("id", args.id))
      .first();

    const { ...fields } = args;

    if (existing) {
      const prevStatus = existing.status;
      await ctx.db.patch(existing._id, fields);

      // 결제대기 -> 결제완료 등 상태 전이 시 디스코드 알림 발송
      if (prevStatus !== "결제완료" && args.status === "결제완료") {
        let storeName = "";
        if (args.storeId) {
          const store = await ctx.db
            .query("stores")
            .filter((q) => q.eq(q.field("id"), args.storeId))
            .first();
          if (store) storeName = store.name;
        }

        await ctx.scheduler.runAfter(0, internal.discord.notifyOrder, {
          id: args.id,
          date: args.date,
          storeId: args.storeId,
          storeName: storeName || undefined,
          totalPrice: args.totalPrice,
          items: args.items,
          deliveryAddress: args.deliveryAddress,
          deliveryDetailAddress: args.deliveryDetailAddress,
          recipientName: args.recipientName,
          recipientPhone: args.recipientPhone,
          payMethod: args.payMethod,
          status: args.status,
        });
      }

      return existing._id;
    } else {
      const newId = await ctx.db.insert("orders", fields);
      
      // Look up store name
      let storeName = "";
      if (args.storeId) {
        const store = await ctx.db
          .query("stores")
          .filter((q) => q.eq(q.field("id"), args.storeId))
          .first();
        if (store) storeName = store.name;
      }

      // 결제대기가 아닌 경우(즉시 결제완료 또는 무통장 입금대기) 디스코드 알림 발송
      if (args.status !== "결제대기") {
        await ctx.scheduler.runAfter(0, internal.discord.notifyOrder, {
          id: args.id,
          date: args.date,
          storeId: args.storeId,
          storeName: storeName || undefined,
          totalPrice: args.totalPrice,
          items: args.items,
          deliveryAddress: args.deliveryAddress,
          deliveryDetailAddress: args.deliveryDetailAddress,
          recipientName: args.recipientName,
          recipientPhone: args.recipientPhone,
          payMethod: args.payMethod,
          status: args.status,
        });
      }

      return newId;
    }
  },
});

// 웹훅을 통한 결제완료 비동기 처리 internalMutation
export const processPaidWebhookOrder = internalMutation({
  args: {
    paymentId: v.string(),
    impUid: v.optional(v.string()),
    amount: v.optional(v.number()),
    payMethod: v.optional(v.string()),
    items: v.optional(
      v.array(
        v.object({
          productName: v.string(),
          quantity: v.number(),
          price: v.number(),
          selectedOption: v.optional(v.string()),
        })
      )
    ),
    storeId: v.optional(v.string()),
    deliveryAddress: v.optional(v.string()),
    deliveryDetailAddress: v.optional(v.string()),
    recipientName: v.optional(v.string()),
    recipientPhone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_order_id", (q) => q.eq("id", args.paymentId))
      .first();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const formattedNow = `${year}-${month}-${day} ${hours}:${minutes}`;

    if (existing) {
      if (existing.status === "결제완료") {
        return { updated: false, alreadyPaid: true };
      }

      await ctx.db.patch(existing._id, {
        status: "결제완료",
        impUid: args.impUid || existing.impUid,
        payMethod: args.payMethod || existing.payMethod || "card",
        totalPrice: args.amount !== undefined ? args.amount : existing.totalPrice,
      });

      let storeName = "";
      const targetStoreId = existing.storeId || args.storeId;
      if (targetStoreId) {
        const store = await ctx.db
          .query("stores")
          .filter((q) => q.eq(q.field("id"), targetStoreId))
          .first();
        if (store) storeName = store.name;
      }

      await ctx.scheduler.runAfter(0, internal.discord.notifyOrder, {
        id: existing.id,
        date: existing.date || formattedNow,
        storeId: targetStoreId,
        storeName: storeName || undefined,
        totalPrice: args.amount !== undefined ? args.amount : existing.totalPrice,
        items: existing.items,
        deliveryAddress: existing.deliveryAddress,
        deliveryDetailAddress: existing.deliveryDetailAddress,
        recipientName: existing.recipientName || undefined,
        recipientPhone: existing.recipientPhone || undefined,
        payMethod: args.payMethod || "card",
        status: "결제완료",
      });

      return { updated: true, orderId: existing._id };
    } else {
      const newOrderFields = {
        id: args.paymentId,
        date: formattedNow,
        items: args.items || [{ productName: "포트원 신용카드 결제 자재", quantity: 1, price: args.amount || 0 }],
        totalPrice: args.amount || 0,
        status: "결제완료",
        storeId: args.storeId || "owner",
        impUid: args.impUid,
        payMethod: args.payMethod || "card",
        deliveryAddress: args.deliveryAddress,
        deliveryDetailAddress: args.deliveryDetailAddress,
        recipientName: args.recipientName,
        recipientPhone: args.recipientPhone,
      };

      const newId = await ctx.db.insert("orders", newOrderFields);

      let storeName = "";
      if (args.storeId) {
        const store = await ctx.db
          .query("stores")
          .filter((q) => q.eq(q.field("id"), args.storeId))
          .first();
        if (store) storeName = store.name;
      }

      await ctx.scheduler.runAfter(0, internal.discord.notifyOrder, {
        id: args.paymentId,
        date: formattedNow,
        storeId: args.storeId,
        storeName: storeName || undefined,
        totalPrice: args.amount || 0,
        items: newOrderFields.items,
        deliveryAddress: args.deliveryAddress,
        deliveryDetailAddress: args.deliveryDetailAddress,
        recipientName: args.recipientName,
        recipientPhone: args.recipientPhone,
        payMethod: "card",
        status: "결제완료",
      });

      return { updated: true, orderId: newId };
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
        impUid: v.optional(v.string()),
        payMethod: v.optional(v.string()),
        deliveryAddress: v.optional(v.string()),
        deliveryDetailAddress: v.optional(v.string()),
        recipientName: v.optional(v.string()),
        recipientPhone: v.optional(v.string()),
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
        impUid: ord.impUid,
        payMethod: ord.payMethod,
        deliveryAddress: ord.deliveryAddress,
        deliveryDetailAddress: ord.deliveryDetailAddress,
        recipientName: ord.recipientName,
        recipientPhone: ord.recipientPhone,
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
    courier: v.optional(v.string()),
    trackingNo: v.optional(v.string()),
    trackingList: v.optional(
      v.array(
        v.object({
          courier: v.string(),
          trackingNo: v.string(),
        })
      )
    ),
    status: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("orders")
      .filter((q: any) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      const patchData: any = {};
      
      if (args.trackingList !== undefined) {
        patchData.trackingList = args.trackingList;
        if (args.trackingList.length > 0) {
          patchData.courier = args.trackingList[0].courier;
          patchData.trackingNo = args.trackingList[0].trackingNo;
        } else {
          patchData.courier = "";
          patchData.trackingNo = "";
        }
      } else {
        if (args.courier !== undefined) patchData.courier = args.courier;
        if (args.trackingNo !== undefined) patchData.trackingNo = args.trackingNo;
      }
      
      // 송장이 입력되면 자동으로 배송중으로 상태를 영리하게 전이시킵니다.
      patchData.status = args.status || "배송중";
      
      await ctx.db.patch(existing._id, patchData);
      return true;
    }
    return false;
  },
});

// 모든 주문 내역 삭제 (초기화용)
export const deleteAllOrders = mutation({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    for (const ord of orders) {
      await ctx.db.delete(ord._id);
    }
    return true;
  },
});

// 개별 주문 삭제 mutation
export const deleteOrder = mutation({
  args: { _id: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args._id);
    return true;
  },
});


