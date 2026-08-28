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
  const sendSmsAction = useAction(api.aligo.sendEventSms);
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
      setFloatingSettings({ ...convexFloating, isActive: true });
    } else {
      if (typeof window !== "undefined") {
        const storedFloat = localStorage.getItem("120_floatings");
        if (storedFloat) {
          try {
            const parsed = JSON.parse(storedFloat);
            setFloatingSettings({ ...parsed, isActive: true });
          } catch (e) {
            console.error(e);
            setFloatingSettings({
              isActive: true,
              instaUrl: "https://www.instagram.com/120pie77/",
              youtubeUrl: "https://youtube.com",
              chatUrl: "https://kakao.com",
              phoneNo: "1566-3594",
              kakaoUrl: "https://kakao.com",
              blogUrl: "https://blog.naver.com/120pie_coffee"
            });
          }
        } else {
          setFloatingSettings({
            isActive: true,
            instaUrl: "https://www.instagram.com/120pie77/",
            youtubeUrl: "https://youtube.com",
            chatUrl: "https://kakao.com",
            phoneNo: "1566-3594",
            kakaoUrl: "https://kakao.com",
            blogUrl: "https://blog.naver.com/120pie_coffee"
          });
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

      // Karrot Pixel conversion tracking
      if (typeof window !== "undefined" && (window as any).karrotPixel) {
        try {
          (window as any).karrotPixel.track('SubmitApplication');
        } catch (err) {
          console.error("Karrot SubmitApplication tracking failed:", err);
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

      // Karrot Pixel conversion tracking (fallback path)
      if (typeof window !== "undefined" && (window as any).karrotPixel) {
        try {
          (window as any).karrotPixel.track('SubmitApplication');
        } catch (err) {
          console.error("Karrot SubmitApplication tracking failed:", err);
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
    </>
  );
}
