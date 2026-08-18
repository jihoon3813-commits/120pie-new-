import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 패스트리 생지 판별 헬퍼 함수
export function isPastryDoughItem(productName: string): boolean {
  if (!productName) return false;
  const name = productName.toLowerCase().replace(/\s+/g, "");
  // 파이/생지/츄러스생지 등 패스트리 생지 관련 품목 필터링
  const doughKeywords = [
    "생지",
    "파이",
    "미트파이",
    "애플시나몬",
    "콘치즈",
    "츄러스",
    "페이스트리",
    "패스트리",
    "로제미트",
    "크림치즈"
  ];
  return doughKeywords.some((kw) => name.includes(kw));
}

// 1. 전체 파트너 리스트 조회 (유치 가맹점 수, 당월/누적 생지 박스 수 및 수수료 집계 포함)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const partners = await ctx.db.query("partners").collect();
    const stores = await ctx.db.query("stores").collect();
    const orders = await ctx.db.query("orders").collect();

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const results = partners.map((p) => {
      // 해당 파트너가 유치한 가맹점들
      const myStores = stores.filter((s) => s.partnerId === p.id);
      const myStoreIds = new Set(myStores.map((s) => s.id));

      // 해당 가맹점들의 유효 주문 내역 (취소 제외)
      const validOrders = orders.filter(
        (o) => o.storeId && myStoreIds.has(o.storeId) && o.status !== "주문취소"
      );

      let totalBoxes = 0;
      let currentMonthBoxes = 0;

      for (const ord of validOrders) {
        let orderBoxes = 0;
        if (ord.items && Array.isArray(ord.items)) {
          for (const item of ord.items) {
            if (isPastryDoughItem(item.productName)) {
              orderBoxes += item.quantity || 0;
            }
          }
        }

        totalBoxes += orderBoxes;

        // 당월 주문 여부
        if (ord.date && ord.date.startsWith(currentYearMonth)) {
          currentMonthBoxes += orderBoxes;
        }
      }

      const commissionUnit = p.commissionPerBox || 8000;
      const totalCommission = totalBoxes * commissionUnit;
      const currentMonthCommission = currentMonthBoxes * commissionUnit;

      return {
        ...p,
        storesCount: myStores.length,
        totalBoxes,
        currentMonthBoxes,
        totalCommission,
        currentMonthCommission,
      };
    });

    return results.sort((a, b) => b.regDate.localeCompare(a.regDate));
  },
});

// 2. 단일 파트너 상세 조회 (ID 기준)
export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("partners")
      .withIndex("by_partner_id", (q) => q.eq("id", args.id))
      .first();
  },
});

// 3. 파트너 신규 등록 또는 정보 수정 (본사 어드민용)
export const createOrUpdate = mutation({
  args: {
    id: v.string(), // 로그인 ID
    pw: v.string(), // 비밀번호
    name: v.string(), // 파트너 이름 / 대표자명
    phone: v.string(), // 연락처
    email: v.optional(v.string()),
    companyName: v.optional(v.string()),
    bankName: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    accountHolder: v.optional(v.string()),
    commissionPerBox: v.optional(v.number()), // 기본 8000
    status: v.string(), // "활동중" | "대기" | "정지"
    regDate: v.string(), // YYYY-MM-DD
    memo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("partners")
      .withIndex("by_partner_id", (q) => q.eq("id", args.id))
      .first();

    const commission = args.commissionPerBox !== undefined ? args.commissionPerBox : 8000;

    const partnerData = {
      id: args.id,
      pw: args.pw,
      name: args.name,
      phone: args.phone,
      email: args.email,
      companyName: args.companyName,
      bankName: args.bankName,
      accountNumber: args.accountNumber,
      accountHolder: args.accountHolder,
      commissionPerBox: commission,
      status: args.status,
      regDate: args.regDate,
      memo: args.memo,
    };

    if (existing) {
      await ctx.db.patch(existing._id, partnerData);
      return { success: true, action: "updated", partnerId: args.id };
    } else {
      await ctx.db.insert("partners", partnerData);
      return { success: true, action: "created", partnerId: args.id };
    }
  },
});

// 4. 파트너 정보 삭제 (본사 어드민용)
export const deletePartner = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("partners")
      .withIndex("by_partner_id", (q) => q.eq("id", args.id))
      .first();

    if (existing) {
      // 해당 파트너에 매핑된 가맹점들의 partnerId 연결 해제
      const linkedStores = await ctx.db
        .query("stores")
        .filter((q) => q.eq(q.field("partnerId"), args.id))
        .collect();

      for (const store of linkedStores) {
        await ctx.db.patch(store._id, { partnerId: undefined });
      }

      await ctx.db.delete(existing._id);
      return { success: true, action: "deleted" };
    }
    return { success: false, error: "Partner not found" };
  },
});

// 5. 가맹점의 담당 유치 파트너 배정 및 변경
export const assignStoreToPartner = mutation({
  args: {
    storeId: v.string(),
    partnerId: v.optional(v.string()), // null/undefined시 해제
  },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("id"), args.storeId))
      .first();

    if (!store) {
      return { success: false, error: "Store not found" };
    }

    await ctx.db.patch(store._id, {
      partnerId: args.partnerId || undefined,
    });

    return { success: true };
  },
});

// 6. 특정 파트너가 유치한 가맹점 목록 조회 (각 가맹점의 생지 누적 주문량 및 최근 주문 포함)
export const getPartnerStores = query({
  args: { partnerId: v.string() },
  handler: async (ctx, args) => {
    const stores = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("partnerId"), args.partnerId))
      .collect();

    const orders = await ctx.db.query("orders").collect();

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const storesWithDetails = stores.map((s) => {
      const storeOrders = orders.filter(
        (o) => o.storeId === s.id && o.status !== "주문취소"
      );

      let totalDoughBoxes = 0;
      let monthDoughBoxes = 0;
      let totalOrderAmount = 0;

      for (const ord of storeOrders) {
        totalOrderAmount += ord.totalPrice || 0;
        let boxes = 0;
        if (ord.items && Array.isArray(ord.items)) {
          for (const item of ord.items) {
            if (isPastryDoughItem(item.productName)) {
              boxes += item.quantity || 0;
            }
          }
        }
        totalDoughBoxes += boxes;
        if (ord.date && ord.date.startsWith(currentYearMonth)) {
          monthDoughBoxes += boxes;
        }
      }

      // 최근 주문 1건
      const sortedOrders = [...storeOrders].sort((a, b) => b.date.localeCompare(a.date));
      const latestOrder = sortedOrders[0] || null;

      return {
        ...s,
        totalOrdersCount: storeOrders.length,
        totalOrderAmount,
        totalDoughBoxes,
        monthDoughBoxes,
        monthCommission: monthDoughBoxes * 8000,
        latestOrderDate: latestOrder ? latestOrder.date : "-",
      };
    });

    return storesWithDetails.sort((a, b) => b.regDate.localeCompare(a.regDate));
  },
});

// 7. 특정 파트너의 유치 가맹점 전체 재료 주문 상세 내역 조회 (수수료 계산 근거 확인용)
export const getPartnerOrders = query({
  args: {
    partnerId: v.string(),
    storeId: v.optional(v.string()), // 특정 가맹점 필터
    yearMonth: v.optional(v.string()), // 특정 년월 필터 (YYYY-MM)
  },
  handler: async (ctx, args) => {
    // 1) 파트너에 속한 가맹점 목록
    const myStores = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("partnerId"), args.partnerId))
      .collect();

    const storeMap = new Map<string, string>();
    for (const s of myStores) {
      storeMap.set(s.id, s.name);
    }

    const myStoreIds = new Set(myStores.map((s) => s.id));
    if (myStoreIds.size === 0) {
      return [];
    }

    // 2) 주문 내역 조회
    const allOrders = await ctx.db.query("orders").collect();

    const filtered = allOrders.filter((ord) => {
      if (!ord.storeId || !myStoreIds.has(ord.storeId)) return false;
      if (args.storeId && ord.storeId !== args.storeId) return false;
      if (args.yearMonth && ord.date && !ord.date.startsWith(args.yearMonth)) return false;
      return true;
    });

    // 3) 주문별 패스트리 생지 박스 수 및 수수료 계산
    const enrichedOrders = filtered.map((ord) => {
      let pastryDoughBoxes = 0;
      const itemsWithDoughFlag = (ord.items || []).map((item) => {
        const isDough = isPastryDoughItem(item.productName);
        if (isDough) {
          pastryDoughBoxes += item.quantity || 0;
        }
        return {
          ...item,
          isPastryDough: isDough,
        };
      });

      const commission = pastryDoughBoxes * 8000;

      return {
        ...ord,
        storeName: storeMap.get(ord.storeId || "") || "가맹점",
        items: itemsWithDoughFlag,
        pastryDoughBoxes,
        commission,
      };
    });

    return enrichedOrders.sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  },
});

// 8. 파트너 통계 데이터 조회 (월별 생지 박스 수, 수수료, 가맹점 수 추이)
export const getPartnerStats = query({
  args: { partnerId: v.string() },
  handler: async (ctx, args) => {
    const myStores = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("partnerId"), args.partnerId))
      .collect();

    const myStoreIds = new Set(myStores.map((s) => s.id));
    const allOrders = await ctx.db.query("orders").collect();

    // 월별 집계 맵 (최근 6개월)
    const monthlyMap: Record<
      string,
      { yearMonth: string; boxCount: number; commission: number; orderCount: number }
    > = {};

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap[ym] = { yearMonth: ym, boxCount: 0, commission: 0, orderCount: 0 };
    }

    for (const ord of allOrders) {
      if (!ord.storeId || !myStoreIds.has(ord.storeId) || ord.status === "주문취소") continue;

      const ym = (ord.date || "").slice(0, 7);
      if (monthlyMap[ym]) {
        monthlyMap[ym].orderCount += 1;
        if (ord.items && Array.isArray(ord.items)) {
          for (const item of ord.items) {
            if (isPastryDoughItem(item.productName)) {
              monthlyMap[ym].boxCount += item.quantity || 0;
            }
          }
        }
        monthlyMap[ym].commission = monthlyMap[ym].boxCount * 8000;
      }
    }

    return Object.values(monthlyMap);
  },
});

// 9. 월별 정산 내역 조회 (본사 어드민 및 파트너 공통)
export const getSettlements = query({
  args: {
    partnerId: v.optional(v.string()),
    yearMonth: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const partners = await ctx.db.query("partners").collect();
    const partnerMap = new Map(partners.map((p) => [p.id, p]));

    const stores = await ctx.db.query("stores").collect();
    const orders = await ctx.db.query("orders").collect();
    const dbSettlements = await ctx.db.query("partnerSettlements").collect();

    // DB에 기록된 정산 레코드 맵
    const settlementMap = new Map<string, any>();
    for (const s of dbSettlements) {
      settlementMap.set(`${s.partnerId}_${s.yearMonth}`, s);
    }

    // 대상 파트너 목록
    const targetPartners = args.partnerId
      ? partners.filter((p) => p.id === args.partnerId)
      : partners;

    // 대상 년월 목록 (기본: 최근 6개월)
    const yearMonths: string[] = [];
    if (args.yearMonth) {
      yearMonths.push(args.yearMonth);
    } else {
      const now = new Date();
      for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        yearMonths.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
      }
    }

    const results: any[] = [];

    for (const p of targetPartners) {
      const myStores = stores.filter((s) => s.partnerId === p.id);
      const myStoreIds = new Set(myStores.map((s) => s.id));

      for (const ym of yearMonths) {
        // 해당 월의 주문들에서 생지 박스수 실시간 계산
        const monthOrders = orders.filter(
          (o) =>
            o.storeId &&
            myStoreIds.has(o.storeId) &&
            o.status !== "주문취소" &&
            o.date &&
            o.date.startsWith(ym)
        );

        let boxCount = 0;
        for (const ord of monthOrders) {
          if (ord.items && Array.isArray(ord.items)) {
            for (const item of ord.items) {
              if (isPastryDoughItem(item.productName)) {
                boxCount += item.quantity || 0;
              }
            }
          }
        }

        const unit = p.commissionPerBox || 8000;
        const calcAmount = boxCount * unit;

        const dbRec = settlementMap.get(`${p.id}_${ym}`);

        results.push({
          partnerId: p.id,
          partnerName: p.name,
          companyName: p.companyName || "",
          phone: p.phone,
          bankName: p.bankName || "",
          accountNumber: p.accountNumber || "",
          accountHolder: p.accountHolder || "",
          yearMonth: ym,
          storeCount: myStores.length,
          orderCount: monthOrders.length,
          boxCount: dbRec ? dbRec.boxCount : boxCount,
          commissionUnit: unit,
          commissionAmount: dbRec ? dbRec.commissionAmount : calcAmount,
          status: dbRec ? dbRec.status : "정산대기",
          paidDate: dbRec ? dbRec.paidDate : undefined,
          note: dbRec ? dbRec.note : undefined,
          dbId: dbRec ? dbRec._id : undefined,
        });
      }
    }

    return results.sort((a, b) => b.yearMonth.localeCompare(a.yearMonth) || a.partnerName.localeCompare(b.partnerName));
  },
});

// 10. 정산 상태 업데이트 및 확정 (본사 어드민용)
export const updateSettlementStatus = mutation({
  args: {
    partnerId: v.string(),
    yearMonth: v.string(),
    boxCount: v.number(),
    commissionAmount: v.number(),
    status: v.string(), // "정산대기" | "정산확정" | "지급완료"
    paidDate: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("partnerSettlements")
      .withIndex("by_partner_yearMonth", (q) =>
        q.eq("partnerId", args.partnerId).eq("yearMonth", args.yearMonth)
      )
      .first();

    const patchData = {
      partnerId: args.partnerId,
      yearMonth: args.yearMonth,
      boxCount: args.boxCount,
      commissionAmount: args.commissionAmount,
      status: args.status,
      paidDate: args.paidDate,
      note: args.note,
    };

    if (existing) {
      await ctx.db.patch(existing._id, patchData);
      return { success: true, updated: true };
    } else {
      await ctx.db.insert("partnerSettlements", patchData);
      return { success: true, created: true };
    }
  },
});

// 11. 파트너 본인 프로필 및 계좌정보 수정 (파트너 어드민용)
export const updatePartnerProfile = mutation({
  args: {
    id: v.string(),
    pw: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    companyName: v.optional(v.string()),
    bankName: v.optional(v.string()),
    accountNumber: v.optional(v.string()),
    accountHolder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("partners")
      .withIndex("by_partner_id", (q) => q.eq("id", args.id))
      .first();

    if (!existing) {
      return { success: false, error: "Partner not found" };
    }

    const patch: any = {};
    if (args.pw !== undefined && args.pw.trim() !== "") patch.pw = args.pw;
    if (args.phone !== undefined) patch.phone = args.phone;
    if (args.email !== undefined) patch.email = args.email;
    if (args.companyName !== undefined) patch.companyName = args.companyName;
    if (args.bankName !== undefined) patch.bankName = args.bankName;
    if (args.accountNumber !== undefined) patch.accountNumber = args.accountNumber;
    if (args.accountHolder !== undefined) patch.accountHolder = args.accountHolder;

    await ctx.db.patch(existing._id, patch);
    return { success: true };
  },
});

// 12. 초기 파트너 및 가맹점 매핑 시드 데이터 생성
export const seedPartners = mutation({
  args: {},
  handler: async (ctx) => {
    const existingPartners = await ctx.db.query("partners").collect();
    if (existingPartners.length === 0) {
      const defaultPartners = [
        {
          id: "partner1",
          pw: "partner1234",
          name: "김영업",
          phone: "010-8888-1234",
          email: "sales1@120pie.com",
          companyName: "와우프랜차이즈에이전시",
          bankName: "국민은행",
          accountNumber: "9876-5432-109876",
          accountHolder: "김영업",
          commissionPerBox: 8000,
          status: "활동중",
          regDate: "2026-04-01",
          memo: "수도권 권역 가맹점 유치 전문 파트너",
        },
        {
          id: "partner2",
          pw: "partner1234",
          name: "이지훈",
          phone: "010-7777-5678",
          email: "sales2@120pie.com",
          companyName: "제이파트너스",
          bankName: "신한은행",
          accountNumber: "110-222-333444",
          accountHolder: "이지훈",
          commissionPerBox: 8000,
          status: "활동중",
          regDate: "2026-05-10",
          memo: "영남권 가맹점 유치 전문 파트너",
        },
      ];

      for (const p of defaultPartners) {
        await ctx.db.insert("partners", p);
      }

      // 기존 가맹점들에 파트너 매핑 (강남역삼점: partner1, 부산서면점: partner2)
      const stores = await ctx.db.query("stores").collect();
      for (const store of stores) {
        if (store.id === "owner" || store.name.includes("강남")) {
          await ctx.db.patch(store._id, { partnerId: "partner1" });
        } else if (store.id === "seomyeon" || store.name.includes("서면")) {
          await ctx.db.patch(store._id, { partnerId: "partner2" });
        } else if (!store.partnerId) {
          await ctx.db.patch(store._id, { partnerId: "partner1" });
        }
      }

      return { success: true, seeded: true };
    }
    return { success: false, alreadySeeded: true };
  },
});
