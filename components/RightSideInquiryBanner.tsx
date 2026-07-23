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

const REGION_DATA: Record<string, string[]> = {
  "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  "부산광역시": ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구", "기장군"],
  "대구광역시": ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
  "인천광역시": ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  "광주광역시": ["동구", "서구", "남구", "북구", "광산구"],
  "대전광역시": ["동구", "중구", "서구", "유성구", "대덕구"],
  "울산광역시": ["중구", "남구", "동구", "북구", "울주군"],
  "세종특별자치시": ["세종시"],
  "경기도": ["수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시", "평택시", "의정부시", "파주시", "시흥시", "김포시", "광명시", "광주시", "군포시", "이천시", "오산시", "하남시", "양주시", "구리시", "안성시", "포천시", "의왕시", "여주시", "양평군", "동두천시", "가평군", "연천군"],
  "강원특별자치도": ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  "충청북도": ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
  "충청남도": ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
  "전북특별자치도": ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
  "전라남도": ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  "경상북도": ["포항시", "경주시", "김천시", "안동시", "구미시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
  "경상남도": ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
  "제주특별자치도": ["제주시", "서귀포시"]
};

export default function RightSideInquiryBanner() {
  const [isClosed, setIsClosed] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [regionSido, setRegionSido] = useState("");
  const [regionGugun, setRegionGugun] = useState("");
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addInquiry = useMutation(api.inquiries.add);
  const sendSmsAction = useAction(api.aligo.sendSms);

  useEffect(() => {
    const hideBanner = sessionStorage.getItem("hide_right_inquiry_banner");
    if (hideBanner === "true") {
      setIsClosed(true);
    }
  }, []);

  const handleClose = () => {
    setIsClosed(true);
  };

  const handleSidoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRegionSido(val);
    setRegionGugun("");
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
      const locationStr = `${regionSido || "미선택"} ${regionGugun || ""}`.trim();
      await addInquiry({
        name: name.trim(),
        phone: phone.trim(),
        storeType: locationStr,
        message: "[우측 250px 빠른상담 배너 접수]",
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
    <>
      <style jsx global>{`
        @keyframes gentleFloatBanner {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-9px);
          }
        }
        .animate-gentle-float-banner {
          animation: gentleFloatBanner 3.2s ease-in-out infinite;
        }
      `}</style>
      <div className="hidden lg:block fixed right-2.5 sm:right-6 bottom-[460px] sm:bottom-[490px] z-[85] select-none animate-gentle-float-banner">
        {/* Banner Container - Width 250px, 4px White Border, Positioned Vertically Above Floating Quick Bar */}
        <div className="w-[250px] bg-white border-4 border-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 hover:shadow-[0_25px_60px_rgba(251,196,0,0.4)] ring-1 ring-neutral-300 hover:translate-y-0">
        
        {/* Header Bar - Black */}
        <div className="bg-neutral-950 px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#FBC400] animate-pulse" />
            <span className="text-xs font-black text-white tracking-tight">120PIE 창업 문의</span>
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

        {/* Promo Image - Aspect Ratio 3:4 */}
        <div className="relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden border-b border-neutral-100">
          <img
            src={PROMO_IMAGE_URL}
            alt="120PIE 창업 혜택 배너"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
          />
        </div>

        {/* Form Area - White BG with Generous Padding */}
        <div className="p-4 space-y-3 bg-white">
          {isSubmitted ? (
            <div className="py-5 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FBC400] text-neutral-950 flex items-center justify-center mx-auto shadow-sm">
                <Check size={20} className="stroke-[3]" />
              </div>
              <h4 className="text-sm font-black text-neutral-900">상담 신청 완료!</h4>
              <p className="text-[11px] text-neutral-500 font-semibold leading-snug">
                담당자가 확인 후 빠르게 연락드리겠습니다.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-1 text-[10px] font-bold text-amber-600 underline cursor-pointer"
              >
                추가 문의하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* 이름 입력 */}
              <div>
                <input
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 font-medium focus:outline-none focus:bg-white focus:border-[#FBC400] focus:ring-1 focus:ring-[#FBC400] transition-all"
                />
              </div>

              {/* 연락처 입력 (자동 하이픈) */}
              <div>
                <input
                  type="tel"
                  placeholder="연락처 (예: 010-0000-0000)"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={13}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder-neutral-400 font-medium focus:outline-none focus:bg-white focus:border-[#FBC400] focus:ring-1 focus:ring-[#FBC400] transition-all"
                />
              </div>

              {/* 지역 선택: 시/도 및 시/군/구 2개 분리 */}
              <div className="grid grid-cols-2 gap-1.5">
                <select
                  value={regionSido}
                  onChange={handleSidoChange}
                  className="w-full px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-medium focus:outline-none focus:bg-white focus:border-[#FBC400] transition-all cursor-pointer"
                >
                  <option value="">시/도 선택</option>
                  {Object.keys(REGION_DATA).map((sido) => (
                    <option key={sido} value={sido}>
                      {sido}
                    </option>
                  ))}
                </select>

                <select
                  value={regionGugun}
                  onChange={(e) => setRegionGugun(e.target.value)}
                  disabled={!regionSido}
                  className="w-full px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 font-medium focus:outline-none focus:bg-white focus:border-[#FBC400] transition-all cursor-pointer disabled:opacity-50"
                >
                  <option value="">시/군/구</option>
                  {regionSido &&
                    REGION_DATA[regionSido]?.map((gugun) => (
                      <option key={gugun} value={gugun}>
                        {gugun}
                      </option>
                    ))}
                </select>
              </div>

              {/* 개인정보 동의 */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 text-[10px] text-neutral-600 font-semibold cursor-pointer">
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
                className="w-full py-2.5 bg-neutral-950 hover:bg-black text-[#FBC400] font-black text-xs rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-1 border border-neutral-900"
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
  </>
);
}
