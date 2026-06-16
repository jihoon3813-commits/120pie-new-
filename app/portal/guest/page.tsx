"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GuestLoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("120_owner_logged_in", "true");
      localStorage.setItem("120_active_store_id", "owner"); // Default guest/test store is "owner" (강남역삼점)
      
      // Redirect to portal home
      router.replace("/portal");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#fff9fb] flex flex-col items-center justify-center font-sans select-none">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        {/* Loading Spinner */}
        <div className="w-12 h-12 border-4 border-[#f25f8a] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-black text-[#735965]">테스트 계정으로 자동 로그인 중입니다...</p>
      </div>
    </div>
  );
}
