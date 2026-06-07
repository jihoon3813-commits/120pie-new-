import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("inquiries").collect();
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
  },
  handler: async (ctx: any, args: any) => {
    const id = await ctx.db.insert("inquiries", args);
    await ctx.scheduler.runAfter(0, internal.discord.notifyConsultation, {
      name: args.name,
      phone: args.phone,
      storeType: args.storeType,
      existingStoreName: args.existingStoreName,
      message: args.message,
      regDate: args.regDate,
    });
    return id;
  },
});

export const deleteInquiry = mutation({
  args: { _id: v.id("inquiries") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args._id);
    return true;
  },
});

