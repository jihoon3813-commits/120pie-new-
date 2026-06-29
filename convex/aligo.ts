import { action } from "./_generated/server";
import { v } from "convex/values";

export const sendSms = action({
  args: {
    key: v.string(),
    userId: v.string(),
    sender: v.string(),
    receiver: v.string(),
    msg: v.string(),
    isTest: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    try {
      console.log(`[Aligo SMS Action] Preparing to send to ${args.receiver}...`);
      
      const params = new URLSearchParams();
      params.append("key", args.key);
      params.append("user_id", args.userId);
      params.append("sender", args.sender);
      params.append("receiver", args.receiver);
      params.append("msg", args.msg);
      
      // Auto-detect message type based on Korean character byte length
      // Usually, SMS is up to 90 bytes. In JS, if string length > 80 characters, use LMS.
      const isLms = args.msg.length > 80;
      params.append("msg_type", isLms ? "LMS" : "SMS");
      
      if (isLms) {
        params.append("title", "[120겹파이 알림]");
      }

      if (args.isTest) {
        params.append("testcross", "Y"); // Test mode (doesn't deduct points)
      } else {
        params.append("testcross", "N"); // Real mode
      }

      const response = await fetch("https://apis.aligo.in/send/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });

      if (!response.ok) {
        throw new Error(`Aligo API responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log("[Aligo API Result]:", result);
      
      return {
        success: result.result_code === "1" || result.result_code === 1 || String(result.result_code) === "1",
        message: result.message,
        msgId: result.msg_id,
        code: result.result_code
      };
    } catch (error: any) {
      console.error("[Aligo SMS Error]:", error);
      return {
        success: false,
        error: error.message || String(error)
      };
    }
  }
});
