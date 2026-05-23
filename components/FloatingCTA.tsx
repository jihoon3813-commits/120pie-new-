"use client";

const go = (target: string) => document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });

export default function FloatingCTA() {
  return (
    <>
      <div className="floating-cta desktop-floating">
        <button onClick={() => go("#consultation")}>내 매장 도입 상담</button>
        <button onClick={() => go("#expo")}>박람회 시식 예약</button>
      </div>
      <div className="mobile-bottom-cta">
        <button onClick={() => go("#consultation")}>상담 신청</button>
        <button onClick={() => go("#expo")}>시식 예약</button>
      </div>
    </>
  );
}
