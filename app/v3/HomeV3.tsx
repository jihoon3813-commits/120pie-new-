"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
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
  X,
  ArrowUpRight,
  Menu,
  Camera,
  Video,
  Phone,
  MessageCircle,
  Plus,
  MessageSquare
} from "lucide-react";

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

// 1. [MENU DETAIL MODAL] - V3 프리미엄 Glassmorphism 버전
function MenuModal({ menuId, onClose, onInquiry }: { menuId: string | null, onClose: () => void, onInquiry: () => void }) {
  if (!menuId) return null;

  const details: Record<string, { title: string, desc: string, items: { name: string, desc: string, img: string }[] }> = {
    "120겹파이": {
      title: "커피와 함께 즐기기 좋은 대표 메뉴, 120파이",
      desc: "고소한 크림 파이부터 든든한 미트와 피자 파이까지, 손님의 취향과 시간대에 맞춰 폭넓게 제안할 수 있는 120파이 메뉴입니다.",
      items: [
        { name: "로제미트파이", desc: "부드러운 로제 소스와 든든한 미트가 어우러진 식사형 파이입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg" },
        { name: "블루베리파이", desc: "상큼한 블루베리 풍미가 바삭한 파이와 어울리는 달콤한 디저트입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%ED%8C%8C%EC%9D%B4_tnfg8c.jpg" },
        { name: "콘치즈파이", desc: "고소한 옥수수와 치즈의 조합으로 누구나 편하게 즐기기 좋은 메뉴입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_qvb2u5.jpg" },
        { name: "흑임자파이", desc: "진한 흑임자 크림의 고소함을 담아 커피와 잘 어울리는 파이입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%ED%9D%91%EC%9E%84%EC%9E%90%ED%81%AC%EB%A6%BC_g0p6sk.jpg" },
        { name: "커스터드파이", desc: "부드럽고 달콤한 커스터드 크림을 채운 클래식 디저트 파이입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%93%9C%ED%8C%8C%EC%9D%B4_b0flce.jpg" },
        { name: "불고기파이", desc: "달큰한 불고기 풍미를 담아 간단한 한 끼로도 든든한 메뉴입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EB%B6%88%EA%B3%A0%EA%B8%B0%ED%8C%8C%EC%9D%B41_ezthee.jpg" },
        { name: "두바이쫀득파이", desc: "고소하고 쫀득한 식감이 매력적인 특별한 디저트 파이입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EB%91%90%EB%B0%94%EC%9D%B4%EC%AA%BD%EB%93%9D%ED%8C%8C%EC%9D%B4_vjl5zb.jpg" },
        { name: "애플파이", desc: "달콤한 사과 풍미로 따뜻한 커피와 편안하게 곁들이기 좋습니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_yurkh5.jpg" },
        { name: "팥치즈파이", desc: "달콤한 팥과 담백한 치즈가 만나 익숙하면서도 새로운 맛을 전합니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%ED%8C%A5%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_wa1gif.jpg" },
        { name: "크림치즈파이", desc: "산뜻한 크림치즈의 부드러움을 바삭한 결 사이에 담았습니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_oryqml.jpg" },
        { name: "망고파이", desc: "달콤하고 향긋한 망고의 풍미가 돋보이는 산뜻한 디저트입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EB%A7%9D%EA%B3%A0%ED%8C%8C%EC%9D%B4_x97swe.jpg" },
        { name: "페퍼로니피자파이", desc: "페퍼로니와 치즈의 익숙한 풍미로 간식과 식사 모두 잘 어울립니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760052/%ED%8E%98%ED%8D%BC%EB%A1%9C%EB%8B%88%ED%94%BC%EC%9E%90%ED%8C%8C%EC%9D%B4_naduul.jpg" },
        { name: "고구마파이", desc: "달콤하고 포근한 고구마 맛으로 남녀노소 편하게 즐길 수 있습니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760052/%EA%B3%A0%EA%B5%AC%EB%A7%88%ED%8C%8C%EC%9D%B4_gms5db.jpg" },
        { name: "함박치즈파이", desc: "육즙 가득한 함박과 치즈를 담아 든든함을 더한 파이입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760052/%ED%95%A8%EB%B0%95%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_fgxgld.jpg" },
        { name: "포테이토베이컨피자파이", desc: "포테이토와 베이컨, 치즈를 풍성하게 담은 인기 피자 파이입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760054/%ED%8F%AC%ED%85%8C%EC%9D%B4%ED%86%A0%EB%B2%A0%EC%9D%B4%EC%BB%A8%ED%94%BC%EC%9E%90%ED%8C%8C%EC%9D%B4_ccdena.jpg" },
        { name: "불고기피자파이", desc: "달콤짭조름한 불고기와 치즈가 어우러진 든든한 피자 파이입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760054/%EB%B6%88%EA%B3%A0%EA%B8%B0%ED%94%BC%EC%9E%90%ED%8C%8C%EC%9D%B4_aadfep.jpg" },
        { name: "고구마베이컨피자파이", desc: "달콤한 고구마와 짭조름한 베이컨으로 풍성하게 즐기는 메뉴입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760129/%EA%B3%A0%EA%B5%AC%EB%A7%88%EB%B2%A0%EC%9D%B4%EC%BB%A8%ED%94%BC%EC%9E%90%ED%8C%8C%EC%9D%B4_tnz2js.jpg" }
      ]
    },
    "에그120": {
      title: "폭신하고 부드러운 간식, 에그120 계란빵",
      desc: "폭신한 계란빵에 고소한 계란과 다채로운 토핑을 더했습니다. 커피와 함께 가볍게 즐기기 좋은, 따뜻하고 친근한 간식 메뉴입니다.",
      items: [
        { name: "오리지널 계란빵", desc: "추억 속 계란빵의 따뜻한 맛을 요즘 감성으로 담아낸 시그니처 메뉴입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg" },
        { name: "베이컨 계란빵", desc: "짭짤하고 고소한 베이컨과 담백한 계란이 잘 어우러지는 든든한 메뉴입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761728/%EB%B2%A0%EC%9D%B4%EC%BB%A8%EA%B3%84%EB%9E%80%EB%B9%B52_ar10w0.jpg" },
        { name: "커스터드 계란빵", desc: "달콤하고 부드러운 크림이 담백한 계란빵과 만나 사르르 녹는 디저트입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%93%9C%EA%B3%84%EB%9E%80%EB%B9%B52_xbfcpj.jpg" },
        { name: "콘버터 계란빵", desc: "달콤한 옥수수와 고소한 버터가 더해져 풍성하게 즐길 수 있습니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761730/%EC%BD%98%EB%B2%84%ED%84%B0%EA%B3%84%EB%9E%80%EB%B9%B52_pichzu.jpg" },
        { name: "로제미트 계란빵", desc: "부드러운 로제소스와 계란의 조합으로 진하고 크리미한 풍미를 전합니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761728/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8_na0cok.jpg" },
        { name: "통모짜 계란빵", desc: "쭉 늘어나는 모짜렐라 치즈가 더해져 고소하고 짭짤하게 즐길 수 있습니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%ED%86%B5%EB%AA%A8%EC%A7%9C_sqieu3.jpg" },
        { name: "슈크림 계란빵", desc: "달콤하고 부드러운 슈크림이 계란의 고소함과 어우러지는 간식입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761728/%EC%8A%88%ED%81%AC%EB%A6%BC_gbhnz2.jpg" },
        { name: "팥 계란빵", desc: "달콤한 팥앙금과 고소한 계란이 만나 포근한 단맛을 느낄 수 있습니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761728/%ED%8C%A5_pezeff.jpg" },
      ]
    },
    "기타": {
      title: "달콤한 간식부터 든든한 한 입까지, 사이드 메뉴",
      desc: "스페인 정통 찹쌀 츄러스와 떡볶이 삼총사, 직화불고기 핫도그까지. 매장의 시간대와 손님 취향에 맞춰 다채롭게 제안할 수 있습니다.",
      items: [
        { name: "오리지널 츄러스", desc: "쫀득한 찹쌀 식감과 바삭한 겉결을 살린, 커피와 잘 어울리는 기본 츄러스입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762878/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_koyjlk.jpg" },
        { name: "녹차 츄러스", desc: "은은한 녹차 향과 담백한 단맛으로 깔끔하게 즐기기 좋은 츄러스입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762877/%EB%85%B9%EC%B0%A8_yucndq.jpg" },
        { name: "슈가 츄러스", desc: "달콤한 슈가 코팅을 더해 한입마다 기분 좋은 바삭함을 전합니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762877/%EC%8A%88%EA%B0%80_tf4jni.jpg" },
        { name: "오레오 츄러스", desc: "달콤한 쿠키 풍미를 더해 디저트로 더욱 즐겁게 맛볼 수 있습니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762878/%EC%98%A4%EB%A0%88%EC%98%A4_k9ea73.jpg" },
        { name: "국물 떡볶이", desc: "달콤하면서도 매콤한 국물 한입에 자꾸 생각나는 중독적인 떡볶이입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762984/%EA%B5%AD%EB%AC%BC%EB%96%A1%EB%B3%B6%EC%9D%B4_ue9q3m.jpg" },
        { name: "로제짜장 떡볶이", desc: "짜장에 로제를 더해 부드럽고 진한 맛을 즐길 수 있는 색다른 떡볶이입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762983/%EB%A1%9C%EC%A0%9C%EC%A7%9C%EC%9E%A5%EB%96%A1%EB%B3%B6%EC%9D%B4_t3zxcd.jpg" },
        { name: "로제 떡볶이", desc: "고소한 크림에 달달매콤한 풍미가 더해져 부드럽게 즐길 수 있습니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762983/%EB%A1%9C%EC%A0%9C%EB%96%A1%EB%B3%B6%EC%9D%B4_zl0ran.jpg" },
        { name: "직화불고기 핫도그", desc: "불향 가득한 직화불고기와 육즙 있는 소시지가 어우러진 든든한 메뉴입니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762930/%EC%A7%81%ED%99%94%EB%B6%88%EA%B3%A0%EA%B8%B0_khx8qf.jpg" }
      ]
    }
  };

  const data = details[menuId];

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
                  <div className="h-44 overflow-hidden relative bg-neutral-950">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-extrabold text-white text-base mb-1.5">{item.name}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 sm:p-6 bg-neutral-900 text-center border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <span className="text-[10px] sm:text-xs text-neutral-400 font-bold">메뉴 구성과 판매 방식은 매장 상황에 맞춰 안내해드립니다.</span>
            <button type="button" onClick={() => { onClose(); onInquiry(); }} className="pink-primary-button w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-lg transition-colors text-xs shadow-[0_4px_16px_rgba(251,191,36,0.25)]">
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
  submitted
}: {
  open: boolean;
  onClose: () => void;
  formData: InquiryFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitted: boolean;
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
          className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
        >
          <button type="button" onClick={onClose} aria-label="닫기" className="absolute top-5 right-5 text-neutral-400 hover:text-white bg-neutral-800/80 rounded-full p-2.5 z-10 transition-colors">
            <X size={18} />
          </button>
          <div className="p-7 sm:p-9 border-b border-neutral-800 text-center">
            <span className="text-amber-400 font-bold tracking-widest text-[10px] uppercase block mb-2 font-mono">Easy Inquiry</span>
            <h3 className="text-2xl font-black text-white mb-2">편하게 상담받아 보세요</h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium">매장에 잘 맞는 메뉴 구성과 시작 방법을 안내드립니다.</p>
          </div>
          {submitted ? (
            <div className="p-10 text-center">
              <h4 className="text-xl font-black text-white mb-3">문의가 잘 접수되었습니다!</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">남겨주신 연락처로 편하게 안내드리겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="성함" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400" />
                <input type="tel" inputMode="numeric" autoComplete="tel" maxLength={13} name="phone" value={formData.phone} onChange={onChange} placeholder="연락처" required className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400" />
              </div>
              <select name="storeType" value={formData.storeType} onChange={onChange} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 appearance-none">
                <option value="샵인샵 도입">간단한 메뉴 추가로 시작</option>
                <option value="브랜드 병기 도입">브랜드 안내와 함께 운영</option>
                <option value="공동간판 제휴">함께 보이는 간판 협업</option>
                <option value="단독 매장 전환">전용 매장으로 전환 상담</option>
                <option value="신규 무점포/창업">새로운 매장 창업 상담</option>
              </select>
              <textarea name="message" value={formData.message} onChange={onChange} rows={3} placeholder="매장 형태나 궁금한 점을 편하게 남겨주세요." className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 resize-none" />
              <label className="flex items-start gap-2 text-[10px] text-neutral-500 font-bold">
                <input type="checkbox" required defaultChecked className="mt-0.5 accent-amber-400" />
                상담 안내를 위한 개인정보 수집 및 연락에 동의합니다. (필수)
              </label>
              <button type="submit" className="pink-primary-button w-full py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm rounded-xl transition-colors shadow-[0_4px_24px_rgba(251,191,36,0.3)]">
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
            <img src={data.img} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" alt="" />
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
  { name: "로제미트파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_khogbn.jpg" },
  { name: "블루베리파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%ED%8C%8C%EC%9D%B4_tnfg8c.jpg" },
  { name: "콘치즈파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_qvb2u5.jpg" },
  { name: "흑임자크림파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760050/%ED%9D%91%EC%9E%84%EC%9E%90%ED%81%AC%EB%A6%BC_g0p6sk.jpg" },
  { name: "커스터드파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%93%9C%ED%8C%8C%EC%9D%B4_b0flce.jpg" },
  { name: "불고기파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EB%B6%88%EA%B3%A0%EA%B8%B0%ED%8C%8C%EC%9D%B41_ezthee.jpg" },
  { name: "두바이쫀득파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EB%91%90%EB%B0%94%EC%9D%B4%EC%AA%BD%EB%93%9D%ED%8C%8C%EC%9D%B4_vjl5zb.jpg" },
  { name: "애플시나몬파이", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779760051/%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_yurkh5.jpg" },
  { name: "오리지널 계란빵", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779761729/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90%EA%B3%84%EB%9E%80%EB%B9%B52_kdqsqv.jpg" },
  { name: "오리지널 츄러스", src: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779762878/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_koyjlk.jpg" }
];

// V3 StoresPreviewSection
function StoresPreviewSection({ isPink = false }: { isPink?: boolean }) {
  const previewStores = [
    { name: "120겹파이 AK플라자 금정점", region: "경기 군포시 엘에스로 143 1층 1001호", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772271/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_AK%ED%94%8C%EB%9D%BC%EC%9E%90_%EA%B8%88%EC%A0%95%EC%A0%90_%EA%B2%BD%EA%B8%B0_%EA%B5%B0%ED%8F%AC%EC%8B%9C_%EC%97%98%EC%97%90%EC%8A%A4%EB%A1%9C_143_1%EC%B8%B5_1001%ED%98%B8_qcmpgs.jpg" },
    { name: "120겹파이 본점", region: "서울 성북구 돌곶이로14길 35 1층", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772271/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%B3%B8%EC%A0%90_%EC%84%9C%EC%9A%B8_%EC%84%B1%EB%B6%81%EA%B5%AC_%EB%8F%8C%EA%B3%B6%EC%9D%B4%EB%A1%9C14%EA%B8%B8_35_1%EC%B8%B5_k9mjon.jpg" },
    { name: "120겹파이 삼산점", region: "인천 부평구 장제로228번길 24", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772272/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%82%BC%EC%82%B0%EC%A0%90_%EC%9D%B8%EC%B2%9C_%EB%B6%80%ED%8F%89%EA%B5%AC_%EC%9E%A5%EC%A0%9C%EB%A1%9C228%EB%B2%88%EA%B8%B8_24_o9q4qy.jpg" },
  ];

  return (
    <section className="py-24 bg-white text-neutral-900 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-14 gap-8">
          <div className="max-w-3xl">
            <span className="text-neutral-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">
              Stores
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-950 leading-tight mb-4">
              가까운 곳에서 만나는<br />120pie 매장
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-bold leading-relaxed max-w-xl">
              일상 가까운 곳에서 만날 수 있는 120겹파이 매장을 소개합니다.
            </p>
          </div>
          <Link href={isPink ? "/stores?theme=pink" : "/stores?theme=black"} className="inline-flex items-center gap-2 text-sm font-bold text-neutral-700 hover:text-amber-600 transition-colors shrink-0">
            전체 매장 보기 <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mobile-horizontal-cards grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewStores.map((store, i) => (
            <article key={i} className="group border-t border-neutral-200 pt-5">
              <div className="h-56 overflow-hidden rounded-xl bg-neutral-100 mb-5">
                <img src={store.img} alt={store.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              </div>
              <h3 className="font-black text-xl text-neutral-950 mb-2">{store.name}</h3>
              <div className="text-neutral-500 font-bold text-xs sm:text-sm flex items-center gap-1.5">
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
function OwnerSystemSection() {
  return (
    <section className="py-24 bg-[#fffaf1] text-neutral-900 border-b border-amber-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          <div className="lg:col-span-6">
            <span className="text-amber-700 font-bold tracking-widest text-xs mb-2 block uppercase font-mono">
              Partner Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-neutral-950 leading-tight">
              사장님은 매장 운영에<br />집중하세요.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mb-10 font-bold leading-relaxed max-w-xl">
              재료 발주부터 문의 응대, 홍보 자료까지 필요한 업무를 한곳에서 확인할 수 있도록 지원합니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="border-t border-amber-200 pt-5">
                <Package size={19} className="text-amber-600 mb-4" />
                <h4 className="font-extrabold text-neutral-950 text-sm mb-2">간편 발주</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium">필요한 재료를 손쉽게 주문합니다.</p>
              </div>
              <div className="border-t border-amber-200 pt-5">
                <Headphones size={19} className="text-amber-600 mb-4" />
                <h4 className="font-extrabold text-neutral-950 text-sm mb-2">문의 지원</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium">운영 중 궁금한 점을 바로 문의합니다.</p>
              </div>
              <div className="border-t border-amber-200 pt-5">
                <Monitor size={19} className="text-amber-600 mb-4" />
                <h4 className="font-extrabold text-neutral-950 text-sm mb-2">홍보 자료</h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium">매장에 필요한 안내물을 제공합니다.</p>
              </div>
            </div>

            <div>
              <Link href="/portal" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-800 hover:text-amber-700 transition-colors">
                점주 지원 살펴보기 <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white">
              <video
                src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779775703/120pie_%EC%8B%9C%EC%8A%A4%ED%85%9C_vda0xm.mp4"
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
function GallerySection({ filter, setFilter }: { filter: string, setFilter: (t: string) => void }) {
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
      return galleryItems.slice(0, 8);
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

  const limit = isMobile ? 8 : 16;
  const visibleImages = filteredImages.slice(0, limit);

  return (
    <section className="py-24 bg-white text-neutral-900 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-neutral-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Gallery</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-neutral-950 leading-tight">
            매장과 메뉴의<br />실제 모습을 확인하세요.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-bold max-w-xl leading-relaxed">
            본사 공식 어드민 갤러리에 등록된 실제 매장과 메뉴, 연출 컷을 실시간으로 확인하실 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12 border-b border-neutral-200 pb-5">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-md font-bold text-xs transition-colors ${filter === t
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100"
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 4x4 (desktop) / 2x4 (mobile) grid layout */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-6 sm:gap-y-10">
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
                <div className="aspect-[4/3] bg-neutral-100 rounded-xl overflow-hidden mb-4 relative shadow-sm hover:shadow transition-all group-hover:shadow-md">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
                <span className="text-amber-600 text-[10px] font-bold uppercase tracking-wider mb-2 block font-mono">{img.category}</span>
                <h4 className="text-neutral-950 font-extrabold text-sm leading-tight line-clamp-1">{img.name}</h4>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View More Trigger Button */}
        {(filter === "대표" ? galleryItems.length > visibleImages.length : filteredImages.length > limit) && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowMoreModal(true)}
              className="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center gap-2 border border-neutral-900"
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
              className="bg-white border border-[#f2ccd7]/50 rounded-3xl w-full max-w-5xl overflow-hidden relative shadow-[0_20px_50px_rgba(191,62,103,0.15)] my-auto flex flex-col max-h-[85vh] sm:max-h-[80vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#f2ccd7]/15 bg-gradient-to-r from-neutral-950 via-[#271018] to-neutral-950 flex justify-between items-center shrink-0 relative overflow-hidden">
                {/* Glowing decorative gradient accent overlay */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#f25f8a] via-amber-400 to-[#f25f8a]"></div>
                <div className="relative z-10">
                  <span className="inline-block px-2.5 py-0.5 rounded bg-gradient-to-r from-[#f25f8a] to-amber-500 text-white text-[9px] font-black uppercase tracking-wider mb-1 shadow-sm">
                    {filter === "대표" ? "120PIE PORTFOLIO" : `${filter.toUpperCase()} GALLERY`}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    {filter === "대표" ? (
                      <>대표 이미지 및 전체 갤러리</>
                    ) : (
                      <>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f25f8a] to-amber-400">
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
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-[#fffbfb] menu-modal-scroll max-h-[60vh]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                  {modalImages.map(img => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className="bg-white rounded-2xl overflow-hidden border border-[#f2ccd7]/35 shadow-sm hover:border-[#f25f8a]/50 hover:shadow-md transition-all cursor-zoom-in group"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative bg-[#fffbfb]">
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-550" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-4 bg-white">
                        <span className="text-[#f25f8a] text-[10px] font-extrabold uppercase tracking-wider block mb-1 font-mono">{img.category}</span>
                        <h4 className="font-extrabold text-[#735965] text-xs leading-snug line-clamp-1">{img.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 bg-white border-t border-[#f2ccd7]/30 text-center shrink-0 flex items-center justify-between gap-4">
                <span className="text-[10px] text-[#735965] font-bold">
                  총 {modalImages.length}개의 실제 도입 이미지 및 연출 컷이 등록되어 있습니다.
                </span>
                <button
                  onClick={() => setShowMoreModal(false)}
                  className="px-6 py-2 bg-white border border-[#f2ccd7] hover:border-[#f25f8a] text-[#f25f8a] hover:bg-[#fff9fb] font-extrabold text-xs rounded-xl transition-all shadow-sm hover:scale-[1.01] active:scale-95 cursor-pointer"
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
              className="relative max-w-5xl w-full max-h-[85dvh] flex flex-col items-center justify-center bg-neutral-950/40 rounded-2xl overflow-hidden border border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] cursor-default"
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-[72dvh] sm:max-h-[75vh] object-contain block"
              />
              <div className="w-full bg-neutral-950/80 px-6 py-4 border-t border-neutral-850 backdrop-blur-md text-left flex flex-col gap-1 shrink-0">
                <span className="text-amber-400 font-bold tracking-widest text-[10px] uppercase font-mono">{selectedImage.category}</span>
                <h3 className="text-sm sm:text-base font-extrabold text-white">{selectedImage.name}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function HomeV3({ variant = "v3" }: { variant?: "v3" | "v4" }) {
  const isPinkVariant = variant === "v4";
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

  useEffect(() => {
    const video = mobileHeroVideoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, [isPinkVariant]);

  // Convex Hooks
  const convexPopup = useQuery(api.popups.get);
  const convexFloating = useQuery(api.floatings.get);
  const addInquiry = useMutation(api.inquiries.add);

  // Dynamic Popup & Floating data loading synced with Convex (fallback to localStorage if not yet loaded)
  useEffect(() => {
    if (popupClosedInSessionRef.current) return;

    if (convexPopup) {
      setPopupSettings(convexPopup);
      if (convexPopup.isActive) {
        const closedDate = localStorage.getItem("120_popup_closed_date");
        const todayStr = new Date().toISOString().split("T")[0];
        if (closedDate !== todayStr) {
          setShowPopup(true);
        }
      }
    } else {
      if (typeof window !== "undefined") {
        const storedPop = localStorage.getItem("120_popups");
        if (storedPop) {
          try {
            const parsed = JSON.parse(storedPop);
            setPopupSettings(parsed);
            if (parsed.isActive) {
              const closedDate = localStorage.getItem("120_popup_closed_date");
              const todayStr = new Date().toISOString().split("T")[0];
              if (closedDate !== todayStr) {
                setShowPopup(true);
              }
            }
          } catch (e) {}
        }
      }
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

  return (
    <div id={isPinkVariant ? "landing-v4" : "landing-v3"} className="flex flex-col w-full bg-[#0a0a0a] text-neutral-200 scroll-smooth overflow-x-hidden font-sans antialiased">

      {/* ------------------------------------------------------------- */}
      {/* HEADER (Sticky Minimal Tri-Tone) */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/95 border-b border-neutral-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[94px] gap-3">
          <div className="shrink-0 py-2">
            <Link className="flex items-center group shrink-0" href={isPinkVariant ? "/" : "/v3"} aria-label="120pie 홈으로 이동">
              <img
                src={isPinkVariant ? "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779846449/logo_120pie_coffee3_jzgtyi.png" : "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779845741/logo_120pie_coffee_nu_woul37.png"}
                alt="120pie & coffee"
                className="h-5.5 sm:h-7 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-[11px] xl:text-sm font-bold text-neutral-400">
            <a href="#why" className="hover:text-amber-400 transition-colors">도입 가치</a>
            <a href="#structure" className="hover:text-amber-400 transition-colors">브랜드 구조</a>
            <a href="#menu" className="hover:text-amber-400 transition-colors">메뉴 카탈로그</a>
            <a href="#simulator" className="hover:text-amber-400 transition-colors">수익 시뮬레이터</a>
            <a href="#adoption" className="hover:text-amber-400 transition-colors">도입 방식 &amp; 성공사례</a>
            <Link href={isPinkVariant ? "/stores?theme=pink" : "/stores?theme=black"} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center rounded-full border border-neutral-800 bg-neutral-900/60 p-0.5 text-[10px] font-black">
              <Link href="/" className={`rounded-full px-2 py-1 transition-colors ${isPinkVariant ? "landing-theme-active bg-amber-400 text-white" : "text-neutral-400 hover:text-white"}`}>
                핑크
              </Link>
              <Link href="/v3" className={`rounded-full px-2 py-1 transition-colors ${!isPinkVariant ? "landing-theme-active bg-amber-400 text-neutral-950" : "text-neutral-400 hover:text-amber-400"}`}>
                블랙
              </Link>
            </div>
            <Link className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-bold text-neutral-350 hover:bg-neutral-800 hover:text-white transition-colors" href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            <button type="button" onClick={() => setInquiryModalOpen(true)} className="pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 text-xs sm:text-sm font-black hover:bg-amber-300 hover:scale-[1.02] transition-all shadow-[0_4px_16px_rgba(251,191,36,0.2)]">
              상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
            </button>
            <button
              type="button"
              className="pink-primary-button lg:hidden inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2.5 text-xs font-black text-neutral-950"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-landing-nav"
              onClick={() => setMobileNavOpen(open => !open)}
            >
              {mobileNavOpen ? <X size={15} /> : <Menu size={15} />}
              {mobileNavOpen ? "닫기" : "더보기"}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className="lg:hidden border-t border-neutral-900/60 px-4 pb-4 pt-3 bg-neutral-950/95">
            <div className="grid grid-cols-2 gap-2 text-sm font-bold text-neutral-500">
              {[
                { label: "도입 가치", href: "#why" },
                { label: "브랜드 구조", href: "#structure" },
                { label: "메뉴 카탈로그", href: "#menu" },
                { label: "수익 시뮬레이터", href: "#simulator" },
                { label: "도입 방식", href: "#adoption" },
                { label: "FAQ", href: "#faq" }
              ].map(item => (
                <a key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)} className="rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 hover:text-amber-400 transition-colors">
                  {item.label}
                </a>
              ))}
              <Link href={isPinkVariant ? "/stores?theme=pink" : "/stores?theme=black"} className="rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 hover:text-amber-400 transition-colors">
                가맹점 현황
              </Link>
              <Link href="/portal" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-3 hover:text-amber-400 transition-colors">
                점주전용
              </Link>
            </div>
            <button type="button" onClick={() => { setMobileNavOpen(false); setInquiryModalOpen(true); }} className="pink-primary-button mt-3 flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-3.5 text-sm font-black text-neutral-950">
              상담 신청 <ArrowRight size={15} className="ml-1.5" />
            </button>
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
                      ? "https://res.cloudinary.com/dx7l09wwu/video/upload/v1779806053/120pie_%EC%98%81%EC%83%81_6_qlxvav.mp4"
                      : "https://res.cloudinary.com/dx7l09wwu/video/upload/v1779779154/120pie_%EC%98%81%EC%83%81_7_xoo7il.mp4"}
                    poster={isPinkVariant
                      ? "https://res.cloudinary.com/dx7l09wwu/video/upload/so_0,f_jpg,q_auto/v1779806053/120pie_%EC%98%81%EC%83%81_6_qlxvav.jpg"
                      : "https://res.cloudinary.com/dx7l09wwu/video/upload/so_0,f_jpg,q_auto/v1779779154/120pie_%EC%98%81%EC%83%81_7_xoo7il.jpg"}
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
                  <button type="button" onClick={() => setInquiryModalOpen(true)} className="pink-primary-button w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-amber-400 text-neutral-950 font-black rounded-xl hover:bg-amber-300 transition-all shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:scale-[1.02]">
                    리모델링 견적 문의 <ArrowRight size={18} className="ml-2" />
                  </button>
                  <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-neutral-900 border border-neutral-800 text-white font-extrabold rounded-xl hover:bg-neutral-800 transition-colors" href="#simulator">
                    내 매장 수익 시뮬레이션
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-2 w-full max-w-sm mx-auto sm:flex sm:flex-wrap sm:max-w-none sm:mx-0">
                  <span className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-[11px] sm:text-xs font-bold text-neutral-350 text-center whitespace-nowrap">#1,000만원대 소자본 전환</span>
                  <span className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-[11px] sm:text-xs font-bold text-neutral-350 text-center whitespace-nowrap">#5분 굽기 초간편 조리</span>
                  <span className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-[11px] sm:text-xs font-bold text-neutral-350 text-center whitespace-nowrap">#폐기율 0% 콜드 생지</span>
                  <span className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-[11px] sm:text-xs font-bold text-neutral-350 text-center whitespace-nowrap">#홀·포장·배달 올라운드</span>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-neutral-900/80 pt-8 mt-6">
                  <div className="bg-neutral-900/40 border border-neutral-850 p-4 rounded-xl flex flex-col justify-center text-center">
                    <strong className="text-2xl sm:text-3xl font-black text-amber-400 mb-1">5분</strong>
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
                    ? "https://res.cloudinary.com/dx7l09wwu/video/upload/v1779806053/120pie_%EC%98%81%EC%83%81_6_qlxvav.mp4"
                    : "https://res.cloudinary.com/dx7l09wwu/video/upload/v1779779154/120pie_%EC%98%81%EC%83%81_7_xoo7il.mp4"}
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
        <section className="py-24 bg-neutral-950 text-white border-b border-neutral-900/80 relative" id="why">
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Why 120pie Hybrid</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                지금의 카페에 자연스럽게 더해지는,<br />
                기분 좋은 <span className="text-amber-400">디저트 메뉴</span>를 제안합니다.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-bold leading-relaxed max-w-xl">
                120겹 파이와 에그120을 매장과 배달 메뉴에 편안하게 더해, 고객에게는 새로운 선택을, 사장님께는 든든한 매출 기회를 전합니다.
              </p>
            </motion.div>

            {/* Bento Grid: 4 Alternating Pairs (Total 8 Cards: 4 Text Cards + 4 Video Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">

              {/* PAIR 1 (Set Menu): Text (7 cols) */}
              <motion.article
                className={`md:col-span-7 bg-neutral-900/60 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between transition-colors bento-text-card ${
                  isPinkVariant ? "hover:border-pink-400/40" : "hover:border-amber-400/40"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">커피와 잘 어울리는 세트 메뉴로 한 잔의 만족을 더합니다</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                    아메리카노에 120겹 파이 또는 에그120을 함께 제안해 보세요. 고객은 간편하게 디저트를 즐기고, 매장은 자연스럽게 주문 구성을 넓힐 수 있습니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#커피와 좋은 조합</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#간편한 세트 구성</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#새로운 매출 기회</span>
                </div>
              </motion.article>

              {/* PAIR 1 (Set Menu): Video Card (5 cols) */}
              <motion.div
                className="md:col-span-5 bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden relative shadow-lg min-h-[280px]"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <video
                  src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779805753/120pie_%EC%98%81%EC%83%81_3_exaslh.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="120겹 파이 세트 메뉴 영상"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.2] hover:scale-[1.23] transition-all duration-500 opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isPinkVariant ? "from-pink-950/20 via-transparent to-transparent" : "from-neutral-950 via-neutral-950/20 to-transparent"}`}></div>
              </motion.div>

              {/* PAIR 2 (Shop in Shop): Image Card (5 cols) */}
              <motion.div
                className="md:col-span-5 bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden relative shadow-lg min-h-[280px]"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img
                  src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779808274/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%95%A0%ED%94%8C_%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EC%97%B0%EC%B6%9C_rrdtor.jpg"
                  alt="120겹 파이 크림치즈 애플 블루베리 연출"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-[1.05] transition-all duration-500 opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isPinkVariant ? "from-pink-950/20 via-transparent to-transparent" : "from-neutral-950 via-neutral-950/20 to-transparent"}`}></div>
              </motion.div>

              {/* PAIR 2 (Shop in Shop): Text Card (7 cols) */}
              <motion.article
                className={`md:col-span-7 bg-neutral-900/60 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between transition-colors bento-text-card ${
                  isPinkVariant ? "hover:border-pink-400/40" : "hover:border-amber-400/40"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">지금 매장의 아름다운 분위기 그대로 시작하는 샵인샵</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                    큰 리모델링 철거 공사나 값비싼 브랜드 간판 전면 교체 없이도, 기존의 소중한 단골 고객과 개인 카페 인테리어 정체성을 온전히 지키며 가볍게 120겹 파이와 에그120을 도입할 수 있습니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#기존 공간 극대화</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#간편한 쇼케이스 셋업</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#듀얼 브랜딩 시너지</span>
                </div>
              </motion.article>

              {/* PAIR 3 (Easy Cooking): Text Card (7 cols) */}
              <motion.article
                className={`md:col-span-7 bg-neutral-900/60 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between transition-colors bento-text-card ${
                  isPinkVariant ? "hover:border-pink-400/40" : "hover:border-amber-400/40"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">누구나 5분이면 완벽한 맛을 재현하는 초간편 시스템</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                    전문적인 제과 기술이나 주방 설비 가중이 전혀 필요 없습니다. 본사에서 공급받은 냉동 생지를 간편하게 전용 미니 오븐에 넣고 타이머 스위치만 누르면 갓 구워낸 프리미엄 바삭함을 고객에게 즉시 제공합니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#초간편 5분 조리</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#작업 동선 최소화</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#원터치 퀄리티 일관성</span>
                </div>
              </motion.article>

              {/* PAIR 3 (Easy Cooking): Video Card (5 cols) */}
              <motion.div
                className="md:col-span-5 bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden relative shadow-lg min-h-[280px]"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img
                  src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779721204/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_du1czf.jpg"
                  alt="120겹 파이 초간편 5분 조리 연출"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-[1.05] transition-all duration-500 opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isPinkVariant ? "from-pink-950/20 via-transparent to-transparent" : "from-neutral-950 via-neutral-950/20 to-transparent"}`}></div>
              </motion.div>

              {/* PAIR 4 (Zero Waste): Video Card (5 cols) */}
              <motion.div
                className="md:col-span-5 bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden relative shadow-lg min-h-[280px]"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img
                  src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779847988/7c2cce19-579e-4810-9b4d-692bf40cae03.png"
                  alt="에그120 계란빵 조리 및 폐기율 제로 연출"
                  className="absolute inset-0 w-full h-full object-cover hover:scale-[1.05] transition-all duration-500 opacity-100"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isPinkVariant ? "from-pink-950/20 via-transparent to-transparent" : "from-neutral-950 via-neutral-950/20 to-transparent"}`}></div>
              </motion.div>

              {/* PAIR 4 (Zero Waste): Text Card (7 cols) */}
              <motion.article
                className={`md:col-span-7 bg-neutral-900/60 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between transition-colors bento-text-card ${
                  isPinkVariant ? "hover:border-pink-400/40" : "hover:border-amber-400/40"
                }`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">냉동 보관 생지 시스템으로 재고와 폐기율 부담 제로</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                    그날 아침 구워 당일 반드시 소진해야 하는 일반 상온 제빵 구조와 다릅니다. 본사 냉동 생지를 주문 수량이나 매장 판매 흐름에 맞추어 실시간으로 필요한 만큼만 즉석에서 구워내기 때문에 유통/재고 폐기 손실이 원천적으로 0%에 수렴합니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-6">
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#냉동 보관 시스템</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#실시간 즉석 조리</span>
                  <span className={`text-xs sm:text-[13px] font-extrabold ${isPinkVariant ? "text-pink-400" : "text-amber-400"}`}>#폐기율 0% 도전</span>
                </div>
              </motion.article>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* BRAND PORTFOLIO STRUCTURE SECTION */}
        {/* ------------------------------------------------------------- */}
        <section id="structure" className="py-24 bg-white text-neutral-900 overflow-hidden relative border-b border-neutral-100">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className="text-neutral-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Brand Architecture</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-neutral-950 leading-tight">하나의 브랜드 안에서, 메뉴 선택은 더 다채롭게</h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-bold leading-relaxed max-w-xl">
                120pie&coffee는 120겹파이와 에그120을 중심으로, 매장의 분위기와 손님 취향에 잘 어울리는 메뉴 구성을 함께 제안합니다.
              </p>
            </motion.div>

            <div className="w-full bg-neutral-50 border border-neutral-100 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm relative text-center">
              <div className="brand-master-title bg-amber-400 text-white font-black text-xl sm:text-2xl py-3 px-8 rounded-xl inline-block mb-12 shadow-sm text-center">
                120pie &amp; coffee <span className="block sm:inline-block font-extrabold text-[10px] sm:text-xs sm:ml-2 text-white/80 mt-1 sm:mt-0">Master Brand</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Connect Line Graphic (Hidden on mobile) */}
                <div className="hidden md:block absolute top-[-48px] left-[16.6%] right-[16.6%] h-12 border-t border-l border-r border-neutral-200 rounded-t-xl z-0"></div>
                <div className="hidden md:block absolute top-[-48px] left-1/2 w-px h-12 bg-neutral-200 z-0"></div>

                {/* Module Card 1 */}
                <div className="bg-white rounded-2xl border border-neutral-200 relative z-10 flex flex-col items-center overflow-hidden hover:border-amber-400/60 transition-colors shadow-sm">
                  <div className="aspect-video w-full overflow-hidden bg-neutral-100 relative">
                    <video src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779758245/120pie_%EC%98%81%EC%83%81_4_bt9dyp.mp4" autoPlay muted loop playsInline aria-label="120겹파이 메뉴 영상" className="absolute inset-0 block w-full h-full object-cover scale-[1.24]" />
                  </div>
                  <div className="p-6 flex flex-col items-center">
                    <div className="text-[10px] font-bold text-amber-500 mb-1.5 tracking-widest uppercase">Signature Pie</div>
                    <div className="text-lg font-black text-neutral-950 mb-1">120겹파이 시리즈</div>
                    <div className="text-xs text-neutral-500 text-center font-bold leading-relaxed">겉은 바삭하고 속은 든든한 대표 파이 메뉴</div>
                  </div>
                </div>

                {/* Module Card 2 */}
                <div className="bg-white rounded-2xl border border-neutral-200 relative z-10 flex flex-col items-center overflow-hidden hover:border-amber-400/60 transition-colors shadow-sm">
                  <div className="aspect-video w-full overflow-hidden bg-neutral-100 relative">
                    <video src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779806130/egg120_%EC%98%81%EC%83%81_1_jwv7fe.mp4" autoPlay muted loop playsInline aria-label="에그120 메뉴 영상" className="absolute inset-0 block w-full h-full object-cover scale-[1.24]" />
                  </div>
                  <div className="p-6 flex flex-col items-center">
                    <div className="text-[10px] font-bold text-emerald-500 mb-1.5 tracking-widest uppercase">Sweet Choice</div>
                    <div className="text-lg font-black text-neutral-950 mb-1">에그120 계란빵</div>
                    <div className="text-xs text-neutral-500 text-center font-bold leading-relaxed">부드러운 맛으로 가볍게 곁들이기 좋은 메뉴</div>
                  </div>
                </div>

                {/* Module Card 3 */}
                <div className="bg-white rounded-2xl border border-neutral-200 relative z-10 flex flex-col items-center overflow-hidden hover:border-amber-400/60 transition-colors shadow-sm">
                  <div className="aspect-video w-full overflow-hidden bg-neutral-100 relative">
                    <video src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779805882/%EC%B8%84%EB%9F%AC%EC%8A%A4120_%EC%98%81%EC%83%81_1_qpxlyo.mp4" autoPlay muted loop playsInline aria-label="츄러스 메뉴 영상" className="absolute inset-0 block w-full h-full object-cover scale-[1.24]" />
                  </div>
                  <div className="p-6 flex flex-col items-center">
                    <div className="text-[10px] font-bold text-blue-500 mb-1.5 tracking-widest uppercase">More Favorites</div>
                    <div className="text-lg font-black text-neutral-950 mb-1">츄러스 · 핫도그 · 떡볶이</div>
                    <div className="text-xs text-neutral-500 text-center font-bold leading-relaxed">매장과 상권에 맞춰 더해볼 수 있는 인기 메뉴</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* MODULAR MENU CATALOG SECTION [INTEGRATING EXCLUDED MENU DATA - V2 STYLE - KEY] */}
        {/* ------------------------------------------------------------- */}
        <section id="menu" className="py-24 bg-neutral-950 text-white relative border-b border-neutral-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <motion.div className="max-w-3xl mb-14" {...fadeIn}>
              <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Product Catalog</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
                커피와 함께 팔기 좋은,<br />우리 가게의 대표 메뉴
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-bold leading-relaxed max-w-xl">
                파이부터 계란빵, 사이드 메뉴까지. 매장의 손님과 상권에 잘 맞는 구성을 부담 없이 더해보세요.
              </p>
            </motion.div>

            {/* Editorial product grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: "120겹파이",
                  eyebrow: "Signature",
                  title: "120파이 시리즈",
                  desc: "고기파이부터 애플파이, 피자 파이까지. 커피와 자연스럽게 어울리는 브랜드의 대표 메뉴입니다.",
                  image: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779718433/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%97%B0%EC%B6%9C_xk9fhi.jpg",
                  alt: "120겹파이"
                },
                {
                  id: "에그120",
                  eyebrow: "Dessert",
                  title: "에그120 계란빵",
                  desc: "폭신하고 부드러운 식감에 다양한 토핑을 더해, 커피와 함께 즐기기 좋은 디저트 메뉴입니다.",
                  image: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779722602/120egg_45_y2al4f.jpg",
                  alt: "에그120 계란빵"
                },
                {
                  id: "기타",
                  eyebrow: "Side Menu",
                  title: "츄러스 · 핫도그 · 떡볶이",
                  desc: "간단한 조리로 선택 폭을 넓히고, 파이와 함께 추가 주문을 이끄는 사이드 메뉴입니다.",
                  image: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779759362/IMG_0015_6_3_au1ykg.jpg",
                  alt: "사이드 메뉴"
                }
              ].map((menu) => (
                <button
                  type="button"
                  key={menu.id}
                  onClick={() => setSelectedMenu(menu.id)}
                  className="group text-left border-t border-neutral-700 pt-5 transition-colors hover:border-amber-400 flex flex-col"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-900 mb-6">
                    <img
                      src={menu.image}
                      alt={menu.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 tracking-[0.22em] uppercase block mb-3">{menu.eyebrow}</span>
                  <h3 className="text-xl font-black text-white mb-3">{menu.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed flex-1">{menu.desc}</p>
                  <span className="catalog-detail-button text-xs font-bold mt-7 inline-flex items-center gap-2 rounded-full border border-amber-400 px-4 py-2.5 text-amber-400 group-hover:bg-amber-400 group-hover:text-white transition-colors">
                    메뉴 자세히 보기 <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              ))}
            </div>

            {/* Recommended combinations */}
            <div className="mt-20 border-t border-neutral-800 pt-14">
              <span className="text-amber-400 font-bold tracking-widest text-xs mb-3 block font-mono uppercase">
                Recommended Sets
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mb-4 text-white">상권에 맞는 메뉴 조합</h3>
              <p className="text-xs sm:text-sm text-neutral-400 mb-12 max-w-xl font-medium leading-relaxed">
                매장의 주 고객과 이용 시간대에 맞춰, 부담 없이 시작할 수 있는 메뉴 구성을 제안합니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    label: "OFFICE",
                    title: "떡볶이 + 120파이",
                    desc: "든든한 간식과 식사 대용 메뉴를 찾는 오피스·학원가 매장에 어울리는 구성입니다.",
                    location: "오피스 · 대학가",
                    image: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779849846/%EC%98%88%EC%81%9C_%EC%B9%B4%ED%8E%98_%ED%85%8C%EC%9D%B4%EB%B8%94_%EC%9C%84%EC%97%90_%EC%9C%84_202605271143_npntmg.jpg"
                  },
                  {
                    label: "TREND",
                    title: "에그120 + 시그니처 음료",
                    desc: "사진 찍기 좋은 디저트 메뉴로 젊은 고객의 방문과 공유를 기대하는 매장에 적합합니다.",
                    location: "로드샵 · 번화가",
                    image: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779850141/%EB%91%90_%EB%A9%94%EB%89%B4_%ED%85%8C%EC%9D%B4%EB%B8%94_%EC%98%88%EC%81%9C_%EC%B9%B4%ED%8E%98_202605271147_1_rkb6ns.jpg"
                  },
                  {
                    label: "DELIVERY",
                    title: "츄러스 + 핫도그 + 파이",
                    desc: "함께 나눠 먹기 좋은 구성을 통해 포장과 배달 주문을 넓히기 좋은 조합입니다.",
                    location: "주거 · 배달 상권",
                    image: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779850228/%EB%A9%94%EB%89%B4_%ED%94%8C%EB%A0%88%EC%9D%B4%ED%8C%85_%EC%98%88%EC%81%9C_%EC%B9%B4%ED%8E%98_202605271150_qfswzm.jpg"
                  }
                ].map((set) => (
                  <article key={set.label} className="group text-left border-t border-neutral-700 pt-6 transition-colors hover:border-amber-400 flex flex-col">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-900 mb-6">
                      <img
                        src={set.image}
                        alt={set.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 tracking-[0.22em] block mb-4">{set.label}</span>
                    <h4 className="text-lg font-black text-white mb-3">{set.title}</h4>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-medium mb-7 flex-1">{set.desc}</p>
                    <span className="text-[11px] font-bold text-neutral-500">추천 상권: {set.location}</span>
                  </article>
                ))}
              </div>
            </div>

          </div>

          {/* Menu Modal Render */}
          {selectedMenu && <MenuModal menuId={selectedMenu} onClose={() => setSelectedMenu(null)} onInquiry={() => setInquiryModalOpen(true)} />}
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PAIN POINTS SECTION [PURE WHITE & LIGHT GREY THEME - CLEAR TROUBLES] */}
        {/* ------------------------------------------------------------- */}
        <section className="py-24 bg-white text-neutral-900 border-b border-neutral-100" id="pain-points">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

              {/* Left Troubles Cards Grid */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <motion.div className="max-w-xl mb-12" {...fadeIn}>
                  <span className="text-neutral-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Real Cafe Troubles</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-black mb-4 tracking-tight leading-tight">
                    하루 백 잔을 팔아도 제자리걸음이라면,<br />
                    문제는 잔수가 아닌 <span className="text-amber-500 font-extrabold">낮은 객단가</span>입니다.
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-bold leading-relaxed">
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
                      className="bg-neutral-50 border border-neutral-100 p-6 rounded-2xl hover:border-black hover:bg-white transition-all group shadow-sm"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                      <span className="w-8 h-8 rounded bg-neutral-950 text-white font-black text-xs flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-all">
                        {p.no}
                      </span>
                      <h3 className="text-base font-black text-black mb-2">{p.title}</h3>
                      <p className="text-xs text-neutral-500 font-bold leading-relaxed">{p.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Supporting Video Column */}
              <motion.div
                className="lg:col-span-4 bg-neutral-50 border border-neutral-200 rounded-3xl overflow-hidden relative min-h-[400px] flex items-end shadow-inner"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <video
                  src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779807895/120pie_%EC%98%81%EC%83%81_2_2_qz3xdx.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="120겹 파이 메뉴 연출 영상"
                  className={`absolute inset-0 w-full h-full object-cover ${isPinkVariant ? "opacity-100" : "opacity-90 contrast-105"}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isPinkVariant ? "from-white/70 via-white/5 to-transparent" : "from-black/85 via-black/20 to-transparent"}`}></div>
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
        <section className="py-24 bg-[#fffaf1] border-b border-amber-100 text-neutral-950" id="simulator">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className="text-amber-700 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Sales Calculator</span>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-950 mb-4 tracking-tight leading-tight">
                파이를 하루 몇 개만 더해도,<br />
                <span className="text-amber-600">우리 매장의 추가 매출</span>을 확인할 수 있습니다.
              </h2>
              <p className="text-sm text-neutral-700 font-medium leading-relaxed max-w-xl">
                예상 판매 수량과 단가를 조정해, 파이 메뉴가 만드는 월 매출 변화를 간편하게 살펴보세요.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

              {/* Left Input panel */}
              <div className="lg:col-span-5 bg-white border border-amber-200/70 p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-sm">
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
                  <button type="button" onClick={() => setInquiryModalOpen(true)} className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-neutral-950 text-white font-black text-xs rounded-lg hover:bg-neutral-800 transition-colors shadow-sm">
                    우리 매장에 맞게 상담받기
                  </button>
                </div>
              </div>

              {/* Right Output & Plating Image (High Contrast Deep Gold Card) */}
              <div className="lg:col-span-7 flex flex-col gap-6 justify-between">

                {/* Result Dash */}
                <div className="bg-amber-400 text-neutral-950 p-8 rounded-2xl shadow-sm flex flex-col justify-between min-h-[176px]">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-neutral-900/70 block mb-2">
                      월 예상 추가 매출
                    </span>
                    <h3 className="text-base font-bold text-neutral-900/80 mb-5">
                      파이 메뉴를 추가했을 때
                    </h3>
                  </div>
                  <div>
                    <strong className="simulator-amount text-3xl sm:text-4xl font-black tracking-tight block mb-2 leading-none">
                      {monthlySales.toLocaleString()} 원
                    </strong>
                    <p className="text-xs font-bold text-neutral-900/70">
                      하루 {quantity}개 x {price.toLocaleString()}원 x 월 {days}일 기준
                    </p>
                  </div>
                </div>

                {/* Split layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
                  <div
                    className="group bg-white border border-amber-100 rounded-2xl overflow-hidden relative min-h-[180px] cursor-zoom-in order-last sm:order-first"
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
                      src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779764563/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%A1%9C%EC%A0%9C_%EC%96%91%EC%86%A1%EC%9D%B4_%EC%88%98%EC%A0%952_posntw.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      aria-label="120겹파이 로제 양송이 메뉴 영상"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <span className="pink-primary-button absolute bottom-4 right-4 rounded-full bg-amber-400 px-3.5 py-2 text-[11px] font-black text-white shadow-sm transition-transform group-hover:scale-105">
                      영상 크게보기 · 소리 재생
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 justify-between order-first sm:order-last">
                    <div className="bg-white border border-amber-200/70 p-5 rounded-2xl shadow-sm">
                      <span className="text-xs text-neutral-600 font-bold block mb-2">월 예상 판매 수량</span>
                      <strong className="text-xl font-black text-neutral-900 block mb-0.5">{monthlyQuantity.toLocaleString()} 개</strong>
                      <span className="text-xs text-neutral-500 font-medium">선택한 조건으로 계산한 수량입니다.</span>
                    </div>

                    <div className="bg-white border border-amber-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-neutral-600 font-bold block mb-2">예상 순이익</span>
                        <strong className="text-base font-black text-amber-700 block">상담 시 자세히 안내</strong>
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
                  src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779764563/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%A1%9C%EC%A0%9C_%EC%96%91%EC%86%A1%EC%9D%B4_%EC%88%98%EC%A0%952_posntw.mp4"
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
        <section className="py-24 bg-white text-neutral-900 border-b border-neutral-100" id="before-after">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className="text-neutral-500 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Contrast Compare</span>
              <h2 className="text-3xl sm:text-4xl font-black text-black mb-4 tracking-tight leading-tight">
                커피만 팔던 매장에,<br />
                <span className="text-amber-500 font-extrabold">디저트를 찾는 이유</span>를 더합니다.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Before Column (Monochrome Grey Coffee Image) */}
              <motion.article
                className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 justify-between hover:border-black transition-colors"
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
                    <span className="text-neutral-500 font-black text-lg">음료 중심의 기존 매장</span>
                  </div>
                  <h3 className="text-xl font-black text-neutral-800 mb-6 leading-tight">커피 한 잔만으로는 아쉬운 매출</h3>

                  <div className="space-y-3.5 mb-6 text-xs sm:text-sm text-neutral-500 font-bold leading-relaxed">
                    <div className="flex gap-2"><span>•</span><p>음료 주문만으로는 한 번의 결제 금액을 높이기 어렵습니다.</p></div>
                    <div className="flex gap-2"><span>•</span><p>미리 준비한 디저트는 팔리지 않으면 폐기 부담으로 이어집니다.</p></div>
                    <div className="flex gap-2"><span>•</span><p>손님이 기억하고 공유할 만한 대표 메뉴가 부족합니다.</p></div>
                  </div>
                </div>

                <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-neutral-200 bg-neutral-100">
                  <img
                    src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779765483/ChatGPT_Image_2026%EB%85%84_5%EC%9B%94_26%EC%9D%BC_%EC%98%A4%ED%9B%84_12_13_48_asivm6.png"
                    alt="커피 한 잔만으로 아쉬운 매출을 표현한 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.article>

              {/* After Column (Rich Gold-Accented Brunch Table Image) */}
              <motion.article
                className="bg-neutral-950 text-white border-2 border-amber-400 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 justify-between shadow-2xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-3.5 py-1 rounded bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-widest">
                      After
                    </span>
                    <span className="text-amber-400 font-black text-lg">120pie를 더한 우리 매장</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-6 leading-tight">커피와 파이를 함께 찾는 카페로</h3>

                  <div className="space-y-3.5 mb-6 text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <p>커피와 잘 어울리는 파이 메뉴로 자연스럽게 세트 주문을 제안할 수 있습니다.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <p>필요한 만큼 구워 판매해 디저트 운영과 폐기 부담을 줄일 수 있습니다.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <p>파이 맛집으로 기억되는 메뉴를 더해 재방문과 입소문을 기대할 수 있습니다.</p>
                    </div>
                  </div>
                </div>

                <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-neutral-800">
                  <img
                    src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779765478/230515_120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%95%A0%ED%94%8C%EC%B9%98%EC%A6%88_2_sddz7b.jpg"
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
        <section id="adoption" className="py-24 bg-neutral-950 text-white relative border-b border-neutral-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <motion.div className="max-w-3xl mb-14" {...fadeIn}>
              <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Adoption Guide</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
                작은 공간에서 시작해,<br />매장에 맞게 넓혀갑니다.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-bold max-w-xl leading-relaxed">
                간판과 매장을 한 번에 바꾸지 않아도 됩니다. 파이 메뉴를 먼저 도입하고, 반응에 따라 브랜드 노출과 매장 변화를 선택할 수 있습니다.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 mb-20">
              {[
                { num: "01", title: "메뉴부터 가볍게 시작", desc: "작은 판매 공간에 파이 메뉴를 더해 손님의 반응을 먼저 살펴봅니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772299/KakaoTalk_Photo_2023-03-17-18-30-28_003_2_r2ywjp.jpg" },
                { num: "02", title: "매장 안에서 알리기", desc: "메뉴보드와 안내물을 활용해 파이를 판매하는 카페임을 자연스럽게 알립니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772301/KakaoTalk_Photo_2023-03-17-18-30-49_003_2_g9jkkd.jpg" },
                { num: "03", title: "필요하면 외부 표기 추가", desc: "원하는 매장에 한해 기존 간판 옆에 브랜드 표기를 더할 수 있습니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772298/KakaoTalk_Photo_2023-03-17-18-30-29_013_2_fcl1vm.jpg" },
                { num: "04", title: "검증 후 확장 선택", desc: "매출과 고객 반응을 확인한 뒤, 매장 전환 여부를 차분히 결정합니다.", img: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772271/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%B3%B8%EC%A0%90_%EC%84%9C%EC%9A%B8_%EC%84%B1%EB%B6%81%EA%B5%AC_%EB%8F%8C%EA%B3%B6%EC%9D%B4%EB%A1%9C14%EA%B8%B8_35_1%EC%B8%B5_k9mjon.jpg" }
              ].map((step) => (
                <article key={step.num} className="group border-t border-neutral-700 pt-5 flex flex-col h-full">
                  <div className="h-40 overflow-hidden rounded-xl mb-6 bg-neutral-900">
                    <img src={step.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 tracking-[0.24em] mb-3">STEP {step.num}</span>
                  <h3 className="text-lg font-black text-white mb-3 leading-tight">{step.title}</h3>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-neutral-400 flex-1">
                    {step.desc}
                  </p>
                  <button
                    onClick={() => setSelectedAdoptionStep(step.num)}
                    className="text-left text-xs font-bold text-neutral-200 mt-7 inline-flex items-center gap-2 group-hover:text-amber-400 transition-colors"
                  >
                    도입 예시 보기 <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>

            <div className="border-t border-neutral-800 pt-14">
              <div className="max-w-2xl mb-12">
                <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Reference Figures</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">도입 상담에서 확인할 수 있는 지표</h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                  매장 조건과 도입 방식에 따라 결과는 달라집니다. 상담 시 실제 사례와 함께 자세히 안내드립니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. 일 매출 변화 사례 Infographic */}
                <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-between group hover:border-amber-400 transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold text-xs tracking-wider ${isPinkVariant ? "text-pink-500" : "text-amber-400"}`}>일 매출 변화 사례</span>
                      <TrendingUp size={16} className={isPinkVariant ? "text-pink-500" : "text-amber-400"} />
                    </div>
                    <div className="text-4xl sm:text-5xl font-black text-white mb-6">
                      <AnimatedNumber value={300} suffix="%" />
                    </div>
                    {/* Infographic Double Horizontal Bars */}
                    <div className="space-y-3 mb-6 bg-neutral-950/40 p-4 rounded-xl border border-neutral-900">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-neutral-500 font-bold">
                          <span>기존 카페 평균</span>
                          <span>100%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-neutral-600 rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold items-center">
                          <span className={isPinkVariant ? "text-pink-500" : "text-amber-400"}>120pie 도입 후</span>
                          <span className={`${isPinkVariant ? "text-pink-500" : "text-amber-400"} animate-pulse text-[11px]`}>300%</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden relative">
                          <motion.div 
                            className={`h-full bg-gradient-to-r ${
                              isPinkVariant 
                                ? "from-pink-500 to-pink-400 shadow-[0_0_10px_rgba(242,95,138,0.3)]" 
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
                  <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed">
                    도입 사례 중 확인된 매출 변화 수치입니다.
                  </p>
                </div>

                {/* 2. 일 최고 매출 사례 Infographic */}
                <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-between group hover:border-amber-400 transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold text-xs tracking-wider ${isPinkVariant ? "text-pink-500" : "text-amber-400"}`}>일 최고 매출 사례</span>
                      <Award size={16} className={isPinkVariant ? "text-pink-500" : "text-amber-400"} />
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
                            className={isPinkVariant ? "stroke-pink-500" : "stroke-amber-400"} 
                            strokeWidth="4.5" 
                            fill="none"
                            strokeDasharray={151}
                            initial={{ strokeDashoffset: 151 }}
                            whileInView={{ strokeDashoffset: 30 }} // Draws ~80%
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <Store className={`absolute ${isPinkVariant ? "text-pink-500" : "text-amber-400"}`} size={16} />
                      </div>
                      <div className="text-3xl sm:text-4xl font-black text-white">
                        <AnimatedNumber value={350} suffix="만원" />
                      </div>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-bold mb-6 flex items-center gap-1.5 bg-neutral-950/40 p-3.5 rounded-xl border border-neutral-900">
                      <Sparkles size={11} className={`${isPinkVariant ? "text-pink-500" : "text-amber-400"} animate-spin-slow`} />
                      <span>단독 매장 운영사례 기준 최고치 달성 지표</span>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed">
                    단독 매장 운영 사례를 기준으로 한 수치입니다.
                  </p>
                </div>

                {/* 3. 투자 회수 사례 Infographic */}
                <div className="bg-neutral-900/40 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-between group hover:border-amber-400 transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-bold text-xs tracking-wider ${isPinkVariant ? "text-pink-500" : "text-amber-400"}`}>투자 회수 사례</span>
                      <ShieldCheck size={16} className={isPinkVariant ? "text-pink-500" : "text-amber-400"} />
                    </div>
                    <div className="text-4xl sm:text-5xl font-black text-white mb-6">
                      <AnimatedNumber value={2} suffix="개월" />
                    </div>
                    {/* Timeline Grid Infographic */}
                    <div className="mb-6 bg-neutral-950/40 p-4 rounded-xl border border-neutral-900">
                      <div className="flex justify-between items-center text-[10px] text-neutral-500 font-bold mb-2">
                        <span className={isPinkVariant ? "text-pink-500" : "text-amber-400"}>120pie 회수 (2개월)</span>
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
                  <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed">
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
        <StoresPreviewSection isPink={isPinkVariant} />

        {/* ------------------------------------------------------------- */}
        {/* OWNER SUPPORT SYSTEM SECTION [V3 FUSION] */}
        {/* ------------------------------------------------------------- */}
        <OwnerSystemSection />

        {/* ------------------------------------------------------------- */}
        {/* GALLERY SECTION [V3 FUSION] */}
        {/* ------------------------------------------------------------- */}
        <GallerySection filter={galleryFilter} setFilter={setGalleryFilter} />

        {/* ------------------------------------------------------------- */}
        {/* PROCESS SECTION [RICH BLACK THEME - CRISPY PROCESS] */}
        {/* ------------------------------------------------------------- */}
        <section className="py-24 bg-neutral-950 text-white border-b border-neutral-900 relative" id="process">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-xl mb-12" {...fadeIn}>
              <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Simple Operation</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                복잡한 제빵 과정 없이,<br />
                주문 후 <span className="text-amber-400">간편하게 구워 판매합니다.</span>
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
                      className="bg-neutral-900/60 border border-neutral-900 p-6 rounded-xl flex items-start gap-5 hover:border-amber-400/40 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: idx * 0.05 }}
                    >
                      <span className="w-9 h-9 rounded bg-amber-400 text-neutral-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                        {p.step}
                      </span>
                      <div>
                        <h3 className="text-base font-black text-white mb-1">{p.title}</h3>
                        <p className="text-xs text-neutral-400 font-medium leading-relaxed">{p.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column: Close-up Food Baking Process Image */}
              <motion.div
                className="lg:col-span-4 min-h-[320px] bg-neutral-900 rounded-2xl overflow-hidden relative shadow-2xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <video
                  src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779774298/Video_Project_15-2_kfgydn.mp4"
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
        <section className="py-24 bg-white text-neutral-900 border-b border-neutral-100" id="comparison">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className="text-neutral-500 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Simple Comparison</span>
              <h2 className="text-3xl sm:text-4xl font-black text-black mb-4 tracking-tight leading-tight">
                미리 준비해두는 디저트보다,<br />
                <span className="text-amber-500">필요할 때 구워 파는 방식</span>이 부담을 줄입니다.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Comparison Card 1 */}
              <div className="bg-neutral-50 border border-neutral-200 p-6 sm:p-8 rounded-2xl shadow-sm">
                <h3 className="text-base font-black text-black mb-6 flex items-center gap-2">
                  <Award size={18} className="text-neutral-950" /> 보관과 판매 방식 비교
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "보관 방식", before: "진열 후 빠른 판매가 필요합니다.", after: "냉동 보관 후 필요한 만큼 사용합니다." },
                    { label: "판매 방식", before: "미리 준비해 진열합니다.", after: "주문 후 간편하게 구워냅니다." },
                    { label: "남은 재고 부담", before: "팔리지 않으면 폐기로 이어질 수 있습니다.", after: "판매할 수량만 구워 부담을 줄입니다." }
                  ].map((item) => (
                    <div key={item.label} className="border-t border-neutral-200 pt-4">
                      <h4 className="text-sm font-black text-neutral-900 mb-3">{item.label}</h4>
                      <div className="grid gap-2.5">
                        <div className="rounded-lg bg-white border border-neutral-200 px-4 py-3">
                          <span className="text-[10px] font-bold text-neutral-400 tracking-wider block mb-1">진열 디저트</span>
                          <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">{item.before}</p>
                        </div>
                        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3">
                          <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                            <img
                              src={isPinkVariant ? "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779846449/logo_120pie_coffee3_jzgtyi.png" : "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779845741/logo_120pie_coffee_nu_woul37.png"}
                              alt="120pie 로고"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-amber-600 tracking-wider block mb-1">120pie 파이</span>
                            <p className="text-xs sm:text-sm text-neutral-900 font-bold leading-relaxed">{item.after}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparison Card 2 */}
              <div className="bg-neutral-50 border border-neutral-200 p-6 sm:p-8 rounded-2xl shadow-sm">
                <h3 className="text-base font-black text-black mb-6 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-neutral-950" /> 시작할 때 필요한 변화
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "시작 부담", before: "브랜드 전환 비용과 준비가 필요합니다.", after: "필요한 메뉴와 집기부터 시작합니다." },
                    { label: "매장 변화", before: "공사나 간판 변경이 필요할 수 있습니다.", after: "기존 매장을 크게 바꾸지 않고 시작합니다." },
                    { label: "확장 방식", before: "처음부터 큰 결정을 해야 합니다.", after: "반응을 확인한 뒤 확장을 선택합니다." }
                  ].map((item) => (
                    <div key={item.label} className="border-t border-neutral-200 pt-4">
                      <h4 className="text-sm font-black text-neutral-900 mb-3">{item.label}</h4>
                      <div className="grid gap-2.5">
                        <div className="rounded-lg bg-white border border-neutral-200 px-4 py-3">
                          <span className="text-[10px] font-bold text-neutral-400 tracking-wider block mb-1">새 브랜드 전환</span>
                          <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">{item.before}</p>
                        </div>
                        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3">
                          <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                            <img
                              src={isPinkVariant ? "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779846449/logo_120pie_coffee3_jzgtyi.png" : "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779845741/logo_120pie_coffee_nu_woul37.png"}
                              alt="120pie 로고"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-amber-600 tracking-wider block mb-1">120pie 도입</span>
                            <p className="text-xs sm:text-sm text-neutral-900 font-bold leading-relaxed">{item.after}</p>
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
        <section className="py-24 bg-neutral-950 text-white border-b border-neutral-900 scroll-mt-16" id="faq">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-16" {...fadeIn}>
              <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">자주 묻는 질문</h2>
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
                  className="bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden hover:border-amber-400/35 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                    className="w-full px-6 sm:px-8 py-5 text-left font-extrabold text-white flex justify-between items-center hover:bg-neutral-850 transition-colors"
                  >
                    <span className="text-sm sm:text-base pr-4 leading-tight">{faq.q}</span>
                    <ChevronDown size={18} className={`text-amber-400 transition-transform duration-300 shrink-0 ${openFaqIdx === i ? "rotate-180" : ""}`} />
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
                        <div className="px-6 sm:px-8 py-5 pt-0 text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed border-t border-neutral-850 bg-neutral-950/40">
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
        <section id="contact" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] text-white relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Easy Inquiry</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                우리 매장에 어울리는 디저트 메뉴,<br />편하게 상담받아 보세요
              </h2>
              <p className="text-xs sm:text-base text-neutral-400 font-medium leading-relaxed max-w-xl mx-auto">
                작은 메뉴 추가부터 브랜드 협업까지, 매장에 맞는 시작 방법을 함께 살펴봅니다. 간단한 정보를 남겨주시면 안내 자료와 상담 내용을 보내드립니다.
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-neutral-900 border border-neutral-850 rounded-3xl p-6 sm:p-10 shadow-2xl relative">

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-400 flex items-center justify-center text-neutral-950 font-bold text-3xl shadow-[0_4px_16px_rgba(251,191,36,0.3)]">
                    ✓
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-4">문의가 잘 접수되었습니다!</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 max-w-sm font-medium leading-relaxed">
                    남겨주신 연락처로 매장 상황에 잘 맞는 메뉴 구성과 도입 방법을 차분히 안내드리겠습니다.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-355">성함 <span className="text-amber-400">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="홍길동 사장님"
                        required
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-355">연락처 <span className="text-amber-400">*</span></label>
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
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-355">관심 있는 도입 방식</label>
                      <select
                        name="storeType"
                        value={formData.storeType}
                        onChange={handleFormChange}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none"
                      >
                        <option value="샵인샵 도입">간단한 메뉴 추가로 시작</option>
                        <option value="브랜드 병기 도입">브랜드 안내와 함께 운영</option>
                        <option value="공동간판 제휴">함께 보이는 간판 협업</option>
                        <option value="단독 매장 전환">전용 매장으로 전환 상담</option>
                        <option value="신규 무점포/창업">새로운 매장 창업 상담</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-neutral-355">기존 매장명 (선택)</label>
                      <input
                        type="text"
                        name="existingStoreName"
                        value={formData.existingStoreName}
                        onChange={handleFormChange}
                        placeholder="예: 마포커피 본점"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-neutral-355">궁금하신 내용 (선택)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      rows={3}
                      placeholder="매장 형태나 궁금한 점을 편하게 남겨주세요."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <input type="checkbox" id="privacy" required defaultChecked className="mt-1 accent-amber-400" />
                    <label htmlFor="privacy" className="text-[10px] text-neutral-500 leading-normal font-bold">
                      상담 안내를 위한 개인정보 수집 및 연락에 동의합니다. (필수)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="pink-primary-button w-full py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm sm:text-base rounded-xl transition-all shadow-[0_4px_24px_rgba(251,191,36,0.3)] hover:scale-[1.01]"
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
      <footer className="bg-[#090909] border-t border-neutral-900 text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-12 border-b border-neutral-800/80">
            <div className="lg:col-span-7">
              <div className="mb-7">
                <img
                  src="https://res.cloudinary.com/dx7l09wwu/image/upload/v1779845741/logo_120pie_coffee_nu_woul37.png"
                  alt="120pie 로고"
                  className="h-7 sm:h-8 w-auto object-contain grayscale opacity-40 hover:opacity-75 transition-opacity duration-200"
                />
              </div>
              <p className="text-base text-white font-bold tracking-tight mb-5">(주)고우웰라이프</p>
              <div className="space-y-2.5 text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                <p>대표 : 이사근 | 사업자번호: 787-88-00444</p>
                <p>경기 군포시 엘에스로 143 1층 1001호</p>
                <p>E-mail: lifenjoy0296@gmail.com | Tel: 1588-0883</p>
                <p>개인정보보호책임자: 이사근</p>
              </div>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-neutral-800/80 lg:pl-12 flex flex-col justify-between gap-10">
              <div>
                <span className="text-[10px] tracking-[0.24em] uppercase text-neutral-500 font-bold block mb-5">
                  Customer Center
                </span>
                <a
                  href="tel:1588-0883"
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight hover:text-amber-400 transition-colors block mb-3"
                >
                  1588-0883
                </a>
                <p className="inline-flex items-center gap-2 text-sm text-neutral-300 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  24시간 상담가능
                </p>
              </div>

              <div className="flex gap-6 text-sm text-neutral-400 font-bold">
                <span className="hover:text-white transition-colors cursor-pointer">이용약관</span>
                <span className="hover:text-white transition-colors cursor-pointer">개인정보처리방침</span>
              </div>
            </div>
          </div>

          <div className="pt-6 text-neutral-500 text-xs font-medium flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p>Copyright(c)2026 GOWELL-LIFE Co.,Ltd. All Right Reserved.</p>
            <div className="flex items-center gap-3">
              <Link
                href="/portal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-300 hover:underline transition-colors text-[11px]"
              >
                점주포털
              </Link>
              <span className="text-neutral-800">|</span>
              <Link
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-neutral-300 hover:underline transition-colors text-[11px]"
              >
                본사 어드민
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <InquiryModal
        open={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        submitted={formSubmitted}
      />

      {/* ==========================================
          REAL-TIME POPUP MODAL (ON-ENTRY)
         ========================================== */}
      {showPopup && popupSettings && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn text-[#2d2026]">
          <div 
            className="w-full max-w-md bg-white border border-[#f2ccd7] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative max-h-[85vh] animate-scaleUp"
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
                backgroundImage: `url(${popupSettings.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              } : undefined}
            >
              {popupSettings.image && <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>}
              <div className="relative z-10 space-y-1">
                <span className="bg-[#ffd3df] text-[#bf3e67] text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest w-fit">
                  HQ Announcement
                </span>
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
                    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
                    localStorage.setItem("120_popup_closed_date", todayStr);
                    popupClosedInSessionRef.current = true;
                    setShowPopup(false);
                  }}
                  className="hover:text-[#bf3e67] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="text-[#f25f8a]">✔</span> 오늘 하루 안보기
                </button>
                <button
                  onClick={() => {
                    popupClosedInSessionRef.current = true;
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
        <div className="fixed right-6 bottom-6 z-[90] flex flex-col items-end gap-3 font-bold text-xs select-none text-white animate-fadeIn">
          {/* Expanded Menu Actions Tray */}
          {floatingOpen && (
            <div className="flex flex-col items-end gap-2.5 mb-1.5 animate-slideUp">
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
                  <span className="absolute right-12 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#2d2026", color: "#ffffff" }}>공식 인스타</span>
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
                  <span className="absolute right-12 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#2d2026", color: "#ffffff" }}>유튜브 채널</span>
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
                  <span className="absolute right-12 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#2d2026", color: "#ffffff" }}>본사 전화문의</span>
                </a>
              )}

              {/* Kakao talk Channel / Custom Chat link */}
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
                  <span className="absolute right-12 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#2d2026", color: "#ffffff" }}>1:1 카톡문의</span>
                </a>
              )}

              {/* Fast Chat Consultation - triggers internal consultation modal */}
              {floatingSettings?.chatUrl && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setInquiryModalOpen(true);
                    setFloatingOpen(false);
                  }}
                  className="bg-[#f25f8a] hover:bg-[#df4977] p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ffffff" }} className="w-[16px] h-[16px] text-white">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="absolute right-12 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#2d2026", color: "#ffffff" }}>빠른 실시간 상담</span>
                </button>
              )}
            </div>
          )}

          {/* Trigger Controller (Main Toggle button) */}
          <button
            onClick={() => setFloatingOpen(!floatingOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer border-0 shadow-[0_6px_20px_rgba(242,95,138,0.45)] hover:scale-105 active:scale-95 ${
              floatingOpen
                ? "bg-[#735965] hover:bg-[#5d4752] rotate-45 text-white"
                : "bg-gradient-to-tr from-[#bf3e67] to-[#f25f8a] hover:from-[#df4977] hover:to-[#ff7b9f] text-white"
            }`}
          >
            {floatingOpen ? (
              <X size={20} className="!text-white" style={{ color: "#ffffff" }} />
            ) : (
              <Plus size={20} className="!text-white animate-pulse" style={{ color: "#ffffff" }} />
            )}
          </button>
        </div>
      )}

    </div>
  );
}
