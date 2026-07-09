"use client";

import { motion } from "framer-motion";
import { ChevronRight, PhoneCall, MapPin, Sliders, ChefHat, Rocket } from "lucide-react";

interface Step {
  num: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

export default function FranchiseProcess() {
  const steps: Step[] = [
    { 
      num: "01", 
      title: "창업 상담", 
      icon: <PhoneCall className="w-5 h-5 sm:w-6 h-6 text-white" />,
      color: "bg-[#0F3587]" 
    },
    { 
      num: "02", 
      title: "상권 및 매장 확인", 
      icon: <MapPin className="w-5 h-5 sm:w-6 h-6 text-white" />,
      color: "bg-[#0D2D72]" 
    },
    { 
      num: "03", 
      title: "도입 타입 결정", 
      icon: <Sliders className="w-5 h-5 sm:w-6 h-6 text-white" />,
      color: "bg-[#0B255D]" 
    },
    { 
      num: "04", 
      title: "교육 및 세팅", 
      icon: <ChefHat className="w-5 h-5 sm:w-6 h-6 text-white" />,
      color: "bg-[#091D4A]" 
    },
    { 
      num: "05", 
      title: "오픈 운영", 
      icon: <Rocket className="w-5 h-5 sm:w-6 h-6 text-white" />,
      color: "bg-[#071536]" 
    }
  ];

  return (
    <section id="franchise" className="py-10 sm:py-32 bg-[#FFB800] text-neutral-900 transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic Background Graphics */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-neutral-905/10 text-neutral-950 border border-neutral-950/20 text-xs font-black uppercase tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-[#0F3587]" />
            <span>Infographic Startup Path</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-[1.2]"
          >
            상담부터 오픈까지
            <br />
            <span className="text-[#0F3587]">단계는 간단하게</span>
          </motion.h2>
        </div>

        {/* 🌟 Infographic Timeline */}
        <div className="relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[6.5rem] left-[10%] right-[10%] h-[4px] bg-neutral-950/15 z-0">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-[#0F3587]" 
            />
          </div>

          {/* Connector Line for Mobile (Vertical Line connecting elements) */}
          <div className="lg:hidden absolute top-[3.5rem] bottom-[3.5rem] left-1/2 -translate-x-1/2 w-[3px] bg-neutral-955/20 z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6 items-stretch relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Infographic Step Card */}
                <div className="bg-white/95 backdrop-blur border-2 border-white rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 w-full flex flex-row sm:flex-col items-center sm:justify-between min-h-0 sm:min-h-[220px] lg:min-h-[240px] gap-4 sm:gap-0 relative">
                  
                  {/* Floating Number Bubble (Symmetrical Center-Aligned on Mobile/Desktop) */}
                  <span className="absolute -top-3.5 left-6 sm:left-1/2 sm:-translate-x-1/2 bg-[#0F3587] text-white text-[10px] sm:text-xs font-black px-3.5 py-1 rounded-full shadow-md z-20 whitespace-nowrap">
                    STEP {step.num}
                  </span>

                  {/* 1. Icon Circle Badge */}
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 my-2 z-10 shrink-0`}>
                    {step.icon}
                  </div>

                  {/* 2. Step Title & Indicator */}
                  <div className="flex flex-col items-start text-left sm:items-center sm:text-center flex-1">
                    <h3 className="text-base sm:text-xl font-black text-neutral-900 group-hover:text-[#0F3587] transition-colors leading-tight">
                      {step.title}
                    </h3>
                    <div className="hidden sm:block w-12 h-[3px] bg-neutral-200 group-hover:bg-[#0F3587] transition-colors mt-3 rounded-full" />
                  </div>
                </div>

                {/* Desktop Chevron Connector */}
                {index < 4 && (
                  <div className="hidden lg:block absolute top-[5.3rem] -right-4 translate-x-1/2 text-[#0F3587] group-hover:translate-x-3 transition-transform z-20">
                    <ChevronRight className="w-6 h-6 stroke-[3]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
