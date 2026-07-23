"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Sparkles, Send } from "lucide-react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import { triggerConsultationSms } from "@/app/utils/sms";

const PROMO_IMAGE_URL = optimizeCloudinaryUrl(
  "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784785773/d48a90a1-6173-48ee-91dd-966dde69d55c.png"
);

const KOREA_SIDO_LIST = [
  "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시",
  "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원특별자치도",
  "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"
];

export default function RightSideInquiryBanner() {
  const [isClosed, setIsClosed] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [regionSido, setRegionSido] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addInquiry = useMutation(api.inquiries.add);
  const sendSmsAction = useAction(api.aligo.sendSms);

  useEffect(() => {
    // 세션 혹은 오늘 하루 닫기 상태 확인 가능
    const hideBanner = sessionStorage.getItem("hide_right_inquiry_banner");
    if (hideBanner === "true") {
      setIsClosed(true);
    }
  }, []);

  const handleClose = () => {
    setIsClosed(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    let formatted = raw;
    if (raw.length <= 3) {
      formatted = raw;
    } else if (raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (phone.replace(/[^0-9]/g, "").length < 10) {
      alert("올바른 연락처를 입력해주세요.");
      return;
    }
    if (!privacyAgreed) {
      alert("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const locationStr = regionSido || "미선택";
      await addInquiry({
        name: name.trim(),
        phone: phone.trim(),
        storeType: locationStr,
        message: "[우측 300px 상담신청 배너 접수]",
        regDate: new Date().toISOString().split("T")[0],
      });

      // SMS 알림 발송
      try {
        await triggerConsultationSms(
          sendSmsAction,
          name.trim(),
          phone.trim(),
          locationStr
        );
      } catch (smsErr) {
        console.error("SMS notification failed:", smsErr);
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("신청 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isClosed) return null;

  return (
    <div className="hidden lg:block fixed right-[95px] sm:right-[110px] bottom-20 sm:bottom-24 z-[85] select-none animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Banner Container - Width 300px */}
      <div className="w-[300px] bg-neutral-900/95 backdrop-blur-lg border border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 hover:shadow-[0_25px_60px_rgba(251,196,0,0.15)] ring-1 ring-amber-500/20">
        
        {/* Header Bar */}
        <div className="bg-neutral-950 px-3.5 py-2 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#FBC400] animate-pulse" />
            <span className="text-xs font-black text-white tracking-tight">120PIE 빠른 창업 문의</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-neutral-800 cursor-pointer"
            title="닫기"
          >
            <X size={15} />
          </button>
        </div>

        {/* Promo Image */}
        <div className="relative w-full aspect-[4/3] bg-neutral-950 overflow-hidden">
          <img
            src={PROMO_IMAGE_URL}
            alt="120PIE 창업 혜택 배너"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Form Content Area */}
        <div className="p-3.5 space-y-3">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FBC400]/20 text-[#FBC400] flex items-center justify-center mx-auto">
                <Check size={20} className="stroke-[3]" />
              </div>
              <h4 className="text-sm font-black text-white">상담 신청 완료!</h4>
              <p className="text-[11px] text-neutral-400 font-medium">
                담당자 확인 후 빠르게 연락해 드리겠습니다.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-[10px] text-amber-400 underline cursor-pointer"
              >
                추가 문의하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* 이름 */}
              <div>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800/90 border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FBC400] transition-colors"
                />
              </div>

              {/* 연락처 */}
              <div>
                <input
                  type="tel"
                  placeholder="연락처 (예: 010-0000-0000)"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  className="w-full px-3 py-2 bg-neutral-800/90 border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#FBC400] transition-colors"
                />
              </div>

              {/* 희망지역 */}
              <div>
                <select
                  value={regionSido}
                  onChange={(e) => setRegionSido(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800/90 border border-neutral-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-[#FBC400] transition-colors cursor-pointer"
                >
                  <option value="">희망지역 선택</option>
                  {KOREA_SIDO_LIST.map((sido) => (
                    <option key={sido} value={sido} className="bg-neutral-900 text-white">
                      {sido}
                    </option>
                  ))}
                </select>
              </div>

              {/* 개인정보 동의 */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-1.5 text-[10px] text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#FBC400] rounded cursor-pointer"
                  />
                  <span>개인정보 수집/이용 동의</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#FBC400] hover:bg-amber-400 text-neutral-950 font-black text-xs rounded-xl transition-all duration-300 shadow-md shadow-[#FBC400]/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>접수 중...</span>
                ) : (
                  <>
                    <span>빠른 창업 문의하기</span>
                    <Send size={12} className="stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
