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
});
