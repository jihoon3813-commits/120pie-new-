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

// 4. 시드(초기) 데이터 로드
export const seedInstagram = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("instagram").collect();
    if (existing.length > 0) return;

    // 초도 데이터 4개 추가
    const seedData = [
      {
        img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555518/4344223e-1040-4413-9233-bf6b98fe0412.png",
        text: "지금! 120겹파이 배민 먹을복 페스타 오픈! 선착순 최대 4,000원 즉시 할인 혜택을 놓치지 마세요. 120겹파이만의 깊은 풍미를 배달로 시원하게 즐기실 기회!",
        link: "https://www.instagram.com/120piecoffee",
        date: "2026-07-20",
        orderIndex: 1,
        isMain: true
      },
      {
        img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555544/441a0be2-7572-4744-b260-ce701e3d84aa.png",
        text: "120겹파이 3rd 쉐프 에디션 COMING SOON! 40년 제과 장인의 손길로 한 결 한 결 구워낸 바삭한 스페인 정통 츄러스와 에그 타르트의 특별한 콜라보레이션이 시작됩니다.",
        link: "https://www.instagram.com/120piecoffee",
        date: "2026-07-15",
        orderIndex: 2,
        isMain: true
      },
      {
        img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555781/30929f3b-eb6f-4527-bde6-d70c23dd44e9.png",
        text: "이번 주말, 120겹파이와 달콤한 츄러스로 힐링 충전 완료! 겉은 바삭하고 속은 쫄깃한 스페인 정통 맛 그대로, 시나몬 슈가 아로마의 황홀한 맛을 경험해보세요.",
        link: "https://www.instagram.com/120piecoffee",
        date: "2026-07-10",
        orderIndex: 3,
        isMain: true
      },
      {
        img: "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784555770/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_14%EC%9D%BC_%EC%98%A4%ED%9B%84_09_44_28_futlho.png",
        text: "여름엔 역시 120겹파이 시그니처 미트 파이 & 불고기 핫도그 조합! 매콤 짭조름한 직화 불고기가 가득 들어가 소시지와의 궁합이 환상적입니다. 단체 주문 환영!",
        link: "https://www.instagram.com/120piecoffee",
        date: "2026-07-05",
        orderIndex: 4,
        isMain: true
      }
    ];

    for (const item of seedData) {
      await ctx.db.insert("instagram", item);
    }
  }
});
