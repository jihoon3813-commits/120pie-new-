"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { DEFAULT_TERMS, DEFAULT_PRIVACY, DEFAULT_REFUND } from "@/app/constants/policies";

interface FooterProps {
  logoUrl?: string;
}

export default function Footer({
  logoUrl = "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781183166/120%ED%8C%8C%EC%9D%B4_%EC%BB%A4%ED%94%BC_%EA%B8%88%EC%A0%95%EC%A0%90_%EC%B1%84%EB%84%90%EC%82%AC%EC%9D%B8_%EB%94%94%EC%9E%90%EC%9D%B8_250828_cnfrik.png",
}: FooterProps) {
  const pathname = usePathname();
  const isSubpage = pathname !== "/landing-v6";

  const [terms, setTerms] = useState("");
  const [privacy, setPrivacy] = useState("");
  const [refund, setRefund] = useState("");
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | "refund" | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTerms(localStorage.getItem("120_terms_of_use") || DEFAULT_TERMS);
      setPrivacy(localStorage.getItem("120_privacy_policy") || DEFAULT_PRIVACY);
      setRefund(localStorage.getItem("120_refund_policy") || DEFAULT_REFUND);
    }
  }, []);

  const openPolicyModal = (type: "terms" | "privacy" | "refund") => {
    if (typeof window !== "undefined") {
      if (type === "terms") {
        setTerms(localStorage.getItem("120_terms_of_use") || DEFAULT_TERMS);
      } else if (type === "privacy") {
        setPrivacy(localStorage.getItem("120_privacy_policy") || DEFAULT_PRIVACY);
      } else if (type === "refund") {
        setRefund(localStorage.getItem("120_refund_policy") || DEFAULT_REFUND);
      }
    }
    setActiveModal(type);
  };

  const getModalTitle = () => {
    if (activeModal === "terms") return "이용약관";
    if (activeModal === "privacy") return "개인정보처리방침";
    if (activeModal === "refund") return "환불정책";
    return "";
  };

  const getModalContent = () => {
    if (activeModal === "terms") return terms;
    if (activeModal === "privacy") return privacy;
    if (activeModal === "refund") return refund;
    return "";
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 py-16 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo and Info */}
          <div className="md:col-span-5 space-y-6">
            <img src={logoUrl} alt="120pie Logo" className="h-7 sm:h-10 w-auto object-contain" />
            <p className="text-xs leading-relaxed max-w-sm">
              120pie는 독창적인 120겹 페이스트리 노하우와 엄선된 원두의 스페셜티 커피를 통해 고객님들께 행복한 미식 경험을 전합니다.
            </p>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/landing-v6/menu" className="hover:text-amber-500 transition-colors">
                  120메뉴
                </Link>
              </li>
              <li>
                <Link href="/landing-v6/stores" className="hover:text-amber-500 transition-colors">
                  가맹점 현황
                </Link>
              </li>
              <li>
                <Link href="/landing-v6/costs" className="hover:text-amber-500 transition-colors">
                  비용안내
                </Link>
              </li>
              <li>
                <Link href="/landing-v6/franchise" className="hover:text-amber-500 transition-colors">
                  창업 안내
                </Link>
              </li>
              <li>
                <Link href="/landing-v6/faq" className="hover:text-amber-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Info */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Information</h4>
            <div className="space-y-2 text-xs leading-relaxed font-medium">
              <p>(주)고우웰라이프 | 대표 : 이사근</p>
              <p>사업자번호: 787-88-00444</p>
              <p>주소: 경기 군포시 엘에스로 143 1층 1001호</p>
              <p>E-mail: 120piecoffee@gmail.com | Tel: 1566-3594</p>
              <p>개인정보보호책임자: 이사근</p>
            </div>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="pt-8 mt-12 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[10px] text-neutral-600">
          <p>&copy; {new Date().getFullYear()} GOWELL-LIFE Co.,Ltd. All Rights Reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button onClick={() => openPolicyModal("privacy")} className="hover:text-neutral-400 font-bold">
              개인정보처리방침
            </button>
            <span className="text-neutral-800">|</span>
            <button onClick={() => openPolicyModal("terms")} className="hover:text-neutral-400">
              이용약관
            </button>
            <span className="text-neutral-800">|</span>
            <button onClick={() => openPolicyModal("refund")} className="hover:text-neutral-400">
              환불정책
            </button>
            <span className="text-neutral-800">|</span>
            <Link href="/admin" className="hover:text-neutral-400">
              본사어드민
            </Link>
          </div>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm policy-modal-fade select-none">
          <div className="bg-white border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto flex flex-col max-h-[85vh] policy-modal-scale">
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-neutral-800">
                {getModalTitle()}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-all cursor-pointer border-0 bg-transparent"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium whitespace-pre-wrap max-h-[60vh] text-left">
              {getModalContent()}
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-0"
              >
                확인
              </button>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes policyFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes policyScaleUp {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .policy-modal-fade {
              animation: policyFadeIn 0.2s ease-out forwards;
            }
            .policy-modal-scale {
              animation: policyScaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          `}} />
        </div>
      )}
    </footer>
  );
}
