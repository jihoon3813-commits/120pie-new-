"use client";

import { FormEvent, useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PhoneCall, CheckCircle2, AlertCircle } from "lucide-react";

const storeTypes = [
  "예비 창업자",
  "기존 카페 운영 중",
  "저가커피 매장 운영 중",
  "디저트 카페 운영 중",
  "배달형 매장 운영 중",
  "기타",
];

const goals = [
  "객단가 상승",
  "디저트 매출 강화",
  "샵인샵 도입",
  "창업비용 확인",
  "박람회 방문",
  "배달 메뉴 강화",
];

const menus = ["120겹 파이", "에그120", "둘 다", "아직 모르겠음"];

const initialForm = {
  name: "",
  phone: "",
  region: "",
  storeStatus: "",
  storeName: "",
  storeSize: "",
  currentBusiness: "",
  goal: "",
  interestedMenu: "",
  preferredTime: "",
  message: "",
};

export default function ConsultationForm({
  onSuccessClose,
}: {
  onSuccessClose?: () => void;
}) {
  const sendSmsAction = useAction(api.aligo.sendSms);
  const addInquiry = useMutation(api.inquiries.add);

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const raw = value.replace(/[^\d]/g, "");
    if (raw.length < 4) return raw;
    if (raw.length < 8) {
      return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    }
    return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  };

  const update = (name: string, value: string) => {
    let finalValue = value;
    if (name === "phone") {
      finalValue = formatPhoneNumber(value);
    }
    setForm((current) => ({ ...current, [name]: finalValue }));
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const required = [form.name, form.phone, form.region, form.storeStatus];
    if (required.some((value) => !value.trim())) {
      setError("필수 입력 항목(* marked)을 모두 입력해주세요.");
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) {
      setError("연락처 형식을 확인해주세요. (예: 010-0000-0000)");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // 1. DB 저장 (Convex)
    try {
      const formattedMessage = [
        form.region ? `[희망지역] ${form.region}` : null,
        form.storeSize ? `[매장평수] ${form.storeSize}` : null,
        form.goal ? `[도입목적] ${form.goal}` : null,
        form.interestedMenu ? `[희망메뉴] ${form.interestedMenu}` : null,
        form.preferredTime ? `[희망시간] ${form.preferredTime}` : null,
        form.message ? `[추가문의] ${form.message}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await addInquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        storeType: form.storeStatus,
        existingStoreName: form.storeName.trim() || "",
        message: formattedMessage || "상담 신청",
        regDate: new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }),
      });
    } catch (dbErr) {
      console.error("Failed to save inquiry to Convex DB:", dbErr);
    }

    // 2. SMS 발송 연동
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("120_sms_settings");
      if (stored) {
        try {
          const smsSettings = JSON.parse(stored);
          const eventConfig = smsSettings.consultation;
          if (eventConfig && smsSettings.aligoKey && smsSettings.aligoUserId) {
            // 고객용
            if (eventConfig.customer?.isActive) {
              let msg = eventConfig.customer.template
                .replace(/{name}/g, form.name)
                .replace(/{phone}/g, form.phone)
                .replace(/{storeType}/g, form.storeStatus);

              sendSmsAction({
                key: smsSettings.aligoKey,
                userId: smsSettings.aligoUserId,
                sender: eventConfig.customer.sender.replace(/[^0-9]/g, ""),
                receiver: form.phone.replace(/[^0-9]/g, ""),
                msg,
                isTest: smsSettings.aligoTestMode !== false,
              }).catch(console.error);
            }

            // 관리자용
            if (eventConfig.admin?.isActive) {
              const adminReceivers = eventConfig.admin.receivers || [];
              if (adminReceivers.length > 0) {
                let msg = eventConfig.admin.template
                  .replace(/{name}/g, form.name)
                  .replace(/{phone}/g, form.phone)
                  .replace(/{storeType}/g, form.storeStatus);

                sendSmsAction({
                  key: smsSettings.aligoKey,
                  userId: smsSettings.aligoUserId,
                  sender: eventConfig.admin.sender.replace(/[^0-9]/g, ""),
                  receiver: adminReceivers.map((n: string) => n.replace(/[^0-9]/g, "")).join(","),
                  msg,
                  isTest: smsSettings.aligoTestMode !== false,
                }).catch(console.error);
              }
            }
          }
        } catch (e) {
          console.error("SMS error:", e);
        }
      }
    }

    // 3. Analytics Tracking
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "inquiry_submit",
          path: typeof window !== "undefined" ? window.location.pathname : "/brand",
          referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
        }),
      }).catch(console.error);
    } catch (e) {
      // ignore tracking errors
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    setForm(initialForm);
  };

  return (
    <div className="w-full text-left font-sans">
      {/* SUCCESS MODAL POPUP */}
      {isSubmitted && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-neutral-900 border border-[#FBC400]/40 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#FBC400] to-amber-500" />
            
            <div className="w-16 h-16 mx-auto mb-4 bg-[#FBC400]/10 text-[#FBC400] rounded-full flex items-center justify-center border border-[#FBC400]/30 shadow-[0_0_20px_rgba(251,196,0,0.2)]">
              <CheckCircle2 className="w-8 h-8 text-[#FBC400]" />
            </div>

            <h3 className="text-xl font-black text-white mb-2 tracking-tight">
              상담 신청 완료
            </h3>

            <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-medium">
              상담 신청이 정상 접수되었습니다.
              <br />
              담당 컨설턴트가 빠르게 연락 드리겠습니다.
            </p>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                if (onSuccessClose) onSuccessClose();
              }}
              className="w-full py-3.5 bg-[#FBC400] hover:bg-amber-400 active:scale-[0.98] text-neutral-950 text-base font-extrabold rounded-xl transition-all shadow-lg shadow-[#FBC400]/20 cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* FORM BODY */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: 이름 / 연락처 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="이름"
            required
            value={form.name}
            onChange={(val) => update("name", val)}
            placeholder="홍길동"
          />
          <FormInput
            label="연락처"
            required
            value={form.phone}
            onChange={(val) => update("phone", val)}
            placeholder="010-0000-0000"
          />
        </div>

        {/* Row 2: 희망 지역 / 매장 운영 상태 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="희망 창업 지역"
            required
            value={form.region}
            onChange={(val) => update("region", val)}
            placeholder="예: 서울 강남구 / 경기 성남시"
          />
          <FormSelect
            label="매장 운영 상태"
            required
            value={form.storeStatus}
            options={storeTypes}
            onChange={(val) => update("storeStatus", val)}
          />
        </div>

        {/* Row 3: 기존 매장명 / 매장 평수 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="기존 매장명 (선택)"
            value={form.storeName}
            onChange={(val) => update("storeName", val)}
            placeholder="예: 120카페"
          />
          <FormInput
            label="매장 평수 (선택)"
            value={form.storeSize}
            onChange={(val) => update("storeSize", val)}
            placeholder="예: 15평"
          />
        </div>

        {/* Row 4: 도입 관심 목적 / 관심 메뉴 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="도입 관심 목적 (선택)"
            value={form.goal}
            options={goals}
            onChange={(val) => update("goal", val)}
          />
          <FormSelect
            label="관심 메뉴 (선택)"
            value={form.interestedMenu}
            options={menus}
            onChange={(val) => update("interestedMenu", val)}
          />
        </div>

        {/* Row 5: 상담 희망 시간 */}
        <FormInput
          label="상담 희망 시간 (선택)"
          value={form.preferredTime}
          onChange={(val) => update("preferredTime", val)}
          placeholder="예: 평일 오후 2시~5시 / 주말 상시"
        />

        {/* Textarea: 문의 내용 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-neutral-300 flex items-center gap-1">
            추가 문의 사항 (선택)
          </label>
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={3}
            className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FBC400] focus:ring-1 focus:ring-[#FBC400] transition-all resize-none"
            placeholder="궁금하신 내용이나 추가 전달사항을 자유롭게 입력해주세요."
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button & Call Hotline */}
        <div className="pt-2 space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#FBC400] hover:bg-amber-400 active:scale-[0.99] text-neutral-950 font-black text-base sm:text-lg rounded-xl transition-all shadow-xl shadow-[#FBC400]/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>접수 중...</span>
            ) : (
              <span>무료 창업 컨설팅 신청하기 →</span>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-400 pt-1">
            <PhoneCall className="w-3.5 h-3.5 text-[#FBC400]" />
            <span>빠른 전화 상담: <strong className="text-white font-bold">1566-3594</strong></span>
          </div>
        </div>
      </form>
    </div>
  );
}

interface InputProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function FormInput({
  label,
  required = false,
  value,
  onChange,
  placeholder = "",
}: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral-300 flex items-center gap-1">
        {label}
        {required && <span className="text-[#FBC400]">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FBC400] focus:ring-1 focus:ring-[#FBC400] transition-all"
      />
    </div>
  );
}

interface SelectProps {
  label: string;
  required?: boolean;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

function FormSelect({
  label,
  required = false,
  value,
  options,
  onChange,
}: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral-300 flex items-center gap-1">
        {label}
        {required && <span className="text-[#FBC400]">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FBC400] focus:ring-1 focus:ring-[#FBC400] transition-all appearance-none cursor-pointer"
      >
        <option value="" className="text-neutral-500">
          선택해주세요
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-neutral-900 text-white">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
