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

const initialForm = {
  name: "",
  phone: "",
  region: "",
  storeStatus: "",
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
    const required = [form.name, form.phone];
    if (required.some((value) => !value.trim())) {
      setError("성함과 연락처(* marked)를 입력해 주세요.");
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) {
      setError("연락처 형식을 확인해 주세요. (예: 010-0000-0000)");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // 1. DB 저장 (Convex)
    try {
      const formattedMessage = [
        form.region ? `[희망지역] ${form.region}` : null,
        form.storeStatus ? `[매장상태] ${form.storeStatus}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await addInquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        storeType: form.storeStatus || "상담 시 확인",
        existingStoreName: "",
        message: formattedMessage || "모바일 빠른 간편 상담 신청",
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
            let msg = eventConfig.message || "창업 상담이 성공적으로 신청되었습니다.";
            msg = msg
              .replace(/{name}/g, form.name)
              .replace(/{phone}/g, form.phone)
              .replace(/{region}/g, form.region || "미지정")
              .replace(/{storeStatus}/g, form.storeStatus || "미지정");

            sendSmsAction({
              key: smsSettings.aligoKey,
              userId: smsSettings.aligoUserId,
              sender: (smsSettings.senderPhone || "18995685").replace(/[^0-9]/g, ""),
              receiver: form.phone.replace(/[^0-9]/g, ""),
              msg,
              isTest: smsSettings.aligoTestMode !== false,
            }).catch(console.error);

            if (smsSettings.adminPhones && Array.isArray(smsSettings.adminPhones)) {
              for (const adminPhone of smsSettings.adminPhones) {
                if (adminPhone) {
                  sendSmsAction({
                    key: smsSettings.aligoKey,
                    userId: smsSettings.aligoUserId,
                    sender: (smsSettings.senderPhone || "18995685").replace(/[^0-9]/g, ""),
                    receiver: adminPhone.replace(/[^0-9]/g, ""),
                    msg: `[120PIE 상담신청]\n이름: ${form.name}\n연락처: ${form.phone}\n지역: ${form.region || "미지정"}\n상태: ${form.storeStatus || "미지정"}`,
                    isTest: smsSettings.aligoTestMode !== false,
                  }).catch(console.error);
                }
              }
            }
          }
        } catch (smsErr) {
          console.error("Failed to process SMS trigger:", smsErr);
        }
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* SUCCESS MODAL */}
      {isSubmitted && (
        <div className="text-center py-6 space-y-3 animate-fadeIn">
          <div className="w-14 h-14 bg-[#FBC400]/20 text-[#FBC400] rounded-md flex items-center justify-center mx-auto mb-2 border border-[#FBC400]/30 shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-white">
            상담 신청이 완료되었습니다!
          </h3>
          <p className="text-neutral-300 text-xs leading-relaxed max-w-md mx-auto font-medium">
            작성해 주신 연락처(<span className="text-[#FBC400] font-bold">{form.phone}</span>)로
            <br />
            1:1 전문 컨설턴트가 빠르게 안내해 드리겠습니다.
          </p>
          <div className="pt-3 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setForm(initialForm);
                if (onSuccessClose) onSuccessClose();
              }}
              className="w-full py-3 bg-[#FBC400] hover:bg-amber-400 active:scale-[0.98] text-neutral-950 text-sm font-extrabold rounded-md transition-all shadow-md shadow-[#FBC400]/20 cursor-pointer border-0"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* FORM BODY */}
      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Row 1: 이름 & 연락처 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              type="tel"
              inputMode="tel"
              pattern="[0-9-]*"
              value={form.phone}
              onChange={(val) => update("phone", val)}
              placeholder="010-0000-0000"
            />
          </div>

          {/* Row 2: 희망 창업 지역 & 매장 운영 상태 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormInput
              label="희망 창업 지역 (선택)"
              value={form.region}
              onChange={(val) => update("region", val)}
              placeholder="예: 서울 강남구 / 경기 성남시"
            />
            <FormSelect
              label="매장 운영 상태 (선택)"
              value={form.storeStatus}
              options={storeTypes}
              onChange={(val) => update("storeStatus", val)}
            />
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-md">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button & Call Hotline */}
          <div className="pt-1.5 space-y-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#FBC400] hover:bg-amber-400 active:scale-[0.98] text-neutral-950 text-sm font-black rounded-md transition-all shadow-md shadow-[#FBC400]/20 flex items-center justify-center gap-2 border-0 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "접수 진행 중..." : "⚡ VIP 무료 창업 상담 신청"}</span>
            </button>

            <a
              href="tel:15663594"
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 no-underline"
            >
              <PhoneCall size={13} className="text-[#FBC400]" />
              <span>전화 빠른 상담: 1566-3594</span>
            </a>
          </div>
        </form>
      )}
    </div>
  );
}

interface InputProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "search" | "email" | "tel" | "url" | "numeric" | "decimal";
  pattern?: string;
}

function FormInput({
  label,
  required = false,
  value,
  onChange,
  placeholder,
  type,
  inputMode,
  pattern,
}: InputProps) {
  const isPhone = label.includes("연락처") || label.includes("전화");
  const isNumeric = label.includes("평수") || label.includes("금액") || label.includes("인원");

  const finalType = type || (isPhone ? "tel" : "text");
  const finalInputMode = inputMode || (isPhone ? "tel" : isNumeric ? "numeric" : undefined);
  const finalPattern = pattern || (isPhone || isNumeric ? "[0-9]*" : undefined);

  return (
    <div className="space-y-1 text-left">
      <label className="text-[11px] sm:text-xs font-bold text-neutral-300 flex items-center gap-1">
        {label}
        {required && <span className="text-[#FBC400]">*</span>}
      </label>
      <input
        type={finalType}
        inputMode={finalInputMode}
        pattern={finalPattern}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-neutral-900/90 border border-neutral-800 rounded-md px-3 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FBC400] focus:ring-1 focus:ring-[#FBC400] transition-all"
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
    <div className="space-y-1 text-left">
      <label className="text-[11px] sm:text-xs font-bold text-neutral-300 flex items-center gap-1">
        {label}
        {required && <span className="text-[#FBC400]">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-neutral-900/90 border border-neutral-800 rounded-md px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FBC400] focus:ring-1 focus:ring-[#FBC400] transition-all appearance-none cursor-pointer"
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

