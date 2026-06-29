import { internalAction } from "./_generated/server";
import { v } from "convex/values";

const WEBHOOK_URLS = {
  consultation: process.env.DISCORD_WEBHOOK_CONSULTATION || "https://discordapp.com/api/webhooks/1512652100797206658/PZjz-kVzXOilJTURjfGN8xytCAmugZaLr1s12DxS75qtWufrRDircaOaOiA_4WjS3MxH",
  order: process.env.DISCORD_WEBHOOK_ORDER || "https://discordapp.com/api/webhooks/1512653089533071514/MHR-zmP88vy-j2YX56rew1MJgzZpKi4OoSKkX_7ZPxpksMwKFM6zW1U2YgihzP5p83FR",
  inquiry: process.env.DISCORD_WEBHOOK_INQUIRY || "https://discordapp.com/api/webhooks/1512653558481293462/l8ILxfEra6_IjwLabybmutu9S4XOAL7z4eU2pC2o5NJt4YLAWm3N1Kp6pRB9V0qZL35o"
};

async function sendDiscordMessage(url: string, content: string) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    });
    if (!response.ok) {
      console.error(`Failed to send Discord notification: status ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending Discord webhook:", error);
  }
}

export const notifyConsultation = internalAction({
  args: {
    name: v.string(),
    phone: v.string(),
    storeType: v.string(),
    existingStoreName: v.optional(v.string()),
    message: v.optional(v.string()),
    regDate: v.string(),
  },
  handler: async (ctx, args) => {
    const message = [
      `🔔 **[120겹파이] 새로운 가맹 상담 신청**`,
      `• **신청자명:** ${args.name}`,
      `• **연락처:** ${args.phone}`,
      `• **점포유형:** ${args.storeType}${args.existingStoreName ? ` (${args.existingStoreName})` : ""}`,
      `• **상담내용:** ${args.message || "없음"}`,
      `• **신청일시:** ${args.regDate}`
    ].join("\n");
    
    await sendDiscordMessage(WEBHOOK_URLS.consultation, message);
  }
});

export const notifyOrder = internalAction({
  args: {
    id: v.string(),
    date: v.string(),
    storeId: v.optional(v.string()),
    storeName: v.optional(v.string()),
    totalPrice: v.number(),
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
    payMethod: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const storeInfo = args.storeName 
      ? `${args.storeName} (${args.storeId || "알수없음"})`
      : (args.storeId || "알수없음");
      
    const itemsText = args.items.map(
      (item) => `  - ${item.productName} ${item.quantity}개 (${item.price.toLocaleString()}원)${item.selectedOption ? ` [옵션: ${item.selectedOption}]` : ""}`
    ).join("\n");

    const deliveryText = args.deliveryAddress
      ? `\n• **배송지:** ${args.deliveryAddress}${args.deliveryDetailAddress ? ` ${args.deliveryDetailAddress}` : ""}\n• **받는 분:** ${args.recipientName || "-"}\n• **연락처:** ${args.recipientPhone || "-"}`
      : "";

    const payMethodName = args.payMethod === "bank" ? "무통장입금" : (args.payMethod === "card" || args.payMethod === "CARD" ? "신용카드" : args.payMethod || "신용카드");
    const statusLabel = args.status || "접수완료";

    const message = [
      `🛒 **[120겹파이] 새로운 발주 주문 접수**`,
      `• **주문 ID:** ${args.id}`,
      `• **가맹점명:** ${storeInfo}`,
      `• **주문 일자:** ${args.date}`,
      `• **주문 내역:**`,
      itemsText,
      `• **총 금액:** ${args.totalPrice.toLocaleString()}원`,
      `• **결제 상태:** ${payMethodName} (${statusLabel})${deliveryText}`
    ].join("\n");

    await sendDiscordMessage(WEBHOOK_URLS.order, message);
  }
});

export const notifyInquiry = internalAction({
  args: {
    id: v.string(),
    storeId: v.string(),
    storeName: v.string(),
    category: v.string(),
    title: v.string(),
    content: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const message = [
      `💬 **[120겹파이] 새로운 1:1 문의 접수**`,
      `• **문의 ID:** ${args.id}`,
      `• **가맹점명:** ${args.storeName} (${args.storeId})`,
      `• **문의 분류:** ${args.category}`,
      `• **제목:** ${args.title}`,
      `• **내용:** ${args.content}`,
      `• **접수일자:** ${args.date}`
    ].join("\n");

    await sendDiscordMessage(WEBHOOK_URLS.inquiry, message);
  }
});
