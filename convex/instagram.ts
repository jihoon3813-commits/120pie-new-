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

// 4. 시드(초기) 데이터 로드 (Full HD 1080p 원본 CDN 이미지 연동)
export const seedInstagram = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("instagram").collect();
    if (existing.length > 0) return;

    const seedData = [
      {
        img: "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/755693701_18002053679970075_4628412250315521061_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzk1MDI3Nzc1NDgzNTYzMDcwNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTUwMC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=PJnV2eWygdUQ7kNvwHFNLfU&_nc_oc=AdoVEIFv2G76tsXxrvmdVfp5s_OULklOGhwuLbYh2N4huZFZrKSpzNxANXK7e8fRUjw&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=06YLkUyP3WQ54-hGvOqT9g&_nc_ss=7f689&oh=00_AQFiwGjUPa3_UOPWNozWj3PI_-VlqG_zI8c1FMlOTROalA&oe=6A70E8E0",
        text: "💜 달콤한 우베와 진한 에스프레소의 특별한 만남 부드럽고 고소한 우베라떼에 향긋하고 진한 에스프레소 샷을 더한 120COFFEE의 '우베샷라떼'를 만나보세요.",
        link: "https://www.instagram.com/p/DbSNLBFGvpz/",
        date: "2026-07-27",
        orderIndex: 1,
        isMain: true
      },
      {
        img: "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/757345849_18002052470970075_5827364617452265554_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzk1MDI3MTMwNDk3NzQ4MzczMA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTA4Ni5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=r9bo6V2nJdMQ7kNvwGGA52d&_nc_oc=Ado-i-xFnz-L5uxIHn1UgRSJjWahL0q-HOb6FURdPNDz9gi-I0YyeYahtfF6RUrO2ZY&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=dy_QLEOYxyX6-8ERTN_v4A&_nc_ss=7f689&oh=00_AQFoRUbL_0l1f_jMf8uPVLvhfiRClzkY8eLktwoZwAiecw&oe=6A70BFF2",
        text: "120PIE&COFFEE가 여름 한정 창업 지원을 진행합니다. 부담은 낮추고, 시작은 든든하게! 48개월 이자 지원...",
        link: "https://www.instagram.com/p/DbSLtKLmgfS/",
        date: "2026-07-27",
        orderIndex: 2,
        isMain: true
      },
      {
        img: "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/722469487_17996220227970075_8784301918030809357_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzkyMDgyODI1NDE4NjkyODMxNjE3OTk2MjIwMjI0OTcwMDc1.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjcyMC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=cyYMPL2IHV4Q7kNvwH4ctqX&_nc_oc=AdpZ3Fzdg5qC6s1sKo3sdxteD4biV3T73HexdCoRLPBghKXCc5RLtBwis5nN4VsSwOE&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=4A3UExMFdWdEOYtumeCZ0g&_nc_ss=7f689&oh=00_AQF27bqDbaQEqVNENZBu7_LI2shubM3LYbmGH1llj0jiBg&oe=6A70D1EF",
        text: "🍉 New Watermelon Juice 더운 날씨에 딱 어울리는 시원하고 달콤한 여름 한 잔!",
        link: "https://www.instagram.com/reel/DZplIYUIHi8/",
        date: "2026-07-23",
        orderIndex: 3,
        isMain: true
      },
      {
        img: "https://scontent-ssn1-1.cdninstagram.com/v/t51.82787-15/721430029_17995398656970075_5216392161691113912_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzk1MDI3Nzc1NDgzNTYzMDcwNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTI1NC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=rsdY8FicouUQ7kNvwFoaB17&_nc_oc=Ado9nCgJUsSvg9G9DxnfwVfEDKaYa1djLIReGUtIlXhiwrtQMDrkj-Use0MO0c3wXd4&_nc_zt=23&_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_gid=9e0ih9mawZNqJmjzX6IeTg&_nc_ss=7f689&oh=00_AQH_q6_omOwySlQqMTiwAusvSZk4drF9lHwoYRHBt9tULg&oe=6A70D25F",
        text: "기사에도 소개된 관심받는 디저트 아이템, 120겹 파이를 소개합니다.",
        link: "https://www.instagram.com/p/DZZgdfeFBQc/",
        date: "2026-07-15",
        orderIndex: 4,
        isMain: true
      }
    ];

    for (const item of seedData) {
      await ctx.db.insert("instagram", item);
    }
  }
});
