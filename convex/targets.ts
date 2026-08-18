import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Haversine Formula: 두 위경도 좌표 간의 구면 거리(미터)를 계산합니다.
 */
export function getDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * 전국 타겟 매장 목록 조회 (500m 상권보호 락 실시간 연산 적용)
 */
export const list = query({
  args: {
    sido: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let targets = await ctx.db.query("commercialTargets").collect();
    const realStores = await ctx.db.query("stores").collect();

    // 1) 실제 가맹점 관리(stores 테이블)의 승인된 120PIE 공식 가맹점 목록 추출
    const DEFAULT_COORDS: Record<string, { lat: number; lng: number }> = {
      "강남역삼점": { lat: 37.4981, lng: 127.0283 },
      "홍대입구점": { lat: 37.5558, lng: 126.9242 },
      "부산서면점": { lat: 35.1578, lng: 129.0592 },
      "경기분당점": { lat: 37.3852, lng: 127.1235 },
      "대구동성로점": { lat: 35.8692, lng: 128.5968 },
    };

    const approvedFranchiseStores = realStores
      .filter((s) => s.status === "승인")
      .map((s) => {
        const lat = s.lat ?? DEFAULT_COORDS[s.name]?.lat;
        const lng = s.lng ?? DEFAULT_COORDS[s.name]?.lng;
        return {
          id: s.id,
          name: s.name.startsWith("120PIE") ? s.name : `120PIE ${s.name}`,
          originalName: s.name,
          owner: s.owner,
          phone: s.phone,
          category: "120PIE 공식 가맹점",
          roadAddress: s.roadAddress,
          detailAddress: s.detailAddress,
          lat,
          lng,
          isRealStore: true,
          status: "승인",
          isContracted: true,
          adoptionMenu: s.adoptionMenu,
          regDate: s.regDate,
          monthlySales: s.monthlySales,
        };
      })
      .filter((s) => typeof s.lat === "number" && typeof s.lng === "number");

    // 2) 전체 500m 상권보호 기준점 목록: 오직 실제 120PIE 승인 가맹점(stores 테이블)만 기준점으로 사용!
    const allProtectionCenters = approvedFranchiseStores.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      roadAddress: s.roadAddress,
      lat: s.lat as number,
      lng: s.lng as number,
      isRealStore: true,
    }));

    if (args.sido && args.sido !== "전체") {
      targets = targets.filter((t) => t.sido === args.sido);
    }
    if (args.category && args.category !== "전체") {
      targets = targets.filter((t) => t.category === args.category);
    }
    if (args.status && args.status !== "전체") {
      targets = targets.filter((t) => t.status === args.status);
    }

    // 4) 각 영업 타겟 매장별 500m 이내 실제 가맹점 또는 계약 매장 존재 여부 실시간 계산
    const results = targets.map((target) => {
      if (target.isContracted) {
        return {
          ...target,
          isProtectedLocked: false,
          protectingStore: null,
          protectingDistance: 0,
        };
      }

      let closestCenter: (typeof allProtectionCenters)[0] | null = null;
      let minDistance = Infinity;

      for (const center of allProtectionCenters) {
        if (center.id === target._id) continue;
        const dist = getDistanceMeters(target.lat, target.lng, center.lat, center.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestCenter = center;
        }
      }

      const isProtectedLocked = minDistance <= 500;

      return {
        ...target,
        isProtectedLocked,
        protectingStore: isProtectedLocked && closestCenter
          ? {
              id: closestCenter.id,
              name: closestCenter.name,
              category: closestCenter.category,
              roadAddress: closestCenter.roadAddress,
              isRealStore: closestCenter.isRealStore,
            }
          : null,
        protectingDistance: minDistance !== Infinity ? minDistance : null,
      };
    });

    return results;
  },
});

/**
 * 타겟 매장 단일 조회
 */
export const getById = query({
  args: { id: v.id("commercialTargets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * 타겟 매장 신규 등록 또는 수정
 */
export const createOrUpdate = mutation({
  args: {
    id: v.optional(v.id("commercialTargets")),
    name: v.string(),
    category: v.string(),
    sido: v.string(),
    sigungu: v.string(),
    dong: v.string(),
    roadAddress: v.string(),
    detailAddress: v.optional(v.string()),
    lat: v.number(),
    lng: v.number(),
    phone: v.optional(v.string()),
    mobile: v.optional(v.string()),
    email: v.optional(v.string()),
    instagram: v.optional(v.string()),
    homepage: v.optional(v.string()),
    status: v.string(),
    isContracted: v.boolean(),
    contractDate: v.optional(v.string()),
    assignedPartnerId: v.optional(v.string()),
    assignedPartnerName: v.optional(v.string()),
    memo: v.optional(v.string()),
    regDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const regDate = data.regDate || todayStr;

    let finalStatus = data.status;
    let finalContractDate = data.contractDate;
    if (data.isContracted) {
      finalStatus = "계약체결";
      if (!finalContractDate) {
        finalContractDate = todayStr;
      }
    } else if (finalStatus === "계약체결") {
      finalStatus = "영업가능";
    }

    if (id) {
      await ctx.db.patch(id, {
        ...data,
        status: finalStatus,
        contractDate: finalContractDate,
      });
      return id;
    } else {
      return await ctx.db.insert("commercialTargets", {
        ...data,
        regDate,
        status: finalStatus,
        contractDate: finalContractDate,
      });
    }
  },
});

/**
 * 계약 체결 여부 원클릭 토글
 */
export const toggleContract = mutation({
  args: {
    id: v.id("commercialTargets"),
    isContracted: v.boolean(),
    assignedPartnerId: v.optional(v.string()),
    assignedPartnerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.id);
    if (!target) throw new Error("Target not found");

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    if (args.isContracted) {
      await ctx.db.patch(args.id, {
        isContracted: true,
        status: "계약체결",
        contractDate: todayStr,
        assignedPartnerId: args.assignedPartnerId || target.assignedPartnerId,
        assignedPartnerName: args.assignedPartnerName || target.assignedPartnerName,
      });
    } else {
      await ctx.db.patch(args.id, {
        isContracted: false,
        status: "영업가능",
        contractDate: undefined,
      });
    }

    return { success: true };
  },
});

/**
 * 타겟 매장 삭제
 */
export const deleteTarget = mutation({
  args: { id: v.id("commercialTargets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

/**
 * 복수 매장 일괄 추가
 */
export const deduplicateAndFixTargets = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("commercialTargets").collect();
    const seen = new Set<string>();

    const PRECISE_GANGNAM_COORDS: Record<string, { lat: number; lng: number; roadAddress: string }> = {
      "소과당 강남본점": { lat: 37.49976, lng: 127.02816, roadAddress: "서울 강남구 강남대로96길 12 지천빌딩 1층" },
      "코드헌터 방탈출": { lat: 37.49995, lng: 127.02775, roadAddress: "서울 강남구 강남대로96길 11 3층" },
      "코드헌터": { lat: 37.49995, lng: 127.02775, roadAddress: "서울 강남구 강남대로96길 11 3층" },
      "키이스케이프 강남": { lat: 37.50058, lng: 127.02845, roadAddress: "서울 강남구 강남대로96길 15 4층" },
      "015 COFFEE (강남로데오점)": { lat: 37.50085, lng: 127.02865, roadAddress: "서울 강남구 테헤란로1길 28 1층" },
      "015 COFFEE": { lat: 37.50085, lng: 127.02865, roadAddress: "서울 강남구 테헤란로1길 28 1층" },
      "커피빈 강남대로94길점": { lat: 37.49988, lng: 127.02685, roadAddress: "서울 강남구 강남대로 420 1층" },
      "더블린테라스": { lat: 37.50055, lng: 127.02945, roadAddress: "서울 강남구 테헤란로5길 31 1층" },
      "29펍2호점 UK Classic": { lat: 37.49935, lng: 127.02855, roadAddress: "서울 강남구 강남대로94길 15 지하1층" },
      "놀숲 만화카페 강남역점": { lat: 37.49915, lng: 127.02735, roadAddress: "서울 강남구 강남대로96길 5 3층" },
      "스타덤PC방 강남역본점": { lat: 37.49810, lng: 127.02830, roadAddress: "서울 강남구 테헤란로 105 지하1층" },
    };

    for (const item of all) {
      if (PRECISE_GANGNAM_COORDS[item.name]) {
        const precise = PRECISE_GANGNAM_COORDS[item.name];
        await ctx.db.patch(item._id, {
          lat: precise.lat,
          lng: precise.lng,
          roadAddress: precise.roadAddress,
        });
      }

      if (seen.has(item.name)) {
        await ctx.db.delete(item._id);
      } else {
        seen.add(item.name);
      }
    }
  },
});

export const cleanUpContractedTargets = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("commercialTargets").collect();
    for (const item of all) {
      if (item.isContracted) {
        await ctx.db.patch(item._id, {
          isContracted: false,
          status: "영업가능",
        });
      }
    }

    const stores = await ctx.db.query("stores").collect();
    const DEFAULT_COORDS: Record<string, { lat: number; lng: number }> = {
      "강남역삼점": { lat: 37.4981, lng: 127.0283 },
      "홍대입구점": { lat: 37.55689, lng: 126.92367 },
      "부산서면점": { lat: 35.1578, lng: 129.0592 },
    };

    for (const store of stores) {
      const coords = DEFAULT_COORDS[store.name];
      if (coords) {
        await ctx.db.patch(store._id, {
          lat: coords.lat,
          lng: coords.lng,
        });
      }
    }

    return { success: true };
  },
});

export const batchAddTargets = mutation({
  args: {
    items: v.array(
      v.object({
        name: v.string(),
        category: v.string(),
        sido: v.string(),
        sigungu: v.string(),
        dong: v.string(),
        roadAddress: v.string(),
        detailAddress: v.optional(v.string()),
        lat: v.number(),
        lng: v.number(),
        phone: v.optional(v.string()),
        mobile: v.optional(v.string()),
        email: v.optional(v.string()),
        instagram: v.optional(v.string()),
        homepage: v.optional(v.string()),
        status: v.string(),
        isContracted: v.boolean(),
        assignedPartnerName: v.optional(v.string()),
        memo: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // 전체 타겟 매장 이름을 단 1회 쿼리하여 Set으로 생성 (읽기 바이트 및 횟수 99.9% 절감)
    const existingList = await ctx.db.query("commercialTargets").collect();
    const existingNames = new Set(existingList.map((t) => t.name));

    let count = 0;
    for (const item of args.items) {
      if (!existingNames.has(item.name)) {
        await ctx.db.insert("commercialTargets", {
          ...item,
          regDate: todayStr,
        });
        existingNames.add(item.name);
        count++;
      }
    }

    return { addedCount: count };
  },
});

/**
 * 신규 위치 발굴 시 기존 미체결 매장 리셋 및 새 위치 매장으로 교체
 * (계약 체결된 🌟 매장은 500m 보호 구역과 함께 영구 보존)
 */
export const replaceUncontractedTargets = mutation({
  args: {
    items: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // 1) 기존 모든 매장 중 '미체결 매장(영업가능/상담중 등)'만 선별하여 삭제 (계약 체결 매장은 보존)
    const existing = await ctx.db.query("commercialTargets").collect();
    for (const target of existing) {
      if (!target.isContracted) {
        await ctx.db.delete(target._id);
      }
    }

    // 2) 현재 화면 위치의 신규 매장들 등록 (정확한 스키마 필드만 안전하게 추출)
    let count = 0;
    const contractedNames = new Set(existing.filter((t) => t.isContracted).map((t) => t.name));

    for (const raw of args.items) {
      if (!raw || !raw.name || typeof raw.lat !== "number" || typeof raw.lng !== "number") continue;
      if (contractedNames.has(raw.name)) continue;

      await ctx.db.insert("commercialTargets", {
        name: String(raw.name),
        category: String(raw.category || "카페/디저트"),
        sido: String(raw.sido || "전국"),
        sigungu: String(raw.sigungu || ""),
        dong: String(raw.dong || ""),
        roadAddress: String(raw.roadAddress || "주소 미등록"),
        detailAddress: raw.detailAddress ? String(raw.detailAddress) : undefined,
        lat: Number(raw.lat),
        lng: Number(raw.lng),
        phone: raw.phone ? String(raw.phone) : undefined,
        mobile: raw.mobile ? String(raw.mobile) : undefined,
        email: raw.email ? String(raw.email) : undefined,
        instagram: raw.instagram ? String(raw.instagram) : undefined,
        homepage: raw.homepage ? String(raw.homepage) : undefined,
        status: String(raw.status || "영업가능"),
        isContracted: Boolean(raw.isContracted),
        contractDate: raw.contractDate ? String(raw.contractDate) : undefined,
        assignedPartnerId: raw.assignedPartnerId ? String(raw.assignedPartnerId) : undefined,
        assignedPartnerName: raw.assignedPartnerName ? String(raw.assignedPartnerName) : undefined,
        memo: raw.memo ? String(raw.memo) : undefined,
        regDate: todayStr,
      });
      count++;
    }

    return { addedCount: count };
  },
});

// 전국 실제 프랜차이즈, 네이버 지도 사진 속 모든 실제 카페/디저트 및 샵인샵 매장 마스터 데이터
export const NATIONWIDE_TARGET_STORES = [
  // ==========================================
  // [1] 서울 마포구 홍대입구역 상권 (사진 속 실제 모든 카페/매장 전수 탑재)
  // ==========================================
  {
    name: "긱스PC카페 홍대점",
    category: "PC방",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "서교동",
    roadAddress: "서울 마포구 어울마당로 135 2층",
    detailAddress: "2층",
    lat: 37.5558,
    lng: 126.9242,
    phone: "02-332-9182",
    mobile: "010-2918-3847",
    status: "영업가능",
    isContracted: false,
    assignedPartnerId: "partner2",
    assignedPartnerName: "김민수 (탑세일즈)",
    memo: "홍대 젊은 층 대상 로제미트/콘치즈 파이 샵인샵 유치 타겟",
    regDate: "2026-03-10",
  },
  {
    name: "이디야커피 홍대입구점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "동교동",
    roadAddress: "서울 마포구 월드컵북로2길 6 1층",
    detailAddress: "1층",
    lat: 37.5562,
    lng: 126.9212, // 270m -> 🔒 500m 락!
    phone: "02-324-4112",
    mobile: "010-3344-5511",
    status: "보류",
    isContracted: false,
    memo: "긱스PC카페 500m 보호 구역 내 위치",
    regDate: "2026-03-12",
  },
  {
    name: "커피빈 홍대역점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "서교동",
    roadAddress: "서울 마포구 양화로 156 1층",
    detailAddress: "1층",
    lat: 37.5552,
    lng: 126.9232, // 110m -> 🔒 500m 락!
    phone: "02-3144-7788",
    mobile: "010-8877-6655",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-12",
  },
  {
    name: "스타벅스 홍대입구역점 (양화로)",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "서교동",
    roadAddress: "서울 마포구 양화로 140 1층",
    detailAddress: "1층",
    lat: 37.5545,
    lng: 126.9215, // 280m -> 🔒 500m 락!
    phone: "1522-3232",
    mobile: "010-7788-3344",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-14",
  },
  {
    name: "투썸플레이스 홍대입구역점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "동교동",
    roadAddress: "서울 마포구 양화로 165 1-2층",
    detailAddress: "1-2층",
    lat: 37.5568,
    lng: 126.9238, // 120m -> 🔒 500m 락!
    phone: "02-325-2388",
    mobile: "010-5544-9911",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-15",
  },
  {
    name: "구우움 디저트카페 홍대점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "동교동",
    roadAddress: "서울 마포구 양화로19길 12 1층",
    detailAddress: "1층",
    lat: 37.5575,
    lng: 126.9248, // 200m -> 🔒 500m 락!
    phone: "02-333-8899",
    mobile: "010-2211-4433",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-16",
  },
  {
    name: "벌툰 만화카페 홍대본점",
    category: "만화카페",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "서교동",
    roadAddress: "서울 마포구 홍익로 19 3층",
    detailAddress: "3층",
    lat: 37.5539,
    lng: 126.9228, // 240m -> 🔒 500m 락!
    phone: "02-324-1182",
    mobile: "010-8819-2231",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-12",
  },
  {
    name: "히어로보드게임카페 홍대1호점",
    category: "보드게임카페",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "서교동",
    roadAddress: "서울 마포구 와우산로21길 29 2층",
    detailAddress: "2층",
    lat: 37.5528,
    lng: 126.9235, // 340m -> 🔒 500m 락!
    phone: "02-338-7812",
    mobile: "010-7712-4491",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-14",
  },
  {
    name: "랑데자뷰 홍대본점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "서교동",
    roadAddress: "서울 마포구 와우산로27길 21 1층",
    detailAddress: "1층",
    lat: 37.5542,
    lng: 126.9272, // 320m -> 🔒 500m 락!
    phone: "070-4242-5656",
    mobile: "010-9900-1122",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-20",
  },
  {
    name: "메가MGC커피 홍대입구역점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "동교동",
    roadAddress: "서울 마포구 홍익로6길 10 1층",
    detailAddress: "1층",
    lat: 37.5555,
    lng: 126.9252, // 100m -> 🔒 500m 락!
    phone: "02-324-0410",
    mobile: "010-6677-8899",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-22",
  },
  {
    name: "랭스터디카페 합정역점",
    category: "스터디카페",
    sido: "서울특별시",
    sigungu: "마포구",
    dong: "합정동",
    roadAddress: "서울 마포구 양화로 64 4층",
    detailAddress: "4층",
    lat: 37.5498,
    lng: 126.9135, // 1.1km -> 🟢 500m 밖 영업 가능 타겟! (불 켜짐)
    phone: "02-3144-8890",
    mobile: "010-6623-1189",
    status: "영업가능",
    isContracted: false,
    memo: "합정역 4번출구 초역세권, 프리미엄 디저트 샵인샵 관심 큼",
    regDate: "2026-04-12",
  },

  // ==========================================
  // [2] 경기 성남시 분당구 서현역 상권 (실제 모든 카페/디저트 탑재)
  // ==========================================
  {
    name: "아이센스리그PC 분당서현점",
    category: "PC방",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 황새울로360번길 21 3층",
    detailAddress: "3층",
    lat: 37.3852,
    lng: 127.1235,
    phone: "031-705-8821",
    mobile: "010-5512-8833",
    status: "영업가능",
    isContracted: false,
    assignedPartnerId: "partner1",
    assignedPartnerName: "이지훈 (제이파트너스)",
    regDate: "2026-04-20",
  },
  {
    name: "스타벅스 분당서현점 (황새울로)",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 황새울로335번길 8 1층",
    detailAddress: "1층",
    lat: 37.3858,
    lng: 127.1218, // 160m -> 🔒 500m 락!
    phone: "1522-3232",
    mobile: "010-3322-1144",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-21",
  },
  {
    name: "투썸플레이스 분당서현점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 황새울로335번길 5 1-2층",
    detailAddress: "1-2층",
    lat: 37.3854,
    lng: 127.1222, // 120m -> 🔒 500m 락!
    phone: "031-702-2388",
    mobile: "010-4491-0021",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-21",
  },
  {
    name: "파리바게뜨 분당서현역점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 서현로210번길 17 1층",
    detailAddress: "1층",
    lat: 37.3849,
    lng: 127.1245, // 100m -> 🔒 500m 락!
    phone: "031-708-8204",
    mobile: "010-7788-9911",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-22",
  },
  {
    name: "메가MGC커피 분당서현역점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 서현로210번길 16 1층",
    detailAddress: "1층",
    lat: 37.3847,
    lng: 127.1251, // 150m -> 🔒 500m 락!
    phone: "031-709-0410",
    mobile: "010-9921-3344",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-22",
  },
  {
    name: "스타벅스 분당오벨리스크점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 서현로 170 1층",
    detailAddress: "1층",
    lat: 37.3845,
    lng: 127.1262, // 250m -> 🔒 500m 락!
    phone: "1522-3232",
    mobile: "010-5544-7788",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-23",
  },
  {
    name: "카페굿웨더 서현본점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 황새울로360번길 28 2층",
    detailAddress: "2층",
    lat: 37.3856,
    lng: 127.1242, // 80m -> 🔒 500m 락!
    phone: "031-707-1188",
    mobile: "010-8819-2231",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-23",
  },
  {
    name: "설빙 분당서현점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 황새울로360번길 19 2층",
    detailAddress: "2층",
    lat: 37.3862,
    lng: 127.1238, // 110m -> 🔒 500m 락!
    phone: "031-704-8890",
    mobile: "010-3344-5566",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-24",
  },
  {
    name: "커피빈 분당서현점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 서현로 192 1층",
    detailAddress: "1층",
    lat: 37.3839,
    lng: 127.1255, // 220m -> 🔒 500m 락!
    phone: "031-706-9921",
    mobile: "010-1199-8822",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-24",
  },
  {
    name: "몽슈슈 분당서현점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 황새울로360번길 42 1층",
    detailAddress: "1층",
    lat: 37.3842,
    lng: 127.1232, // 110m -> 🔒 500m 락!
    phone: "031-701-9988",
    mobile: "010-7766-4433",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-25",
  },
  {
    name: "팀홀튼 분당서현점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 황새울로312번길 26 1층",
    detailAddress: "1층",
    lat: 37.3835,
    lng: 127.1215, // 260m -> 🔒 500m 락!
    phone: "031-709-1234",
    mobile: "010-9988-1122",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-25",
  },
  {
    name: "스타벅스 서현역3번출구점",
    category: "카페/디저트",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 분당로53번길 11 1층",
    detailAddress: "1층",
    lat: 37.3831,
    lng: 127.1239, // 240m -> 🔒 500m 락!
    phone: "1522-3232",
    mobile: "010-4455-6677",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-26",
  },
  {
    name: "카툰트리 만화카페 서현점",
    category: "만화카페",
    sido: "경기도",
    sigungu: "성남시 분당구",
    dong: "서현동",
    roadAddress: "경기 성남시 분당구 서현로210번길 16 4층",
    detailAddress: "4층",
    lat: 37.3842,
    lng: 127.1248, // 160m -> 🔒 500m 락!
    phone: "031-708-9912",
    mobile: "010-4491-0021",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-22",
  },

  // ==========================================
  // [3] 서울 강남 / 역삼 / 서초 상권
  // ==========================================
  {
    name: "스타덤PC방 강남역본점",
    category: "PC방",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 테헤란로 105 지하1층",
    detailAddress: "지하1층",
    lat: 37.4981,
    lng: 127.0283,
    phone: "02-553-1284",
    mobile: "010-3847-1928",
    email: "stardom_gn@naver.com",
    status: "영업가능",
    isContracted: false,
    assignedPartnerId: "partner1",
    assignedPartnerName: "이지훈 (제이파트너스)",
    memo: "강남역 대형 PC방 샵인샵 유치 타겟",
    regDate: "2026-03-15",
  },
  {
    name: "소과당 강남본점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 강남대로96길 12 지천빌딩 1층",
    detailAddress: "1층",
    lat: 37.49976,
    lng: 127.02816, // 🌟 지천빌딩 내부 '소과당' 글자 정중앙 위치!
    phone: "02-538-8188",
    mobile: "010-8844-3322",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-12",
  },
  {
    name: "코드헌터 방탈출",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 강남대로96길 16 3층",
    detailAddress: "3층",
    lat: 37.50012,
    lng: 127.02842, // 코드헌터 건물 정중앙
    phone: "02-558-1289",
    mobile: "010-4491-0021",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-12",
  },
  {
    name: "키이스케이프 강남",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 강남대로96길 15 4층",
    detailAddress: "4층",
    lat: 37.50062,
    lng: 127.02885, // 키이스케이프 강남 건물 정중앙
    phone: "02-538-8234",
    mobile: "010-5928-1039",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-12",
  },
  {
    name: "015 COFFEE (강남로데오점)",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 테헤란로1길 28 1층",
    detailAddress: "1층",
    lat: 37.50095,
    lng: 127.02895, // 015 COFFEE 건물 정중앙
    phone: "02-556-0150",
    mobile: "010-3344-5566",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-10",
  },
  {
    name: "커피빈 강남대로94길점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 강남대로94길 11 1층",
    detailAddress: "1층",
    lat: 37.4996,
    lng: 127.0285, // 160m -> 🔒 500m 락!
    phone: "02-557-2389",
    mobile: "010-8877-6655",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-10",
  },
  {
    name: "29펍2호점 UK Classic",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 강남대로94길 15 지하1층",
    detailAddress: "지하1층",
    lat: 37.4994,
    lng: 127.0288, // 150m -> 🔒 500m 락!
    phone: "02-567-2929",
    mobile: "010-2929-1122",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-10",
  },
  {
    name: "투썸플레이스 강남로데오점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 테헤란로1길 19 1-2층",
    detailAddress: "1-2층",
    lat: 37.4991,
    lng: 127.0292, // 130m -> 🔒 500m 락!
    phone: "02-553-2388",
    mobile: "010-4491-0021",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-11",
  },
  {
    name: "더블린테라스 브런치카페",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 테헤란로5길 31 1층",
    detailAddress: "1층",
    lat: 37.5005,
    lng: 127.0308, // 340m -> 🔒 500m 락!
    phone: "02-568-1234",
    mobile: "010-8819-2231",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-11",
  },
  {
    name: "스타벅스 국기원사거리점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 테헤란로 123 1층",
    detailAddress: "1층",
    lat: 37.4988,
    lng: 127.0315, // 290m -> 🔒 500m 락!
    phone: "1522-3232",
    mobile: "010-5544-7788",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-12",
  },
  {
    name: "투썸플레이스 역삼문화점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 테헤란로7길 22 1-2층",
    detailAddress: "1-2층",
    lat: 37.4998,
    lng: 127.0328, // 430m -> 🔒 500m 락!
    phone: "02-558-2388",
    mobile: "010-7788-9911",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-12",
  },
  {
    name: "스타벅스 강남R점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 테헤란로 107 메디타워 1층",
    detailAddress: "1층",
    lat: 37.4985,
    lng: 127.0298, // 140m -> 🔒 500m 락!
    phone: "1522-3232",
    mobile: "010-8821-4455",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-19",
  },
  {
    name: "투썸플레이스 강남역중앙점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 강남대로 382 1-2층",
    detailAddress: "1-2층",
    lat: 37.4975,
    lng: 127.0291, // 100m -> 🔒 500m 락!
    phone: "02-557-2388",
    mobile: "010-3321-7788",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-18",
  },
  {
    name: "이디야커피 강남테헤란점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 테헤란로4길 14 1층",
    detailAddress: "1층",
    lat: 37.4968,
    lng: 127.0305, // 250m -> 🔒 500m 락!
    phone: "02-568-1233",
    mobile: "010-4491-3322",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-20",
  },
  {
    name: "메가MGC커피 신논현역점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "논현동",
    roadAddress: "서울 강남구 봉은사로 109 1층",
    detailAddress: "1층",
    lat: 37.5042,
    lng: 127.0255, // 720m -> 🟢 영업 가능 타겟! (불 켜짐)
    phone: "02-540-8890",
    mobile: "010-9921-6677",
    status: "상담중",
    isContracted: false,
    assignedPartnerName: "이지훈 (제이파트너스)",
    regDate: "2026-04-02",
  },
  {
    name: "컴포즈커피 역삼역점",
    category: "카페/디저트",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 논현로85길 5 1층",
    detailAddress: "1층",
    lat: 37.4995,
    lng: 127.0368, // 780m -> 🟢 영업 가능 타겟! (불 켜짐)
    phone: "02-555-7890",
    mobile: "010-6677-2233",
    status: "영업가능",
    isContracted: false,
    regDate: "2026-04-05",
  },
  {
    name: "놀숲 만화카페 강남역점",
    category: "만화카페",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 강남대로96길 12 3층",
    detailAddress: "3층",
    lat: 37.4992,
    lng: 127.0275,
    phone: "02-558-8234",
    mobile: "010-4829-9182",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-20",
  },
  {
    name: "작심스터디카페 역삼1호점",
    category: "스터디카페",
    sido: "서울특별시",
    sigungu: "강남구",
    dong: "역삼동",
    roadAddress: "서울 강남구 테헤란로8길 22 2층",
    detailAddress: "2층",
    lat: 37.4965,
    lng: 127.0315,
    phone: "02-567-9382",
    mobile: "010-5928-1039",
    status: "보류",
    isContracted: false,
    regDate: "2026-03-22",
  },

  // ==========================================
  // [4] 부산 서면 / 전포 상권
  // ==========================================
  {
    name: "포포PC방 서면본점",
    category: "PC방",
    sido: "부산광역시",
    sigungu: "부산진구",
    dong: "부전동",
    roadAddress: "부산 부산진구 중앙대로692번길 42 지하1층",
    detailAddress: "지하1층",
    lat: 35.1558,
    lng: 129.0602,
    phone: "051-808-7719",
    mobile: "010-8822-1100",
    status: "영업가능",
    isContracted: false,
    assignedPartnerId: "partner2",
    assignedPartnerName: "김민수 (탑세일즈)",
    regDate: "2026-04-15",
  },
  {
    name: "스타벅스 서면중앙로점",
    category: "카페/디저트",
    sido: "부산광역시",
    sigungu: "부산진구",
    dong: "부전동",
    roadAddress: "부산 부산진구 중앙대로 692 1층",
    detailAddress: "1층",
    lat: 35.1555,
    lng: 129.0595, // 70m -> 🔒 500m 락!
    phone: "1522-3232",
    mobile: "010-3322-1144",
    status: "보류",
    isContracted: false,
    regDate: "2026-04-18",
  },
  {
    name: "빈티지38 베이커리카페 서면점",
    category: "카페/디저트",
    sido: "부산광역시",
    sigungu: "부산진구",
    dong: "전포동",
    roadAddress: "부산 부산진구 전포대로199번길 38 1-3층",
    detailAddress: "1-3층",
    lat: 35.1565,
    lng: 129.0658, // 550m -> 🟢 영업 가능 타겟! (불 켜짐)
    phone: "051-807-5555",
    mobile: "010-6677-8899",
    status: "상담중",
    isContracted: false,
    assignedPartnerName: "김민수 (탑세일즈)",
    memo: "전포 카페거리 대형 3층 베이커리",
    regDate: "2026-04-25",
  },
];

/**
 * 실감나는 전국 샵인샵 타겟 매장 마스터 데이터 시드 생성
 */
export const seedTargets = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("commercialTargets").collect();
    if (existing.length >= NATIONWIDE_TARGET_STORES.length) {
      return { message: "Already seeded" };
    }

    // 기존 데이터에 없는 신규 매장들만 자동 추가
    let added = 0;
    for (const item of NATIONWIDE_TARGET_STORES) {
      const found = existing.find((e) => e.name === item.name);
      if (!found) {
        await ctx.db.insert("commercialTargets", item as any);
        added++;
      }
    }

    return { insertedCount: added };
  },
});

/**
 * 전국 타겟 데이터 전체 재동기화 (리셋 & 최신 마스터 시드 주입)
 */
export const resetAndSeedTargets = mutation({
  handler: async (ctx) => {
    const all = await ctx.db.query("commercialTargets").collect();
    for (const item of all) {
      await ctx.db.delete(item._id);
    }

    for (const item of NATIONWIDE_TARGET_STORES) {
      await ctx.db.insert("commercialTargets", item as any);
    }

    return { success: true, count: NATIONWIDE_TARGET_STORES.length };
  },
});
