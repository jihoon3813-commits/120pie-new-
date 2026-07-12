"use client";

import { motion } from "framer-motion";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

export default function TopImageSection() {
  const imageUrl = "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783846475/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_12%EC%9D%BC_%EC%98%A4%ED%9B%84_05_54_25_esvngp.png";

  return (
    <section className="relative w-full h-auto overflow-hidden bg-neutral-950 pt-16 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full h-auto"
      >
        <img
          src={optimizeCloudinaryUrl(imageUrl)}
          alt="120pie top event banner"
          className="w-full h-auto block object-cover"
        />
      </motion.div>
    </section>
  );
}
