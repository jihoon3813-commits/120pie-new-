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
      const rawCustomerSender = (eventConfig.customer.sender || "1566-3594").replace(/[^0-9]/g, "");
      const formattedReceiver = phone.replace(/[^0-9]/g, "");
      const formattedSender = (rawCustomerSender === formattedReceiver) ? "15663594" : rawCustomerSender;

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
        alert(`[고객용 SMS 발송 - 시뮬레이션]\n\n보낸사람: ${formattedSender}\n받는사람(고객): ${formattedReceiver}\n\n내용:\n${msg}`);
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
        const baseSender = (eventConfig.admin.sender || "1566-3594").replace(/[^0-9]/g, "");

        for (const rawAdminPhone of adminReceivers) {
          const formattedReceiver = rawAdminPhone.replace(/[^0-9]/g, "");
          if (!formattedReceiver || formattedReceiver.length < 8) continue;
          const formattedSender = (baseSender === formattedReceiver) ? "15663594" : baseSender;

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
            alert(`[관리자용 SMS 발송 - 시뮬레이션]\n\n보낸사람: ${formattedSender}\n받는사람(관리자): ${formattedReceiver}\n\n내용:\n${msg}`);
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed to send consultation SMS:", e);
  }
};
