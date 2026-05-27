import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "motion/react";
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
  ArrowUpRight
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
function MenuModal({ menuId, onClose }: { menuId: string | null, onClose: () => void }) {
  if (!menuId) return null;

  const details: Record<string, { title: string, desc: string, items: {name: string, desc: string, img: string}[] }> = {
    "120겹파이": {
       title: "시그니처 핵심 엔진: 120파이",
       desc: "독보적인 120겹 페이스트리 기술력을 바탕으로 겉바속촉 식감을 극한으로 올렸습니다. 디저트부터 든든한 식사 대용까지 폭넓은 시간대 수요를 흡수합니다.",
       items: [
         { name: "수제 고기파이", desc: "육즙이 풍부한 다진 고기와 특제 소스로 속을 꽉 채워 든든한 한 끼 식사가 되는 시그니처 파이", img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop" },
         { name: "달콤 애플파이", desc: "달콤한 시나몬과 사과 과육의 조화로 커피와 완벽한 페어링을 자랑하는 스테디셀러 디저트 파이", img: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=600&auto=format&fit=crop" },
         { name: "식사/피자 파이류", desc: "치즈와 토마토 베이스의 조합으로 점심 및 저녁 식사 배달 수요까지 끌어들이는 하이브리드 파이", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop" }
       ]
    },
    "에그120": {
       title: "성장/바이럴 엔진: 에그120 계란빵",
       desc: "밀가루가 아닌 100% 쌀반죽을 사용하여 쫄깃함과 소화 편의성을 더하고, 귀여운 위트 캐릭터 브랜딩으로 인스타 바이럴을 이끄는 프리미엄 에그빵입니다.",
       items: [
         { name: "쌀반죽 오리지널 에그빵", desc: "100% 국내산 쌀가루 반죽에 계란 하나가 통째로 들어가 겉바속촉 고소함이 일품인 대표 웰빙 영양빵", img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=600&auto=format&fit=crop" },
         { name: "베이컨치즈 에그빵", desc: "짭조름한 고급 베이컨과 멜팅 치즈, 계란의 풍미가 어우러져 단짠 매력을 선사하는 업그레이드 에그빵", img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=600&auto=format&fit=crop" },
       ]
    },
    "기타": {
       title: "확장 패밀리: 스낵 & 브런치 수프",
       desc: "에어프라이어 5분 가열만으로 갓 튀긴 듯 바삭한 츄러스, 특제 소시지를 적용한 핫도그, 그리고 매장의 품격을 높여줄 수프까지 강력한 객단가 보강 라인업입니다.",
       items: [
         { name: "에어프라이 고품질 츄러스", desc: "번거로운 기름 조리 과정 없이 구워내어 시나몬 향 가득 겉은 바삭하고 속은 부드러운 스낵 츄러스", img: "https://images.unsplash.com/photo-1561571994-3c61c554181a?q=80&w=600&auto=format&fit=crop" },
         { name: "직화 불고기 핫도그", desc: "저가형 소시지가 아닌 깊은 직화 불고기 풍미와 쫄깃한 소시지가 들어간 프리미엄 아메리칸 스타일 핫도그", img: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?q=80&w=600&auto=format&fit=crop" },
         { name: "프리미엄 브런치 수프", desc: "빵과 최적의 궁합을 가지는 본사 특제 레시피 완제품 수프로, 개인 카페를 단숨에 브런치 매장으로 격상", img: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop" }
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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md"
        onClick={onClose}
      >
         <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 30 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            onClick={e => e.stopPropagation()}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
         >
            <button onClick={onClose} className="absolute top-5 right-5 text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-full p-2.5 z-10 transition-colors">
              <X size={18}/>
            </button>
            <div className="p-8 border-b border-neutral-800 text-center bg-gradient-to-b from-neutral-900 to-neutral-950">
               <span className="inline-block px-3 py-1 rounded bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider mb-2">PRODUCT PREVIEW</span>
               <h3 className="text-2xl font-black text-white mb-2">{data.title}</h3>
               <p className="text-neutral-400 text-sm max-w-2xl mx-auto font-medium leading-relaxed">{data.desc}</p>
            </div>
            
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-950 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800">
               {data.items.map((item, i) => (
                  <div key={i} className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-850 shadow-lg hover:border-amber-400/40 transition-all group">
                     <div className="h-44 overflow-hidden relative bg-neutral-950">
                       <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                       <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                     </div>
                     <div className="p-5">
                        <h4 className="font-extrabold text-white text-base mb-1.5">{item.name}</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed font-medium">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="p-6 bg-neutral-900 text-center border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
               <span className="text-xs text-neutral-400 font-bold">도입 시 전용 원자재 콜드체인 물류 및 전용 집기 일체를 제공합니다.</span>
               <a href="#contact" onClick={onClose} className="w-full sm:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-lg transition-colors text-xs shadow-[0_4px_16px_rgba(251,191,36,0.25)]">
                  도입 견적 및 단가 문의 &rarr;
               </a>
            </div>
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
      desc: "기존에 사용하시던 카운터 쇼케이스의 한 칸을 활용하거나, 본사가 지원하는 소형 전용 온장 워머(Warmer) 및 비주얼 POP 광고판만 카운터에 슬쩍 얹는 형태입니다. 인테리어 철거나 주방 개조가 필요 없어 100만 원대의 매우 실속 있는 세팅 비용으로 즉시 120파이와 에그120의 판매를 개시할 수 있습니다.", 
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
              <X size={18}/>
            </button>
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-neutral-950 relative">
               <img src={data.img} className="w-full h-full object-cover opacity-60 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" alt="" />
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

// V3 StoresPreviewSection
function StoresPreviewSection() {
  const previewStores = [
    { name: "서울 강남본점", type: "단독매장", region: "서울 강남구 역삼동", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop" },
    { name: "부산 해운대점", type: "공동간판", region: "부산 해운대구 중동", img: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=600&auto=format&fit=crop" },
    { name: "홍대 입구점", type: "샵인샵", region: "서울 마포구 서교동", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop" },
  ];

  return (
    <section className="py-24 bg-white text-neutral-900 relative overflow-hidden">
      <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-neutral-100 pointer-events-none hidden lg:block"></div>
      <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-neutral-150 pointer-events-none hidden lg:block"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
          <div>
            <span className="text-amber-500 font-extrabold tracking-widest text-xs sm:text-sm mb-3 block uppercase font-mono">
              Active Franchise
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-950 leading-tight">
              전국 가맹 매장 현황
            </h2>
            <p className="text-amber-500 font-bold text-sm sm:text-base mt-2">
              성공 노하우를 공유하며 함께 궤도에 오른 점주분들을 확인해 보세요
            </p>
          </div>
          <Link to="/stores" className="px-6 py-3 border border-amber-400 hover:bg-amber-400 text-amber-500 hover:text-neutral-950 font-black rounded-lg transition-all text-xs tracking-tight shrink-0 shadow-sm">
            전체 가맹점 상세 보기 &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewStores.map((store, i) => (
            <div key={i} className="bg-neutral-50 border border-neutral-200/80 rounded-2xl overflow-hidden hover:shadow-lg hover:border-amber-400/40 transition-all group flex flex-col shadow-sm">
              <div className="h-48 overflow-hidden relative bg-neutral-200">
                <img src={store.img} alt={store.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                <div className="absolute top-4 right-4 bg-amber-400 text-neutral-950 text-[10px] font-black px-3 py-1 rounded shadow-sm">
                  {store.type}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-xl text-neutral-950 mb-2">{store.name}</h3>
                <div className="text-neutral-500 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                  <MapPin size={14} className="text-neutral-400 shrink-0" />
                  {store.region}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// V3 OwnerSystemSection
function OwnerSystemSection() {
  return (
    <section className="py-24 bg-[#faf8f5] text-neutral-900 border-t border-b border-neutral-150 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative">
          
          <div className="w-full lg:w-1/2 relative z-10 text-center lg:text-left">
             <span className="text-amber-500 font-extrabold tracking-widest text-xs sm:text-sm mb-3 block uppercase flex items-center justify-center lg:justify-start gap-1 font-mono">
               ↗ Partner Support
             </span>
             <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 text-neutral-950 leading-tight">
                가맹점주는 장사에만<br/>집중할 수 있도록
             </h2>
             <p className="text-xs sm:text-sm text-neutral-500 mb-8 font-bold leading-relaxed">
                발주, CS, 캐릭터 홍보물 요청까지. 점주가 오직 매장 관리에만 전념할 수 있도록 다이렉트 모바일 통합 가맹점 관리 솔루션을 무상 지원합니다.
             </p>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center lg:items-start gap-3">
                   <div className="bg-amber-100/60 text-amber-600 p-2.5 rounded-lg w-fit">
                     <Package size={20} />
                   </div>
                   <h4 className="font-extrabold text-neutral-950 text-sm">주문 시스템</h4>
                   <p className="text-[10px] text-neutral-500 leading-normal font-bold">본사 원클릭 물류 발주</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center lg:items-start gap-3">
                   <div className="bg-amber-100/60 text-amber-600 p-2.5 rounded-lg w-fit">
                     <Headphones size={20} />
                   </div>
                   <h4 className="font-extrabold text-neutral-950 text-sm">1:1 메신저</h4>
                   <p className="text-[10px] text-neutral-500 leading-normal font-bold">실시간 물류·매장 케어</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center lg:items-start gap-3">
                   <div className="bg-amber-100/60 text-amber-600 p-2.5 rounded-lg w-fit">
                     <Monitor size={20} />
                   </div>
                   <h4 className="font-extrabold text-neutral-950 text-sm">자료 및 마케팅</h4>
                   <p className="text-[10px] text-neutral-500 leading-normal font-bold">캐릭터 POP/디자인 매뉴얼</p>
                </div>
             </div>
 
             <div className="flex justify-center lg:justify-start">
                <Link to="/portal" className="px-6 py-3.5 bg-neutral-950 hover:bg-black text-white font-black rounded-lg flex items-center gap-1.5 transition-colors text-xs tracking-tight shadow-md">
                   점주 전용 포털 바로가기 &rarr;
                </Link>
             </div>
          </div>

          <div className="w-full lg:w-1/2 relative z-10">
             <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-xl bg-white p-2">
               <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" alt="점주관리대시보드" className="rounded-xl w-full" />
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// V3 GallerySection
function GallerySection({ filter, setFilter }: { filter: string, setFilter: (t: string) => void }) {
  const tabs = ["전체", "메뉴", "매장", "박람회", "기타"];
  
  const images = [
    { id: 1, cat: "메뉴", url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&h=400&fit=crop", title: "120파이 초콜릿/고기 토핑" },
    { id: 2, cat: "매장", url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&h=400&fit=crop", title: "120pie&coffee 강남본점 전면" },
    { id: 3, cat: "메뉴", url: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=400&h=400&fit=crop", title: "에그120 계란빵 쌀반죽 단면" },
    { id: 4, cat: "박람회", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&h=400&fit=crop", title: "프랜차이즈 창업 박람회 성황" },
    { id: 5, cat: "기타", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&h=400&fit=crop", title: "본사 상생 협동조합 사무실" },
    { id: 6, cat: "매장", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400&h=400&fit=crop", title: "기존 샵인샵 도입 완료 윈도우" }
  ];

  const filteredImages = filter === "전체" ? images : images.filter(img => img.cat === filter);

  return (
    <section className="py-24 bg-white text-neutral-900 border-b border-neutral-100">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-neutral-950 leading-tight">
              120pie&amp;coffee 현장 갤러리
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-bold max-w-xl mx-auto leading-relaxed">
              오프라인 매장, 갓 구워낸 맛있는 푸드, 활발한 창업 박람회 현장을 실물로 확인하세요
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-12">
             {tabs.map(t => (
                <button 
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-5 py-2 rounded-full font-black text-xs transition-all ${
                    filter === t 
                      ? "bg-amber-400 text-neutral-950 shadow-sm" 
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {t}
                </button>
             ))}
          </div>

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredImages.map(img => (
                 <motion.div 
                   layout
                   initial={{ opacity: 0, scale: 0.9 }} 
                   animate={{ opacity: 1, scale: 1 }} 
                   exit={{ opacity: 0, scale: 0.9 }} 
                   transition={{ duration: 0.3 }}
                   key={img.id} 
                   className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden group border border-neutral-200 relative shadow-sm"
                 >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                       <span className="text-amber-400 text-[9px] font-black uppercase tracking-wider mb-1 block font-mono">{img.cat}</span>
                       <h4 className="text-white font-extrabold text-xs sm:text-sm leading-tight">{img.title}</h4>
                    </div>
                 </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
       </div>
    </section>
  );
}

export default function HomeV3() {
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

  // 갤러리 필터 상태
  const [galleryFilter, setGalleryFilter] = useState<string>("전체");

  // 컨택트 폼 입력 상태
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    storeType: "샵인샵 도입",
    existingStoreName: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("성함과 연락처를 입력해 주세요.");
      return;
    }
    setFormSubmitted(true);
  };

  // 모션 페이드인 애니메이션 프리셋
  const fadeIn = {
    initial: { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6 }
  };

  return (
    <div className="flex flex-col w-full bg-[#0a0a0a] text-neutral-200 scroll-smooth overflow-x-hidden font-sans antialiased">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER (Sticky Minimal Tri-Tone) */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-neutral-950/95 border-b border-neutral-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[78px] gap-4">
          <Link className="flex items-center gap-3 font-black text-xl tracking-tight text-white group" to="/v3" aria-label="120pie 홈으로 이동">
            <span className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-400 text-neutral-950 font-black text-base shadow-[0_4px_12px_rgba(251,191,36,0.3)] group-hover:scale-105 transition-transform">
              120
            </span>
            <span className="font-extrabold tracking-tight">120pie &amp; coffee</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-neutral-400">
            <a href="#why" className="hover:text-amber-400 transition-colors">도입 가치</a>
            <a href="#structure" className="hover:text-amber-400 transition-colors">브랜드 구조</a>
            <a href="#menu" className="hover:text-amber-400 transition-colors">메뉴 카탈로그</a>
            <a href="#simulator" className="hover:text-amber-400 transition-colors">수익 시뮬레이터</a>
            <a href="#adoption" className="hover:text-amber-400 transition-colors">도입 방식 &amp; 성공사례</a>
            <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <a className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-bold text-neutral-350 hover:bg-neutral-800 hover:text-white transition-colors" href="#simulator">
              수익 계산하기
            </a>
            <a className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-400 text-neutral-950 text-xs sm:text-sm font-black hover:bg-amber-300 hover:scale-[1.02] transition-all shadow-[0_4px_16px_rgba(251,191,36,0.2)]" href="#contact">
              상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main id="top" className="relative">

        {/* ------------------------------------------------------------- */}
        {/* HERO SECTION [RICH BLACK & GOLDEN YELLOW - HIGH IMPACT] */}
        {/* ------------------------------------------------------------- */}
        <section className="relative py-24 md:py-32 bg-neutral-950 text-white overflow-hidden border-b border-neutral-900/80">
          
          {/* Tonal gold ambient glow background lights */}
          <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none z-0"></div>
          <div className="absolute bottom-0 left-[5%] w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Copy Panel */}
              <motion.div 
                className="lg:col-span-7 flex flex-col gap-6"
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div>
                  <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-amber-400 mb-2 backdrop-blur-sm shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                    <Sparkles size={14} className="mr-2" /> 소상공인 카페 회생 하이브리드 리모델링 v3
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white">
                  기존 간판은 그대로,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 drop-shadow-[0_0_35px_rgba(251,191,36,0.3)]">
                    매출 엔진은 새롭게.
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg text-neutral-400 font-medium leading-relaxed max-w-xl">
                  철거 인테리어 비용 제로. 매장명과 본질적인 개성은 고스란히 지킨 채, 검증된 120겹 시그니처 파이와 에그120 모듈을 이식하여 동네 상권의 객단가 한계를 가볍게 뛰어넘습니다.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
                  <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-amber-400 text-neutral-950 font-black rounded-xl hover:bg-amber-300 transition-all shadow-[0_4px_20px_rgba(251,191,36,0.3)] hover:scale-[1.02]" href="#contact">
                    리모델링 견적 문의 <ArrowRight size={18} className="ml-2" />
                  </a>
                  <a className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-neutral-900 border border-neutral-800 text-white font-extrabold rounded-xl hover:bg-neutral-800 transition-colors" href="#simulator">
                    내 매장 수익 시뮬레이션
                  </a>
                </div>
                
                <div className="flex flex-wrap gap-2.5 mt-2">
                  <span className="px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-xs font-bold text-neutral-350">#1,000만원대 소자본 전환</span>
                  <span className="px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-xs font-bold text-neutral-350">#5분 굽기 초간편 조리</span>
                  <span className="px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-xs font-bold text-neutral-350">#폐기율 0% 콜드 생지</span>
                  <span className="px-3.5 py-1.5 rounded-full border border-neutral-850 bg-neutral-900/60 text-xs font-bold text-neutral-350">#홀·포장·배달 올라운드</span>
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
                className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden relative min-h-[520px] flex items-end shadow-2xl group"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=82" 
                  alt="120겹 파이 클로즈업" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-103 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent"></div>
                
                {/* Frosted Glassmorphism card overlay */}
                <div className="relative z-10 p-6 m-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl backdrop-blur-md shadow-xl">
                  <h3 className="text-lg font-black text-amber-400 mb-1.5 flex items-center gap-2">
                    <Award size={18} /> 시그니처 120겹 파이 모듈
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed mb-3">
                    발효 및 성형 공정이 본사에서 완성되어 급냉 수급된 냉동 생지를, 전용 타이머 기구에 굽기만 하면 갓 오븐에서 나온 바삭한 크리스피의 참맛을 선사합니다.
                  </p>
                  <span className="inline-flex px-3 py-1 rounded bg-amber-400 text-neutral-950 text-[10px] font-black uppercase tracking-wider">
                    Signature core
                  </span>
                </div>
              </motion.div>

            </div>
          </div>
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
                    아무리 에스프레소를 추출해 팔아도 한계가 올 때,<br />
                    핵심 원인은 제조 피로도가 아닌 <span className="text-amber-500 font-extrabold">낮은 객단가</span>입니다.
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-bold leading-relaxed">
                    단순 음료 싸움에서 벗어나, 상온 보관 디저트의 상시 폐기 리스크를 우회하면서도 객단가를 방어할 고품질 샵인샵 디저트 모듈을 구동해야 생존할 수 있습니다.
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
                  src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779757782/120pie_%EC%98%81%EC%83%81_2_lnnpbh.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="120겹 파이 메뉴 연출 영상"
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
                <div className="relative z-10 p-6 text-white text-xs font-bold leading-relaxed">
                  <span className="text-amber-400 uppercase tracking-widest text-[9px] block mb-1">barista desk support</span>
                  "음료 제조 중에도 120겹 파이는 본사 자동 타이머 타이틀 하에 구워져 별도 주방 제조 피로도가 거의 없습니다."
                </div>
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

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(200px,_auto)]">
              
              {/* Bento Card 1: Value Core */}
              <motion.article 
                className="md:col-span-7 bg-neutral-900/60 border border-neutral-850 p-8 rounded-2xl flex flex-col justify-between hover:border-amber-400/40 transition-colors"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div>
                  <span className="w-10 h-10 rounded bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-6 shadow-sm p-1.5">
                    <img src={isPinkVariant ? "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779846449/logo_120pie_coffee3_jzgtyi.png" : "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779845741/logo_120pie_coffee_nu_woul37.png"} alt="" className="w-full h-full object-contain" />
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3">커피와 잘 어울리는 세트 메뉴로 한 잔의 만족을 더합니다</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                    아메리카노에 120겹 파이 또는 에그120을 함께 제안해 보세요. 고객은 간편하게 디저트를 즐기고, 매장은 자연스럽게 주문 구성을 넓힐 수 있습니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  <span className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-850 text-[10px] font-bold text-amber-400">커피와 좋은 조합</span>
                  <span className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-850 text-[10px] font-bold text-amber-400">간편한 세트 구성</span>
                  <span className="px-2.5 py-1 rounded bg-neutral-950 border border-neutral-850 text-[10px] font-bold text-amber-400">새로운 매출 기회</span>
                </div>
              </motion.article>

              {/* Bento Card 2: Embedded Crisp Dough Image */}
              <motion.div 
                className="md:col-span-5 bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden relative shadow-lg"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <video
                  src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779757960/120pie_%EC%98%81%EC%83%81_3_ylbwog.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label="120겹 파이 세트 메뉴 영상"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.2] opacity-75 hover:opacity-100 hover:scale-[1.23] transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
              </motion.div>

              {/* Bento Card 3: 샵인샵 */}
              <motion.article 
                className="md:col-span-4 bg-neutral-900/60 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-between hover:border-amber-400/40 transition-colors"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div>
                  <span className="w-8 h-8 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-4 p-1">
                    <img src={isPinkVariant ? "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779846449/logo_120pie_coffee3_jzgtyi.png" : "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779845741/logo_120pie_coffee_nu_woul37.png"} alt="" className="w-full h-full object-contain" />
                  </span>
                  <h3 className="text-base font-black text-white mb-2">지금 매장 분위기 그대로 시작</h3>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                    큰 공사나 간판 교체 없이, 작은 쇼케이스와 브랜드 안내만 더해 기존 카페 공간에 자연스럽게 어우러집니다.
                  </p>
                </div>
              </motion.article>

              {/* Bento Card 4: 초간편 조리 */}
              <motion.article 
                className="md:col-span-4 bg-neutral-900/60 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-between hover:border-amber-400/40 transition-colors"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div>
                  <span className="w-8 h-8 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-4 p-1">
                    <img src={isPinkVariant ? "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779846449/logo_120pie_coffee3_jzgtyi.png" : "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779845741/logo_120pie_coffee_nu_woul37.png"} alt="" className="w-full h-full object-contain" />
                  </span>
                  <h3 className="text-base font-black text-white mb-2">누구나 편하게 준비하는 5분 조리</h3>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                    복잡한 기술 없이 오븐에 넣고 버튼만 누르면 됩니다. 바쁜 운영 중에도 일정한 맛과 품질을 편하게 준비할 수 있습니다.
                  </p>
                </div>
              </motion.article>

              {/* Bento Card 5: 폐기 없음 */}
              <motion.article 
                className="md:col-span-4 bg-neutral-900/60 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-between hover:border-amber-400/40 transition-colors"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div>
                  <span className="w-8 h-8 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-4 p-1">
                    <img src={isPinkVariant ? "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779846449/logo_120pie_coffee3_jzgtyi.png" : "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779845741/logo_120pie_coffee_nu_woul37.png"} alt="" className="w-full h-full object-contain" />
                  </span>
                  <h3 className="text-base font-black text-white mb-2">필요한 만큼 구워 부담은 가볍게</h3>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                    냉동 보관된 생지를 판매 흐름에 맞춰 필요한 만큼만 구워, 재고와 폐기 부담을 한결 편안하게 관리할 수 있습니다.
                  </p>
                </div>
              </motion.article>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* BRAND PORTFOLIO STRUCTURE SECTION [V1 STRUCT IN V2 PREMIUM STYLE] */}
        {/* ------------------------------------------------------------- */}
        <section id="structure" className="py-24 bg-neutral-950 text-white overflow-hidden relative border-b border-neutral-900/80">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
             <motion.div className="max-w-3xl mx-auto mb-16" {...fadeIn}>
               <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Brand Architecture</span>
               <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">하나의 브랜드 안에서, 메뉴 선택은 더 다채롭게</h2>
               <p className="text-xs sm:text-base text-neutral-450 font-medium max-w-xl mx-auto">
                  120pie&coffee는 120겹파이와 에그120을 중심으로, 매장의 분위기와 손님 취향에 잘 어울리는 메뉴 구성을 함께 제안합니다.
               </p>
             </motion.div>

             <div className="max-w-4xl mx-auto bg-neutral-900/40 border border-neutral-850 rounded-3xl p-6 sm:p-10 backdrop-blur-sm shadow-2xl relative">
                <div className="bg-amber-400 text-neutral-950 font-black text-xl sm:text-2xl py-3 px-8 rounded-xl inline-block mb-12 shadow-[0_4px_24px_rgba(251,191,36,0.3)]">
                   120pie &amp; coffee <span className="font-extrabold text-xs ml-2 text-neutral-900/70">Master Brand</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  {/* Connect Line Graphic (Hidden on mobile) */}
                  <div className="hidden md:block absolute top-[-48px] left-[16.6%] right-[16.6%] h-12 border-t border-l border-r border-neutral-800 rounded-t-xl z-0"></div>
                  <div className="hidden md:block absolute top-[-48px] left-1/2 w-px h-12 bg-neutral-800 z-0"></div>

                  {/* Module Card 1 */}
                  <div className="bg-neutral-950 rounded-2xl border border-neutral-850 relative z-10 flex flex-col items-center overflow-hidden hover:border-amber-400/40 transition-colors">
                    <div className="h-28 w-full overflow-hidden bg-neutral-900 relative">
                      <video src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779758245/120pie_%EC%98%81%EC%83%81_4_bt9dyp.mp4" autoPlay muted loop playsInline aria-label="120겹파이 메뉴 영상" className="absolute inset-0 block w-full h-full object-cover scale-[1.24] opacity-60" />
                    </div>
                    <div className="p-5 flex flex-col items-center">
                      <div className="text-[10px] font-bold text-amber-400 mb-1.5 tracking-widest uppercase">Signature Pie</div>
                      <div className="text-lg font-black text-white mb-1">120겹파이 시리즈</div>
                      <div className="text-xs text-neutral-400 text-center font-medium">겉은 바삭하고 속은 든든한 대표 파이 메뉴</div>
                    </div>
                  </div>

                  {/* Module Card 2 */}
                  <div className="bg-neutral-950 rounded-2xl border border-neutral-850 relative z-10 flex flex-col items-center overflow-hidden hover:border-amber-400/40 transition-colors">
                    <div className="h-28 w-full overflow-hidden bg-neutral-900 relative">
                      <video src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779758485/egg120_%EC%98%81%EC%83%81_1_ugp5ob.mp4" autoPlay muted loop playsInline aria-label="에그120 메뉴 영상" className="absolute inset-0 block w-full h-full object-cover scale-[1.24] opacity-60" />
                    </div>
                    <div className="p-5 flex flex-col items-center">
                      <div className="text-[10px] font-bold text-green-400 mb-1.5 tracking-widest uppercase">Sweet Choice</div>
                      <div className="text-lg font-black text-white mb-1">에그120 계란빵</div>
                      <div className="text-xs text-neutral-400 text-center font-medium">부드러운 맛으로 가볍게 곁들이기 좋은 메뉴</div>
                    </div>
                  </div>

                  {/* Module Card 3 */}
                  <div className="bg-neutral-950 rounded-2xl border border-neutral-850 relative z-10 flex flex-col items-center overflow-hidden hover:border-amber-400/40 transition-colors">
                    <div className="h-28 w-full overflow-hidden bg-neutral-900 relative">
                      <video src="https://res.cloudinary.com/dx7l09wwu/video/upload/v1779758694/%EC%B8%84%EB%9F%AC%EC%8A%A4120_%EC%98%81%EC%83%81_1_ambj6h.mp4" autoPlay muted loop playsInline aria-label="츄러스 메뉴 영상" className="absolute inset-0 block w-full h-full object-cover scale-[1.24] opacity-60" />
                    </div>
                    <div className="p-5 flex flex-col items-center">
                      <div className="text-[10px] font-bold text-blue-400 mb-1.5 tracking-widest uppercase">More Favorites</div>
                      <div className="text-lg font-black text-white mb-1">츄러스 · 핫도그 · 수프</div>
                      <div className="text-xs text-neutral-400 text-center font-medium">매장과 상권에 맞춰 더해볼 수 있는 인기 메뉴</div>
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
            
            <motion.div className="max-w-3xl mb-16 text-center md:text-left" {...fadeIn}>
              <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Product Catalog</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
                독보적 맛과 강점을 품은<br />모듈형 대표 제품 패밀리
              </h2>
              <p className="text-xs sm:text-base text-neutral-400 font-medium">
                각각의 아이템이 뚜렷한 시장 경쟁력을 갖추고 있습니다. 사장님의 매장 입지와 주고객층의 특성에 맞춰 모듈을 조립해 장착해 보세요.
              </p>
            </motion.div>

            {/* Menu Cards Layout in V2 B&W Editorial Style */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Card 1: 120파이 Hero Card */}
              <div 
                onClick={() => setSelectedMenu("120겹파이")} 
                className="md:col-span-8 bg-neutral-900 border border-neutral-850 rounded-3xl overflow-hidden group shadow-xl hover:border-amber-400/40 transition-all cursor-pointer"
              >
                <div className="h-64 sm:h-80 overflow-hidden relative bg-neutral-950">
                  <img 
                    src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1500&auto=format&fit=crop" 
                    alt="120겹파이" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-102 group-hover:opacity-85 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                  <div className="absolute top-5 left-5 bg-amber-400 text-neutral-950 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    Core Signature
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-white">120파이 시리즈</h3>
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      상세 제품 일체 보기 &rarr;
                    </span>
                  </div>
                  <p className="text-neutral-400 text-xs sm:text-sm font-medium leading-relaxed">
                    결 하나하나가 살아있는 120겹 페이스트리 시그니처 공법. 육즙 가득한 든든한 고기파이부터 정통 사과 과육 애플파이, 식사 대용 피자 파이까지 아우르는 브랜드의 핵심 매출 기둥입니다.
                  </p>
                </div>
              </div>

              {/* Card 2: 에그120 Medium Card */}
              <div 
                onClick={() => setSelectedMenu("에그120")} 
                className="md:col-span-4 bg-neutral-900 border border-neutral-850 rounded-3xl overflow-hidden group shadow-xl hover:border-amber-400/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="h-64 sm:h-80 md:h-64 overflow-hidden relative bg-neutral-950">
                  <img 
                    src="https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=1000&auto=format&fit=crop" 
                    alt="에그120" 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-102 group-hover:opacity-85 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                  <div className="absolute top-5 left-5 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                    MZ Viral Engine
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2 flex justify-between items-center">
                      에그120 계란빵
                    </h3>
                    <p className="text-neutral-400 text-xs leading-relaxed font-medium">
                      밀가루 대신 100% 쌀반죽을 사용하여 건강하고 쫄깃한 식감의 고급 에그빵. 위트 넘치는 캐릭터 컵패키징과 뛰어난 맛으로 폭풍 바이럴을 이끕니다.
                    </p>
                  </div>
                  <span className="text-xs font-black text-amber-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    상세 쌀계란빵 보기 &rarr;
                  </span>
                </div>
              </div>

              {/* Card 3: 스낵 & 수프 Wide Card */}
              <div 
                onClick={() => setSelectedMenu("기타")} 
                className="md:col-span-12 bg-neutral-900 border border-neutral-850 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center gap-6 group hover:border-amber-400/40 hover:shadow-2xl transition-all cursor-pointer p-6 relative shadow-xl"
              >
                 <div className="absolute top-4 right-4 bg-neutral-850 text-neutral-400 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                   Snack &amp; Soups Expansion
                 </div>
                 <div className="flex gap-3 w-full md:w-auto shrink-0 justify-center">
                    <img src="https://images.unsplash.com/photo-1561571994-3c61c554181a?q=80&w=150&h=150&auto=format&fit=crop" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover opacity-70 group-hover:scale-103 group-hover:opacity-100 transition-all shadow-md" alt="" />
                    <img src="https://images.unsplash.com/photo-1619740455993-9e612b1af08a?q=80&w=150&h=150&auto=format&fit=crop" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover opacity-70 group-hover:scale-103 group-hover:opacity-100 transition-all shadow-md" alt="" />
                    <img src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=150&h=150&auto=format&fit=crop" className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover opacity-70 group-hover:scale-103 group-hover:opacity-100 transition-all shadow-md" alt="" />
                 </div>
                 <div className="text-center md:text-left flex-grow">
                    <h4 className="font-black text-lg sm:text-xl text-white flex flex-col sm:flex-row sm:items-center justify-between">
                       츄러스 · 직화 불고기 핫도그 · 프리미엄 수프
                       <span className="text-xs font-black text-amber-400 mt-2 sm:mt-0 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                          패밀리 디테일 보기 &rarr;
                       </span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-2 font-medium leading-relaxed max-w-3xl">
                       기름 없이 오븐만으로 구워내 담백한 츄러스, 불고기 패티의 깊은 풍미를 더한 수제 소시지 핫도그, 카페를 정식 브런치 공간으로 탈바꿈시켜 객단가를 대폭 견인하는 프리미엄 수프 라인업입니다.
                    </p>
                 </div>
              </div>
            </div>

            {/* Strategic Packaging Cards (V1 Data in V2 Styling) */}
            <div className="mt-16 bg-neutral-900 border border-neutral-850 text-white rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <span className="text-amber-400 font-bold tracking-widest text-xs mb-3 block font-mono uppercase">
                  Strategic Packaging Options
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mb-4">입지 상권 맞춤형 모듈형 패키징 추천</h3>
                <p className="text-xs sm:text-sm text-neutral-400 mb-10 max-w-2xl font-medium leading-relaxed">
                  지역 상권 특성과 핵심 연령층에 가장 잘 반응하는 아이템 조합을 맞춤형 팩 형태로 제안합니다. 시너지를 내는 최상의 조합으로 객단가와 마진을 극대화합니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-between hover:border-amber-400/40 transition-all">
                    <div>
                      <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mb-4">
                        모닝/오피스 브런치 팩
                      </span>
                      <h4 className="text-lg font-black text-white mb-2">프리미엄 수프 + 120파이</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-medium">
                        오피스 및 학원가 상권 최적화. 직장인/학생들의 아침 및 브런치 대용 수요를 완벽히 흡수하여 오전 매출과 평균 객단가를 2배 이상 견인합니다.
                      </p>
                    </div>
                    <div className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">추천: 오피스·대학가 상권</div>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-between hover:border-amber-400/40 transition-all">
                    <div>
                      <span className="bg-green-400/10 text-green-400 border border-green-400/20 text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mb-4">
                        MZ 핫플 바이럴 팩
                      </span>
                      <h4 className="text-lg font-black text-white mb-2">에그120 + 대표 시그니처 음료</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-medium">
                        핵심 대학가 및 트렌디한 로드 상권 저격. 쌀반죽의 차별화된 영양 가치와 위트 에그 그래픽 패키징 비주얼로 SNS 업로드와 자발적 홍보를 창출합니다.
                      </p>
                    </div>
                    <div className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">추천: 핫플레이스·번화가</div>
                  </div>

                  <div className="bg-neutral-950 border border-neutral-850 p-6 rounded-2xl flex flex-col justify-between hover:border-amber-400/40 transition-all">
                    <div>
                      <span className="bg-blue-400/10 text-blue-400 border border-blue-400/20 text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mb-4">
                        가정 밀집 배달 팩
                      </span>
                      <h4 className="text-lg font-black text-white mb-2">츄러스 + 핫도그 + 파이 결합</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-6 font-medium">
                        대규모 주거 및 아파트 단지 상권 특화. 온 가족의 다채로운 주말 간식 수요와 심야 늦은 시간대의 딜리버리 배달 매출을 확실히 틀어막는 안정적인 고수익 구조입니다.
                      </p>
                    </div>
                    <div className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-wider">추천: 대규모 주거 밀집지</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          {/* Menu Modal Render */}
          {selectedMenu && <MenuModal menuId={selectedMenu} onClose={() => setSelectedMenu(null)} />}
        </section>

        {/* ------------------------------------------------------------- */}
        {/* SIMULATOR SECTION [SAND YELLOW/AMBER THEME - INTERACTIVE COGNITIVE FOCUS] */}
        {/* ------------------------------------------------------------- */}
        <section className="py-24 bg-amber-50/50 border-b border-amber-100 text-neutral-900" id="simulator">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className="text-amber-700 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Interactive Calculator</span>
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-4 tracking-tight leading-tight">
                하루에 단 몇 개의 시그니처 빵만 구워 판매해도,<br />
                월간 누적 <span className="text-amber-600">추가 이익 리스크 방어선</span>이 증명됩니다.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 font-bold leading-relaxed max-w-xl">
                사장님의 일일 목표 판매 수량, 제품 판매 단가, 월 영업일 슬라이더를 세팅하여 실시간 월 매출 시뮬레이션을 즉시 파악해 보세요.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              
              {/* Left Input panel */}
              <div className="lg:col-span-5 bg-white border border-amber-100 p-6 sm:p-8 rounded-2xl flex flex-col justify-between shadow-sm">
                <div>
                  <h3 className="text-lg font-black text-neutral-900 mb-2">예상 판매 조건 입력</h3>
                  <p className="text-xs text-neutral-500 font-bold leading-relaxed mb-6">
                    매장 상황에 알맞은 보수적인 수치를 가상 대입하여 추가적인 월 매출 창출 한계를 계산합니다.
                  </p>

                  <div className="grid gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-neutral-600 flex justify-between">
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
                      <label className="text-xs font-black text-neutral-600 flex justify-between">
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
                      <label className="text-xs font-black text-neutral-600 flex justify-between">
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
                  <a className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-neutral-950 text-white font-black text-xs rounded-lg hover:bg-neutral-800 transition-colors shadow-sm" href="#contact">
                    맞춤 시뮬레이션 상세 상담 신청
                  </a>
                </div>
              </div>

              {/* Right Output & Plating Image (High Contrast Deep Gold Card) */}
              <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
                
                {/* Result Dash */}
                <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-neutral-950 p-8 rounded-2xl shadow-lg shadow-amber-400/10 flex flex-col justify-between min-h-[160px]">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-900/60 block mb-1">
                      Expected Monthly Added Sales
                    </span>
                    <h3 className="text-sm font-black text-neutral-900/80 mb-4 font-mono">
                      월간 예상 추가 매출액
                    </h3>
                  </div>
                  <div>
                    <strong className="text-3xl sm:text-4xl font-black tracking-tight block mb-2 leading-none">
                      {monthlySales.toLocaleString()} 원
                    </strong>
                    <p className="text-[11px] font-bold text-neutral-900/70">
                      하루 {quantity}개 × 평균 단가 {price.toLocaleString()}원 × 월 {days}일 가동 기준
                    </p>
                  </div>
                </div>

                {/* Split layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
                  <div className="bg-white border border-amber-100 rounded-2xl overflow-hidden relative min-h-[180px]">
                    <img 
                      src="https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80" 
                      alt="에그120 브런치 연출 샷" 
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 to-transparent"></div>
                    <span className="absolute bottom-4 left-4 text-white text-[11px] font-bold">에그120 쌀계란빵 대표컷</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 justify-between">
                    <div className="bg-white border border-amber-100 p-5 rounded-2xl shadow-sm">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">Monthly Quantity</span>
                      <strong className="text-xl font-black text-neutral-900 block mb-0.5">{monthlyQuantity.toLocaleString()} 개</strong>
                      <span className="text-[10px] text-neutral-500 font-bold leading-none">월간 예상 시그니처 공급량</span>
                    </div>

                    <div className="bg-white border border-amber-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">Expected Net Profit</span>
                        <strong className="text-base font-black text-amber-600 block">정식 상담 시 개별 산출</strong>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-bold mt-2 leading-none">원가율, 가맹 형태에 따른 개별 시트 지급</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* BEFORE AFTER SECTION [PURE WHITE THEME - CONTRAST COMPARE] */}
        {/* ------------------------------------------------------------- */}
        <section className="py-24 bg-white text-neutral-900 border-b border-neutral-100" id="before-after">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="max-w-3xl mb-16" {...fadeIn}>
              <span className="text-neutral-500 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Contrast Compare</span>
              <h2 className="text-3xl sm:text-4xl font-black text-black mb-4 tracking-tight leading-tight">
                단순히 메뉴 가짓수를 나열해 채우지 않고,<br />
                개인 매장의 <span className="text-amber-500 font-extrabold">한계 이익률 구조</span>를 재구축합니다.
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
                    <span className="text-neutral-500 font-black text-lg">기존 음료 중심 개인 매장</span>
                  </div>
                  <h3 className="text-xl font-black text-neutral-800 mb-6 leading-tight">소모적인 경쟁과 객단가 정체</h3>
                  
                  <div className="space-y-3.5 mb-6 text-xs sm:text-sm text-neutral-500 font-bold leading-relaxed">
                    <div className="flex gap-2"><span>•</span><p>단독 저마진 커피 주문 비율이 90% 이상으로 테이블당 결제 단가가 정체됩니다.</p></div>
                    <div className="flex gap-2"><span>•</span><p>선도 유지 및 유통기한 예측 실패로 유효기간이 만료된 빵들의 원가 폐기액이 누적됩니다.</p></div>
                    <div className="flex gap-2"><span>•</span><p>배달앱이나 인스타 검색에서 특징이 부재하여 브랜드 인지도 경쟁에서 한계를 맞이합니다.</p></div>
                  </div>
                </div>

                <div className="h-44 rounded-xl overflow-hidden relative border border-neutral-200 bg-neutral-100">
                  <img 
                    src="https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?auto=format&fit=crop&w=600&q=80" 
                    alt="외로운 심플 커피 잔 흑백 이미지" 
                    className="w-full h-full object-cover grayscale opacity-80" 
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
                    <span className="text-amber-400 font-black text-lg">120pie 결합 하이브리드 리모델링</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-6 leading-tight font-mono">시그니처 디저트 추가로 매장 활력 실현</h3>
                  
                  <div className="space-y-3.5 mb-6 text-xs sm:text-sm text-neutral-300 font-medium leading-relaxed">
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <p>고품격 120파이와 에그빵 결합 세트의 높은 결제 전환율로 평균 1인당 객단가를 크게 높입니다.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <p>공급 급냉 생지 시스템으로 주문과 동시에 타이머로만 구워내어 원가 폐기율 손실액 0원을 유지합니다.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <p>옐로우&amp;블랙 마스터 캐릭터 브랜딩과 시그니처 굿즈 박스 효과로 지역 인스타 자발 바이럴을 촉진합니다.</p>
                    </div>
                  </div>
                </div>

                <div className="h-44 rounded-xl overflow-hidden relative border border-neutral-800">
                  <img 
                    src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80" 
                    alt="풍성하고 고급스러운 브런치 다이닝 컷" 
                    className="w-full h-full object-cover opacity-90" 
                  />
                </div>
              </motion.article>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* ADOPTION STEPS & REAL CASES SECTION [FUSION - V2 EDITORIAL STYLE] */}
        {/* ------------------------------------------------------------- */}
        <section id="adoption" className="py-24 bg-neutral-950 text-white relative border-b border-neutral-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <motion.div className="max-w-3xl mx-auto text-center mb-16" {...fadeIn}>
              <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Adoption Guide &amp; Success Records</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
                투자 리스크는 최소한으로,<br />성공 가능성은 극대화로.
              </h2>
              <p className="text-xs sm:text-base text-neutral-450 font-medium max-w-xl mx-auto leading-relaxed">
                처음부터 거액을 투자해 위험을 지지 마십시오. 아주 가벼운 샵인샵 단계로 검증한 뒤 공동간판, 단독 가맹점으로 확장하는 똑똑한 성장 로드맵을 제공합니다.
              </p>
            </motion.div>

            {/* V1's 4 Adoption Steps in V2 Editorial Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {[
                { num: "01", title: "가장 가벼운 샵인샵", subtitle: "STEP 01", desc: "기존 베이커리 쇼케이스 한 칸에 전용 집기와 미니 POP판만 가볍게 배치합니다.", img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=300&fit=crop" },
                { num: "02", title: "확실한 브랜드 표기", subtitle: "STEP 02", desc: "매장 유리 윈도우 스티커와 내부 벽에 마스터 로고 및 캐릭터를 세련되게 부착합니다.", img: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=300&fit=crop" },
                { num: "03", title: "시너지 극대화 공동간판", subtitle: "STEP 03", desc: "기존 간판 우측에 'with 120pie&coffee' 패널을 병기하여 고객 신뢰를 배가시킵니다.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=300&fit=crop", highlight: true },
                { num: "04", title: "독보적인 단독 가맹전환", subtitle: "STEP 04", desc: "확신이 검증되었을 때, 전체 매장을 블랙&옐로우 시그니처 톤으로 리브랜딩 전환합니다.", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=300&fit=crop" }
              ].map((step) => (
                <div 
                  key={step.num}
                  className={`rounded-2xl overflow-hidden relative transition-all duration-300 flex flex-col h-full border ${
                    step.highlight 
                      ? "bg-amber-400 border-amber-400 text-neutral-950 shadow-[0_12px_36px_rgba(251,191,36,0.15)] scale-[1.02]" 
                      : "bg-neutral-900 border-neutral-850 hover:border-amber-400/40 text-white"
                  }`}
                >
                  <div className="h-28 overflow-hidden relative bg-neutral-950">
                    <img src={step.img} alt="" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute top-3 left-3 bg-neutral-950 border border-neutral-800 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                      {step.subtitle}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between gap-6">
                    <div>
                      <h3 className="text-lg font-black mb-1.5 leading-tight">{step.title}</h3>
                      <p className={`text-xs font-medium leading-relaxed ${step.highlight ? "text-neutral-800" : "text-neutral-400"}`}>
                        {step.desc}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedAdoptionStep(step.num)}
                      className={`w-full py-2.5 rounded-lg font-black text-xs transition-colors ${
                        step.highlight 
                          ? "bg-neutral-950 text-amber-400 hover:bg-black" 
                          : "bg-neutral-800 text-neutral-300 hover:bg-amber-400 hover:text-neutral-950"
                      }`}
                    >
                      실제 현장 사진 예시 보기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* V1's Super Success Case Integrated into V2 Premium Editorial Metrics */}
            <div className="border-t border-neutral-900/80 pt-20">
              <div className="text-center max-w-2xl mx-auto mb-16">
                 <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Success Statistics</span>
                 <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">실제 가맹점 도입 통계로 입증된 수치</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-neutral-900 border border-neutral-850 p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col justify-between text-center relative hover:border-amber-400/40 transition-colors">
                   <div className="text-amber-400 font-bold mb-2 text-xs uppercase tracking-wider font-mono">월 매출 증대율</div>
                   <div className="text-5xl sm:text-6xl font-black text-white mb-4"><AnimatedNumber value={300} suffix="%" /></div>
                   <p className="text-neutral-450 text-xs sm:text-sm font-semibold leading-relaxed">"기존의 노후 카페 매출 저하를 딛고 아침/식사 모듈 세트 결합으로 비수기 걱정이 증발했습니다."</p>
                   <span className="text-[10px] text-neutral-500 font-bold mt-4 block">- 대구 공동간판 매장 점주</span>
                </div>

                <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-neutral-950 p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col justify-between text-center relative hover:scale-[1.01] transition-transform">
                   <div className="text-neutral-900/80 font-bold mb-2 text-xs uppercase tracking-wider font-mono">단독매장 일 최고매출</div>
                   <div className="text-5xl sm:text-6xl font-black text-neutral-950 mb-4"><AnimatedNumber value={350} suffix="만 원" /></div>
                   <p className="text-neutral-900/80 text-xs sm:text-sm font-extrabold leading-relaxed">"120pie&amp;coffee 단독 전문점으로 완전 간판 전환 리브랜딩 후 줄 서는 핫플레이스가 되었습니다."</p>
                   <span className="text-[10px] text-neutral-950/60 font-black mt-4 block">- 서울 강남본점 점주</span>
                </div>

                <div className="bg-neutral-900 border border-neutral-850 p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col justify-between text-center relative hover:border-amber-400/40 transition-colors">
                   <div className="text-amber-400 font-bold mb-2 text-xs uppercase tracking-wider font-mono">도입비 투자회수기간</div>
                   <div className="text-5xl sm:text-6xl font-black text-white mb-4"><AnimatedNumber value={2} suffix="개월" /></div>
                   <p className="text-neutral-450 text-xs sm:text-sm font-semibold leading-relaxed">"주방 철거나 가구 신규 리스크 없이, 핵심 기기 셋업만으로 월 추가 마진을 얻어 즉시 회수했습니다."</p>
                   <span className="text-[10px] text-neutral-500 font-bold mt-4 block">- 경기 배달전문 샵인샵 점주</span>
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
        <StoresPreviewSection />

        {/* ------------------------------------------------------------- */}
        {/* OWNER SUPPORT SYSTEM SECTION [V3 FUSION] */}
        {/* ------------------------------------------------------------- */}
        <OwnerSystemSection />

        {/* ------------------------------------------------------------- */}
        {/* GALLERY SECTION [V3 FUSION] */}
        {/* ------------------------------------------------------------- */}
        <GallerySection filter={galleryFilter} setFilter={setGalleryFilter} />

        {/* ------------------------------------------------------------- */}
        {/* BRAND VIRAL & IDENTITY SECTION [V1 DATA IN V2 PREMIUM STYLE] */}
        {/* ------------------------------------------------------------- */}
        <section className="py-24 bg-white text-neutral-900 border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-neutral-550 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Viral Brand Support</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-neutral-950 leading-tight">
                골목 카페가 대기업급<br />비주얼 브랜딩을 획득하는 비결
              </h2>
              <p className="text-xs sm:text-base text-neutral-500 mt-3 font-bold leading-relaxed">
                위트 넘치는 캐릭터 홍보물과 프리미엄 굿즈 패키지 솔루션으로 고객이 스스로 인증샷을 찍고 바이럴하게 퍼트리게 만듭니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "선글라스를 낀 위트 캐릭터", desc: "귀여운 마스코트 '에그군' 그래픽을 포장 패키지, 캐리어, 테이크아웃 컵홀더, 매장 굿즈에 적극 배치하여 인스타그래머블한 시각 재미를 극대화시킵니다.", icon: "🥚", img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=400&fit=crop" },
                { title: "오픈 초기 지역 시선 집중", desc: "신규 가맹점 오픈 초기 화제를 모으도록, 대형 에그군 에어 풍선 벌룬 및 코스튬 인형탈 본사 무료 대여 프로모션을 구동하여 골목 내 압도적인 시선을 획득합니다.", icon: "🎈", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&fit=crop" },
                { title: "답례/선물용 굿즈 패키지", desc: "시그니처 에그빵과 파이를 고급 옐로우 굿즈 기프트 패키지 박스에 담아내는 포장 솔루션. 단순 현장 취식을 넘어 각종 행사 단체 답례품 및 단체선물 2차 판로를 엽니다.", icon: "🎁", img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=400&fit=crop" }
              ].map((asset, i) => (
                <div key={i} className="bg-neutral-50 border border-neutral-150 rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:border-black transition-all duration-300">
                  <div className="h-48 overflow-hidden relative bg-neutral-100">
                    <img src={asset.img} alt={asset.title} className="w-full h-full object-cover opacity-85 group-hover:scale-103 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-md border border-neutral-200">
                      <span className="text-sm">{asset.icon}</span>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex-grow">
                     <h3 className="font-black text-lg sm:text-xl text-neutral-900 mb-2">{asset.title}</h3>
                     <p className="text-xs sm:text-sm text-neutral-550 leading-relaxed font-bold">{asset.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PROCESS SECTION [RICH BLACK THEME - CRISPY PROCESS] */}
        {/* ------------------------------------------------------------- */}
        <section className="py-24 bg-neutral-950 text-white border-b border-neutral-900 relative" id="process">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
              
              {/* Left Column: 3 Steps Process */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <motion.div className="max-w-xl mb-12" {...fadeIn}>
                  <span className="text-amber-400 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Simple Operation</span>
                  <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                    숙련된 가맹 주방 노동력이 전혀 필요 없는,<br />
                    콜드체인 표준화 <span className="text-amber-400">5분 즉석 오븐 가동</span>
                  </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { step: "01", title: "급속 신선 냉동 생지 본사 물류망 보관", desc: "본사의 철저한 콜드체인 물류를 기반으로 완벽히 냉동 성형된 파이/에그빵 생지를 공급받아 유통 리스크 없이 매장 내 전용 냉동고에 그대로 보존합니다." },
                    { step: "02", title: "주문 알림 확인 즉시 타이머 기구 구동", desc: "온라인/오프라인 주문 확인 즉시 준비된 콜드 생지를 전용 미니 오븐기에 넣고 가볍게 버튼 타이머 조작만을 눌러 균일한 품질로 구워냅니다." },
                    { step: "03", title: "에그군 시그니처 팩 조립 및 서빙 제공", desc: "단 5분 남짓한 가열만으로 갓 구운 최고급 페이스트리 질감의 빵이 완성되면, 위트 넘치는 전용 마크 기프트 홀더에 담아 신속히 전달합니다." }
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
                className="lg:col-span-4 bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden relative min-h-[380px] flex items-end shadow-2xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" 
                  alt="바삭한 크리스피 반죽 베이킹 과정 이미지" 
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 contrast-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
                <div className="relative z-10 p-6 text-white text-xs font-bold leading-relaxed">
                  <span className="text-amber-400 uppercase tracking-widest text-[9px] block mb-1">baking simplicity</span>
                  "매장 내 반죽 발효 및 고되고 복잡한 생산 대기 없이, 1인 바리스타 사장님의 멀티 장사가 완벽히 유지됩니다."
                </div>
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
              <span className="text-neutral-500 font-bold tracking-widest text-xs uppercase mb-2 block font-mono">Logical Operation Analysis</span>
              <h2 className="text-3xl sm:text-4xl font-black text-black mb-4 tracking-tight leading-tight">
                기존 일반 생물 디저트 위탁 도입과는<br />
                원가 구조와 안전성 차원부터 격차가 큽니다.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Table 1 */}
              <div className="bg-neutral-50 border border-neutral-200 p-6 sm:p-8 rounded-2xl shadow-sm">
                <h3 className="text-base font-black text-black mb-6 flex items-center gap-2">
                  <Award size={18} className="text-neutral-950" /> 폐기 손실 및 일상 보관 편의 효율
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-250">
                        <th className="py-3 px-2 font-extrabold text-neutral-400 uppercase tracking-wider">구분 기준</th>
                        <th className="py-3 px-2 font-bold text-neutral-550">일반 위탁 빵류</th>
                        <th className="py-3 px-2 font-black text-amber-600 bg-amber-500/5">120pie &amp; coffee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr>
                        <td className="py-4 px-2 font-bold text-neutral-700">보관 &amp; 유통 기한</td>
                        <td className="py-4 px-2 text-neutral-500">상온 당일 소비 / 평균 2일 내 폐기</td>
                        <td className="py-4 px-2 text-black font-extrabold bg-amber-500/10">신선 냉동 보존으로 최장 6개월 보관</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-2 font-bold text-neutral-700">생산 시점 조리</td>
                        <td className="py-4 px-2 text-neutral-500">사전 쇼케이스 진열 유도 (선도 하락)</td>
                        <td className="py-4 px-2 text-black font-extrabold bg-amber-500/10">고객 주문 확인 즉시 즉석 타이머 오븐 가동</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-2 font-bold text-neutral-700">원재료 폐기비</td>
                        <td className="py-4 px-2 text-neutral-500">예측 실패 시 고스란히 손실 보전액 누적</td>
                        <td className="py-4 px-2 text-black font-extrabold bg-amber-500/10">재고 폐기 원가 사실상 0원에 수렴</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2 */}
              <div className="bg-neutral-50 border border-neutral-200 p-6 sm:p-8 rounded-2xl shadow-sm">
                <h3 className="text-base font-black text-black mb-6 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-neutral-950" /> 가맹 리모델링 비용 대비 투자 회수
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-250">
                        <th className="py-3 px-2 font-extrabold text-neutral-400 uppercase tracking-wider">구분 기준</th>
                        <th className="py-3 px-2 font-bold text-neutral-550">기타 프랜차이즈</th>
                        <th className="py-3 px-2 font-black text-amber-600 bg-amber-500/5">120pie &amp; coffee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr>
                        <td className="py-4 px-2 font-bold text-neutral-700">가맹 가입 개설 비용</td>
                        <td className="py-4 px-2 text-neutral-500">가맹비/교육비/인테리어 마진 5천만↑</td>
                        <td className="py-4 px-2 text-black font-extrabold bg-amber-500/10">가입비 거품 제로 / 1천만 대 실속 셋업</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-2 font-bold text-neutral-700">주방 및 인테리어 시공</td>
                        <td className="py-4 px-2 text-neutral-500">기존 카운터 강제 전면 철거 시공 강요</td>
                        <td className="py-4 px-2 text-black font-extrabold bg-amber-500/10">철거 및 공사비 0원 / 기존 인프라 그대로 사용</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-2 font-bold text-neutral-700">초기 리스크 극복 회수</td>
                        <td className="py-4 px-2 text-neutral-500">높은 자금 부담으로 회수 기간 2년 이상</td>
                        <td className="py-4 px-2 text-black font-extrabold bg-amber-500/10">부담 없는 가벼운 개시로 평균 2개월 내 회수</td>
                      </tr>
                    </tbody>
                  </table>
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
                { q: "기존 운영 개인 카페에 바로 이식 도입할 수 있나요?", a: "네, 기존 카운터 쇼케이스 내외의 소형 공간과 신선 냉동 보관 생지 보관고만 확보되어 있다면, 샵인샵 가이드에 맞춰 120파이와 에그120의 판매 모듈을 영업일에 바로 추가 구동하실 수 있습니다." },
                { q: "초보 조리자나 아르바이트생도 조리 생산할 수 있나요?", a: "네, 성형과 발효 등 전문 제빵사의 숙련 공정은 본사 자동화 물류 시스템을 통해 성형 생지 형태로 출고됩니다. 현장에서는 전용 타이머기에 굽기만 하면 5분 내외 완성이 가능하여 교육 1시간이면 완결됩니다." },
                { q: "초기 도입 가동 자본이 지나치게 많이 소모되지 않나요?", a: "아닙니다. 인테리어 전체 철거 등을 강요하지 않고 기존 점포 주방 인프라를 백분 보전하여 전용 미니 오븐과 워머, 엠블럼 POP 기물 등의 합리적 수백만 원 대의 가벼운 비용으로 개시를 제안합니다." },
                { q: "120겹파이만 우선적으로 한정 도입해 검증해 볼 수 있나요?", a: "네, 메인 핵심 브랜드 기둥인 120파이 모듈만 우선 샵인샵 도입하여 상권 시장성을 충분히 검증한 뒤, 점진적으로 에그120이나 츄러스 등의 추가 확장 패밀리 모듈을 퍼즐처럼 결합하시는 스마트 플랜이 활짝 열려있습니다." },
                { q: "with 공동간판은 꼭 달아야 하며, 기존 개인 상호를 지킬 수 있나요?", a: "공동간판은 필수가 아닌 상생 옵션입니다. 기존 사장님 매장 명칭(예: 마포커피)은 100% 지키며, 우측 하단에 조그마한 with 120pie 패널만 부착하는 것을 권장드립니다. 기존 단골 고객의 거부감은 막고, 검증된 맛집 브랜드를 슬쩍 추가해 신뢰도를 크게 올리는 가장 이상적인 동반 매출 증진 기법입니다." },
                { q: "정식 단독 가맹 대리점 브랜드 전환은 언제 가능한가요?", a: "가벼운 샵인샵 또는 병기 공동간판 도입을 거쳐 지역 가맹 매출과 마진, 배달/포장 시장 반응이 기대 이상으로 검증되어, 아예 본격적인 마스터 옐로우&블랙 브랜드 매장으로 전환을 결심하실 때, 본사의 리모델링 시공 우대 지원금을 대폭 지원받아 완벽한 120pie&coffee 전문점으로 탈바꿈하실 수 있습니다." }
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
                    className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm sm:text-base rounded-xl transition-all shadow-[0_4px_24px_rgba(251,191,36,0.3)] hover:scale-[1.01]"
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
      {/* FOOTER (Minimal Sticky Black) */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-16 text-neutral-500 text-xs font-bold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 font-black text-lg tracking-tight text-white mb-4">
                <span className="w-8 h-8 rounded bg-amber-400 text-neutral-950 font-black text-sm flex items-center justify-center">
                  120
                </span>
                <span>120pie &amp; coffee</span>
              </div>
              <p className="text-neutral-600 leading-relaxed font-semibold">
                소상공인 개인 매장의 회생과 새로운 돌파구를 위해, 가볍고 감각적인 소프트웨어 모듈 브랜딩 리모델링 패밀리 자산을 제공합니다.
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-sm font-black mb-4 uppercase tracking-wider">주요 파트너 모듈</h4>
              <ul className="space-y-2.5 font-semibold text-neutral-500">
                <li><span className="hover:text-amber-400 transition-colors cursor-pointer">120겹 시그니처 파이 모듈</span></li>
                <li><span className="hover:text-amber-400 transition-colors cursor-pointer">에그120 프리미엄 에그빵</span></li>
                <li><span className="hover:text-amber-400 transition-colors cursor-pointer">5분 조리 오븐 타이머 시스템</span></li>
                <li><span className="hover:text-amber-400 transition-colors cursor-pointer">원클릭 다이렉트 모바일 통합물류</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-black mb-4 uppercase tracking-wider">도입 방식 가이드</h4>
              <ul className="space-y-2.5 font-semibold text-neutral-500">
                <li><span className="hover:text-amber-400 transition-colors cursor-pointer">실속형 샵인샵 도입 (100만 원대)</span></li>
                <li><span className="hover:text-amber-400 transition-colors cursor-pointer">브랜드 표기 스티커 셋업</span></li>
                <li><span className="hover:text-amber-400 transition-colors cursor-pointer">with 공동간판 병기 듀얼제휴</span></li>
                <li><span className="hover:text-amber-400 transition-colors cursor-pointer">단독 가맹점 리모델링 전환</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-black mb-4 uppercase tracking-wider">고객지원 &amp; 본사</h4>
              <ul className="space-y-2 text-neutral-600">
                <li><span>(주)일이공에프앤비 상생 협동 조합</span></li>
                <li><span>대표메일: partner@120pie.com</span></li>
                <li><span>가맹 가입 다이렉트 CS: 1644-1200</span></li>
                <li><span>본사 주소: 서울시 강남구 역삼로 120-1 4층</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-neutral-600">
            <p>&copy; {new Date().getFullYear()} 120pie &amp; coffee Co. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-neutral-450 transition-colors cursor-pointer">이용약관</span>
              <span className="hover:text-neutral-450 transition-colors cursor-pointer font-black text-neutral-500">개인정보처리방침</span>
              <span className="hover:text-neutral-450 transition-colors cursor-pointer">상생조합규약</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
