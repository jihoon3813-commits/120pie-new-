"use client";

import React from "react";
import { OfficialSealStamp } from "./OfficialSealStamp";
import { OFFICIAL_SUPPLIES_LIST, HEADQUARTERS_INFO } from "./contractData";

export interface FranchiseContractData {
  _id?: string;
  contractType?: string; // "신규" | "갱신" | "양수"
  ownerName: string;
  ownerBirth: string;
  ownerPhone: string;
  storeName: string;
  storeAddress: string;
  storeSize: number | string;
  businessArea: string;
  contractStart: string;
  contractEnd: string;
  
  supervisionFee: number;
  initialFranchiseFee: number;
  
  depositMembershipFee: number;
  depositEduFee: number;
  depositSupportFee: number;
  depositGuaranteeFee: number;
  depositTotalFee: number;
  
  royaltyFee: number;
  guaranteeFee: number;
  
  eduOpenFee: number;
  eduNewFee: number;
  
  initialSupplyFee: number;
  reFranchiseFee: number;
  penaltyFee: number;
  
  status?: string;
  createdAt?: string;
  signatureImage?: string;
  signedAt?: string;
}

export const formatContractPhone = (val: string): string => {
  const raw = (val || "").replace(/[^0-9]/g, "");
  if (raw.length <= 3) return raw;
  if (raw.length <= 7) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
  if (raw.length <= 11) return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
  return `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
};

export const formatContractBirth = (val: string): string => {
  const raw = (val || "").replace(/[^0-9]/g, "");
  if (raw.length <= 4) return raw;
  if (raw.length <= 6) return `${raw.slice(0, 4)}-${raw.slice(4)}`;
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
};

interface FranchiseContractDocumentProps {
  contract: FranchiseContractData;
  isPrintMode?: boolean;
  highlightInputs?: boolean;
  isEditable?: boolean;
  onOpenSignModal?: () => void;
}

export const FranchiseContractDocument: React.FC<FranchiseContractDocumentProps> = ({
  contract,
  isPrintMode = false,
  highlightInputs = false,
  onOpenSignModal,
}) => {
  const contractType = contract.contractType || "신규";
  const createdDate = contract.createdAt ? contract.createdAt.split(" ")[0] : new Date().toISOString().split("T")[0];
  const [createdY, createdM, createdD] = createdDate.split("-");

  const formatMoney = (amount: number | string) => {
    const num = Number(amount) || 0;
    return num.toLocaleString();
  };

  const highlightClass = highlightInputs 
    ? "bg-amber-100 text-amber-950 font-black px-1 py-0.5 mx-0.5 rounded border border-amber-300 shadow-2xs inline-block text-[11px] sm:text-xs leading-tight break-all transition-all" 
    : "font-black text-[#0F172A]";

  return (
    <div className={`w-full max-w-full overflow-hidden bg-white text-[#1E293B] font-sans leading-relaxed text-[12px] sm:text-[13px] print:text-[11px] print:max-w-none print:w-full print:p-0 ${isPrintMode ? "p-0" : highlightInputs ? "p-2.5 sm:p-4 md:p-6 shadow-sm rounded-xl border border-slate-200" : "p-3 sm:p-8 md:p-10 shadow-sm rounded-2xl border border-slate-200"}`}>
      
      {/* ==================== COVER PAGE ==================== */}
      <div id="doc-cover" className="min-h-[600px] sm:min-h-[650px] print:min-h-[900px] flex flex-col justify-between border-b-2 border-dashed border-slate-200 pb-10 sm:pb-12 mb-10 sm:mb-12 print:border-b-0 print:pb-0 print:mb-0 print:break-after-page">
        <div className="flex justify-between items-start text-xs font-black tracking-widest text-slate-500 border-b border-slate-200 pb-2">
          <span>대 / 외 / 비</span>
          <span>120겹파이 (주)고우웰라이프</span>
        </div>

        <div className="my-auto text-center space-y-7 py-6">
          {/* Security Notice Box */}
          <div className="max-w-xl mx-auto p-4 bg-slate-50 border border-slate-200 rounded-lg text-left text-[11px] text-slate-600 space-y-1">
            <p className="font-extrabold text-slate-800">※ 본 계약서의 보안 및 무단복제 금지</p>
            <p className="break-keep">
              본 계약서는 가맹점희망자 또는 가맹점사업자에 대한 열람 및 가맹계약체결, 공정거래위원회 또는 법원에 제출 등의 용도 이외에 무단복제, 제3자에 대한 유출 및 공개가 금지되며 이를 위반할 경우 민형사상의 책임을 부담할 수 있음을 알려드립니다.
            </p>
          </div>

          {/* Main Titles */}
          <div className="space-y-4">
            <div className="inline-block px-4 py-1.5 bg-[#FED422] text-[#0F172A] text-xs font-black rounded-full tracking-wider shadow-xs">
              공식 프랜차이즈 가맹계약서 ({contractType})
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              120겹파이 가맹계약서
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-bold tracking-wide">
              STANDARD FRANCHISE AGREEMENT
            </p>
          </div>

          {/* Contracting Parties Card */}
          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">가맹본부 (갑)</span>
              <span className="font-black text-[#0F172A]">{HEADQUARTERS_INFO.companyName} (대표이사 {HEADQUARTERS_INFO.ceoName})</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">가맹사업자 (을)</span>
              <span className={highlightClass}>{contract.ownerName || "가맹사업자명"}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="font-bold text-slate-500">가맹점 명칭</span>
              <span className={highlightClass}>{contract.storeName || "가맹점 명칭"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-500">계약 기간</span>
              <span className={highlightClass}>{contract.contractStart || createdDate} ~ {contract.contractEnd || `${parseInt(createdY) + 2}-${createdM}-${createdD}`}</span>
            </div>
          </div>
        </div>

        {/* Footer info on cover */}
        <div className="text-center text-xs text-slate-400 font-bold pt-4 border-t border-slate-200">
          <span>{HEADQUARTERS_INFO.companyName}</span>
        </div>
      </div>

      {/* ==================== EXECUTIVE SUMMARY : 납부 비용 총괄표 ==================== */}
      <div id="doc-cost-summary" className="bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-amber-300 shadow-sm space-y-3 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded text-[10px] sm:text-[11px]">
                핵심 요약
              </span>
              <h2 className="text-sm sm:text-base font-black text-[#0F172A]">
                가맹점사업자 납부 비용 및 예치금 총괄표
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-600 font-bold mt-0.5">
              가맹계약에 따라 ‘을’이 부담하여야 할 일체의 비용과 환급 내역입니다.
            </p>
          </div>
          <div className="text-right shrink-0 bg-white/95 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-amber-300 shadow-2xs self-start sm:self-auto">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 block">초기 총 개설 납부액</span>
            <span className="text-xs sm:text-sm font-black text-amber-950">
              {formatMoney(
                (Number(contract.depositMembershipFee) || 0) +
                (Number(contract.depositEduFee) || 0) +
                (Number(contract.depositSupportFee) || 0) +
                (Number(contract.depositGuaranteeFee) || 0) +
                (Number(contract.supervisionFee) || 0) +
                (Number(contract.initialSupplyFee) || 0)
              )} 원 <span className="text-[9px] font-bold text-slate-500">(VAT포함)</span>
            </span>
          </div>
        </div>

        {/* 1. PC/태블릿 4열 테이블 (sm 이상 및 인쇄 시 표시) */}
        <div className="hidden sm:block w-full rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left border-collapse table-fixed">
            <colgroup>
              <col style={{ width: "18%" }} />
              <col style={{ width: "32%" }} />
              <col style={{ width: "26%" }} />
              <col style={{ width: "24%" }} />
            </colgroup>
            <thead className="bg-slate-100 font-black text-slate-800 text-[10px] sm:text-[11px]">
              <tr>
                <th className="p-1.5 sm:p-2 border-b border-r border-slate-200 text-center">납부 구분</th>
                <th className="p-1.5 sm:p-2 border-b border-r border-slate-200 pl-2">세부 항목</th>
                <th className="p-1.5 sm:p-2 border-b border-r border-slate-200 text-right pr-2 sm:pr-3">납부 금액</th>
                <th className="p-1.5 sm:p-2 border-b border-slate-200 text-center">납부 시기</th>
              </tr>
            </thead>
            <tbody>
              {/* Category 1: 초기 개설 비용 (일시납) */}
              <tr className="bg-slate-50/70 border-b border-slate-200">
                <td rowSpan={6} className="p-1.5 border-r border-slate-200 text-center font-black text-amber-950 bg-amber-50/50 align-middle">
                  <span className="block font-black text-[11px]">1. 초기 개설</span>
                  <span className="text-[10px] text-amber-800 font-bold block leading-tight">(계약/오픈 시 1회)</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  가입비 (가맹비) <span className="text-[10px] text-slate-400 font-normal">제15조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-bold text-slate-900">
                  <span className={highlightClass}>{formatMoney(contract.depositMembershipFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-slate-500 font-normal leading-tight break-keep">
                  계약체결일 (예치계좌)
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  오픈교육비 <span className="text-[10px] text-slate-400 font-normal">제15조, 제19조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-bold text-slate-900">
                  <span className={highlightClass}>{formatMoney(contract.depositEduFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-slate-500 font-normal leading-tight break-keep">
                  계약체결일 (예치계좌)
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  오픈지원비 <span className="text-[10px] text-slate-400 font-normal">제15조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-bold text-slate-900">
                  <span className={highlightClass}>{formatMoney(contract.depositSupportFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-slate-500 font-normal leading-tight break-keep">
                  계약체결일 (예치계좌)
                </td>
              </tr>
              <tr className="border-b border-slate-100 bg-blue-50/30">
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="break-keep">계약이행보증금</span>
                    <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded font-bold shrink-0">환급형</span>
                  </div>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-black text-blue-900">
                  <span className={highlightClass}>{formatMoney(contract.depositGuaranteeFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-blue-900 font-bold leading-tight break-keep">
                  계약체결일 (예치계좌)
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  공사감리비 <span className="text-[10px] text-slate-400 font-normal">제14조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-bold text-slate-900">
                  <span className={highlightClass}>{formatMoney(contract.supervisionFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-slate-500 font-normal leading-tight break-keep">
                  시공 착공 시
                </td>
              </tr>
              <tr className="border-b-2 border-slate-300">
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  초도물품비 <span className="text-[10px] text-slate-400 font-normal">제29조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-bold text-slate-900">
                  <span className={highlightClass}>{formatMoney(contract.initialSupplyFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-slate-500 font-normal leading-tight break-keep">
                  오픈 전 납품 시
                </td>
              </tr>

              {/* Category 2: 운영 중 정기 납부 비용 (월납) */}
              <tr className="bg-amber-50/40 border-b border-slate-200">
                <td rowSpan={2} className="p-1.5 border-r border-slate-200 text-center font-black text-slate-900 bg-slate-100/60 align-middle">
                  <span className="block font-black text-[11px]">2. 운영 정기</span>
                  <span className="text-[10px] text-slate-500 font-bold block leading-tight">(월납 / 수시)</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  계속가맹금 (월 로열티) <span className="text-[10px] text-slate-400 font-normal">제17조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-black text-amber-950">
                  월 <span className={highlightClass}>{formatMoney(contract.royaltyFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-slate-600 font-bold leading-tight break-keep">
                  매월 1일 (자동이체)
                </td>
              </tr>
              <tr className="border-b-2 border-slate-300">
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  신입직원 추가교육비 <span className="text-[10px] text-slate-400 font-normal">제19조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-bold text-slate-700">
                  <span className={highlightClass}>{formatMoney(contract.eduNewFee || 220000)}</span> 원 <span className="text-[9px] text-slate-500">(1인)</span>
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-slate-500 font-normal leading-tight break-keep">
                  직원 채용 신청 시
                </td>
              </tr>

              {/* Category 3: 조건부 비용 및 보증금 환급 */}
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <td rowSpan={3} className="p-1.5 border-r border-slate-200 text-center font-black text-slate-900 bg-slate-100/60 align-middle">
                  <span className="block font-black text-[11px]">3. 갱신 / 종료</span>
                  <span className="text-[10px] text-slate-500 font-bold block leading-tight">(조건부 발생)</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  재가맹비 <span className="text-[10px] text-slate-400 font-normal">제39조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-bold text-slate-900">
                  <span className={highlightClass}>{formatMoney(contract.reFranchiseFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-slate-500 font-normal leading-tight break-keep">
                  2년 후 갱신 체결 시
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  계약해지 위약금 <span className="text-[10px] text-slate-400 font-normal">제40조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-bold text-rose-700">
                  <span className={highlightClass}>{formatMoney(contract.penaltyFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-rose-700 font-medium leading-tight break-keep">
                  중대한 귀책 해지 시
                </td>
              </tr>
              <tr className="bg-emerald-50/50">
                <td className="p-1.5 border-r border-slate-200 text-slate-800 font-bold pl-2 break-keep">
                  ★ 보증금 환급 <span className="text-[10px] text-slate-400 font-normal">제18조</span>
                </td>
                <td className="p-1.5 border-r border-slate-200 text-right pr-2 sm:pr-3 font-black text-emerald-800">
                  + <span className={highlightClass}>{formatMoney(contract.guaranteeFee)}</span> 원
                </td>
                <td className="p-1.5 border-slate-200 text-center text-[10px] text-emerald-800 font-bold leading-tight break-keep">
                  정상 종료 후 30일 내
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. 모바일 전용 반응형 카드 뷰 (스마트폰 화면에서 금액이 100% 선명하게 보임) */}
        <div className="block sm:hidden space-y-2.5 print:hidden">
          {/* 그룹 1: 초기 개설 비용 */}
          <div className="rounded-xl border border-amber-300 bg-white overflow-hidden shadow-2xs divide-y divide-slate-100">
            <div className="bg-amber-100/90 px-3 py-1.5 font-black text-amber-950 text-xs flex items-center justify-between">
              <span>■ 1. 초기 개설 비용 (계약/오픈 시 일시납)</span>
              <span className="text-[10px] text-amber-800 font-bold">1회 납부</span>
            </div>
            
            <div className="p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs block">가입비 (가맹비)</span>
                <span className="text-[10px] text-slate-400">계약체결일 (예치계좌)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">{formatMoney(contract.depositMembershipFee)} 원</span>
              </div>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs block">오픈교육비</span>
                <span className="text-[10px] text-slate-400">계약체결일 (예치계좌)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">{formatMoney(contract.depositEduFee)} 원</span>
              </div>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs block">오픈지원비</span>
                <span className="text-[10px] text-slate-400">계약체결일 (예치계좌)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">{formatMoney(contract.depositSupportFee)} 원</span>
              </div>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2 bg-blue-50/40">
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-blue-950 text-xs">계약이행보증금</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded font-bold">환급형</span>
                </div>
                <span className="text-[10px] text-blue-700">계약체결일 (예치계좌)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-blue-950">{formatMoney(contract.depositGuaranteeFee)} 원</span>
              </div>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs block">공사감리비</span>
                <span className="text-[10px] text-slate-400">시공 착공 시</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">{formatMoney(contract.supervisionFee)} 원</span>
              </div>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs block">초도물품비</span>
                <span className="text-[10px] text-slate-400">오픈 전 납품 시</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">{formatMoney(contract.initialSupplyFee)} 원</span>
              </div>
            </div>
          </div>

          {/* 그룹 2: 운영 중 정기 납부 비용 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs divide-y divide-slate-100">
            <div className="bg-slate-100 px-3 py-1.5 font-black text-slate-800 text-xs flex items-center justify-between">
              <span>■ 2. 운영 중 정기 납부 비용</span>
              <span className="text-[10px] text-slate-500 font-bold">월납 / 수시</span>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs block">계속가맹금 (월 로열티)</span>
                <span className="text-[10px] text-slate-400">매월 1일 (자동이체)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-amber-950">월 {formatMoney(contract.royaltyFee)} 원</span>
              </div>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs block">신입직원 추가교육비 (1인당)</span>
                <span className="text-[10px] text-slate-400">직원 채용 신청 시</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">{formatMoney(contract.eduNewFee || 220000)} 원</span>
              </div>
            </div>
          </div>

          {/* 그룹 3: 갱신 및 해지 조건부 비용 */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs divide-y divide-slate-100">
            <div className="bg-slate-100 px-3 py-1.5 font-black text-slate-800 text-xs flex items-center justify-between">
              <span>■ 3. 갱신 및 해지 조건부 비용</span>
              <span className="text-[10px] text-slate-500 font-bold">조건부 발생</span>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800 text-xs block">재가맹비</span>
                <span className="text-[10px] text-slate-400">2년 후 갱신 체결 시</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-900">{formatMoney(contract.reFranchiseFee)} 원</span>
              </div>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2">
              <div>
                <span className="font-bold text-rose-700 text-xs block">계약해지 위약금</span>
                <span className="text-[10px] text-rose-500">중대한 귀책 해지 시</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-rose-700">{formatMoney(contract.penaltyFee)} 원</span>
              </div>
            </div>

            <div className="p-2.5 flex items-center justify-between gap-2 bg-emerald-50/40">
              <div>
                <span className="font-bold text-emerald-900 text-xs block">★ 보증금 환급</span>
                <span className="text-[10px] text-emerald-700">정상 종료 후 30일 내</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-800">+ {formatMoney(contract.guaranteeFee)} 원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== 본문 조항 ==================== */}
      <div className="space-y-7">
        {/* 제1조 */}
        <section id="doc-clause-1" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제1조</span>
            <span>계약의 목적</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            가맹본부 <strong>{HEADQUARTERS_INFO.companyName}</strong>(이하 ‘갑’이라 한다.)와 가맹점사업자 <span className={highlightClass}>{contract.ownerName || "가맹점사업자"}</span>(이하 ‘을’이라 한다.)은 ‘갑’의 외식 프랜차이즈사업 ‘120겹파이’ 경영에 관하여 다음과 같이 가맹계약을 체결한다.
          </p>
        </section>

        {/* 제2조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제2조</span>
            <span>용어의 정의</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            본 계약에서 사용하는 용어의 정의는 ‘가맹사업거래의 공정화에 관한 법률’(이하 ‘가맹사업법’이라 한다) 및 동법 시행령이 정하는 바에 따른다.
          </p>
        </section>

        {/* 제3조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제3조</span>
            <span>가맹본부의 권리와 의무</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’은 ‘을’에게 상표, 상호 등의 영업표지 사용을 허가하고, 원부재료의 안정적인 공급 및 교육, 경영지도를 성실히 수행한다.<br />
            ② ‘갑’은 가맹사업의 통일성과 브랜드 가치를 유지하기 위해 가맹점의 운영을 정기적으로 점검하고 개선을 요구할 수 있다.
          </p>
        </section>

        {/* 제4조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제4조</span>
            <span>가맹점사업자의 권리와 의무</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’은 계약 체결 후 ‘갑’이 제공하는 레시피 및 매뉴얼에 따라 성실하게 가맹점을 운영하여야 한다.<br />
            ② ‘을’은 ‘갑’의 사전 서면 승인 없이 본 계약상의 권리나 의무를 제3자에게 양도하거나 담보로 제공할 수 없다.
          </p>
        </section>

        {/* 제5조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제5조</span>
            <span>계약 기간</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            본 계약의 유효기간은 계약체결일로부터 <strong className="text-amber-900">2년</strong>으로 하며, 계약 만료 180일 전부터 90일 전까지 서면 통지가 없는 경우 동일한 조건으로 2년씩 자동 연장된다.<br />
            (약정 계약기간 : <span className={highlightClass}>{contract.contractStart || createdDate} ~ {contract.contractEnd || `${parseInt(createdY) + 2}-${createdM}-${createdD}`}</span>)
          </p>
        </section>

        {/* 제6조 ~ 제12조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제6조 ~ 제12조</span>
            <span>가맹점 운영 및 품질관리 준수사항</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ‘을’은 ‘갑’이 정한 레시피, 위생 지침, 고객 서비스 기준을 준수하며, 상표권의 침해 행위를 하여서는 아니 된다. 상세 내용은 별첨[2]의 영업표지 규정을 따른다.
          </p>
        </section>

        {/* 제13조 : 영업지역의 보호 */}
        <section id="doc-clause-13" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제13조</span>
            <span>영업지역의 보호</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’의 영업지역은 <span className={highlightClass}>{contract.businessArea || "가맹점 반경 500m 내"}</span> [별첨 [1] 참조]로 정하며, ‘갑’은 계약기간 중 ‘을’의 영업지역 내에 동일한 업종의 직영점이나 타 가맹점을 개설하지 아니한다.<br />
            ② ‘갑’은 계약기간 중 또는 갱신 과정에서 상권의 급격한 변동 등 정당한 사유 없이 ‘을’의 영업지역을 축소할 수 없다.
          </p>
        </section>

        {/* 제14조 : 점포의 설비 및 공사감리 */}
        <section id="doc-clause-14" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제14조</span>
            <span>점포의 설비 및 공사감리</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            점포설비(인테리어)는 가맹사업의 통일성을 위해 ‘갑’이 정한 사양에 따라 시공하며, 공사의 감리를 진행하는 경우 ‘을’은 공사감리비 <span className={highlightClass}>{formatMoney(contract.supervisionFee)}</span> 원(부가가치세 포함)을 ‘갑’에게 지급한다.
          </p>
        </section>

        {/* 제15조 : 최초가맹금 및 예치가맹금 */}
        <section id="doc-clause-15" className="space-y-2.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제15조</span>
            <span>최초가맹금 및 예치가맹금</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’이 ‘갑’에게 지급하여야 할 최초가맹금은 일금 <span className={highlightClass}>{formatMoney((Number(contract.depositMembershipFee) || 0) + (Number(contract.depositEduFee) || 0) + (Number(contract.depositSupportFee) || 0))}</span> 원(부가가치세 포함)으로 한다.<br />
            ② ‘을’은 계약체결일에 예치가맹금과 계약이행보증금을 ‘갑’이 지정하는 아래 금융회사에 예치하여야 한다.
          </p>

          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-xs space-y-2.5 w-full max-w-full overflow-hidden shadow-2xs">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-black text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <span>* 예치금융회사 : <strong className="text-blue-700">{HEADQUARTERS_INFO.depositBank}</strong></span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span>계좌번호 : <strong className="text-blue-700">{HEADQUARTERS_INFO.depositAccount}</strong></span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span>예금주 : {HEADQUARTERS_INFO.depositAccountHolder}</span>
            </div>
            
            <div className="w-full rounded-lg border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-xs text-left border-collapse table-fixed">
                <colgroup>
                  <col style={{ width: "42%" }} />
                  <col style={{ width: "58%" }} />
                </colgroup>
                <thead className="bg-slate-100 font-bold text-slate-700 text-[10px] sm:text-[11px]">
                  <tr>
                    <th className="p-1.5 sm:p-2 border-b border-r border-slate-200 text-slate-800 font-black pl-2">예치가맹금 내역</th>
                    <th className="p-1.5 sm:p-2 border-b border-slate-200 text-right pr-2 sm:pr-3 text-slate-800 font-black">금액 (원, VAT포함)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-1.5 border-r border-slate-200 text-slate-700 font-semibold pl-2 text-[10.5px] sm:text-xs break-keep">가입비 (가맹비)</td>
                    <td className="p-1.5 text-right font-bold pr-2 sm:pr-3 text-slate-900 text-[10.5px] sm:text-xs">
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        <span className={highlightClass}>{formatMoney(contract.depositMembershipFee)}</span>
                        <span>원</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-1.5 border-r border-slate-200 text-slate-700 font-semibold pl-2 text-[10.5px] sm:text-xs break-keep">오픈교육비</td>
                    <td className="p-1.5 text-right font-bold pr-2 sm:pr-3 text-slate-900 text-[10.5px] sm:text-xs">
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        <span className={highlightClass}>{formatMoney(contract.depositEduFee)}</span>
                        <span>원</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-1.5 border-r border-slate-200 text-slate-700 font-semibold pl-2 text-[10.5px] sm:text-xs break-keep">오픈지원비</td>
                    <td className="p-1.5 text-right font-bold pr-2 sm:pr-3 text-slate-900 text-[10.5px] sm:text-xs">
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        <span className={highlightClass}>{formatMoney(contract.depositSupportFee)}</span>
                        <span>원</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 bg-blue-50/30">
                    <td className="p-1.5 border-r border-slate-200 text-blue-950 font-semibold pl-2 text-[10.5px] sm:text-xs">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="break-keep">계약이행보증금</span>
                        <span className="text-[8.5px] bg-blue-100 text-blue-800 px-1 rounded font-bold shrink-0">환급형</span>
                      </div>
                    </td>
                    <td className="p-1.5 text-right font-bold pr-2 sm:pr-3 text-blue-900 text-[10.5px] sm:text-xs">
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        <span className={highlightClass}>{formatMoney(contract.depositGuaranteeFee)}</span>
                        <span>원</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-amber-50/90 font-black text-slate-900">
                    <td className="p-1.5 border-r border-slate-200 font-black pl-2 text-amber-950 text-[10.5px] sm:text-xs break-keep">예치가맹금 합계</td>
                    <td className="p-1.5 text-right text-amber-950 font-black pr-2 sm:pr-3 text-[10.5px] sm:text-xs">
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        <span>
                          {formatMoney(
                            (Number(contract.depositMembershipFee) || 0) +
                            (Number(contract.depositEduFee) || 0) +
                            (Number(contract.depositSupportFee) || 0) +
                            (Number(contract.depositGuaranteeFee) || 0)
                          )}
                        </span>
                        <span>원</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 제16조 : 가맹금의 반환 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제16조</span>
            <span>가맹금의 반환</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            정보공개서 미제공 등 법정 사유에 해당하는 경우 ‘을’은 가맹계약 체결일로부터 4개월 이내에 서면으로 가맹금 반환을 청구할 수 있으며, 관련 법률령 및 당사자 약정에 따라 정산 반환한다.
          </p>
        </section>

        {/* 제17조 : 계속가맹금 (로열티) */}
        <section id="doc-clause-17" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제17조</span>
            <span>계속가맹금 (로열티)</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ‘을’은 상표 사용 및 경영지도에 대한 대가로 월 계속가맹금(로열티) <span className={highlightClass}>월 {formatMoney(contract.royaltyFee)}</span> 원을 매월 1일 ‘갑’의 지정계좌로 납부한다.
          </p>
        </section>

        {/* 제18조 : 계약이행보증금 */}
        <section id="doc-clause-18" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제18조</span>
            <span>계약이행보증금</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ‘을’의 채무 불이행을 담보하기 위한 계약이행보증금은 <span className={highlightClass}>{formatMoney(contract.guaranteeFee)}</span> 원으로 하며, 계약 종료 후 정산 완료 시 전액 무이자 환급한다.
          </p>
        </section>

        {/* 제19조 : 교육 및 훈련 */}
        <section id="doc-clause-19" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제19조</span>
            <span>교육 및 훈련</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’은 개설 전 ‘갑’이 주관하는 필수 오픈교육을 이수하여야 하며 오픈교육비는 <span className={highlightClass}>{formatMoney(contract.eduOpenFee)}</span> 원으로 한다.<br />
            ② 오픈 후 신규직원 추가교육 신청 시 1인당 <span className={highlightClass}>{formatMoney(contract.eduNewFee || 220000)}</span> 원의 추가 교육비를 납부한다.
          </p>
        </section>

        {/* 제20조 ~ 제28조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제20조 ~ 제28조</span>
            <span>영업활동의 통일성 및 물품공급</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            맛의 동일성과 품질 유지를 위하여 필수품목은 ‘갑’ 또는 ‘갑’이 지정한 협력사로부터 공급받아야 한다. 상세 구입강제품목은 [별첨 [3]]에 명시한다.
          </p>
        </section>

        {/* 제29조 : 초도물품비 */}
        <section id="doc-clause-29" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제29조</span>
            <span>초도물품비</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            오픈 시 원활한 영업 개시를 위해 제공되는 초도 원부자재 비용은 <span className={highlightClass}>{formatMoney(contract.initialSupplyFee)}</span> 원(부가세 포함)으로 한다.
          </p>
        </section>

        {/* 제30조 ~ 제38조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제30조 ~ 제38조</span>
            <span>광고 및 판촉 / 권리양도 / 점포환경개선</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            가맹사업법 기준을 준수하여 전국 광고는 본사 50% 이상 분담하며, 점포환경개선 요구 시 법정 비율에 따라 비용을 분담한다.
          </p>
        </section>

        {/* 제39조 : 계약의 갱신 */}
        <section id="doc-clause-39" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제39조</span>
            <span>계약의 갱신 및 재가맹비</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            계약 갱신 시 발생하는 재가맹비는 <span className={highlightClass}>{formatMoney(contract.reFranchiseFee)}</span> 원으로 한다.
          </p>
        </section>

        {/* 제40조 : 계약의 해지 및 위약금 */}
        <section id="doc-clause-40" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제40조</span>
            <span>계약의 해지 및 위약금</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            당사자의 중대한 귀책사유로 계약이 중도 해지되는 경우 위약금은 <span className={highlightClass}>{formatMoney(contract.penaltyFee)}</span> 원으로 정한다.
          </p>
        </section>

        {/* 제41조 ~ 제47조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제41조 ~ 제47조</span>
            <span>비밀유지, 손해배상 및 분쟁해결 관할법원</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ‘을’은 영업비밀을 엄수하며, 본 계약과 관련된 소송의 관할법원은 ‘갑’의 본사 소재지 관할법원으로 한다.
          </p>
        </section>

        {/* ==================== 체결 서명 날인 영역 ==================== */}
        <div id="doc-signature-block" className="pt-8 border-t-2 border-slate-300 space-y-6">
          <p className="text-center text-xs font-bold text-slate-700 break-keep">
            ‘갑’과 ‘을’은 이 가맹계약서에 열거된 각 조항을 면밀히 검토하고 충분히 이해하였으며, 이 계약의 체결을 증명하기 위하여 전자계약을 체결하고 각각 1통씩 보관한다.
          </p>

          <div className="text-center font-black text-sm text-[#0F172A] tracking-widest my-4">
            {contract.signedAt ? (
              <span>서명 체결일 : {contract.signedAt}</span>
            ) : (
              <span>{createdY}년 {createdM}월 {createdD}일</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
            {/* 가맹본부 (갑) */}
            <div className="relative p-4 sm:p-5 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-2 text-xs overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="font-black text-[#0F172A] text-sm">[가맹본부 (갑)]</span>
                <span className="text-[10px] text-slate-500 font-bold">법인인감 날인</span>
              </div>
              <div className="space-y-1 text-slate-700 pr-16">
                <p><span className="font-bold text-slate-500 w-20 inline-block">상 호 :</span> {HEADQUARTERS_INFO.companyName}</p>
                <p><span className="font-bold text-slate-500 w-20 inline-block">대표자 :</span> {HEADQUARTERS_INFO.ceoName}</p>
                <p><span className="font-bold text-slate-500 w-20 inline-block">사업자번호 :</span> {HEADQUARTERS_INFO.bizNumber}</p>
                <p><span className="font-bold text-slate-500 w-20 inline-block">주 소 :</span> {HEADQUARTERS_INFO.address}</p>
                <p><span className="font-bold text-slate-500 w-20 inline-block">연락처 :</span> {HEADQUARTERS_INFO.phone}</p>
              </div>

              {/* Official Seal Stamp Floating on CEO name */}
              <div className="absolute right-3 bottom-3">
                <OfficialSealStamp size={80} />
              </div>
            </div>

            {/* 가맹사업자 (을) */}
            <div className="relative p-4 sm:p-5 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-2 text-xs overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="font-black text-[#0F172A] text-sm">[가맹점사업자 (을)]</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${contract.signatureImage ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse font-black"}`}>
                  {contract.signatureImage ? "전자서명 완료" : "✍️ 서명 대기"}
                </span>
              </div>
              <div className="space-y-1 text-slate-700 pr-24">
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">성 명 :</span>
                  <span className={highlightClass}>{contract.ownerName || "-"}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">생년월일 :</span>
                  <span className={highlightClass}>{contract.ownerBirth || "-"}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">가맹점명 :</span>
                  <span className={highlightClass}>{contract.storeName || "-"}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">주 소 :</span>
                  <span className={highlightClass}>{contract.storeAddress || "-"}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">연락처 :</span>
                  <span className={highlightClass}>{contract.ownerPhone || "-"}</span>
                </p>
              </div>

              {/* Customer Signature Display or Pulsing Sign Button */}
              {contract.signatureImage ? (
                <div className="absolute right-3 bottom-3 flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={contract.signatureImage}
                    alt="가맹사업자 전자서명"
                    className="w-20 h-12 object-contain filter drop-shadow-xs"
                  />
                  <span className="text-[9px] text-emerald-700 font-bold mt-0.5">전자서명 날인</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenSignModal}
                  className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 px-3 py-2 bg-[#FED422] hover:bg-[#e5be1f] text-slate-950 font-black text-xs rounded-xl border-2 border-amber-500 border-dashed animate-pulse ring-4 ring-amber-300/50 shadow-md cursor-pointer flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95"
                  title="여기를 터치하여 전자서명을 진행하세요"
                >
                  <span className="text-[11px] font-black text-slate-900">✍️ 서명하기</span>
                  <span className="text-[9px] text-slate-700 font-bold">(터치 시 팝업)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ==================== APPENDIX 1 : 영업지역의 표시 ==================== */}
        <div id="doc-appendix-1" className="pt-10 border-t border-slate-200 space-y-4 print:break-before-page">
          <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-lg">
            <h3 className="font-black text-sm text-[#0F172A]">별첨 [1] : 영업지역의 표시</h3>
            <span className="text-xs font-bold text-slate-500">제13조 관련</span>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs text-slate-700 break-keep">
              가맹본부(‘갑’)와 가맹점사업자(‘을’)가 상호 합의하여 확정한 가맹점의 배타적 영업보호지역은 다음과 같습니다.
            </p>
            <div className="p-3.5 bg-white border border-amber-200 rounded-lg">
              <span className="block text-[11px] font-bold text-slate-400 mb-1">약정 영업지역</span>
              <span className={highlightClass}>{contract.businessArea || "가맹점 반경 500m 내"}</span>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              ※ 본 영업지역 내에서는 타 직영점 및 가맹점의 추가 개설이 엄격히 제한됩니다.
            </p>
          </div>
        </div>

        {/* ==================== APPENDIX 2 : 허가된 영업표지 ==================== */}
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-lg">
            <h3 className="font-black text-sm text-[#0F172A]">별첨 [2] : ‘을’에게 사용이 허가된 영업표지의 표시</h3>
            <span className="text-xs font-bold text-slate-500">제10조 관련</span>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-xs text-left border-collapse table-fixed">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 bg-slate-50 font-bold text-slate-600 w-36 border-r border-slate-200">영업표지 명칭</td>
                    <td className="p-2.5 font-extrabold text-[#0F172A]">120겹파이 (120PIE)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">등록번호(출원번호)</td>
                    <td className="p-2.5">{HEADQUARTERS_INFO.trademarkNumber}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">등록결정(심결) 연월일</td>
                    <td className="p-2.5">{HEADQUARTERS_INFO.trademarkDecisionDate}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">존속기간 만료일</td>
                    <td className="p-2.5">{HEADQUARTERS_INFO.trademarkExpireDate}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">지정상품 / 서비스업</td>
                    <td className="p-2.5">{HEADQUARTERS_INFO.trademarkClass}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200">등록권리자</td>
                    <td className="p-2.5 font-bold text-[#0F172A]">{HEADQUARTERS_INFO.companyName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ==================== APPENDIX 3 : 구입강제품목 공급가격 ==================== */}
        <div id="doc-appendix-3" className="pt-8 border-t border-slate-200 space-y-4 print:break-before-page">
          <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-lg">
            <h3 className="font-black text-sm text-[#0F172A]">별첨 [3] : 구입강제품목 공급가격 및 공급가격 결정기준</h3>
            <span className="text-xs font-bold text-slate-500">제25조 관련</span>
          </div>
          
          <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs text-slate-700 break-keep">
              본 서식[별첨3]은 가맹사업거래의 공정화에 관한 법률에 의거하여 가맹계약서의 내용에 포함되며 ‘을’은 ‘갑’으로부터 본 서식[별첨3]을 제공받았음을 확인합니다.
            </p>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                <thead className="bg-slate-100 font-bold text-slate-700 text-[11px]">
                  <tr>
                    <th className="p-2 border-b border-r border-slate-200 text-center w-16">공급방식</th>
                    <th className="p-2 border-b border-r border-slate-200 text-center w-10">순번</th>
                    <th className="p-2 border-b border-r border-slate-200">품목명</th>
                    <th className="p-2 border-b border-r border-slate-200 text-center w-16">규격/단위</th>
                    <th className="p-2 border-b border-slate-200 text-right w-24">공급가격 (원)</th>
                  </tr>
                </thead>
                <tbody>
                  {OFFICIAL_SUPPLIES_LIST.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-1.5 border-r border-slate-200 text-center text-[10px] font-bold text-slate-500">{item.supplyType}</td>
                      <td className="p-1.5 border-r border-slate-200 text-center text-slate-400">{item.id}</td>
                      <td className="p-1.5 border-r border-slate-200 font-extrabold text-[#0F172A]">{item.name}</td>
                      <td className="p-1.5 border-r border-slate-200 text-center text-slate-600">{item.unit}</td>
                      <td className="p-1.5 border-slate-200 text-right font-bold text-slate-800">{formatMoney(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-700 pt-2">
              <span>[갑] 상호 : {HEADQUARTERS_INFO.companyName} (인)</span>
              <span>[을] 성명 : {contract.ownerName || "-"} ({contract.signatureImage ? "서명완료" : "인"})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
