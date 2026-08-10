import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

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
    deliveryAddress: v.optional(v.string()),
    deliveryDetailAddress: v.optional(v.string()),
    recipientName: v.optional(v.string()),
    recipientPhone: v.optional(v.string()),
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
        deliveryAddress: args.deliveryAddress,
        deliveryDetailAddress: args.deliveryDetailAddress,
        recipientName: args.recipientName,
        recipientPhone: args.recipientPhone,
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
        deliveryAddress: args.deliveryAddress,
        deliveryDetailAddress: args.deliveryDetailAddress,
        recipientName: args.recipientName,
        recipientPhone: args.recipientPhone,
      });

      return { success: true, message: "결제 검증 및 주문 등록이 완료되었습니다." };

    } catch (e: any) {
      console.error("Payment verification failed with error: ", e);
      return { success: false, message: `서버 오류 발생: ${e.message || e}` };
    }
  },
});

export const handlePortOneWebhook = internalAction({
  args: {
    paymentId: v.string(),
  },
  handler: async (ctx, args) => {
    const impSecret = process.env.PORTONE_API_SECRET;
    console.log(`[PortOne Webhook Handler] Processing paymentId: ${args.paymentId}`);

    let amount: number | undefined = undefined;
    let impUid: string = args.paymentId;
    let isPaid = true;

    if (impSecret) {
      try {
        const paymentResponse = await fetch(`https://api.portone.io/payments/${args.paymentId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `PortOne ${impSecret}`,
          },
        });

        if (paymentResponse.ok) {
          const paymentInfo = await paymentResponse.json();
          if (paymentInfo.status && paymentInfo.status !== "PAID") {
            console.warn(`[PortOne Webhook] Payment ${args.paymentId} status is not PAID: ${paymentInfo.status}`);
            isPaid = false;
          }
          amount = paymentInfo.amount?.total;
          if (paymentInfo.id) impUid = paymentInfo.id;
        } else {
          console.warn(`[PortOne Webhook] Fetch payment details failed with status ${paymentResponse.status}`);
        }
      } catch (err) {
        console.error("[PortOne Webhook] Error querying PortOne API:", err);
      }
    }

    if (!isPaid) {
      return { success: false, message: "Payment status is not PAID" };
    }

    const res: any = await ctx.runMutation(internal.orders.processPaidWebhookOrder, {
      paymentId: args.paymentId,
      impUid: impUid,
      amount: amount,
      payMethod: "card",
    });

    return { success: true, res };
  },
});
