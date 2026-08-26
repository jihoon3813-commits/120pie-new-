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

      {/* ==================== 본문 조항 (hoon 원본 PDF 47개 조항 100% 반영) ==================== */}
      <div className="space-y-6 sm:space-y-7">
        
        {/* 第1條 계약의 목적 */}
        <section id="doc-clause-1" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第1條</span>
            <span>계약의 목적</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            가맹본부 <strong>{HEADQUARTERS_INFO.companyName}</strong>(이하 ‘갑’이라 한다.)와 가맹점사업자 <span className={highlightClass}>{contract.ownerName || "가맹점사업자"}</span>(이하 ‘을’이라 한다.)은 ‘갑’의 외식 프랜차이즈사업 ‘120겹파이’ 경영에 관하여 다음과 같이 가맹계약을 체결한다.
          </p>
        </section>

        {/* 第2條 용어의 정의 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第2條</span>
            <span>용어의 정의</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">이 계약서에서 사용된 용어는 다음 각 호와 같은 의미를 갖는다.</p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-left break-keep text-slate-700 leading-relaxed">
            <li><strong>“가맹사업”</strong>이라 함은 가맹본부가 가맹점사업자(가맹희망자를 포함한다)로 하여금 자신의 상표, 서비스표, 상호, 간판 그 밖의 영업표지(이하 “영업표지”라 한다)를 사용하여 일정한 품질기준이나 영업방식에 따라 외식업을 영위함과 아울러 이에 따른 경영 및 영업활동 등에 대한 지원, 교육과 통제를 하고, 가맹점사업자는 이에 대한 대가로 가맹본부에 가맹금을 지급하는 것을 내용으로 하는 계속적인 거래관계를 말한다.</li>
            <li><strong>“가맹본부”</strong>라 함은 가맹계약과 관련하여 가맹점사업자에게 가맹점운영권을 부여하는 사업자를 말한다.</li>
            <li><strong>“가맹점사업자”</strong>라 함은 가맹계약과 관련하여 가맹본부로부터 가맹점운영권을 부여받은 사업자를 말한다.</li>
            <li><strong>“가맹금”</strong>이라 함은 명칭이나 지급형태의 여하에 관계없이 가맹점사업자가 가맹계약에 따라 가맹본부에 지급하는 대가를 말하며, 최초가맹금, 계속가맹금, 계약이행보증금을 포함한다.</li>
            <li><strong>“최초가맹금”</strong>이라 함은 가입비, 입회비, 계약금, 할부금, 오픈지원비, 최초교육비 등 명칭을 불문하고 가맹점사업자가 가맹점운영권을 부여받아 가맹사업에 착수하기 위하여 가맹본부에 지급하는 대가를 말한다.</li>
            <li><strong>“계속가맹금”</strong>이라 함은 상표사용료, 교육비, 경영지원비 등 명칭을 불문하고 가맹점사업자가 가맹사업에 착수한 이후 가맹사업을 유지하기 위하여 영업표지의 사용과 영업활동 등에 관한 지원, 교육, 그 밖의 사항과 관련하여 가맹본부에 정기적으로 또는 비정기적으로 지급하는 모든 대가를 말한다.</li>
            <li><strong>“계약이행보증금”</strong>이란 가맹점사업자가 가맹본부로부터 공급받는 상품의 대금 등에 관한 채무액이나 이와 관련한 손해배상액의 지급을 담보하기 위하여 가맹본부에 지급하는 대가를 말한다.</li>
            <li><strong>“영업비밀”</strong>이라 함은 공공연히 알려져 있지 아니하고 독립된 경제적 가치를 가지는 것으로서, 가맹본부의 상당한 노력에 의하여 비밀로 유지된 생산방법, 판매방법, 그 밖에 영업활동에 유용한 기술상 또는 경영상의 정보를 말한다.</li>
          </ol>
        </section>

        {/* 第3條 계약당사자의 지위 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第3條</span>
            <span>계약당사자의 지위</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’과 ‘을’은 상호간에 독립한 사업자로서 대등한 관계에서 이 건 가맹계약을 체결한다.<br />
            ② ‘갑’과 ‘을’ 사이에는 상호간에 대리관계나 위임관계, 사용자와 피용자 관계, 동업자 관계 등 여하한 특별한 관계도 존재하지 아니한다.
          </p>
        </section>

        {/* 第4條 신의성실의 원칙 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第4條</span>
            <span>신의성실의 원칙</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ‘갑’과 ‘을’은 이 가맹계약에 따라 가맹사업을 영위함에 있어서 각자의 업무를 신의에 따라 성실하게 수행하여야 한다.
          </p>
        </section>

        {/* 第5條 ‘갑’의 준수사항 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第5條</span>
            <span>‘갑’의 준수사항</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">‘갑’은 이 계약에서 정한 의무 외에 다음 각 호의 사항을 준수한다.</p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-700 leading-relaxed break-keep">
            <li>가맹사업의 성공을 위한 사업구상</li>
            <li>상품이나 용역의 품질관리와 판매기법의 개발을 위한 계속적 노력</li>
            <li>‘을’에 대하여 합리적 가격과 비용에 의한 점포설비의 설치, 상품 또는 용역 등의 공급</li>
            <li>‘을’과 그 직원에 대한 교육, 훈련</li>
            <li>‘을’의 경영, 영업활동에 대한 지속적인 조언과 지원</li>
            <li>가맹계약기간 중 ‘을’의 영업지역에서 자기의 직영점을 설치하거나 ‘을’과 동일한 업종의 가맹점을 설치하는 행위의 금지</li>
            <li>‘을’과의 대화와 협상을 통한 분쟁해결 노력</li>
            <li>특정 가맹점사업자에 대한 보복 목적의 관리 및 감독, 근접출점, 출혈 판촉행사, 사업자 단체활동 등을 이유로 한 불이익 제공 행위 금지</li>
            <li>분쟁 조정신청, 공정거래위원회의 조사 및 서면실태조사 협조 등을 이유로 한 보복 조치 금지</li>
          </ol>
        </section>

        {/* 第6條 ‘을’의 준수사항 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第6條</span>
            <span>‘을’의 준수사항</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">‘을’은 이 계약에서 정한 의무 외에 다음 각 호의 사항을 준수한다.</p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-700 leading-relaxed break-keep">
            <li>가맹사업의 통일성 및 ‘갑’의 명성을 유지하기 위한 노력</li>
            <li>‘갑’의 공급계획과 소비자의 수요충족에 필요한 적정한 재고유지 및 상품진열</li>
            <li>‘갑’이 상품 또는 용역에 대하여 제시하는 적절한 품질기준의 준수</li>
            <li>제3호의 규정에 의한 품질기준의 상품 또는 용역을 구입하지 못하는 경우 ‘갑’이 제공하는 상품 또는 용역의 사용</li>
            <li>‘갑’이 사업장의 설비와 외관, 운송수단에 대하여 제시하는 적절한 기준의 준수</li>
            <li>취급하는 상품, 용역이나 영업활동을 변경하는 경우 ‘갑’과의 사전 협의</li>
            <li>상품 및 용역의 구입과 판매에 관한 회계장부 등 ‘갑’의 통일적 사업경영 및 판매전략의 수립에 필요한 자료의 유지와 제공</li>
            <li>가맹점의 업무현황 및 제7호의 규정에 의한 자료의 확인과 기록을 위한 ‘갑’의 임직원 그 밖의 대리인의 사업장 출입 허용</li>
            <li>‘갑’의 동의를 얻지 아니한 경우 사업장의 위치변경 또는 가맹점운영권의 양도금지</li>
            <li>가맹계약기간 중 ‘갑’과 동일한 업종을 영위하는 행위의 금지</li>
            <li>‘갑’의 영업기술이나 영업비밀의 누설 금지</li>
            <li>‘갑’의 영업표지 기타 지적재산권에 대한 침해사실을 인지하는 경우 ‘갑’에 대한 침해사실의 통보와 금지조치에 필요한 적절한 협력</li>
          </ol>
        </section>

        {/* 第7條 불공정거래행위의 금지 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第7條</span>
            <span>불공정거래행위의 금지</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ‘갑’은 다음 각 호의 어느 하나에 해당하는 행위로서 가맹사업의 공정한 거래를 저해할 우려가 있는 행위를 하거나 제3자에게 이를 행하도록 하지 아니한다.
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-700 leading-relaxed break-keep">
            <li>‘을’의 귀책으로 보기 어려운 행위 등을 이유로 ‘을’에게 상품이나 용역의 공급 또는 영업지원 등을 중단 또는 거절하거나 그 내용을 현저히 제한하는 행위</li>
            <li>가격구속, 거래상대방 구속, 상품 또는 용역의 판매제한, 영업지역 준수강제 등의 방법으로 ‘을’이 취급하는 상품 또는 용역의 가격, 거래상대방, 거래지역이나 ‘을’의 사업활동을 ‘갑’의 상표권 보호, 상품 또는 용역의 동일성 유지 등 가맹사업경영에 필수적인 수준에 비추어 과도하게 구속하거나 제한하는 행위</li>
            <li>거래상 지위를 이용하여 구입강제, 경제적이익제공 또는 비용부담 강요, ‘을’에게 불리한 계약조항의 설정 또는 변경, 경영간섭, 판매목표 강제 등의 방법으로 ‘을’에게 불이익을 주는 행위</li>
            <li>계약의 목적과 내용, 발생할 손해 등에 비하여 과중한 위약금 또는 지연손해금을 설정, 부과하는 행위</li>
            <li>경쟁가맹본부의 가맹점사업자를 자기와 거래하도록 유인하여 자기의 가맹점사업자의 영업에 불이익을 주는 행위 등 제1호 내지 제4호 외의 행위로서 가맹사업의 공정한 거래질서를 저해할 우려가 있는 행위</li>
          </ol>
        </section>

        {/* 第8條 가맹점의 표시 */}
        <section id="doc-clause-8" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第8條</span>
            <span>가맹점의 표시</span>
          </h2>
          <div className="space-y-1 pl-1 text-slate-800 leading-relaxed break-keep">
            <p>1. 가맹점의 명칭은 <span className={highlightClass}>{contract.storeName || "120겹파이 ○○점"}</span>으로 한다. (※사업자등록증 및 간판에 사용)</p>
            <p>2. 가맹점의 소재지는 <span className={highlightClass}>{contract.storeAddress || "가맹점 소재지 미정"}</span>으로 한다.</p>
            <p>3. 가맹점의 규모는 <span className={highlightClass}>{contract.storeSize ? `${contract.storeSize}㎡` : "협의 면적"}</span>으로 한다.</p>
            <p>4. 가맹점의 영업지역은 <span className={highlightClass}>{contract.businessArea || "가맹점 반경 500m 내"}</span>으로 한다. [별첨[1]에 표시된 지역]</p>
            <p className="text-[11px] text-slate-500 font-bold">※ 영업지역 설정기준은 가맹점의 위치에서 반경 500m를 기준으로 한다.</p>
          </div>
        </section>

        {/* 第9條 가맹점운영권의 부여 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第9條</span>
            <span>가맹점운영권의 부여</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’은 ‘을’이 계약기간 중에 ‘갑’의 영업시스템에 따라 외식업을 운영하도록 하기 위하여 필요한 범위에서 ‘을’에게 다음 각 호의 권리를 부여한다.
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-700 leading-relaxed break-keep">
            <li>‘갑’의 영업표지의 사용권</li>
            <li>가맹사업과 관련하여 등기, 등록된 권리나 영업비밀의 사용권</li>
            <li>상품 또는 원ㆍ부재료(이하 “원ㆍ부재료 등”이라 한다)를 공급받을 권리</li>
            <li>노하우(know-how) 전수, 지도, 교육 기타 경영지원을 받을 권리</li>
            <li>기타 ‘갑’이 본 계약상의 영업과 관련하여 보유하는 권리로서 당사자가 사용허가의 대상으로 삼은 권리</li>
          </ol>
          <p className="text-left break-keep leading-relaxed pt-1">
            ② 이 계약에서 ‘을’에게 사용이 허가된 영업표지의 표시는 별첨[2]와 같다.
          </p>
        </section>

        {/* 第10條 지식재산권의 확보 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第10條</span>
            <span>지식재산권의 확보</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’은 가맹사업에 사용하는 영업표지에 대한 배타적 독점권을 확보하여야 한다.<br />
            ② ‘갑’은 ‘을’에게 사용을 허가한 각종 권리의 진정성과 적법성 및 대항력에 대하여 책임을 진다.<br />
            ③ ‘갑’이 사용을 허가한 지식재산권이 기간 만료 등으로 인하여 더 이상 사용할 수 없게 된 경우 ‘갑’의 책임과 비용으로 ‘을’에게 이를 대체할 수 있는 수단을 제공하여야 하며 이로 인하여 발생한 손해를 배상할 책임을 진다.
          </p>
        </section>

        {/* 第11條 계약의 발효일과 계약기간 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第11條</span>
            <span>계약의 발효일과 계약기간</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① 이 계약은 <span className={highlightClass}>{contract.contractStart || createdDate}</span>부터 발효되며 그 기간은 계약 발효일로부터 <span className={highlightClass}>{contract.contractEnd || `${parseInt(createdY) + 2}-${createdM}-${createdD}`}</span>까지 <strong className="text-amber-900 font-black">2년간</strong>으로 한다.<br />
            ② ‘을’은 가맹계약 후 3개월 안에 가맹점을 오픈하여야 한다.
          </p>
        </section>

        {/* 第12條 가맹점의 장소 선정 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第12條</span>
            <span>가맹점의 장소 선정</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’은 자신의 책임 하에 가맹점을 설치할 지역 및 장소를 선정하여야 한다.<br />
            ② ‘갑’은 가맹점의 설치 지역 및 장소에 대하여 시장특성, 교통량, 인구 분포 및 주요 근린시설, 가맹점별 특성에 따른 매출성향 등을 고려하여 ‘을’에게 조언을 할 수 있다.<br />
            ③ ‘갑’은 ‘을’이 가맹점 설치를 희망하는 장소가 인근 가맹점과의 영업지역 침해 여부, 브랜드 전략 등을 고려하여 부적합하다고 판단될 경우 해당 장소에 대한 가맹점 개점 승인을 거부할 수 있다.
          </p>
        </section>

        {/* 第13條 영업지역의 보호 */}
        <section id="doc-clause-13" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第13條</span>
            <span>영업지역의 보호</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’의 영업지역은 <span className={highlightClass}>{contract.businessArea || "가맹점 반경 500m 내"}</span> [별첨[1]]과 같이 하며, ‘갑’은 계약기간 중 ‘을’의 영업지역에서 ‘을’과 동일한 업종의 자기 또는 계열회사의 직영점이나 가맹점을 개설하지 아니한다.<br />
            ② ‘갑’은 계약기간 중 또는 계약갱신과정에서 ‘을’의 영업지역을 축소할 수 없다. 다만, 계약갱신 과정에서 다음 각 호의 어느 하나에 해당하는 경우에는 ‘을’과의 합의를 통해 영업지역을 조정할 수 있다.
          </p>
          <ol className="list-decimal list-inside space-y-0.5 pl-1 text-slate-700 leading-relaxed break-keep text-[11.5px] sm:text-xs">
            <li>재건축, 재개발 또는 신도시 건설 등으로 인하여 상권의 급격한 변화가 발생하는 경우</li>
            <li>해당 상권의 거주인구 또는 유동인구가 현저히 변동되는 경우</li>
            <li>소비자의 기호변화 등으로 인하여 해당 상품, 용역에 대한 수요가 현저히 변동되는 경우</li>
            <li>제1호부터 제3호까지의 규정에 준하는 경우로서 기존 영업지역을 그대로 유지하는 것이 현저히 불합리하다고 인정되는 경우</li>
          </ol>
          <p className="text-left break-keep leading-relaxed pt-1">
            ③ ‘을’은 ‘갑’과 약정한 영업지역을 준수하며, 영업지역을 벗어나 다른 가맹점의 영업지역을 침범하지 아니한다. ‘을’이 자신의 영업지역을 벗어나 다른 가맹점사업자의 영업지역에 속한 고객에게 영업활동을 하는 경우 ‘갑’은 다음 각 호의 어느 하나의 조치를 취하여 가맹점사업자 상호간의 이해관계를 합리적으로 조정할 수 있다.
          </p>
          <ol className="list-decimal list-inside space-y-0.5 pl-1 text-slate-700 leading-relaxed break-keep text-[11.5px] sm:text-xs">
            <li>‘갑’이 두 가맹점사업자 간의 보상금 지불에 대한 중재안을 제시</li>
            <li>영업지역을 침해받은 가맹점사업자의 영업지역 조정 요구가 있는 경우 매출액 현황 조사 등 필요한 조치 수행</li>
            <li>특정 가맹점사업자가 다른 가맹점사업자의 영업지역을 반복적으로 침해하여 다른 가맹점사업자의 영업과 ‘갑’의 가맹사업 경영에 심각한 손해를 가한 경우 그 가맹점사업자에게 행위의 시정을 요구하고 손해배상 청구</li>
          </ol>
        </section>

        {/* 第14條 점포의 설비 */}
        <section id="doc-clause-14" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第14條</span>
            <span>점포의 설비 및 공사감리</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’의 점포설비(인테리어)는 가맹사업 전체의 통일성과 독창성을 유지할 수 있도록 ‘갑’이 정한 사양에 따라 설계, 시공한다(기존시설을 변경하는 경우에도 같다).<br />
            ② ‘을’은 ‘갑’이 정한 사양에 따라 직접 시공하거나 ‘갑’ 또는 ‘갑’이 지정한 업체를 통해 시공할 수 있다.<br />
            ③ ‘갑’은 공사의 원활한 진행을 위하여 ‘을’에게 공사에 필요한 디자인 제공 및 공사의 감리를 진행하며, ‘을’은 이에 대한 공사감리비 <span className={highlightClass}>{formatMoney(contract.supervisionFee)}</span> 원(부가가치세포함)을 ‘갑’에게 지급한다. 다만 ‘을’이 ‘갑’ 또는 ‘갑’이 지정한 업체에게 공사를 의뢰하는 경우에는 그러하지 아니한다.<br />
            ④ 점포설비에 따른 제반 인허가는 ‘을’이 자신의 책임과 비용으로 취득한다.<br />
            ⑤ ‘갑’은 점포의 시설, 장비, 인테리어 등의 노후화가 객관적으로 인정되는 경우 또는 위생, 안전의 결함이나 이에 준하는 사유로 인하여 가맹사업의 통일성을 유지하기 어렵거나 정상적인 영업에 현저한 지장을 주는 경우에는 점포환경개선을 요구 또는 권유할 수 있다.<br />
            ⑥ ‘갑’은 ‘을’에게 점포환경개선을 요구하지 않는다, 만약 ‘갑’의 요구에 의하여 ‘을’의 점포환경개선에 간판교체비용, 인테리어 공사비용(장비, 집기의 교체비용을 제외한 실내건축공사에 소요되는 일체의 비용을 말한다)이 소요될 경우에는 그 금액의 20%(점포의 확장 또는 이전을 수반하는 경우에는 40%)를 부담한다. 다만, ‘갑’의 권유 또는 요구가 없음에도 ‘을’이 자발적 의사에 의하여 점포환경을 개선하거나 ‘을’의 귀책사유로 위생, 안전 및 이와 유사한 문제가 발생하여 불가피하게 점포환경을 개선하는 경우는 그러하지 아니하다.
          </p>
        </section>

        {/* 第15條 최초가맹금 및 예치가맹금 */}
        <section id="doc-clause-15" className="space-y-2.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第15條</span>
            <span>최초가맹금 및 예치가맹금</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’이 ‘갑’에 지급하여야 할 최초가맹금은 일금 <span className={highlightClass}>{formatMoney((Number(contract.depositMembershipFee) || 0) + (Number(contract.depositEduFee) || 0) + (Number(contract.depositSupportFee) || 0))}</span> 원(부가가치세포함)으로 한다.<br />
            ② ‘을’은 계약체결일에 제1항의 최초가맹금과 계약이행보증금을 ‘갑’이 지정하는 아래 금융회사에 예치하여야 한다.
          </p>

          {/* 금융회사 및 예치가맹금 내역 카드/표 */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 text-xs space-y-2.5 w-full max-w-full overflow-hidden shadow-2xs">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-black text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span>* 예치금융회사 : <strong className="text-blue-700">{HEADQUARTERS_INFO.depositBank}</strong></span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span>계좌번호 : <strong className="text-blue-700">{HEADQUARTERS_INFO.depositAccount}</strong></span>
              <span className="text-slate-300 hidden sm:inline">|</span>
              <span>예금주 : {HEADQUARTERS_INFO.depositAccountHolder}</span>
            </div>

            {/* 1. PC/인쇄용 테이블 (sm 이상) */}
            <div className="hidden sm:block w-full rounded-lg border border-slate-200 bg-white overflow-hidden">
              <table className="w-full text-xs text-left border-collapse table-fixed">
                <colgroup>
                  <col style={{ width: "45%" }} />
                  <col style={{ width: "55%" }} />
                </colgroup>
                <thead className="bg-slate-100 font-bold text-slate-700 text-[11px]">
                  <tr>
                    <th className="p-2 border-b border-r border-slate-200 text-slate-800 font-black pl-3">예치가맹금 내역</th>
                    <th className="p-2 border-b border-slate-200 text-right pr-3 text-slate-800 font-black">금액 (원, VAT포함)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 border-r border-slate-200 text-slate-700 font-semibold pl-3">가입비 (가맹비)</td>
                    <td className="p-2 text-right font-bold pr-3 text-slate-900">
                      <span className={highlightClass}>{formatMoney(contract.depositMembershipFee)}</span> 원
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 border-r border-slate-200 text-slate-700 font-semibold pl-3">오픈교육비</td>
                    <td className="p-2 text-right font-bold pr-3 text-slate-900">
                      <span className={highlightClass}>{formatMoney(contract.depositEduFee)}</span> 원
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 border-r border-slate-200 text-slate-700 font-semibold pl-3">오픈지원비</td>
                    <td className="p-2 text-right font-bold pr-3 text-slate-900">
                      <span className={highlightClass}>{formatMoney(contract.depositSupportFee)}</span> 원
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 bg-blue-50/30">
                    <td className="p-2 border-r border-slate-200 text-blue-950 font-semibold pl-3">
                      <div className="flex items-center gap-1">
                        <span>계약이행보증금</span>
                        <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded font-bold">환급형</span>
                      </div>
                    </td>
                    <td className="p-2 text-right font-bold pr-3 text-blue-900">
                      <span className={highlightClass}>{formatMoney(contract.depositGuaranteeFee)}</span> 원
                    </td>
                  </tr>
                  <tr className="bg-amber-50 font-black text-slate-900">
                    <td className="p-2 border-r border-slate-200 font-black pl-3 text-amber-950">예치가맹금 합계</td>
                    <td className="p-2 text-right text-amber-950 font-black pr-3">
                      {formatMoney(
                        (Number(contract.depositMembershipFee) || 0) +
                        (Number(contract.depositEduFee) || 0) +
                        (Number(contract.depositSupportFee) || 0) +
                        (Number(contract.depositGuaranteeFee) || 0)
                      )} 원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. 모바일 전용 반응형 리스트 (스마트폰에서 금액 100% 선명 노출) */}
            <div className="block sm:hidden rounded-lg border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 text-xs print:hidden">
              <div className="p-2.5 flex items-center justify-between gap-2">
                <span className="font-bold text-slate-700">가입비 (가맹비)</span>
                <span className="font-black text-slate-900">{formatMoney(contract.depositMembershipFee)} 원</span>
              </div>
              <div className="p-2.5 flex items-center justify-between gap-2">
                <span className="font-bold text-slate-700">오픈교육비</span>
                <span className="font-black text-slate-900">{formatMoney(contract.depositEduFee)} 원</span>
              </div>
              <div className="p-2.5 flex items-center justify-between gap-2">
                <span className="font-bold text-slate-700">오픈지원비</span>
                <span className="font-black text-slate-900">{formatMoney(contract.depositSupportFee)} 원</span>
              </div>
              <div className="p-2.5 flex items-center justify-between gap-2 bg-blue-50/40">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-blue-950">계약이행보증금</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded font-bold">환급형</span>
                </div>
                <span className="font-black text-blue-950">{formatMoney(contract.depositGuaranteeFee)} 원</span>
              </div>
              <div className="p-2.5 flex items-center justify-between gap-2 bg-amber-100/80 font-black">
                <span className="text-amber-950 font-black">예치가맹금 합계</span>
                <span className="text-amber-950 font-black">
                  {formatMoney(
                    (Number(contract.depositMembershipFee) || 0) +
                    (Number(contract.depositEduFee) || 0) +
                    (Number(contract.depositSupportFee) || 0) +
                    (Number(contract.depositGuaranteeFee) || 0)
                  )} 원
                </span>
              </div>
            </div>
          </div>

          <p className="text-left break-keep leading-relaxed pt-1">
            ③ ‘갑’은 다음 각 호의 어느 하나에 해당하는 경우에 위 예치기관의 장에게 예치가맹금의 지급을 요청할 수 있다.<br />
            1. ‘을’이 영업을 개시한 경우<br />
            2. 가맹계약 체결일로부터 2개월이 경과한 경우
          </p>
        </section>

        {/* 第16條 가맹금의 반환 */}
        <section id="doc-clause-16" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第16條</span>
            <span>가맹금의 반환</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’ 또는 가맹희망자는 다음 각 호의 어느 하나에 해당하는 경우에 이 계약의 체결일로부터 4개월 이내(제3호의 경우 ‘갑’의 영업중단일로부터 4개월 이내)에 ‘갑’에 서면으로 가맹금의 반환을 청구할 수 있다. 이 경우 반환하는 가맹금의 금액은 가맹계약의 체결 경위, 금전이나 그 밖에 지급된 대가의 성격, 가맹계약기간, 계약이행기간, 가맹사업당사자의 귀책정도 등을 고려하여 당사자의 협의에 의하여 결정한다.<br />
            1. ‘갑’이 등록된 정보공개서를 제공하지 아니하거나 정보공개서를 제공한 날로부터 14일(제46조에 따라 변호사 또는 가맹거래사의 자문을 받은 경우에는 7일)이 지나지 아니하였음에도 가맹금을 수령(가맹금을 예치하는 경우에는 예치)하거나 가맹계약을 체결한 경우<br />
            2. ‘갑’이 가맹희망자에게 정보를 제공함에 있어 허위 또는 과장된 정보를 제공하거나 중요사항을 누락하여 계약 체결에 중대한 영향을 준 것으로 인정되는 경우<br />
            3. ‘갑’이 정당한 사유 없이 가맹사업을 일방적으로 중단한 경우<br />
            ② ‘을’은 계약기간 내에 자기의 귀책사유 없는 사유로 계약이 해지되는 등 가맹계약이 중도에 종료되는 경우에는 영업표지 사용료, 영업시스템의 계속적 이용료 등과 같이 전체 계약기간에 대한 선급금의 성질을 갖는 가맹금 중 미경과 잔여계약기간의 비율에 해당하는 금액의 반환을 청구할 수 있다. 다만, 이는 손해배상의 청구에 영향을 미치지 아니한다.<br />
            ③ 제2항의 경우에 최초교육비 등과 같이 계약기간에 따른 선급금의 성질을 갖지 않는 가맹금 중 이행이 완료된 급부의 대가에 해당하는 가맹금에 관하여는 공평의 관념에 어긋나지 않는 범위에서 당사자의 약정에 따라 반환하지 아니할 수 있다.<br />
            ④ 제2항에 의해 ‘갑’이 가입비의 일부를 반환해야 하는 경우에는 ‘을’의 청구가 있는 날 부터 30일 이내에 반환하여야 한다.
          </p>
        </section>

        {/* 第17條 계속가맹금 */}
        <section id="doc-clause-17" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第17條</span>
            <span>계속가맹금 (로열티)</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’은 ‘갑’의 상호, 상표, 서비스표, 휘장 등의 사용 및 경영지원에 대한 대가로 로열티 <span className={highlightClass}>월 {formatMoney(contract.royaltyFee)}</span> 원(부가가치세포함)을 매월 1일에 ‘갑’에게 지급한다.<br />
            ② ‘을’은 가맹점의 영업개시 후 10일 이내에 ‘을’의 가맹점 주거래계좌에 동조 ①항의 금액 지급에 관하여 ‘갑’의 계좌로 자동이체신청을 하여야하며 이에 따른 은행의 발급증명서를 ‘갑’에게 제출하여야 한다.<br />
            <strong className="text-blue-700">* 계좌정보 : {HEADQUARTERS_INFO.royaltyBank} {HEADQUARTERS_INFO.royaltyAccount} 예금주 : {HEADQUARTERS_INFO.royaltyAccountHolder}</strong><br />
            ③ ‘을’이 로열티를 연체하는 경우, ‘을’은 ‘갑’에게 연체한 로열티의 연2할에 해당하는 금액을 지연배상금으로 지급하여야 한다.<br />
            ④ 계약기간이 만료되어 재계약을 할 경우, 물가인상률을 반영하여 기존 로열티의 10% 범위 안에서 인상된 로열티를 새로이 정한다.<br />
            ⑤ ‘갑’은 ‘을’의 책임없는 사유로 가맹계약이 해지되는 경우, 선납된 로열티 중 미경과 일수에 따라 일할계산하여 반환한다.<br />
            ⑥ ‘을’이 ‘갑’으로부터 공급받는 상품⋅원재료⋅부재료 등에 대하여 ‘갑’에 지급하는 대가는 차액가맹금을 포함한다.
          </p>
        </section>

        {/* 第18條 계약이행보증금 */}
        <section id="doc-clause-18" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第18條</span>
            <span>계약이행보증금</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’은 영업표지 사용료, 광고판촉비(‘을’이 부담하게 되는 금액에 한한다) 등 계속가맹금 및 상품 등의 대금과 관련한 채무액 또는 손해배상액의 지급을 담보하기 위하여 계약이행보증금으로 <span className={highlightClass}>{formatMoney(contract.guaranteeFee)}</span> 원(부가가치세 없음)을 ‘갑’에게 지급하여야 한다.<br />
            ② 전항의 계약이행보증금을 금전으로 지급하는 경우, ‘을’은 가맹점 영업이 개시되거나 계약체결일에 위 금전을 제15조 제2항에 지정된 금융기관에 예치하여야 한다.<br />
            ③ 계약이 기간만료 또는 해지 등의 사유로 인하여 종료된 경우 ‘갑’은 기간만료일 또는 해지일로부터 30일 이내에 ‘을’에게 계약이행보증금으로 잔존 채무액과 손해배상액을 정산한 잔액을 상환하고 정산서를 교부하여야 한다.
          </p>
        </section>

        {/* 第19條 교육 및 훈련 */}
        <section id="doc-clause-19" className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第19條</span>
            <span>교육 및 훈련</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’이 정한 교육 및 훈련과정을 이수하지 아니하는 자는 가맹점의 관리자로 근무할 수 없다.<br />
            ② ‘갑’의 교육훈련은 다음 표와 같이 구분하여 실시한다. (단위:원, vat포함)
          </p>

          <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 font-bold text-slate-700 text-[11px]">
                <tr>
                  <th className="p-2 border-b border-r border-slate-200">교육훈련과정</th>
                  <th className="p-2 border-b border-r border-slate-200 text-center">실시시기</th>
                  <th className="p-2 border-b border-slate-200 text-right pr-3">‘을’ 부담비용</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-2 border-r border-slate-200 font-bold text-slate-800">오픈교육</td>
                  <td className="p-2 border-r border-slate-200 text-center text-slate-600">오픈 전</td>
                  <td className="p-2 text-right pr-3 font-bold text-slate-900">{formatMoney(contract.eduOpenFee || 2200000)} 원 (최초가맹금에 포함)</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-2 border-r border-slate-200 font-bold text-slate-800">신입교육</td>
                  <td className="p-2 border-r border-slate-200 text-center text-slate-600">신입직원 채용 시</td>
                  <td className="p-2 text-right pr-3 font-bold text-slate-900">{formatMoney(contract.eduNewFee || 220000)} 원 (1인 기준)</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold text-slate-800">특별교육</td>
                  <td className="p-2 border-r border-slate-200 text-center text-slate-600">가맹점사업자 요청시</td>
                  <td className="p-2 text-right pr-3 text-slate-500">별도 협의</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-left break-keep leading-relaxed pt-1">
            ③ ‘을’은 자신이 비용을 부담하여 ‘갑’에게 교육 및 훈련요원의 파견을 요청할 수 있다.
          </p>
        </section>

        {/* 第20條 계약의 수정 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第20條</span>
            <span>계약의 수정</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’과 ‘을’은 가맹점의 이전, 이전에 따른 영업지역 변경, 가맹점 명칭 변경 및 경제상황 및 사정변경에 의한 가맹계약 조건의 변경에 대하여 상호동의에 의하여 수정 및 변경을 할 수 있다.<br />
            ② 가맹계약갱신 시에는 해당 시점에 ‘갑’이 다른 가맹점사업자에게 통상적으로 적용되는 계약조건이나 영업방침을 적용한 계약조건을 ‘을’에게 요구할 수 있다.<br />
            ③ ‘을’은 동조 2항에 의하여 ‘갑’이 제시하는 조건을 합리적인 이유 없이 거절할 수 없다.
          </p>
        </section>

        {/* 第21條 가맹점의 인허가 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第21條</span>
            <span>가맹점의 인허가</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’은 가맹점 운영을 위한 제반 면허나 인⬝허가는 영업개시일 전까지 ‘을’의 책임과 비용으로 취득하여야 한다.<br />
            ② ‘을’은 전항의 사업자등록증, 영업허가증 등 필요한 증명서의 사본을 영업개시일 전까지 ‘갑’에게 제출하여야 한다.<br />
            ③ ‘을’이 가맹점 운영과 관련된 각종 인허가 등 규정을 위반하여 발생되는 일체의 민⬝형사상 책임은 “을”이 부담한다.
          </p>
        </section>

        {/* 第22條 경영지도 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第22條</span>
            <span>경영지도</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’은 ‘을’의 경영활성화를 위하여 경영지도를 할 수 있다.<br />
            ② ‘을’은 자신의 비용부담으로 ‘갑’에게 경영지도를 요청할 수 있다. 다만, ‘을’이 부담하여야 할 비용은 가맹금에 포함된 통상의 경영지도 비용을 초과한 부분에 한한다.
          </p>
        </section>

        {/* 第23條 직원의 채용 및 교육 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第23條</span>
            <span>직원의 채용 및 교육</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’은 통일적 서비스와 품질관리규정을 준수하고 ‘갑’의 명예와 신용이 훼손되지 아니하도록 ‘갑’이 합리적으로 정하는 기준에 따라 우수한 능력과 자질을 가진 직원을 채용하여야 한다.<br />
            ② ‘을’이 신규로 고용하고자 하는 모든 직원은 이 계약서에 규정된 소정의 교육과정을 반드시 수료하여야 한다.
          </p>
        </section>

        {/* 第24條 감독 및 통제 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第24條</span>
            <span>감독 및 통제</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’은 ‘을’의 경영상태를 파악하기 위하여 년 1회 점포를 점검하고 ‘을’에 그 결과를 지체 없이 통지하여야 하며 기준에 위반하는 사항에 대해 시정을 요구할 수 있다.<br />
            ② 점포의 점검은 품질관리, 서비스관리, 위생관리, 회계처리, 각종설비관리 등의 상태를 대상으로 한다.<br />
            ③ ‘갑’은 점포관리기준을 ‘을’에게 제시하고, 제시 후 10일부터 그 기준에 의하여 점검한다. 점포관리기준을 변경하는 경우에도 같다.
          </p>
        </section>

        {/* 第25條 구입강제품목의 지정 */}
        <section id="doc-clause-25" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第25條</span>
            <span>구입강제품목의 지정</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’은 가맹사업을 경영하는데 필수적이며, 다른 사업자로부터 구매할 경우 ‘갑’의 상표권을 보호하고 상품 또는 용역의 동일성을 유지하기 어려운 품목을 반드시 ‘갑’ 또는 지정된 사업자로부터 구입하도록 할 수 있으며(이하 이러한 품목을 구입강제품목이라 한다.), ‘갑’은 구입강제품목을 지정한 경우 해당 품목의 종류(규격 및 단위, 거래상대방, 기준 시점 등을 포함한다)를 문서, POS시스템, 전자우편, 전자매체 등을 통해 ‘을’에게 통지해야 한다. 통지된 내용은 본 가맹계약의 내용에 포함된다.<br />
            ② ‘을’은 제1항에 따른 구입강제품목을 ‘갑’ 또는 지정된 사업자로부터 공급받아야 한다. 다만, ‘갑’ 또는 지정업체가 공급하지 아니하거나 천재지변, 사회적 재난 또는 합리적 사유 없이 공급을 지연하는 물품은 ‘갑’으로부터 사전에 승인을 얻어 ‘을’이 직접 조달할 수 있으며, 공급의 차질로 가맹점 운영이 곤란한 경우 등의 사정이 있는 경우에는 직접 조달 후 사후 승인을 얻을 수도 있다. 이 경우 ‘을’은 브랜드의 동일성을 해치지 않도록 하여야 한다.<br />
            ③ ‘갑’은 ‘을’이 제2항 단서에 의하여 직접 조달하는 구입강제품목에 대하여 품질관리기준을 제시하고 그 기준의 준수여부를 검사할 수 있다. 이 경우 ‘을’은 ‘갑’의 품질검사에 협조하여야 한다.<br />
            ④ ‘갑’은 구입강제품목의 공급가격 및 공급가격 결정기준(기준시점을 포함한다)을 문서, POS시스템, 전자우편, 전자매체 등을 통해 ‘을’에게 통지해야 하며, 통지된 내용은 본 가맹계약의 내용에 포함된다. 단, 천재지변, 전쟁, 전염병의 창궐 등 ‘갑’의 책임없는 사유로 인한 전 세계적 수급불안정 등으로 인해 큰 폭의 가격 변동이 급작스럽게 발생하는 경우 통지한 공급가격 결정기준을 따르지 않을 수 있다.<br />
            ⑤ ‘갑’은 위 제1항 및 제4항에 따라 통지한 내역을 문서 또는 전자문서로 5년 간 저장·관리하여 ‘을’이 언제든지 열람할 수 있도록 해야 한다.<br />
            ⑥ 제1항에 따른 구입강제품목의 종류는 신제품 출시, 기존 제품 철수 등의 사유로 그 내역을 변경할 수 있고, 제4항에 따른 구입강제품목의 공급가격 및 공급가격 결정기준은 품목별 원가율 변경, 원자재 가격 인상 등의 사유로 변경할 수 있다. 다만, 구입강제품목의 종류, 공급가격, 공급가격 결정기준의 변경은 품목별 별도의 합의가 이루어진 경우 등 특별한 사정이 없는 경우 분기에 1회로 한정한다.<br />
            ⑦ ‘갑’은 구입강제품목의 종류, 공급가격, 공급가격 결정기준을 변경한 즉시 변경된 내역을 문서, POS시스템, 전자우편, 전자매체 등을 통해 ‘을’에게 통지해야 하며, 통지된 내용은 본 가맹계약의 내용에 포함된다.
          </p>
        </section>

        {/* 第26條 거래조건 변경 협의 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第26條</span>
            <span>거래조건 변경 협의</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’은 다음 각 호와 같이 구입강제품목의 거래조건을 ‘을’에게 불리하게 변경하는 경우 ‘을’과 협의를 거쳐야 한다.
          </p>
          <ol className="list-decimal list-inside space-y-0.5 pl-1 text-slate-700 leading-relaxed break-keep text-[11.5px] sm:text-xs">
            <li>특정한 거래상대방과 거래할 것을 강제하지 않던 품목을 특정한 거래상대방과 거래하도록 강제하는 경우</li>
            <li>구입강제품목의 단위(수량, 용량, 규격, 중량 등) 당 공급가격을 인상하는 경우. 다만, 제25조 제4항에 따른 공급가격 산정방식에 따라 ‘갑’의 의사와 무관히 자동으로 가격이 인상되는 경우는 제외한다.</li>
            <li>구입강제품목의 공급가격 산정방식을 ‘을’에게 불리하게 변경하는 경우</li>
            <li>구입강제품목의 품질을 떨어뜨리는 경우</li>
            <li>구입강제품목의 거래상대방을 축소한 경우</li>
            <li>구입강제품목의 운송비, 검수비 등 부대비용을 ‘을’이 추가로 부담하게 하거나 반품조건, 대금결제방식 등을 불리하게 변경하는 등 그 밖의 거래조건을 ‘을’에게 불리하게 변경하는 경우</li>
          </ol>
          <p className="text-left break-keep leading-relaxed pt-1">
            ② ‘갑’과 ‘을’은 협의의 각 절차에 신의에 따라 성실히 임해야 한다.<br />
            ③ 불리한 거래조건의 변경 및 유리한 거래조건의 변경이 동시에 이루어지는 경우 및 ‘갑’이 지정한 사업자가 공급하는 구입강제품목의 거래조건이 불리하게 변경되는 경우에도 ‘을’과 협의를 거쳐야 한다.<br />
            ④ 협의는 변경 예정 거래조건의 규모와 중요성에 따라 대면 또는 비대면(POS, 전자우편, 전자매체 등) 방식으로 진행한다.<br />
            ⑤ ‘갑’은 협의 예정일의 10일 전까지 변경 예정인 거래조건의 구체적인 내역, 변경 사유와 근거, 협의 방식과 장소 등 협의에 필요한 사항을 문서, 내용증명우편, 전자우편, 인터넷 홈페이지, 모바일 애플리케이션, POS 등의 방식으로 ‘을’에게 통지한다. 비대면 협의의 경우에는 위 사항을 통지한 날로부터 10일 이상의 협의기간을 정하고 그 기간동안 ‘을’이 자유롭게 의견을 제출할 수 있게 해야 한다.<br />
            ⑥ ‘갑’은 협의 과정에서 ‘을’이 협의와 관련된 자료의 제공이나 사실 확인을 요청할 경우 이에 성실히 응하고, ‘을’이 제출한 의견에 대해서는 ‘갑’의 입장과 판단 근거를 설명해야 한다.<br />
            ⑦ 협의가 종료되면 ‘갑’은 협의한 날짜/장소/방식/참석자, 가맹점사업자가 제시한 의견 및 ‘갑’의 입장, 변경된 거래조건 등 결정된 사항을 정리하여 ‘을’에게 통지해야 한다.<br />
            ⑧ 협의는 구입강제품목 거래조건 변경 전에 완료해야 한다. 다만, 정당한 사유가 있는 경우 사후 협의할 수 있다.<br />
            ⑨ 제1항에 따른 협의는 전체 가맹점사업자의 100분의 70 이상이 동의하는 경우 가맹점사업자단체와의 협의로 대신할 수 있다.
          </p>
        </section>

        {/* 第27條 광고 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第27條</span>
            <span>광고</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① '갑'은 가맹사업 및 가맹점 영업의 활성화를 위하여 전국단위 및 지역단위로 광고를 시행할 수 있다. 다만, 가맹점사업자가 비용의 전부 또는 일부를 부담하는 광고를 실시하려는 경우에는 사전에 전체 가맹점사업자의 50% 이상의 동의를 받아야 한다.<br />
            ② 사전에 가맹계약과 별도로 광고에 관한 분담 약정을 체결한 경우에는 제1항에 따른 동의를 받지 아니할 수 있다.<br />
            ③ 전국단위 광고 비용은 '갑'과 '을'이 분담하며 직전 분기 총매출액 비율 등에 따라 산정한다.<br />
            ④ '을'은 자기의 비용으로 영업지역 내에서 광고를 시행할 수 있으며 사전에 '갑'의 승인을 받아야 한다.<br />
            ⑤ '갑'은 사업연도 중 가맹점사업자가 비용을 분담한 광고 집행 내역을 사업연도 종료 후 3개월 이내에 통보하여야 한다.
          </p>
        </section>

        {/* 第28條 판촉 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第28條</span>
            <span>판촉</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① '갑'은 가맹사업 및 가맹점 영업의 활성화를 위하여 판촉활동을 시행할 수 있으며, 가맹점사업자가 비용을 부담하는 판촉행사는 전체 가맹점사업자의 70% 이상의 동의를 받아야 한다.<br />
            ② '을'은 자기의 비용으로 자기 지역 내에서 판촉활동을 할 수 있으며 사전에 '갑'과 협의하여야 한다.<br />
            ③ '갑'은 판촉행사 집행 내역을 사업연도 종료 후 3개월 이내에 통보하여야 한다.
          </p>
        </section>

        {/* 第29條 초도상품 및 초도물품 */}
        <section id="doc-clause-29" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第29條</span>
            <span>초도상품 및 초도물품</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’은 ‘갑’에게 원활한 가맹점운영에 필요한 초도상품 및 초도물품을 구매하여야 한다.<br />
            ② ‘을’은 동조 제1항의 물품에 해당하는 금액 일금 <span className={highlightClass}>{formatMoney(contract.initialSupplyFee)}</span> 원(부가가치세포함)을 ‘갑’에게 영업시작 15일 전까지 지급하여야 한다.
          </p>
        </section>

        {/* 第30條 ~ 第36條 원ㆍ부재료 조달, 하자검사, 영업 및 보험 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第30條 ~ 第36條</span>
            <span>원ㆍ부재료 조달, 하자검사, 영업 및 보험</span>
          </h2>
          <div className="space-y-1 pl-1 text-slate-700 leading-relaxed break-keep">
            <p><strong>[제30조 원⬝부재료의 조달]</strong> ‘을’은 원활한 가맹점운영을 위하여 ‘갑’ 또는 ‘갑’이 지정하는 자로부터 상품과 원⬝부재료를 공급받아야 하며, 그 대금은 발주 시 또는 ‘갑’의 정한 바에 따라 선납하여야 한다.</p>
            <p><strong>[제31조 검사와 하자통지]</strong> ‘을’은 공급받은 물품을 지체 없이 검사하여야 하며 하자 발견 시 즉시 서면 통지하여야 한다.</p>
            <p><strong>[제32조 공급의 중단]</strong> ‘을’이 물품대금 지급을 지체하거나 품질기준을 위반한 경우 ‘갑’은 7일 이상의 유예기간을 두고 시정을 최고한 후 공급을 중단할 수 있다.</p>
            <p><strong>[제33조 영업]</strong> ‘을’은 주 5일 이상, 월 21일 이상 개장하여야 하며 ‘갑’의 사전 서면 승인 없이 7일 이상 연속하여 휴업할 수 없다.</p>
            <p><strong>[제34조 복장]</strong> ‘을’과 종업원은 ‘갑’이 정한 유니폼과 위생 복장을 착용하여 브랜드 통일성을 유지하여야 한다.</p>
            <p><strong>[제35조 보고의무]</strong> ‘을’은 성실히 회계장부를 비치·관리하고 연 1회 이상 ‘갑’의 요청 시 매출 및 경영상황을 보고한다.</p>
            <p><strong>[제36조 보험가입]</strong> ‘을’은 영업 중 발생할 수 있는 사고에 대비하여 영업배상책임보험 및 화재보험에 가입하여야 한다.</p>
          </div>
        </section>

        {/* 第37條 영업양도 및 담보제공 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第37條</span>
            <span>영업양도 및 담보제공</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘을’은 ‘갑’의 사전 서면 승인을 얻어 가맹점의 운영권을 양도하거나 담보로 제공할 수 있다.<br />
            ② 양수인은 ‘을’의 본 계약상 모든 권리와 의무를 포괄적으로 승계하며, 양수인에 대해서는 최초가맹비가 면제된다(단, 실비 수준의 교육비 및 행정비용, 보증금 제외).
          </p>
        </section>

        {/* 第38條 영업의 상속 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第38條</span>
            <span>영업의 상속</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ‘을’의 사망 시 상속인은 가맹점 영업을 상속받을 수 있으며 상속개시일로부터 3개월 이내에 승계 의사를 통지하여야 한다. 상속인에게는 최초가맹비가 면제된다.
          </p>
        </section>

        {/* 第39條 계약의 갱신과 거절 */}
        <section id="doc-clause-39" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第39條</span>
            <span>계약의 갱신과 재가맹비</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’은 ‘을’이 가맹계약기간 만료 전 180일부터 90일까지 사이에 가맹계약의 갱신을 요구하는 경우 정당한 사유 없이 거절하지 못한다 (최초 계약기간 포함 10년 범위 내).<br />
            ② 만료 전 180일부터 90일까지 거절 또는 조건변경 통지가 없는 경우 동일한 조건으로 2년간 자동 갱신된 것으로 본다.<br />
            ③ 가맹계약 갱신 합의 시 ‘을’은 ‘갑’에게 재가맹비 <span className={highlightClass}>{formatMoney(contract.reFranchiseFee)}</span> 원(부가가치세포함)을 납입하며 갱신 계약기간은 2년으로 한다.
          </p>
        </section>

        {/* 第40條 계약의 해지 및 위약금 */}
        <section id="doc-clause-40" className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第40條</span>
            <span>계약의 해지 및 위약금</span>
          </h2>
          <p className="text-left break-keep leading-relaxed">
            ① ‘갑’이 계약을 해지하려는 경우 2개월 이상의 유예기간을 두고 2회 이상 서면으로 시정을 최고하여야 한다.<br />
            ② 파산, 강제집행, 부도, 관련 법령 위반 형사처벌, 7일 이상 무단영업중단 등 중대한 법정 사유 발생 시에는 즉시 해지할 수 있다.<br />
            ③ ‘을’의 중대한 귀책사유로 계약이 중도 해지되거나 임의 해지하는 경우 위약금은 <span className={highlightClass}>{formatMoney(contract.penaltyFee)}</span> 원으로 정한다.
          </p>
        </section>

        {/* 第41條 ~ 第47條 계약 종료 조치, 비밀유지, 손해배상 및 분쟁해결 */}
        <section className="space-y-1.5">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">第41條 ~ 第47條</span>
            <span>계약 종료 조치, 비밀유지, 손해배상 및 분쟁해결</span>
          </h2>
          <div className="space-y-1 pl-1 text-slate-700 leading-relaxed break-keep">
            <p><strong>[제41조 계약종료 조치]</strong> 계약 종료 즉시 간판 철거 및 영업표지 사용을 중단하고 보증금을 정산 반환한다.</p>
            <p><strong>[제42조 비밀유지 및 경업금지]</strong> 조리법 등 영업비밀을 엄수하며 계약기간 및 종료 후 1년간 영업지역 내 동종 영업을 금지한다.</p>
            <p><strong>[제43조 지연이자]</strong> 금전지급의무 지체 시 연 20%의 지연이자를 가산 지급한다.</p>
            <p><strong>[제44조 손해배상]</strong> 일방 당사자의 고의·과실로 상대방에게 손해가 발생한 경우 그 손해를 배상하여야 한다.</p>
            <p><strong>[제45조 분쟁의 해결]</strong> 분쟁 발생 시 상호 협의하며 한국공정거래조정원 조정신청 또는 민사소송법상 관할법원으로 해결한다.</p>
            <p><strong>[제46조~제47조 정보공개서 및 계약서 수령 확인]</strong> ‘을’은 본 계약 체결일로부터 최소 14일 전에 공정거래위원회에 등록된 정보공개서 및 가맹계약서 인쇄본 또는 전자문서를 정당하게 수령·열람하였음을 확인한다.</p>
          </div>
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
          <div className="bg-slate-100 px-3.5 py-2.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="font-black text-xs sm:text-sm text-[#0F172A] break-keep">
              별첨 [1] : 영업지역의 표시
            </h3>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto shrink-0">
              제13조 관련
            </span>
          </div>
          <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs text-slate-700 break-keep">
              가맹본부(‘갑’)와 가맹점사업자(‘을’)가 상호 합의하여 확정한 가맹점의 배타적 영업보호지역은 다음과 같습니다.
            </p>
            
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                <span className="block text-[10px] font-bold text-slate-400 mb-0.5">약정 사업장 소재지 (주소)</span>
                <span className="text-xs font-black text-slate-800 break-keep">
                  {contract.storeAddress || "가맹점 소재지 주소 미정"}
                </span>
              </div>
              <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-lg shadow-2xs">
                <span className="block text-[10px] font-bold text-amber-800 mb-0.5">약정 배타적 독점 영업보호지역</span>
                <span className="text-xs sm:text-sm font-black text-amber-950 break-keep">
                  {contract.storeAddress ? `${contract.storeAddress} 기준 ` : ""}
                  {contract.businessArea || "가맹점 반경 500m 내"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              ※ 본 영업지역 내에서는 타 직영점 및 가맹점의 추가 개설이 엄격히 제한됩니다.
            </p>
          </div>
        </div>

        {/* ==================== APPENDIX 2 : 허가된 영업표지 ==================== */}
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <div className="bg-slate-100 px-3.5 py-2.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="font-black text-xs sm:text-sm text-[#0F172A] break-keep">
              별첨 [2] : ‘을’에게 사용이 허가된 영업표지의 표시
            </h3>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto shrink-0">
              제10조 관련
            </span>
          </div>
          <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-xs text-left border-collapse table-fixed">
                <colgroup>
                  <col style={{ width: "36%" }} />
                  <col style={{ width: "64%" }} />
                </colgroup>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 sm:p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200 text-[10.5px] sm:text-xs">영업표지 명칭</td>
                    <td className="p-2 sm:p-2.5 font-extrabold text-[#0F172A] text-[11px] sm:text-xs break-keep">120겹파이 (120PIE)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 sm:p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200 text-[10.5px] sm:text-xs">등록번호(출원번호)</td>
                    <td className="p-2 sm:p-2.5 text-[11px] sm:text-xs font-bold text-slate-800 break-all">{HEADQUARTERS_INFO.trademarkNumber}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 sm:p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200 text-[10.5px] sm:text-xs">등록결정(심결) 연월일</td>
                    <td className="p-2 sm:p-2.5 text-[11px] sm:text-xs text-slate-700 break-keep">{HEADQUARTERS_INFO.trademarkDecisionDate}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 sm:p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200 text-[10.5px] sm:text-xs">존속기간 만료일</td>
                    <td className="p-2 sm:p-2.5 text-[11px] sm:text-xs text-slate-700 break-keep">{HEADQUARTERS_INFO.trademarkExpireDate}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 sm:p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200 text-[10.5px] sm:text-xs">지정상품 / 서비스업</td>
                    <td className="p-2 sm:p-2.5 text-[11px] sm:text-xs text-slate-700 break-keep">{HEADQUARTERS_INFO.trademarkClass}</td>
                  </tr>
                  <tr>
                    <td className="p-2 sm:p-2.5 bg-slate-50 font-bold text-slate-600 border-r border-slate-200 text-[10.5px] sm:text-xs">등록권리자</td>
                    <td className="p-2 sm:p-2.5 font-bold text-[#0F172A] text-[11px] sm:text-xs break-keep">{HEADQUARTERS_INFO.companyName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ==================== APPENDIX 3 : 구입강제품목 공급가격 ==================== */}
        <div id="doc-appendix-3" className="pt-8 border-t border-slate-200 space-y-4 print:break-before-page">
          <div className="bg-slate-100 px-3.5 py-2.5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h3 className="font-black text-xs sm:text-sm text-[#0F172A] break-keep">
              별첨 [3] : 구입강제품목 공급가격 및 공급가격 결정기준
            </h3>
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto shrink-0">
              제25조 관련
            </span>
          </div>
          
          <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs text-slate-700 break-keep">
              본 서식[별첨3]은 가맹사업거래의 공정화에 관한 법률에 의거하여 가맹계약서의 내용에 포함되며 ‘을’은 ‘갑’으로부터 본 서식[별첨3]을 제공받았음을 확인합니다.
            </p>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-xs text-left border-collapse min-w-[460px]">
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

            <div className="flex items-center justify-between text-xs font-bold text-slate-700 pt-2 flex-wrap gap-2">
              <span>[갑] 상호 : {HEADQUARTERS_INFO.companyName} (인)</span>
              <span>[을] 성명 : {contract.ownerName || "-"} ({contract.signatureImage ? "서명완료" : "인"})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
