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
  },
  handler: async (ctx, args) => {
    const { id, status, fileUrl, fileName } = args;
    const existing = await ctx.db.get(id);
    if (existing) {
      const patchData: any = { status };
      if (fileUrl !== undefined) patchData.fileUrl = fileUrl;
      if (fileName !== undefined) patchData.fileName = fileName;
      await ctx.db.patch(id, patchData);
      return { success: true };
    }
    return { success: false, error: "Contract not found" };
  },
});
