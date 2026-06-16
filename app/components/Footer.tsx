"use client";

import React from "react";
import Link from "next/link";

interface FooterProps {
  theme: "yellow" | "black" | "pink";
}

export default function Footer({ theme }: FooterProps) {
  const isPinkVariant = theme === "pink";
  const isYellowVariant = theme === "yellow";

  return (
    <footer className={`border-t transition-all duration-300 ${
      isPinkVariant 
        ? "bg-[#fff1f4] border-rose-100 text-[#7c5d6c]" 
        : isYellowVariant 
          ? "bg-[#fff9e6] border-[#e6dfc3] text-[#576575]" 
          : "bg-[#090909] border-neutral-900 text-neutral-400"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b ${
          isPinkVariant ? "border-rose-200/50" : isYellowVariant ? "border-[#e6dfc3]" : "border-neutral-800/80"
        }`}>
          <div className="lg:col-span-7">
            <div className="mb-7">
              <img
                src="https://res.cloudinary.com/dfarfqx7e/image/upload/v1781183166/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_cnfrik.png"
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
              <p>경기 군포시 엘에스로 143 1층 1001호</p>
              <p>E-mail: 120piecoffee@gmail.com | Tel: 1566-3594</p>
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
                href="tel:1566-3594"
                className={`text-3xl sm:text-4xl font-black tracking-tight transition-colors block mb-3 ${
                  isPinkVariant ? "text-[#4c2d3a] hover:text-rose-500" : isYellowVariant ? "text-[#0d233a] hover:text-amber-600" : "text-white hover:text-amber-400"
                }`}
              >
                1566-3594
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

            <div className={`flex gap-6 text-sm font-bold ${
              isPinkVariant ? "text-[#7c5d6c] hover:text-[#4c2d3a]" : isYellowVariant ? "text-[#576575] hover:text-[#0d233a]" : "text-neutral-400 hover:text-white"
            }`}>
              <span className="transition-colors cursor-pointer">이용약관</span>
              <span className="transition-colors cursor-pointer">개인정보처리방침</span>
            </div>
          </div>
        </div>
        <div className={`pt-6 text-xs font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
          isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
        }`}>
          <p>Copyright(c)2026 GOWELL-LIFE Co.,Ltd. All Right Reserved.</p>
          <div className="flex items-center gap-3">
            <Link
              href="/portal"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline transition-colors text-[11px] ${
                isPinkVariant ? "text-[#7c5d6c] hover:text-[#4c2d3a]" : isYellowVariant ? "text-[#576575] hover:text-[#0d233a]" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              점주포털
            </Link>
            <span className={isPinkVariant ? "text-rose-200/50" : isYellowVariant ? "text-[#e6dfc3]" : "text-neutral-800"}>|</span>
            <Link
              href="/admin"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:underline transition-colors text-[11px] ${
                isPinkVariant ? "text-[#7c5d6c] hover:text-[#4c2d3a]" : isYellowVariant ? "text-[#576575] hover:text-[#0d233a]" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              본사 어드민
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
