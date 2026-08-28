import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const DEFAULT_SMS_SETTINGS: any = {
  aligoKey: process.env.ALIGO_API_KEY || "",
  aligoUserId: process.env.ALIGO_USER_ID || "",
  aligoTestMode: false,
  store_reg: {
    customer: {
      isActive: true,
      sender: "010-2666-0883",
      template: "[120겹파이] 가맹점 등록 신청이 완료되었습니다. 본사 검토 후 연락드리겠습니다. ID: {storeId}, 가맹점명: {storeName}."
    },
    admin: {
      isActive: true,
      sender: "010-2666-0883",
      receivers: ["010-4322-3813", "010-9114-4358"],
      template: "[120겹파이] 신규 가맹점 등록 신청이 접수되었습니다. ID: {storeId}, 가맹점명: {storeName}, 점주명: {owner}, 연락처: {phone}."
    }
  },
  order_card: {
    customer: {
      isActive: true,
      sender: "010-2666-0883",
      template: "[120겹파이] 카드 결제 자재 주문이 정상 완료되었습니다. 주문ID: {orderId}, 결제금액: {amount}원. 신속하게 배송해 드리겠습니다."
    },
    admin: {
      isActive: true,
      sender: "010-2666-0883",
      receivers: ["010-4322-3813", "010-9114-4358"],
      template: "[120겹파이] {storeName} 가맹점의 카드 결제 자재 발주가 완료되었습니다. 주문ID: {orderId}, 금액: {amount}원."
    }
  },
  order_cash: {
    customer: {
      isActive: true,
      sender: "010-2666-0883",
      template: "[120겹파이] 무통장입금 자재 주문이 접수되었습니다. 주문ID: {orderId}, 입금예정금액: {amount}원. K뱅크 700-120-270001 (주)고우웰라이프. 입금 확인 시 배송이 개시됩니다."
    },
    admin: {
      isActive: true,
      sender: "010-2666-0883",
      receivers: ["010-4322-3813", "010-9114-4358"],
      template: "[120겹파이] {storeName} 가맹점의 무통장입금 자재 발주가 신청되었습니다. 주문ID: {orderId}, 금액: {amount}원. 입금 확인이 필요합니다."
    }
  },
  consultation: {
    customer: {
      isActive: true,
      sender: "010-2666-0883",
      template: "[120겹파이] 무료 가맹 상담 신청이 정상 접수되었습니다. 빠른 시간 내에 전문 컨설턴트가 연락드리겠습니다. 신청자: {name}님."
    },
    admin: {
      isActive: true,
      sender: "010-2666-0883",
      receivers: ["010-4322-3813", "010-9114-4358"],
      template: "[120겹파이] 홈페이지에 새로운 상담문의가 접수되었습니다. 이름: {name}, 연락처: {phone}, 점포유형: {storeType}."
    }
  },
  inquiry_1to1: {
    customer: {
      isActive: true,
      sender: "010-2666-0883",
      template: "[120겹파이] 1:1 문의가 성공적으로 접수되었습니다. 담당 부서 확인 후 빠르게 답변드리겠습니다. 문의유형: {category}, 제목: {title}."
    },
    admin: {
      isActive: true,
      sender: "010-2666-0883",
      receivers: ["010-4322-3813", "010-9114-4358"],
      template: "[120겹파이] {storeName} 가맹점에서 새로운 1:1 문의를 등록했습니다. 제목: {title}, 유형: {category}."
    }
  }
};

async function executeAligoSend(args: {
  key: string;
  userId: string;
  sender: string;
  receiver: string;
  msg: string;
  isTest?: boolean;
}) {
  console.log(`[Aligo SMS Action] Preparing to send to ${args.receiver}...`);
  
  const params = new URLSearchParams();
  params.append("key", args.key);
  params.append("user_id", args.userId);
  params.append("sender", args.sender);
  params.append("receiver", args.receiver);
  params.append("msg", args.msg);
  
  // Calculate EUC-KR byte length for accurate SMS (<=90 bytes) vs LMS (>90 bytes) switching
  let byteLen = 0;
  for (let i = 0; i < args.msg.length; i++) {
    const code = args.msg.charCodeAt(i);
    byteLen += code > 127 ? 2 : 1;
  }

  const isLms = byteLen > 90;
  params.append("msg_type", isLms ? "LMS" : "SMS");
  
  if (isLms) {
    const firstLine = args.msg.split("\n")[0].replace(/[\[\]]/g, "").trim();
    params.append("title", firstLine ? `[120겹파이] ${firstLine.slice(0, 20)}` : "[120겹파이 안내]");
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
  console.log(`[Aligo API Result for ${args.receiver}]:`, result);
  
  return {
    success: result.result_code === "1" || result.result_code === 1 || String(result.result_code) === "1",
    message: result.message,
    msgId: result.msg_id,
    code: result.result_code
  };
}

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
      return await executeAligoSend(args);
    } catch (error: any) {
      console.error("[Aligo SMS Error]:", error);
      return {
        success: false,
        error: error.message || String(error)
      };
    }
  }
});

async function handleEventSms(
  ctx: any,
  args: {
    eventKey: string;
    variables: Record<string, string>;
    customerPhone?: string;
    overrideSettings?: any;
  }
) {
  try {
    let dbSettings: any = null;
    try {
      dbSettings = await ctx.runQuery((internal as any).smsSettings.getInternal, {});
    } catch (e) {
      console.warn("Failed to fetch smsSettings from DB:", e);
    }

    const mergedSettings: any = {
      ...DEFAULT_SMS_SETTINGS,
      ...(dbSettings || {}),
      ...(args.overrideSettings || {})
    };

    const aligoKey = mergedSettings.aligoKey || process.env.ALIGO_API_KEY || "";
    const aligoUserId = mergedSettings.aligoUserId || process.env.ALIGO_USER_ID || "";
    const isTestMode = mergedSettings.aligoTestMode === true;

    const eventConfig = mergedSettings[args.eventKey] || DEFAULT_SMS_SETTINGS[args.eventKey];
    if (!eventConfig) {
      console.warn(`[Aligo Event SMS] Event config not found for key: ${args.eventKey}`);
      return { success: false, error: `Event config not found for: ${args.eventKey}` };
    }

    if (!aligoKey || !aligoUserId) {
      console.warn(`[Aligo Event SMS] Missing Aligo API credentials (key / userId). Cannot send.`);
      return { success: false, error: "알리고 API Key 또는 User ID가 설정되지 않았습니다." };
    }

    const results: any[] = [];
    let customerSent = false;
    let adminSentCount = 0;

    // 1. 고객/점주용 발송
    if (eventConfig.customer && eventConfig.customer.isActive !== false) {
      const rawTargetPhone = args.customerPhone || args.variables.phone || "";
      const customerPhone = rawTargetPhone.replace(/[^0-9]/g, "");

      if (customerPhone && customerPhone.length >= 8) {
        let msg = eventConfig.customer.template || "";
        Object.entries(args.variables).forEach(([k, v]) => {
          msg = msg.replace(new RegExp(`{${k}}`, "g"), v || "");
        });

        const rawCustomerSender = (eventConfig.customer.sender || "010-2666-0883").replace(/[^0-9]/g, "");
        const formattedSender = (rawCustomerSender === customerPhone) ? "15663594" : rawCustomerSender;

        try {
          const res = await executeAligoSend({
            key: aligoKey,
            userId: aligoUserId,
            sender: formattedSender || "01026660883",
            receiver: customerPhone,
            msg: msg,
            isTest: isTestMode
          });
          results.push({ type: "customer", phone: customerPhone, ...res });
          if (res.success) customerSent = true;
        } catch (custErr: any) {
          console.error("[Aligo Customer SMS Error]:", custErr);
          results.push({ type: "customer", phone: customerPhone, success: false, error: custErr.message });
        }
      }
    }

    // 2. 관리자용 발송
    if (eventConfig.admin && eventConfig.admin.isActive !== false) {
      const rawReceivers: string[] = Array.isArray(eventConfig.admin.receivers) && eventConfig.admin.receivers.length > 0
        ? eventConfig.admin.receivers
        : ["010-4322-3813", "010-9114-4358"];

      let msg = eventConfig.admin.template || "";
      Object.entries(args.variables).forEach(([k, v]) => {
        msg = msg.replace(new RegExp(`{${k}}`, "g"), v || "");
      });

      const baseSender = (eventConfig.admin.sender || "010-2666-0883").replace(/[^0-9]/g, "");

      for (const r of rawReceivers) {
        const adminPhone = (r || "").replace(/[^0-9]/g, "");
        if (!adminPhone || adminPhone.length < 8) continue;

        const formattedSender = (baseSender === adminPhone) ? "15663594" : (baseSender || "01026660883");

        try {
          const res = await executeAligoSend({
            key: aligoKey,
            userId: aligoUserId,
            sender: formattedSender,
            receiver: adminPhone,
            msg: msg,
            isTest: isTestMode
          });
          results.push({ type: "admin", phone: adminPhone, ...res });
          if (res.success) adminSentCount++;
        } catch (adminErr: any) {
          console.error(`[Aligo Admin SMS Error to ${adminPhone}]:`, adminErr);
          results.push({ type: "admin", phone: adminPhone, success: false, error: adminErr.message });
        }
      }
    }

    return {
      success: customerSent || adminSentCount > 0,
      customerSent,
      adminSentCount,
      results
    };
  } catch (globalErr: any) {
    console.error("[Aligo handleEventSms Error]:", globalErr);
    return {
      success: false,
      error: globalErr.message || String(globalErr)
    };
  }
}

export const sendEventSms = action({
  args: {
    eventKey: v.string(),
    variables: v.record(v.string(), v.string()),
    customerPhone: v.optional(v.string()),
    overrideSettings: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await handleEventSms(ctx, args);
  }
});

export const sendEventSmsInternal = internalAction({
  args: {
    eventKey: v.string(),
    variables: v.record(v.string(), v.string()),
    customerPhone: v.optional(v.string()),
    overrideSettings: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await handleEventSms(ctx, args);
  }
});
