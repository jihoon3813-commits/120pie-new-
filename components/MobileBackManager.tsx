"use client";

import React, { useEffect, useState } from "react";
import { LogOut, DoorOpen, HelpCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

type CloseCallback = () => void;

interface ModalItem {
  id: string;
  onClose: CloseCallback;
}

// Global modal stack
const modalStack: ModalItem[] = [];

export function registerModalBackHandler(id: string, onClose: CloseCallback) {
  if (typeof window === "undefined") return;

  const existingIdx = modalStack.findIndex((m) => m.id === id);
  if (existingIdx !== -1) {
    modalStack[existingIdx] = { id, onClose };
  } else {
    modalStack.push({ id, onClose });
  }
}

export function unregisterModalBackHandler(id: string) {
  if (typeof window === "undefined") return;
  const idx = modalStack.findIndex((m) => m.id === id);
  if (idx !== -1) {
    modalStack.splice(idx, 1);
  }
}

export function useModalBackHandler(id: string, isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (isOpen) {
      registerModalBackHandler(id, onClose);
    } else {
      unregisterModalBackHandler(id);
    }
    return () => {
      unregisterModalBackHandler(id);
    };
  }, [isOpen, id, onClose]);
}

export default function MobileBackManager() {
  const router = useRouter();
  const pathname = usePathname();
  const [showExitChoiceModal, setShowExitChoiceModal] = useState(false);
  const [pageLocationName, setPageLocationName] = useState("120PIE 홈페이지");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Do NOT push trap state on the Gate Page (`/`) itself so user can navigate back out of site normally from gate
    if (pathname === "/") return;

    // Trap history on current page entry
    const trapHistory = () => {
      try {
        window.history.pushState({ isBackTrap: true, path: pathname }, "", window.location.href);
      } catch (e) {}
    };

    // Push initial trap state whenever pathname changes!
    trapHistory();

    const handlePopState = () => {
      // Re-push trap state IMMEDIATELY to prevent browser from navigating away or flickering
      trapHistory();

      // 1. If any modal/popup is open in modalStack, close top modal ONLY
      if (modalStack.length > 0) {
        const topModal = modalStack.pop();
        if (topModal) {
          topModal.onClose();
        }
        return;
      }

      // 2. Determine current location name for custom exit modal
      const currentPath = window.location.pathname;
      if (currentPath.startsWith("/brand")) {
        setPageLocationName("120PIE 브랜드 홈페이지");
      } else if (currentPath.startsWith("/portal") || currentPath.startsWith("/admin")) {
        setPageLocationName("120PIE 점주/본사 어드민");
      } else {
        setPageLocationName("120PIE 창업 홈페이지");
      }

      // 3. Open custom Exit/Navigation Choice Modal
      setShowExitChoiceModal(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [pathname]);

  const handleGoToGate = () => {
    setShowExitChoiceModal(false);
    router.push("/");
  };

  const handleExitSite = () => {
    setShowExitChoiceModal(false);
    if (window.history.length > 2) {
      window.history.go(-2);
    } else {
      window.close();
    }
  };

  const handleStayOnPage = () => {
    setShowExitChoiceModal(false);
  };

  if (!showExitChoiceModal) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-sans select-none">
      <div className="bg-neutral-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative overflow-hidden text-white">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#FBC400] to-amber-500" />

        {/* Emblem */}
        <div className="w-14 h-14 bg-amber-500/15 text-[#FBC400] rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-lg">
          <HelpCircle className="w-7 h-7 text-[#FBC400]" />
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">
          이동 위치를 선택해 주세요
        </h3>

        {/* Description */}
        <p className="text-xs text-neutral-300 leading-relaxed mb-6 font-medium">
          <strong className="text-[#FBC400] font-bold">{pageLocationName}</strong>에서 이동을 요청하셨습니다.
        </p>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* 1. Primary Option: Go to Gate Page */}
          <button
            type="button"
            onClick={handleGoToGate}
            className="w-full py-3.5 px-4 bg-[#FBC400] hover:bg-amber-400 text-neutral-950 font-black text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-[#FBC400]/20 flex items-center justify-center gap-2 border-0 active:scale-95"
          >
            <DoorOpen size={18} className="text-neutral-950" />
            <span>게이트 메인 화면으로 이동</span>
          </button>

          {/* 2. Secondary Option: Exit Site */}
          <button
            type="button"
            onClick={handleExitSite}
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-850 text-rose-400 hover:text-rose-300 font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer border border-neutral-800 flex items-center justify-center gap-2 active:scale-95"
          >
            <LogOut size={16} />
            <span>사이트 완전히 종료하기</span>
          </button>

          {/* 3. Cancel Option: Stay on Page */}
          <button
            type="button"
            onClick={handleStayOnPage}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-neutral-900 text-neutral-400 hover:text-neutral-200 font-bold text-xs rounded-xl transition-colors cursor-pointer border-0"
          >
            취소 (계속 둘러보기)
          </button>
        </div>
      </div>
    </div>
  );
}
