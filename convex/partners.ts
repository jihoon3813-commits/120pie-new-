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

/**
 * 파트너 정산금(수수료) 산정 대상 주문 판별 헬퍼
 * - 주문 취소 및 결제 대기 건은 제외
 * - 무통장입금(bank, cash 등)인 경우: "입금대기" 상태는 반영하지 않으며,
 *   관리자가 주문/배송관리에서 "입금확인완료"(또는 배송준비중, 배송중, 배송완료, 결제완료, 주문완료)로 처리했을 때만 정산금에 반영
 * - 카드 등 일반 결제: "결제대기", "입금대기" 상태 제외 ("결제완료", "주문완료", "배송준비중", "배송중", "배송완료" 반영)
 */
export function isSettlementEligibleOrder(order: any): boolean {
  if (!order || !order.status) return false;

  const status = String(order.status).trim();

  // 주문취소 및 결제대기는 무조건 정산 제외
  if (status === "주문취소" || status === "결제대기") {
    return false;
  }

  const rawPay = String(order.payMethod || "").trim().toLowerCase();
  const isBankTransfer =
    rawPay === "bank" ||
    rawPay === "cash" ||
    rawPay === "vbank" ||
    order.payMethod === "무통장입금" ||
    order.payMethod === "무통장" ||
    order.payMethod === "계좌이체" ||
    status === "입금대기" ||
    status === "입금확인완료";

  if (isBankTransfer) {
    // 무통장입금인 경우: "입금대기" 상태는 정산금에 반영하지 않고,
    // 관리자가 "입금확인완료" (또는 이후 배송 단계)로 처리했을 때만 정산에 반영
    const validBankStatuses = [
      "입금확인완료",
      "배송준비중",
      "배송중",
      "배송완료",
      "결제완료",
      "주문완료",
    ];
    return validBankStatuses.includes(status);
  }

  // 카드 결제 등 일반 결제: 입금대기 상태 제외
  if (status === "입금대기") {
    return false;
  }

  return true;
}

// 1. 전체 파트너 리스트 조회 (유치 가맹점 수, 당월/누적 생지 박스 수 및 수수료 집계 + 상위/하위 파트너 계층 정보 포함)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const partners = await ctx.db.query("partners").collect();
    const stores = await ctx.db.query("stores").collect();
    const orders = await ctx.db.query("orders").collect();

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const partnerMap = new Map(partners.map((p) => [p.id, p]));

    const results = partners.map((p) => {
      // 해당 파트너가 유치한 가맹점들
      const myStores = stores.filter((s) => s.partnerId === p.id);
      const myStoreIds = new Set(myStores.map((s) => s.id));

      // 해당 가맹점들의 유효 주문 내역 (무통장입금은 입금확인완료 이상만 정산 반영)
      const validOrders = orders.filter(
        (o) => o.storeId && myStoreIds.has(o.storeId) && isSettlementEligibleOrder(o)
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

      // 상위 파트너 정보 매핑
      const parentPartner = p.parentId ? partnerMap.get(p.parentId) : null;
      const parentInfo = parentPartner
        ? {
            id: parentPartner.id,
            name: parentPartner.name,
            companyName: parentPartner.companyName,
            level: parentPartner.level || 1,
            tierName: parentPartner.tierName || "총판(1차)",
          }
        : null;

      // 직속 하위 파트너들
      const directChildren = partners
        .filter((sub) => sub.parentId === p.id)
        .map((sub) => ({
          id: sub.id,
          name: sub.name,
          companyName: sub.companyName,
          level: sub.level || (p.level ? p.level + 1 : 2),
          tierName: sub.tierName || "지사(2차)",
          status: sub.status,
          phone: sub.phone,
        }));

      const computedLevel = p.level || (p.parentId ? 2 : 1);
      const computedTierName =
        p.tierName ||
        (computedLevel === 1 ? "총판(1차)" : computedLevel === 2 ? "지사(2차)" : `${computedLevel}차 파트너`);

      return {
        ...p,
        level: computedLevel,
        tierName: computedTierName,
        grade: p.grade || 1,
        parentPartner: parentInfo,
        subPartnersCount: directChildren.length,
        childPartners: directChildren,
        storesCount: myStores.length,
        totalBoxes,
        currentMonthBoxes,
        totalCommission,
        currentMonthCommission,
      };
    });

    // 4) 트리 계층 순서로 재배열 (최상위 파트너 바로 밑에 해당 하위 파트너들이 재귀적으로 붙도록)
    const topLevelPartners = results
      .filter((p) => !p.parentId || p.level === 1)
      .sort((a, b) => b.regDate.localeCompare(a.regDate));

    const childrenMap = new Map<string, typeof results>();
    for (const p of results) {
      if (p.parentId && p.level !== 1) {
        const list = childrenMap.get(p.parentId) || [];
        list.push(p);
        childrenMap.set(p.parentId, list);
      }
    }

    const treeOrdered: typeof results = [];
    const traverse = (parent: any) => {
      treeOrdered.push(parent);
      const children = (childrenMap.get(parent.id) || []).sort(
        (a, b) => (a.level || 1) - (b.level || 1) || b.regDate.localeCompare(a.regDate)
      );
      for (const child of children) {
        traverse(child);
      }
    };

    for (const top of topLevelPartners) {
      traverse(top);
    }

    // 혹시 상위 파트너 ID가 삭제되었거나 매핑되지 않은 고아 하위 파트너가 있다면 뒤에 추가
    const addedIds = new Set(treeOrdered.map((p) => p.id));
    for (const p of results) {
      if (!addedIds.has(p.id)) {
        treeOrdered.push(p);
      }
    }

    return treeOrdered;
  },
});

// 2. 단일 파트너 상세 조회 (ID 기준)
export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const partner = await ctx.db
      .query("partners")
      .withIndex("by_partner_id", (q) => q.eq("id", args.id))
      .first();

    if (!partner) return null;

    let parentInfo = null;
    if (partner.parentId) {
      const parent = await ctx.db
        .query("partners")
        .withIndex("by_partner_id", (q) => q.eq("id", partner.parentId!))
        .first();
      if (parent) {
        parentInfo = {
          id: parent.id,
          name: parent.name,
          companyName: parent.companyName,
          level: parent.level || 1,
          tierName: parent.tierName || "총판(1차)",
        };
      }
    }

    const computedLevel = partner.level || (partner.parentId ? 2 : 1);
    const computedTierName =
      partner.tierName ||
      (computedLevel === 1 ? "총판(1차)" : computedLevel === 2 ? "지사(2차)" : `${computedLevel}차 파트너`);

    return {
      ...partner,
      level: computedLevel,
      tierName: computedTierName,
      grade: partner.grade || 1,
      parentPartner: parentInfo,
    };
  },
});

// 3. 파트너 신규 등록 또는 정보 수정 (본사 어드민용 - 상위 파트너 및 레벨 지정 포함)
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
    parentId: v.optional(v.string()), // 상위 파트너 ID
    level: v.optional(v.number()), // 파트너 레벨 (1, 2, 3...)
    tierName: v.optional(v.string()), // 직급/티어명 (예: "총판", "지사", "대리점")
    grade: v.optional(v.number()), // 파트너 가격 정책 등급 (1~5등급)
  },
  handler: async (ctx, args) => {
    // 본인을 상위 파트너로 지정하는 순환 오류 방어
    const safeParentId = args.parentId && args.parentId !== args.id ? args.parentId : undefined;

    let computedLevel = args.level;
    let computedTierName = args.tierName;

    if (safeParentId) {
      const parent = await ctx.db
        .query("partners")
        .withIndex("by_partner_id", (q) => q.eq("id", safeParentId))
        .first();

      if (parent) {
        const parentLevel = parent.level || 1;
        computedLevel = computedLevel || parentLevel + 1;
      } else {
        computedLevel = computedLevel || 2;
      }

      if (!computedTierName || computedTierName.trim() === "") {
        computedTierName = computedLevel === 2 ? "지사(2차)" : computedLevel === 3 ? "대리점(3차)" : `${computedLevel}차 파트너`;
      }
    } else {
      computedLevel = computedLevel || 1;
      if (!computedTierName || computedTierName.trim() === "") {
        computedTierName = "총판(1차)";
      }
    }

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
      parentId: safeParentId,
      level: computedLevel,
      tierName: computedTierName,
      grade: args.grade || 1,
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
        (o) => o.storeId === s.id && isSettlementEligibleOrder(o)
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
      if (ord.status === "주문취소" || ord.status === "결제대기") return false;
      return true;
    });

    // 3) 주문별 패스트리 생지 박스 수 및 수수료 계산
    const enrichedOrders = filtered.map((ord) => {
      const isEligible = isSettlementEligibleOrder(ord);
      let rawPastryDoughBoxes = 0;
      const itemsWithDoughFlag = (ord.items || []).map((item) => {
        const isDough = isPastryDoughItem(item.productName);
        if (isDough) {
          rawPastryDoughBoxes += item.quantity || 0;
        }
        return {
          ...item,
          isPastryDough: isDough,
        };
      });

      // 정산금 산정 조건(무통장입금은 입금확인완료 이상) 충족 시에만 박스 수 및 수수료 반영
      const pastryDoughBoxes = isEligible ? rawPastryDoughBoxes : 0;
      const commission = pastryDoughBoxes * 8000;

      return {
        ...ord,
        storeName: storeMap.get(ord.storeId || "") || "가맹점",
        items: itemsWithDoughFlag,
        rawPastryDoughBoxes,
        pastryDoughBoxes,
        commission,
        isSettlementEligible: isEligible,
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
      if (!ord.storeId || !myStoreIds.has(ord.storeId) || !isSettlementEligibleOrder(ord)) continue;

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
        // 해당 월의 주문들에서 생지 박스수 실시간 계산 (정산 대상 주문만 반영)
        const monthOrders = orders.filter(
          (o) =>
            o.storeId &&
            myStoreIds.has(o.storeId) &&
            isSettlementEligibleOrder(o) &&
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

// 12. 특정 파트너의 하위 파트너 목록 조회 (직속 및 하위 전체 재귀 탐색)
export const getSubPartners = query({
  args: { partnerId: v.string() },
  handler: async (ctx, args) => {
    const allPartners = await ctx.db.query("partners").collect();
    const partnerMap = new Map(allPartners.map((p) => [p.id, p]));

    const subPartners: any[] = [];
    const queue = [args.partnerId];
    const visited = new Set<string>([args.partnerId]);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const directChildren = allPartners.filter((p) => p.parentId === currentId);
      for (const child of directChildren) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          const parent = child.parentId ? partnerMap.get(child.parentId) : null;
          const computedLevel = child.level || (parent?.level ? parent.level + 1 : 2);
          const computedTierName =
            child.tierName ||
            (computedLevel === 2 ? "지사(2차)" : computedLevel === 3 ? "대리점(3차)" : `${computedLevel}차 파트너`);

          subPartners.push({
            ...child,
            level: computedLevel,
            tierName: computedTierName,
            isDirectChild: child.parentId === args.partnerId,
            parentName: parent?.name || "상위 파트너",
          });
          queue.push(child.id);
        }
      }
    }

    return subPartners.sort((a, b) => (a.level || 1) - (b.level || 1) || b.regDate.localeCompare(a.regDate));
  },
});

// 13. 상위 파트너 전용: 하위 파트너들의 활동 종합 모니터링 쿼리 (가맹점 유치, 주문/발주, 상담, 실적)
export const getSubPartnerActivities = query({
  args: { partnerId: v.string() },
  handler: async (ctx, args) => {
    const allPartners = await ctx.db.query("partners").collect();
    const partnerMap = new Map(allPartners.map((p) => [p.id, p]));

    // 1) 하위 파트너 추출 (직속 및 하위 전체 재귀)
    const subPartners: any[] = [];
    const queue = [args.partnerId];
    const visited = new Set<string>([args.partnerId]);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const directChildren = allPartners.filter((p) => p.parentId === currentId);
      for (const child of directChildren) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          subPartners.push(child);
          queue.push(child.id);
        }
      }
    }

    if (subPartners.length === 0) {
      return {
        subPartners: [],
        stores: [],
        orders: [],
        inquiries: [],
        summary: {
          subPartnerCount: 0,
          totalStoresCount: 0,
          currentMonthBoxes: 0,
          totalBoxes: 0,
          inquiryCount: 0,
        },
      };
    }

    const subPartnerIds = new Set(subPartners.map((p) => p.id));
    const subPartnerMap = new Map(subPartners.map((p) => [p.id, p]));

    // 2) 가맹점 및 주문 데이터
    const allStores = await ctx.db.query("stores").collect();
    const allOrders = await ctx.db.query("orders").collect();
    const allInquiries = await ctx.db.query("inquiries").collect();

    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // 하위 파트너 ID 집합
    const subStoreIdToPartnerMap = new Map<string, any>();

    // 2-1) 하위 파트너 가맹점들의 전체 주문/구매 내역 추출
    let currentMonthBoxesSum = 0;
    let totalBoxesSum = 0;

    const subStoresRaw = allStores.filter((s) => s.partnerId && subPartnerIds.has(s.partnerId));
    const subStoreIds = new Set(subStoresRaw.map((s) => s.id));

    for (const s of subStoresRaw) {
      const ownerPartner = subPartnerMap.get(s.partnerId!);
      subStoreIdToPartnerMap.set(s.id, {
        storeName: s.name,
        storeOwner: s.owner,
        storePhone: s.phone,
        partnerId: s.partnerId,
        partnerName: ownerPartner?.name || "하위 파트너",
        partnerCompany: ownerPartner?.companyName || "",
        partnerPhone: ownerPartner?.phone || "",
        partnerLevel: ownerPartner?.level || 2,
        partnerTierName: ownerPartner?.tierName || "지사(2차)",
      });
    }

    const subOrders = allOrders
      .filter((o) => o.storeId && subStoreIds.has(o.storeId))
      .map((ord) => {
        const storeInfo = subStoreIdToPartnerMap.get(ord.storeId || "") || {};
        const isEligible = isSettlementEligibleOrder(ord);

        let rawDoughBoxes = 0;
        const itemsWithFlags = (ord.items || []).map((it: any) => {
          const isDough = isPastryDoughItem(it.productName);
          if (isDough) {
            rawDoughBoxes += it.quantity || 0;
          }
          return {
            ...it,
            isPastryDough: isDough,
          };
        });

        const doughBoxes = isEligible ? rawDoughBoxes : 0;
        if (isEligible) {
          totalBoxesSum += doughBoxes;
          if (ord.date && ord.date.startsWith(currentYearMonth)) {
            currentMonthBoxesSum += doughBoxes;
          }
        }

        return {
          ...ord,
          items: itemsWithFlags,
          rawDoughBoxes,
          doughBoxes,
          isSettlementEligible: isEligible,
          storeName: storeInfo.storeName || "가맹점",
          storeOwner: storeInfo.storeOwner || "",
          storePhone: storeInfo.storePhone || "",
          partnerId: storeInfo.partnerId || "",
          partnerName: storeInfo.partnerName || "하위 파트너",
          partnerCompany: storeInfo.partnerCompany || "",
          partnerTierName: storeInfo.partnerTierName || "지사(2차)",
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    // 2-2) 하위 파트너들이 유치한 가맹점별 상세 구매 실적 집계
    const subStores = subStoresRaw
      .map((s) => {
        const ownerPartner = subPartnerMap.get(s.partnerId!);
        const storeOrders = subOrders.filter((o) => o.storeId === s.id);
        const validStoreOrders = storeOrders.filter((o) => o.isSettlementEligible);

        let totalDoughBoxes = 0;
        let monthDoughBoxes = 0;
        let totalOrderAmount = 0;

        for (const ord of validStoreOrders) {
          totalDoughBoxes += ord.doughBoxes || 0;
          if (ord.date && ord.date.startsWith(currentYearMonth)) {
            monthDoughBoxes += ord.doughBoxes || 0;
          }
        }

        for (const ord of storeOrders) {
          if (ord.status !== "주문취소") {
            totalOrderAmount += ord.totalPrice || 0;
          }
        }

        const sortedOrders = [...storeOrders].sort((a, b) => b.date.localeCompare(a.date));
        const latestOrder = sortedOrders[0] || null;

        return {
          ...s,
          partnerName: ownerPartner?.name || "하위 파트너",
          partnerCompany: ownerPartner?.companyName || "",
          partnerPhone: ownerPartner?.phone || "",
          partnerLevel: ownerPartner?.level || 2,
          partnerTierName: ownerPartner?.tierName || "지사(2차)",
          totalOrdersCount: storeOrders.length,
          totalOrderAmount,
          totalDoughBoxes,
          monthDoughBoxes,
          latestOrderDate: latestOrder ? latestOrder.date : "-",
          orders: sortedOrders,
        };
      })
      .sort((a, b) => b.regDate.localeCompare(a.regDate));

    // 하위 파트너들의 상담 문의 내역
    const subInquiries = allInquiries
      .filter((inq) => inq.partnerId && subPartnerIds.has(inq.partnerId))
      .map((inq) => {
        const p = subPartnerMap.get(inq.partnerId!);
        return {
          ...inq,
          partnerName: p?.name || inq.partnerName || "하위 파트너",
          partnerCompany: p?.companyName || inq.partnerCompany || "",
          partnerTierName: p?.tierName || "지사(2차)",
        };
      })
      .sort((a, b) => b.regDate.localeCompare(a.regDate));

    // 하위 파트너별 개별 실적 집계
    const enrichedSubPartners = subPartners.map((p) => {
      const pStores = subStores.filter((s) => s.partnerId === p.id);
      const pStoreIds = new Set(pStores.map((s) => s.id));

      const pOrders = subOrders.filter((o) => o.storeId && pStoreIds.has(o.storeId));
      let pMonthBoxes = 0;
      let pTotalBoxes = 0;

      for (const ord of pOrders) {
        pTotalBoxes += ord.doughBoxes || 0;
        if (ord.date && ord.date.startsWith(currentYearMonth)) {
          pMonthBoxes += ord.doughBoxes || 0;
        }
      }

      const parent = p.parentId ? partnerMap.get(p.parentId) : null;
      const computedLevel = p.level || (parent?.level ? parent.level + 1 : 2);
      const computedTierName =
        p.tierName ||
        (computedLevel === 2 ? "지사(2차)" : computedLevel === 3 ? "대리점(3차)" : `${computedLevel}차 파트너`);

      return {
        ...p,
        level: computedLevel,
        tierName: computedTierName,
        parentName: parent?.name || "상위 파트너",
        isDirectChild: p.parentId === args.partnerId,
        storesCount: pStores.length,
        currentMonthBoxes: pMonthBoxes,
        totalBoxes: pTotalBoxes,
        currentMonthCommission: pMonthBoxes * (p.commissionPerBox || 8000),
      };
    });

    return {
      subPartners: enrichedSubPartners.sort((a, b) => (a.level || 1) - (b.level || 1) || b.currentMonthBoxes - a.currentMonthBoxes),
      stores: subStores.sort((a, b) => b.regDate.localeCompare(a.regDate)),
      orders: subOrders,
      inquiries: subInquiries,
      summary: {
        subPartnerCount: subPartners.length,
        totalStoresCount: subStores.length,
        currentMonthBoxes: currentMonthBoxesSum,
        totalBoxes: totalBoxesSum,
        inquiryCount: subInquiries.length,
      },
    };
  },
});

// 14. 초기 파트너 및 가맹점 매핑 시드 데이터 생성 (상위/하위 계층 지원)
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
          memo: "수도권 권역 가맹점 유치 전문 총판 파트너",
          level: 1,
          tierName: "총판(1차)",
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
          memo: "영남권 가맹점 유치 지사 파트너 (김영업 총판 산하)",
          parentId: "partner1",
          level: 2,
          tierName: "지사(2차)",
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

    // 기존 파트너가 있는 경우 레벨 및 계층 데이터 보정
    let patchCount = 0;
    for (const p of existingPartners) {
      const patch: any = {};
      if (p.level === undefined) {
        patch.level = p.parentId ? 2 : 1;
      }
      if (!p.tierName) {
        patch.tierName = patch.level === 1 || (!p.parentId && !patch.level) ? "총판(1차)" : "지사(2차)";
      }
      // 만약 partner2에 parentId가 없다면 partner1을 상위로 연계
      if (p.id === "partner2" && !p.parentId) {
        patch.parentId = "partner1";
        patch.level = 2;
        patch.tierName = "지사(2차)";
      }
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(p._id, patch);
        patchCount++;
      }
    }

    return { success: true, alreadySeeded: true, patched: patchCount };
  },
});
