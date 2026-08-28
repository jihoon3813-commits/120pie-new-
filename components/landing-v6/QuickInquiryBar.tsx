"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

interface QuickInquiryBarProps {
  isFixed?: boolean;
}

export default function QuickInquiryBar({ isFixed = true }: QuickInquiryBarProps) {
  const addInquiry = useMutation(api.inquiries.add);
  const sendEventSmsAction = useAction(api.aligo.sendEventSms);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [storeType, setStoreType] = useState("샵인샵 도입");
  const [submitting, setSubmitting] = useState(false);

  const [isAtFooter, setIsAtFooter] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFixed) return;
    if (!placeholderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 플레이스홀더가 화면에 감지되면(푸터 상단 경계 도달) fixed를 해제하고 absolute로 멈춤
        setIsAtFooter(entry.isIntersecting);
      },
      {
        rootMargin: "0px 0px 0px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(placeholderRef.current);
    return () => observer.disconnect();
  }, [isFixed]);

  const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    const clean = value.replace(/[^\d]/g, "");
    
    // 1. 전국 대표번호 (15xx, 16xx, 18xx 등 8자리 번호)
    if (/^(15|16|18|17)\d+/.test(clean) && !clean.startsWith("0")) {
      if (clean.length <= 4) return clean;
      return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
    }

    // 2. 서울 지역번호 (02)
    if (clean.startsWith("02")) {
      if (clean.length <= 2) return clean;
      if (clean.length <= 5) return `${clean.slice(0, 2)}-${clean.slice(2)}`;
      if (clean.length <= 9) return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 9)}`;
      return `${clean.slice(0, 2)}-${clean.slice(2, 6)}-${clean.slice(6, 10)}`;
    }

    // 3. 050 안심번호 (12자리: 0504-xxxx-xxxx 등)
    if (clean.startsWith("050") && clean.length > 11) {
      return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}`;
    }

    // 4. 일반 이동전화 및 지역번호 (010, 031, 042, 070 등)
    if (clean.length <= 3) return clean;
    if (clean.length <= 6) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    if (clean.length <= 10) {
      return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
    }
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}`;
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

      // 2. Aligo SMS 알림 전송 (Convex DB 연동 및 본사/고객 자동 발송)
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

        await sendEventSmsAction({
          eventKey: "consultation",
          variables: {
            name: name.trim(),
            phone: phone.trim(),
            storeType: storeType,
          },
          customerPhone: phone.trim(),
          overrideSettings: localSettings || undefined,
        });
      } catch (err) {
        console.error("SMS 전송 중 설정 오류:", err);
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

      // 3. 픽셀 광고 전환 이벤트 트래킹 (Meta / Karrot)
      if (typeof window !== "undefined") {
        if ((window as any).fbq) {
          try {
            (window as any).fbq('track', 'Lead', {
              content_name: 'QuickFranchiseInquiry',
              content_category: storeType
            });
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

  const renderContent = () => (
    <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 h-16 relative flex items-center justify-between">
      
      {/* Left Section: Model Photo & Call Text */}
      <div className="flex items-center pl-32">
        {/* Pop-out model photo bottom-aligned to the bar */}
        <img
          src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784086225/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_6%EC%9D%BC_%EC%98%A4%ED%9B%84_08_25_50_1_yw77w3.png"
          alt="120PIE 매장 전경"
          className="absolute bottom-0 left-4 h-[108px] w-auto object-contain z-10 pointer-events-none select-none"
        />
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-neutral-800 font-extrabold uppercase tracking-widest leading-none mb-1">120PIE Premium franchise</span>
          <a href="tel:1566-3594" className="text-sm font-black text-black tracking-tight leading-none hover:text-amber-900 transition-colors">가맹문의 1566-3594</a>
        </div>
      </div>

      {/* Right Section: Form Inputs */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Store Type Toggle */}
        <div className="flex bg-[#e6bd00]/50 p-0.5 rounded-xl border border-[#e6bd00]/60 mr-2">
          {["샵인샵 도입", "신규 가맹개설"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setStoreType(type)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-tight transition-all cursor-pointer border-0 ${
                storeType === type
                  ? "bg-[#1c1b1c] text-[#ffd500] shadow-sm"
                  : "text-neutral-800 hover:text-black hover:bg-white/10"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

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
          inputMode="tel"
          pattern="[0-9-]*"
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
  );

  if (!isFixed) {
    return (
      <div className="hidden md:block bg-[#ffd500] border-t border-[#e6bd00] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] relative z-[30] w-full">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="hidden md:block relative w-full h-16 pointer-events-none select-none">
      {/* Target marker that floats relatively in the flow above footer */}
      <div ref={placeholderRef} className="absolute inset-0 pointer-events-none" />
      
      {/* Actual moving bar */}
      <div className={`bg-[#ffd500] border-t border-[#e6bd00] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] pointer-events-auto select-text transition-all duration-300 ${
        isAtFooter 
          ? "absolute bottom-0 left-0 right-0 z-[95]" 
          : "fixed bottom-0 left-0 right-0 z-[95]"
      }`}>
        {renderContent()}
      </div>
    </div>
  );
}
