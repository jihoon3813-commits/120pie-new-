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

  const handleSignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      alert("🎉 120겹파이 가맹계약 전자서명이 성공적으로 완료되었습니다!");
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
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FED422] flex items-center justify-center text-[#0F172A] font-black text-sm shadow-xs">
              120
            </div>
            <div>
              <span className="text-xs font-black text-[#0F172A] block">120겹파이 전자계약 시스템</span>
              <span className="text-[10px] text-slate-400 font-bold">{contract.storeName || "가맹계약서"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer border-0"
            >
              {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              <span className="hidden sm:inline">{copiedLink ? "링크 복사됨" : "링크 복사"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-[#0F172A] bg-[#FED422] hover:bg-[#e5be1f] rounded-lg transition-all shadow-xs cursor-pointer border-0"
            >
              <Printer size={14} />
              <span>인쇄 / PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6 print:p-0 print:m-0 print:max-w-none">
        {/* Status Notice Banner */}
        <div className="print:hidden">
          {isSigned ? (
            <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-emerald-950">가맹계약 체결 및 전자서명 완료</h2>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    서명 체결일시 : <strong>{contract.signedAt || "완료"}</strong> (법적 효력이 발생한 공식 계약서입니다)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer border-0"
              >
                <Printer size={14} />
                공식 계약서 PDF 출력
              </button>
            </div>
          ) : (
            <div className="p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0">
                <FileCheck size={22} />
              </div>
              <div>
                <h2 className="text-sm font-black text-amber-950">가맹계약서 확인 및 전자서명</h2>
                <p className="text-xs text-amber-800 mt-0.5">
                  계약서 조항을 확인하신 후 하단에 전자서명을 진행해 주시면 체결이 완료됩니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Contract Summary Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs print:hidden">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Store size={13} /> 가맹점명
            </span>
            <p className="font-extrabold text-[#0F172A] truncate">{contract.storeName}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <User size={13} /> 가맹사업자
            </span>
            <p className="font-extrabold text-[#0F172A]">{contract.ownerName}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Calendar size={13} /> 계약기간
            </span>
            <p className="font-extrabold text-[#0F172A]">{contract.contractStart} ~ {contract.contractEnd}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldCheck size={13} /> 계약상태
            </span>
            <p className={`font-black ${isSigned ? "text-emerald-600" : "text-amber-600"}`}>
              {contract.status || "기본정보 등록"}
            </p>
          </div>
        </div>

        {/* The Official Franchise Contract Document */}
        <FranchiseContractDocument contract={contract} />

        {/* Interactive Signing Section (Only when not signed) */}
        {!isSigned && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-amber-300 shadow-lg space-y-6 print:hidden">
            <div className="border-b border-slate-200 pb-4">
              <span className="inline-flex items-center gap-1 text-xs font-black text-amber-700 uppercase tracking-wider mb-1">
                <Lock size={13} /> Electronic Signature
              </span>
              <h3 className="text-xl font-black text-[#0F172A]">가맹계약 체결 및 전자서명</h3>
              <p className="text-xs text-slate-500 mt-1">
                위 계약서 내용을 모두 확인하셨으면 아래 동의 및 서명을 진행해 주세요.
              </p>
            </div>

            <form onSubmit={handleSignSubmit} className="space-y-6">
              {/* 개인정보 제공 및 계약 체결 동의 */}
              <div className="bg-[#F8FAFC] p-4 sm:p-5 rounded-xl border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="w-5 h-5 mt-0.5 accent-amber-500 cursor-pointer rounded shrink-0"
                  />
                  <div className="text-xs text-slate-800 leading-relaxed">
                    <strong className="text-amber-800 font-black">[필수]</strong> 
                    <span className="font-extrabold ml-1">가맹계약서 확인 및 개인정보 수집·이용 동의</span>
                    <p className="text-slate-500 text-[11px] mt-1">
                      본인은 120겹파이 가맹계약서 전문(제1조~제47조) 및 별첨 내용을 모두 확인하였으며, 계약 체결 및 전자서명 관리를 위한 개인정보 수집·이용에 동의합니다.
                    </p>
                  </div>
                </label>
              </div>

              {/* 전자서명 캔버스 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-slate-700">
                    가맹사업자(을) 서명 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    아래 영역에 직접 서명해 주세요
                  </span>
                </div>
                <SignaturePad onSave={(sig) => setSignatureData(sig)} />
              </div>

              {/* Error Message Display */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !signatureData || !agreePrivacy}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-[#FED422] hover:from-amber-500 hover:to-[#e5be1f] text-[#0F172A] text-sm font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
                    <span>전자계약 체결 처리 중...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>120겹파이 가맹계약 체결 및 전자서명 제출</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
