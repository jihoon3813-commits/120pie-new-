"use client";

import { useState, useEffect } from "react";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";

const CURSOR_IMG_URL = optimizeCloudinaryUrl(
  "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784644440/%EA%B0%9C%EC%B2%B4_amuurg.png"
);

export default function CursorFollower() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [trailPos, setTrailPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let active = true;
    const lerpLoop = () => {
      setTrailPos((prev) => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.35,
          y: prev.y + dy * 0.35,
        };
      });
      if (active) {
        requestAnimationFrame(lerpLoop);
      }
    };
    requestAnimationFrame(lerpLoop);
    return () => {
      active = false;
    };
  }, [mousePos]);

  if (trailPos.x < -500) return null;

  return (
    <div
      className="hidden md:block fixed z-[9999] pointer-events-none"
      style={{
        left: trailPos.x,
        top: trailPos.y,
        transform: "translate(14px, 14px)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CURSOR_IMG_URL}
        alt="Cursor Follower"
        className="w-12 h-12 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.18)] animate-bounce"
        style={{ animationDuration: "2s" }}
      />
    </div>
  );
}
