import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const trackEvent = mutation({
  args: {
    type: v.string(),
    path: v.string(),
    menuName: v.optional(v.string()),
    referrer: v.optional(v.string()),
    ip: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("analytics", args);
    return eventId;
  },
});

export const listEvents = query({
  args: {
    startDate: v.optional(v.string()), // YYYY-MM-DD
    endDate: v.optional(v.string()),   // YYYY-MM-DD
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("analytics");
    if (args.startDate && args.endDate) {
      return await q
        .withIndex("by_date", (q) =>
          q.gte("date", args.startDate!).lte("date", args.endDate!)
        )
        .collect();
    } else if (args.startDate) {
      return await q
        .withIndex("by_date", (q) => q.gte("date", args.startDate!))
        .collect();
    } else if (args.endDate) {
      return await q
        .withIndex("by_date", (q) => q.lte("date", args.endDate!))
        .collect();
    }
    // Default: return all logs (or sorted/latest up to a limit if unbounded, but for our admin we collect)
    return await q.collect();
  },
});
