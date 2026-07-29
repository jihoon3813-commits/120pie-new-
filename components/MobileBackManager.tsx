"use client";

import { useEffect } from "react";

type CloseCallback = () => void;

interface ModalItem {
  id: string;
  onClose: CloseCallback;
}

// Global stack to manage active modals and popups
const modalStack: ModalItem[] = [];

export function registerModalBackHandler(id: string, onClose: CloseCallback) {
  if (typeof window === "undefined") return;

  // Prevent duplicate registration for same ID
  const existingIndex = modalStack.findIndex((m) => m.id === id);
  if (existingIndex !== -1) {
    modalStack[existingIndex] = { id, onClose };
  } else {
    modalStack.push({ id, onClose });
    try {
      window.history.pushState({ isModal: true, modalId: id }, "", window.location.href);
    } catch (e) {}
  }
}

export function unregisterModalBackHandler(id: string) {
  if (typeof window === "undefined") return;

  const idx = modalStack.findIndex((m) => m.id === id);
  if (idx !== -1) {
    modalStack.splice(idx, 1);
    if (window.history.state?.modalId === id) {
      try {
        window.history.back();
      } catch (e) {}
    }
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
      if (isOpen) {
        unregisterModalBackHandler(id);
      }
    };
  }, [isOpen, id, onClose]);
}

export default function MobileBackManager() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Push initial page guard state when entering site to intercept back-exit
    if (!window.history.state?.pageGuard) {
      try {
        window.history.pushState({ pageGuard: true }, "", window.location.href);
      } catch (e) {}
    }

    const handlePopState = (event: PopStateEvent) => {
      // 1. If any modal/popup/drawer is open, close the top modal
      if (modalStack.length > 0) {
        const topModal = modalStack.pop();
        if (topModal) {
          topModal.onClose();
        }
        return;
      }

      // 2. If no modal is open, check if user is on mobile attempting to exit
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;

      if (isMobile) {
        const confirmExit = window.confirm("사이트를 종료하시겠습니까?");
        if (!confirmExit) {
          // User clicked 'Cancel': restore history guard so user stays on site
          try {
            window.history.pushState({ pageGuard: true }, "", window.location.href);
          } catch (e) {}
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null;
}
