/**
 * 실시간 SMS 알림 발송 공통 유틸리티
 */

export const triggerConsultationSms = async (
  sendSmsAction: any,
  name: string,
  phone: string,
  storeType: string
) => {
  try {
    let localSettings: any = null;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("120_sms_settings");
      if (stored) {
        try {
          localSettings = JSON.parse(stored);
        } catch (e) {}
      }
    }

    if (typeof sendSmsAction === "function") {
      try {
        const res = await sendSmsAction({
          eventKey: "consultation",
          variables: { name, phone, storeType },
          customerPhone: phone,
          overrideSettings: localSettings || undefined,
        });
        console.log("[triggerConsultationSms Result]:", res);
        return res;
      } catch (eventErr) {
        console.warn("sendEventSms call failed, checking legacy parameters:", eventErr);
      }
    }
  } catch (e) {
    console.error("Failed to send consultation SMS:", e);
  }
};
