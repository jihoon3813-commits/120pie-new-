"use client";

import React, { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

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
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitTitle, setExitTitle] = useState("사이트를 종료하시겠습니까?");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const pushGuard = () => {
      try {
        window.history.pushState({ isGuardState: true }, "", window.location.href);
      } catch (e) {}
    };

    pushGuard();

    const handlePopState = () => {
      // 1. If any modal is registered in modalStack, close top modal and DO NOT show exit modal
      if (modalStack.length > 0) {
        const topModal = modalStack.pop();
        if (topModal) {
          topModal.onClose();
        }
        pushGuard();
        return;
      }

      // 2. No modal open -> Determine exit modal message
      const pathname = window.location.pathname;
      const isAdminPage = pathname.startsWith("/portal") || pathname.startsWith("/admin");

      if (isAdminPage) {
        setExitTitle("어드민(관리자/점주) 사이트를 종료하시겠습니까?");
      } else {
        setExitTitle("120PIE 홈페이지를 종료하시겠습니까?");
      }

      setShowExitModal(true);
      pushGuard();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (window.history.length > 2) {
      window.history.go(-2);
    } else {
      window.close();
    }
  };

  if (!showExitModal) return null;

  return (
    <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-sans select-none">
      <div className="bg-neutral-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-[#FBC400] to-amber-500" />

        {/* Emblem */}
        <div className="w-14 h-14 bg-amber-500/10 text-[#FBC400] rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30 shadow-lg">
          <ShieldAlert className="w-7 h-7 text-[#FBC400]" />
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-black text-white mb-2 tracking-tight">
          {exitTitle}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 font-medium">
          확인을 누르시면 사이트가 종료되며 이전 페이지로 이동합니다. 계속 이용하시겠습니까?
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleCancelExit}
            className="py-3 px-4 bg-neutral-850 hover:bg-neutral-800 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all cursor-pointer border border-neutral-700 active:scale-95"
          >
            계속 이용 (취소)
          </button>
          <button
            type="button"
            onClick={handleConfirmExit}
            className="py-3 px-4 bg-[#FBC400] hover:bg-amber-400 text-neutral-950 font-black text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md border-0 active:scale-95"
          >
            사이트 종료 (확인)
          </button>
        </div>
      </div>
    </div>
  );
}
