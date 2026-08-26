"use client";

import React from "react";
import { OfficialSealStamp } from "./OfficialSealStamp";
import { OFFICIAL_SUPPLIES_LIST, HEADQUARTERS_INFO } from "./contractData";
import { Search, Sparkles } from "lucide-react";

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
  isEditable?: boolean;
  onUpdateField?: (field: keyof FranchiseContractData, value: any) => void;
  onOpenAddressSearch?: () => void;
  roadAddress?: string;
  detailAddress?: string;
  onChangeRoadAddress?: (val: string) => void;
  onChangeDetailAddress?: (val: string) => void;
  onApplyFeeDefaults?: () => void;
}

export const FranchiseContractDocument: React.FC<FranchiseContractDocumentProps> = ({
  contract,
  isPrintMode = false,
  isEditable = false,
  onUpdateField,
  onOpenAddressSearch,
  roadAddress = "",
  detailAddress = "",
  onChangeRoadAddress,
  onChangeDetailAddress,
  onApplyFeeDefaults,
}) => {
  const contractType = contract.contractType || "신규";
  const createdDate = contract.createdAt ? contract.createdAt.split(" ")[0] : new Date().toISOString().split("T")[0];
  const [createdY, createdM, createdD] = createdDate.split("-");

  const formatMoney = (amount: number | string) => {
    const num = Number(amount) || 0;
    return num.toLocaleString();
  };

  const handleFieldChange = (field: keyof FranchiseContractData, val: any) => {
    if (onUpdateField) {
      onUpdateField(field, val);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto bg-white text-[#1E293B] font-sans leading-relaxed text-[13px] print:text-[11px] print:max-w-none print:w-full print:p-0 ${isPrintMode ? "p-0" : "p-6 sm:p-12 shadow-md rounded-2xl border border-slate-200/80"}`}>
      
      {/* ==================== COVER PAGE ==================== */}
      <div className="min-h-[700px] print:min-h-[900px] flex flex-col justify-between border-b-2 border-dashed border-slate-200 pb-16 mb-16 print:border-b-0 print:pb-0 print:mb-0 print:break-after-page">
        <div className="flex justify-between items-start text-xs font-black tracking-widest text-slate-500 border-b border-slate-200 pb-2">
          <span>대 / 외 / 비</span>
          <span>120겹파이 (주)고우웰라이프</span>
        </div>

        <div className="my-auto text-center space-y-8 py-8">
          {/* Security Notice Box */}
          <div className="max-w-xl mx-auto p-4 bg-slate-50 border border-slate-200 rounded-lg text-left text-[11px] text-slate-600 space-y-1">
            <p className="font-extrabold text-slate-800">※ 본 계약서의 보안 및 무단복제 금지</p>
            <p>
              본 계약서는 가맹점희망자 또는 가맹점사업자에 대한 열람 및 가맹계약체결, 공정거래위원회 또는 법원에 제출 등의 용도 이외에 무단복제, 제3자에 대한 유출 및 공개가 금지되며 이를 위반할 경우 민형사상의 책임을 부담할 수 있음을 알려드립니다.
            </p>
          </div>

          {/* Contract Type Indicator */}
          <div className="inline-flex items-center gap-6 px-6 py-2.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-extrabold text-[#0F172A]">
            {isEditable ? (
              <div className="flex items-center gap-6">
                {["신규", "갱신", "양수"].map((type) => (
                  <label key={type} className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="docContractType"
                      value={type}
                      checked={contractType === type}
                      onChange={(e) => handleFieldChange("contractType", e.target.value)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            ) : (
              <>
                <span className="flex items-center gap-1.5">
                  신규 {contractType === "신규" ? "■" : "□"}
                </span>
                <span className="text-slate-300">/</span>
                <span className="flex items-center gap-1.5">
                  갱신 {contractType === "갱신" ? "■" : "□"}
                </span>
                <span className="text-slate-300">/</span>
                <span className="flex items-center gap-1.5">
                  양수 {contractType === "양수" ? "■" : "□"}
                </span>
              </>
            )}
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              120겹파이 가맹계약서
            </h1>
            <p className="text-lg font-bold text-amber-700">
              외식 프랜차이즈 가맹사업 표준계약서
            </p>
          </div>

          {/* Parties Summary Box */}
          <div className="max-w-md mx-auto mt-8 bg-[#F8FAFC] border border-slate-200 rounded-xl p-5 text-left text-xs space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="font-bold text-slate-500">가맹본부 (갑)</span>
              <span className="font-extrabold text-[#0F172A]">{HEADQUARTERS_INFO.companyName} (대표이사 {HEADQUARTERS_INFO.ceoName})</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="font-bold text-slate-500">가맹사업자 (을)</span>
              <span className="font-extrabold text-[#0F172A]">{contract.ownerName || (isEditable ? "가맹사업자명을 입력하세요" : "-")}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="font-bold text-slate-500">가맹점 명칭</span>
              <span className="font-extrabold text-[#0F172A]">{contract.storeName || (isEditable ? "가맹점명을 입력하세요" : "-")}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-bold text-slate-500">계약 기간</span>
              <span className="font-extrabold text-[#0F172A]">{contract.contractStart || "YYYY-MM-DD"} ~ {contract.contractEnd || "YYYY-MM-DD"}</span>
            </div>
          </div>
        </div>

        <div className="text-center font-black text-slate-700 text-sm tracking-wider">
          {HEADQUARTERS_INFO.companyName}
        </div>
      </div>

      {/* ==================== CONTRACT BODY ==================== */}
      <div className="space-y-8 print:space-y-6">
        {/* Header decoration for Print */}
        <div className="hidden print:flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-200 pb-1 mb-4">
          <span>120겹파이 가맹계약서</span>
          <span>{HEADQUARTERS_INFO.companyName}</span>
        </div>

        {/* 제1조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제1조</span>
            <span>계약의 목적</span>
          </h2>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>가맹본부 <strong>{HEADQUARTERS_INFO.companyName}</strong>(이하 ‘갑’이라 한다.)와 가맹점사업자</span>
            {isEditable ? (
              <input
                type="text"
                required
                placeholder="가맹사업자명 (예: 홍길동)"
                value={contract.ownerName}
                onChange={(e) => handleFieldChange("ownerName", e.target.value)}
                className="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-black text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-amber-500 w-44 inline-block"
              />
            ) : (
              <strong className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded">{contract.ownerName || "가맹점사업자"}</strong>
            )}
            <span>(이하 ‘을’이라 한다.)은 ‘갑’의 외식 프랜차이즈사업 ‘120겹파이’ 경영에 관하여 다음과 같이 가맹계약을 체결한다.</span>
          </div>
        </section>

        {/* 제2조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제2조</span>
            <span>용어의 정의</span>
          </h2>
          <p className="text-justify">이 계약서에서 사용된 용어는 다음 각 호와 같은 의미를 갖는다.</p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-justify text-slate-700">
            <li><strong>“가맹사업”</strong>이라 함은 가맹본부가 가맹점사업자로 하여금 자신의 상표, 서비스표, 상호, 간판 그 밖의 영업표지를 사용하여 일정한 품질기준이나 영업방식에 따라 외식업을 영위함과 아울러 이에 따른 경영 및 영업활동 등에 대한 지원, 교육과 통제를 하고, 가맹점사업자는 이에 대한 대가로 가맹본부에 가맹금을 지급하는 것을 내용으로 하는 계속적인 거래관계를 말한다.</li>
            <li><strong>“가맹본부”</strong>라 함은 가맹계약과 관련하여 가맹점사업자에게 가맹점운영권을 부여하는 사업자를 말한다.</li>
            <li><strong>“가맹점사업자”</strong>라 함은 가맹계약과 관련하여 가맹본부로부터 가맹점운영권을 부여받은 사업자를 말한다.</li>
            <li><strong>“가맹금”</strong>이라 함은 명칭이나 지급형태의 여하에 관계없이 가맹점사업자가 가맹계약에 따라 가맹본부에 지급하는 대가를 말하며, 최초가맹금, 계속가맹금, 계약이행보증금을 포함한다.</li>
            <li><strong>“최초가맹금”</strong>이라 함은 가입비, 입회비, 계약금, 할부금, 오픈지원비, 최초교육비 등 명칭을 불문하고 가맹점사업자가 가맹점운영권을 부여받아 가맹사업에 착수하기 위하여 가맹본부에 지급하는 대가를 말한다.</li>
            <li><strong>“계속가맹금”</strong>이라 함은 상표사용료, 교육비, 경영지원비 등 명칭을 불문하고 가맹점사업자가 가맹점운영권을 부여받고 가맹사업에 착수한 후 가맹본부와의 계약에 의하여 정기적 또는 비정기적으로 가맹본부에 지급하는 대가를 말한다.</li>
            <li><strong>“영업지역”</strong>이라 함은 ‘갑’이 ‘을’에게 가맹점의 설치를 허용하고 그 지역 안에서 독점적 가맹점 운영을 보장하는 지역을 말한다.</li>
            <li><strong>“구입강제품목”</strong>이라 함은 ‘갑’이 가맹사업의 통일성과 독립성 확보, 상표의 식별력 유지 등을 위하여 ‘을’에게 ‘갑’ 또는 ‘갑’이 지정하는 자로부터 구매하도록 요구하는 품목을 말한다.</li>
          </ol>
        </section>

        {/* 제3조 ~ 제7조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제3조</span>
            <span>계약당사자의 지위</span>
          </h2>
          <p className="text-justify leading-relaxed">
            ‘을’은 독자적인 사업자로서 가맹점을 운영하며, ‘갑’과 ‘을’은 상호 독립된 독립 계약자의 관계에 있다. ‘을’은 ‘갑’의 대리인, 피용자 또는 동업자로 해석되지 아니하며, ‘을’은 자신의 명의와 책임으로 가맹점을 경영한다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제4조</span>
            <span>신의성실의 원칙</span>
          </h2>
          <p className="text-justify leading-relaxed">
            ‘갑’과 ‘을’은 상호 신뢰와 협조를 바탕으로 신의성실의 원칙에 입각하여 본 계약을 성실히 이행하며 ‘120겹파이’ 브랜드 가치 제고를 위해 노력한다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제5조</span>
            <span>‘갑’의 준수사항</span>
          </h2>
          <p className="text-justify leading-relaxed">
            ‘갑’은 가맹사업의 번영을 위해 최선의 지원을 다하며 상품의 안정적 공급, 레시피 및 조리법 교육, 정기적인 슈퍼바이징 및 마케팅 지원을 성실히 수행한다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제6조</span>
            <span>‘을’의 준수사항</span>
          </h2>
          <p className="text-justify leading-relaxed">
            ‘을’은 ‘갑’이 제공하는 통일된 매뉴얼과 품질 기준을 준수하며 정품 원부자재 사용, 영업시간 준수, 위생관리 철저, 브랜드 품위 유지에 최선을 다하여야 한다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제7조</span>
            <span>불공정거래행위의 금지</span>
          </h2>
          <p className="text-justify leading-relaxed">
            ‘갑’은 「가맹사업거래의 공정화에 관한 법률」을 철저히 준수하며 가맹사업자에 대한 부당한 강요나 불이익 제공, 보복 조치 등의 행위를 일체 하지 아니한다.
          </p>
        </section>

        {/* 제8조 : 가맹점의 표시 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제8조</span>
            <span>가맹점의 표시</span>
          </h2>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>‘을’의 가맹점 명칭은</span>
            {isEditable ? (
              <input
                type="text"
                required
                placeholder="가맹점명 (예: 120겹파이 역삼역점)"
                value={contract.storeName}
                onChange={(e) => handleFieldChange("storeName", e.target.value)}
                className="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-black text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-amber-500 w-56 inline-block"
              />
            ) : (
              <strong className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded">{contract.storeName || "가맹점명"}</strong>
            )}
            <span>(으)로 하며, ‘갑’의 사전 서면 승인 없이 임의로 변경할 수 없다.</span>
          </div>
        </section>

        {/* 제9조 ~ 제10조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제9조</span>
            <span>가맹점운영권의 부여</span>
          </h2>
          <p className="text-justify leading-relaxed">
            ‘갑’은 본 계약 기간 동안 약정된 영업지역 내에서 ‘120겹파이’ 상표 및 경영 노하우를 사용하여 가맹점을 운영할 수 있는 권리를 ‘을’에게 부여한다.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제10조</span>
            <span>지식재산권의 확보</span>
          </h2>
          <p className="text-justify leading-relaxed">
            ‘갑’은 가맹사업에 사용하는 ‘120겹파이’ 상표 및 지식재산권에 대한 배타적 권리를 보유하며(별첨[2] 참조), ‘을’은 허가된 범위 내에서만 이를 사용할 수 있다.
          </p>
        </section>

        {/* 제11조 : 계약기간 */}
        <section className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200/70">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제11조</span>
            <span>계약의 발효일과 계약기간</span>
          </h2>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-2">
            <span>① 이 계약은</span>
            {isEditable ? (
              <div className="inline-flex items-center gap-1.5">
                <input
                  type="date"
                  required
                  value={contract.contractStart}
                  onChange={(e) => {
                    const startVal = e.target.value;
                    handleFieldChange("contractStart", startVal);
                    if (startVal) {
                      const d = new Date(startVal);
                      d.setFullYear(d.getFullYear() + 2);
                      const endStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                      handleFieldChange("contractEnd", endStr);
                    }
                  }}
                  className="px-2.5 py-1 bg-white border border-amber-300 rounded text-xs font-bold text-[#0F172A] focus:outline-none"
                />
                <span>부터 발효되며 그 기간은 계약 발효일로부터</span>
                <input
                  type="date"
                  required
                  value={contract.contractEnd}
                  onChange={(e) => handleFieldChange("contractEnd", e.target.value)}
                  className="px-2.5 py-1 bg-white border border-amber-300 rounded text-xs font-bold text-[#0F172A] focus:outline-none"
                />
                <span>까지 <strong>2년간</strong>으로 한다.</span>
              </div>
            ) : (
              <>
                <strong className="text-amber-900 underline">{contract.contractStart || "YYYY-MM-DD"}</strong>
                <span>부터 발효되며 그 기간은 계약 발효일로부터</span>
                <strong className="text-amber-900 underline">{contract.contractEnd || "YYYY-MM-DD"}</strong>
                <span>까지 <strong>2년간</strong>으로 한다.</span>
              </>
            )}
          </div>
          <p className="text-justify text-xs text-slate-600">
            ② ‘을’은 가맹계약 체결 후 3개월 안에 가맹점을 오픈하여야 한다.
          </p>
        </section>

        {/* 제12조 : 점포 선정 및 규모 */}
        <section className="space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제12조</span>
            <span>가맹점의 장소 선정 및 규모</span>
          </h2>
          {isEditable ? (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600">가맹점 소재지(주소) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={roadAddress}
                    onChange={(e) => onChangeRoadAddress && onChangeRoadAddress(e.target.value)}
                    placeholder="주소 검색 버튼을 누르거나 도로명 주소를 입력하세요"
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-[#0F172A] focus:outline-none focus:border-amber-500"
                  />
                  {onOpenAddressSearch && (
                    <button
                      type="button"
                      onClick={onOpenAddressSearch}
                      className="px-4 py-2 bg-[#FED422] text-[#0F172A] text-xs font-black rounded-lg transition-all cursor-pointer border-0 flex items-center gap-1 shrink-0"
                    >
                      <Search size={14} />
                      주소 검색
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={detailAddress}
                  onChange={(e) => onChangeDetailAddress && onChangeDetailAddress(e.target.value)}
                  placeholder="상세 주소 (예: 1층 102호)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-[#0F172A] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-600">매장 규모 :</label>
                <div className="relative w-36">
                  <input
                    type="number"
                    required
                    value={contract.storeSize || ""}
                    onChange={(e) => handleFieldChange("storeSize", parseFloat(e.target.value) || 0)}
                    placeholder="33"
                    className="w-full px-3 py-1.5 pr-8 bg-white border border-slate-300 rounded-lg text-xs font-black text-[#0F172A] focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-500 pointer-events-none">㎡</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-justify leading-relaxed">
              ‘을’의 가맹점 소재지는 <strong className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">{contract.storeAddress || "가맹점 주소"}</strong>에 위치하며, 매장 규모는 <strong className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded">{contract.storeSize} ㎡</strong>로 확정한다.
            </p>
          )}
        </section>

        {/* 제13조 : 영업지역의 보호 */}
        <section className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200/70">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제13조</span>
            <span>영업지역의 보호</span>
          </h2>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>① ‘을’의 영업지역은</span>
            {isEditable ? (
              <input
                type="text"
                required
                placeholder="영업지역 (예: 가맹점 반경 500m 내)"
                value={contract.businessArea}
                onChange={(e) => handleFieldChange("businessArea", e.target.value)}
                className="px-2.5 py-1 bg-white border border-amber-300 rounded text-xs font-black text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-amber-500 w-64 inline-block"
              />
            ) : (
              <strong className="text-amber-900 underline">{contract.businessArea || "가맹점 반경 500m 내"}</strong>
            )}
            <span>(별첨[1] 참조)로 정하며, ‘갑’은 계약기간 중 ‘을’의 영업지역 내에 동일한 업종의 직영점이나 타 가맹점을 개설하지 아니한다.</span>
          </div>
          <p className="text-justify text-xs text-slate-600">
            ② ‘갑’은 계약기간 중 또는 갱신 과정에서 상권의 급격한 변동 등 정당한 사유 없이 ‘을’의 영업지역을 축소할 수 없다.
          </p>
        </section>

        {/* 제14조 : 점포의 설비 및 감리비 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제14조</span>
            <span>점포의 설비 및 공사감리</span>
          </h2>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>① 점포설비(인테리어)는 가맹사업의 통일성을 위해 ‘갑’이 정한 사양에 따라 시공하며, 공사의 감리를 진행하는 경우 ‘을’은 공사감리비</span>
            {isEditable ? (
              <input
                type="number"
                value={contract.supervisionFee || 0}
                onChange={(e) => handleFieldChange("supervisionFee", Number(e.target.value) || 0)}
                className="w-32 px-2 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-black text-right text-[#0F172A]"
              />
            ) : (
              <strong>{formatMoney(contract.supervisionFee)}</strong>
            )}
            <span>원(부가가치세 포함)을 ‘갑’에게 지급한다.</span>
          </div>
        </section>

        {/* 제15조 ~ 제18조 : 가맹금 및 정기 납입금 */}
        <section className="space-y-3 bg-[#F8FAFC] p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
              <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제15조</span>
              <span>최초가맹금 및 예치가맹금</span>
            </h2>
            {isEditable && onApplyFeeDefaults && (
              <button
                type="button"
                onClick={onApplyFeeDefaults}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer border-0 shadow-2xs"
              >
                <Sparkles size={13} />
                표준 가맹금 기본값 일괄적용
              </button>
            )}
          </div>

          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>① ‘을’이 ‘갑’에 지급하여야 할 최초가맹금은 일금</span>
            {isEditable ? (
              <input
                type="number"
                value={contract.initialFranchiseFee || 0}
                onChange={(e) => handleFieldChange("initialFranchiseFee", Number(e.target.value) || 0)}
                className="w-32 px-2 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-black text-right text-[#0F172A]"
              />
            ) : (
              <strong>{formatMoney(contract.initialFranchiseFee)}</strong>
            )}
            <span>원(부가가치세 포함)으로 한다.</span>
          </div>

          <p className="text-justify leading-relaxed text-xs text-slate-700">
            ② ‘을’은 계약체결일에 최초가맹금과 계약이행보증금을 ‘갑’이 지정하는 아래 금융회사에 예치하여야 한다.
          </p>

          <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
            <p className="font-extrabold text-slate-800">
              * 예치금융회사 : <span className="text-blue-700">{HEADQUARTERS_INFO.depositBank}</span> | 계좌번호 : <span className="text-blue-700">{HEADQUARTERS_INFO.depositAccount}</span> | 예금주 : {HEADQUARTERS_INFO.depositAccountHolder}
            </p>
            <div className="overflow-hidden rounded border border-slate-200 mt-2">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2 border-b border-r border-slate-200">예치가맹금 내역</th>
                    <th className="p-2 border-b border-slate-200 text-right w-44">금액 (원)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 border-r border-slate-200 text-slate-600">가입비</td>
                    <td className="p-2 text-right font-medium">
                      {isEditable ? (
                        <input
                          type="number"
                          value={contract.depositMembershipFee || 0}
                          onChange={(e) => handleFieldChange("depositMembershipFee", Number(e.target.value) || 0)}
                          className="w-32 px-2 py-0.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-right text-[#0F172A]"
                        />
                      ) : (
                        formatMoney(contract.depositMembershipFee)
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 border-r border-slate-200 text-slate-600">오픈교육비</td>
                    <td className="p-2 text-right font-medium">
                      {isEditable ? (
                        <input
                          type="number"
                          value={contract.depositEduFee || 0}
                          onChange={(e) => handleFieldChange("depositEduFee", Number(e.target.value) || 0)}
                          className="w-32 px-2 py-0.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-right text-[#0F172A]"
                        />
                      ) : (
                        formatMoney(contract.depositEduFee)
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 border-r border-slate-200 text-slate-600">오픈지원비</td>
                    <td className="p-2 text-right font-medium">
                      {isEditable ? (
                        <input
                          type="number"
                          value={contract.depositSupportFee || 0}
                          onChange={(e) => handleFieldChange("depositSupportFee", Number(e.target.value) || 0)}
                          className="w-32 px-2 py-0.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-right text-[#0F172A]"
                        />
                      ) : (
                        formatMoney(contract.depositSupportFee)
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-2 border-r border-slate-200 text-slate-600">계약이행보증금</td>
                    <td className="p-2 text-right font-medium">
                      {isEditable ? (
                        <input
                          type="number"
                          value={contract.depositGuaranteeFee || 0}
                          onChange={(e) => handleFieldChange("depositGuaranteeFee", Number(e.target.value) || 0)}
                          className="w-32 px-2 py-0.5 bg-slate-50 border border-slate-300 rounded text-xs font-bold text-right text-[#0F172A]"
                        />
                      ) : (
                        formatMoney(contract.depositGuaranteeFee)
                      )}
                    </td>
                  </tr>
                  <tr className="bg-amber-50 font-black text-slate-900">
                    <td className="p-2 border-r border-slate-200">합계</td>
                    <td className="p-2 text-right text-amber-900 font-black">
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
          </div>
        </section>

        {/* 제16조 : 가맹금의 반환 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제16조</span>
            <span>가맹금의 반환</span>
          </h2>
          <p className="text-justify leading-relaxed">
            정보공개서 미제공 등 법정 사유에 해당하는 경우 ‘을’은 가맹계약 체결일로부터 4개월 이내에 서면으로 가맹금 반환을 청구할 수 있으며, 관련 법률령 및 당사자 약정에 따라 정산 반환한다.
          </p>
        </section>

        {/* 제17조 : 로열티 */}
        <section className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200/70">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제17조</span>
            <span>계속가맹금 (로열티)</span>
          </h2>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>① ‘을’은 상호, 상표의 사용 및 경영지원에 대한 대가로 로열티 월</span>
            {isEditable ? (
              <input
                type="number"
                value={contract.royaltyFee || 0}
                onChange={(e) => handleFieldChange("royaltyFee", Number(e.target.value) || 0)}
                className="w-28 px-2 py-1 bg-white border border-amber-300 rounded text-xs font-black text-right text-[#0F172A]"
              />
            ) : (
              <strong>{formatMoney(contract.royaltyFee)}</strong>
            )}
            <span>원(부가가치세 포함)을 매월 1일에 ‘갑’에게 지급한다.</span>
          </div>
          <p className="text-justify text-xs text-slate-600">
            ② ‘을’은 가맹점 영업개시 후 10일 이내에 ‘갑’의 계좌({HEADQUARTERS_INFO.royaltyBank} {HEADQUARTERS_INFO.royaltyAccount}, 예금주: {HEADQUARTERS_INFO.royaltyAccountHolder})로 자동이체를 신청하여야 한다.
          </p>
        </section>

        {/* 제18조 : 계약이행보증금 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제18조</span>
            <span>계약이행보증금</span>
          </h2>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>‘을’은 채무액 또는 손해배상액의 지급을 담보하기 위하여 계약이행보증금으로</span>
            {isEditable ? (
              <input
                type="number"
                value={contract.guaranteeFee || 0}
                onChange={(e) => handleFieldChange("guaranteeFee", Number(e.target.value) || 0)}
                className="w-28 px-2 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-black text-right text-[#0F172A]"
              />
            ) : (
              <strong>{formatMoney(contract.guaranteeFee)}</strong>
            )}
            <span>원(부가가치세 없음)을 ‘갑’에게 지급하며, 계약 정상 종료 시 잔여 채무를 정산한 후 30일 이내에 환급한다.</span>
          </div>
        </section>

        {/* 제19조 : 교육 및 훈련 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제19조</span>
            <span>교육 및 훈련</span>
          </h2>
          <p className="text-justify leading-relaxed">
            ‘갑’의 교육훈련은 다음 표와 같이 구분하여 실시하며 성실히 이수하여야 한다.
          </p>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-2 border-b border-r border-slate-200">교육훈련과정</th>
                  <th className="p-2 border-b border-r border-slate-200">실시시기</th>
                  <th className="p-2 border-b border-slate-200">‘을’ 부담비용 (원, vat포함)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-2 border-r border-slate-200 font-bold">오픈교육</td>
                  <td className="p-2 border-r border-slate-200 text-slate-600">오픈 전</td>
                  <td className="p-2 font-medium">{formatMoney(contract.eduOpenFee || 2200000)} (최초가맹금에 포함)</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="p-2 border-r border-slate-200 font-bold">신입교육</td>
                  <td className="p-2 border-r border-slate-200 text-slate-600">신입직원 채용 시</td>
                  <td className="p-2 font-medium">{formatMoney(contract.eduNewFee || 220000)} (1인 기준)</td>
                </tr>
                <tr>
                  <td className="p-2 border-r border-slate-200 font-bold">특별교육</td>
                  <td className="p-2 border-r border-slate-200 text-slate-600">가맹점사업자 요청 시</td>
                  <td className="p-2 text-slate-500">별도 협의</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 제20조 ~ 제28조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제20조 ~ 제28조</span>
            <span>계약 수정, 경영지도 및 광고·판촉</span>
          </h2>
          <p className="text-justify leading-relaxed text-slate-700">
            당사자는 상호 동의 하에 계약 조건을 변경할 수 있으며, ‘갑’은 정기적인 슈퍼바이징과 조리·위생 지도를 지원한다. 광고 및 판촉 행사는 가맹사업법 제12조의6에 따라 가맹점사업자들의 사전 동의(광고 50%, 판촉 70% 이상)를 얻어 투명하게 집행한다.
          </p>
        </section>

        {/* 제29조 : 초도상품 및 초도물품 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제29조</span>
            <span>초도상품 및 초도물품</span>
          </h2>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>‘을’은 원활한 개점을 위하여 ‘갑’으로부터 공급받는 초도물품 비용으로</span>
            {isEditable ? (
              <input
                type="number"
                value={contract.initialSupplyFee || 0}
                onChange={(e) => handleFieldChange("initialSupplyFee", Number(e.target.value) || 0)}
                className="w-32 px-2 py-1 bg-amber-50 border border-amber-300 rounded text-xs font-black text-right text-[#0F172A]"
              />
            ) : (
              <strong>{formatMoney(contract.initialSupplyFee)}</strong>
            )}
            <span>원(부가가치세 포함)을 지급하고 오픈 준비에 만전을 기한다.</span>
          </div>
        </section>

        {/* 제30조 ~ 제38조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제30조 ~ 제38조</span>
            <span>원·부재료 조달, 운영준수 및 보험</span>
          </h2>
          <p className="text-justify leading-relaxed text-slate-700">
            ‘을’은 파이의 고유한 맛과 품질 유지를 위해 별첨[3]의 구입강제품목을 정품으로 수급하여 조리하여야 하며, 영업배상책임보험 및 화재보험 가입을 유지하여야 한다.
          </p>
        </section>

        {/* 제39조 ~ 제41조 */}
        <section className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200/70">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제39조 ~ 제41조</span>
            <span>계약의 갱신, 해지 및 위약금</span>
          </h2>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5">
            <span>① 계약 만료 180일 전부터 90일 전까지 서면 통지가 없는 경우 종전 조건으로 2년간 자동 갱신되며, 재가맹 시 재가맹비는</span>
            {isEditable ? (
              <input
                type="number"
                value={contract.reFranchiseFee || 0}
                onChange={(e) => handleFieldChange("reFranchiseFee", Number(e.target.value) || 0)}
                className="w-28 px-2 py-1 bg-white border border-amber-300 rounded text-xs font-black text-right text-[#0F172A]"
              />
            ) : (
              <strong>{formatMoney(contract.reFranchiseFee)}</strong>
            )}
            <span>원(부가가치세 포함)으로 한다.</span>
          </div>
          <div className="text-justify leading-relaxed flex flex-wrap items-center gap-1.5 mt-1">
            <span>② ‘을’의 중대한 귀책사유로 인하여 계약이 중도 해지되는 경우 ‘을’은 위약금</span>
            {isEditable ? (
              <input
                type="number"
                value={contract.penaltyFee || 0}
                onChange={(e) => handleFieldChange("penaltyFee", Number(e.target.value) || 0)}
                className="w-28 px-2 py-1 bg-white border border-amber-300 rounded text-xs font-black text-right text-[#0F172A]"
              />
            ) : (
              <strong>{formatMoney(contract.penaltyFee)}</strong>
            )}
            <span>원을 ‘갑’에게 지급하여야 하며, 이는 손해배상액의 예정으로서의 성격을 갖는다.</span>
          </div>
        </section>

        {/* 제42조 ~ 제46조 */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제42조 ~ 제46조</span>
            <span>비밀유지, 지연이자 및 분쟁해결</span>
          </h2>
          <p className="text-justify leading-relaxed text-slate-700">
            ‘을’은 계약 중 및 종료 후에도 120겹파이 조리법 등 영업비밀을 제3자에게 누설하거나 동종 영업을 영위하지 아니한다. 금전지급 지체 시 연 20%의 지연이자가 가산되며, 분쟁 발생 시 한국공정거래조정원 또는 상호 합의된 관할법원을 통해 해결한다.
          </p>
        </section>

        {/* 제47조 */}
        <section className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h2 className="text-sm font-black text-[#0F172A] flex items-center gap-2">
            <span className="px-2 py-0.5 bg-slate-800 text-white rounded-md text-[11px]">제47조</span>
            <span>정보공개서 및 가맹계약서의 수령일 확인</span>
          </h2>
          <p className="text-justify leading-relaxed">
            ‘을’은 가맹금의 일부를 지급하거나 이 계약을 체결하는 날로부터 <strong>14일 이상 이전</strong>에 ‘갑’으로부터 관련 정보공개서 및 가맹계약서를 제공받고 충분한 숙고기간을 거쳤음을 최종 확인한다.
          </p>
        </section>

        {/* ==================== SIGNATURE SECTION ==================== */}
        <div className="pt-8 border-t-2 border-slate-800 space-y-6 print:break-before-page">
          <p className="text-center text-xs font-bold text-slate-700">
            ‘갑’과 ‘을’은 이 가맹계약서에 열거된 각 조항을 면밀히 검토하고 충분히 이해하였으며, 이 계약의 체결을 증명하기 위하여 전자계약을 체결하고 각각 1통씩 보관한다.
          </p>

          <div className="text-center font-black text-sm text-[#0F172A] tracking-widest my-4">
            {contract.signedAt ? (
              <span>서명 체결일 : {contract.signedAt}</span>
            ) : (
              <span>{createdY}년 {createdM}월 {createdD}일</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* 가맹본부 (갑) */}
            <div className="relative p-5 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="font-black text-[#0F172A] text-sm">[가맹본부 (갑)]</span>
                <span className="text-[10px] text-slate-500 font-bold">법인인감 날인</span>
              </div>
              <div className="space-y-1 text-slate-700">
                <p><span className="font-bold text-slate-500 w-20 inline-block">상 호 :</span> {HEADQUARTERS_INFO.companyName}</p>
                <p><span className="font-bold text-slate-500 w-20 inline-block">대표자 :</span> {HEADQUARTERS_INFO.ceoName}</p>
                <p><span className="font-bold text-slate-500 w-20 inline-block">사업자번호 :</span> {HEADQUARTERS_INFO.bizNumber}</p>
                <p><span className="font-bold text-slate-500 w-20 inline-block">주 소 :</span> {HEADQUARTERS_INFO.address}</p>
                <p><span className="font-bold text-slate-500 w-20 inline-block">연락처 :</span> {HEADQUARTERS_INFO.phone}</p>
              </div>

              {/* Official Seal Stamp Floating on CEO name */}
              <div className="absolute right-4 bottom-4">
                <OfficialSealStamp size={88} />
              </div>
            </div>

            {/* 가맹사업자 (을) */}
            <div className="relative p-5 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="font-black text-[#0F172A] text-sm">[가맹점사업자 (을)]</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${contract.signatureImage ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {contract.signatureImage ? "전자서명 완료" : "서명 대기"}
                </span>
              </div>
              <div className="space-y-1 text-slate-700">
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">성 명 :</span>
                  {isEditable ? (
                    <input
                      type="text"
                      required
                      placeholder="성명 (홍길동)"
                      value={contract.ownerName}
                      onChange={(e) => handleFieldChange("ownerName", e.target.value)}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-black text-[#0F172A] w-36"
                    />
                  ) : (
                    <strong className="text-[#0F172A]">{contract.ownerName || "-"}</strong>
                  )}
                </p>
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">생년월일 :</span>
                  {isEditable ? (
                    <input
                      type="text"
                      required
                      placeholder="1981-11-15"
                      value={contract.ownerBirth}
                      onChange={(e) => handleFieldChange("ownerBirth", formatContractBirth(e.target.value))}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold text-[#0F172A] w-36"
                    />
                  ) : (
                    <span>{contract.ownerBirth || "-"}</span>
                  )}
                </p>
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">가맹점명 :</span>
                  {isEditable ? (
                    <input
                      type="text"
                      required
                      placeholder="120겹파이 역삼역점"
                      value={contract.storeName}
                      onChange={(e) => handleFieldChange("storeName", e.target.value)}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold text-[#0F172A] w-48"
                    />
                  ) : (
                    <span>{contract.storeName || "-"}</span>
                  )}
                </p>
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">주 소 :</span>
                  <span>{contract.storeAddress || (isEditable ? `${roadAddress} ${detailAddress}`.trim() || "-" : "-")}</span>
                </p>
                <p>
                  <span className="font-bold text-slate-500 w-20 inline-block">연락처 :</span>
                  {isEditable ? (
                    <input
                      type="text"
                      required
                      placeholder="010-4322-3813"
                      value={contract.ownerPhone}
                      onChange={(e) => handleFieldChange("ownerPhone", formatContractPhone(e.target.value))}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold text-[#0F172A] w-36"
                    />
                  ) : (
                    <span>{contract.ownerPhone || "-"}</span>
                  )}
                </p>
              </div>

              {/* Customer Signature Display */}
              {contract.signatureImage ? (
                <div className="absolute right-4 bottom-4 flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={contract.signatureImage}
                    alt="가맹사업자 전자서명"
                    className="w-24 h-14 object-contain filter drop-shadow-xs"
                  />
                  <span className="text-[9px] text-emerald-700 font-bold mt-0.5">전자서명 날인</span>
                </div>
              ) : (
                <div className="absolute right-4 bottom-4 w-24 h-14 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-bold bg-white/60">
                  (인 / 서명)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== APPENDIX 1 : 영업지역의 표시 ==================== */}
        <div className="pt-10 border-t border-slate-200 space-y-4 print:break-before-page">
          <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-lg">
            <h3 className="font-black text-sm text-[#0F172A]">별첨 [1] : 영업지역의 표시</h3>
            <span className="text-xs font-bold text-slate-500">제13조 관련</span>
          </div>
          <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs text-slate-700">
              가맹본부(‘갑’)와 가맹점사업자(‘을’)가 상호 합의하여 확정한 가맹점의 배타적 영업보호지역은 다음과 같습니다.
            </p>
            <div className="p-3.5 bg-white border border-amber-200 rounded-lg">
              <span className="block text-[11px] font-bold text-slate-400 mb-1">약정 영업지역</span>
              <span className="text-sm font-black text-[#0F172A]">{contract.businessArea || "가맹점 반경 500m 내"}</span>
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
              <table className="w-full text-xs text-left border-collapse">
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
        <div className="pt-8 border-t border-slate-200 space-y-4 print:break-before-page">
          <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-lg">
            <h3 className="font-black text-sm text-[#0F172A]">별첨 [3] : 구입강제품목 공급가격 및 공급가격 결정기준</h3>
            <span className="text-xs font-bold text-slate-500">제25조 관련</span>
          </div>
          
          <div className="p-4 bg-[#F8FAFC] border border-slate-200 rounded-xl space-y-3">
            <p className="text-xs text-slate-700">
              본 서식[별첨3]은 가맹사업거래의 공정화에 관한 법률에 의거하여 가맹계약서의 내용에 포함되며 ‘을’은 ‘갑’으로부터 본 서식[별첨3]을 제공받았음을 확인합니다.
            </p>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 font-bold text-slate-700 text-[11px]">
                  <tr>
                    <th className="p-2 border-b border-r border-slate-200 text-center w-14">공급방식</th>
                    <th className="p-2 border-b border-r border-slate-200 text-center w-10">순번</th>
                    <th className="p-2 border-b border-r border-slate-200">품목명</th>
                    <th className="p-2 border-b border-r border-slate-200 text-center w-16">규격/단위</th>
                    <th className="p-2 border-b border-r border-slate-200 text-right w-24">공급가격 (원)</th>
                    <th className="p-2 border-b border-slate-200">공급가격 결정기준</th>
                  </tr>
                </thead>
                <tbody>
                  {OFFICIAL_SUPPLIES_LIST.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-1.5 border-r border-slate-200 text-center text-[10px] font-bold text-slate-500">{item.supplyType}</td>
                      <td className="p-1.5 border-r border-slate-200 text-center text-slate-400">{item.id}</td>
                      <td className="p-1.5 border-r border-slate-200 font-extrabold text-[#0F172A]">{item.name}</td>
                      <td className="p-1.5 border-r border-slate-200 text-center text-slate-600">{item.unit}</td>
                      <td className="p-1.5 border-r border-slate-200 text-right font-bold text-slate-800">{formatMoney(item.price)}</td>
                      <td className="p-1.5 text-slate-500 text-[11px]">{item.calculationBasis}</td>
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
