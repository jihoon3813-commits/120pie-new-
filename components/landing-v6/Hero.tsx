"use client";

import { motion } from "framer-motion";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

interface HeroProps {
  backgroundImageUrl?: string;
  mobileBackgroundImageUrl?: string;
}

export default function Hero({
  backgroundImageUrl = "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783844352/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_12%EC%9D%BC_%EC%98%A4%ED%9B%84_05_19_02_aasvbx.png",
  mobileBackgroundImageUrl = "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783844920/96ea2b3c-5edd-45a2-8998-1a76f0edc7da_g4vyyn.png",
}: HeroProps) {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#2B080E] pt-16 sm:pt-20">
      
      {/* 💻 Desktop Banner Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden sm:block absolute inset-0 w-full h-full z-0"
      >
        <img
          src={optimizeCloudinaryUrl(backgroundImageUrl)}
          alt="120pie premium desktop background banner"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* 📱 Mobile Banner Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="block sm:hidden absolute inset-0 w-full h-full z-0"
      >
        <img
          src={optimizeCloudinaryUrl(mobileBackgroundImageUrl)}
          alt="120pie premium mobile background banner"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Subtle top gradient overlay to blend with GNB */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950/20 to-transparent pointer-events-none z-10" />
      
    </section>
  );
}
