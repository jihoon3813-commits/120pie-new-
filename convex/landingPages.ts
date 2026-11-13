import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function getKstNowString(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kst.getUTCDate()).padStart(2, "0");
  const hh = String(kst.getUTCHours()).padStart(2, "0");
  const mm = String(kst.getUTCMinutes()).padStart(2, "0");
  const ss = String(kst.getUTCSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

function normalizeSlug(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("landingPages")
      .order("desc")
      .take(500);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug.trim().toLowerCase()))
      .unique();
  },
});

export const ensureDefaultBase = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", "landing-ad"))
      .unique();

    if (existing) {
      return existing._id;
    }

    const now = getKstNowString();
    const id = await ctx.db.insert("landingPages", {
      slug: "landing-ad",
      title: "기본 광고 랜딩 (우리 동네 디저트, 내가 먼저)",
      templateKey: "landing-ad",
      isBase: true,
      channel: "direct",
      campaignName: "기본 대표 랜딩페이지",
      utmSource: "direct",
      utmMedium: "landing",
      utmCampaign: "base_landing_ad",
      customTitle: "우리 동네 디저트, 내가 먼저 | 120PIE 샵인샵",
      customDescription: "120PIE 샵인샵 상담 랜딩페이지 — 지역 선점 창업 솔루션",
      memo: "기본 광고 랜딩페이지 (/landing-ad). 이 페이지를 복제하여 광고 채널별 전용 추적 링크를 생성할 수 있습니다.",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    templateKey: v.optional(v.string()),
    isBase: v.optional(v.boolean()),
    channel: v.string(),
    campaignName: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    customTitle: v.optional(v.string()),
    customDescription: v.optional(v.string()),
    memo: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const slug = normalizeSlug(args.slug);
    if (!slug || slug.length < 2) {
      throw new Error("URL 슬러그는 영문 소문자, 숫자, 하이픈(-) 조합 2자 이상이어야 합니다.");
    }

    const dup = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (dup) {
      throw new Error(`이미 사용 중인 URL 슬러그입니다: ${slug}`);
    }

    const now = getKstNowString();
    return await ctx.db.insert("landingPages", {
      slug,
      title: args.title.trim(),
      templateKey: args.templateKey || "landing-ad",
      isBase: args.isBase ?? true,
      channel: args.channel,
      campaignName: args.campaignName?.trim() || undefined,
      utmSource: args.utmSource?.trim() || undefined,
      utmMedium: args.utmMedium?.trim() || undefined,
      utmCampaign: args.utmCampaign?.trim() || undefined,
      customTitle: args.customTitle?.trim() || undefined,
      customDescription: args.customDescription?.trim() || undefined,
      memo: args.memo?.trim() || undefined,
      isActive: args.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const clone = mutation({
  args: {
    sourceId: v.id("landingPages"),
    slug: v.string(),
    title: v.string(),
    channel: v.string(),
    campaignName: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    customTitle: v.optional(v.string()),
    customDescription: v.optional(v.string()),
    memo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const source = await ctx.db.get(args.sourceId);
    if (!source) {
      throw new Error("복제할 원본 랜딩페이지를 찾을 수 없습니다.");
    }

    const slug = normalizeSlug(args.slug);
    if (!slug || slug.length < 2) {
      throw new Error("URL 슬러그는 영문 소문자, 숫자, 하이픈(-) 조합 2자 이상이어야 합니다.");
    }

    const dup = await ctx.db
      .query("landingPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (dup) {
      throw new Error(`이미 사용 중인 URL 슬러그입니다: ${slug}`);
    }

    const now = getKstNowString();
    return await ctx.db.insert("landingPages", {
      slug,
      title: args.title.trim(),
      templateKey: source.templateKey,
      isBase: false,
      parentId: source._id,
      channel: args.channel,
      campaignName: args.campaignName?.trim() || undefined,
      utmSource: args.utmSource?.trim() || args.channel,
      utmMedium: args.utmMedium?.trim() || undefined,
      utmCampaign: args.utmCampaign?.trim() || slug,
      customTitle: args.customTitle?.trim() || source.customTitle,
      customDescription: args.customDescription?.trim() || source.customDescription,
      memo: args.memo?.trim() || undefined,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("landingPages"),
    title: v.optional(v.string()),
    channel: v.optional(v.string()),
    campaignName: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    customTitle: v.optional(v.string()),
    customDescription: v.optional(v.string()),
    memo: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("랜딩페이지를 찾을 수 없습니다.");
    }

    await ctx.db.patch(args.id, {
      ...(args.title !== undefined ? { title: args.title.trim() } : {}),
      ...(args.channel !== undefined ? { channel: args.channel } : {}),
      ...(args.campaignName !== undefined ? { campaignName: args.campaignName.trim() || undefined } : {}),
      ...(args.utmSource !== undefined ? { utmSource: args.utmSource.trim() || undefined } : {}),
      ...(args.utmMedium !== undefined ? { utmMedium: args.utmMedium.trim() || undefined } : {}),
      ...(args.utmCampaign !== undefined ? { utmCampaign: args.utmCampaign.trim() || undefined } : {}),
      ...(args.customTitle !== undefined ? { customTitle: args.customTitle.trim() || undefined } : {}),
      ...(args.customDescription !== undefined ? { customDescription: args.customDescription.trim() || undefined } : {}),
      ...(args.memo !== undefined ? { memo: args.memo.trim() || undefined } : {}),
      ...(args.isActive !== undefined ? { isActive: args.isActive } : {}),
      updatedAt: getKstNowString(),
    });
    return true;
  },
});

export const toggleActive = mutation({
  args: { id: v.id("landingPages") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("랜딩페이지를 찾을 수 없습니다.");
    }
    const next = !existing.isActive;
    await ctx.db.patch(args.id, {
      isActive: next,
      updatedAt: getKstNowString(),
    });
    return next;
  },
});

export const remove = mutation({
  args: { id: v.id("landingPages") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("랜딩페이지를 찾을 수 없습니다.");
    }
    if (existing.slug === "landing-ad") {
      throw new Error("기본 광고 랜딩페이지(/landing-ad)는 삭제할 수 없습니다.");
    }
    await ctx.db.delete(args.id);
    return true;
  },
});
