"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, ChevronUp, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../components/landing-v6/Header";
import Footer from "../../../components/landing-v6/Footer";
import ContactForm from "../../../components/landing-v6/ContactForm";

const FAQS = [
  { 
    q: "지금 운영 중인 카페에도 도입할 수 있나요?", 
    a: "네, 가능합니다. 기존 매장을 크게 바꾸지 않고, 파이 메뉴를 준비하고 판매할 수 있는 작은 공간과 운영 환경을 확인한 뒤 시작할 수 있습니다. 매장 구조에 맞는 도입 방식은 상담을 통해 함께 정리해드립니다." 
  },
  { 
    q: "파이 조리가 어렵지는 않나요?", 
    a: "복잡한 반죽이나 제빵 과정은 필요하지 않습니다. 준비된 생지를 보관해두었다가 주문이 들어오면 정해진 방식으로 구워, 커피와 함께 바로 제공할 수 있습니다." 
  },
  { 
    q: "간판이나 인테리어를 바꿔야 하나요?", 
    a: "필수는 아닙니다. 기존 상호와 매장 분위기를 유지한 채 메뉴부터 시작할 수 있습니다. 외부 브랜드 표기나 매장 변화는 판매 반응을 확인한 뒤 필요에 따라 선택하시면 됩니다." 
  },
  { 
    q: "120파이만 먼저 판매해볼 수 있나요?", 
    a: "가능합니다. 대표 메뉴인 파이부터 시작해 손님 반응을 살펴본 뒤, 에그120이나 츄러스, 핫도그, 핫바, 떡볶이 같은 메뉴를 매장에 맞게 추가할 수 있습니다." 
  },
  { 
    q: "도입 전에 어떤 준비가 필요한가요?", 
    a: "판매 공간, 냉동 보관과 조리가 가능한 환경, 예상 판매 메뉴를 먼저 확인합니다. 상담 시 현재 매장 사진이나 운영 상황을 바탕으로 필요한 준비 사항을 안내해드립니다." 
  },
  { 
    q: "나중에 120pie 매장으로 확장할 수도 있나요?", 
    a: "네. 메뉴 도입 후 고객 반응과 운영 결과를 충분히 확인한 다음, 브랜드 표기 추가나 매장 전환 여부를 선택할 수 있습니다. 처음부터 큰 변화를 결정하실 필요는 없습니다." 
  }
];

export default function FAQSubpage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF4] dark:bg-[#0A0A0A] text-[#0D233A] dark:text-neutral-250 transition-colors duration-300 font-sans antialiased">
      <Header onContactClick={openContactModal} />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-[#FFF5D1] dark:bg-[#15130F] text-center transition-colors">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs sm:text-sm font-extrabold text-amber-500 uppercase tracking-widest block mb-3">
            FAQ
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-amber-50 tracking-tight leading-none mb-4">
            자주 묻는 질문
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-xl mx-auto">
            디저트 샵인샵 도입부터 가맹점 혜택, 매장 운영 관리까지 가장 많이 질문하시는 내용들을 신속하게 답변해 드립니다.
          </p>
        </div>
      </section>

      {/* Accordion FAQ Area */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={faq.q}
                className="bg-white dark:bg-neutral-900 border border-[#e6dfc3]/40 dark:border-neutral-900/60 rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.01)] transition-all duration-300"
              >
                {/* Question Trigger */}
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className={`w-5 h-5 shrink-0 transition-colors ${isOpen ? "text-amber-500" : "text-neutral-450"}`} />
                    <span className="text-sm sm:text-base font-black text-neutral-900 dark:text-white leading-tight">
                      {faq.q}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-neutral-450 shrink-0" />
                  )}
                </button>

                {/* Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-850 pt-4 break-keep whitespace-pre-line">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Inquiry Callout Box */}
      <section className="py-12 max-w-3xl mx-auto px-4">
        <div className="bg-[#FFF5D1]/10 dark:bg-neutral-900 border border-[#e6dfc3]/30 dark:border-neutral-850 p-6 sm:p-8 rounded-[2rem] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
            찾으시는 질문의 답변이 없으신가요?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-450 font-medium max-w-md mx-auto">
            본사 전담 컨설턴트와의 메신저 및 실시간 문자 상담 신청을 통해 궁금하신 모든 점을 상세하게 다이렉트로 피드백해 드립니다.
          </p>
          <div className="pt-2">
            <button
              onClick={openContactModal}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs sm:text-sm font-black rounded-xl transition-all shadow-md active:scale-95"
            >
              1:1 창업 문의하기
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <ContactForm isModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </div>
  );
}
