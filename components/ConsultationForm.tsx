"use client";

import { FormEvent, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

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
  message: ""
};

export default function ConsultationForm() {
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
    console.log("consultation submit", form);

    // SMS 발송 연동 (상담문의)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("120_sms_settings");
      if (stored) {
        try {
          const smsSettings = JSON.parse(stored);
          const eventConfig = smsSettings.consultation;
          if (eventConfig) {
            const hasAligoCreds = smsSettings.aligoKey && smsSettings.aligoUserId;

            // 1. 고객용 발송 (신청자)
            if (eventConfig.customer && eventConfig.customer.isActive) {
              let msg = eventConfig.customer.template;
              msg = msg.replace(/{name}/g, form.name);
              msg = msg.replace(/{phone}/g, form.phone);
              msg = msg.replace(/{storeType}/g, form.storeStatus);

              const formattedSender = eventConfig.customer.sender.replace(/[^0-9]/g, "");
              const formattedReceiver = form.phone.replace(/[^0-9]/g, "");

              console.log(`[Consultation Customer SMS] From: ${eventConfig.customer.sender} | To: ${form.phone}`);
              console.log(`[Content]:\n${msg}`);

              if (hasAligoCreds) {
                sendSmsAction({
                  key: smsSettings.aligoKey,
                  userId: smsSettings.aligoUserId,
                  sender: formattedSender,
                  receiver: formattedReceiver,
                  msg: msg,
                  isTest: smsSettings.aligoTestMode !== false
                }).then(res => {
                  console.log("[Aligo Customer Consultation Response]:", res);
                }).catch(err => {
                  console.error(err);
                });
              } else {
                alert(`[고객용 SMS 발송 - 시뮬레이션]\n\n보낸사람: ${eventConfig.customer.sender}\n받는사람(고객): ${form.phone}\n\n내용:\n${msg}`);
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

                console.log(`[Consultation Admin SMS] From: ${eventConfig.admin.sender} | To: ${adminReceivers.join(", ")}`);
                console.log(`[Content]:\n${msg}`);

                if (hasAligoCreds) {
                  sendSmsAction({
                    key: smsSettings.aligoKey,
                    userId: smsSettings.aligoUserId,
                    sender: formattedSender,
                    receiver: formattedReceiver,
                    msg: msg,
                    isTest: smsSettings.aligoTestMode !== false
                  }).then(res => {
                    console.log("[Aligo Admin Consultation Response]:", res);
                  }).catch(err => {
                    console.error(err);
                  });
                } else {
                  alert(`[관리자용 SMS 발송 - 시뮬레이션]\n\n보낸사람: ${eventConfig.admin.sender}\n받는사람(관리자): ${adminReceivers.join(", ")}\n\n내용:\n${msg}`);
                }
              }
            }
          }
        } catch (e) {
          console.error("SMS 설정 파싱 에러:", e);
        }
      }
    }

    setSuccess("상담 신청이 접수되었습니다. 담당자가 매장 상황에 맞춰 안내드릴 예정입니다.");
    setForm(initialForm);
  };

  return (
    <section className="section consultation" id="consultation">
      <div className="container form-grid">
        <div>
          <p className="eyebrow">무료 도입 상담</p>
          <h2>내 매장에 120pie를 도입할 수 있을까요?</h2>
          <p className="section-copy">
            매장 형태, 현재 메뉴, 지역, 운영 방식에 따라 도입 가능성과 예상 수익 구조를 상담해드립니다.
          </p>
        </div>
        <form className="consult-form" onSubmit={handleSubmit}>
          <div className="form-row two">
            <Field label="이름" required value={form.name} onChange={(value) => update("name", value)} />
            <Field label="연락처" required value={form.phone} onChange={(value) => update("phone", value)} placeholder="010-0000-0000" />
          </div>
          <div className="form-row two">
            <Field label="지역" required value={form.region} onChange={(value) => update("region", value)} placeholder="예: 서울 강남구" />
            <Select label="매장 운영 여부" required value={form.storeStatus} options={storeTypes} onChange={(value) => update("storeStatus", value)} />
          </div>
          <div className="form-row two">
            <Field label="매장명" value={form.storeName} onChange={(value) => update("storeName", value)} />
            <Field label="매장 평수" value={form.storeSize} onChange={(value) => update("storeSize", value)} />
          </div>
          <div className="form-row two">
            <Field label="현재 운영 업종" value={form.currentBusiness} onChange={(value) => update("currentBusiness", value)} />
            <Select label="관심 목적" value={form.goal} options={goals} onChange={(value) => update("goal", value)} />
          </div>
          <div className="form-row two">
            <Select label="관심 메뉴" value={form.interestedMenu} options={menus} onChange={(value) => update("interestedMenu", value)} />
            <Field label="상담 희망 시간" value={form.preferredTime} onChange={(value) => update("preferredTime", value)} placeholder="예: 평일 오후 2시" />
          </div>
          <label className="field full-field">
            문의 내용
            <textarea value={form.message} onChange={(event) => update("message", event.target.value)} rows={4} />
          </label>
          {error ? <p className="form-message error">{error}</p> : null}
          {success ? <p className="form-message success">{success}</p> : null}
          <button className="cta full" type="submit">
            내 매장 도입 가능성 확인하기
          </button>
          <p className="notice">신청 후 담당자가 매장 상황에 맞는 도입 방식과 예상 판매 구조를 안내드립니다.</p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  placeholder = ""
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="field">
      {label}
      {required ? <span aria-hidden="true">*</span> : null}
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  required = false
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="field">
      {label}
      {required ? <span aria-hidden="true">*</span> : null}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">선택해주세요</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
