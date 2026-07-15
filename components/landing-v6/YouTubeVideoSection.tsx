"use client";

import { useEffect, useRef } from "react";

export default function YouTubeVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay prevented:", error);
        });
      }
    }
  }, []);

  return (
    <section className="relative w-full h-[50vh] sm:h-[65vh] lg:h-[80vh] overflow-hidden bg-black z-0 border-none">
      {/* Top Wavy transition from RollingBanner (Blue #0F3587) */}
      {/* The path is inverted (L 1200 0 L 0 0 Z) so the top half is solid blue and the bottom half is transparent, letting the video show through the curve naturally */}


      {/* Top and Bottom soft shading overlays to blend smoothly with adjacent sections */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white/15 to-transparent dark:from-neutral-950/25 pointer-events-none z-10" />

      {/* Video Container cropped to cover the full width/height (16:9 ratio preservation) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-black">
        <video
          ref={videoRef}
          src="https://res.cloudinary.com/dfarfqx7e/video/upload/f_auto,q_auto/v1781183434/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%A1%9C%EC%A0%9C_%EC%96%91%EC%86%A1%EC%9D%B4_%EC%88%98%EC%A0%952_gw0tvv.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77vh] min-w-full h-[56.25vw] min-h-full object-cover"
        />
      </div>

      {/* Subtle brand watermark or overlay in the corner for premium feel (Optional) */}
      <div className="absolute bottom-16 right-6 z-10 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hidden sm:block">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 font-mono">
          120PIE & COFFEE
        </span>
      </div>


    </section>
  );
}
