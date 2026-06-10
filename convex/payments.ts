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
      // 1. Get access token from PortOne V1 API
      const tokenResponse = await fetch("https://api.iamport.kr/users/getToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imp_key: impKey,
          imp_secret: impSecret,
        }),
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        return { success: false, message: `포트원 토큰 발급 실패: ${errText}` };
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.response?.access_token;
      if (!accessToken) {
        return { success: false, message: "포트원 토큰 데이터가 유효하지 않습니다." };
      }

      // 2. Get payment info from PortOne V1 API
      const paymentResponse = await fetch(`https://api.iamport.kr/payments/${args.impUid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken,
        },
      });

      if (!paymentResponse.ok) {
        const errText = await paymentResponse.text();
        return { success: false, message: `포트원 결제내역 조회 실패: ${errText}` };
      }

      const paymentData = await paymentResponse.json();
      const paymentInfo = paymentData.response;

      if (!paymentInfo) {
        return { success: false, message: "포트원 서버에 해당 결제 내역이 존재하지 않습니다." };
      }

      // 3. Compare amounts and status
      const actualAmount = paymentInfo.amount;
      const paymentStatus = paymentInfo.status; // V1 결제 완료 상태는 "paid"

      if (paymentStatus !== "paid") {
        return { success: false, message: `결제가 완료되지 않은 상태입니다 (상태: ${paymentStatus})` };
      }

      // Check if amount matches expected amount
      if (typeof actualAmount !== "number" || Math.abs(actualAmount - args.amount) > 1) {
        // Amount mismatch - possible forgery! Cancel the payment.
        await fetch("https://api.iamport.kr/payments/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": accessToken,
          },
          body: JSON.stringify({
            imp_uid: args.impUid,
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
