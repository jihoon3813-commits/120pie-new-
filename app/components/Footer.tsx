"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DEFAULT_TERMS, DEFAULT_PRIVACY, DEFAULT_REFUND } from "@/app/constants/policies";

interface FooterProps {
  theme: "yellow" | "black" | "pink";
}

export default function Footer({ theme }: FooterProps) {
  const isPinkVariant = theme === "pink";
  const isYellowVariant = theme === "yellow";

  const [partnerId, setPartnerId] = useState<string>("");
  const [localPartnerPhone, setLocalPartnerPhone] = useState<string>("");

  const [terms, setTerms] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [refund, setRefund] = useState("");
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | "refund" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTerms(localStorage.getItem("120_terms_of_use") || DEFAULT_TERMS);
      setPrivacy(localStorage.getItem("120_privacy_policy") || DEFAULT_PRIVACY);
      setRefund(localStorage.getItem("120_refund_policy") || DEFAULT_REFUND);

      const pid = localStorage.getItem("120_referral_partner_id") || "";
      const pphone = localStorage.getItem("120_referral_partner_phone") || "";
      if (pid) setPartnerId(pid);
      if (pphone) setLocalPartnerPhone(pphone);
    }
  }, []);

  const partnerData = useQuery(
    api.partners.getById,
    partnerId ? { id: partnerId } : "skip"
  );

  const displayPhone =
    partnerData?.consultationPhone ||
    partnerData?.phone ||
    localPartnerPhone ||
    "1566-3594";

  const openPolicyModal = (type: "terms" | "privacy" | "refund") => {
    if (typeof window !== "undefined") {
      if (type === "terms") {
        setTerms(localStorage.getItem("120_terms_of_use") || DEFAULT_TERMS);
      } else if (type === "privacy") {
        setPrivacy(localStorage.getItem("120_privacy_policy") || DEFAULT_PRIVACY);
      } else if (type === "refund") {
        setRefund(localStorage.getItem("120_refund_policy") || DEFAULT_REFUND);
      }
    }
    setActiveModal(type);
  };

  const getModalTitle = () => {
    if (activeModal === "terms") return "이용약관";
    if (activeModal === "privacy") return "개인정보처리방침";
    if (activeModal === "refund") return "환불정책";
    return "";
  };

  const getModalContent = () => {
    if (activeModal === "terms") return terms;
    if (activeModal === "privacy") return privacy;
    if (activeModal === "refund") return refund;
    return "";
  };

  return (
    <footer className={`border-t transition-all duration-300 ${
      isPinkVariant 
        ? "bg-[#f4f3f4] border-neutral-200 text-[#7c5d6c]" 
        : isYellowVariant 
          ? "bg-[#f5f5f4] border-neutral-200 text-[#576575]" 
          : "bg-neutral-950 border-neutral-900 text-neutral-400"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className={`footer-grid grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b ${
          isPinkVariant ? "border-neutral-200" : isYellowVariant ? "border-neutral-200" : "border-neutral-800"
        }`}>
          <div className="lg:col-span-7">
            <div className="mb-7">
              <img
                src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
                alt="120pie 로고"
                className="h-7 sm:h-8 w-auto object-contain opacity-40 hover:opacity-75 transition-opacity duration-200 grayscale"
              />
            </div>
            <p className={`text-base font-bold tracking-tight mb-5 ${
              isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
            }`}>(주)고우웰라이프</p>
            <div className={`space-y-2.5 text-xs sm:text-sm font-medium leading-relaxed ${
              isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
            }`}>
              <p>대표 : 이사근 | 사업자번호: 787-88-00444</p>
              <p>
                E-mail: 120piecoffee@gmail.com | Tel:{" "}
                <a href={`tel:${displayPhone.replace(/[^0-9]/g, "")}`} className="hover:underline transition-colors font-bold">
                  {displayPhone}
                </a>
              </p>
              <p>개인정보보호책임자: 이사근</p>
            </div>
          </div>

          <div className={`lg:col-span-5 lg:border-l lg:pl-12 flex flex-col justify-between gap-10 ${
            isPinkVariant ? "lg:border-rose-200/50" : isYellowVariant ? "lg:border-[#e6dfc3]" : "lg:border-neutral-800/80"
          }`}>
            <div>
              <span className={`text-[10px] tracking-[0.24em] uppercase font-bold block mb-5 ${
                isPinkVariant ? "text-rose-400" : isYellowVariant ? "text-amber-600" : "text-neutral-500"
              }`}>
                Customer Center
              </span>
              <a
                href={`tel:${displayPhone.replace(/[^0-9]/g, "")}`}
                className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors block mb-3 ${
                  isPinkVariant ? "text-[#4c2d3a] hover:text-rose-500" : isYellowVariant ? "text-[#0d233a] hover:text-amber-600" : "text-white hover:text-amber-400"
                }`}
              >
                {displayPhone}
              </a>
              <p className={`inline-flex items-center gap-2 text-sm font-bold ${
                isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-300"
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  isPinkVariant ? "bg-rose-500" : isYellowVariant ? "bg-[#0d233a]" : "bg-amber-400"
                }`} />
                24시간 상담가능
              </p>
            </div>

            <div className={`flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold ${
              isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
            }`}>
              <span onClick={() => openPolicyModal("terms")} className="transition-colors cursor-pointer hover:text-[#f25f8a] hover:underline">이용약관</span>
              <span onClick={() => openPolicyModal("privacy")} className="transition-colors cursor-pointer hover:text-[#f25f8a] hover:underline font-black">개인정보처리방침</span>
              <span onClick={() => openPolicyModal("refund")} className="transition-colors cursor-pointer hover:text-[#f25f8a] hover:underline">환불정책</span>
            </div>
          </div>
        </div>
        {/* 관리자 및 점주/파트너 포털 바로가기 버튼 그룹 (모바일 최적화 반응형 버튼) */}
        <div className="pt-6 border-t border-neutral-200/20 dark:border-neutral-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className={`text-xs font-medium ${
              isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
            }`}>
              Copyright(c)2026 GOWELL-LIFE Co.,Ltd. All Right Reserved.
            </p>

            {/* 3대 전용 포털 바로가기 버튼 그리드 (모바일 3분할 꽉 찬 버튼, 데스크탑 인라인 버튼) */}
            <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 w-full sm:w-auto">
              <a
                href="/portal"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-black transition-all shadow-xs active:scale-95 text-center ${
                  isPinkVariant 
                    ? "bg-rose-50 hover:bg-rose-100 text-[#4c2d3a] border border-[#f2ccd7]/70" 
                    : isYellowVariant 
                    ? "bg-amber-50 hover:bg-amber-100 text-[#0d233a] border border-[#e6dfc3]" 
                    : "bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700"
                }`}
                title="120겹파이 점주 전용 포털 시스템"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                <span className="truncate">점주포털</span>
              </a>

              <a
                href="/partner"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-black transition-all shadow-xs active:scale-95 text-center ${
                  isPinkVariant 
                    ? "bg-rose-50 hover:bg-rose-100 text-[#4c2d3a] border border-[#f2ccd7]/70" 
                    : isYellowVariant 
                    ? "bg-amber-50 hover:bg-amber-100 text-[#0d233a] border border-[#e6dfc3]" 
                    : "bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700"
                }`}
                title="120겹파이 영업 파트너 전용 포털 시스템"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                <span className="truncate">파트너포털</span>
              </a>

              <a
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-black transition-all shadow-xs active:scale-95 text-center ${
                  isPinkVariant 
                    ? "bg-rose-50 hover:bg-rose-100 text-[#4c2d3a] border border-[#f2ccd7]/70" 
                    : isYellowVariant 
                    ? "bg-amber-50 hover:bg-amber-100 text-[#0d233a] border border-[#e6dfc3]" 
                    : "bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700"
                }`}
                title="120겹파이 본사 통합 최고관리자 어드민"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="truncate">본사 어드민</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm policy-modal-fade select-none">
          <div className="bg-white border border-[#f2ccd7]/60 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto flex flex-col max-h-[85vh] policy-modal-scale">
            
            {/* Header */}
            <div className="p-6 border-b border-[#f2ccd7]/40 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-neutral-800">
                {getModalTitle()}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-[#f25f8a] hover:bg-[#fff1f5] transition-all cursor-pointer border-0 bg-transparent"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium whitespace-pre-wrap max-h-[60vh] text-left">
              {getModalContent()}
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-neutral-50 border-t border-[#f2ccd7]/20 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-[#f25f8a] hover:bg-[#df4977] text-white font-black text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-0"
              >
                확인
              </button>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes policyFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes policyScaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .policy-modal-fade {
              animation: policyFadeIn 0.2s ease-out forwards;
            }
            .policy-modal-scale {
              animation: policyScaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}} />
        </div>
      )}
    </footer>
  );
}
