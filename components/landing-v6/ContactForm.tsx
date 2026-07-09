"use client";

import { FormEvent, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { X } from "lucide-react";

const storeTypes = ["기존 카페 운영 중", "저가커피 매장 운영 중", "디저트 카페 운영 중", "배달형 매장 운영 중", "예비 창업자", "기타"];
const goals = ["객단가 상승", "디저트 매출 강화", "샵인샵 도입", "창업비용 확인", "박람회 방문", "배달 메뉴 강화"];
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

export default function ContactForm({
  isModal = false,
  isOpen = false,
  onClose,
}: {
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const sendSmsAction = useAction(api.aligo.sendSms);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const required = [form.name, form.phone, form.region, form.storeStatus];
    if (required.some((value) => !value.trim())) {
      setError("필수 입력 항목을 모두 입력해주세요.");
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) {
      setError("연락처 형식을 확인해주세요. 숫자와 하이픈만 입력할 수 있습니다.");
      return;
    }

    // SMS 발송 연동
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("120_sms_settings");
      if (stored) {
        try {
          const smsSettings = JSON.parse(stored);
          const eventConfig = smsSettings.consultation;
          if (eventConfig) {
            const hasAligoCreds = smsSettings.aligoKey && smsSettings.aligoUserId;

            // 1. 고객용 발송
            if (eventConfig.customer && eventConfig.customer.isActive) {
              let msg = eventConfig.customer.template;
              msg = msg.replace(/{name}/g, form.name);
              msg = msg.replace(/{phone}/g, form.phone);
              msg = msg.replace(/{storeType}/g, form.storeStatus);

              const formattedSender = eventConfig.customer.sender.replace(/[^0-9]/g, "");
              const formattedReceiver = form.phone.replace(/[^0-9]/g, "");

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

            // 2. 관리자용 발송
            if (eventConfig.admin && eventConfig.admin.isActive) {
              const adminReceivers = eventConfig.admin.receivers || [];
              if (adminReceivers.length > 0) {
                let msg = eventConfig.admin.template;
                msg = msg.replace(/{name}/g, form.name);
                msg = msg.replace(/{phone}/g, form.phone);
                msg = msg.replace(/{storeType}/g, form.storeStatus);

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
        } catch (e) {
          console.error("SMS 설정 파싱 에러:", e);
        }
      }
    }

    setSuccess("성공적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.");
    setForm(initialForm);
  };

  if (isModal && !isOpen) return null;

  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
      {/* Text Left */}
      <div className={`lg:col-span-5 space-y-4 lg:space-y-6 ${isModal ? "text-neutral-900 dark:text-white" : "text-white"}`}>
        <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
          Start Your Business
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          지금, 우리 지역에서
          <br />
          120pie를 시작할 수 있을까요?
        </h2>
        <p className={`text-sm sm:text-base leading-relaxed ${isModal ? "text-neutral-500 dark:text-neutral-450" : "text-neutral-400"}`}>
          매장 상황과 희망 지역에 맞춰
          <br />
          가장 적합한 창업 방식을 안내드립니다.
        </p>
        <div className={`space-y-4 pt-4 border-t ${isModal ? "border-neutral-200 dark:border-neutral-800" : "border-neutral-800"}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-neutral-450 font-bold">창업 문의 핫라인</p>
              <p className={`text-base font-bold ${isModal ? "text-neutral-900 dark:text-white" : "text-white"}`}>1644-xxxx</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Right */}
      <div className="lg:col-span-7 bg-neutral-950 p-5 sm:p-10 rounded-3xl border border-neutral-800/80 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormInput
              label="희망 창업 지역"
              required
              value={form.region}
              onChange={(val) => update("region", val)}
              placeholder="예: 서울 강남구"
            />
            <FormSelect
              label="매장 운영 상태"
              required
              value={form.storeStatus}
              options={storeTypes}
              onChange={(val) => update("storeStatus", val)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormSelect
              label="도입 관심 목적"
              value={form.goal}
              options={goals}
              onChange={(val) => update("goal", val)}
            />
            <FormSelect
              label="도입 희망 메뉴"
              value={form.interestedMenu}
              options={menus}
              onChange={(val) => update("interestedMenu", val)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-400 flex items-center gap-1">
              추가 문의 사항
            </label>
            <textarea
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              rows={4}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
              placeholder="기타 궁금하신 사항을 자유롭게 적어주세요."
            />
          </div>

          {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}
          {success && <p className="text-xs font-semibold text-emerald-500">{success}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-neutral-950 text-sm font-extrabold rounded-xl transition-all shadow-lg hover:shadow-amber-500/10"
          >
            무료 창업 컨설팅 신청하기
          </button>
        </form>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) onClose();
        }}
      >
        <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl p-6 sm:p-10 max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800 text-left">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors z-30"
          >
            <X className="w-6 h-6" />
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="contact" className="py-10 sm:py-24 bg-neutral-900 text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
}

interface InputProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function FormInput({ label, required = false, value, onChange, placeholder = "" }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral-400 flex items-center gap-0.5">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
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

function FormSelect({ label, required = false, value, options, onChange }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-neutral-400 flex items-center gap-0.5">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none cursor-pointer"
      >
        <option value="" className="text-neutral-600">
          선택해주세요
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-neutral-950 text-white">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
