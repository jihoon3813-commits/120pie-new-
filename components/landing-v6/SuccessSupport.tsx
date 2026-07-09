"use client";

import { motion } from "framer-motion";
import { ShieldCheck, TrendingUp, Megaphone, Sparkles, MapPin } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

export default function SuccessSupport({
  onContactClick,
}: {
  onContactClick?: () => void;
}) {
  const renderDescription = (desc: string, highlight: string, highlightClass: string) => {
    if (!highlight) return desc;
    const parts = desc.split(highlight);
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <span className={`${highlightClass} font-black underline decoration-2 underline-offset-2`}>{highlight}</span>
          {parts[1]}
        </>
      );
    }
    return desc;
  };

  const cards = [
    {
      icon: <ShieldCheck className="w-9 h-9 text-white" />,
      bgIcon: <ShieldCheck className="w-56 h-56" />,
      title: "망설이는 순간,\n상권은 소멸합니다",
      subtitle: "행정동 기준 철저한 '1동 1매장' 상권 독점 보호 정책",
      desc: "120pie는 가맹 점주님의 확실한 지역 매출 독점을 위해 행정동별로 단 한 개의 매장만 입점시키는 원칙을 철저히 지킵니다. 지금 고민하시는 동안 옆 블록 경쟁 매장이 먼저 선점하면, 동일 상권 내 입점은 영구적으로 불가능합니다. 선점이 곧 독점권 확보입니다.",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783482276/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_8%EC%9D%BC_%EC%98%A4%EC%A0%84_11_46_52_ju8akg.png",
      theme: {
        bg: "bg-[#0F3A8C] border-[#0F3A8C]",
        border: "border-[#0F3A8C]",
        icon: "text-white",
        line: "bg-white/40",
        highlight: "선점이 곧 독점권 확보입니다.",
        highlightClass: "text-[#FFD500] font-black underline",
        textTitle: "text-white",
        textSubtitle: "text-[#B9D3FF]",
        textDesc: "text-neutral-200"
      }
    },
    {
      icon: <TrendingUp className="w-9 h-9 text-white" />,
      bgIcon: <TrendingUp className="w-56 h-56" />,
      title: "이미 전국 200개 이상\n매장이 검증",
      subtitle: "개인 카페부터 신규 가맹까지 확실한 매출 상승 효과",
      desc: "단순히 완제품을 늘어놓는 납품 디저트가 아닙니다. 매장에서 직접 굽는 120겹 파이의 고소한 풍미와 화려한 비주얼이 매장의 시그니처가 됩니다. 이미 전국 200여 매장에서 디저트 도입 후 평균 음료 객단가 및 배달 매출이 35% 이상 급상승하고 있습니다.",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783482277/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_8%EC%9D%BC_%EC%98%A4%EC%A0%84_11_46_36_menj3n.png",
      theme: {
        bg: "bg-[#F5AC00] border-[#F5AC00]",
        border: "border-[#F5AC00]",
        icon: "text-white",
        line: "bg-white/40",
        highlight: "35% 이상 급상승하고 있습니다.",
        highlightClass: "text-[#D00000] font-black underline",
        textTitle: "text-white",
        textSubtitle: "text-[#FFEBB3]",
        textDesc: "text-neutral-100"
      }
    },
    {
      icon: <Megaphone className="w-9 h-9 text-white" />,
      bgIcon: <Megaphone className="w-56 h-56" />,
      title: "경험 제로, 마케팅 몰라도\n든든합니다",
      subtitle: "배달 플랫폼 셋업 대행부터 타깃 마케팅까지 무상 대행",
      desc: "초보 점주님이 매장에만 집중하실 수 있도록 본사 마케팅 전문가들이 배달의민족/쿠팡이츠 입점 등록 및 초기 셋업을 100% 전담 대행합니다. 뿐만 아니라 인근 지역 모바일 타깃 마케팅, 점포 비주얼 홍보물 세트 무상 지원으로 오픈 즉시 단골을 확보해 드립니다.",
      image: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783482277/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_8%EC%9D%BC_%EC%98%A4%ED%9B%84_12_44_15_gilzvj.png",
      theme: {
        bg: "bg-[#1DC322] border-[#1DC322]",
        border: "border-[#1DC322]",
        icon: "text-white",
        line: "bg-white/40",
        highlight: "즉시 단골을 확보해 드립니다.",
        highlightClass: "text-[#FFD500] font-black underline",
        textTitle: "text-white",
        textSubtitle: "text-[#C2F5D1]",
        textDesc: "text-neutral-100"
      }
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#0F3587]/10 dark:bg-blue-500/10 text-[#0F3587] dark:text-blue-400 border border-[#0F3587]/20 dark:border-blue-500/20 text-xs font-black uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Success Guarantee Policy</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.2]"
          >
            왜 꼭 <span className="text-[#0F3587] dark:text-blue-400 font-extrabold">120겹 파이</span>여야 할까요?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl font-semibold text-neutral-600 dark:text-neutral-350 max-w-3xl mx-auto leading-relaxed"
          >
            경쟁 매장이 먼저 행동하기 전에 압도적인 독점 상권 혜택과 본사의 전폭적인 마케팅 지원을 누려보세요.
          </motion.p>
        </div>

        {/* 🌟 3 High-Impact Cards Grid with Bottom Beverages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`group ${card.theme.bg} border ${card.theme.border} rounded-[2.5rem] p-8 sm:p-10 pb-0 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Decorative Background Icon (Opacity-5) */}
              <div className={`absolute -bottom-6 -right-6 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-10 ${card.theme.icon}`}>
                {card.bgIcon}
              </div>

              <div className="relative z-30">
                {/* Top Icon */}
                <div className={`${card.theme.icon} mb-5 group-hover:scale-110 transition-transform duration-300 inline-block`}>
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className={`text-2xl sm:text-[26px] font-black ${card.theme.textTitle} mb-3.5 leading-tight whitespace-pre-line`}>
                  {card.title}
                </h3>

                {/* Divider Line */}
                <div className={`w-8 h-[2px] ${card.theme.line} mb-4`} />

                {/* Subtitle */}
                <p className={`text-xs sm:text-sm font-black ${card.theme.textSubtitle} mb-3 tracking-tight`}>
                  {card.subtitle}
                </p>

                {/* Description */}
                <p className={`text-[13px] sm:text-sm ${card.theme.textDesc} leading-relaxed font-medium mb-8 break-keep`}>
                  {renderDescription(card.desc, card.theme.highlight, card.theme.highlightClass)}
                </p>
              </div>

              {/* Spacer to prevent text overlapping the absolute bottom image */}
              <div className="h-44 sm:h-52 shrink-0 pointer-events-none" />

              {/* Bottom Image ( 카드 바닥 3면에 절대 밀착 및 위쪽 페이드아웃 ) */}
              <div 
                className="absolute bottom-0 left-0 right-0 w-full h-48 sm:h-56 overflow-hidden z-20 rounded-b-[2.4rem]"
                style={{
                  maskImage: "linear-gradient(to top, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 95%)",
                  WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 5%, rgba(0,0,0,0) 95%)"
                }}
              >
                <img
                  src={optimizeCloudinaryUrl(card.image)}
                  alt={card.title.replace("\n", " ")}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand Core Callout Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 sm:mt-24 p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-[#0F3587] to-[#0A2052] dark:from-[#08225e] dark:to-[#041133] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Decorative Circle Background */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center md:text-left space-y-3 max-w-3xl">
            <h4 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
              더 늦기 전에, 점포의 상권 보호 신청을 먼저 접수해 두세요!
            </h4>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-medium leading-relaxed">
              점포 위치나 입점 희망 행정동을 말씀해 주시면, 본사 담당자가 해당 구역의 계약 진행 가능 여부(상권 독점 현황)를 즉시 실시간 조회 및 예약해 드립니다.
            </p>
          </div>

          <button
            onClick={onContactClick}
            className="inline-flex items-center space-x-2 px-6 py-4.5 rounded-2xl bg-amber-400 text-neutral-950 font-black text-sm sm:text-base hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20 shrink-0"
          >
            <MapPin className="w-5 h-5 text-neutral-950" />
            <span>실시간 상권 조회 신청</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
