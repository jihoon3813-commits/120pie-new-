/**
 * 실시간 SMS 알림 발송 공통 유틸리티
 */

export const triggerConsultationSms = async (
  sendSmsAction: any,
  name: string,
  phone: string,
  storeType: string
) => {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem("120_sms_settings");
  if (!stored) return;

  try {
    const smsSettings = JSON.parse(stored);
    const eventConfig = smsSettings.consultation;
    if (!eventConfig) return;

    const variables = { name, phone, storeType };
    const hasAligoCreds = smsSettings.aligoKey && smsSettings.aligoUserId;

    // 1. 고객용 발송 (Customer-facing)
    if (eventConfig.customer && eventConfig.customer.isActive) {
      let msg = eventConfig.customer.template;
      Object.entries(variables).forEach(([key, val]) => {
        msg = msg.replace(new RegExp(`{${key}}`, "g"), val);
      });
      const formattedSender = eventConfig.customer.sender.replace(/[^0-9]/g, "");
      const formattedReceiver = phone.replace(/[^0-9]/g, "");

      if (hasAligoCreds) {
        await sendSmsAction({
          key: smsSettings.aligoKey,
          userId: smsSettings.aligoUserId,
          sender: formattedSender,
          receiver: formattedReceiver,
          msg: msg,
          isTest: smsSettings.aligoTestMode !== false
        }).catch((err: any) => console.error("Consultation customer SMS error", err));
      } else {
        // Simulation fallback
        alert(`[고객용 SMS 발송 - 시뮬레이션]\n\n보낸사람: ${eventConfig.customer.sender}\n받는사람(고객): ${phone}\n\n내용:\n${msg}`);
      }
    }

    // 2. 관리자용 발송 (Admin-facing)
    if (eventConfig.admin && eventConfig.admin.isActive) {
      const adminReceivers = eventConfig.admin.receivers || [];
      if (adminReceivers.length > 0) {
        let msg = eventConfig.admin.template;
        Object.entries(variables).forEach(([key, val]) => {
          msg = msg.replace(new RegExp(`{${key}}`, "g"), val);
        });
        const formattedSender = eventConfig.admin.sender.replace(/[^0-9]/g, "");
        const formattedReceiver = adminReceivers.map((num: string) => num.replace(/[^0-9]/g, "")).join(",");

        if (hasAligoCreds) {
          await sendSmsAction({
            key: smsSettings.aligoKey,
            userId: smsSettings.aligoUserId,
            sender: formattedSender,
            receiver: formattedReceiver,
            msg: msg,
            isTest: smsSettings.aligoTestMode !== false
          }).catch((err: any) => console.error("Consultation admin SMS error", err));
        } else {
          // Simulation fallback
          alert(`[관리자용 SMS 발송 - 시뮬레이션]\n\n보낸사람: ${eventConfig.admin.sender}\n받는사람(관리자): ${adminReceivers.join(", ")}\n\n내용:\n${msg}`);
        }
      }
    }
  } catch (e) {
    console.error("Failed to send consultation SMS:", e);
  }
};
