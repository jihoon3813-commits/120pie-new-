"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { triggerConsultationSms } from "@/app/utils/sms";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

interface InquiryFormData {
  name: string;
  phone: string;
  storeType: string;
  existingStoreName: string;
  message: string;
}

export function InquiryModal({
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

  // Dynamic Theme Styling Tokens
  const modalBg = isPink 
    ? "bg-[#fffdf9] border-[#f2ccd7] text-neutral-900 shadow-2xl" 
    : "bg-[#fffdf4] border border-[#e6dfc3] text-[#0d233a] shadow-2xl";
  
  const headerDivider = isPink ? "border-[#f2ccd7]" : "border-[#e6dfc3]";
  const labelAccent = isPink ? "text-rose-500" : "text-[#0d233a]";
  const titleText = isPink ? "text-neutral-950" : "text-[#0d233a]";
  const descText = isPink ? "text-neutral-600" : "text-[#576575]";
  
  const closeBtn = isPink 
    ? "text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/60" 
    : "text-[#0d233a] hover:text-black bg-[#fff9e6] hover:bg-[#fff5cc]";
  
  const inputBg = isPink 
    ? "bg-white border-[#f3d3de] text-neutral-900 placeholder-neutral-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500" 
    : "bg-white border border-[#e6dfc3] text-[#0d233a] placeholder-[#7d8c9e] focus:border-[#ffd500] focus:ring-1 focus:ring-[#ffd500]";
  
  const checkboxAccent = isPink ? "accent-rose-500" : "accent-[#ffd500]";
  
  const submitBtn = isPink 
    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_24px_rgba(244,63,94,0.25)]" 
    : "bg-[#ffd500] hover:bg-[#e6bd00] text-[#0d233a] shadow-[0_4px_24px_rgba(255,213,0,0.2)]";

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
          className={`rounded-3xl w-full max-w-xl overflow-hidden relative text-left border ${modalBg}`}
        >
          <button type="button" onClick={onClose} aria-label="닫기" className={`absolute top-5 right-5 rounded-full p-2.5 z-10 transition-colors cursor-pointer border-0 ${closeBtn}`}>
            <X size={18} />
          </button>
          <div className={`p-7 sm:p-9 border-b text-center ${headerDivider}`}>
            <span className={`font-bold tracking-widest text-[10px] uppercase block mb-2 font-mono ${labelAccent}`}>Easy Inquiry</span>
            <h3 className={`text-2xl font-black mb-2 ${titleText}`}>편하게 상담받아 보세요</h3>
            <p className={`text-xs sm:text-sm font-medium ${descText}`}>매장에 잘 맞는 메뉴 구성과 시작 방법을 안내드립니다.</p>
          </div>
          {submitted ? (
            <div className="p-10 text-center">
              <h4 className={`text-xl font-black mb-3 ${titleText}`}>문의가 잘 접수되었습니다!</h4>
              <p className={`text-sm leading-relaxed ${descText}`}>남겨주신 연락처로 편하게 안내드리겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="성함" required className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border ${inputBg}`} />
                <input type="tel" inputMode="numeric" autoComplete="tel" maxLength={13} name="phone" value={formData.phone} onChange={onChange} placeholder="연락처" required className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border ${inputBg}`} />
              </div>
              <select name="storeType" value={formData.storeType} onChange={onChange} className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border appearance-none ${inputBg}`}>
                <option value="샵인샵 도입">간단한 메뉴 추가로 시작</option>
                <option value="브랜드 병기 도입">브랜드 안내와 함께 운영</option>
                <option value="공동간판 제휴">함께 보이는 간판 협업</option>
                <option value="단독 매장 전환">전용 매장으로 전환 상담</option>
                <option value="신규 무점포/창업">새로운 매장 창업 상담</option>
              </select>
              <textarea name="message" value={formData.message} onChange={onChange} rows={3} placeholder="매장 형태나 궁금한 점을 편하게 남겨주세요." className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors border resize-none ${inputBg}`} />
              <label className={`flex items-start gap-2 text-[10px] font-bold cursor-pointer select-none ${isPink ? "text-neutral-500" : "text-neutral-450"}`}>
                <input type="checkbox" required defaultChecked className={`mt-0.5 ${checkboxAccent}`} />
                상담 안내를 위한 개인정보 수집 및 연락에 동의합니다. (필수)
              </label>
              <button type="submit" className={`pink-primary-button w-full py-4 font-black text-sm rounded-xl transition-all cursor-pointer border-0 ${submitBtn}`}>
                무료 상담 문의하기
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function formatPhoneNumber(value: string) {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 8) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
}

export default function FloatingAndInquiry({
  forceOpenModal,
  onModalClose,
  isPink = false
}: {
  forceOpenModal?: boolean;
  onModalClose?: () => void;
  isPink?: boolean;
}) {
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [floatingOpen, setFloatingOpen] = useState(false);
  const [floatingSettings, setFloatingSettings] = useState<any>(null);

  const [formData, setFormData] = useState<InquiryFormData>({
    name: "",
    phone: "",
    storeType: "샵인샵 도입",
    existingStoreName: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const addInquiry = useMutation(api.inquiries.add);
  const sendSmsAction = useAction(api.aligo.sendSms);
  const convexFloating = useQuery(api.floatings.get);

  // Sync forced open state from parent
  useEffect(() => {
    if (forceOpenModal) {
      setInquiryModalOpen(true);
    }
  }, [forceOpenModal]);

  // Load floating settings from Convex
  useEffect(() => {
    if (convexFloating) {
      setFloatingSettings(convexFloating);
    } else {
      if (typeof window !== "undefined") {
        const storedFloat = localStorage.getItem("120_floatings");
        if (storedFloat) {
          try {
            setFloatingSettings(JSON.parse(storedFloat));
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
  }, [convexFloating]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "phone" ? formatPhoneNumber(value) : value }));
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
      
      // Track successful inquiry submission
      fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "inquiry_submit",
          path: window.location.pathname,
          referrer: document.referrer || "direct"
        })
      }).catch(err => console.error("InquirySubmit tracking failed", err));

      if (typeof window !== "undefined" && (window as any).wcs) {
        try {
          if (!(window as any).wcs_add) (window as any).wcs_add = {};
          (window as any).wcs_add["wa"] = process.env.NEXT_PUBLIC_NAVER_AD_ACCOUNT_ID || "s_15663594120p";
          const _nasa = {} as any;
          _nasa["cnv"] = (window as any).wcs.cnv("4", "10");
          (window as any).wcs_do(_nasa);
        } catch (err) {
          console.error("Naver inquiry conversion tracking failed:", err);
        }
      }
    } catch (err) {
      console.error("Failed to submit inquiry to Convex", err);
      // fallback
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("120_inquiries");
        const list = stored ? JSON.parse(stored) : [];
        const newInq = {
          id: "inq-" + Date.now(),
          ...formData,
          regDate: new Date().toISOString().split("T")[0]
        };
        localStorage.setItem("120_inquiries", JSON.stringify([...list, newInq]));
      }
      triggerConsultationSms(sendSmsAction, formData.name, formData.phone, formData.storeType);
      setFormSubmitted(true);
      
      // Track fallback successful inquiry submission
      fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "inquiry_submit_fallback",
          path: window.location.pathname,
          referrer: document.referrer || "direct"
        })
      }).catch(err => console.error("InquirySubmit fallback tracking failed", err));

      if (typeof window !== "undefined" && (window as any).wcs) {
        try {
          if (!(window as any).wcs_add) (window as any).wcs_add = {};
          (window as any).wcs_add["wa"] = process.env.NEXT_PUBLIC_NAVER_AD_ACCOUNT_ID || "s_15663594120p";
          const _nasa = {} as any;
          _nasa["cnv"] = (window as any).wcs.cnv("4", "10");
          (window as any).wcs_do(_nasa);
        } catch (err) {
          console.error("Naver inquiry conversion tracking failed:", err);
        }
      }
    }
  };

  const handleCloseModal = () => {
    setInquiryModalOpen(false);
    setFormSubmitted(false);
    setFormData({
      name: "",
      phone: "",
      storeType: "샵인샵 도입",
      existingStoreName: "",
      message: ""
    });
    if (onModalClose) {
      onModalClose();
    }
  };

  // Main floating button styles
  const triggerBtnClosed = isPink
    ? "bg-gradient-to-tr from-[#bf3e67] to-[#f25f8a] hover:from-[#df4977] hover:to-[#ff7b9f] shadow-[0_6px_20px_rgba(242,95,138,0.45)]"
    : "bg-gradient-to-tr from-[#0d233a] to-[#133252] hover:from-[#133252] hover:to-[#1c446e] shadow-[0_6px_20px_rgba(13,35,58,0.25)]";

  return (
    <>
      {/* Inquiry Modal */}
      <InquiryModal
        open={inquiryModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        submitted={formSubmitted}
        isPink={isPink}
      />

      {/* Floating Buttons */}
      {floatingSettings?.isActive && (
        <>
          {/* PC View: Always visible vertically */}
          <div className={`hidden md:flex fixed bottom-6 right-6 z-[90] flex-col items-center gap-2.5 p-2 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.12)] border transition-all duration-300 select-none text-white ${
            isPink 
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
                className={`p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-110 active:scale-95 cursor-pointer relative group border-0 ${isPink ? "bg-[#f25f8a] hover:bg-[#df4977]" : "bg-[#ffd500] hover:bg-[#e6bd00]"}`}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isPink ? "#ffffff" : "#0d233a" }} className={`w-[16px] h-[16px] ${isPink ? "text-white" : "text-[#0d233a]"}`}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>빠른 실시간 상담</span>
              </button>
            )}
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
                    className={`p-2.5 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-115 active:scale-90 cursor-pointer relative group border-0 ${isPink ? "bg-[#f25f8a] hover:bg-[#df4977]" : "bg-[#ffd500] hover:bg-[#e6bd00]"}`}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: isPink ? "#ffffff" : "#0d233a" }} className={`w-[16px] h-[16px] ${isPink ? "text-white" : "text-[#0d233a]"}`}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-white text-[9px] font-extrabold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 whitespace-nowrap transition-all duration-200" style={{ backgroundColor: "#1e1b1c", color: "#ffffff" }}>빠른 실시간 상담</span>
                  </button>
                )}
              </div>
            )}

            {/* Floating Trigger button for Mobile */}
            <button
              onClick={() => setFloatingOpen(!floatingOpen)}
              className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all scale-100 hover:scale-105 active:scale-95 cursor-pointer border-0 ${
                isPink
                  ? "bg-gradient-to-tr from-[#bf3e67] to-[#f25f8a] shadow-[0_4px_12px_rgba(242,95,138,0.35)]"
                  : "bg-gradient-to-tr from-[#ffd500] to-[#ffc400] shadow-[0_4px_12px_rgba(255,213,0,0.35)]"
              }`}
            >
              <Plus size={18} className={`transition-transform duration-300 ${floatingOpen ? "rotate-45" : ""}`} style={{ color: isPink ? "#ffffff" : "#0d233a" }} />
            </button>
          </div>
        </>
      )}
    </>
  );
}
