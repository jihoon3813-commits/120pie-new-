import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all contracts ordered by creation time descending
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contracts").order("desc").collect();
  },
});

// Create or update a contract
export const createOrUpdate = mutation({
  args: {
    id: v.optional(v.id("contracts")),
    ownerName: v.string(),
    ownerBirth: v.string(),
    ownerPhone: v.string(),
    storeAddress: v.string(),
    storeName: v.string(),
    storeSize: v.number(),
    businessArea: v.string(),
    contractStart: v.string(),
    contractEnd: v.string(),
    
    supervisionFee: v.number(),
    initialFranchiseFee: v.number(),
    
    depositMembershipFee: v.number(),
    depositEduFee: v.number(),
    depositSupportFee: v.number(),
    depositGuaranteeFee: v.number(),
    depositTotalFee: v.number(),
    
    royaltyFee: v.number(),
    guaranteeFee: v.number(),
    
    eduOpenFee: v.number(),
    eduNewFee: v.number(),
    
    initialSupplyFee: v.number(),
    reFranchiseFee: v.number(),
    penaltyFee: v.number(),
    
    status: v.string(),
    createdAt: v.string(),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    contractType: v.optional(v.string()),
    signatureImage: v.optional(v.string()),
    signedAt: v.optional(v.string()),
    sentAt: v.optional(v.string()),
    signerIp: v.optional(v.string()),
    agreeTerms: v.optional(v.boolean()),
    agreePrivacy: v.optional(v.boolean()),
    agreeSupplies: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    
    if (id) {
      // Update existing contract
      await ctx.db.patch(id, data);
      return { success: true, action: "updated", contractId: id };
    } else {
      // Insert new contract
      const newId = await ctx.db.insert("contracts", data);
      return { success: true, action: "created", contractId: newId };
    }
  },
});

// Get a single contract by ID
export const getById = query({
  args: {
    id: v.id("contracts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Customer Electronic Signature submission
export const signContract = mutation({
  args: {
    id: v.id("contracts"),
    signatureImage: v.string(), // Base64 signature image
    signedAt: v.string(), // YYYY-MM-DD HH:mm:ss
    signerIp: v.optional(v.string()),
    agreeTerms: v.boolean(),
    agreePrivacy: v.boolean(),
    agreeSupplies: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, signatureImage, signedAt, signerIp, agreeTerms, agreePrivacy, agreeSupplies } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("존재하지 않는 계약서입니다.");
    }
    
    await ctx.db.patch(id, {
      status: "계약서 서명완료",
      signatureImage,
      signedAt,
      signerIp: signerIp || "Web Client",
      agreeTerms,
      agreePrivacy,
      agreeSupplies,
    });
    
    return { success: true, message: "계약서 전자서명이 완료되었습니다." };
  },
});

// Mark contract as sent via SMS
export const markSent = mutation({
  args: {
    id: v.id("contracts"),
    sentAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("존재하지 않는 계약서입니다.");
    }
    
    await ctx.db.patch(args.id, {
      status: "계약서 발송완료",
      sentAt: args.sentAt,
    });
    
    return { success: true };
  },
});

// Delete a contract
export const deleteContract = mutation({
  args: {
    id: v.id("contracts"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (existing) {
      await ctx.db.delete(args.id);
      return { success: true, action: "deleted" };
    }
    return { success: false, error: "Contract not found" };
  },
});

// Update status of a contract
export const updateStatus = mutation({
  args: {
    id: v.id("contracts"),
    status: v.string(),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    signatureImage: v.optional(v.string()),
    signedAt: v.optional(v.string()),
    sentAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, status, fileUrl, fileName, signatureImage, signedAt, sentAt } = args;
    const existing = await ctx.db.get(id);
    if (existing) {
      const patchData: any = { status };
      if (fileUrl !== undefined) patchData.fileUrl = fileUrl;
      if (fileName !== undefined) patchData.fileName = fileName;
      if (signatureImage !== undefined) patchData.signatureImage = signatureImage;
      if (signedAt !== undefined) patchData.signedAt = signedAt;
      if (sentAt !== undefined) patchData.sentAt = sentAt;
      await ctx.db.patch(id, patchData);
      return { success: true };
    }
    return { success: false, error: "Contract not found" };
  },
});
