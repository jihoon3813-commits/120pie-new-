"use client";

import { motion } from "framer-motion";
import { Coffee, Flame, Award, Utensils, Star } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

export default function BrandCompetitiveness() {
  const lineupList = [
    {
      badge: "에그120",
      title: "특허받은 리얼 계란빵",
      desc: "추억 속 계란빵을 한층 더 퐁신하고 든든한 퀄리티로 재해석한 독보적인 에그 디저트 라인업",
      icon: <Award className="w-6 h-6 text-blue-300" />,
      imageLabel: "에그120 제품 이미지 영역",
      imageUrl: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783472359/A4_08304_2_vyr6yn.jpg",
    },
    {
      badge: "츄러스120",
      title: "정통 스페인 츄러스",
      desc: "바삭하고 쫀득한 결을 오롯이 복원해 낸, 커피와 최고의 궁합을 이루는 시그니처 츄러스",
      icon: <Star className="w-6 h-6 text-blue-300" />,
      imageLabel: "츄러스120 제품 이미지 영역",
      imageUrl: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783472386/IMG_0015_6_3_zgtsix.jpg",
    },
    {
      badge: "핫도그120",
      title: "직화 불고기 핫도그",
      desc: "직화로 구워 불향 가득한 불고기와 120 특제 소시지가 어우러져 한층 더 풍성한 맛을 구현한 핫도그",
      icon: <Flame className="w-6 h-6 text-blue-300" />,
      imageLabel: "핫도그120 제품 이미지 영역",
      imageUrl: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783472403/A4_07063_2_wkh5jr.jpg",
    },
    {
      badge: "떡볶이120",
      title: "누구나 좋아하는 누들 떡볶이",
      desc: "매콤달콤한 소스가 쫄깃한 누들 떡 사이에 깊게 베인 마성의 중독적인 사이드 스낵",
      icon: <Utensils className="w-6 h-6 text-blue-300" />,
      imageLabel: "떡볶이120 제품 이미지 영역",
      imageUrl: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783472583/%EA%B5%AD%EB%AC%BC%EB%96%A1%EB%B3%B6%EC%9D%B4_hlkdoo.jpg",
    },
    {
      badge: "120 음료",
      title: "30가지 다채로운 커피 & 음료",
      desc: "스페셜티 에스프레소부터 과일 주스, 밀크 쉐이크까지 디저트와 페어링되는 완벽한 음료 스펙트럼",
      icon: <Coffee className="w-6 h-6 text-blue-300" />,
      imageLabel: "120 음료 대표 이미지 영역",
      imageUrl: "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783472688/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_8%EC%9D%BC_%EC%98%A4%EC%A0%84_10_04_37_vvrmby.png",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-[#0F3587] to-[#0A2052] dark:from-[#0a255c] dark:to-[#06173b] text-white pt-24 pb-28 sm:pt-32 sm:pb-36 overflow-hidden transition-colors duration-300">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Background Floating Menu Images (3x Larger, z-10 index to stay behind z-20 cards) */}
        {/* 1. Apple Pie (Top Left, near Egg120 Card corner) */}
        <motion.img
          src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/v1783340762/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_klgyn4.png")}
          alt="Apple Pie Dec"
          className="absolute top-[-65px] left-[-85px] lg:top-[-115px] lg:left-[-145px] w-[220px] h-[220px] lg:w-[320px] lg:h-[320px] object-contain opacity-100 drop-shadow-xl pointer-events-none select-none hidden sm:block z-10"
          animate={{
            y: [0, 15, 0],
            rotate: [-12, -8, -12],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 2. Egg Bread (Top Right, near Hotdog120 Card corner) */}
        <motion.img
          src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/v1783408031/edited-photo_4_b8a4uf.png")}
          alt="Egg Bread Dec"
          className="absolute top-[-65px] right-[-85px] lg:top-[-115px] lg:right-[-145px] w-[220px] h-[220px] lg:w-[320px] lg:h-[320px] object-contain opacity-100 drop-shadow-xl pointer-events-none select-none hidden sm:block z-10"
          animate={{
            y: [0, -15, 0],
            rotate: [15, 20, 15],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 3. Churros (Bottom Left, near Tteokbokki120 Card corner) - Slightly Larger */}
        <motion.img
          src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/v1783408064/edited-photo_9_cjetbl.png")}
          alt="Churros Dec"
          className="absolute bottom-[60px] left-[-110px] lg:bottom-[80px] lg:left-[-180px] w-[280px] h-[280px] lg:w-[400px] lg:h-[400px] object-contain opacity-100 drop-shadow-xl pointer-events-none select-none hidden sm:block z-10"
          animate={{
            y: [0, -10, 0],
            rotate: [8, 12, 8],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* 4. Americano (Bottom Right, near Drinks Card corner) - Slightly Larger */}
        <motion.img
          src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/v1783408653/%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8_d53crd.png")}
          alt="Americano Dec"
          className="absolute bottom-[-75px] right-[-110px] lg:bottom-[-125px] lg:right-[-180px] w-[280px] h-[280px] lg:w-[400px] lg:h-[400px] object-contain opacity-100 drop-shadow-xl pointer-events-none select-none hidden sm:block z-10"
          animate={{
            y: [0, 15, 0],
            rotate: [-15, -10, -15],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Header Layout */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs sm:text-sm font-black uppercase tracking-widest text-blue-200 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full"
          >
            Brand Competitiveness
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.2]"
          >
            파이, 그 이상의 디저트 경쟁력
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full mx-auto"
          >
            {/* 💻 Desktop View: Original whitespace-pre-line text */}
            <p className="hidden md:block text-base sm:text-xl font-medium text-blue-100/90 max-w-3xl mx-auto leading-relaxed whitespace-pre-line break-keep">
              120PIE&COFFEE는 120겹 파이만을 파는 브랜드가 아닙니다.
              {"\n"}
              특허받은 리얼 계란빵 <span className="text-amber-300 font-extrabold">에그120</span>, 정통 스페인 맛 그대로 복원한 <span className="text-amber-300 font-extrabold">츄러스120</span>,
              {"\n"}
              직화로 구현한 풍성한 맛 <span className="text-amber-300 font-extrabold">핫도그120</span>, 누구나 좋아하는 누들 떡볶이 <span className="text-amber-300 font-extrabold">떡볶이120</span>,
              {"\n"}
              그리고 <span className="text-amber-300 font-extrabold">30가지가 넘는 다채로운 커피 & 음료</span>까지. 완벽한 디저트&커피 라인업을 제공합니다.
            </p>

            {/* 📱 Mobile View: Highly readable, structured list format */}
            <div className="block md:hidden text-center text-sm font-bold text-blue-100/90 leading-relaxed break-keep space-y-3.5 px-2">
              <p className="text-sm">120PIE&COFFEE는 120겹 파이만을 파는 브랜드가 아닙니다.</p>
              
              <div className="py-4 px-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 text-left inline-block w-full max-w-[340px] mx-auto text-xs">
                <p className="flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>특허받은 리얼 계란빵 <span className="text-amber-300 font-black">에그120</span></span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>정통 스페인 맛 그대로 복원한 <span className="text-amber-300 font-black">츄러스120</span></span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>직화로 구현한 풍성한 맛 <span className="text-amber-300 font-black">핫도그120</span></span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span>누구나 좋아하는 누들 떡볶이 <span className="text-amber-300 font-black">떡볶이120</span></span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-amber-400 shrink-0">•</span>
                  <span><span className="text-amber-300 font-black">30가지가 넘는 다채로운 커피 & 음료</span>까지</span>
                </p>
              </div>

              <p className="font-black text-white text-sm pt-1">완벽한 디저트 & 커피 라인업을 제공합니다.</p>
            </div>
          </motion.div>
        </div>

        {/* 3-Column Grid for Custom 3+2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lineupList.map((item, idx) => {
            const isDrinkCard = idx === 4;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative z-20 group bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300 flex ${
                  isDrinkCard 
                    ? "lg:col-span-2 md:col-span-2 col-span-1 flex-col md:flex-row gap-6" 
                    : "flex-col justify-between"
                }`}
              >
                {isDrinkCard ? (
                  <>
                    {/* Horizontal Drink Card: Image Left */}
                    {item.imageUrl ? (
                      <div className="relative w-full md:w-1/2 aspect-[16/10] md:aspect-auto rounded-2xl overflow-hidden min-h-[180px] border border-white/10">
                        <img
                          src={optimizeCloudinaryUrl(item.imageUrl)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full md:w-1/2 aspect-[16/10] md:aspect-auto bg-white/5 rounded-2xl border-2 border-dashed border-white/15 group-hover:border-white/35 flex flex-col items-center justify-center p-4 transition-all duration-300 select-none min-h-[180px]">
                        <div className="p-3 bg-white/10 rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <span className="text-xs sm:text-sm font-black text-white/90">
                          {item.imageLabel}
                        </span>
                        <span className="text-[10px] text-white/40 mt-1">
                          (나중에 교체 가능 영역)
                        </span>
                      </div>
                    )}

                    {/* Horizontal Drink Card: Content Right */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center text-left space-y-3">
                      <div className="flex items-center">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/35 text-blue-200 px-2.5 py-0.5 rounded-md border border-blue-400/20">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white group-hover:text-blue-200 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-blue-100/75 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Vertical Cards */}
                    <div>
                      {/* 1. Large Image or Placeholder (dashed) */}
                      {item.imageUrl ? (
                        <div className="relative w-full aspect-[16/10] bg-white/5 rounded-2xl overflow-hidden mb-6 border border-white/10">
                          <img
                            src={optimizeCloudinaryUrl(item.imageUrl)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full aspect-[16/10] bg-white/5 rounded-2xl border-2 border-dashed border-white/15 group-hover:border-white/35 flex flex-col items-center justify-center p-4 transition-all duration-300 mb-6 select-none">
                          <div className="p-3 bg-white/10 rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <span className="text-xs sm:text-sm font-black text-white/90">
                            {item.imageLabel}
                          </span>
                          <span className="text-[10px] text-white/40 mt-1">
                            (나중에 교체 가능 영역)
                          </span>
                        </div>
                      )}

                      {/* 2. Text Content */}
                      <div className="text-left space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/35 text-blue-200 px-2.5 py-0.5 rounded-md border border-blue-400/20">
                            {item.badge}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-blue-200 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-blue-100/70 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Bottom Wavy transition to MenuPosterBanner (Matching new background #D98F00) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-[#D98F00]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="currentColor"
          />
        </svg>
      </div>

    </section>
  );
}
