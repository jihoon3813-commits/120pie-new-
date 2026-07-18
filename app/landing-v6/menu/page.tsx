"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../../components/landing-v6/Header";
import Footer from "../../../components/landing-v6/Footer";
import ContactForm from "../../../components/landing-v6/ContactForm";
import { MENU_DATA, MenuItem } from "@/app/constants/menu";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

const getBadgeClasses = (badge: string) => {
  if (badge === "ORIGINAL") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30";
  }
  if (badge === "MEAT") {
    return "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30";
  }
  if (badge === "PIZZA") {
    return "bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30";
  }
  if (badge === "NEW") {
    return "bg-amber-500 text-neutral-950 font-black";
  }
  return "bg-neutral-900 text-amber-400 dark:bg-neutral-800 dark:text-amber-300";
};

export default function MenuSubpage() {
  const [activeTab, setActiveTab] = useState<string>("120겹파이");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  // Tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSubFilter("all");
    setSearchQuery("");
  };

  // Sub filters mapping
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

  const currentCategory = MENU_DATA[activeTab];

  const getFilteredItems = (): MenuItem[] => {
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
          items = items.filter(item => ["아메리카노", "카페 라떼", "바닐라 라떼", "콜드브루"].some(n => item.name.includes(n)));
        } else if (subFilter === "latte") {
          items = items.filter(item => item.name.includes("라떼") && !["카페 라떼", "바닐라 라떼"].some(n => item.name.includes(n)));
        } else if (subFilter === "smoothie") {
          items = items.filter(item => item.name.includes("스무디") || item.name.includes("쉐이크"));
        } else if (subFilter === "juice") {
          items = items.filter(item => item.name.includes("에이드") || item.name.includes("티") || item.name.includes("주스"));
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

  return (
    <div className="min-h-screen bg-[#FFFDF4] dark:bg-[#0A0A0A] text-[#0D233A] dark:text-neutral-250 transition-colors duration-300 font-sans antialiased">
      <Header onContactClick={openContactModal} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#FFF5D1] dark:bg-[#15130F] text-center transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-xs sm:text-sm font-extrabold text-amber-500 uppercase tracking-widest mb-3"
          >
            120pie & coffee menu
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-amber-50 tracking-tight leading-none mb-4"
          >
            120pie 시그니처 메뉴
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed max-w-xl mx-auto"
          >
            120겹의 극대화된 바삭함과 신선함이 깃든 다양한 메뉴들을 한눈에 확인하세요.
          </motion.p>
        </div>
      </section>

      {/* Tabs */}
      <section className="sticky top-[47px] md:top-[51px] z-30 bg-[#FFFDF4] dark:bg-[#0A0A0A] border-b border-[#e6dfc3] dark:border-neutral-900 py-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-hide">
            {Object.keys(MENU_DATA).map((tabId) => (
              <button
                key={tabId}
                onClick={() => handleTabChange(tabId)}
                className={`px-5 py-2.5 rounded-full text-sm font-black whitespace-nowrap transition-all duration-200 ${
                  activeTab === tabId
                    ? "bg-amber-400 text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                {tabId}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid & Filters */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4">
        
        {/* Search & Sub-filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-6 border-b border-[#e6dfc3]/50 dark:border-neutral-900">
          {/* Sub Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {subFilters[activeTab]?.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSubFilter(filter.id)}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
                  subFilter === filter.id
                    ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 font-extrabold"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-850 text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="메뉴명 또는 키워드 검색"
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 focus:border-amber-500 focus:outline-none rounded-2xl pl-10 pr-4 py-2.5 text-sm transition-all"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
          </div>
        </div>

        {/* Menu Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  key={item.name}
                  className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-[#e6dfc3]/40 dark:border-neutral-900/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col group hover:shadow-lg hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className={`aspect-[1.1] w-full overflow-hidden bg-white relative transition-all ${
                    item.name.includes("컵팥빙수") ? "p-6 sm:p-8" : "p-3 sm:p-5"
                  }`}>
                    <img
                      src={optimizeCloudinaryUrl(item.img)}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 select-none pointer-events-none"
                    />
                    {item.badge && (
                      <span className={`absolute top-4 left-4 px-2.5 py-1 text-[10px] font-black tracking-wide rounded-lg shadow-sm ${getBadgeClasses(item.badge)}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-6 text-left flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-black text-neutral-900 dark:text-white leading-tight mb-2">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed break-keep line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-neutral-400"
            >
              검색 조건에 맞는 메뉴가 존재하지 않습니다.
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      <Footer />
      
      {/* 팝업 모달 */}
      <ContactForm isModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </div>
  );
}
