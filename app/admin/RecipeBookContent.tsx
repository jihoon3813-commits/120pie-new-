"use client";

import React, { useState, useRef } from "react";
import { RECIPE_DATA, RecipeCategory, RecipeItem } from "../constants/recipes";
import { 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  BookOpen, 
  ArrowLeft,
  Info,
  CheckCircle,
  FileText,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecipeBookContent() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"book" | "scroll">("book");
  const bookContainerRef = useRef<HTMLDivElement>(null);

  // 16페이지로 분할 구성된 레시피북 구조 정의
  const totalPages = 16;

  // 인쇄 처리 함수
  const handlePrint = () => {
    window.print();
  };

  // 다음/이전 페이지 핸들러
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // 목차 클릭 시 특정 페이지로 이동
  const jumpToPage = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  // 전체 레시피 검색 기능
  const searchRecipes = (): { page: number; recipe: RecipeItem; categoryName: string }[] => {
    if (!searchQuery.trim()) return [];
    
    const results: { page: number; recipe: RecipeItem; categoryName: string }[] = [];
    
    // 단순 무식 매핑 (각 레시피가 위치한 대략적인 페이지 지정)
    // 3페이지: HOT 음료 Coffee/Non-Coffee, 4페이지: HOT Milk Tea/Tea
    // 5페이지: ICE 22oz Coffee/Cold Brew, 6페이지: ICE 22oz Non-Coffee/Milk Tea, 7페이지: ICE 22oz Tea
    // 8페이지: ICE 22oz Ade/Smoothie, 9페이지: ICE 22oz Yogurt Smoothie/Frappe
    // 10페이지: ICE 32oz Coffee/Cold Brew, 11페이지: ICE 32oz Non-Coffee/Milk Tea, 12페이지: ICE 32oz Tea
    // 13페이지: 디저트 Waffle/Croffle, 14페이지: 디저트 120겹파이 1, 15페이지: 디저트 120겹파이 2 & 에그120
    
    RECIPE_DATA.forEach(cat => {
      cat.subCategories.forEach(sub => {
        sub.recipes.forEach(rec => {
          if (rec.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            let targetPage = 3;
            const subName = sub.name;
            const catName = cat.name;

            if (catName.includes("HOT")) {
              if (subName.includes("MILK TEA") || subName.includes("TEA")) targetPage = 3; // 4th page (0-indexed: 3)
              else targetPage = 2; // 3rd page (0-indexed: 2)
            } else if (catName.includes("ICE") && subName.includes("22oz")) {
              if (subName.includes("COFFEE") || subName.includes("COLD BREW")) targetPage = 4;
              else if (subName.includes("NON") || subName.includes("MILK")) targetPage = 5;
              else if (subName.includes("TEA")) targetPage = 6;
              else if (subName.includes("ADE") || subName.includes("SMOOTHIE")) targetPage = 7;
              else targetPage = 8;
            } else if (catName.includes("ICE") && subName.includes("32oz")) {
              if (subName.includes("COFFEE") || subName.includes("COLD BREW")) targetPage = 9;
              else if (subName.includes("NON") || subName.includes("MILK")) targetPage = 10;
              else targetPage = 11;
            } else if (catName.includes("디저트 기본")) {
              targetPage = 12;
            } else if (catName.includes("디저트")) {
              if (Number(rec.no) >= 7) targetPage = 14;
              else targetPage = 13;
            }

            results.push({
              page: targetPage,
              recipe: rec,
              categoryName: `${catName} > ${subName}`
            });
          }
        });
      });
    });

    return results;
  };

  const searchResults = searchRecipes();

  return (
    <div className="w-full flex flex-col min-h-0 bg-[#fffdfa] text-neutral-800 p-4 sm:p-6 lg:p-8 rounded-3xl border border-[#f2ccd7]/70 shadow-sm relative recipe-book-root">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP ACTIONS AND CONTROL BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#f2ccd7]/40 mb-6 print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2d2026] flex items-center gap-2">
            <Layers className="text-[#f25f8a]" size={24} />
            프랜차이즈 레시피북 매뉴얼
          </h2>
          <p className="text-xs text-[#735965] font-semibold mt-1">
            120겹파이 & coffee 가맹 본사 공식 음료 및 디저트 매뉴얼 (A4 규격 인쇄 대응)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-[#fff1f5] border border-[#f2ccd7] rounded-xl p-1 flex text-xs font-bold text-[#735965]">
            <button 
              onClick={() => setViewMode("book")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${viewMode === "book" ? "bg-[#f25f8a] text-white" : "hover:text-[#bf3e67]"}`}
            >
              책자형 보기
            </button>
            <button 
              onClick={() => setViewMode("scroll")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer border-0 ${viewMode === "scroll" ? "bg-[#f25f8a] text-white" : "hover:text-[#bf3e67]"}`}
            >
              전체 스크롤 보기
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 border-0 cursor-pointer shadow-sm"
          >
            <Printer size={14} />
            레시피북 인쇄 (A4)
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SEARCH AND NAVIGATION */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 print:hidden">
        {/* Search Panel */}
        <div className="lg:col-span-4 flex flex-col gap-2 relative">
          <label className="text-xs font-bold text-[#735965] ml-1">레시피 검색</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="음료 또는 디저트 이름 입력..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#f2ccd7] rounded-xl text-xs sm:text-sm text-neutral-800 focus:outline-none focus:border-[#f25f8a] placeholder-neutral-400 shadow-inner"
            />
          </div>

          {/* Real-time search results */}
          {searchQuery.trim() !== "" && (
            <div className="absolute top-[72px] left-0 right-0 bg-white border border-[#f2ccd7] rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto p-2">
              <span className="text-[10px] font-bold text-neutral-400 px-2 block mb-1">검색 결과 ({searchResults.length}건)</span>
              {searchResults.length === 0 ? (
                <p className="text-xs text-neutral-500 p-3 text-center">검색 결과가 없습니다.</p>
              ) : (
                searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      jumpToPage(res.page);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-[#fff1f5] rounded-lg transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-[#2d2026]">{res.recipe.name}</h5>
                      <span className="text-[9px] text-[#735965]/80 font-medium">{res.categoryName}</span>
                    </div>
                    <span className="text-[9px] bg-[#f25f8a] text-white px-2 py-0.5 rounded font-bold">p.{res.page + 1}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Quick jump Navigation (TOC Shortcut) */}
        <div className="lg:col-span-8 flex flex-col gap-2">
          <label className="text-xs font-bold text-[#735965] ml-1">빠른 카테고리 이동</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "📖 표지", page: 0 },
              { label: "목차/가이드", page: 1 },
              { label: "HOT 음료 (종이컵)", page: 2 },
              { label: "ICE 음료 (22oz)", page: 4 },
              { label: "ICE 음료 (32oz)", page: 9 },
              { label: "디저트 (와플/크로플)", page: 12 },
              { label: "디저트 (120겹파이)", page: 13 },
              { label: "디저트 (에그120)", page: 14 },
              { label: "📕 뒷표지", page: 15 }
            ].map((btn) => (
              <button
                key={btn.page}
                onClick={() => jumpToPage(btn.page)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  currentPage === btn.page
                    ? "bg-[#f25f8a] border-[#f25f8a] text-white font-extrabold shadow-sm"
                    : "bg-white border-[#f2ccd7] text-[#735965] hover:bg-[#fff1f5] hover:text-[#bf3e67]"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN RECIPE BOOK (PAGINATED SHEETS) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full relative">
        {viewMode === "book" ? (
          /* BOOK VIEW (WITH ANIMS) */
          <div className="w-full flex flex-col items-center">
            {/* Pages Spread container */}
            <div className="relative w-full max-w-[700px] aspect-[1/1.414] shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-neutral-200/80 rounded-2xl overflow-hidden bg-white select-text">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  <PageRenderer pageNum={currentPage} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-8 mt-6 print:hidden">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="p-3 bg-white border border-[#f2ccd7] text-[#735965] hover:text-[#bf3e67] hover:bg-[#fff1f5] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-neutral-400 rounded-full transition-all cursor-pointer border-0 shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="text-sm font-extrabold text-[#735965]">
                {currentPage + 1} / {totalPages} 페이지
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="p-3 bg-white border border-[#f2ccd7] text-[#735965] hover:text-[#bf3e67] hover:bg-[#fff1f5] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-neutral-400 rounded-full transition-all cursor-pointer border-0 shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          /* FULL SCROLL VIEW */
          <div ref={bookContainerRef} className="w-full flex flex-col items-center gap-12 max-h-[80vh] overflow-y-auto p-4 select-text">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div key={i} className="w-full max-w-[700px] aspect-[1/1.414] shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-neutral-200 rounded-2xl overflow-hidden bg-white shrink-0 relative">
                <div className="absolute top-4 right-4 bg-neutral-900/60 text-white px-2 py-1 rounded text-[10px] font-bold z-10">PAGE {i + 1}</div>
                <PageRenderer pageNum={i} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PRINT-SPECIFIC CSS STYLING OVERLAYS */}
      {/* ------------------------------------------------------------- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide sidebar, headers, and action buttons */
          body * {
            visibility: hidden;
          }
          /* Show only A4 sheets */
          .recipe-book-root, .recipe-book-root * {
            visibility: visible;
          }
          .recipe-book-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            border: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
          }
          .print\\:hidden, label, input, button, nav, aside, header, footer {
            display: none !important;
          }
          .print-page-break {
            page-break-after: always !important;
            break-after: page !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            border: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            display: block !important;
            background: white !important;
          }
        }
      `}} />
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE RENDER SWITCHER
// -----------------------------------------------------------------
function PageRenderer({ pageNum }: { pageNum: number }) {
  switch (pageNum) {
    case 0:
      return <CoverPage />;
    case 1:
      return <TableOfContentsAndGuides />;
    case 2:
      return <HotBeveragePage1 />; // HOT Coffee & Non-Coffee
    case 3:
      return <HotBeveragePage2 />; // HOT Milk Tea & Tea
    case 4:
      return <IceBeverage22ozPage1 />; // ICE Coffee (22oz)
    case 5:
      return <IceBeverage22ozPage2 />; // ICE Non-Coffee Latte & Milk Tea (22oz)
    case 6:
      return <IceBeverage22ozPage3 />; // ICE Tea (22oz)
    case 7:
      return <IceBeverage22ozPage4 />; // ICE Ade & Smoothie (22oz)
    case 8:
      return <IceBeverage22ozPage5 />; // ICE Yogurt Smoothie & Frappe (22oz)
    case 9:
      return <IceBeverage32ozPage1 />; // ICE Coffee & Cold Brew (32oz)
    case 10:
      return <IceBeverage32ozPage2 />; // ICE Non-Coffee Latte & Milk Tea (32oz)
    case 11:
      return <IceBeverage32ozPage3 />; // ICE Tea (32oz)
    case 12:
      return <WaffleAndCrofflePage />;
    case 13:
      return <PieRecipePage1 />; // 120겹파이 1
    case 14:
      return <PieRecipePage2AndEgg120Page />; // 120겹파이 2 & 에그120
    case 15:
      return <BackCoverPage />;
    default:
      return null;
  }
}

// -----------------------------------------------------------------
// PAGE 0: COVER PAGE (표지)
// -----------------------------------------------------------------
function CoverPage() {
  return (
    <div className="w-full h-full bg-[#1b191c] text-white flex flex-col justify-between p-12 relative overflow-hidden select-none print-page-break">
      {/* Decorative lines */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#f25f8a]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-52 h-52 bg-amber-400/10 rounded-full blur-3xl" />

      {/* Top logo sign */}
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-6 bg-[#f25f8a] rounded-sm" />
        <span className="text-[10px] tracking-[0.26em] uppercase font-black text-amber-400">120PIE &amp; COFFEE HQ MANUAL</span>
      </div>

      {/* Main Title Block */}
      <div className="my-auto space-y-7">
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">
            OFFICIAL<br />
            <span className="text-[#f25f8a]">RECIPE</span><br />
            MANUAL
          </h1>
          <div className="w-20 h-1 bg-amber-400 rounded-full mt-4" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white">120겹파이 공식 가맹레시피북</h2>
          <p className="text-xs text-neutral-400 font-semibold leading-relaxed max-w-sm">
            본 레시피북은 가맹점의 조리 표준화 및 원활한 물류 관리를 위해 본사에서 발행한 공식 매뉴얼입니다. 외부 유출을 엄격히 금지합니다.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-neutral-800 pt-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-neutral-500 font-extrabold uppercase block tracking-wider">PUBLISHED BY</span>
          <span className="text-xs font-black text-neutral-300 mt-1 block">120 가맹지원본부</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-neutral-500 font-extrabold uppercase block tracking-wider">VERSION / DATE</span>
          <span className="text-xs font-black text-amber-400 mt-1 block">V2.6.0 (2026.06.19)</span>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 1: TABLE OF CONTENTS & GUIDE (목차/가이드)
// -----------------------------------------------------------------
function TableOfContentsAndGuides() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">INDEX &amp; GUIDE</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 02</span>
        </div>

        {/* Index Grid */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-[#bf3e67] bg-[#fff1f5] px-3 py-1 rounded-lg w-fit">레시피북 목차</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-semibold">
            {[
              { num: "01", name: "HOT 음료 - 커피 & 논커피 라떼", page: "p.3" },
              { num: "02", name: "HOT 음료 - 밀크티 & 티", page: "p.4" },
              { num: "03", name: "ICE 음료 (22oz) - 커피 & 콜드브루", page: "p.5" },
              { num: "04", name: "ICE 음료 (22oz) - 논커피 라떼 & 밀크티", page: "p.6" },
              { num: "05", name: "ICE 음료 (22oz) - 티 카테고리", page: "p.7" },
              { num: "06", name: "ICE 음료 (22oz) - 에이드 & 스무디", page: "p.8" },
              { num: "07", name: "ICE 음료 (22oz) - 요거트 & 프라페", page: "p.9" },
              { num: "08", name: "ICE 음료 (32oz) - 대용량 커피 & 콜드브루", page: "p.10" },
              { num: "09", name: "ICE 음료 (32oz) - 대용량 논커피 & 밀크티", page: "p.11" },
              { num: "10", name: "ICE 음료 (32oz) - 대용량 티 카테고리", page: "p.12" },
              { num: "11", name: "디저트 - 와플 & 크로플 굽는법/레시피", page: "p.13" },
              { num: "12", name: "디저트 - 120겹파이 제조 매뉴얼 1", page: "p.14" },
              { num: "13", name: "디저트 - 120겹파이 제조 매뉴얼 2 & 에그빵", page: "p.15" }
            ].map(item => (
              <div key={item.num} className="flex justify-between border-b border-neutral-100 py-1.5">
                <span className="text-neutral-400 mr-2">{item.num}</span>
                <span className="text-neutral-700 flex-1 truncate">{item.name}</span>
                <span className="text-[#f25f8a] font-bold ml-2 shrink-0">{item.page}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Operating Guide */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black text-amber-600 bg-[#fffdf2] px-3 py-1 rounded-lg w-fit border border-amber-200/50">가맹점 조리 핵심 가이드라인</h4>
          <ul className="space-y-2 text-[10px] sm:text-xs text-neutral-600 font-semibold leading-relaxed list-disc pl-4">
            <li><strong>계량 준수</strong>: 모든 액상 소스, 파우더, 과일 시럽류는 펌프 및 온스 컵 계량을 준수하여 맛의 품질 균일도를 유지해 주세요.</li>
            <li><strong>스팀 온도 유지</strong>: HOT 음료 우유 스팀 시 60℃~65℃ 사이를 유지해야 고소한 맛 and 부드러운 폼이 형성됩니다. (70℃ 이상 가열 금지)</li>
            <li><strong>디저트 예열</strong>: 120겹파이 및 계란빵 와플기는 반드시 충분히 예열한 후 생지를 투입해야 결이 살고 바삭함이 연출됩니다.</li>
            <li><strong>위생 규칙</strong>: 모든 장비와 집기(피쳐, 믹싱컵 등)는 각 레시피 제조 후 즉시 세척 및 위생 건조해 주세요.</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-4 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE RENDER HELPER FOR RECIPES GRID TABLE
// -----------------------------------------------------------------
function RecipePageTableRenderer({ categoryIndex, subCategoryIndex, limit = 99, offset = 0 }: { categoryIndex: number; subCategoryIndex: number; limit?: number; offset?: number }) {
  const subCategory = RECIPE_DATA[categoryIndex]?.subCategories[subCategoryIndex];
  if (!subCategory) return <p className="text-xs text-neutral-400">데이터가 없습니다.</p>;

  const recipesToShow = subCategory.recipes.slice(offset, offset + limit);

  return (
    <div className="space-y-4">
      <div className="bg-[#fcf8fa] border border-[#f2ccd7]/60 rounded-xl px-4 py-2 flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-[#bf3e67]">{subCategory.name}</h4>
        <span className="text-[10px] font-bold text-neutral-400">Recipe list</span>
      </div>

      <div className="space-y-3.5">
        {recipesToShow.map((recipe, idx) => (
          <div key={idx} className="border border-neutral-100 rounded-xl overflow-hidden shadow-sm bg-white">
            {/* Header banner */}
            <div className="bg-[#1b191c] text-white px-3.5 py-1.5 flex justify-between items-center text-xs font-black">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-3 bg-amber-400 rounded-full" />
                {recipe.name}
              </span>
              <span className="text-[10px] text-amber-400">No.{recipe.no}</span>
            </div>

            {/* Steps & ingredients */}
            <div className="p-3">
              <table className="w-full text-left text-[10px] sm:text-xs">
                <thead>
                  <tr className="text-neutral-400 border-b border-neutral-100 font-bold">
                    <th className="pb-1 text-[10px]">재료 및 조리 순서</th>
                    <th className="pb-1 text-right text-[10px]" style={{ width: '80px' }}>기본 용량</th>
                    <th className="pb-1 text-right text-[10px]" style={{ width: '80px' }}>기타/비고</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-neutral-600">
                  {recipe.steps.map((step, stepIdx) => (
                    <tr key={stepIdx} className="border-b border-neutral-50/50 hover:bg-neutral-50/20">
                      <td className="py-1.5 text-neutral-700 leading-snug">{step.name}</td>
                      <td className="py-1.5 text-right font-black text-neutral-900">{step.capacity || "-"}</td>
                      <td className="py-1.5 text-right text-neutral-500 font-medium">
                        {step.etcName ? `${step.etcName} (${step.etcCapacity})` : (step.etcCapacity || "-")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Special Note */}
              {recipe.note && (
                <div className="mt-2.5 bg-neutral-50 border border-neutral-100 rounded-lg p-2 flex gap-2 items-start text-[10px] font-medium text-neutral-500 leading-relaxed">
                  <Info size={12} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="whitespace-pre-wrap flex-1">{recipe.note}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 2: HOT BEVERAGE 1
// -----------------------------------------------------------------
function HotBeveragePage1() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">HOT BEVERAGES</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 03</span>
        </div>

        {/* COFFEE 카테고리 (HOT) */}
        <RecipePageTableRenderer categoryIndex={0} subCategoryIndex={0} limit={3} />
        {/* NON . COFFEE LATTE 카테고리 (HOT) */}
        <RecipePageTableRenderer categoryIndex={0} subCategoryIndex={1} limit={2} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 3: HOT BEVERAGE 2
// -----------------------------------------------------------------
function HotBeveragePage2() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">HOT BEVERAGES</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 04</span>
        </div>

        {/* COFFEE 카테고리 (HOT) - 4~6번 */}
        <RecipePageTableRenderer categoryIndex={0} subCategoryIndex={0} offset={3} limit={3} />
        {/* MILK TEA / TEA 카테고리 (HOT) */}
        <RecipePageTableRenderer categoryIndex={0} subCategoryIndex={2} limit={1} />
        <RecipePageTableRenderer categoryIndex={0} subCategoryIndex={3} limit={1} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 4: ICE BEVERAGE 22oz 1
// -----------------------------------------------------------------
function IceBeverage22ozPage1() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">ICE BEVERAGES (22oz)</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 05</span>
        </div>

        {/* COFFEE 카테고리 (ICE 22oz) */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={0} limit={3} />
        {/* COLD BREW 카테고리 (ICE 22oz) */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={1} limit={2} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 5: ICE BEVERAGE 22oz 2
// -----------------------------------------------------------------
function IceBeverage22ozPage2() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">ICE BEVERAGES (22oz)</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 06</span>
        </div>

        {/* COFFEE 카테고리 (ICE 22oz) - 4~6번 */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={0} offset={3} limit={3} />
        {/* NON-COFFEE LATTE 카테고리 (ICE 22oz) */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={2} limit={2} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 6: ICE BEVERAGE 22oz 3
// -----------------------------------------------------------------
function IceBeverage22ozPage3() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">ICE BEVERAGES (22oz)</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 07</span>
        </div>

        {/* NON-COFFEE LATTE (ICE 22oz) - 3~5번 */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={2} offset={2} limit={3} />
        {/* MILK TEA 카테고리 (ICE 22oz) */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={3} limit={2} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 7: ICE BEVERAGE 22oz 4
// -----------------------------------------------------------------
function IceBeverage22ozPage4() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">ICE BEVERAGES (22oz)</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 08</span>
        </div>

        {/* TEA 카테고리 (ICE 22oz) */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={4} limit={3} />
        {/* ADE 카테고리 (ICE 22oz) */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={5} limit={2} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 8: ICE BEVERAGE 22oz 5
// -----------------------------------------------------------------
function IceBeverage22ozPage5() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">ICE BEVERAGES (22oz)</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 09</span>
        </div>

        {/* SMOOTHIE 카테고리 (ICE 22oz) */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={6} limit={2} />
        {/* YOGURT SMOOTHIE 카테고리 (ICE 22oz) */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={7} limit={2} />
        {/* FRAFFE 카테고리 (ICE 22oz) */}
        <RecipePageTableRenderer categoryIndex={1} subCategoryIndex={8} limit={1} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 9: ICE BEVERAGE 32oz 1
// -----------------------------------------------------------------
function IceBeverage32ozPage1() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">ICE BEVERAGES (32oz 대용량)</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 10</span>
        </div>

        {/* COFFEE 카테고리 (ICE 32oz) */}
        <RecipePageTableRenderer categoryIndex={2} subCategoryIndex={0} limit={3} />
        {/* COLD BREW 카테고리 (ICE 32oz) */}
        <RecipePageTableRenderer categoryIndex={2} subCategoryIndex={1} limit={2} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 10: ICE BEVERAGE 32oz 2
// -----------------------------------------------------------------
function IceBeverage32ozPage2() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">ICE BEVERAGES (32oz 대용량)</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 11</span>
        </div>

        {/* COFFEE 카테고리 (ICE 32oz) - 4~6번 */}
        <RecipePageTableRenderer categoryIndex={2} subCategoryIndex={0} offset={3} limit={3} />
        {/* NON-COFFEE LATTE 카테고리 (ICE 32oz) */}
        <RecipePageTableRenderer categoryIndex={2} subCategoryIndex={2} limit={2} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 11: ICE BEVERAGE 32oz 3
// -----------------------------------------------------------------
function IceBeverage32ozPage3() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">ICE BEVERAGES (32oz 대용량)</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 12</span>
        </div>

        {/* NON-COFFEE LATTE (ICE 32oz) - 3~5번 */}
        <RecipePageTableRenderer categoryIndex={2} subCategoryIndex={2} offset={2} limit={3} />
        {/* MILK TEA 카테고리 (ICE 32oz) */}
        <RecipePageTableRenderer categoryIndex={2} subCategoryIndex={3} limit={2} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 12: WAFFLE AND CROFFLE PAGE
// -----------------------------------------------------------------
function WaffleAndCrofflePage() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">DESSERTS - WAFFLE &amp; CROFFLE</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 13</span>
        </div>

        {/* WAFFLE 카테고리 */}
        <RecipePageTableRenderer categoryIndex={3} subCategoryIndex={0} limit={3} />
        {/* CROISSANT WAFFLE (크로플) 카테고리 */}
        <RecipePageTableRenderer categoryIndex={3} subCategoryIndex={1} limit={3} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 13: PIE RECIPE PAGE 1
// -----------------------------------------------------------------
function PieRecipePage1() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">DESSERTS - 120겹파이 1</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 14</span>
        </div>

        {/* 120겹파이 굽는 방법 & 레시피 */}
        <RecipePageTableRenderer categoryIndex={4} subCategoryIndex={0} limit={4} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 14: PIE RECIPE PAGE 2 & EGG120 PAGE
// -----------------------------------------------------------------
function PieRecipePage2AndEgg120Page() {
  return (
    <div className="w-full h-full bg-white p-8 sm:p-10 flex flex-col justify-between text-neutral-800 print-page-break">
      <div className="space-y-5">
        <div className="border-b-2 border-neutral-900 pb-3 flex items-end justify-between">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">DESSERTS - 120겹파이 2 &amp; 에그빵</h3>
          <span className="text-[10px] text-neutral-400 font-extrabold">PAGE 15</span>
        </div>

        {/* 120겹파이 5번~7번 (애플, 크림치즈, 커스터드) */}
        <RecipePageTableRenderer categoryIndex={4} subCategoryIndex={0} offset={4} limit={3} />
        {/* 에그120 카테고리 */}
        <RecipePageTableRenderer categoryIndex={5} subCategoryIndex={0} limit={2} />
      </div>
      <div className="border-t border-neutral-100 pt-3 text-center">
        <span className="text-[10px] text-neutral-400 font-bold">120PIE &amp; COFFEE FRANCHISE RECIPE SYSTEM</span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------
// PAGE 15: BACK COVER (뒷표지)
// -----------------------------------------------------------------
function BackCoverPage() {
  return (
    <div className="w-full h-full bg-[#1b191c] text-white flex flex-col justify-between p-12 relative overflow-hidden select-none print-page-break">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#f25f8a]/5 rounded-full blur-3xl" />

      {/* Top Header */}
      <div className="text-center">
        <span className="text-[10px] tracking-[0.26em] uppercase font-black text-[#f25f8a]">MEMO &amp; SECURITY NOTICE</span>
      </div>

      {/* Security Block */}
      <div className="my-auto text-center space-y-6 max-w-sm mx-auto">
        <div className="w-14 h-14 bg-neutral-800/80 border border-neutral-700/50 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
          <BookOpen size={24} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-white">가맹점 레시피 보안 안내</h3>
          <p className="text-[10px] sm:text-xs text-neutral-400 font-semibold leading-relaxed">
            본 문서에 수록된 레시피 및 가이드라인은 가맹점의 조리 매뉴얼 기밀사항에 해당합니다. 무단 복사, 배포, 유포 및 타 브랜드 모방 시 민형사상의 법적 책임을 물을 수 있습니다.
          </p>
        </div>
        <div className="border border-neutral-800 rounded-xl px-4 py-2.5 text-[10px] text-neutral-400 inline-block font-semibold">
          문의: 1566-3594 | 120piecoffee@gmail.com
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-neutral-800 pt-6 text-center space-y-2">
        <p className="text-xs font-black text-neutral-300">GOWELL-LIFE Co.,Ltd.</p>
        <p className="text-[9px] text-neutral-500 font-bold">Copyright © 2026 GOWELL-LIFE. All Rights Reserved.</p>
      </div>
    </div>
  );
}
