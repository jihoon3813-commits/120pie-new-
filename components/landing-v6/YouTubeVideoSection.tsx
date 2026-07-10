"use client";

import { useState, useEffect, useRef } from "react";

export default function YouTubeVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const containerId = "youtube-bg-player";

  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current) return;
      
      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      playerRef.current = new YT.Player(containerId, {
        width: "100%",
        height: "100%",
        videoId: "9tTSo_q21qk",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            }
            if (event.data === YT.PlayerState.ENDED) {
              event.target.seekTo(0);
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (!(window as any).YT) {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <section className="relative w-full h-[50vh] sm:h-[65vh] lg:h-[80vh] overflow-hidden bg-black z-0 border-none">
      {/* Top Wavy transition from RollingBanner (Blue #0F3587) */}
      {/* The path is inverted (L 1200 0 L 0 0 Z) so the top half is solid blue and the bottom half is transparent, letting the video show through the curve naturally */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20 translate-y-[-1px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-[#0F3587]">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 0 L 0 0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Top and Bottom soft shading overlays to blend smoothly with adjacent sections */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white/15 to-transparent dark:from-neutral-950/25 pointer-events-none z-10" />

      {/* Video Container cropped to cover the full width/height (16:9 ratio preservation) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-black">
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isPlaying ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77vh] min-w-full h-[56.25vw] min-h-full">
            <div id={containerId} className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Subtle brand watermark or overlay in the corner for premium feel (Optional) */}
      <div className="absolute bottom-16 right-6 z-10 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hidden sm:block">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 font-mono">
          120PIE & COFFEE
        </span>
      </div>

      {/* Bottom Wavy transition boundary to PieBrandConcept (Matching white background) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-white dark:text-neutral-950">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
