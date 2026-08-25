import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. 게시물 조회 (정렬 순서 오름차순)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("instagram").collect();
    return items.sort((a, b) => a.orderIndex - b.orderIndex);
  },
});

// 2. 게시물 생성/수정 통합 (createOrUpdate)
export const createOrUpdate = mutation({
  args: {
    id: v.optional(v.id("instagram")),
    img: v.string(),
    text: v.string(),
    link: v.string(),
    date: v.string(),
    orderIndex: v.number(),
    isMain: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.id) {
      await ctx.db.patch(args.id, {
        img: args.img,
        text: args.text,
        link: args.link,
        date: args.date,
        orderIndex: args.orderIndex,
        isMain: args.isMain,
      });
      return args.id;
    } else {
      const newId = await ctx.db.insert("instagram", {
        img: args.img,
        text: args.text,
        link: args.link,
        date: args.date,
        orderIndex: args.orderIndex,
        isMain: args.isMain ?? false,
      });
      return newId;
    }
  },
});

// 3. 게시물 삭제
export const deleteInstagram = mutation({
  args: {
    id: v.id("instagram"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// 3.5. 게시물 순서 일괄 변경 (Reorder)
export const reorder = mutation({
  args: {
    items: v.array(
      v.object({
        id: v.id("instagram"),
        orderIndex: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const item of args.items) {
      await ctx.db.patch(item.id, { orderIndex: item.orderIndex });
    }
  },
});

// 4. 시드(초기) 데이터 로드 (프록시 이미지 연동)
export const seedInstagram = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("instagram").collect();
    if (existing.length > 0) return;

    const seedData = [
      {
        img: "/api/instagram-image?shortcode=DbaL5-uFLTu",
        text: "NEW 카야치즈파이 출시! 바삭하게 구워진 120겹 파이 속을 가득 채운 진한 카야잼과 크리미한 치즈의 조화",
        link: "https://www.instagram.com/p/DbaL5-uFLTu/",
        date: "2026-07-30",
        orderIndex: 1,
        isMain: true
      },
      {
        img: "/api/instagram-image?shortcode=DbSNLBFGvpz",
        text: "💜 달콤한 우베와 진한 에스프레소의 특별한 만남 부드럽고 고소한 우베라떼에 향긋하고 진한 에스프레소 샷을 더한 120COFFEE의 '우베샷라떼'를 만나보세요.",
        link: "https://www.instagram.com/p/DbSNLBFGvpz/",
        date: "2026-07-27",
        orderIndex: 2,
        isMain: true
      },
      {
        img: "/api/instagram-image?shortcode=DbSLtKLmgfS",
        text: "120PIE&COFFEE가 여름 한정 창업 지원을 진행합니다. 부담은 낮추고, 시작은 든든하게! 48개월 이자 지원...",
        link: "https://www.instagram.com/p/DbSLtKLmgfS/",
        date: "2026-07-27",
        orderIndex: 3,
        isMain: true
      },
      {
        img: "/api/instagram-image?shortcode=DZplIYUIHi8",
        text: "🍉 New Watermelon Juice 더운 날씨에 딱 어울리는 시원하고 달콤한 여름 한 잔!",
        link: "https://www.instagram.com/reel/DZplIYUIHi8/",
        date: "2026-07-23",
        orderIndex: 4,
        isMain: true
      },
      {
        img: "/api/instagram-image?shortcode=DZZgdfeFBQc",
        text: "기사에도 소개된 관심받는 디저트 아이템, 120겹 파이를 소개합니다.",
        link: "https://www.instagram.com/p/DZZgdfeFBQc/",
        date: "2026-07-15",
        orderIndex: 5,
        isMain: false
      },
      {
        img: "/api/instagram-image?shortcode=DY3zAT4FMNi",
        text: "커피만으로는 조금 아쉬운 순간, 손님이 먼저 사진 찍고 싶어지는 디저트가 필요합니다. 120겹 파이를 만나보세요.",
        link: "https://www.instagram.com/p/DY3zAT4FMNi/",
        date: "2026-07-23",
        orderIndex: 6,
        isMain: false
      }
    ];

    for (const item of seedData) {
      await ctx.db.insert("instagram", item);
    }
  }
});
