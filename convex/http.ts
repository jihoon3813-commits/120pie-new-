import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/portone-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    try {
      const body = await req.json();
      console.log("[PortOne Webhook] Payload received:", JSON.stringify(body));

      const paymentId =
        body.data?.paymentId ||
        body.paymentId ||
        body.merchant_uid ||
        body.payment_id;

      if (paymentId) {
        await ctx.runAction(internal.payments.handlePortOneWebhook, { paymentId });
      }

      return new Response(JSON.stringify({ status: "ok", receivedId: paymentId }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      console.error("[PortOne Webhook Error]", err);
      return new Response(JSON.stringify({ status: "error", message: err.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
