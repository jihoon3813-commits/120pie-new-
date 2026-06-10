import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const verifyAndSaveOrder = action({
  args: {
    impUid: v.string(),
    merchantUid: v.string(),
    amount: v.number(),
    storeId: v.optional(v.string()),
    items: v.array(
      v.object({
        productName: v.string(),
        quantity: v.number(),
        price: v.number(),
        selectedOption: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const impKey = process.env.PORTONE_API_KEY;
    const impSecret = process.env.PORTONE_API_SECRET;

    if (!impKey || !impSecret) {
      console.warn("PORTONE_API_KEY or PORTONE_API_SECRET env variable is missing. Bypassing check for development/testing.");
      
      // Fallback: If API Keys are not set, allow payment in sandbox/test mode
      const newOrderId = args.merchantUid;
      const today = new Date().toISOString().split("T")[0];

      await ctx.runMutation(api.orders.createOrUpdate, {
        id: newOrderId,
        date: today,
        items: args.items,
        totalPrice: args.amount,
        status: "결제완료",
        storeId: args.storeId,
        impUid: args.impUid,
        payMethod: "card",
      });

      return { success: true, message: "결제 키 미설정으로 테스트 모드로 자동 승인 및 등록되었습니다." };
    }

    try {
      // 1. Get payment info from PortOne V2 API
      const paymentResponse = await fetch(`https://api.portone.io/payments/${args.impUid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `PortOne ${impSecret}`,
        },
      });

      if (!paymentResponse.ok) {
        const errText = await paymentResponse.text();
        return { success: false, message: `포트원 결제내역 조회 실패: ${errText}` };
      }

      const paymentInfo = await paymentResponse.json();

      if (!paymentInfo || !paymentInfo.status) {
        return { success: false, message: "포트원 서버에 해당 결제 내역이 존재하지 않거나 응답이 올바르지 않습니다." };
      }

      // 2. Compare amounts and status
      const actualAmount = paymentInfo.amount?.total;
      const paymentStatus = paymentInfo.status; // V2 결제 완료 상태는 "PAID"

      if (paymentStatus !== "PAID") {
        return { success: false, message: `결제가 완료되지 않은 상태입니다 (상태: ${paymentStatus})` };
      }

      // Check if amount matches expected amount
      if (typeof actualAmount !== "number" || Math.abs(actualAmount - args.amount) > 1) {
        // Amount mismatch - possible forgery! Cancel the payment using V2 Cancel API.
        await fetch(`https://api.portone.io/payments/${args.impUid}/cancel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `PortOne ${impSecret}`,
          },
          body: JSON.stringify({
            reason: "결제 금액 위변조 의심으로 인한 자동 환불",
          }),
        });

        return { success: false, message: "결제 금액 불일치로 자동 환불 처리되었습니다." };
      }

      // 4. Save order as "결제완료"
      const newOrderId = args.merchantUid;
      const today = new Date().toISOString().split("T")[0];

      await ctx.runMutation(api.orders.createOrUpdate, {
        id: newOrderId,
        date: today,
        items: args.items,
        totalPrice: args.amount,
        status: "결제완료",
        storeId: args.storeId,
        impUid: args.impUid,
        payMethod: "card",
      });

      return { success: true, message: "결제 검증 및 주문 등록이 완료되었습니다." };

    } catch (e: any) {
      console.error("Payment verification failed with error: ", e);
      return { success: false, message: `서버 오류 발생: ${e.message || e}` };
    }
  },
});
