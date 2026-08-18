import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 모든 자재 제품 리스트 정렬 조회
export const get = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products.sort((a, b) => a.orderIndex - b.orderIndex);
  },
});

// 단일 자재 제품 추가 또는 수정
export const createOrUpdate = mutation({
  args: {
    id: v.string(),
    orderIndex: v.number(),
    name: v.string(),
    category: v.string(),
    modelName: v.string(),
    unit: v.string(),
    qty: v.number(),
    supplyPrice: v.number(),
    price: v.number(),
    discountAmount: v.number(),
    discountedPrice: v.number(),
    img: v.string(),
    detailImg: v.optional(v.string()),
    detailText: v.optional(v.string()),
    isActive: v.boolean(),
    desc: v.string(),
    stock: v.string(),
    status: v.optional(v.string()),
    labels: v.optional(v.array(v.string())),
    shippingType: v.optional(v.string()),
    options: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    const fields = {
      id: args.id,
      orderIndex: typeof args.orderIndex === "number" && !isNaN(args.orderIndex) ? args.orderIndex : 1,
      name: args.name || "상품",
      category: args.category || "냉동생지/자재",
      modelName: args.modelName || `MODEL-${args.id}`,
      unit: args.unit || "박스",
      qty: typeof args.qty === "number" && !isNaN(args.qty) ? args.qty : 1,
      supplyPrice: typeof args.supplyPrice === "number" && !isNaN(args.supplyPrice) ? args.supplyPrice : 0,
      price: typeof args.price === "number" && !isNaN(args.price) ? args.price : 0,
      discountAmount: typeof args.discountAmount === "number" && !isNaN(args.discountAmount) ? args.discountAmount : 0,
      discountedPrice: typeof args.discountedPrice === "number" && !isNaN(args.discountedPrice) ? args.discountedPrice : 0,
      img: args.img || "",
      detailImg: args.detailImg || undefined,
      detailText: args.detailText || undefined,
      isActive: typeof args.isActive === "boolean" ? args.isActive : true,
      desc: args.desc || "",
      stock: args.stock || "in_stock",
      status: args.status || "판매중",
      labels: args.labels || [],
      shippingType: args.shippingType || "A",
      options: args.options || undefined,
    };

    // 새로운 카테고리가 등록될 때 productCategories 테이블에 자동 추가하여 동기화
    const categoryName = (args.category || "").trim();
    if (categoryName) {
      const catList = await ctx.db.query("productCategories").collect();
      if (catList.length > 0) {
        const currentCats = catList[0].categories || [];
        if (!currentCats.includes(categoryName)) {
          await ctx.db.patch(catList[0]._id, {
            categories: [...currentCats, categoryName]
          });
        }
      } else {
        await ctx.db.insert("productCategories", {
          categories: [categoryName]
        });
      }
    }

    if (existing) {
      await ctx.db.patch(existing._id, fields);
      return existing._id;
    } else {
      const newId = await ctx.db.insert("products", fields);
      return newId;
    }
  },
});

// 벌크 동기화 및 마이그레이션 API (최초 로컬스토리지 복구용)
export const syncProducts = mutation({
  args: {
    products: v.array(
      v.object({
        id: v.string(),
        orderIndex: v.number(),
        name: v.string(),
        category: v.string(),
        modelName: v.string(),
        unit: v.string(),
        qty: v.number(),
        supplyPrice: v.number(),
        price: v.number(),
        discountAmount: v.number(),
        discountedPrice: v.number(),
        img: v.string(),
        detailImg: v.optional(v.string()),
        detailText: v.optional(v.string()),
        isActive: v.boolean(),
        desc: v.string(),
        stock: v.string(),
        status: v.optional(v.string()),
        labels: v.optional(v.array(v.string())),
        shippingType: v.optional(v.string()),
        options: v.optional(v.array(v.string())),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const p of args.products) {
      const existing = await ctx.db
        .query("products")
        .filter((q) => q.eq(q.field("id"), p.id))
        .first();

      const fields = {
        id: p.id,
        orderIndex: p.orderIndex,
        name: p.name,
        category: p.category,
        modelName: p.modelName,
        unit: p.unit,
        qty: p.qty,
        supplyPrice: p.supplyPrice,
        price: p.price,
        discountAmount: p.discountAmount,
        discountedPrice: p.discountedPrice,
        img: p.img,
        detailImg: p.detailImg,
        detailText: p.detailText,
        isActive: p.isActive,
        desc: p.desc,
        stock: p.stock,
        status: p.status,
        labels: p.labels,
        shippingType: p.shippingType,
        options: p.options,
      };

      // 새로운 카테고리가 등록될 때 productCategories 테이블에 자동 추가하여 동기화
      const categoryName = p.category.trim();
      if (categoryName) {
        const catList = await ctx.db.query("productCategories").collect();
        if (catList.length > 0) {
          const currentCats = catList[0].categories;
          if (!currentCats.includes(categoryName)) {
            await ctx.db.patch(catList[0]._id, {
              categories: [...currentCats, categoryName]
            });
          }
        } else {
          await ctx.db.insert("productCategories", {
            categories: [categoryName]
          });
        }
      }

      if (existing) {
        await ctx.db.patch(existing._id, fields);
      } else {
        await ctx.db.insert("products", fields);
      }
    }
    return true;
  },
});

// 자재 제품 삭제
export const deleteProduct = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return true;
    }
    return false;
  },
});

const SEED_PRODUCTS = [
  {
    id: "prod-1",
    orderIndex: 1,
    name: "로제미트파이 생지",
    category: "냉동생지/자재",
    modelName: "RP-DOUGH-01",
    unit: "박스",
    qty: 60,
    supplyPrice: 35000,
    price: 45000,
    discountAmount: 3000,
    discountedPrice: 42000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg",
    detailImg: "",
    isActive: true,
    desc: "육즙 가득 미트소스와 로제 크림이 가미된 시그니처 대표 생지",
    stock: "in_stock",
    status: "판매중"
  },
  {
    id: "prod-2",
    orderIndex: 2,
    name: "애플시나몬파이 생지",
    category: "냉동생지/자재",
    modelName: "RP-DOUGH-02",
    unit: "박스",
    qty: 60,
    supplyPrice: 32000,
    price: 42000,
    discountAmount: 0,
    discountedPrice: 42000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_yurkh5.jpg",
    detailImg: "",
    isActive: true,
    desc: "달콤 상큼한 사과 과육과 시나몬 아로마가 어우러진 스테디셀러 디저트 생지",
    stock: "in_stock",
    status: "판매중"
  },
  {
    id: "prod-3",
    orderIndex: 3,
    name: "콘치즈파이 생지",
    category: "냉동생지/자재",
    modelName: "RP-DOUGH-03",
    unit: "박스",
    qty: 60,
    supplyPrice: 33000,
    price: 43000,
    discountAmount: 1000,
    discountedPrice: 42000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_qvb2u5.jpg",
    detailImg: "",
    isActive: true,
    desc: "고소한 스위트콘 and 부드러운 치즈가 조합된 남녀노소 취향저격 생지",
    stock: "low_stock",
    status: "판매중"
  },
  {
    id: "prod-4",
    orderIndex: 4,
    name: "쌀계란빵 오리지널 믹스",
    category: "냉동생지/자재",
    modelName: "EG-MIX-01",
    unit: "kg",
    qty: 5,
    supplyPrice: 16000,
    price: 21000,
    discountAmount: 0,
    discountedPrice: 21000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg",
    detailImg: "",
    isActive: true,
    desc: "에그120 전용 100% 국산 쌀가루 계란빵 전용 반죽 파우더 믹스",
    stock: "in_stock",
    status: "판매중"
  },
  {
    id: "prod-5",
    orderIndex: 5,
    name: "츄러스 전용 냉동생지",
    category: "냉동생지/자재",
    modelName: "CH-DOUGH-01",
    unit: "박스",
    qty: 100,
    supplyPrice: 29000,
    price: 38000,
    discountAmount: 2000,
    discountedPrice: 36000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762878/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_koyjlk.jpg",
    detailImg: "",
    isActive: true,
    desc: "기름 없이 오븐 조리가 가능한 바삭하고 쫀득한 츄러스 전용 냉동 생지",
    stock: "in_stock",
    status: "판매중"
  },
  {
    id: "prod-6",
    orderIndex: 6,
    name: "[홍보물] 매장용 양면 포스터 및 스티커",
    category: "부자재/포장재",
    modelName: "PR-POSTER-01",
    unit: "개",
    qty: 1,
    supplyPrice: 4000,
    price: 5000,
    discountAmount: 0,
    discountedPrice: 5000,
    img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779718433/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_xk9fhi.jpg",
    detailImg: "",
    isActive: true,
    desc: "120pie 브랜드 컬러의 매장 유리창 부착용 홍보 포스터 세트",
    stock: "in_stock",
    status: "판매중",
    options: ["A4 사이즈 포스터", "A3 사이즈 포스터", "카운터용 미니 스티커 5매"]
  }
];

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    for (const p of SEED_PRODUCTS) {
      const existing = await ctx.db
        .query("products")
        .filter((q) => q.eq(q.field("id"), p.id))
        .first();

      if (!existing) {
        await ctx.db.insert("products", p);
      }
    }
    return true;
  },
});

export const deleteSeedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const targets = ["prod-1", "prod-2", "prod-3", "prod-4", "prod-5", "prod-6"];
    for (const id of targets) {
      const existing = await ctx.db
        .query("products")
        .filter((q) => q.eq(q.field("id"), id))
        .first();
      if (existing) {
        await ctx.db.delete(existing._id);
      }
    }
    return true;
  },
});
