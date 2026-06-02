import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  popups: defineTable({
    isActive: v.boolean(),
    title: v.string(),
    desc: v.string(),
    image: v.optional(v.string()),
    link: v.optional(v.string()),
    btnText: v.optional(v.string()),
    titleColor: v.optional(v.string()),
    titleSize: v.optional(v.string()),
    descColor: v.optional(v.string()),
    descSize: v.optional(v.string()),
    btnBgColor: v.optional(v.string()),
    btnTextColor: v.optional(v.string()),
    btnTextSize: v.optional(v.string()),
  }),
  floatings: defineTable({
    isActive: v.boolean(),
    instaUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    chatUrl: v.optional(v.string()),
    phoneNo: v.optional(v.string()),
    kakaoUrl: v.optional(v.string()),
    blogUrl: v.optional(v.string()),
  }),
  inquiries: defineTable({
    name: v.string(),
    phone: v.string(),
    storeType: v.string(),
    existingStoreName: v.optional(v.string()),
    message: v.optional(v.string()),
    regDate: v.string(),
  }),
  gallery: defineTable({
    name: v.string(),
    category: v.string(),
    url: v.string(),
    regDate: v.string(),
    orderIndex: v.optional(v.number()),
    isFeatured: v.optional(v.boolean()),
  }),
  galleryCategories: defineTable({
    categories: v.array(v.string()),
  }),
  stores: defineTable({
    id: v.string(), // 로그인 ID (e.g. store1)
    pw: v.string(), // 비밀번호
    pwConfirm: v.string(), // 비밀번호 확인
    name: v.string(), // 가맹점명
    owner: v.string(), // 점주명
    phone: v.string(), // 연락처
    status: v.string(), // 가맹상태 ("승인" | "대기" | "보류" | "중지" | "취소")
    roadAddress: v.string(), // 도로명주소
    detailAddress: v.string(), // 상세주소
    regDate: v.string(), // 가맹 등록일 (YYYY-MM-DD)
    cancelDate: v.optional(v.string()), // 가맹 해지일
    adoptionMenu: v.array(v.string()), // 도입 메뉴 브랜드 배열
    monthlySales: v.number(), // 월매출
  }),
});
