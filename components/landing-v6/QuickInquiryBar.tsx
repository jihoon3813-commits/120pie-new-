"use client";

import { useState, FormEvent } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function QuickInquiryBar() {
  const addInquiry = useMutation(api.inquiries.add);
  const sendSmsAction = useAction(api.aligo.sendSms);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [storeType, setStoreType] = useState("샵인샵 도입");
  const [submitting, setSubmitting] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^\d]/g, "");
    if (raw.length < 4) return raw;
    if (raw.length < 8) {
      return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    }
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const handlePhoneChange = (val: string) => {
    setPhone(formatPhoneNumber(val));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("이름과 연락처를 모두 입력해 주세요.");
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
      alert("올바른 연락처 형식을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Convex DB 저장
      await addInquiry({
        name: name.trim(),
        phone: phone.trim(),
        storeType: storeType,
        existingStoreName: "",
        message: "[빠른상담바 신청]",
        regDate: new Date().toISOString().split("T")[0]
      });

      // 2. Aligo SMS 알림 전송 (ContactForm.tsx와 동일 로직)
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("120_sms_settings");
        if (stored) {
          try {
            const smsSettings = JSON.parse(stored);
            const eventConfig = smsSettings.consultation;
            if (eventConfig) {
              const hasAligoCreds = smsSettings.aligoKey && smsSettings.aligoUserId;

              // 고객용 발송
              if (eventConfig.customer && eventConfig.customer.isActive) {
                let msg = eventConfig.customer.template;
                msg = msg.replace(/{name}/g, name.trim());
                msg = msg.replace(/{phone}/g, phone.trim());
                msg = msg.replace(/{storeType}/g, storeType);

                const formattedSender = eventConfig.customer.sender.replace(/[^0-9]/g, "");
                const formattedReceiver = phone.replace(/[^0-9]/g, "");

                if (hasAligoCreds) {
                  sendSmsAction({
                    key: smsSettings.aligoKey,
                    userId: smsSettings.aligoUserId,
                    sender: formattedSender,
                    receiver: formattedReceiver,
                    msg: msg,
                    isTest: smsSettings.aligoTestMode !== false,
                  }).catch(console.error);
                }
              }

              // 관리자용 발송
              if (eventConfig.admin && eventConfig.admin.isActive) {
                const adminReceivers = eventConfig.admin.receivers || [];
                if (adminReceivers.length > 0) {
                  let msg = eventConfig.admin.template;
                  msg = msg.replace(/{name}/g, name.trim());
                  msg = msg.replace(/{phone}/g, phone.trim());
                  msg = msg.replace(/{storeType}/g, storeType);

                  const formattedSender = eventConfig.admin.sender.replace(/[^0-9]/g, "");
                  const formattedReceiver = adminReceivers.map((num: string) => num.replace(/[^0-9]/g, "")).join(",");

                  if (hasAligoCreds) {
                    sendSmsAction({
                      key: smsSettings.aligoKey,
                      userId: smsSettings.aligoUserId,
                      sender: formattedSender,
                      receiver: formattedReceiver,
                      msg: msg,
                      isTest: smsSettings.aligoTestMode !== false,
                    }).catch(console.error);
                  }
                }
              }
            }
          } catch (err) {
            console.error("SMS 전송 중 설정 오류:", err);
          }
        }
      }

      // 3. 트래킹 이벤트 호출
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "inquiry_submit",
          path: window.location.pathname,
          referrer: document.referrer || "direct"
        })
      }).catch(err => console.error("InquirySubmit tracking failed", err));

      if (typeof window !== "undefined") {
        if ((window as any).wcs) {
          try {
            if (!(window as any).wcs_add) (window as any).wcs_add = {};
            (window as any).wcs_add["wa"] = process.env.NEXT_PUBLIC_NAVER_AD_ACCOUNT_ID || "s_15663594120p";
            const _nasa = {} as any;
            _nasa["cnv"] = (window as any).wcs.cnv("4", "10");
            (window as any).wcs_do(_nasa);
          } catch (e) {}
        }
        if ((window as any).karrotPixel) {
          try {
            (window as any).karrotPixel.track('SubmitApplication');
          } catch (e) {}
        }
      }

      alert("빠른 상담 신청이 성공적으로 완료되었습니다!");
      setName("");
      setPhone("");
    } catch (error) {
      console.error("빠른 상담 전송 실패:", error);
      alert("전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hidden md:block fixed bottom-0 left-0 right-0 z-[95] bg-[#ffd500] border-t border-[#e6bd00] shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
      <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 h-16 relative flex items-center justify-between">
        
        {/* Left Section: Model Photo & Call Text */}
        <div className="flex items-center pl-36">
          {/* Pop-out model photo bottom-aligned to the bar */}
          <img
            src="https://res.cloudinary.com/lyjyvy54/image/upload/v1784086225/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_6%EC%9D%BC_%EC%98%A4%ED%9B%84_08_25_50_1_yw77w3.png"
            alt="전속모델 박은영"
            className="absolute bottom-0 left-4 h-26 w-auto object-contain z-10 pointer-events-none select-none"
          />
          <div className="flex flex-col justify-center">
            <span className="text-[8px] font-bold text-neutral-800/80 leading-none mb-0.5 block">
              120겹의 마법, 120PIE
            </span>
            <h3 className="font-extrabold text-[#0d233a] text-base tracking-tight flex items-center gap-1.5 leading-none">
              빠른 창업문의 <span className="font-black text-lg tracking-tighter ml-1">1566-3594</span>
            </h3>
          </div>
        </div>

        {/* Right Section: Form inputs */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <select
            value={storeType}
            onChange={(e) => setStoreType(e.target.value)}
            className="h-10 bg-white border border-[#e6dfc3] text-[#0d233a] font-bold rounded-xl px-3 text-xs focus:outline-none transition-all cursor-pointer hover:border-[#bf3e67]/30"
          >
            <option value="샵인샵 도입">샵인샵 도입</option>
            <option value="브랜드 병기 도입">브랜드 병기 도입</option>
            <option value="공동간판 제휴">공동간판 제휴</option>
            <option value="단독 매장 전환">단독 매장 전환</option>
            <option value="신규 무점포/창업">신규 무점포/창업</option>
          </select>

          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10 w-28 bg-white border border-[#e6dfc3] text-[#0d233a] font-bold rounded-xl px-3 text-xs placeholder:text-[#7d8c9e] focus:outline-none focus:border-[#bf3e67]/30 transition-all"
          />

          <input
            type="tel"
            placeholder="연락처"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            required
            maxLength={13}
            className="h-10 w-36 bg-white border border-[#e6dfc3] text-[#0d233a] font-bold rounded-xl px-3 text-xs placeholder:text-[#7d8c9e] focus:outline-none focus:border-[#bf3e67]/30 transition-all"
          />

          <button
            type="submit"
            disabled={submitting}
            className="h-10 bg-[#1c1b1c] hover:bg-black text-[#ffd500] font-black rounded-xl px-5 text-xs transition-all cursor-pointer border-0 shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center hover:scale-[1.02] active:scale-95 disabled:opacity-55"
          >
            {submitting ? "신청 중..." : "빠른 창업 문의"}
          </button>
        </form>

      </div>
    </div>
  );
}
