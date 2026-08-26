"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FranchiseContractDocument } from "@/components/contract/FranchiseContractDocument";
import { SignaturePad } from "@/components/contract/SignaturePad";
import { 
  FileCheck, 
  CheckCircle2, 
  Printer, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  Store, 
  Calendar, 
  User, 
  Share2,
  Check
} from "lucide-react";

export default function ContractSigningPage() {
  const params = useParams();
  const contractId = params?.id as string;

  const contract = useQuery(
    api.contracts.getById,
    contractId ? { id: contractId as Id<"contracts"> } : "skip"
  );
  const signContractMutation = useMutation(api.contracts.signContract);

  // Signing state
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [signatureData, setSignatureData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  if (contract === undefined) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-600">120겹파이 전자계약서를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (contract === null) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <h1 className="text-xl font-black text-[#0F172A]">계약서를 찾을 수 없습니다</h1>
          <p className="text-xs text-slate-500">
            유효하지 않거나 만료된 계약서 링크입니다. 본사(1566-3594)로 문의해 주시기 바랍니다.
          </p>
        </div>
      </div>
    );
  }

  const isSigned = contract.status === "계약서 서명완료" || Boolean(contract.signatureImage);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleSignSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    if (!agreePrivacy) {
      setErrorMessage("개인정보 제공 및 계약 체결 동의에 체크해 주세요.");
      return;
    }

    if (!signatureData) {
      setErrorMessage("서명 패드에 정자로 서명해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

      await signContractMutation({
        id: contract._id,
        signatureImage: signatureData,
        signedAt: formattedDate,
        signerIp: typeof navigator !== "undefined" ? navigator.userAgent : "Web Client",
        agreeTerms: true,
        agreePrivacy: true,
        agreeSupplies: true,
      });

      setIsSignModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      console.error("Sign error:", err);
      setErrorMessage(err.message || "서명 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] print:bg-white text-[#0F172A] pb-24 print:pb-0">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-8 py-2.5 sm:py-3.5 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          {/* Brand & System Title (모바일에서도 1줄로 유지) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FED422] flex items-center justify-center text-[#0F172A] font-black text-xs sm:text-sm shadow-xs shrink-0">
              120
            </div>
            <div className="min-w-0">
              <span className="text-[12px] sm:text-xs font-black text-[#0F172A] block whitespace-nowrap leading-none">
                120겹파이 전자계약 시스템
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-bold block truncate mt-0.5">
                {contract.storeName || "가맹계약서"}
              </span>
            </div>
          </div>

          {/* Action Buttons (모바일에서도 1줄로 유지) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer border-0 whitespace-nowrap"
              title="계약서 링크 복사"
            >
              {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
              <span className="hidden xs:inline">{copiedLink ? "복사됨" : "링크 복사"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-black text-[#0F172A] bg-[#FED422] hover:bg-[#e5be1f] rounded-lg transition-all shadow-xs cursor-pointer border-0 whitespace-nowrap"
              title="계약서 인쇄 및 PDF 저장"
            >
              <Printer size={13} />
              <span>인쇄 / PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 space-y-4 sm:space-y-6 print:p-0 print:m-0 print:max-w-none">
        {/* Status Notice Banner */}
        <div className="print:hidden">
          {isSigned ? (
            <div className="p-3.5 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-emerald-950">가맹계약 체결 및 전자서명 완료</h2>
                  <p className="text-[11px] sm:text-xs text-emerald-700 mt-0.5">
                    서명 체결일시 : <strong>{contract.signedAt || "완료"}</strong> (법적 효력이 발생한 공식 계약서입니다)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer border-0"
              >
                <Printer size={13} />
                공식 계약서 PDF 출력
              </button>
            </div>
          ) : (
            <div className="p-3.5 sm:p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0">
                  <FileCheck size={20} />
                </div>
                <div>
                  <h2 className="text-xs sm:text-sm font-black text-amber-950">가맹계약서 확인 및 전자서명</h2>
                  <p className="text-[11px] sm:text-xs text-amber-800 mt-0.5">
                    계약서 조항을 확인하신 후 <strong>[서명란]</strong>을 터치하여 전자서명을 진행해 주세요.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSignModalOpen(true)}
                className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs font-black rounded-xl border border-amber-500 shadow-xs shrink-0 cursor-pointer animate-pulse"
              >
                ✍️ 서명하기
              </button>
            </div>
          )}
        </div>

        {/* Quick Contract Summary Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs print:hidden">
          <div className="space-y-1">
            <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Store size={12} /> 가맹점명
            </span>
            <p className="font-extrabold text-[#0F172A] truncate">{contract.storeName}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <User size={12} /> 가맹사업자
            </span>
            <p className="font-extrabold text-[#0F172A]">{contract.ownerName}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Calendar size={12} /> 계약기간
            </span>
            <p className="font-extrabold text-[#0F172A] truncate">{contract.contractStart} ~ {contract.contractEnd}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck size={12} /> 계약상태
            </span>
            <p className={`font-black ${isSigned ? "text-emerald-600" : "text-amber-600"}`}>
              {contract.status || "기본정보 등록"}
            </p>
          </div>
        </div>

        {/* The Official Franchise Contract Document */}
        <FranchiseContractDocument 
          contract={contract} 
          onOpenSignModal={() => setIsSignModalOpen(true)}
        />
      </main>

      {/* ==================== 서명 팝업 모달 (Modal) ==================== */}
      {isSignModalOpen && !isSigned && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-[#FED422] flex items-center justify-between text-[#0F172A]">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-[#0F172A]" />
                <h3 className="font-black text-sm sm:text-base">120겹파이 가맹계약 전자서명</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSignModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/40 hover:bg-white/80 text-slate-800 font-black text-sm flex items-center justify-center border-0 cursor-pointer transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">가맹점 :</span>
                  <span className="font-black text-[#0F172A]">{contract.storeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">가맹사업자(을) :</span>
                  <span className="font-black text-[#0F172A]">{contract.ownerName}</span>
                </div>
              </div>

              {/* 개인정보 제공 및 계약 체결 동의 */}
              <label className="flex items-start gap-2.5 p-3 bg-amber-50/70 border border-amber-200 rounded-xl cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-amber-500 cursor-pointer rounded shrink-0"
                />
                <div className="text-[11.5px] sm:text-xs text-slate-800 leading-tight">
                  <strong className="text-amber-900 font-black">[필수]</strong> 
                  <span className="font-extrabold ml-1">가맹계약서 확인 및 전자서명 체결 동의</span>
                  <p className="text-slate-500 text-[10.5px] mt-1 leading-normal">
                    본인은 120겹파이 가맹계약서 전문 및 별첨 내용을 모두 확인하였으며, 이에 전자서명으로 계약을 체결합니다.
                  </p>
                </div>
              </label>

              {/* 전자서명 캔버스 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-700">
                    가맹사업자(을) 서명 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    박스 안에 직접 정자로 서명하세요
                  </span>
                </div>
                <SignaturePad onSave={(sig) => setSignatureData(sig)} />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSignModalOpen(false)}
                className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => handleSignSubmit()}
                disabled={isSubmitting || !signatureData || !agreePrivacy}
                className="flex-2 py-3 bg-gradient-to-r from-amber-400 to-[#FED422] hover:from-amber-500 hover:to-[#e5be1f] text-[#0F172A] font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
                    <span>서명 처리 중...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>서명 완료 및 계약 체결</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 전자서명 완료 축하 모달 (Success Modal) ==================== */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div 
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-center p-6 sm:p-8 space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Success Badge */}
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-25" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <CheckCircle2 size={42} strokeWidth={2.5} />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-1.5">
              <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-full border border-emerald-200 mb-1">
                전자계약 체결 완료
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                가맹계약 전자서명 완료!
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed break-keep">
                <strong>{contract.ownerName}</strong> 점주님, <strong>{contract.storeName}</strong>의 공식 가맹계약이 성공적으로 체결되었습니다.
              </p>
            </div>

            {/* Contract Summary Box */}
            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-bold">가맹점 명칭</span>
                <span className="font-black text-[#0F172A]">{contract.storeName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-bold">가맹사업자</span>
                <span className="font-black text-[#0F172A]">{contract.ownerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">서명 체결일시</span>
                <span className="font-extrabold text-emerald-700">{contract.signedAt || "방금 전"}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setTimeout(() => handlePrint(), 300);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#FED422] to-amber-400 hover:from-amber-400 hover:to-amber-500 text-[#0F172A] font-black text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-0"
              >
                <Printer size={16} />
                <span>공식 계약서 PDF 인쇄 / 다운로드</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border-0"
              >
                계약서 전문 확인하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
