"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useAction } from "convex/react";
import Footer from "@/app/components/Footer";
import { MENU_DATA, MenuItem } from "@/app/constants/menu";
import { api } from "../../convex/_generated/api";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import { triggerConsultationSms } from "@/app/utils/sms";
import {
  ArrowRight,
  TrendingUp,
  Store,
  Zap,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Award,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Package,
  Box,
  Heart,
  Trophy,
  Lightbulb,
  MapPin,
  Headphones,
  Monitor,
  Search,
  X,
  Check,
  ArrowUpRight,
  Menu,
  Camera,
  Video,
  Phone,
  MessageCircle,
  Plus,
  MessageSquare,
  FileText
} from "lucide-react";

const POSTER_IMAGES = [
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570620/ChatGPT_Image_2026%EB%85%84_6%EC%9B%94_30%EC%9D%BC_%EC%98%A4%ED%9B%84_05_58_55_wx2peg.png",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570606/120_%EC%88%98%EB%B0%95%EC%A3%BC%EC%8A%A4_POP_A4_3_dow8re.png",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570599/120%ED%8C%8C%EC%9D%B4-%ED%9D%91%EC%9E%84%EC%9E%90-%ED%8F%AC%EC%8A%A4%ED%84%B0__231007_r1kiww.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4%EC%BB%A4%ED%94%BC%EC%84%B8%ED%8A%B8_yj3e42.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/120%ED%8C%8C%EC%9D%B4_%ED%95%A8%EB%B0%95%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_Pop_Poster_vvkfbe.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/120%ED%8C%8C%EC%9D%B4-%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88-%ED%8F%AC%EC%8A%A4%ED%84%B0__230925_wph2wa.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/%EB%A7%A4%EC%9E%A5POP_2_%EC%A7%81%ED%99%94%EB%B6%88%EB%8B%AD_NONEWON_wxdczh.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/%EB%A7%A4%EC%9E%A5POP_1_%EC%A7%81%ED%99%94%EB%B6%88%EA%B3%A0%EA%B8%B0_NONEWON_itkdqv.jpg",
  "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783570598/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4%EC%84%B8%ED%8A%B8_glhjar.jpg"
];

// 뷰포트 감지 카운팅 애니메이션 컴포넌트 (V3 다크 옐로우 맞춤 에디션)
function AnimatedNumber({ value, suffix = "" }: { value: number, suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 1500;
      const step = Math.ceil(value / 30) || 1;
      const stepTime = Math.abs(Math.floor(duration / (value / step)));

      const timer = setInterval(() => {
        start += step;
        if (start > value) start = value;
        setCount(start);
        if (start === value) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const getBadgeClasses = (badge: string, isPink: boolean) => {
  if (badge === "ORIGINAL") {
    return isPink 
      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
      : "bg-emerald-50 text-emerald-700 border border-emerald-250/65";
  }
  if (badge === "MEAT") {
    return isPink 
      ? "bg-rose-500/10 border border-rose-500/30 text-rose-400" 
      : "bg-rose-50 text-rose-700 border border-rose-250/65";
  }
  if (badge === "PIZZA") {
    return isPink 
      ? "bg-amber-500/10 border border-amber-500/30 text-amber-400" 
      : "bg-amber-50 text-amber-800 border border-amber-250/65";
  }
  if (badge === "NEW") {
    return isPink 
      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
      : "bg-emerald-600 text-white";
  }
  return isPink 
    ? "bg-rose-500 text-white" 
    : "bg-neutral-900 text-amber-400";
};

// 1. [MENU DETAIL MODAL] - V3 프리미엄 Glassmorphism 버전
function MenuModal({ menuId, onClose, onInquiry, isPink = false }: { menuId: string | null, onClose: () => void, onInquiry: () => void, isPink?: boolean }) {
  if (!menuId) return null;

  const data = MENU_DATA[menuId];
  if (!data) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          onClick={e => e.stopPropagation()}
          className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-auto flex flex-col max-h-[92dvh] sm:max-h-[90vh]"
        >
          <button onClick={onClose} className="absolute top-4 sm:top-5 right-4 sm:right-5 text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-full p-2 sm:p-2.5 z-20 transition-colors">
            <X size={18} />
          </button>

          {/* Scrollable Container (holds Header + Grid) */}
          <div className="overflow-y-auto flex-1 menu-modal-scroll max-h-[calc(100dvh-180px)] sm:max-h-[65vh]">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-neutral-800 text-center bg-gradient-to-b from-neutral-900 to-neutral-950">
              <span className="modal-accent-label inline-block px-3 py-1 rounded bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider mb-2">MENU PREVIEW</span>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{data.title}</h3>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto font-medium leading-relaxed">{data.desc}</p>
            </div>

            {/* Grid */}
            <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 bg-neutral-950">
              {data.items.map((item, i) => (
                <div key={i} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-850 shadow-lg hover:border-amber-400/40 transition-all group">
                  <div className={`h-44 overflow-hidden relative bg-white flex items-center justify-center transition-all ${
                    item.name.includes("컵팥빙수") ? "p-6" : "p-3"
                  }`}>
                    <img src={item.img} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                    {item.badge && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide shadow-sm z-10 ${
                        getBadgeClasses(item.badge, isPink)
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.tag && (
                      <span className={`absolute top-3 right-3 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase shadow-sm z-10 !text-white ${
                        item.tag === "HIT" 
                          ? "bg-rose-600" 
                          : item.tag === "추천" 
                            ? "bg-blue-600" 
                            : "bg-emerald-600"
                      }`}>
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-white text-base mb-1.5 flex items-center flex-wrap gap-1.5">
                      <span>{item.name}</span>
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 sm:p-6 bg-neutral-900 text-center border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <span className="text-[10px] sm:text-xs text-neutral-400 font-bold">메뉴 구성과 판매 방식은 매장 상황에 맞춰 안내해드립니다.</span>
            <button type="button" onClick={() => { onClose(); onInquiry(); }} className={`pink-primary-button w-full sm:w-auto px-6 py-3 font-black rounded-lg transition-colors text-xs border-0 cursor-pointer ${
              isPink 
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.25)]" 
                : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.25)]"
            }`}>
              메뉴 도입 상담받기 &rarr;
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

type InquiryFormData = {
  name: string;
  phone: string;
  storeType: string;
  existingStoreName: string;
  message: string;
};

function InquiryModal({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  submitted,
  isPink = false
}: {
  open: boolean;
  onClose: () => void;
  formData: InquiryFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitted: boolean;
  isPink?: boolean;
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.35)] rounded-3xl border ${
            isPink 
              ? "bg-[#fffdf9] border-[#f2ccd7] text-neutral-900" 
              : "bg-neutral-900 border-neutral-800 text-white"
          }`}
        >
          <button type="button" onClick={onClose} aria-label="닫기" className={`absolute top-5 right-5 rounded-full p-2.5 z-10 transition-colors border-0 cursor-pointer ${
            isPink 
              ? "text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/60" 
              : "text-neutral-400 hover:text-white bg-neutral-800/80"
          }`}>
            <X size={18} />
          </button>
          <div className={`p-7 sm:p-9 border-b text-center ${isPink ? "border-[#f2ccd7]" : "border-neutral-800"}`}>
            <span className={`font-bold tracking-widest text-[10px] uppercase block mb-2 font-mono ${isPink ? "text-rose-500" : "text-amber-400"}`}>Easy Inquiry</span>
            <h3 className={`text-2xl font-black mb-2 ${isPink ? "text-neutral-950" : "text-white"}`}>편하게 상담받아 보세요</h3>
            <p className={`text-xs sm:text-sm font-medium ${isPink ? "text-neutral-600" : "text-neutral-400"}`}>매장에 잘 맞는 메뉴 구성과 시작 방법을 안내드립니다.</p>
          </div>
          {submitted ? (
            <div className="p-10 text-center">
              <h4 className={`text-xl font-black mb-3 ${isPink ? "text-neutral-950" : "text-white"}`}>문의가 잘 접수되었습니다!</h4>
              <p className={`text-sm leading-relaxed ${isPink ? "text-neutral-600" : "text-neutral-400"}`}>남겨주신 연락처로 편하게 안내드리겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="성함" required className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                  isPink 
                    ? "bg-white border-[#f3d3de] text-neutral-900 placeholder-neutral-400 focus:border-rose-500" 
                    : "bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-400"
                }`} />
                <input type="tel" inputMode="numeric" autoComplete="tel" maxLength={13} name="phone" value={formData.phone} onChange={onChange} placeholder="연락처" required className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                  isPink 
                    ? "bg-white border-[#f3d3de] text-neutral-900 placeholder-neutral-400 focus:border-rose-500" 
                    : "bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-400"
                }`} />
              </div>
              <select name="storeType" value={formData.storeType} onChange={onChange} className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors appearance-none ${
                isPink 
                  ? "bg-white border-[#f3d3de] text-neutral-900 focus:border-rose-500" 
                  : "bg-neutral-950 border-neutral-800 text-white focus:border-amber-400"
              }`}>
                <option value="샵인샵 도입">간단한 메뉴 추가로 시작</option>
                <option value="브랜드 병기 도입">브랜드 안내와 함께 운영</option>
                <option value="공동간판 제휴">함께 보이는 간판 협업</option>
                <option value="단독 매장 전환">전용 매장으로 전환 상담</option>
                <option value="신규 무점포/창업">새로운 매장 창업 상담</option>
              </select>
              <textarea name="message" value={formData.message} onChange={onChange} rows={3} placeholder="매장 형태나 궁금한 점을 편하게 남겨주세요." className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none ${
                isPink 
                  ? "bg-white border-[#f3d3de] text-neutral-900 placeholder-neutral-400 focus:border-rose-500" 
                  : "bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600 focus:border-amber-400"
              }`} />
              <label className={`flex items-start gap-2 text-[10px] font-bold cursor-pointer select-none ${isPink ? "text-neutral-500" : "text-neutral-500"}`}>
                <input type="checkbox" required defaultChecked className={`mt-0.5 ${isPink ? "accent-rose-500" : "accent-amber-400"}`} />
                상담 안내를 위한 개인정보 수집 및 연락에 동의합니다. (필수)
              </label>
              <button type="submit" className={`pink-primary-button w-full py-4 font-black text-sm rounded-xl transition-colors border-0 cursor-pointer ${
                isPink 
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_24px_rgba(244,63,94,0.3)]" 
                  : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_24px_rgba(251,191,36,0.3)]"
              }`}>
                무료 상담 문의하기
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// 2. [ADOPTION STEP MODAL] - V3 샵인샵/리모델링 실제 사진 팝업
function AdoptionModal({ exampleId, onClose }: { exampleId: string | null, onClose: () => void }) {
  if (!exampleId) return null;

  const examples: Record<string, { title: string, subtitle: string, desc: string, img: string }> = {
    "01": {
      title: "01. 가벼운 샵인샵 형태",
      subtitle: "기존 베이커리 쇼케이스 및 소형 매장용 셋업",
      desc: "기존 매장을 크게 바꾸지 않고, 파이를 판매할 수 있는 작은 공간과 필요한 조리 환경을 마련해 시작하는 방식입니다. 현재 매장 구조와 운영 상황에 맞는 준비 항목은 상담을 통해 안내해드립니다.",
      img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop"
    },
    "02": {
      title: "02. 뚜렷한 브랜드 병기 형태",
      subtitle: "매장 유리 윈도우 스티커 및 듀얼 브랜딩",
      desc: "기존 개인 카페 로고와 정체성은 지키면서, 출입문 유리창, 내부 벽면 및 메뉴보드에 120pie&coffee의 세련된 블랙&옐로우 엠블럼과 에그군 캐릭터 스티커를 부착하는 듀얼 브랜드 방식입니다. 지나가는 동네 주민들에게 맛있는 시그니처 디저트를 파는 매장임을 즉각적으로 홍보하여 고객 유입률을 2배 이상 견인합니다.",
      img: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=1000&auto=format&fit=crop"
    },
    "03": {
      title: "03. 시너지 폭발 공동간판 형태",
      subtitle: "기존 메인간판 우측 하단에 패밀리 로고 추가",
      desc: "본사가 가장 강력히 추천하는 세미-리모델링 방식입니다. 기존 카페 간판 전체를 뜯어내지 않고, 간판 우측 하단이나 측면에 'with 120pie & coffee' 패널을 일체감 있게 덧붙여 노출합니다. 지나가는 고객들에게 검증된 디저트 맛집 프랜차이즈가 이식되었음을 명확히 인지하게 하여 신뢰도와 매출 시너지를 배가시킵니다.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
    },
    "04": {
      title: "04. 감각적인 단독 가맹 전환",
      subtitle: "120pie&coffee 마스터 브랜드 단독 매장화",
      desc: "샵인샵이나 공동간판 도입 후 압도적인 디저트 매출 비중과 안정적인 수익 구조를 직접 눈으로 확인하신 사장님들을 위한 최종 진화 단계입니다. 매장 전면 및 인테리어 전체를 본사 지원 하에 블랙&옐로우 시그니처 톤과 입체 캐릭터 굿즈 몰딩을 가미하여 트렌디하고 힙한 120pie&coffee 전문 매장으로 완벽히 탈바꿈시킵니다.",
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
    },
  };
  const data = examples[exampleId];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col md:flex-row"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-750 rounded-full p-2 z-10 transition-colors">
            <X size={18} />
          </button>
          <div className="w-full md:w-1/2 h-64 md:h-auto bg-neutral-950 relative">
            <img src={data.img} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" alt={data.title} />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-900 via-transparent to-transparent"></div>
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-neutral-900 relative">
            <span className="text-amber-400 text-[10px] font-black tracking-widest uppercase mb-1">{data.subtitle}</span>
            <h3 className="text-2xl font-black text-white mb-4 leading-tight">{data.title}</h3>
            <p className="text-neutral-300 text-xs sm:text-sm font-medium leading-relaxed">{data.desc}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const MARQUEE_IMAGES = [
  { name: "로제미트파이", src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184221/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_s3svi2.jpg" },
  { name: "블루베리파이", src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184610/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_zfmatx.jpg" },
  { name: "콘치즈파이", src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184643/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_lio2tj.jpg" },
  { name: "흑임자크림파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779760050/%ED%9D%91%EC%9E%84%EC%9E%90%ED%81%AC%EB%A6%BC_g0p6sk.jpg" },
  { name: "커스터드파이", src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184658/%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%93%9C%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_dule6z.jpg" },
  { name: "불고기파이", src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184700/%EB%B6%88%EA%B3%A0%EA%B8%B0%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_ss1t8y.jpg" },
  { name: "두바이쫀득파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779760051/%EB%91%90%EB%B0%94%EC%9D%B4%EC%AA%BD%EB%93%9D%ED%8C%8C%EC%9D%B4_vjl5zb.jpg" },
  { name: "애플시나몬파이", src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184723/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_kxykcu.jpg" },
  { name: "오리지널 계란빵", src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781184985/edited-photo_4_y98ytv.jpg" },
  { name: "오리지널 츄러스", src: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185404/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_izqnfl.jpg" }
];

// V3 StoresPreviewSection
function StoresPreviewSection({ isPink = false, isYellow = false }: { isPink?: boolean, isYellow?: boolean }) {
  const previewStores = [
    { name: "120겹파이 AK플라자 금정점", region: "경기 군포시 엘에스로 143 1층 1001호", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186013/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_AK%ED%94%8C%EB%9D%BC%EC%9E%90_%EA%B8%88%EC%A0%95%EC%A0%90_%EA%B2%BD%EA%B8%B0_%EA%B5%B0%ED%8F%AC%EC%8B%9C_%EC%97%98%EC%97%90%EC%8A%A4%EB%A1%9C_143_1%EC%B8%B5_1001%ED%98%B8_qcmpgs_bmrkku.jpg" },
    { name: "120겹파이 본점", region: "서울 성북구 돌곶이로14길 35 1층", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185938/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%B3%B8%EC%A0%90_%EC%84%9C%EC%9A%B8_%EC%84%B1%EB%B6%81%EA%B5%AC_%EB%8F%8C%EA%B3%B6%EC%9D%B4%EB%A1%9C14%EA%B8%B8_35_1%EC%B8%B5_k9mjon_z90vyq.jpg" },
    { name: "120겹파이 삼산점", region: "인천 부평구 장제로228번길 24", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186018/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%82%BC%EC%82%B0%EC%A0%90_%EC%9D%B8%EC%B2%9C_%EB%B6%80%ED%8F%89%EA%B5%AC_%EC%9E%A5%EC%A0%9C%EB%A1%9C228%EB%B2%88%EA%B8%B8_24_o9q4qy_m3wmdr.jpg" },
  ];

  return (
    <section className={`py-24 border-b transition-all duration-300 ${
      isPink 
        ? "bg-[#fffbfd] text-neutral-900 border-rose-100" 
        : isYellow 
          ? "bg-[#fffdf2] text-[#0d233a] border-[#e6dfc3]" 
          : "bg-white text-neutral-900 border-neutral-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-14 gap-8">
          <div className="max-w-3xl">
            <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
              isPink ? "text-rose-500" : isYellow ? "text-amber-600" : "text-neutral-400"
            }`}>
              Stores
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4 ${
              isPink ? "text-[#4c2d3a]" : isYellow ? "text-[#0d233a]" : "text-neutral-950"
            }`}>
              가까운 곳에서 만나는<br />120pie 매장
            </h2>
            <p className={`text-xs sm:text-sm font-bold leading-relaxed max-w-xl ${
              isPink ? "text-[#7c5d6c]" : isYellow ? "text-[#576575]" : "text-neutral-500"
            }`}>
              일상 가까운 곳에서 만날 수 있는 120겹파이 매장을 소개합니다.
            </p>
          </div>
          <Link 
            href={isPink ? "/stores?theme=pink" : isYellow ? "/stores?theme=yellow" : "/stores?theme=black"} 
            className={`inline-flex items-center gap-2 text-sm font-bold transition-colors shrink-0 ${
              isPink 
                ? "text-[#7c5d6c] hover:text-rose-600" 
                : isYellow 
                  ? "text-[#576575] hover:text-amber-600" 
                  : "text-neutral-700 hover:text-amber-600"
            }`}
          >
            전체 매장 보기 <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mobile-horizontal-cards grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewStores.map((store, i) => (
            <article 
              key={i} 
              className={`group border-t pt-5 transition-colors ${
                isPink ? "border-rose-100" : isYellow ? "border-[#e6dfc3]" : "border-neutral-200"
              }`}
            >
              <div className="h-56 overflow-hidden rounded-xl bg-neutral-100 mb-5">
                <img src={store.img} alt={store.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <h3 className={`font-black text-xl mb-2 ${
                isPink ? "text-[#4c2d3a]" : isYellow ? "text-[#0d233a]" : "text-neutral-950"
              }`}>{store.name}</h3>
              <div className={`font-bold text-xs sm:text-sm flex items-center gap-1.5 ${
                isPink ? "text-[#7c5d6c]" : isYellow ? "text-[#576575]" : "text-neutral-500"
              }`}>
                <MapPin size={14} className="text-neutral-400 shrink-0" />
                {store.region}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// V3 OwnerSystemSection
function OwnerSystemSection({ isPink = false, isYellow = false }: { isPink?: boolean, isYellow?: boolean }) {
  return (
    <section className={`py-24 overflow-hidden border-b transition-all duration-300 ${
      isPink 
        ? "bg-[#fff5f7] text-neutral-900 border-rose-100" 
        : isYellow 
          ? "bg-[#fffdf2] text-[#0d233a] border-[#e6dfc3]" 
          : "bg-[#0a0a0a] text-white border-neutral-900"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          <div className="lg:col-span-6">
            <span className={`font-bold tracking-widest text-xs mb-2 block uppercase font-mono ${
              isPink ? "text-rose-500" : isYellow ? "text-amber-600" : "text-amber-400"
            }`}>
              Partner Support
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight ${
              isPink ? "text-[#4c2d3a]" : isYellow ? "text-[#0d233a]" : "text-white"
            }`}>
              사장님은 매장 운영에<br />집중하세요.
            </h2>
            <p className={`text-xs sm:text-sm mb-10 font-bold leading-relaxed max-w-xl ${
              isPink ? "text-[#7c5d6c]" : isYellow ? "text-[#576575]" : "text-neutral-400"
            }`}>
              재료 발주부터 문의 응대, 홍보 자료까지 필요한 업무를 한곳에서 확인할 수 있도록 지원합니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className={`border-t pt-5 ${isPink ? "border-[#f2ccd7]" : isYellow ? "border-[#e6dfc3]" : "border-neutral-800"}`}>
                <Package size={19} className={isPink ? "text-rose-500 mb-4" : isYellow ? "text-[#0d233a] mb-4" : "text-amber-400 mb-4"} />
                <h4 className={`font-extrabold text-sm mb-2 ${isPink ? "text-[#4c2d3a]" : isYellow ? "text-[#0d233a]" : "text-white"}`}>간편 발주</h4>
                <p className={`text-xs leading-relaxed font-medium ${isPink ? "text-[#7c5d6c]" : isYellow ? "text-[#576575]" : "text-neutral-400"}`}>필요한 재료를 손쉽게 주문합니다.</p>
              </div>
              <div className={`border-t pt-5 ${isPink ? "border-[#f2ccd7]" : isYellow ? "border-[#e6dfc3]" : "border-neutral-800"}`}>
                <Headphones size={19} className={isPink ? "text-rose-500 mb-4" : isYellow ? "text-[#0d233a] mb-4" : "text-amber-400 mb-4"} />
                <h4 className={`font-extrabold text-sm mb-2 ${isPink ? "text-[#4c2d3a]" : isYellow ? "text-[#0d233a]" : "text-white"}`}>문의 지원</h4>
                <p className={`text-xs leading-relaxed font-medium ${isPink ? "text-[#7c5d6c]" : isYellow ? "text-[#576575]" : "text-neutral-400"}`}>운영 중 궁금한 점을 바로 문의합니다.</p>
              </div>
              <div className={`border-t pt-5 ${isPink ? "border-[#f2ccd7]" : isYellow ? "border-[#e6dfc3]" : "border-neutral-800"}`}>
                <Monitor size={19} className={isPink ? "text-rose-500 mb-4" : isYellow ? "text-[#0d233a] mb-4" : "text-amber-400 mb-4"} />
                <h4 className={`font-extrabold text-sm mb-2 ${isPink ? "text-[#4c2d3a]" : isYellow ? "text-[#0d233a]" : "text-white"}`}>홍보 자료</h4>
                <p className={`text-xs leading-relaxed font-medium ${isPink ? "text-[#7c5d6c]" : isYellow ? "text-[#576575]" : "text-neutral-400"}`}>매장에 필요한 안내물을 제공합니다.</p>
              </div>
            </div>

            <div>
              <Link 
                href="/portal" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`inline-flex items-center gap-2 text-sm font-bold transition-colors ${
                  isPink ? "text-rose-600 hover:text-rose-700" : isYellow ? "text-[#0d233a] hover:text-amber-600" : "text-amber-400 hover:text-amber-300"
                }`}
              >
                점주 지원 살펴보기 <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className={`relative aspect-[4/3] rounded-xl overflow-hidden ${
              isPink ? "bg-white border border-[#f2ccd7]" : isYellow ? "bg-white border border-[#e6dfc3]" : "bg-neutral-900"
            }`}>
              <video
                src="https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183441/120pie_%EC%8B%9C%EC%8A%A4%ED%85%9C_bpwa5d.mp4"
                autoPlay
                muted
                loop
                playsInline
                aria-label="120pie 점주 지원 시스템 영상"
                className="absolute inset-0 block w-full h-full object-cover scale-[1.45] sm:scale-[1.04]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// V3 GallerySection
function GallerySection({ filter, setFilter, isPink = false, isYellow = false }: { filter: string, setFilter: (t: string) => void, isPink?: boolean, isYellow?: boolean }) {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [showMoreModal, setShowMoreModal] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const convexGallery = useQuery(api.gallery.list);
  const convexGalleryCategories = useQuery(api.gallery.getCategories);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    if (convexGallery) {
      const mapped = convexGallery.map((item: any) => ({
        id: item._id || item.id || `gal-${Math.random()}`,
        name: item.name,
        category: item.category,
        url: item.url,
        regDate: item.regDate,
        isFeatured: item.isFeatured
      }));
      setGalleryItems(mapped);
    } else {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("120_gallery_items");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setGalleryItems(parsed);
          } catch (e) {
            console.error("Failed to parse gallery items in HomeV3", e);
          }
        } else {
          setGalleryItems([]);
        }
      }
    }
  }, [convexGallery]);

  const galleryCategories = convexGalleryCategories || ["신메뉴", "홍보연출", "메뉴판", "매장"];
  const availableCats = Array.from(new Set(galleryItems.map(item => item.category))).filter(Boolean) as string[];
  
  availableCats.sort((a, b) => {
    const aIdx = galleryCategories.indexOf(a);
    const bIdx = galleryCategories.indexOf(b);
    if (aIdx === -1 && bIdx === -1) return 0;
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  // Remove "전체" tab as requested
  const tabs = ["대표", ...availableCats];

  const filteredImages = (() => {
    if (filter === "대표") {
      const featured = galleryItems.filter(img => img.isFeatured === true);
      if (featured.length > 0) {
        return featured;
      }
      return galleryItems.slice(0, 9); // Fallback to 9 images
    }
    if (filter === "전체") {
      return galleryItems;
    }
    return galleryItems.filter(img => img.category === filter);
  })();

  const modalImages = (() => {
    if (filter === "대표") {
      return galleryItems; // Show all gallery items inside modal when clicking more on representative images
    }
    return filteredImages;
  })();

  const limit = isMobile ? 6 : 9; // Uniformly 2x3 = 6 on Mobile, 3x3 = 9 on PC for all categories
  const visibleImages = filteredImages.slice(0, limit);

  return (
    <section className={`py-24 border-b transition-all duration-300 ${
      isPink 
        ? "bg-[#fffbfd] text-neutral-900 border-rose-100" 
        : isYellow 
          ? "bg-[#fffdf2] text-[#0d233a] border-[#e6dfc3]" 
          : "bg-white text-neutral-900 border-neutral-100"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
            isPink ? "text-rose-500" : isYellow ? "text-amber-600" : "text-neutral-400"
          }`}>Gallery</span>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight ${
            isPink ? "text-[#4c2d3a]" : isYellow ? "text-[#0d233a]" : "text-neutral-955"
          }`}>
            매장과 메뉴의<br />실제 모습을 확인하세요.
          </h2>
          <p className={`text-xs sm:text-sm font-bold max-w-xl leading-relaxed ${
            isPink ? "text-[#7c5d6c]" : isYellow ? "text-[#576575]" : "text-neutral-500"
          }`}>
            본사 공식 어드민 갤러리에 등록된 실제 매장과 메뉴, 연출 컷을 실시간으로 확인하실 수 있습니다.
          </p>
        </div>

        <div className={`flex flex-wrap gap-2 mb-12 border-b pb-5 ${
          isPink ? "border-[#f2ccd7]" : isYellow ? "border-[#e6dfc3]" : "border-neutral-200"
        }`}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-md font-bold text-xs transition-colors ${filter === t
                  ? (isPink 
                      ? "bg-rose-500 text-white shadow-sm" 
                      : isYellow 
                        ? "bg-[#0d233a] text-white shadow-sm" 
                        : "bg-neutral-950 text-white")
                  : (isPink 
                      ? "text-[#7c5d6c] hover:text-[#4c2d3a] hover:bg-[#fff5f7]" 
                      : isYellow 
                        ? "text-[#576575] hover:text-[#0d233a] hover:bg-[#fffdf2]" 
                        : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100")
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 3x3 (PC) / 2x3 (Mobile) grid layout for all categories */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-10"
        >
          <AnimatePresence mode="popLayout">
            {visibleImages.map(img => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className="group cursor-zoom-in"
              >
                <div className={`aspect-[4/3] rounded-xl overflow-hidden mb-4 relative shadow-sm hover:shadow transition-all group-hover:shadow-md ${
                  isPink ? "bg-rose-50/10 border border-[#f2ccd7]/30" : isYellow ? "bg-amber-50/10 border border-[#e6dfc3]/30" : "bg-neutral-100"
                }`}>
                  <img src={optimizeCloudinaryUrl(img.url)} alt={img.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
                <span className={`${
                  isPink ? "text-rose-500" : isYellow ? "text-amber-600" : "text-amber-600"
                } text-[10px] font-bold uppercase tracking-wider mb-2 block font-mono`}>{img.category}</span>
                <h4 className={`font-extrabold text-sm leading-tight line-clamp-1 ${
                  isPink ? "text-[#4c2d3a]" : isYellow ? "text-[#0d233a]" : "text-neutral-950"
                }`}>{img.name}</h4>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View More Trigger Button */}
        {(filter === "대표" ? galleryItems.length > visibleImages.length : filteredImages.length > limit) && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowMoreModal(true)}
              className={`px-8 py-3.5 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center gap-2 border ${
                isPink 
                  ? "bg-rose-500 hover:bg-rose-600 text-white border-rose-500" 
                  : isYellow 
                    ? "bg-[#0d233a] hover:bg-[#163554] text-white border-[#0d233a]" 
                    : "bg-neutral-950 hover:bg-neutral-900 text-white border-neutral-900"
              }`}
            >
              {filter === "대표"
                ? `+ 전체 사진 더보기 (전체 ${galleryItems.length}개 보기)`
                : `+ ${filter} 사진 더보기 (${filteredImages.length}개 전체보기)`}
            </button>
          </div>
        )}
      </div>

      {/* Premium All Images Modal Viewer (더보기) */}
      <AnimatePresence>
        {showMoreModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMoreModal(false)}
            className="fixed inset-0 z-[105] flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white border rounded-3xl w-full max-w-5xl overflow-hidden relative my-auto flex flex-col max-h-[85vh] sm:max-h-[80vh] ${
                isPink 
                  ? "border-[#f2ccd7]/50 shadow-[0_20px_50px_rgba(191,62,103,0.15)]" 
                  : isYellow 
                    ? "border-[#e6dfc3]/50 shadow-[0_20px_50px_rgba(13,35,58,0.15)]" 
                    : "border-neutral-800 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
              }`}
            >
              {/* Modal Header */}
              <div className={`p-6 border-b flex justify-between items-center shrink-0 relative overflow-hidden ${
                isPink 
                  ? "border-[#f2ccd7]/15 bg-gradient-to-r from-neutral-950 via-[#271018] to-neutral-950" 
                  : isYellow 
                    ? "border-[#e6dfc3]/15 bg-gradient-to-r from-[#0d233a] via-[#163554] to-[#0d233a]" 
                    : "border-neutral-900 bg-neutral-950"
              }`}>
                {/* Glowing decorative gradient accent overlay */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${
                  isPink 
                    ? "from-[#f25f8a] via-amber-400 to-[#f25f8a]" 
                    : isYellow 
                      ? "from-amber-600 via-amber-400 to-amber-600" 
                      : "from-amber-400 via-neutral-700 to-amber-400"
                }`}></div>
                <div className="relative z-10">
                  <span className={`inline-block px-2.5 py-0.5 rounded text-white text-[9px] font-black uppercase tracking-wider mb-1 shadow-sm bg-gradient-to-r ${
                    isPink 
                      ? "from-[#f25f8a] to-amber-500" 
                      : isYellow 
                        ? "from-amber-600 to-amber-400" 
                        : "from-amber-500 to-amber-400"
                  }`}>
                    {filter === "대표" ? "120PIE PORTFOLIO" : `${filter.toUpperCase()} GALLERY`}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    {filter === "대표" ? (
                      <>대표 이미지 및 전체 갤러리</>
                    ) : (
                      <>
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${
                          isPink ? "from-[#f25f8a] to-amber-400" : isYellow ? "from-amber-400 to-amber-200" : "from-amber-400 to-amber-200"
                        }`}>
                          {filter}
                        </span>{" "}
                        갤러리 전체 사진
                      </>
                    )}
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono">
                      {modalImages.length}
                    </span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowMoreModal(false)}
                  className="relative z-10 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-full p-2.5 transition-all hover:rotate-90 duration-300 cursor-pointer shadow-inner"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Scroll Area Grid */}
              <div className={`p-6 sm:p-8 overflow-y-auto flex-1 menu-modal-scroll max-h-[60vh] ${
                isPink ? "bg-[#fffbfb]" : isYellow ? "bg-[#fffdf2]" : "bg-neutral-900"
              }`}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  {modalImages.map(img => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className={`rounded-2xl overflow-hidden border shadow-sm transition-all cursor-zoom-in group ${
                        isPink 
                          ? "bg-white border-[#f2ccd7]/35 hover:border-[#f25f8a]/50 hover:shadow-md" 
                          : isYellow 
                            ? "bg-white border-[#e6dfc3]/35 hover:border-[#0d233a]/50 hover:shadow-md" 
                            : "bg-neutral-800 border-neutral-700 hover:border-amber-400"
                      }`}
                    >
                      <div className={`aspect-[4/3] overflow-hidden relative ${isPink ? "bg-[#fffbfb]" : isYellow ? "bg-[#fffdf2]" : "bg-neutral-950"}`}>
                        <img src={img.url} alt={img.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-550" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
                      </div>
                      <div className={`p-4 ${isPink || isYellow ? "bg-white" : "bg-neutral-800"}`}>
                        <span className={`${
                          isPink ? "text-rose-500" : isYellow ? "text-amber-600" : "text-amber-400"
                        } text-[10px] font-extrabold uppercase tracking-wider block mb-1 font-mono`}>{img.category}</span>
                        <h4 className={`font-extrabold text-xs leading-snug line-clamp-1 ${
                          isPink ? "text-[#735965]" : isYellow ? "text-[#0d233a]" : "text-white"
                        }`}>{img.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`p-4 sm:p-5 border-t text-center shrink-0 flex items-center justify-between gap-4 ${
                isPink 
                  ? "bg-white border-[#f2ccd7]/30 text-[#735965]" 
                  : isYellow 
                    ? "bg-white border-[#e6dfc3]/30 text-[#576575]" 
                    : "bg-neutral-950 border-neutral-800 text-neutral-400"
              }`}>
                <span className="text-[10px] font-bold">
                  총 {modalImages.length}개의 실제 도입 이미지 및 연출 컷이 등록되어 있습니다.
                </span>
                <button
                  onClick={() => setShowMoreModal(false)}
                  className={`px-6 py-2 border font-extrabold text-xs rounded-xl transition-all shadow-sm hover:scale-[1.01] active:scale-95 cursor-pointer ${
                    isPink 
                      ? "bg-white border-[#f2ccd7] hover:border-[#f25f8a] text-rose-500 hover:bg-[#fff9fb]" 
                      : isYellow 
                        ? "bg-white border-[#e6dfc3] hover:border-[#0d233a] text-[#0d233a] hover:bg-[#fffdf2]" 
                        : "bg-neutral-950 border-neutral-800 hover:border-amber-400 text-white"
                  }`}
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Original Image Modal Viewer */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-neutral-950/90 backdrop-blur-md cursor-zoom-out select-none"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 text-white/70 hover:text-white bg-neutral-900/60 hover:bg-neutral-900/80 rounded-full p-2.5 z-[130] transition-colors border border-white/10"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-fit max-w-[95vw] sm:max-w-4xl max-h-[85dvh] flex flex-col rounded-2xl overflow-hidden border shadow-[0_25px_60px_rgba(0,0,0,0.2)] cursor-default animate-scaleUp ${
                isPink 
                  ? "bg-[#fffbfb] border-[#f2ccd7]/60 shadow-[0_25px_60px_rgba(191,62,103,0.2)]" 
                  : isYellow 
                    ? "bg-[#fffdf2] border-[#e6dfc3]/60 shadow-[0_25px_60px_rgba(13,35,58,0.2)]" 
                    : "bg-neutral-900 border-neutral-800"
              }`}
            >
              <img
                src={optimizeCloudinaryUrl(selectedImage.url)}
                alt={selectedImage.name}
                className="max-w-full max-h-[68dvh] sm:max-h-[70vh] object-contain block w-auto h-auto mx-auto"
              />
              <div className={`w-full px-6 py-4 border-t text-left flex flex-col gap-1 shrink-0 ${
                isPink 
                  ? "bg-[#fff1f5] border-[#f2ccd7]/40 text-[#735965]" 
                  : isYellow 
                    ? "bg-[#fff9e6] border-[#e6dfc3]/40 text-[#0d233a]" 
                    : "bg-neutral-950 border-neutral-800 text-white"
              }`}>
                <span className={`${
                  isPink ? "text-rose-500" : isYellow ? "text-amber-600" : "text-amber-400"
                } font-extrabold tracking-widest text-[10px] uppercase font-mono`}>{selectedImage.category}</span>
                <h3 className={`text-sm sm:text-base font-black ${
                  isPink ? "text-[#735965]" : isYellow ? "text-[#0d233a]" : "text-white"
                }`}>{selectedImage.name}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function HomeV3({ variant = "v3" }: { variant?: "v3" | "v4" | "v5" }) {
  const isPinkVariant = variant === "v4";
  const isYellowVariant = variant === "v5";

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Dynamic Header Variables
  const headerBgClass = isYellowVariant
    ? isScrolled
      ? "bg-[#fffdf2]/70 border-b border-[#e6dfc3]/50 shadow-md backdrop-blur-md"
      : "bg-[#fffdf2]/90 border-b border-[#e6dfc3]/60 shadow-[#0d233a]/[0.02] backdrop-blur-md"
    : isPinkVariant
      ? isScrolled
        ? "bg-[#0f0a0c]/70 border-b border-[#f2ccd7]/10 shadow-lg backdrop-blur-md"
        : "bg-[#0f0a0c]/90 border-b border-[#f2ccd7]/15 shadow-rose-950/20 backdrop-blur-md"
      : isScrolled
        ? "bg-neutral-950/75 border-b border-neutral-900/40 shadow-xl backdrop-blur-md"
        : "bg-neutral-950/95 border-b border-neutral-900/60 backdrop-blur-md";

  const logoImgSrc = isPinkVariant
    ? "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779846449/logo_120pie_coffee3_jzgtyi.png"
    : isYellowVariant
      ? "/logo_yellow_blue.png"
      : "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781183166/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_cnfrik.png";

  const logoTargetUrl = isPinkVariant ? "/pink" : isYellowVariant ? "/" : "/v3";

  const navLinkTextClass = isYellowVariant
    ? "text-[#576575] hover:text-[#0d233a]"
    : isPinkVariant
      ? "text-neutral-400 hover:text-rose-400"
      : "text-neutral-400 hover:text-amber-400";

  const switcherWrapperClass = isYellowVariant
    ? "border-[#e6dfc3] bg-neutral-900/5"
    : isPinkVariant
      ? "border-[#f2ccd7]/20 bg-neutral-900/60"
      : "border-neutral-800 bg-neutral-900/60";

  const switcherBtnYellowClass = isYellowVariant
    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm"
    : "text-neutral-400 hover:text-white";

  const switcherBtnBlackClass = (!isPinkVariant && !isYellowVariant)
    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm"
    : isYellowVariant
      ? "text-neutral-500 hover:text-[#0d233a]"
      : "text-neutral-400 hover:text-amber-400";

  const portalBtnClass = isYellowVariant
    ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
    : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all";

  const mobileNavDrawerBgClass = isYellowVariant
    ? "bg-[#fffdf2]/98 border-t border-[#e6dfc3]/60"
    : isPinkVariant
      ? "bg-[#0f0a0c]/98 border-t border-[#f2ccd7]/15"
      : "bg-neutral-950/98 border-t border-neutral-900/60";

  const mobileNavLinkClass = isYellowVariant
    ? "bg-white border border-[#e6dfc3]/60 text-[#576575] hover:text-[#0d233a] hover:bg-[#fffdf4]"
    : isPinkVariant
      ? "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400 hover:text-rose-400"
      : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-400";

  // 수익성 시뮬레이션 상태 변수
  const [quantity, setQuantity] = useState<number>(20);
  const [price, setPrice] = useState<number>(4500);
  const [days, setDays] = useState<number>(26);

  // 실시간 계산 결과
  const monthlySales = quantity * price * days;
  const monthlyQuantity = quantity * days;

  // FAQ 아코디언 상태
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // 모달 팝업 상태
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedAdoptionStep, setSelectedAdoptionStep] = useState<string | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [simulatorVideoExpanded, setSimulatorVideoExpanded] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileHeroVideoRef = useRef<HTMLVideoElement>(null);

  // 갤러리 필터 상태
  const [galleryFilter, setGalleryFilter] = useState<string>("대표");

  // 대표메뉴 카달로그 필터/검색 상태
  const [activeTab, setActiveTab] = useState<string>("120겹파이");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [subFilter, setSubFilter] = useState<string>("all");

  // Popup & Floating states for premium integration
  const [popupSettings, setPopupSettings] = useState<any>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [floatingSettings, setFloatingSettings] = useState<any>(null);
  const [floatingOpen, setFloatingOpen] = useState<boolean>(false);
  const popupClosedInSessionRef = useRef<boolean>(false);

  // 컨택트 폼 입력 상태
  const [formData, setFormData] = useState<InquiryFormData>({
    name: "",
    phone: "",
    storeType: "샵인샵 도입",
    existingStoreName: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // 모바일 하드웨어 뒤로가기 버튼 대응 (모달 닫기)
  useEffect(() => {
    const isAnyModalOpen = selectedMenu !== null || selectedAdoptionStep !== null || inquiryModalOpen;

    if (isAnyModalOpen) {
      window.location.hash = "modal";
    } else {
      if (window.location.hash === "#modal") {
        window.history.back();
      }
    }

    const handleHashChange = () => {
      if (window.location.hash !== "#modal") {
        setSelectedMenu(null);
        setSelectedAdoptionStep(null);
        setInquiryModalOpen(false);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [selectedMenu, selectedAdoptionStep, inquiryModalOpen]);

  // Track menu views when selectedMenu is set
  useEffect(() => {
    if (selectedMenu) {
      const referrer = typeof document !== "undefined" ? document.referrer : "";
      fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "menu_view",
          path: window.location.pathname,
          menuName: selectedMenu,
          referrer: referrer || "direct",
        }),
      }).catch((err) => console.error("MenuView tracking failed:", err));
    }
  }, [selectedMenu]);

  useEffect(() => {
    const video = mobileHeroVideoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, [isPinkVariant]);

  // Convex Hooks
  const convexPopup = useQuery(api.popups.get, { targetPage: "landing" });
  const convexFloating = useQuery(api.floatings.get);
  const addInquiry = useMutation(api.inquiries.add);
  const sendSmsAction = useAction(api.aligo.sendSms);

  // Dynamic Popup & Floating data loading synced with Convex (fallback to localStorage if not yet loaded)
  useEffect(() => {
    // Check if closed in current tab session or closed for 7 days
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const isTestPopup = urlParams.get("test_popup") === "true";
      const isResetPopup = urlParams.get("reset_popup") === "true";

      if (isResetPopup) {
        localStorage.removeItem("120_popup_closed_until");
        localStorage.removeItem("120_popup_closed_title");
        sessionStorage.removeItem("120_popup_closed_session");
        popupClosedInSessionRef.current = false;
      }

      if (isTestPopup) {
        // Bypass storage block checks
      } else {
        const closedTitle = localStorage.getItem("120_popup_closed_title");
        let activeTitle = "";
        if (convexPopup !== undefined) {
          activeTitle = convexPopup?.title || "";
        } else {
          const stored = localStorage.getItem("120_popups");
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              activeTitle = parsed?.title || "";
            } catch (e) {}
          }
        }
        
        if (activeTitle && closedTitle && activeTitle !== closedTitle) {
          localStorage.removeItem("120_popup_closed_until");
          localStorage.removeItem("120_popup_closed_title");
          sessionStorage.removeItem("120_popup_closed_session");
          popupClosedInSessionRef.current = false;
        } else {
          const closedInSession = sessionStorage.getItem("120_popup_closed_session");
          if (closedInSession === "true") {
            setShowPopup(false);
            return;
          }
          
          const closedUntil = localStorage.getItem("120_popup_closed_until");
          const isExpired = !closedUntil || Date.now() > parseInt(closedUntil, 10);
          if (!isExpired) {
            setShowPopup(false);
            return;
          }
        }
      }
    }

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("test_popup") !== "true") {
        if (popupClosedInSessionRef.current) return;
      }
    } else {
      if (popupClosedInSessionRef.current) return;
    }

    if (convexPopup !== undefined) {
      setPopupSettings(convexPopup);
      try {
        localStorage.setItem("120_popups", JSON.stringify(convexPopup));
      } catch (e) {
        console.warn(e);
      }
      if (convexPopup && convexPopup.isActive) {
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
    } else {
      if (typeof window !== "undefined") {
        const storedPop = localStorage.getItem("120_popups");
        if (storedPop) {
          try {
            const parsed = JSON.parse(storedPop);
            setPopupSettings(parsed);
          } catch (e) {}
        }
      }
      setShowPopup(false);
    }
  }, [convexPopup]);

  useEffect(() => {
    if (convexFloating) {
      setFloatingSettings(convexFloating);
    } else {
      if (typeof window !== "undefined") {
        const storedFloat = localStorage.getItem("120_floatings");
        if (storedFloat) {
          try {
            setFloatingSettings(JSON.parse(storedFloat));
          } catch (e) {}
        }
      }
    }
  }, [convexFloating]);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "phone" ? formatPhoneNumber(value) : value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("성함과 연락처를 입력해 주세요.");
      return;
    }
    
    try {
      await addInquiry({
        name: formData.name,
        phone: formData.phone,
        storeType: formData.storeType,
        existingStoreName: formData.existingStoreName || "",
        message: formData.message || "",
        regDate: new Date().toISOString().split("T")[0]
      });
      triggerConsultationSms(sendSmsAction, formData.name, formData.phone, formData.storeType);
      setFormSubmitted(true);
    } catch (err) {
      console.error("Failed to submit inquiry to Convex", err);
      const stored = localStorage.getItem("120_inquiries");
      const list = stored ? JSON.parse(stored) : [];
      const newInq = {
        id: "inq-" + Date.now(),
        ...formData,
        regDate: new Date().toISOString().split("T")[0]
      };
      localStorage.setItem("120_inquiries", JSON.stringify([...list, newInq]));
      triggerConsultationSms(sendSmsAction, formData.name, formData.phone, formData.storeType);
      setFormSubmitted(true);
    }
  };

  // 모션 페이드인 애니메이션 프리셋
  const fadeIn = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6 }
  };

  // Sub-filters lists
  const subFilters: Record<string, { label: string; id: string }[]> = {
    "120겹파이": [
      { label: "전체 메뉴", id: "all" },
      { label: "ORIGINAL", id: "original" },
      { label: "MEAT", id: "meat" },
      { label: "PIZZA", id: "pizza" }
    ],
    "에그120": [
      { label: "전체 메뉴", id: "all" },
      { label: "짭짤 & 고소", id: "savory" },
      { label: "달콤 & 디저트", id: "sweet" }
    ],
    "기타": [
      { label: "전체 메뉴", id: "all" },
      { label: "찹쌀 츄러스", id: "churros" },
      { label: "매콤 떡볶이", id: "tteokbokki" },
      { label: "핫도그", id: "hotdog" }
    ],
    "coffee120": [
      { label: "전체 메뉴", id: "all" },
      { label: "커피 & 콜드브루", id: "coffee" },
      { label: "라떼 (Non-Coffee)", id: "latte" },
      { label: "스무디 & 쉐이크", id: "smoothie" },
      { label: "에이드 & 주스", id: "juice" }
    ],
    "스콘/머핀/쿠키": [
      { label: "전체 메뉴", id: "all" },
      { label: "수제 스콘", id: "scone" },
      { label: "촉촉 머핀", id: "muffin" },
      { label: "바삭 쿠키", id: "cookie" }
    ],
    "크로플/마카롱": [
      { label: "전체 메뉴", id: "all" },
      { label: "크로플", id: "croffle" },
      { label: "마카롱", id: "macaron" }
    ]
  };

  const getFilteredItems = (): MenuItem[] => {
    const currentCategory = MENU_DATA[activeTab];
    let items = currentCategory?.items || [];
    
    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query)
      );
    }
    
    // Sub-category filter
    if (subFilter !== "all") {
      if (activeTab === "120겹파이") {
        if (subFilter === "original") {
          items = items.filter(item => item.badge === "ORIGINAL");
        } else if (subFilter === "meat") {
          items = items.filter(item => item.badge === "MEAT");
        } else if (subFilter === "pizza") {
          items = items.filter(item => item.badge === "PIZZA");
        }
      } else if (activeTab === "에그120") {
        if (subFilter === "savory") {
          items = items.filter(item => ["오리지널 계란빵", "베이컨 계란빵", "통모짜 계란빵", "로제미트 계란빵"].includes(item.name));
        } else if (subFilter === "sweet") {
          items = items.filter(item => ["커스터드 계란빵", "콘버터 계란빵", "슈크림 계란빵", "팥 계란빵"].includes(item.name));
        }
      } else if (activeTab === "기타") {
        if (subFilter === "churros") {
          items = items.filter(item => item.name.includes("츄러스"));
        } else if (subFilter === "tteokbokki") {
          items = items.filter(item => item.name.includes("떡볶이"));
        } else if (subFilter === "hotdog") {
          items = items.filter(item => item.name.includes("핫도그"));
        }
      } else if (activeTab === "coffee120") {
        if (subFilter === "coffee") {
          items = items.filter(item => 
            ["아메리카노", "카페라떼", "카푸치노", "바닐라라떼", "카라멜마끼아또", "카페모카", "연유카페라떼", "콜드브루", "콜드브루라떼", "연유 콜드브루"].includes(item.name)
          );
        } else if (subFilter === "latte") {
          items = items.filter(item => 
            ["흑당라떼", "곡물라떼", "고구마라떼", "딸기라떼", "토피넛라떼", "녹차라떼", "달고나라떼", "피스타치오라떼", "미숫가루", "초당옥수수라떼"].includes(item.name)
          );
        } else if (subFilter === "smoothie") {
          items = items.filter(item => 
            item.name.includes("스무디") || item.name.includes("쉐이크") || item.name.includes("빙수")
          );
        } else if (subFilter === "juice") {
          items = items.filter(item => 
            item.name.includes("에이드") || item.name.includes("주스") || item.name === "복숭아 아이스티" || item.name === "제주한라봉"
          );
        }
      } else if (activeTab === "스콘/머핀/쿠키") {
        if (subFilter === "scone") {
          items = items.filter(item => item.name.includes("스콘"));
        } else if (subFilter === "muffin") {
          items = items.filter(item => item.name.includes("머핀"));
        } else if (subFilter === "cookie") {
          items = items.filter(item => item.name.includes("쿠키"));
        }
      } else if (activeTab === "크로플/마카롱") {
        if (subFilter === "croffle") {
          items = items.filter(item => item.name.includes("크로플"));
        } else if (subFilter === "macaron") {
          items = items.filter(item => item.name.includes("마카롱"));
        }
      }
    }
    
    return items;
  };

  const filteredItems = getFilteredItems();

  // Theme Classes Map for Representative Menu Catalog
  const tabWrapperClass = isPinkVariant ? "border-[#f2ccd7]/20 bg-[#4c2d3a]/5" : isYellowVariant ? "border-[#e6dfc3] bg-[#0d233a]/5" : "border-neutral-800 bg-neutral-900/50";
  const activeTabClass = isPinkVariant ? "bg-rose-500 text-white shadow-[0_4px_20px_rgba(244,63,94,0.3)]" : isYellowVariant ? "bg-amber-400 text-neutral-950 font-black shadow-sm" : "bg-amber-400 text-neutral-950 font-black shadow-sm";
  const inactiveTabClass = isPinkVariant ? "text-[#7c5d6c] hover:text-[#4c2d3a]" : isYellowVariant ? "text-[#576575] hover:text-[#0d233a]" : "text-neutral-450 hover:text-white";
  
  const inputClass = isPinkVariant ? "bg-white border-[#f2ccd7] focus:border-rose-500 text-[#4c2d3a] placeholder-[#7c5d6c]/60" : isYellowVariant ? "bg-white border-[#e6dfc3] focus:border-amber-500 text-[#0d233a] placeholder-neutral-450" : "bg-[#140e11] border-neutral-800 focus:border-amber-500 text-white placeholder-neutral-600";
  const tagClass = isPinkVariant ? "bg-white border-[#f2ccd7]/50 text-[#7c5d6c] hover:text-[#4c2d3a] hover:border-[#f2ccd7]" : isYellowVariant ? "bg-white border-[#e6dfc3] text-neutral-500 hover:text-[#0d233a] hover:border-[#0d233a]" : "bg-neutral-900 border-neutral-800 text-neutral-450 hover:text-white hover:border-neutral-700";
  const activeTagClass = isPinkVariant ? "bg-rose-500/10 border-rose-500/60 text-rose-600 font-extrabold" : isYellowVariant ? "bg-amber-400/10 border-amber-400 text-amber-800 font-extrabold" : "bg-amber-400/10 border-amber-400 text-amber-400 font-extrabold";
  
  const cardClass = isPinkVariant ? "bg-white border-[#f2ccd7]/60 hover:border-rose-500 shadow-[0_4px_16px_rgba(115,89,101,0.03)]" : isYellowVariant ? "bg-white border-[#e6dfc3] hover:border-amber-400 shadow-[0_4px_16px_rgba(13,35,58,0.03)]" : "bg-[#140e11] border-neutral-800 hover:border-amber-400/60 shadow-[0_4px_16px_rgba(0,0,0,0.2)]";
  const cardTitleClass = isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white";
  const cardDescClass = isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400";
  const imgContainerBg = isPinkVariant ? "bg-white" : isYellowVariant ? "bg-white" : "bg-neutral-900";

  return (
    <div id={isPinkVariant ? "landing-v4" : isYellowVariant ? "landing-v5" : "landing-v3"} className={`flex flex-col w-full scroll-smooth overflow-x-clip font-sans antialiased transition-colors duration-300 ${
      isPinkVariant 
        ? "bg-[#fff9fb] text-neutral-900" 
        : isYellowVariant 
          ? "bg-[#fffdf2] text-[#0d233a]" 
          : "bg-[#0a0a0a] text-neutral-200"
    }`}>

      {/* ------------------------------------------------------------- */}
      {/* HEADER (Sticky Minimal Tri-Tone) */}
      {/* ------------------------------------------------------------- */}
      <header className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${headerBgClass}`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 gap-2.5 sm:gap-4 ${
          isScrolled 
            ? "min-h-[50px] sm:min-h-[60px] lg:min-h-[68px]" 
            : "min-h-[60px] sm:min-h-[80px] lg:min-h-[94px]"
        }`}>
          <div className="shrink-0 py-2">
            <Link className="flex items-center group shrink-0" href={logoTargetUrl} aria-label="120pie 홈으로 이동">
              <img
                src={logoImgSrc}
                alt="120pie & coffee"
                className={`w-auto object-contain group-hover:scale-102 transition-all duration-300 ${
                  isScrolled
                    ? "h-4 sm:h-5 lg:h-6"
                    : "h-5 sm:h-7 lg:h-8"
                }`}
              />
            </Link>
          </div>

          <nav className={`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 ${navLinkTextClass}`}>
            <Link href={isYellowVariant ? "/menu?theme=yellow" : "/menu?theme=pink"} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={isYellowVariant ? "/stores?theme=yellow" : "/stores?theme=pink"} className="hover:text-amber-400 transition-colors shrink-0">
              가맹점 현황
            </Link>
            <Link href={isYellowVariant ? "/costs?theme=yellow" : "/costs?theme=pink"} className="hover:text-amber-400 transition-colors shrink-0">
              비용 안내
            </Link>
            <Link href={isYellowVariant ? "/franchise?theme=yellow" : "/franchise?theme=pink"} className="hover:text-amber-400 transition-colors shrink-0">
              창업 안내
            </Link>
            <Link href={isYellowVariant ? "/faq?theme=yellow" : "/faq?theme=pink"} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={`flex items-center rounded-full border p-0.5 text-[10px] font-black ${switcherWrapperClass}`}>
              <Link href="/" className={`rounded-full px-2.5 py-1 transition-colors ${switcherBtnYellowClass}`}>
                옐로
              </Link>
              <Link href="/v3" className={`rounded-full px-2.5 py-1 transition-colors ${switcherBtnBlackClass}`}>
                블랙
              </Link>
            </div>
            <Link className={`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold ${portalBtnClass}`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            <button type="button" onClick={() => setInquiryModalOpen(true)} className={`pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black hover:scale-[1.02] transition-all border-0 cursor-pointer ${
              isPinkVariant 
                ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.2)]" 
                : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
            }`}>
              상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
            </button>
            <button
              type="button"
              className={`pink-primary-button lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-xs font-black border-0 cursor-pointer ${
                isPinkVariant 
                  ? "bg-rose-500 text-white hover:bg-rose-600" 
                  : "bg-amber-400 text-neutral-950 hover:bg-amber-300"
              }`}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-landing-nav"
              onClick={() => setMobileNavOpen(open => !open)}
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 ${mobileNavDrawerBgClass}`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={isYellowVariant ? "/menu?theme=yellow" : "/menu?theme=pink"} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                메뉴
              </Link>
              <Link href={isYellowVariant ? "/stores?theme=yellow" : "/stores?theme=pink"} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                가맹점 현황
              </Link>
              <Link href={isYellowVariant ? "/costs?theme=yellow" : "/costs?theme=pink"} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                비용 안내
              </Link>
              <Link href={isYellowVariant ? "/franchise?theme=yellow" : "/franchise?theme=pink"} onClick={() => setMobileNavOpen(false)} className={`rounded-xl px-4 py-3 transition-colors ${mobileNavLinkClass}`}>
                창업 안내
              </Link>
              <Link href={isYellowVariant ? "/faq?theme=yellow" : "/faq?theme=pink"} onClick={() => setMobileNavOpen(false)} className={`col-span-2 rounded-xl px-4 py-3 transition-colors text-center ${mobileNavLinkClass}`}>
                FAQ
              </Link>
            </div>
            <div className="flex gap-2 mt-3 w-full">
              <Link
                href="/portal"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileNavOpen(false)}
                className={`flex-1 flex items-center justify-center rounded-xl px-4 py-3.5 text-xs sm:text-sm font-black border transition-all ${portalBtnClass}`}
              >
                점주전용
              </Link>
              <button
                type="button"
                onClick={() => { setMobileNavOpen(false); setInquiryModalOpen(true); }}
                className={`pink-primary-button flex-1 flex items-center justify-center rounded-xl px-4 py-3.5 text-xs sm:text-sm font-black border-0 cursor-pointer ${
                  isPinkVariant 
                    ? "bg-rose-500 text-white hover:bg-rose-600 shadow-[0_4px_16px_rgba(244,63,94,0.25)]" 
                    : "bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-[0_4px_16px_rgba(251,191,36,0.25)]"
                }`}
              >
                상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main id="top" className="relative">

        {/* ------------------------------------------------------------- */}
        {/* HERO SECTION [RICH BLACK & GOLDEN YELLOW - HIGH IMPACT] */}
        {/* ------------------------------------------------------------- */}
        <section className="relative py-24 md:py-32 bg-neutral-950 text-white overflow-hidden">

          {/* Tonal gold ambient glow background lights */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none z-0"></div>
          <div className="absolute bottom-0 left-[5%] w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">

              {/* Left Copy Panel */}
              <motion.div
                className="lg:col-span-7 flex flex-col gap-6"
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div>
                  <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-400 mb-2 backdrop-blur-sm shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                    <Sparkles size={14} className="mr-2" /> 120겹파이와 함께하는 카페 디저트 제안
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white">
                  커피 손님은 그대로,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 drop-shadow-[0_0_35px_rgba(251,191,36,0.3)]">
                    디저트 손님은 새롭게.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-neutral-400 font-medium leading-relaxed max-w-xl">
                  간판을 바꾸지 않아도, 작은 공간이면 충분합니다.<br />
                  우리 매장이 동네의 새로운 파이 핫플로 달라집니다.
                </p>

                <motion.div
                  className="lg:hidden w-[calc(100%_-_1rem)] max-w-sm mx-auto aspect-[3/4] bg-neutral-900 rounded-3xl overflow-hidden relative flex items-end shadow-2xl"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.12 }}
                >
                  <video
                    ref={mobileHeroVideoRef}
                    src={isPinkVariant
                      ? "https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183199/120pie_%EC%98%81%EC%83%81_7_ijgrwj.mp4"
                      : "https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183199/120pie_%EC%98%81%EC%83%81_7_ijgrwj.mp4"}
                    poster={isPinkVariant
                      ? "https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183199/120pie_%EC%98%81%EC%83%81_7_ijgrwj.mp4"
                      : "https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183199/120pie_%EC%98%81%EC%83%81_7_ijgrwj.mp4"}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label="모바일 120겹파이 히어로 영상"
                    className="absolute inset-0 block w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/45 via-transparent to-transparent"></div>
                  <h3 className="hero-video-caption relative z-10 m-6 text-base font-black text-white tracking-tight drop-shadow-md">
                    매장의 대표 메뉴가 될 120겹 파이
                  </h3>
                </motion.div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
                  <button type="button" onClick={() => setInquiryModalOpen(true)} className={`pink-primary-button w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-black rounded-xl hover:scale-[1.02] transition-all border-0 cursor-pointer ${
                    isPinkVariant 
                      ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_20px_rgba(244,63,94,0.3)]" 
                      : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_20px_rgba(251,191,36,0.3)]"
                  }`}>
                    리모델링 견적 문의 <ArrowRight size={18} className="ml-2" />
                  </button>
                  <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-neutral-900 border border-neutral-800 text-white font-extrabold rounded-xl hover:bg-neutral-800 transition-colors" href="#simulator">
                    내 매장 수익 시뮬레이션
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-2 w-full max-w-sm mx-auto sm:flex sm:flex-wrap sm:max-w-none sm:mx-0">
                  <span className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-[11px] sm:text-xs font-bold text-neutral-350 text-center whitespace-nowrap">#1,000만원대 소자본 전환</span>
                  <span className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-[11px] sm:text-xs font-bold text-neutral-350 text-center whitespace-nowrap">#3분 굽기 초간편 조리</span>
                  <span className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-[11px] sm:text-xs font-bold text-neutral-350 text-center whitespace-nowrap">#폐기율 0% 콜드 생지</span>
                  <span className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-[11px] sm:text-xs font-bold text-neutral-350 text-center whitespace-nowrap">#홀·포장·배달 올라운드</span>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-neutral-900/80 pt-8 mt-6">
                  <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-xl flex flex-col justify-center text-center">
                    <strong className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">3분</strong>
                    <span className="text-[10px] sm:text-xs text-neutral-500 font-extrabold">내외 초간편 조리</span>
                  </div>
                  <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-xl flex flex-col justify-center text-center">
                    <strong className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">287+</strong>
                    <span className="text-[10px] sm:text-xs text-neutral-500 font-extrabold">전국 가맹점 경험</span>
                  </div>
                  <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-xl flex flex-col justify-center text-center">
                    <strong className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">300%</strong>
                    <span className="text-[10px] sm:text-xs text-neutral-500 font-extrabold">최고 매출 증대율</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Visual Image (Glassmorphic Card & Crisp Dough) */}
              <motion.div
                className="hidden lg:flex lg:col-span-5 aspect-[3/4] lg:aspect-auto bg-neutral-900 rounded-3xl overflow-hidden relative min-h-[520px] items-end shadow-2xl group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <video
                  src={isPinkVariant
                    ? "https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183199/120pie_%EC%98%81%EC%83%81_7_ijgrwj.mp4"
                    : "https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183199/120pie_%EC%98%81%EC%83%81_7_ijgrwj.mp4"}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="120겹파이 히어로 영상"
                  className="absolute inset-0 block w-full h-full object-cover opacity-70 group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/55 via-transparent to-transparent"></div>
                <h3 className="hero-video-caption relative z-10 m-7 text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-md">
                  매장의 대표 메뉴가 될 120겹 파이
                </h3>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* WHY SECTION [RICH BLACK THEME & DYNAMIC GOLD BENTO GRID] */}
        {/* ------------------------------------------------------------- */}
        <section className={`py-24 border-b relative transition-colors duration-300 ${
          isPinkVariant 
            ? "bg-[#fff9fb] text-[#735965] border-[#f2ccd7]/40" 
            : isYellowVariant 
              ? "bg-[#fffdf2] text-[#0d233a] border-[#e6dfc3]/40" 
              : "bg-neutral-950 text-white border-neutral-900/80"
        }`} id="why">
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Why 120pie Hybrid</span>
              <h2 className={`text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight ${
                isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
              }`}>
                지금의 카페에 자연스럽게 더해지는,<br />
                기분 좋은 <span className="text-amber-400">디저트 메뉴</span>를 제안합니다.
              </h2>
              <p className={`text-xs sm:text-sm font-bold leading-relaxed max-w-xl ${
                isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
              }`}>
                120겹 파이와 에그120을 매장과 배달 메뉴에 편안하게 더해, 고객에게는 새로운 선택을, 사장님께는 든든한 매출 기회를 전합니다.
              </p>
            </motion.div>

            {/* Bento Grid: 4 Alternating Pairs (Total 8 Cards: 4 Text Cards + 4 Video Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

              {/* PAIR 1 (Set Menu): Text (7 cols) */}
              <motion.article
                className={`md:col-span-7 p-8 rounded-2xl flex flex-col justify-between transition-colors bento-text-card border ${
                  isPinkVariant 
                    ? "bg-[#fff5f7] border-[#f2ccd7]/80 hover:border-pink-400/40" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3]/80 hover:border-amber-400/40" 
                      : "bg-neutral-900/60 border-neutral-850 hover:border-amber-400/40"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h3 className={`text-xl sm:text-2xl font-black mb-3 ${
                    isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                  }`}>커피와 잘 어울리는 세트 메뉴로 한 잔의 만족을 더합니다</h3>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                  }`}>
                    아메리카노에 120겹 파이 또는 에그120을 함께 제안해 보세요. 고객은 간편하게 디저트를 즐기고, 매장은 자연스럽게 주문 구성을 넓힐 수 있습니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#커피와 좋은 조합</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#간편한 세트 구성</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#새로운 매출 기회</span>
                </div>
              </motion.article>

              {/* PAIR 1 (Set Menu): Video Card (5 cols) */}
              <motion.div
                className={`md:col-span-5 border rounded-2xl overflow-hidden relative shadow-lg aspect-[4/3] w-full self-center ${
                  isPinkVariant 
                    ? "bg-[#fff5f7] border-[#f2ccd7]/80" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3]/80" 
                      : "bg-neutral-900 border-neutral-850"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <video
                  src="https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183394/120pie_%EC%98%81%EC%83%81_3_xqmdny.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="120겹 파이 세트 메뉴 영상"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.2] hover:scale-[1.23] transition-all duration-550 opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  isPinkVariant 
                    ? "from-pink-950/20 via-transparent to-transparent" 
                    : isYellowVariant 
                      ? "from-[#fffdf2]/40 via-transparent to-transparent" 
                      : "from-neutral-950 via-neutral-950/20 to-transparent"
                }`}></div>
              </motion.div>

              {/* PAIR 2 (Shop in Shop): Image Card (5 cols) */}
              <motion.div
                className={`md:col-span-5 border rounded-2xl overflow-hidden relative shadow-lg aspect-[4/3] w-full self-center ${
                  isPinkVariant 
                    ? "bg-[#fff5f7] border-[#f2ccd7]/80" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3]/80" 
                      : "bg-neutral-900 border-neutral-850"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781183595/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%95%A0%ED%94%8C_%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EC%97%B0%EC%B6%9C_bzyzzs.jpg"
                  alt="120겹 파이 크림치즈 애플 블루베리 연출"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-[1.05] transition-all duration-500 opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  isPinkVariant 
                    ? "from-pink-950/20 via-transparent to-transparent" 
                    : isYellowVariant 
                      ? "from-[#fffdf2]/40 via-transparent to-transparent" 
                      : "from-neutral-950 via-neutral-950/20 to-transparent"
                }`}></div>
              </motion.div>

              {/* PAIR 2 (Shop in Shop): Text Card (7 cols) */}
              <motion.article
                className={`md:col-span-7 p-8 rounded-2xl flex flex-col justify-between transition-colors bento-text-card border ${
                  isPinkVariant 
                    ? "bg-[#fff5f7] border-[#f2ccd7]/80 hover:border-pink-400/40" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3]/80 hover:border-amber-400/40" 
                      : "bg-neutral-900/60 border-neutral-850 hover:border-amber-400/40"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h3 className={`text-xl sm:text-2xl font-black mb-3 ${
                    isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                  }`}>지금 매장의 아름다운 분위기 그대로 시작하는 샵인샵</h3>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                  }`}>
                    큰 리모델링 철거 공사나 값비싼 브랜드 간판 전면 교체 없이도, 기존의 소중한 단골 고객과 개인 카페 인테리어 정체성을 온전히 지키며 가볍게 120겹 파이와 에그120을 도입할 수 있습니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#기존 공간 극대화</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#간편한 쇼케이스 셋업</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#듀얼 브랜딩 시너지</span>
                </div>
              </motion.article>

              {/* PAIR 3 (Easy Cooking): Text Card (7 cols) */}
              <motion.article
                className={`md:col-span-7 p-8 rounded-2xl flex flex-col justify-between transition-colors bento-text-card border ${
                  isPinkVariant 
                    ? "bg-[#fff5f7] border-[#f2ccd7]/80 hover:border-pink-400/40" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3]/80 hover:border-amber-400/40" 
                      : "bg-neutral-900/60 border-neutral-850 hover:border-amber-400/40"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h3 className={`text-xl sm:text-2xl font-black mb-3 ${
                    isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                  }`}>누구나 3분이면 완벽한 맛을 재현하는 초간편 시스템</h3>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                  }`}>
                    전문적인 제과 기술이나 주방 설비 가중이 전혀 필요 없습니다. 본사에서 공급받은 냉동 생지를 간편하게 전용 미니 오븐에 넣고 타이머 스위치만 누르면 갓 구워낸 프리미엄 바삭함을 고객에게 즉시 제공합니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#초간편 3분 조리</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#작업 동선 최소화</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#원터치 퀄리티 일관성</span>
                </div>
              </motion.article>

              {/* PAIR 3 (Easy Cooking): Video Card (5 cols) */}
              <motion.div
                className={`md:col-span-5 border rounded-2xl overflow-hidden relative shadow-lg aspect-[4/3] w-full self-center ${
                  isPinkVariant 
                    ? "bg-[#fff5f7] border-[#f2ccd7]/80" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3]/80" 
                      : "bg-neutral-900 border-neutral-850"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781183720/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_yszrts.jpg"
                  alt="120겹 파이 초간편 3분 조리 연출"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-[1.05] transition-all duration-500 opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  isPinkVariant 
                    ? "from-pink-950/20 via-transparent to-transparent" 
                    : isYellowVariant 
                      ? "from-[#fffdf2]/40 via-transparent to-transparent" 
                      : "from-neutral-950 via-neutral-950/20 to-transparent"
                }`}></div>
              </motion.div>

              {/* PAIR 4 (Zero Waste): Video Card (5 cols) */}
              <motion.div
                className={`md:col-span-5 border rounded-2xl overflow-hidden relative shadow-lg aspect-[4/3] w-full self-center ${
                  isPinkVariant 
                    ? "bg-[#fff5f7] border-[#f2ccd7]/80" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3]/80" 
                      : "bg-neutral-900 border-neutral-850"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img
                  src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186392/7c2cce19-579e-4810-9b4d-692bf40cae03_xmarwy.png"
                  alt="에그120 계란빵 조리 및 폐기율 제로 연출"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-[1.05] transition-all duration-550 opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  isPinkVariant 
                    ? "from-pink-950/20 via-transparent to-transparent" 
                    : isYellowVariant 
                      ? "from-[#fffdf2]/40 via-transparent to-transparent" 
                      : "from-neutral-950 via-neutral-950/20 to-transparent"
                }`}></div>
              </motion.div>

              {/* PAIR 4 (Zero Waste): Text Card (7 cols) */}
              <motion.article
                className={`md:col-span-7 p-8 rounded-2xl flex flex-col justify-between transition-colors bento-text-card border ${
                  isPinkVariant 
                    ? "bg-[#fff5f7] border-[#f2ccd7]/80 hover:border-pink-400/40" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3]/80 hover:border-amber-400/40" 
                      : "bg-neutral-900/60 border-neutral-850 hover:border-amber-400/40"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h3 className={`text-xl sm:text-2xl font-black mb-3 ${
                    isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                  }`}>냉동 보관 생지 시스템으로 재고와 폐기율 부담 제로</h3>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                  }`}>
                    그날 아침 구워 당일 반드시 소진해야 하는 일반 상온 제빵 구조와 다릅니다. 본사 냉동 생지를 주문 수량이나 매장 판매 흐름에 맞추어 실시간으로 필요한 만큼만 즉석에서 구워내기 때문에 유통/재고 폐기 손실이 원천적으로 0%에 수렴합니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#냉동 보관 시스템</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#실시간 즉석 조리</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>#폐기율 0% 도전</span>
                </div>
              </motion.article>

            </div>
          </div>
        </section>


        {/* ------------------------------------------------------------- */}
        {/* SEASON & NEW MENU ROLLING POSTER BANNER [NEW] */}
        {/* ------------------------------------------------------------- */}
        <section className={`py-16 sm:py-24 overflow-hidden relative transition-colors duration-300 ${
          isPinkVariant 
            ? "bg-[#551627] text-white border-b border-[#f2ccd7]/20" 
            : isYellowVariant 
              ? "bg-[#0b4a2e] text-white border-b border-[#e6dfc3]/20" 
              : "bg-neutral-950 text-white border-b border-neutral-900"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 sm:mb-16 relative z-10">
            <div className="inline-flex items-center justify-center mb-3">
              <Sparkles className="text-amber-400 w-5 h-5 animate-pulse" />
            </div>
            <span className="block text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-300/95 mb-2 font-mono">
              Season Menu & New Menu
            </span>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              시즌메뉴 & 신메뉴<br />출시만 하면 <span className="text-amber-300 relative inline-block mx-1">
                Hit!
                <svg className="absolute -bottom-1.5 left-0 w-full h-2 text-amber-300/80" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h3>
            <p className="text-xs sm:text-sm font-bold text-white/80 max-w-xl mx-auto leading-relaxed mt-4">
              전문 R&D 시스템으로 시즌마다 트렌디한 신 메뉴 출시!
            </p>
          </div>

          <div className="relative w-full overflow-hidden">
            {/* Edge fading mask */}
            <div className={`absolute inset-y-0 left-0 w-12 sm:w-32 bg-gradient-to-r z-10 pointer-events-none ${
              isPinkVariant ? "from-[#551627] to-transparent" : isYellowVariant ? "from-[#0b4a2e] to-transparent" : "from-neutral-950 to-transparent"
            }`} />
            <div className={`absolute inset-y-0 right-0 w-12 sm:w-32 bg-gradient-to-l z-10 pointer-events-none ${
              isPinkVariant ? "from-[#551627] to-transparent" : isYellowVariant ? "from-[#0b4a2e] to-transparent" : "from-neutral-950 to-transparent"
            }`} />

            {/* Scrolling track */}
            <div className="flex w-max animate-posterMarquee hover:[animation-play-state:paused]">
              {[...POSTER_IMAGES, ...POSTER_IMAGES].map((src, index) => (
                <div
                  key={index}
                  className="w-[165px] sm:w-[240px] px-2 sm:px-3 shrink-0"
                >
                  <div className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-white/10 group relative transition-all duration-300 hover:shadow-xl hover:border-white/20">
                    <img
                      src={optimizeCloudinaryUrl(src)}
                      alt={`Menu Poster ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee Animation styles */}
          <style jsx>{`
            @keyframes posterMarquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-posterMarquee {
              animation: posterMarquee 35s linear infinite;
            }
          `}</style>
        </section>


        {/* ------------------------------------------------------------- */}
        {/* MODULAR MENU CATALOG SECTION [INTEGRATING EXCLUDED MENU DATA - V2 STYLE - KEY] */}
        {/* ------------------------------------------------------------- */}
        <section id="menu" className={`py-24 border-b relative transition-colors duration-300 ${
          isPinkVariant 
            ? "bg-[#fff9fb] text-[#735965] border-[#f2ccd7]/40" 
            : isYellowVariant 
              ? "bg-[#fffdf2] text-[#0d233a] border-[#e6dfc3]/40" 
              : "bg-neutral-950 text-white border-neutral-900/80"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <motion.div className="max-w-3xl mb-14" {...fadeIn}>
              <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
                isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-500" : "text-amber-400"
              }`}>Product Catalog</span>
              <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight ${
                isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
              }`}>
                커피와 함께 팔기 좋은,<br />우리 가게의 대표 메뉴
              </h2>
              <p className={`text-xs sm:text-sm font-bold leading-relaxed max-w-xl ${
                isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
              }`}>
                파이부터 계란빵, 사이드 메뉴까지. 매장의 손님과 상권에 잘 맞는 구성을 부담 없이 더해보세요.
              </p>
            </motion.div>

            {/* Category selection, filter and search */}
            <div className="flex flex-col items-center w-full">
              {/* Main Category tabs */}
              <div className={`flex rounded-full border p-1 sm:p-1.5 w-full max-w-3xl justify-between relative ${tabWrapperClass}`}>
                {Object.keys(MENU_DATA).map((tabId) => {
                  const isActive = activeTab === tabId;
                  return (
                    <button
                      key={tabId}
                      type="button"
                      onClick={() => {
                        setActiveTab(tabId);
                        setSubFilter("all");
                        setSearchQuery("");
                      }}
                      className={`rounded-full py-2.5 sm:py-3.5 px-2 sm:px-4 flex-1 text-center text-[10px] sm:text-xs md:text-sm font-black transition-all relative border-0 cursor-pointer bg-transparent z-10 whitespace-nowrap ${
                        isActive ? activeTabClass : inactiveTabClass
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="activeTabBackgroundHome"
                          className={`absolute inset-0 rounded-full z-[-1] ${
                            isPinkVariant ? "bg-rose-500" : "bg-amber-400"
                          }`}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-20 flex items-center justify-center gap-1 sm:gap-1.5">
                        {MENU_DATA[tabId].label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sub filters and Search input */}
              <div className="w-full max-w-4xl mt-12 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                {/* Sub filters */}
                <div className="flex flex-wrap gap-2 items-center">
                  {subFilters[activeTab]?.map((filter) => {
                    const isActive = subFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setSubFilter(filter.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isActive ? activeTagClass : tagClass
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>

                {/* Search input */}
                <div className="relative flex-1 md:max-w-xs min-h-[42px]">
                  <Search size={16} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-neutral-450" : "text-neutral-500"
                  }`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="메뉴 이름 또는 설명 검색..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-xs font-bold transition-all focus:outline-none focus:ring-1 ${
                      isPinkVariant 
                        ? `${inputClass} focus:ring-rose-500` 
                        : `${inputClass} focus:ring-amber-500`
                    }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 bg-transparent border-0 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Category Heading */}
              <div className="w-full max-w-4xl text-center md:text-left mt-14 mb-8">
                <span className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase block mb-1.5 ${
                  isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"
                }`}>
                  {activeTab} Selection
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black mb-3 ${isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"}`}>
                  {MENU_DATA[activeTab]?.title}
                </h2>
                <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-2xl ${isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"}`}>
                  {MENU_DATA[activeTab]?.desc}
                </p>
              </div>

              {/* Grid Layout of Products */}
              <div className="w-full max-w-4xl mt-8">
                <AnimatePresence mode="wait">
                  {filteredItems.length > 0 ? (
                    <motion.div
                      key={`${activeTab}-${subFilter}-${searchQuery}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
                    >
                      {filteredItems.map((item) => (
                        <article
                          key={item.name}
                          className={`group rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col ${cardClass}`}
                        >
                          <div className={`aspect-[4/3] w-full overflow-hidden relative transition-all ${imgContainerBg} ${
                            item.name.includes("컵팥빙수") ? "p-6 sm:p-8" : "p-3 sm:p-5"
                          }`}>
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-full h-full transition-all duration-500 group-hover:scale-105 object-contain"
                            />
                            {item.badge && (
                              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wide shadow-sm z-10 ${
                                getBadgeClasses(item.badge, isPinkVariant)
                              }`}>
                                {item.badge}
                              </span>
                            )}
                            {item.tag && (
                              <span className={`absolute top-3 right-3 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase shadow-sm z-10 !text-white ${
                                item.tag === "HIT" 
                                  ? "bg-rose-600" 
                                  : item.tag === "추천" 
                                    ? "bg-blue-600" 
                                    : "bg-emerald-600"
                              }`}>
                                {item.tag}
                              </span>
                            )}
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className={`text-base sm:text-lg font-black mb-1.5 flex items-center flex-wrap gap-1.5 ${cardTitleClass}`}>
                                <span>{item.name}</span>
                              </h3>
                              <p className={`text-xs font-semibold leading-relaxed ${cardDescClass}`}>
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        </article>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-center py-16 px-4 rounded-3xl border border-dashed flex flex-col items-center justify-center ${
                        isPinkVariant ? "border-[#f2ccd7]/30 text-[#7c5d6c]" : isYellowVariant ? "border-[#e6dfc3] text-neutral-400" : "border-neutral-800 text-neutral-500"
                      }`}
                    >
                      <HelpCircle size={40} className="mb-4 text-neutral-450 animate-pulse" />
                      <h3 className="text-base font-black mb-1.5">검색 결과가 없습니다</h3>
                      <p className="text-xs font-semibold leading-relaxed">다른 검색어나 카테고리 탭을 선택해보세요.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Recommended combinations */}
            <div className={`mt-20 border-t pt-14 ${
              isPinkVariant ? "border-[#f2ccd7]/60" : isYellowVariant ? "border-[#e6dfc3]/60" : "border-neutral-800"
            }`}>
              <span className={`font-bold tracking-widest text-xs mb-3 block font-mono uppercase ${
                isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"
              }`}>
                Recommended Sets
              </span>
              <h3 className={`text-2xl sm:text-3xl font-black mb-4 ${
                isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
              }`}>상권에 맞는 메뉴 조합</h3>
              <p className={`text-xs sm:text-sm mb-12 max-w-xl font-medium leading-relaxed ${
                isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
              }`}>
                매장의 주 고객과 이용 시간대에 맞춰, 부담 없이 시작할 수 있는 메뉴 구성을 제안합니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    label: "OFFICE",
                    title: "떡볶이 + 120파이",
                    desc: "든든한 간식과 식사 대용 메뉴를 찾는 오피스·학원가 매장에 어울리는 구성입니다.",
                    location: "오피스 · 대학가",
                    image: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185663/%EC%98%88%EC%81%9C_%EC%B9%B4%ED%8E%98_%ED%85%8C%EC%9D%B4%EB%B8%94_%EC%9C%84%EC%97%90_%EC%9C%84_202605271143_npntmg_cbmmh0.jpg"
                  },
                  {
                    label: "TREND",
                    title: "에그120 + 시그니처 음료",
                    desc: "사진 찍기 좋은 디저트 메뉴로 젊은 고객의 방문과 공유를 기대하는 매장에 적합합니다.",
                    location: "로드샵 · 번화가",
                    image: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185661/%EB%91%90_%EB%A9%94%EB%89%B4_%ED%85%8C%EC%9D%B4%EB%B8%94_%EC%98%88%EC%81%9C_%EC%B9%B4%ED%8E%98_202605271147_1_rkb6ns_wr8gno.jpg"
                  },
                  {
                    label: "DELIVERY",
                    title: "츄러스 + 핫도그 + 파이",
                    desc: "함께 나눠 먹기 좋은 구성을 통해 포장과 배달 주문을 넓히기 좋은 조합입니다.",
                    location: "주거 · 배달 상권",
                    image: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185662/%EB%A9%94%EB%89%B4_%ED%94%8C%EB%A0%88%EC%9D%B4%ED%8C%85_%EC%98%88%EC%81%9C_%EC%B9%B4%ED%8E%98_202605271150_qfswzm_nxk2mq.jpg"
                  }
                ].map((set) => (
                  <article key={set.label} className={`group text-left border-t pt-6 transition-colors flex flex-col ${
                    isPinkVariant 
                      ? "border-[#f2ccd7] hover:border-rose-500" 
                      : isYellowVariant 
                        ? "border-[#e6dfc3] hover:border-[#0d233a]" 
                        : "border-neutral-700 hover:border-amber-400"
                  }`}>
                    <div className={`aspect-[4/3] overflow-hidden rounded-xl mb-6 w-full ${
                      isPinkVariant ? "bg-rose-50/50" : isYellowVariant ? "bg-[#fffdf2]/80" : "bg-neutral-900"
                    }`}>
                      <img
                        src={set.image}
                        alt={set.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <span className={`text-[10px] font-bold tracking-[0.22em] block mb-4 ${
                      isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"
                    }`}>{set.label}</span>
                    <h4 className={`text-lg font-black mb-3 ${
                      isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                    }`}>{set.title}</h4>
                    <p className={`text-xs sm:text-sm leading-relaxed font-medium mb-7 flex-1 ${
                      isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                    }`}>{set.desc}</p>
                    <span className={`text-[11px] font-bold ${
                      isPinkVariant ? "text-neutral-500" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                    }`}>추천 상권: {set.location}</span>
                  </article>
                ))}
              </div>
            </div>

          </div>

          {/* Menu Modal Render */}
          {selectedMenu && <MenuModal menuId={selectedMenu} onClose={() => setSelectedMenu(null)} onInquiry={() => setInquiryModalOpen(true)} isPink={isPinkVariant} />}
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PAIN POINTS SECTION [PURE WHITE & LIGHT GREY THEME - CLEAR TROUBLES] */}
        {/* ------------------------------------------------------------- */}
        <section className={`py-24 border-b transition-colors duration-300 ${
          isPinkVariant 
            ? "bg-[#fff9fb] border-[#f2ccd7]/40 text-[#735965]" 
            : isYellowVariant 
              ? "bg-[#fffdf2] border-[#e6dfc3]/40 text-[#0d233a]" 
              : "bg-white text-neutral-900 border-neutral-100"
        }`} id="pain-points">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

              {/* Left Troubles Cards Grid */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <motion.div className="max-w-xl mb-12" {...fadeIn}>
                  <span className="text-neutral-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Real Cafe Troubles</span>
                  <h2 className={`text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight ${
                    isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-black"
                  }`}>
                    하루 백 잔을 팔아도 제자리걸음이라면,<br />
                    문제는 잔수가 아닌 <span className="text-amber-500 font-extrabold">낮은 객단가</span>입니다.
                  </h2>
                  <p className={`text-xs sm:text-sm font-bold leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                  }`}>
                    저가 커피와 치열하게 경쟁하며 음료만 판매하는 방식으로는 성장에 한계가 있습니다.<br />
                    기존 매장을 크게 바꾸지 않고도, 파이 메뉴 하나로 주문의 가치를 높일 수 있습니다.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { no: "01", title: "음료 객단가의 물리적 한계", desc: "커피 한 잔당의 마진 단가가 오르지 않고 주변 저가 프랜차이즈 저가 경쟁 시 타격이 매우 큽니다." },
                    { no: "02", title: "매일 반복되는 상온 빵 폐기", desc: "쇼케이스에 준비할수록 선도가 저하되고 당일 판매 불발 시 원가 폐기율 손실이 커집니다." },
                    { no: "03", title: "어려운 베이커리 제조 인프라", desc: "매장 내에서 직접 빵을 생산하려면 오븐기 셋업 공간과 전문 제과사 급여비가 심각히 가중됩니다." },
                    { no: "04", title: "차별화 없는 배달 메뉴 썸네일", desc: "배달앱 리스트에서 사장님 매장만이 가지는 뚜렷한 대표 디저트 세트가 없어 경쟁에서 묻힙니다." },
                    { no: "05", title: "초기 철거/가맹비 인테리어 거품", desc: "신규 창업이나 브랜드 업종 전환을 하려면 억대 규모의 불필요한 공사비와 본사 마진 거품이 발생합니다." },
                    { no: "06", title: "인스타그램 자발적 바이럴 부재", desc: "MZ고객들이 사진 찍고 태그하여 지인을 부를 만한 감각적인 브랜드 시각 굿즈 및 대표 캐릭터가 결여되어 있습니다." }
                  ].map((p, idx) => (
                    <motion.div
                      key={idx}
                      className={`p-6 rounded-2xl border transition-all group shadow-sm ${
                        isPinkVariant 
                          ? "bg-white border-[#f2ccd7]/60 hover:border-rose-400 hover:bg-white" 
                          : isYellowVariant 
                            ? "bg-white border-[#e6dfc3]/60 hover:border-[#0d233a] hover:bg-white" 
                            : "bg-neutral-50 border-neutral-100 hover:border-black hover:bg-white"
                      }`}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                      <span className={`w-8 h-8 rounded font-black text-xs flex items-center justify-center mb-4 group-hover:scale-105 transition-all ${
                        isPinkVariant 
                          ? "bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white" 
                          : isYellowVariant 
                            ? "bg-[#fff9e6] text-amber-700 group-hover:bg-[#0d233a] group-hover:text-white" 
                            : "bg-neutral-950 text-white group-hover:bg-amber-400 group-hover:text-neutral-950"
                      }`}>
                        {p.no}
                      </span>
                      <h3 className={`text-base font-black mb-2 ${
                        isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-black"
                      }`}>{p.title}</h3>
                      <p className={`text-xs font-bold leading-relaxed ${
                        isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                      }`}>{p.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Supporting Video Column */}
              <motion.div
                className={`lg:col-span-4 border rounded-3xl overflow-hidden relative min-h-[400px] flex items-end shadow-inner ${
                  isPinkVariant 
                    ? "bg-white border-[#f2ccd7]/80" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3]/80" 
                      : "bg-neutral-50 border-neutral-200"
                }`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <video
                  src="https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781185778/120pie_%EC%98%81%EC%83%81_2_2_j4zc5s.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="120겹 파이 메뉴 연출 영상"
                  className={`absolute inset-0 w-full h-full object-cover ${isPinkVariant ? "opacity-100" : "opacity-90 contrast-105"}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  isPinkVariant 
                    ? "from-black/60 via-transparent to-transparent" 
                    : isYellowVariant 
                      ? "from-black/60 via-transparent to-transparent" 
                      : "from-black/85 via-black/20 to-transparent"
                }`}></div>
                <div className="relative z-10 p-6 text-white text-xs font-bold leading-relaxed">
                  <span className="text-amber-400 uppercase tracking-widest text-[9px] block mb-1">barista desk support</span>
                  "음료 제조 중에도 120겹 파이는 본사 자동 타이머 타이틀 하에 구워져 별도 주방 제조 피로도가 거의 없습니다."
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* SIMULATOR SECTION */}
        {/* ------------------------------------------------------------- */}
        <section className={`py-24 border-b transition-colors duration-300 ${
          isPinkVariant 
            ? "bg-[#fff9fb] border-[#f2ccd7]/40 text-neutral-950" 
            : isYellowVariant 
              ? "bg-[#fffdf2] border-[#e6dfc3]/40 text-neutral-950" 
              : "bg-[#fffaf1] border-amber-100 text-neutral-950"
        }`} id="simulator">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
                isPinkVariant ? "text-rose-600" : isYellowVariant ? "text-amber-700" : "text-amber-700"
              }`}>Sales Calculator</span>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 mb-4 tracking-tight leading-tight">
                파이를 하루 몇 개만 더해도,<br />
                <span className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-600"}>우리 매장의 추가 매출</span>을 확인할 수 있습니다.
              </h2>
              <p className="text-sm text-neutral-700 font-medium leading-relaxed max-w-xl">
                예상 판매 수량과 단가를 조정해, 파이 메뉴가 만드는 월 매출 변화를 간편하게 살펴보세요.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

              {/* Left Input panel */}
              <div className={`lg:col-span-5 bg-white border p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-sm transition-colors ${
                isPinkVariant 
                  ? "border-[#f2ccd7]/80" 
                  : isYellowVariant 
                    ? "border-[#e6dfc3]/80" 
                    : "border-amber-200/70"
              }`}>
                <div>
                  <h3 className="text-lg font-black text-neutral-950 mb-2">우리 매장 기준으로 계산하기</h3>
                  <p className="text-sm text-neutral-600 font-medium leading-relaxed mb-7">
                    하루 판매 수량과 가격, 영업일을 조정해 예상 추가 매출을 확인해보세요.
                  </p>

                  <div className="grid gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-neutral-700 flex justify-between">
                        <span>하루 예상 판매 수량</span>
                        <span className="text-neutral-900 font-black">{quantity} 개</span>
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full accent-neutral-950 bg-neutral-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-neutral-700 flex justify-between">
                        <span>평균 판매 단가</span>
                        <span className="text-neutral-900 font-black">{price.toLocaleString()} 원</span>
                      </label>
                      <input
                        type="range"
                        min="3000"
                        max="7000"
                        step="500"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full accent-neutral-950 bg-neutral-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-neutral-700 flex justify-between">
                        <span>월 영업일 기준</span>
                        <span className="text-neutral-900 font-black">{days} 일</span>
                      </label>
                      <input
                        type="range"
                        min="15"
                        max="31"
                        step="1"
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="w-full accent-neutral-950 bg-neutral-100 rounded-lg appearance-none h-1.5 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100">
                  <button type="button" onClick={() => setInquiryModalOpen(true)} className={`w-full inline-flex items-center justify-center px-6 py-3.5 font-black text-xs rounded-lg transition-colors shadow-sm cursor-pointer border-0 ${
                    isPinkVariant 
                      ? "bg-rose-500 text-white hover:bg-rose-600" 
                      : isYellowVariant 
                        ? "bg-[#0d233a] text-white hover:bg-[#163554]" 
                        : "bg-neutral-950 text-white hover:bg-neutral-800"
                  }`}>
                    우리 매장에 맞게 상담받기
                  </button>
                </div>
              </div>

              {/* Right Output & Plating Image (High Contrast Deep Gold Card) */}
              <div className="lg:col-span-7 flex flex-col gap-6 justify-between">

                {/* Result Dash */}
                <div className={`p-8 rounded-2xl shadow-sm flex flex-col justify-between min-h-[176px] transition-colors ${
                  isPinkVariant 
                    ? "bg-rose-500 text-white" 
                    : isYellowVariant 
                      ? "bg-amber-400 text-neutral-950" 
                      : "bg-amber-400 text-neutral-950"
                }`}>
                  <div>
                    <span className={`text-xs font-bold tracking-widest block mb-2 ${
                      isPinkVariant ? "text-rose-100" : "text-neutral-900/70"
                    }`}>
                      월 예상 추가 매출
                    </span>
                    <h3 className={`text-base font-bold mb-5 ${
                      isPinkVariant ? "text-rose-100" : "text-neutral-900/80"
                    }`}>
                      파이 메뉴를 추가했을 때
                    </h3>
                  </div>
                  <div>
                    <strong className="simulator-amount text-3xl sm:text-4xl font-black tracking-tight block mb-2 leading-none">
                      {monthlySales.toLocaleString()} 원
                    </strong>
                    <p className={`text-xs font-bold ${
                      isPinkVariant ? "text-rose-100" : "text-neutral-900/70"
                    }`}>
                      하루 {quantity}개 x {price.toLocaleString()}원 x 월 {days}일 기준
                    </p>
                  </div>
                </div>

                {/* Split layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
                  <div
                    className={`group bg-white border rounded-2xl overflow-hidden relative min-h-[180px] cursor-zoom-in order-last sm:order-first transition-colors ${
                      isPinkVariant ? "border-[#f2ccd7]" : isYellowVariant ? "border-[#e6dfc3]" : "border-amber-100"
                    }`}
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => setSimulatorVideoExpanded(true)}
                    onClick={() => setSimulatorVideoExpanded(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSimulatorVideoExpanded(true);
                      }
                    }}
                    aria-label="영상 크게보기"
                  >
                    <video
                      src="https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183434/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%A1%9C%EC%A0%9C_%EC%96%91%EC%86%A1%EC%9D%B4_%EC%88%98%EC%A0%952_gw0tvv.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-label="120겹파이 로제 양송이 메뉴 영상"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className={`pink-primary-button absolute bottom-4 right-4 rounded-full px-3.5 py-2 text-[11px] font-black shadow-sm transition-transform group-hover:scale-105 transition-colors ${
                      isPinkVariant 
                        ? "bg-rose-500 text-white" 
                        : "bg-amber-400 text-[#0d233a]"
                    }`}>
                      영상 크게보기 · 소리 재생
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 justify-between order-first sm:order-last">
                    <div className={`bg-white border p-5 rounded-2xl shadow-sm transition-colors ${
                      isPinkVariant ? "border-[#f2ccd7]/80" : isYellowVariant ? "border-[#e6dfc3]/80" : "border-amber-200/70"
                    }`}>
                      <span className="text-xs text-neutral-600 font-bold block mb-2">월 예상 판매 수량</span>
                      <strong className="text-xl font-black text-neutral-900 block mb-0.5">{monthlyQuantity.toLocaleString()} 개</strong>
                      <span className="text-xs text-neutral-500 font-medium">선택한 조건으로 계산한 수량입니다.</span>
                    </div>

                    <div className={`bg-white border p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-colors ${
                      isPinkVariant ? "border-[#f2ccd7]/80" : isYellowVariant ? "border-[#e6dfc3]/80" : "border-amber-200/70"
                    }`}>
                      <div>
                        <span className="text-xs text-neutral-600 font-bold block mb-2">예상 순이익</span>
                        <strong className={`text-base font-black block ${
                          isPinkVariant ? "text-rose-600" : isYellowVariant ? "text-[#0d233a]" : "text-amber-700"
                        }`}>상담 시 자세히 안내</strong>
                      </div>
                      <span className="text-xs text-neutral-500 font-medium mt-2">원가와 도입 방식에 따라 달라집니다.</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {simulatorVideoExpanded && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-neutral-950/65 p-4 backdrop-blur-sm"
              onClick={() => setSimulatorVideoExpanded(false)}
            >
              <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <video
                  src="https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183434/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%A1%9C%EC%A0%9C_%EC%96%91%EC%86%A1%EC%9D%B4_%EC%88%98%EC%A0%952_gw0tvv.mp4"
                  autoPlay
                  muted={false}
                  loop
                  playsInline
                  controls
                  aria-label="확대된 120겹파이 로제 양송이 메뉴 영상"
                  className="block w-full max-h-[82vh] object-contain"
                />
              </div>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------- */}
        {/* BEFORE AFTER SECTION [PURE WHITE THEME - CONTRAST COMPARE] */}
        {/* ------------------------------------------------------------- */}
        <section className={`py-24 border-b transition-colors duration-300 ${
          isPinkVariant 
            ? "bg-[#fff9fb] border-[#f2ccd7]/40 text-[#735965]" 
            : isYellowVariant 
              ? "bg-[#fffdf2] border-[#e6dfc3]/40 text-[#0d233a]" 
              : "bg-white text-neutral-900 border-neutral-100"
        }`} id="before-after">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
                isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-neutral-500"
              }`}>Contrast Compare</span>
              <h2 className={`text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight ${
                isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-black"
              }`}>
                커피만 팔던 매장에,<br />
                <span className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-500 font-extrabold"}>디저트를 찾는 이유</span>를 더합니다.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Before Column (Monochrome Grey Coffee Image) */}
              <motion.article
                className={`border rounded-2xl p-6 sm:p-8 flex flex-col gap-6 justify-between transition-colors ${
                  isPinkVariant 
                    ? "bg-white border-[#f2ccd7] hover:border-rose-400" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3] hover:border-[#0d233a]" 
                      : "bg-neutral-50 border border-neutral-200 hover:border-black"
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-3.5 py-1 rounded bg-neutral-200 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                      Before
                    </span>
                    <span className={`font-black text-lg ${
                      isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                    }`}>음료 중심의 기존 매장</span>
                  </div>
                  <h3 className={`text-xl font-black mb-6 leading-tight ${
                    isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-neutral-800"
                  }`}>커피 한 잔만으로는 아쉬운 매출</h3>

                  <div className={`space-y-3.5 mb-6 text-xs sm:text-sm font-bold leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                  }`}>
                    <div className="flex gap-2"><span>•</span><p>음료 주문만으로는 한 번의 결제 금액을 높이기 어렵습니다.</p></div>
                    <div className="flex gap-2"><span>•</span><p>미리 준비한 디저트는 팔리지 않으면 폐기 부담으로 이어집니다.</p></div>
                    <div className="flex gap-2"><span>•</span><p>손님이 기억하고 공유할 만한 대표 메뉴가 부족합니다.</p></div>
                  </div>
                </div>

                <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-neutral-200 bg-neutral-100">
                  <img
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185881/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_26%EC%9D%BC_%EC%98%A4%ED%9B%84_12_13_48_asivm6_cvxjzp.png"
                    alt="커피 한 잔만으로 아쉬운 매출을 표현한 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.article>

              {/* After Column (Rich Gold-Accented Brunch Table Image) */}
              <motion.article
                className={`border-2 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 justify-between shadow-2xl transition-all duration-300 ${
                  isPinkVariant 
                    ? "bg-[#fff5f7] border-rose-500 text-[#735965]" 
                    : isYellowVariant 
                      ? "bg-white border-[#0d233a] text-[#0d233a]" 
                      : "bg-neutral-950 text-white border-amber-400"
                }`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className={`px-3.5 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                      isPinkVariant 
                        ? "bg-rose-500 text-white" 
                        : isYellowVariant 
                          ? "bg-[#0d233a] text-white" 
                          : "bg-amber-400 text-neutral-950"
                    }`}>
                      After
                    </span>
                    <span className={`font-black text-lg ${
                      isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"
                    }`}>120pie를 더한 우리 매장</span>
                  </div>
                  <h3 className={`text-xl font-black mb-6 leading-tight ${
                    isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                  }`}>커피와 파이를 함께 찾는 카페로</h3>

                  <div className={`space-y-3.5 mb-6 text-xs sm:text-sm font-medium leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-300"
                  }`}>
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${
                        isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"
                      }`} />
                      <p>커피와 잘 어울리는 파이 메뉴로 자연스럽게 세트 주문을 제안할 수 있습니다.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${
                        isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"
                      }`} />
                      <p>필요한 만큼 구워 판매해 디저트 운영과 폐기 부담을 줄일 수 있습니다.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${
                        isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"
                      }`} />
                      <p>파이 맛집으로 기억되는 메뉴를 더해 재방문과 입소문을 기대할 수 있습니다.</p>
                    </div>
                  </div>
                </div>

                <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-neutral-800">
                  <img
                    src="https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185897/230515_120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%95%A0%ED%94%8C%EC%B9%98%EC%A6%88_2_sddz7b_ctaarg.jpg"
                    alt="커피와 파이를 함께 찾는 카페 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.article>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* ADOPTION STEPS & RESULTS SECTION */}
        {/* ------------------------------------------------------------- */}
        <section id="adoption" className={`py-24 border-b relative transition-colors duration-300 ${
          isPinkVariant 
            ? "bg-[#fff9fb] text-[#735965] border-[#f2ccd7]/40" 
            : isYellowVariant 
              ? "bg-[#fffdf2] text-[#0d233a] border-[#e6dfc3]/40" 
              : "bg-neutral-950 text-white border-neutral-900/80"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <motion.div className="max-w-3xl mb-14" {...fadeIn}>
              <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
                isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"
              }`}>Adoption Guide</span>
              <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-4 leading-tight ${
                isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
              }`}>
                작은 공간에서 시작해,<br />매장에 맞게 넓혀갑니다.
              </h2>
              <p className={`text-xs sm:text-sm font-bold max-w-xl leading-relaxed ${
                isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
              }`}>
                간판과 매장을 한 번에 바꾸지 않아도 됩니다. 파이 메뉴를 먼저 도입하고, 반응에 따라 브랜드 노출과 매장 변화를 선택할 수 있습니다.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-20">
              {[
                { num: "01", title: "메뉴부터 가볍게 시작", desc: "작은 판매 공간에 파이 메뉴를 더해 손님의 반응을 먼저 살펴봅니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185929/KakaoTalk_Photo_2023-03-17-18-30-28_003_2_r2ywjp_xoc0oc.jpg" },
                { num: "02", title: "매장 안에서 알리기", desc: "메뉴보드와 안내물을 활용해 파이를 판매하는 카페임을 자연스럽게 알립니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185933/KakaoTalk_Photo_2023-03-17-18-30-49_003_2_g9jkkd_ddvcvz.jpg" },
                { num: "03", title: "필요하면 외부 표기 추가", desc: "원하는 매장에 한해 기존 간판 옆에 브랜드 표기를 더할 수 있습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185936/KakaoTalk_Photo_2023-03-17-18-30-29_013_2_fcl1vm_zbuqaq.jpg" },
                { num: "04", title: "검증 후 확장 선택", desc: "매출과 고객 반응을 확인한 뒤, 매장 전환 여부를 차분히 결정합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185938/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%B3%B8%EC%A0%90_%EC%84%9C%EC%9A%B8_%EC%84%B1%EB%B6%81%EA%B5%AC_%EB%8F%8C%EA%B3%B6%EC%9D%B4%EB%A1%9C14%EA%B8%B8_35_1%EC%B8%B5_k9mjon_z90vyq.jpg" }
              ].map((step) => (
                <article key={step.num} className={`group border-t pt-5 flex flex-col h-full transition-colors ${
                  isPinkVariant ? "border-[#f2ccd7]/60" : isYellowVariant ? "border-[#e6dfc3]/60" : "border-neutral-700"
                }`}>
                  <div className={`h-40 overflow-hidden rounded-xl mb-6 ${
                    isPinkVariant ? "bg-rose-50/50" : isYellowVariant ? "bg-[#fffdf2]/85" : "bg-neutral-900"
                  }`}>
                    <img src={step.img} alt={step.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  </div>
                  <span className={`text-[10px] font-bold tracking-[0.24em] mb-3 ${
                    isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"
                  }`}>STEP {step.num}</span>
                  <h3 className={`text-lg font-black mb-3 leading-tight ${
                    isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                  }`}>{step.title}</h3>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed flex-1 ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                  }`}>
                    {step.desc}
                  </p>
                  <button
                    onClick={() => setSelectedAdoptionStep(step.num)}
                    className={`text-left text-xs font-bold mt-7 inline-flex items-center gap-2 transition-colors ${
                      isPinkVariant 
                        ? "text-[#7c5d6c] hover:text-rose-500" 
                        : isYellowVariant 
                          ? "text-[#576575] hover:text-[#0d233a]" 
                          : "text-neutral-200 hover:text-amber-400"
                    }`}
                  >
                    도입 예시 보기 <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>

            <div className={`border-t pt-14 ${
              isPinkVariant ? "border-[#f2ccd7]/60" : isYellowVariant ? "border-[#e6dfc3]/60" : "border-neutral-800"
            }`}>
              <div className="max-w-2xl mb-12">
                <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
                  isPinkVariant ? "text-rose-600" : isYellowVariant ? "text-amber-600" : "text-amber-400"
                }`}>Reference Figures</span>
                <h3 className={`text-2xl sm:text-3xl font-black leading-tight mb-3 ${
                  isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                }`}>도입 상담에서 확인할 수 있는 지표</h3>
                <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                  isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                }`}>
                  매장 조건과 도입 방식에 따라 결과는 달라집니다. 상담 시 실제 사례와 함께 자세히 안내드립니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. 일 매출 변화 사례 Infographic */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between group transition-all duration-300 ${
                  isPinkVariant 
                    ? "bg-white border-[#f2ccd7] hover:border-rose-400" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3] hover:border-[#0d233a]" 
                      : "bg-neutral-900/40 border-neutral-850 hover:border-amber-400"
                }`}>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold text-xs tracking-wider ${isPinkVariant ? "text-rose-500" : "text-amber-600"}`}>일 매출 변화 사례</span>
                      <TrendingUp size={16} className={isPinkVariant ? "text-rose-500" : "text-amber-600"} />
                    </div>
                    <div className={`text-4xl sm:text-5xl font-black mb-6 ${
                      isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                    }`}>
                      <AnimatedNumber value={300} suffix="%" />
                    </div>
                    {/* Infographic Double Horizontal Bars */}
                    <div className={`p-4 rounded-xl border ${
                      isPinkVariant 
                        ? "bg-[#fff5f7] border-[#f2ccd7]/80 text-[#735965]" 
                        : isYellowVariant 
                          ? "bg-[#fffdf2]/80 border-[#e6dfc3]/80 text-[#0d233a]" 
                          : "bg-neutral-950/40 border-neutral-900 text-neutral-450"
                    }`}>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className={`flex justify-between text-[10px] font-bold ${
                            isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                          }`}>
                            <span>기존 카페 평균</span>
                            <span>100%</span>
                          </div>
                          <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                            isPinkVariant ? "bg-rose-100/50" : isYellowVariant ? "bg-[#fff9e6]" : "bg-neutral-900"
                          }`}>
                            <div className={`h-full rounded-full ${
                              isPinkVariant ? "bg-[#7c5d6c]/40" : isYellowVariant ? "bg-[#576575]/40" : "bg-neutral-600"
                            }`} style={{ width: "33.3%" }} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold items-center">
                            <span className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"}>120pie 도입 후</span>
                            <span className={`${isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"} animate-pulse text-[11px]`}>300%</span>
                          </div>
                          <div className={`w-full h-2 rounded-full overflow-hidden relative ${
                            isPinkVariant ? "bg-rose-100/50" : isYellowVariant ? "bg-[#fff9e6]" : "bg-neutral-900"
                          }`}>
                            <motion.div 
                              className={`h-full bg-gradient-to-r ${
                                isPinkVariant 
                                  ? "from-pink-500 to-pink-400 shadow-[0_0_10px_rgba(242,95,138,0.3)]" 
                                  : isYellowVariant 
                                    ? "from-[#0d233a] to-[#1a4066] shadow-[0_0_10px_rgba(13,35,58,0.3)]" 
                                    : "from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                              } rounded-full`}
                              initial={{ width: "33.3%" }}
                              whileInView={{ width: "100%" }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                  }`}>
                    도입 사례 중 확인된 매출 변화 수치입니다.
                  </p>
                </div>

                {/* 2. 일 최고 매출 사례 Infographic */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between group transition-all duration-300 ${
                  isPinkVariant 
                    ? "bg-white border-[#f2ccd7] hover:border-rose-400" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3] hover:border-[#0d233a]" 
                      : "bg-neutral-900/40 border-neutral-850 hover:border-amber-400"
                }`}>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold text-xs tracking-wider ${isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>일 최고 매출 사례</span>
                      <Award size={16} className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"} />
                    </div>
                    <div className="flex items-center gap-5 mb-6">
                      {/* Circular SVG Gauge */}
                      <div className="w-14 h-14 shrink-0 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="24" className="stroke-neutral-800 border-neutral-200" strokeWidth="4.5" fill="none" />
                          <motion.circle 
                            cx="28" 
                            cy="28" 
                            r="24" 
                            className={isPinkVariant ? "stroke-pink-500" : isYellowVariant ? "stroke-[#0d233a]" : "stroke-amber-400"} 
                            strokeWidth="4.5" 
                            fill="none"
                            strokeDasharray={151}
                            initial={{ strokeDashoffset: 151 }}
                            whileInView={{ strokeDashoffset: 30 }} // Draws ~80%
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <Store className={`absolute ${isPinkVariant ? "text-pink-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"}`} size={16} />
                      </div>
                      <div className={`text-3xl sm:text-4xl font-black ${
                        isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                      }`}>
                        <AnimatedNumber value={350} suffix="만원" />
                      </div>
                    </div>
                    <div className={`p-3.5 rounded-xl border text-[10px] font-bold mb-6 flex items-center gap-1.5 ${
                      isPinkVariant 
                        ? "bg-[#fff5f7] border-[#f2ccd7]/80 text-[#735965]" 
                        : isYellowVariant 
                          ? "bg-[#fffdf2]/80 border-[#e6dfc3]/80 text-[#0d233a]" 
                          : "bg-neutral-950/40 border-neutral-900 text-neutral-500"
                    }`}>
                      <Sparkles size={11} className={`${isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"} animate-spin-slow`} />
                      <span>단독 매장 운영사례 기준 최고치 달성 지표</span>
                    </div>
                  </div>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                  }`}>
                    단독 매장 운영 사례를 기준으로 한 수치입니다.
                  </p>
                </div>

                {/* 3. 투자 회수 사례 Infographic */}
                <div className={`p-6 rounded-2xl border flex flex-col justify-between group transition-all duration-300 ${
                  isPinkVariant 
                    ? "bg-white border-[#f2ccd7] hover:border-rose-400" 
                    : isYellowVariant 
                      ? "bg-white border-[#e6dfc3] hover:border-[#0d233a]" 
                      : "bg-neutral-900/40 border-neutral-850 hover:border-amber-400"
                }`}>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold text-xs tracking-wider ${isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"}`}>투자 회수 사례</span>
                      <ShieldCheck size={16} className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"} />
                    </div>
                    <div className={`text-4xl sm:text-5xl font-black mb-6 ${
                      isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                    }`}>
                      <AnimatedNumber value={2} suffix="개월" />
                    </div>
                    {/* Timeline Grid Infographic */}
                    <div className={`p-4 rounded-xl border ${
                      isPinkVariant 
                        ? "bg-[#fff5f7] border-[#f2ccd7]/80 text-[#735965]" 
                        : isYellowVariant 
                          ? "bg-[#fffdf2]/80 border-[#e6dfc3]/80 text-[#0d233a]" 
                          : "bg-neutral-950/40 border-neutral-900 text-neutral-500"
                    }`}>
                      <div className={`flex justify-between items-center text-[10px] font-bold mb-2 ${
                        isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                      }`}>
                        <span className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"}>120pie 회수 (2개월)</span>
                        <span>타 프랜차이즈 평균</span>
                      </div>
                      <div className="flex gap-1.5 items-center w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className={`h-3 flex-1 rounded-sm ${
                              i < 2 
                                ? (isPinkVariant 
                                    ? "bg-gradient-to-b from-pink-500 to-pink-400 shadow-[0_0_8px_rgba(242,95,138,0.4)]" 
                                    : isYellowVariant 
                                      ? "bg-gradient-to-b from-[#0d233a] to-[#163554] shadow-[0_0_8px_rgba(13,35,58,0.4)]" 
                                      : "bg-gradient-to-b from-amber-400 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.4)]") 
                                : "bg-neutral-800"
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                  }`}>
                    도입 규모와 매장 매출에 따라 달라질 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Adoption Modal Render */}
          {selectedAdoptionStep && <AdoptionModal exampleId={selectedAdoptionStep} onClose={() => setSelectedAdoptionStep(null)} />}
        </section>

        {/* ------------------------------------------------------------- */}
        {/* STORES PREVIEW SECTION [V3 FUSION] */}
        {/* ------------------------------------------------------------- */}
        <StoresPreviewSection isPink={isPinkVariant} isYellow={isYellowVariant} />

        {/* ------------------------------------------------------------- */}
        {/* OWNER SUPPORT SYSTEM SECTION [V3 FUSION] */}
        {/* ------------------------------------------------------------- */}
        <OwnerSystemSection isPink={isPinkVariant} isYellow={isYellowVariant} />

        {/* ------------------------------------------------------------- */}
        {/* GALLERY SECTION [V3 FUSION] */}
        {/* ------------------------------------------------------------- */}
        <GallerySection filter={galleryFilter} setFilter={setGalleryFilter} isPink={isPinkVariant} isYellow={isYellowVariant} />

        {/* ------------------------------------------------------------- */}
        {/* PROCESS SECTION [RICH BLACK THEME - CRISPY PROCESS] */}
        {/* ------------------------------------------------------------- */}
        <section className={`py-24 border-b relative transition-all duration-300 ${
          isPinkVariant 
            ? "bg-[#fff5f7] text-[#4c2d3a] border-[#f2ccd7]" 
            : isYellowVariant 
              ? "bg-[#fffdf2] text-[#0d233a] border-[#e6dfc3]" 
              : "bg-neutral-950 text-white border-neutral-900"
        }`} id="process">
          <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none ${
            isPinkVariant 
              ? "bg-rose-400/5" 
              : isYellowVariant 
                ? "bg-amber-400/5" 
                : "bg-amber-400/5"
          }`}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-xl mb-12" {...fadeIn}>
              <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
                isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"
              }`}>Simple Operation</span>
              <h2 className={`text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight ${
                isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
              }`}>
                복잡한 제빵 과정 없이,<br />
                주문 후 <span className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"}>간편하게 구워 판매합니다.</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              {/* Left Column: 3 Steps Process */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 gap-6">
                  {[
                    { step: "01", title: "필요한 만큼 보관합니다", desc: "준비된 파이 생지를 냉동 보관해두고, 판매할 수량만 꺼내 사용할 수 있습니다." },
                    { step: "02", title: "주문이 들어오면 구워냅니다", desc: "복잡한 반죽이나 성형 없이, 오븐에 넣고 정해진 시간만 맞추면 됩니다." },
                    { step: "03", title: "갓 구운 파이를 건넵니다", desc: "바삭하게 구워진 파이를 포장해 커피와 함께 바로 제공할 수 있습니다." }
                  ].map((p, idx) => (
                    <motion.div
                      key={idx}
                      className={`p-6 rounded-xl flex items-start gap-5 transition-colors border ${
                        isPinkVariant 
                          ? "bg-white border-[#f2ccd7] hover:border-rose-400" 
                          : isYellowVariant 
                            ? "bg-white border-[#e6dfc3] hover:border-[#0d233a]" 
                            : "bg-neutral-900/60 border-neutral-900 hover:border-amber-400/40"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                    >
                      <span className={`w-9 h-9 rounded font-black text-sm flex items-center justify-center shrink-0 shadow-md ${
                        isPinkVariant 
                          ? "bg-rose-500 text-white" 
                          : isYellowVariant 
                            ? "bg-[#0d233a] text-white" 
                            : "bg-amber-400 text-neutral-950"
                      }`}>
                        {p.step}
                      </span>
                      <div>
                        <h3 className={`text-base font-black mb-1 ${
                          isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                        }`}>{p.title}</h3>
                        <p className={`text-xs font-medium leading-relaxed ${
                          isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                        }`}>{p.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column: Close-up Food Baking Process Image */}
              <motion.div
                className={`lg:col-span-4 min-h-[320px] rounded-2xl overflow-hidden relative shadow-2xl ${
                  isPinkVariant 
                    ? "bg-white border border-[#f2ccd7]" 
                    : isYellowVariant 
                      ? "bg-white border border-[#e6dfc3]" 
                      : "bg-neutral-900 border border-neutral-800"
                }`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <video
                  src="https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781186151/Video_Project_15-2_sypvht.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="120pie 간편 조리 과정 영상"
                  className="absolute inset-0 block w-full h-full object-cover"
                />
              </motion.div>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* COMPARISON TABLES [PURE WHITE THEME - DUST ACCENT] */}
        {/* ------------------------------------------------------------- */}
        <section className={`py-24 border-b transition-all duration-300 ${
          isPinkVariant 
            ? "bg-white text-neutral-900 border-rose-100" 
            : isYellowVariant 
              ? "bg-white text-[#0d233a] border-[#e6dfc3]" 
              : "bg-white text-neutral-900 border-neutral-100"
        }`} id="comparison">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
                isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-neutral-500"
              }`}>Simple Comparison</span>
              <h2 className={`text-3xl sm:text-4xl font-black mb-4 tracking-tight leading-tight ${
                isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-black"
              }`}>
                미리 준비해두는 디저트보다,<br />
                <span className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-500"}>필요할 때 구워 파는 방식</span>이 부담을 줄입니다.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Comparison Card 1 */}
              <div className={`border p-6 sm:p-8 rounded-2xl shadow-sm ${
                isPinkVariant 
                  ? "bg-[#fffbfd] border-[#f2ccd7]/80" 
                  : isYellowVariant 
                    ? "bg-[#fffdf2] border-[#e6dfc3]/80" 
                    : "bg-neutral-50 border-neutral-200"
              }`}>
                <h3 className={`text-base font-black mb-6 flex items-center gap-2 ${
                  isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-black"
                }`}>
                  <Award size={18} className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-neutral-955"} /> 보관과 판매 방식 비교
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "보관 방식", before: "진열 후 빠른 판매가 필요합니다.", after: "냉동 보관 후 필요한 만큼 사용합니다." },
                    { label: "판매 방식", before: "미리 준비해 진열합니다.", after: "주문 후 간편하게 구워냅니다." },
                    { label: "남은 재고 부담", before: "팔리지 않으면 폐기로 이어질 수 있습니다.", after: "판매할 수량만 구워 부담을 줄입니다." }
                  ].map((item) => (
                    <div key={item.label} className={`border-t pt-4 ${
                      isPinkVariant ? "border-[#f2ccd7]/50" : isYellowVariant ? "border-[#e6dfc3]/50" : "border-neutral-200"
                    }`}>
                      <h4 className={`text-sm font-black mb-3 ${
                        isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-neutral-900"
                      }`}>{item.label}</h4>
                      <div className="grid gap-2.5">
                        <div className={`rounded-lg px-4 py-3 border bg-white ${
                          isPinkVariant ? "border-[#f2ccd7]/40" : isYellowVariant ? "border-[#e6dfc3]/40" : "border-neutral-200"
                        }`}>
                          <span className={`text-[10px] font-bold tracking-wider block mb-1 ${
                            isPinkVariant ? "text-rose-400" : isYellowVariant ? "text-amber-600" : "text-neutral-400"
                          }`}>진열 디저트</span>
                          <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                            isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                          }`}>{item.before}</p>
                        </div>
                        <div className={`rounded-lg px-4 py-3 flex items-center gap-3 border ${
                          isPinkVariant 
                            ? "bg-[#fff5f7] border-rose-100" 
                            : isYellowVariant 
                              ? "bg-[#fffdf2] border-[#e6dfc3]" 
                              : "bg-amber-50 border-amber-200"
                        }`}>
                          <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                            <img
                              src={isPinkVariant ? "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779846449/logo_120pie_coffee3_jzgtyi.png" : "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186180/logo_120pie_coffee_nu2_c7tiiy_zi1pjo.png"}
                              alt="120pie 로고"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-[10px] font-bold tracking-wider block mb-1 ${
                              isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-600"
                            }`}>120pie 파이</span>
                            <p className={`text-xs sm:text-sm font-bold leading-relaxed ${
                              isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-neutral-900"
                            }`}>{item.after}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison Card 2 */}
              <div className={`border p-6 sm:p-8 rounded-2xl shadow-sm ${
                isPinkVariant 
                  ? "bg-[#fffbfd] border-[#f2ccd7]/80" 
                  : isYellowVariant 
                    ? "bg-[#fffdf2] border-[#e6dfc3]/80" 
                    : "bg-neutral-50 border-neutral-200"
              }`}>
                <h3 className={`text-base font-black mb-6 flex items-center gap-2 ${
                  isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-black"
                }`}>
                  <ShieldCheck size={18} className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-neutral-955"} /> 시작할 때 필요한 변화
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "시작 부담", before: "브랜드 전환 비용과 준비가 필요합니다.", after: "필요한 메뉴와 집기부터 시작합니다." },
                    { label: "매장 변화", before: "공사나 간판 변경이 필요할 수 있습니다.", after: "기존 매장을 크게 바꾸지 않고 시작합니다." },
                    { label: "확장 방식", before: "처음부터 큰 결정을 해야 합니다.", after: "반응을 확인한 뒤 확장을 선택합니다." }
                  ].map((item) => (
                    <div key={item.label} className={`border-t pt-4 ${
                      isPinkVariant ? "border-[#f2ccd7]/50" : isYellowVariant ? "border-[#e6dfc3]/50" : "border-neutral-200"
                    }`}>
                      <h4 className={`text-sm font-black mb-3 ${
                        isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-neutral-900"
                      }`}>{item.label}</h4>
                      <div className="grid gap-2.5">
                        <div className={`rounded-lg px-4 py-3 border bg-white ${
                          isPinkVariant ? "border-[#f2ccd7]/40" : isYellowVariant ? "border-[#e6dfc3]/40" : "border-neutral-200"
                        }`}>
                          <span className={`text-[10px] font-bold tracking-wider block mb-1 ${
                            isPinkVariant ? "text-rose-400" : isYellowVariant ? "text-amber-600" : "text-neutral-400"
                          }`}>새 브랜드 전환</span>
                          <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                            isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                          }`}>{item.before}</p>
                        </div>
                        <div className={`rounded-lg px-4 py-3 flex items-center gap-3 border ${
                          isPinkVariant 
                            ? "bg-[#fff5f7] border-rose-100" 
                            : isYellowVariant 
                              ? "bg-[#fffdf2] border-[#e6dfc3]" 
                              : "bg-amber-50 border-amber-200"
                        }`}>
                          <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                            <img
                              src={isPinkVariant ? "https://res.cloudinary.com/dx7l09wwu/image/upload/f_auto,q_auto/v1779846449/logo_120pie_coffee3_jzgtyi.png" : "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186180/logo_120pie_coffee_nu2_c7tiiy_zi1pjo.png"}
                              alt="120pie 로고"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className={`text-[10px] font-bold tracking-wider block mb-1 ${
                              isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-600"
                            }`}>120pie 도입</span>
                            <p className={`text-xs sm:text-sm font-bold leading-relaxed ${
                              isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-neutral-900"
                            }`}>{item.after}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* FAQ SECTION [RICH BLACK THEME - MODERN MINIMAL ACCORDION] */}
        {/* ------------------------------------------------------------- */}
        <section className={`py-24 border-b scroll-mt-16 transition-all duration-300 ${
          isPinkVariant 
            ? "bg-[#fff5f7] text-[#4c2d3a] border-[#f2ccd7]" 
            : isYellowVariant 
              ? "bg-[#fffdf2] text-[#0d233a] border-[#e6dfc3]" 
              : "bg-neutral-950 text-white border-neutral-900"
        }`} id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-16" {...fadeIn}>
              <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
                isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"
              }`}>FAQ</span>
              <h2 className={`text-3xl sm:text-4xl font-black ${
                isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
              }`}>자주 묻는 질문</h2>
            </motion.div>

            <div className="space-y-4">
              {[
                { q: "지금 운영 중인 카페에도 도입할 수 있나요?", a: "네. 기존 매장을 크게 바꾸지 않고, 파이 메뉴를 준비하고 판매할 수 있는 작은 공간과 운영 환경을 확인한 뒤 시작할 수 있습니다. 매장 구조에 맞는 도입 방식은 상담을 통해 함께 정리해드립니다." },
                { q: "파이 조리가 어렵지는 않나요?", a: "복잡한 반죽이나 제빵 과정은 필요하지 않습니다. 준비된 생지를 보관해두었다가 주문이 들어오면 정해진 방식으로 구워, 커피와 함께 바로 제공할 수 있습니다." },
                { q: "간판이나 인테리어를 바꿔야 하나요?", a: "필수는 아닙니다. 기존 상호와 매장 분위기를 유지한 채 메뉴부터 시작할 수 있습니다. 외부 브랜드 표기나 매장 변화는 판매 반응을 확인한 뒤 필요에 따라 선택하시면 됩니다." },
                { q: "120파이만 먼저 판매해볼 수 있나요?", a: "가능합니다. 대표 메뉴인 파이부터 시작해 손님 반응을 살펴본 뒤, 에그120이나 츄러스, 핫도그, 떡볶이 같은 메뉴를 매장에 맞게 추가할 수 있습니다." },
                { q: "도입 전에 어떤 준비가 필요한가요?", a: "판매 공간, 냉동 보관과 조리가 가능한 환경, 예상 판매 메뉴를 먼저 확인합니다. 상담 시 현재 매장 사진이나 운영 상황을 바탕으로 필요한 준비 사항을 안내해드립니다." },
                { q: "나중에 120pie 매장으로 확장할 수도 있나요?", a: "네. 메뉴 도입 후 고객 반응과 운영 결과를 충분히 확인한 다음, 브랜드 표기 추가나 매장 전환 여부를 선택할 수 있습니다. 처음부터 큰 변화를 결정하실 필요는 없습니다." }
              ].map((faq, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden border transition-all ${
                    isPinkVariant 
                      ? "bg-white border-[#f2ccd7] hover:border-rose-400" 
                      : isYellowVariant 
                        ? "bg-white border-[#e6dfc3] hover:border-[#0d233a]" 
                        : "bg-neutral-900 border-neutral-850 hover:border-amber-400/35"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                    className={`w-full px-6 sm:px-8 py-5 text-left font-extrabold flex justify-between items-center transition-colors ${
                      isPinkVariant 
                        ? "text-[#4c2d3a] hover:bg-[#fff9fb]" 
                        : isYellowVariant 
                          ? "text-[#0d233a] hover:bg-[#fffdf2]" 
                          : "text-white hover:bg-neutral-850"
                    }`}
                  >
                    <span className="text-sm sm:text-base pr-4 leading-tight">{faq.q}</span>
                    <ChevronDown size={18} className={`transition-transform duration-300 shrink-0 ${
                      isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"
                    } ${openFaqIdx === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaqIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className={`px-6 sm:px-8 py-5 pt-0 text-xs sm:text-sm font-medium leading-relaxed border-t ${
                          isPinkVariant 
                            ? "text-[#7c5d6c] border-[#f2ccd7]/40 bg-[#fffbfd]/55" 
                            : isYellowVariant 
                              ? "text-[#576575] border-[#e6dfc3]/40 bg-[#fffdf2]/55" 
                              : "text-neutral-400 border-neutral-850 bg-neutral-955/40"
                        }`}>
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* FINAL CONTACT / CTA SECTION [V3 PRECISE MINI FORM INTEGRATION - PREMIUM] */}
        {/* ------------------------------------------------------------- */}
        <section id="contact" className={`py-24 relative transition-all duration-300 ${
          isPinkVariant 
            ? "bg-gradient-to-b from-[#fff5f7] to-[#fff1f4] text-[#4c2d3a]" 
            : isYellowVariant 
              ? "bg-gradient-to-b from-[#fffdf2] to-[#fff9e6] text-[#0d233a]" 
              : "bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white"
        }`}>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none ${
            isPinkVariant ? "bg-rose-400/5" : isYellowVariant ? "bg-amber-400/5" : "bg-amber-400/5"
          }`}></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className={`font-bold tracking-widest text-xs uppercase mb-2 block font-mono ${
                isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-[#0d233a]" : "text-amber-400"
              }`}>Easy Inquiry</span>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight ${
                isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
              }`}>
                우리 매장에 어울리는 디저트 메뉴,<br />편하게 상담받아 보세요
              </h2>
              <p className={`text-xs sm:text-base font-medium leading-relaxed max-w-xl mx-auto ${
                isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
              }`}>
                작은 메뉴 추가부터 브랜드 협업까지, 매장에 맞는 시작 방법을 함께 살펴봅니다. 간단한 정보를 남겨주시면 안내 자료와 상담 내용을 보내드립니다.
              </p>
            </div>

            <div className={`max-w-xl mx-auto border rounded-3xl p-6 sm:p-10 shadow-2xl relative transition-all duration-300 ${
              isPinkVariant 
                ? "bg-white border-[#f2ccd7]" 
                : isYellowVariant 
                  ? "bg-white border-[#e6dfc3]" 
                  : "bg-neutral-900 border-neutral-850"
            }`}>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 flex flex-col items-center justify-center gap-4"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-3xl shadow-lg ${
                    isPinkVariant 
                      ? "bg-rose-500 text-white shadow-rose-300/30" 
                      : isYellowVariant 
                        ? "bg-[#0d233a] text-white shadow-[#0d233a]/30" 
                        : "bg-amber-400 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.3)]"
                  }`}>
                    ✓
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-black mt-4 ${
                    isPinkVariant ? "text-[#4c2d3a]" : isYellowVariant ? "text-[#0d233a]" : "text-white"
                  }`}>문의가 잘 접수되었습니다!</h3>
                  <p className={`text-xs sm:text-sm max-w-sm font-medium leading-relaxed ${
                    isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-400"
                  }`}>
                    남겨주신 연락처로 매장 상황에 잘 맞는 메뉴 구성과 도입 방법을 차분히 안내드리겠습니다.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className={`text-xs font-bold ${
                        isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-355"
                      }`}>성함 <span className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"}>*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="홍길동 사장님"
                        required
                        className={`w-full border rounded-xl px-4 py-3 text-xs sm:text-sm transition-all duration-200 ${
                          isPinkVariant 
                            ? "bg-rose-50/20 border-[#f2ccd7] text-[#4c2d3a] placeholder-[#bca9b2] focus:outline-none focus:border-rose-400 focus:bg-white" 
                            : isYellowVariant 
                              ? "bg-[#fffdf2]/40 border-[#e6dfc3] text-[#0d233a] placeholder-[#adaba3] focus:outline-none focus:border-[#0d233a] focus:bg-white" 
                              : "bg-neutral-955 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className={`text-xs font-bold ${
                        isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-355"
                      }`}>연락처 <span className={isPinkVariant ? "text-rose-500" : isYellowVariant ? "text-amber-600" : "text-amber-400"}>*</span></label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        maxLength={13}
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="010-1234-5678"
                        required
                        className={`w-full border rounded-xl px-4 py-3 text-xs sm:text-sm transition-all duration-200 ${
                          isPinkVariant 
                            ? "bg-rose-50/20 border-[#f2ccd7] text-[#4c2d3a] placeholder-[#bca9b2] focus:outline-none focus:border-rose-400 focus:bg-white" 
                            : isYellowVariant 
                              ? "bg-[#fffdf2]/40 border-[#e6dfc3] text-[#0d233a] placeholder-[#adaba3] focus:outline-none focus:border-[#0d233a] focus:bg-white" 
                              : "bg-neutral-955 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className={`text-xs font-bold ${
                        isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-355"
                      }`}>관심 있는 도입 방식</label>
                      <select
                        name="storeType"
                        value={formData.storeType}
                        onChange={handleFormChange}
                        className={`w-full border rounded-xl px-4 py-3 text-xs sm:text-sm transition-all duration-200 appearance-none ${
                          isPinkVariant 
                            ? "bg-rose-50/20 border-[#f2ccd7] text-[#4c2d3a] focus:outline-none focus:border-rose-400 focus:bg-white" 
                            : isYellowVariant 
                              ? "bg-[#fffdf2]/40 border-[#e6dfc3] text-[#0d233a] focus:outline-none focus:border-[#0d233a] focus:bg-white" 
                              : "bg-neutral-955 border border-neutral-800 text-white focus:outline-none focus:border-amber-400"
                        }`}
                      >
                        <option value="샵인샵 도입">간단한 메뉴 추가로 시작</option>
                        <option value="브랜드 병기 도입">브랜드 안내와 함께 운영</option>
                        <option value="공동간판 제휴">함께 보이는 간판 협업</option>
                        <option value="단독 매장 전환">전용 매장으로 전환 상담</option>
                        <option value="신규 무점포/창업">새로운 매장 창업 상담</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className={`text-xs font-bold ${
                        isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-355"
                      }`}>기존 매장명 (선택)</label>
                      <input
                        type="text"
                        name="existingStoreName"
                        value={formData.existingStoreName}
                        onChange={handleFormChange}
                        placeholder="예: 마포커피 본점"
                        className={`w-full border rounded-xl px-4 py-3 text-xs sm:text-sm transition-all duration-200 ${
                          isPinkVariant 
                            ? "bg-rose-50/20 border-[#f2ccd7] text-[#4c2d3a] placeholder-[#bca9b2] focus:outline-none focus:border-rose-400 focus:bg-white" 
                            : isYellowVariant 
                              ? "bg-[#fffdf2]/40 border-[#e6dfc3] text-[#0d233a] placeholder-[#adaba3] focus:outline-none focus:border-[#0d233a] focus:bg-white" 
                              : "bg-neutral-955 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className={`text-xs font-bold ${
                      isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-355"
                    }`}>궁금하신 내용 (선택)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={3}
                      placeholder="매장 형태나 궁금한 점을 편하게 남겨주세요."
                      className={`w-full border rounded-xl px-4 py-3 text-xs sm:text-sm transition-all duration-200 resize-none ${
                        isPinkVariant 
                          ? "bg-rose-50/20 border-[#f2ccd7] text-[#4c2d3a] placeholder-[#bca9b2] focus:outline-none focus:border-rose-400 focus:bg-white" 
                          : isYellowVariant 
                            ? "bg-[#fffdf2]/40 border-[#e6dfc3] text-[#0d233a] placeholder-[#adaba3] focus:outline-none focus:border-[#0d233a] focus:bg-white" 
                            : "bg-neutral-955 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                      }`}
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="privacy" 
                      required 
                      defaultChecked 
                      className={`mt-1 ${isPinkVariant ? "accent-rose-500" : isYellowVariant ? "accent-[#0d233a]" : "accent-amber-400"}`} 
                    />
                    <label htmlFor="privacy" className={`text-[10px] leading-normal font-bold ${
                      isPinkVariant ? "text-[#7c5d6c]" : isYellowVariant ? "text-[#576575]" : "text-neutral-500"
                    }`}>
                      상담 안내를 위한 개인정보 수집 및 연락에 동의합니다. (필수)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`pink-primary-button w-full py-4 font-black text-sm sm:text-base rounded-xl transition-all hover:scale-[1.01] border-0 cursor-pointer ${
                      isPinkVariant 
                        ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_24px_rgba(244,63,94,0.3)]" 
                        : isYellowVariant 
                          ? "bg-[#0d233a] hover:bg-[#163554] text-white shadow-[0_4px_24px_rgba(13,35,58,0.3)]" 
                          : "bg-amber-400 hover:bg-amber-300 text-neutral-955 shadow-[0_4px_24px_rgba(251,191,36,0.3)]"
                    }`}
                  >
                    무료 상담 문의하기
                  </button>
                </form>
              )}

            </div>
          </div>
        </section>

      </main>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------- */}
      <Footer theme={isPinkVariant ? "pink" : isYellowVariant ? "yellow" : "black"} />

      <InquiryModal
        open={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        submitted={formSubmitted}
        isPink={isPinkVariant}
      />

      {/* ==========================================
          REAL-TIME POPUP MODAL (ON-ENTRY)
         ========================================== */}
      {showPopup && popupSettings && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn text-[#2d2026]">
          <div 
            className="w-full max-w-md bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative max-h-[85vh] animate-scaleUp text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Background visual */}
            <div 
              className={`w-full relative flex flex-col justify-end p-6 text-white ${
                popupSettings.image ? "aspect-[4/3]" : "min-h-[160px]"
              } ${
                popupSettings.image ? "" : "bg-gradient-to-tr from-[#bf3e67] to-[#f25f8a]"
              }`}
              style={popupSettings.image ? {
                backgroundImage: `url(${optimizeCloudinaryUrl(popupSettings.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              } : undefined}
            >
              {popupSettings.image && <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>}
              <div className="relative z-10 space-y-1">
                <h4 
                  className="font-black leading-snug whitespace-pre-line"
                  style={{
                    color: popupSettings.titleColor || "#ffffff",
                    fontSize: popupSettings.titleSize || "18px"
                  }}
                >
                  {popupSettings.title}
                </h4>
              </div>
            </div>

            {/* Body Description */}
            <div 
              className="p-6 overflow-y-auto font-semibold leading-relaxed whitespace-pre-line"
              style={{
                color: popupSettings.descColor || "#735965",
                fontSize: popupSettings.descSize || "12px"
              }}
            >
              {popupSettings.desc}
            </div>

            {/* Action buttons & 'Today close' bar */}
            <div className="border-t border-[#f2ccd7]/60">
              {popupSettings.link && (
                <div className="p-4 border-b border-[#f2ccd7]/40 bg-[#fff1f5]/20 text-center">
                  <button
                    onClick={() => {
                      const link = popupSettings.link;
                      if (link.startsWith("http")) {
                        window.open(link, "_blank");
                      } else {
                        // On landing, internally open consultation inquiry modal
                        setInquiryModalOpen(true);
                        popupClosedInSessionRef.current = true;
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("120_popup_closed_session", "true");
                          if (popupSettings?.title) {
                            localStorage.setItem("120_popup_closed_title", popupSettings.title);
                          }
                        }
                        setShowPopup(false);
                      }
                    }}
                    className="w-full py-3 font-extrabold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                    style={{
                      backgroundColor: popupSettings.btnBgColor || "#f25f8a",
                      color: popupSettings.btnTextColor || "#ffffff",
                      fontSize: popupSettings.btnTextSize || "12px"
                    }}
                  >
                    {popupSettings.btnText || "자세히 보기"}
                  </button>
                </div>
              )}

              {/* Close Footer bar */}
              <div className="bg-[#fff9fb] p-3 flex justify-between items-center px-5 text-[11px] font-bold text-[#735965]">
                <button
                  onClick={() => {
                    const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
                    localStorage.setItem("120_popup_closed_until", sevenDaysLater.toString());
                    popupClosedInSessionRef.current = true;
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("120_popup_closed_session", "true");
                      if (popupSettings?.title) {
                        localStorage.setItem("120_popup_closed_title", popupSettings.title);
                      }
                    }
                    setShowPopup(false);
                  }}
                  className="hover:text-[#bf3e67] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Check size={13} className="text-[#f25f8a]" /> 7일 동안 보지 않기
                </button>
                <button
                  onClick={() => {
                    popupClosedInSessionRef.current = true;
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("120_popup_closed_session", "true");
                      if (popupSettings?.title) {
                        localStorage.setItem("120_popup_closed_title", popupSettings.title);
                      }
                    }
                    setShowPopup(false);
                  }}
                  className="hover:text-red-500 font-extrabold transition-colors cursor-pointer"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          INTERACTIVE MULTI FLOATING BUTTONS
         ========================================== */}
      {/* ==========================================
          INTERACTIVE MULTI FLOATING BUTTONS
         ========================================== */}
      {floatingSettings?.isActive && (
        <>
          {/* PC View: Always visible vertically */}
          <div className={`hidden md:flex fixed bottom-6 right-6 z-[90] flex flex-col items-center gap-2.5 p-2 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.12)] border transition-all duration-300 select-none text-white ${
            isPinkVariant 
              ? "bg-[#140e11]/90 border-[#f25f8a]/20 shadow-rose-950/20" 
              : "bg-white/95 border-[#ffd500]/30 shadow-[#0d233a]/[0.05]"
          }`}>
            {/* Instagram */}
            {floatingSettings?.instaUrl && (
              <a
                href={floatingSettings.instaUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#cf2a7a] hover:bg-[#b01e63] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }} className="w-[16px] h-[16px] text-white">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>공식 인스타</span>
              </a>
            )}

            {/* Naver Blog */}
            {floatingSettings?.blogUrl && (
              <a
                href={floatingSettings.blogUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#03C75A] hover:bg-[#02b350] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: "#ffffff" }} className="w-[16px] h-[16px] text-white">
                  <path d="M16.273 19.143L8.538 9.385V19.143H4.425V4.857h4.088l7.653 9.637V4.857h4.088v14.286h-3.981z" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>네이버 블로그</span>
              </a>
            )}

            {/* Youtube */}
            {floatingSettings?.youtubeUrl && (
              <a
                href={floatingSettings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#ff0000] hover:bg-[#cc0000] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: "#ffffff" }} className="w-[16px] h-[16px] text-white">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>유튜브 채널</span>
              </a>
            )}

            {/* Phone Direct Inquiry */}
            {floatingSettings?.phoneNo && (
              <a
                href={`tel:${floatingSettings.phoneNo}`}
                className="bg-[#007aff] hover:bg-[#0062cc] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }} className="w-[16px] h-[16px] text-white">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>본사 전화문의</span>
              </a>
            )}

            {/* Kakao Talk Channel / Custom Chat link */}
            {floatingSettings?.kakaoUrl && (
              <a
                href={floatingSettings.kakaoUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#fae100] hover:bg-[#e6cf00] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border border-yellow-400"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: "#3c2929" }} className="w-[16px] h-[16px] text-[#3c2929]">
                  <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.68 2.531-.777 2.922-.12.483.18.477.38.343.155-.104 2.476-1.683 3.473-2.358.536.082 1.087.124 1.654.124 4.97 0 9-3.186 9-7.115C21 6.185 16.97 3 12 3z" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>1:1 카톡문의</span>
              </a>
            )}

            {/* Fast Chat Consultation */}
            {floatingSettings?.chatUrl && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setInquiryModalOpen(true);
                }}
                className={`p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0 ${isPinkVariant ? "bg-[#f25f8a] hover:bg-[#df4977]" : "bg-[#ffd500] hover:bg-[#e6bd00]"}`}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isPinkVariant ? "#ffffff" : "#0d233a" }} className={`w-[16px] h-[16px] ${isPinkVariant ? "text-white" : "text-[#0d233a]"}`}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>빠른 실시간 상담</span>
              </button>
            )}

            {/* View Proposal Link */}
            <a
              href="/120pie-가맹-제안서.pdf"
              download="120pie-가맹-제안서.pdf"
              className="p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
              style={{ backgroundColor: isPinkVariant ? "#f25f8a" : "#ffd500" }}
            >
              <FileText size={16} style={{ color: isPinkVariant ? "#ffffff" : "#0d233a" }} className={`w-[16px] h-[16px] ${isPinkVariant ? "text-white" : "text-[#0d233a]"}`} />
              <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>제안서 다운로드</span>
            </a>
          </div>

          {/* Mobile View: Collapsible list under "+" Button */}
          <div className="flex md:hidden fixed bottom-6 right-6 z-[90] flex-col items-center gap-3 select-none text-white">
            {floatingOpen && (
              <div className="flex flex-col items-center gap-2.5 animate-slideUp">
                {/* Instagram */}
                {floatingSettings?.instaUrl && (
                  <a
                    href={floatingSettings.instaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#cf2a7a] hover:bg-[#b01e63] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-115 active:scale-90 cursor-pointer relative group border-0"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }} className="w-[16px] h-[16px] text-white">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>공식 인스타</span>
                  </a>
                )}

                {/* Naver Blog */}
                {floatingSettings?.blogUrl && (
                  <a
                    href={floatingSettings.blogUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#03C75A] hover:bg-[#02b350] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-115 active:scale-90 cursor-pointer relative group border-0"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: "#ffffff" }} className="w-[16px] h-[16px] text-white">
                      <path d="M16.273 19.143L8.538 9.385V19.143H4.425V4.857h4.088l7.653 9.637V4.857h4.088v14.286h-3.981z" />
                    </svg>
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>네이버 블로그</span>
                  </a>
                )}

                {/* Youtube */}
                {floatingSettings?.youtubeUrl && (
                  <a
                    href={floatingSettings.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#ff0000] hover:bg-[#cc0000] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-115 active:scale-90 cursor-pointer relative group border-0"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: "#ffffff" }} className="w-[16px] h-[16px] text-white">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>유튜브 채널</span>
                  </a>
                )}

                {/* Phone Direct Inquiry */}
                {floatingSettings?.phoneNo && (
                  <a
                    href={`tel:${floatingSettings.phoneNo}`}
                    className="bg-[#007aff] hover:bg-[#0062cc] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-115 active:scale-90 cursor-pointer relative group border-0"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }} className="w-[16px] h-[16px] text-white">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>본사 전화문의</span>
                  </a>
                )}

                {/* Kakao Talk Channel / Custom Chat link */}
                {floatingSettings?.kakaoUrl && (
                  <a
                    href={floatingSettings.kakaoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#fae100] hover:bg-[#e6cf00] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-115 active:scale-90 cursor-pointer relative group border border-yellow-400"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: "#3c2929" }} className="w-[16px] h-[16px] text-[#3c2929]">
                      <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.27 6.054-.188.702-.68 2.531-.777 2.922-.12.483.18.477.38.343.155-.104 2.476-1.683 3.473-2.358.536.082 1.087.124 1.654.124 4.97 0 9-3.186 9-7.115C21 6.185 16.97 3 12 3z" />
                    </svg>
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>1:1 카톡문의</span>
                  </a>
                )}

                {/* Fast Chat Consultation */}
                {floatingSettings?.chatUrl && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setInquiryModalOpen(true);
                    }}
                    className={`p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-115 active:scale-90 cursor-pointer relative group border-0 ${isPinkVariant ? "bg-[#f25f8a] hover:bg-[#df4977]" : "bg-[#ffd500] hover:bg-[#e6bd00]"}`}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isPinkVariant ? "#ffffff" : "#0d233a" }} className={`w-[16px] h-[16px] ${isPinkVariant ? "text-white" : "text-[#0d233a]"}`}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>빠른 실시간 상담</span>
                  </button>
                )}

                {/* View Proposal Link */}
                <a
                  href="/120pie-가맹-제안서.pdf"
                  download="120pie-가맹-제안서.pdf"
                  className="p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-115 active:scale-90 cursor-pointer relative group border-0"
                  style={{ backgroundColor: isPinkVariant ? "#f25f8a" : "#ffd500" }}
                >
                  <FileText size={16} style={{ color: isPinkVariant ? "#ffffff" : "#0d233a" }} className={`w-[16px] h-[16px] ${isPinkVariant ? "text-white" : "text-[#0d233a]"}`} />
                  <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>제안서 다운로드</span>
                </a>
              </div>
            )}

            {/* Floating Trigger button for Mobile */}
            <button
              onClick={() => setFloatingOpen(!floatingOpen)}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-105 active:scale-95 cursor-pointer border-0 ${
                isPinkVariant
                  ? "bg-gradient-to-tr from-[#bf3e67] to-[#f25f8a] shadow-[0_4px_12px_rgba(242,95,138,0.35)]"
                  : "bg-gradient-to-tr from-[#ffd500] to-[#ffc400] shadow-[0_4px_12px_rgba(255,213,0,0.35)]"
              }`}
            >
              <Plus size={18} className={`transition-transform duration-300 ${floatingOpen ? "rotate-45" : ""}`} style={{ color: isPinkVariant ? "#ffffff" : "#0d233a" }} />
            </button>
          </div>
        </>
      )}



    </div>
  );
}
