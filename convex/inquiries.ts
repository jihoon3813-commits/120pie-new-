import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("inquiries").collect();
  },
});

// 파트너별 본인 귀속 상담 내역 조회
export const listByPartner = query({
  args: { partnerId: v.string() },
  handler: async (ctx: any, args: { partnerId: string }) => {
    const list = await ctx.db
      .query("inquiries")
      .withIndex("by_partner_id", (q: any) => q.eq("partnerId", args.partnerId))
      .collect();
    return list.sort(
      (a: any, b: any) =>
        b.regDate.localeCompare(a.regDate) || (b._creationTime || 0) - (a._creationTime || 0)
    );
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    storeType: v.string(),
    existingStoreName: v.optional(v.string()),
    message: v.optional(v.string()),
    regDate: v.string(),
    partnerId: v.optional(v.string()),
    partnerName: v.optional(v.string()),
    partnerCompany: v.optional(v.string()),
    status: v.optional(v.string()),
    partnerMemo: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    let pName = args.partnerName;
    let pCompany = args.partnerCompany;

    // partnerId가 있는데 partnerName이 전달되지 않은 경우 DB에서 자동 조회 매핑
    if (args.partnerId && (!pName || !pCompany)) {
      const partner = await ctx.db
        .query("partners")
        .withIndex("by_partner_id", (q: any) => q.eq("id", args.partnerId))
        .first();
      if (partner) {
        pName = pName || partner.name;
        pCompany = pCompany || partner.companyName;
      }
    }

    const doc = {
      name: args.name,
      phone: args.phone,
      storeType: args.storeType,
      existingStoreName: args.existingStoreName,
      message: args.message,
      regDate: args.regDate,
      partnerId: args.partnerId || undefined,
      partnerName: pName || undefined,
      partnerCompany: pCompany || undefined,
      status: args.status || "대기",
      partnerMemo: args.partnerMemo || undefined,
    };

    const id = await ctx.db.insert("inquiries", doc);

    // 디스코드 알림 발송 (파트너 유입 여부 메시지에 표기)
    const discordMessage = [
      args.message || "",
      args.partnerId
        ? `\n[유치 파트너: ${pName || args.partnerId}${pCompany ? ` (${pCompany})` : ""} - 전용 분양 사이트 접수]`
        : "",
    ]
      .join("")
      .trim();

    await ctx.scheduler.runAfter(0, internal.discord.notifyConsultation, {
      name: args.name,
      phone: args.phone,
      storeType: args.storeType,
      existingStoreName: args.existingStoreName,
      message: discordMessage || "상담 신청",
      regDate: args.regDate,
    });

    return id;
  },
});

// 상담 진행 상태 및 파트너 메모 업데이트
export const updateStatus = mutation({
  args: {
    _id: v.id("inquiries"),
    status: v.optional(v.string()),
    partnerMemo: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const patch: any = {};
    if (args.status !== undefined) patch.status = args.status;
    if (args.partnerMemo !== undefined) patch.partnerMemo = args.partnerMemo;
    await ctx.db.patch(args._id, patch);
    return true;
  },
});

export const deleteInquiry = mutation({
  args: { _id: v.id("inquiries") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args._id);
    return true;
  },
});

