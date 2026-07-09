"use client";

import { motion } from "framer-motion";

interface HeroProps {
  backgroundImageUrl?: string;
}

export default function Hero({
  backgroundImageUrl = "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783336643/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_6%EC%9D%BC_%EC%98%A4%ED%9B%84_08_16_47_gowenw.png",
}: HeroProps) {
  return (
    <section className="relative w-full h-auto overflow-hidden bg-neutral-950 pt-16 sm:pt-20">
      
      {/* 📱 Mobile Layout: Stacked Images with color matched background (#FCB601) */}
      <div className="block sm:hidden relative w-full bg-[#FCB601] overflow-hidden">
        {/* First Image: full width, auto height */}
        <div className="w-full h-auto">
          <img
            src="https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783413057/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_6%EC%9D%BC_%EC%98%A4%ED%9B%84_09_25_32-2_dts7oz.png"
            alt="120pie mobile banner first"
            className="w-full h-auto block"
          />
        </div>

        {/* Second Image: Large, placed below the first image with negative margin to reduce text gap */}
        <div className="w-full flex justify-center mt-[-60px] min-[400px]:mt-[-80px] pb-12 px-4 z-20 relative">
          <motion.img
            src="https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783340762/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_klgyn4.png"
            alt="120pie mobile banner second (Apple Pie)"
            className="w-[95%] max-w-[420px] h-auto object-contain drop-shadow-2xl"
            animate={{
              y: [0, -12, 0],
              rotate: [0, 6, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* 💻 Desktop Layout: Scaled Widescreen Banner */}
      <div className="hidden sm:block w-full h-auto">
        <img
          src={backgroundImageUrl}
          alt="120pie premium background banner"
          className="w-full h-auto block"
        />
      </div>

      {/* Subtle top gradient overlay to blend with GNB */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950/45 to-transparent pointer-events-none" />

      {/* Wavy transition boundary to RollingBanner (matching the user's reference shape) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="#0F3587"
          />
        </svg>
      </div>
    </section>
  );
}
