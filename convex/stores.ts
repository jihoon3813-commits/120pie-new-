import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const AUTHENTIC_STORES = [
  {
    id: "woong777",
    pw: "woong777",
    pwConfirm: "woong777",
    name: "120겹파이 DESSERT",
    owner: "한정웅",
    phone: "010-5354-1534",
    status: "승인",
    roadAddress: "서울 성북구 돌곶이로14길 35 (석관동)",
    detailAddress: "1층",
    lat: 37.608765,
    lng: 127.061682,
    regDate: "2026-07-28",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "120coffee", "핫도그120", "떡볶이120"],
    monthlySales: 12000000,
  },
  {
    id: "w01011208",
    pw: "w01011208",
    pwConfirm: "w01011208",
    name: "카페101",
    owner: "김귀순",
    phone: "010-2323-8002",
    status: "승인",
    roadAddress: "인천 서구 담지로104번길 22 (청라동)",
    detailAddress: "1층",
    lat: 37.538593,
    lng: 126.660898,
    regDate: "2026-07-21",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 8500000,
  },
  {
    id: "tjsdud7275",
    pw: "tjsdud7275",
    pwConfirm: "tjsdud7275",
    name: "120겹 파이 파주운정점",
    owner: "우선영",
    phone: "010-3847-1928",
    status: "승인",
    roadAddress: "경기 파주시 가람로21번길 15-28 (와동동)",
    detailAddress: "",
    lat: 37.734477,
    lng: 126.750681,
    regDate: "2026-07-03",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 9200000,
  },
  {
    id: "su3164",
    pw: "su3164",
    pwConfirm: "su3164",
    name: "120겹 파이 원주혁신도시점",
    owner: "박초현",
    phone: "010-7238-3164",
    status: "승인",
    roadAddress: "강원특별자치도 원주시 웅비1길 11 (반곡동)",
    detailAddress: "",
    lat: 37.329411,
    lng: 127.988081,
    regDate: "2026-06-28",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 11000000,
  },
  {
    id: "alla32",
    pw: "alla32",
    pwConfirm: "alla32",
    name: "120겹 파이 영종하늘도시점",
    owner: "임세희",
    phone: "010-7463-8040",
    status: "승인",
    roadAddress: "인천 중구 하늘달빛로 139 (중산동, e편한세상 영종국제도시센텀베뉴)",
    detailAddress: "777동",
    lat: 37.489996,
    lng: 126.551790,
    regDate: "2026-06-26",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120"],
    monthlySales: 13500000,
  },
  {
    id: "sodam28",
    pw: "sodam28",
    pwConfirm: "sodam28",
    name: "120겹파이 안암점(카페데일리)",
    owner: "한수연",
    phone: "010-5678-1234",
    status: "승인",
    roadAddress: "서울 성북구 고려대로27길 9 (안암동5가)",
    detailAddress: "",
    lat: 37.586727,
    lng: 127.029811,
    regDate: "2026-06-22",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 10500000,
  },
  {
    id: "lovely3381",
    pw: "lovely3381",
    pwConfirm: "lovely3381",
    name: "120겹 파이 잠실점",
    owner: "박다솔",
    phone: "010-3381-4423",
    status: "승인",
    roadAddress: "서울 송파구 삼학사로 73 (삼전동, 은일빌딩)",
    detailAddress: "",
    lat: 37.503810,
    lng: 127.096802,
    regDate: "2026-06-18",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "떡볶이120", "핫도그120", "120coffee"],
    monthlySales: 16800000,
  },
  {
    id: "ktt1222",
    pw: "ktt1222",
    pwConfirm: "ktt1222",
    name: "120겹파이 향동점(다색냥)",
    owner: "김서윤",
    phone: "010-9110-5404",
    status: "승인",
    roadAddress: "경기 고양시 덕양구 꽃내음1길 (향동동)",
    detailAddress: "",
    lat: 37.598769,
    lng: 126.889374,
    regDate: "2026-03-10",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 7800000,
  },
  {
    id: "120ak",
    pw: "120ak",
    pwConfirm: "120ak",
    name: "120겹 파이 AK플라자 금정점",
    owner: "이사근",
    phone: "010-3813-1200",
    status: "승인",
    roadAddress: "경기 군포시 엘에스로 143 (금정동, 힐스테이트 금정역)",
    detailAddress: "",
    lat: 37.372850,
    lng: 126.944923,
    regDate: "2025-02-24",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "떡볶이120", "핫도그120", "츄러스120"],
    monthlySales: 18500000,
  },
  {
    id: "west0220",
    pw: "west0220",
    pwConfirm: "west0220",
    name: "120겹파이 잼인브라운점",
    owner: "서진우",
    phone: "010-4491-8822",
    status: "승인",
    roadAddress: "서울 서초구 남부순환로325길 17 (서초동, 신빌딩)",
    detailAddress: "",
    lat: 37.481984,
    lng: 127.014575,
    regDate: "2026-05-15",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 14200000,
  },
  {
    id: "song4276",
    pw: "song4276",
    pwConfirm: "song4276",
    name: "120겹파이 카페멈점",
    owner: "송지은",
    phone: "010-6721-9933",
    status: "승인",
    roadAddress: "경기 수원시 권선구 호매실로166번길 10 (호매실동, 호매실능실마을22단지)",
    detailAddress: "",
    lat: 37.258486,
    lng: 126.958029,
    regDate: "2026-05-10",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 9800000,
  },
  {
    id: "mm6861",
    pw: "mm6861",
    pwConfirm: "mm6861",
    name: "120겹파이 더네이버커피점",
    owner: "문미숙",
    phone: "010-8833-2211",
    status: "승인",
    roadAddress: "서울 영등포구 버드나루로 13 (영등포동2가, 굿네이버스회관)",
    detailAddress: "",
    lat: 37.519959,
    lng: 126.912230,
    regDate: "2026-04-25",
    cancelDate: "",
    adoptionMenu: ["120pie"],
    monthlySales: 11500000,
  },
  {
    id: "hongdae",
    pw: "hongdae",
    pwConfirm: "hongdae",
    name: "120겹파이 홍대입구점",
    owner: "이민우",
    phone: "010-4211-5678",
    status: "승인",
    roadAddress: "서울 마포구 양화로 160 (동교동)",
    detailAddress: "2층 201호",
    lat: 37.556890,
    lng: 126.923674,
    regDate: "2026-04-12",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120"],
    monthlySales: 15400000,
  },
  {
    id: "owner",
    pw: "owner",
    pwConfirm: "owner",
    name: "120겹파이 강남역삼점",
    owner: "김지훈",
    phone: "010-3813-1200",
    status: "승인",
    roadAddress: "서울 강남구 테헤란로 152 (역삼동, 강남파이낸스센터)",
    detailAddress: "1층",
    lat: 37.500024,
    lng: 127.036509,
    regDate: "2026-05-01",
    cancelDate: "",
    adoptionMenu: ["120pie", "egg120", "츄러스120", "핫도그120", "120coffee"],
    monthlySales: 12800000,
  },
  {
    id: "seomyeon",
    pw: "seomyeon",
    pwConfirm: "seomyeon",
    name: "120겹파이 부산서면점",
    owner: "박수진",
    phone: "010-5182-9012",
    status: "승인",
    roadAddress: "부산 부산진구 중앙대로 730 (부전동)",
    detailAddress: "1층",
    lat: 35.157764,
    lng: 129.059036,
    regDate: "2026-05-20",
    cancelDate: "",
    adoptionMenu: ["120pie", "120coffee"],
    monthlySales: 9600000,
  },
];

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
    lat: v.optional(v.number()), // 위도
    lng: v.optional(v.number()), // 경도
    regDate: v.string(), // 가맹 등록일
    cancelDate: v.optional(v.string()), // 가맹 해지일
    adoptionMenu: v.array(v.string()), // 도입메뉴
    monthlySales: v.number(), // 월매출
    partnerId: v.optional(v.string()), // 영업 파트너 ID
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    const fields = {
      pw: args.pw,
      pwConfirm: args.pwConfirm,
      name: args.name,
      owner: args.owner,
      phone: args.phone,
      status: args.status,
      roadAddress: args.roadAddress,
      detailAddress: args.detailAddress,
      lat: args.lat ?? (existing?.lat || undefined),
      lng: args.lng ?? (existing?.lng || undefined),
      regDate: args.regDate,
      cancelDate: args.cancelDate,
      adoptionMenu: args.adoptionMenu,
      monthlySales: args.monthlySales,
      partnerId: args.partnerId,
    };

    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return { success: true, action: "updated", storeId: args.id };
    } else {
      await ctx.db.insert("stores", {
        id: args.id,
        ...fields,
      });
      return { success: true, action: "created", storeId: args.id };
    }
  },
});

// Update store coordinates
export const updateCoordinates = mutation({
  args: {
    id: v.string(),
    lat: v.number(),
    lng: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stores")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { lat: args.lat, lng: args.lng });
      return true;
    }
    return false;
  },
});

// Delete a store
export const deleteStore = mutation({
  args: {
    id: v.string(),
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

// Seed/Sync all authentic stores into Convex DB
export const seedStores = mutation({
  args: {},
  handler: async (ctx) => {
    const existingStores = await ctx.db.query("stores").collect();
    const existingMap = new Map(existingStores.map((s) => [s.id, s]));

    for (const store of AUTHENTIC_STORES) {
      const existing = existingMap.get(store.id);
      if (existing) {
        await ctx.db.patch(existing._id, {
          ...store,
          lat: store.lat,
          lng: store.lng,
        });
      } else {
        await ctx.db.insert("stores", store);
      }
    }

    return { success: true, count: AUTHENTIC_STORES.length };
  },
});

// Batch sync stores from client (admin localStorage -> Convex DB)
export const syncStoresBatch = mutation({
  args: {
    stores: v.array(
      v.object({
        id: v.string(),
        pw: v.optional(v.string()),
        pwConfirm: v.optional(v.string()),
        name: v.string(),
        owner: v.optional(v.string()),
        phone: v.optional(v.string()),
        status: v.optional(v.string()),
        roadAddress: v.optional(v.string()),
        detailAddress: v.optional(v.string()),
        lat: v.optional(v.number()),
        lng: v.optional(v.number()),
        regDate: v.optional(v.string()),
        cancelDate: v.optional(v.string()),
        adoptionMenu: v.optional(v.array(v.string())),
        monthlySales: v.optional(v.number()),
        partnerId: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("stores").collect();
    const existingMap = new Map(existing.map((s) => [s.id, s]));

    for (const store of args.stores) {
      if (!store.id || !store.name) continue;
      const ex = existingMap.get(store.id);
      const fields = {
        pw: store.pw || "1234",
        pwConfirm: store.pwConfirm || "1234",
        name: store.name,
        owner: store.owner || "",
        phone: store.phone || "",
        status: store.status || "승인",
        roadAddress: store.roadAddress || "",
        detailAddress: store.detailAddress || "",
        lat: store.lat ?? ex?.lat,
        lng: store.lng ?? ex?.lng,
        regDate: store.regDate || new Date().toISOString().split("T")[0],
        cancelDate: store.cancelDate || "",
        adoptionMenu: store.adoptionMenu || ["120pie"],
        monthlySales: store.monthlySales || 0,
        partnerId: store.partnerId,
      };

      if (ex) {
        await ctx.db.patch(ex._id, fields);
      } else {
        await ctx.db.insert("stores", {
          id: store.id,
          ...fields,
        });
      }
    }
    return { success: true, count: args.stores.length };
  },
});
